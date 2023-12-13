from flask import (
    Flask,
    jsonify,
    render_template,
    send_from_directory,
    Response,
    request,
)
import os
import cv2
import pyaudio
import wave
import threading
from merge import merge_video_and_audio
from trim import read_timestamps_from_file, trim_video_and_extract_audio
from process import process_files

import warnings


warnings.filterwarnings(
    "ignore", category=UserWarning, module="multiprocessing.resource_tracker"
)


app = Flask(__name__)
cap = None


# Global variables for recording state and saving the output file
is_recording = False
output_file = "output.mp4"  # The filename for the recorded video in MP4 format

# OpenCV setup for video recording
frame_width, frame_height = 640, 480
video_writer = cv2.VideoWriter()

# PyAudio setup for audio recording
audio_frames = []
audio_channels = 1
audio_rate = 44100
audio_chunk_size = 1024

# Open the camera
cap = None


def start_video_recording():
    global is_recording, video_writer, cap

    # Open the camera (if not already opened)
    if cap is None:
        cap = cv2.VideoCapture(0)
        cap.set(cv2.CAP_PROP_FRAME_WIDTH, frame_width)
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, frame_height)

    # Define the codec and create VideoWriter object
    codec = cv2.VideoWriter_fourcc(
        *"mp4v"
    )  # Use 'mp4v' for MP4 format with H.264 codec
    video_writer = cv2.VideoWriter(
        output_file, codec, 20.0, (frame_width, frame_height)
    )

    # Start video recording loop
    while is_recording:
        ret, frame = cap.read()
        if ret:
            video_writer.write(frame)

    # Release the camera and video writer
    cap.release()
    video_writer.release()


# ... (other functions remain the same)


def start_audio_recording():
    global is_recording, audio_frames

    audio = pyaudio.PyAudio()
    stream = audio.open(
        format=pyaudio.paInt16,
        channels=audio_channels,
        rate=audio_rate,
        input=True,
        frames_per_buffer=audio_chunk_size,
    )

    # Start audio recording loop
    while is_recording:
        audio_frames.append(stream.read(audio_chunk_size))

    # Stop and close the audio stream
    stream.stop_stream()
    stream.close()
    audio.terminate()


def save_recordings():
    global audio_frames, output_file

    # Save audio recording to a WAV file
    wf = wave.open(output_file.replace(".mp4", ".wav"), "wb")
    wf.setnchannels(audio_channels)
    wf.setsampwidth(pyaudio.get_sample_size(pyaudio.paInt16))
    wf.setframerate(audio_rate)
    wf.writeframes(b"".join(audio_frames))
    wf.close()

    # Clear audio frames for future recordings
    audio_frames = []


@app.route("/")
def index():
    return render_template(
        "index.html"
    )  # Create an HTML template with buttons to start and stop recording


@app.route("/video_page")
def changePage():
    interview_code = request.args.get("interviewCode")
    candidate_email = request.args.get("candidateEmail")

    print("interview_code:", interview_code, ", ", "candidate_email:", candidate_email)
    return render_template(
        "video.html", interview_code=interview_code, candidate_email=candidate_email
    )


@app.route("/interview_details")
def interviewPage():
    return render_template(
        "interview_details.html"
    )  # Create an HTML template with buttons to start and stop recording


@app.route("/start_recording")
def start_recording():
    global is_recording

    if not is_recording:
        is_recording = True
        video_thread = threading.Thread(target=start_video_recording)
        audio_thread = threading.Thread(target=start_audio_recording)

        video_thread.start()
        audio_thread.start()

    return "Recording started."


@app.route("/stop_recording")
def stop_recording():
    global is_recording

    if is_recording:
        is_recording = False
        save_recordings()
    return "Recording stopped and saved."


@app.route("/save_seconds_array", methods=["POST"])
def save_seconds_array():
    data = request.get_json()
    if data and isinstance(data, list):
        # Perform the necessary actions with the secondsArray data
        # For example, you can save the data to a file or a database here
        print(data)  # This will print the secondsArray received from the frontend

        # Save the data to a text file
        with open("seconds_array.txt", "w") as file:
            for item in data:
                file.write(str(item) + "\n")

        return jsonify({"message": "Data received and saved successfully!"}), 200
    else:
        return jsonify({"error": "Invalid data format"}), 400


answers = []


@app.route("/save-answers", methods=["POST"])
def save_answers():
    global answers
    data = request.get_json()
    answers = data.get("answers", [])
    response_data = {"message": "Answers received and saved successfully"}
    print(answers)
    return jsonify(response_data)


@app.route("/analyze_results")
def analyze_results():
    video_path = output_file
    audio_path = output_file.replace(".mp4", ".wav")
    merged_output = "merged_output.mp4"

    ## merging audio and video in one file
    merge_video_and_audio(video_path, audio_path, merged_output)

    ## trimming audio and video
    timestamps_file = "seconds_array.txt"
    output_folder = "output_folder"

    # Read timestamps from the file
    timestamps = read_timestamps_from_file(timestamps_file)

    # Trim the video and extract audio using the timestamps
    trim_video_and_extract_audio(merged_output, timestamps, output_folder)

    ## process
    correct_answers = answers
    print("correct_answers", correct_answers)
    emotions, answers_result = process_files(correct_answers)
    all_result = {}
    all_result.update({"emotion": emotions, "answers_result": answers_result})
    print("ans results: ", answers_result)
    print("ans results: ", emotions)
    print(all_result)

    if request.headers.get("X-Requested-With") == "XMLHttpRequest":
        return jsonify(all_result)
    else:
        # If not an AJAX request, render the index.html template with the result
        # return render_template('results.html', result=result)
        return jsonify(all_result)


@app.route("/video_frame")
def video():
    return Response(genFrames(), mimetype="multipart/x-mixed-replace; boundary=frame")


# Route to render the index.html file
@app.route("/")
def render_index():
    return render_template("index.html")


# Route to serve specific HTML files dynamically
@app.route("/<page_name>")
def serve_page(page_name):
    return render_template(f"{page_name}")


# Route to serve static files (CSS, JS, images, etc.)
@app.route("/static/<path:filename>")
def serve_static(filename):
    root_dir = os.path.dirname(os.getcwd())
    return send_from_directory(os.path.join(root_dir, "your_static_folder"), filename)


def genFrames():
    global cap
    if cap is None:
        # Open the camera if not already opened
        cap = cv2.VideoCapture(0)
        cap.set(cv2.CAP_PROP_FRAME_WIDTH, frame_width)
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, frame_height)
    # Add a delay to allow the camera to warm up
    import time

    time.sleep(2)
    while True:
        success, frame = cap.read()
        if success:
            try:
                ret, buffer = cv2.imencode(".jpg", cv2.flip(frame, 1))
                frame = buffer.tobytes()
                yield (
                    b"--frame\r\n" b"Content-Type: image/jpeg\r\n\r\n" + frame + b"\r\n"
                )
            except Exception as e:
                pass
        else:
            pass


if __name__ == "__main__":
    app.run(debug=True)
