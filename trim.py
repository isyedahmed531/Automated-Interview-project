from moviepy.editor import VideoFileClip
import os

def read_timestamps_from_file(file_path):
    with open(file_path, 'r') as file:
        timestamps = [int(line.strip()) for line in file]
    return timestamps

def trim_video_and_extract_audio(video_path, timestamps, output_folder):
    # Check if the output folder exists, if not create it
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Load the video clip
    video_clip = VideoFileClip(video_path)

    # Ensure the last timestamp includes the full duration of the video
    timestamps.append(video_clip.duration)

    # Loop through the timestamps and trim the video accordingly
    for idx in range(len(timestamps) - 1):
        start_time = timestamps[idx]
        end_time = timestamps[idx + 1]

        # Trim the video
        trimmed_video = video_clip.subclip(start_time, end_time)

        # Create the output file paths for video and audio
        video_output_path = os.path.join(output_folder, f"trimmed_part_{idx + 1}.mp4")
        audio_output_path = os.path.join(output_folder, f"audio_part_{idx + 1}.wav")

        # Save the trimmed video
        trimmed_video.write_videofile(video_output_path, codec="libx264", audio_codec="aac")

        # Extract and save the audio if the video has audio
        if trimmed_video.audio is not None:
            trimmed_video.audio.write_audiofile(audio_output_path)

        # Close the video and audio objects to release resources
        trimmed_video.reader.close()
        # if trimmed_video.audio:
            # trimmed_video.audio.reader.close()

    # Close the original video file
    video_clip.reader.close()

# Example usage:
# if __name__ == "__main__":
#     video_file = "merged_output.mp4"
#     timestamps_file = "seconds_array.txt"
#     output_folder = "output_folder"

#     # Read timestamps from the file
#     timestamps = read_timestamps_from_file(timestamps_file)

#     # Trim the video and extract audio using the timestamps
#     trim_video_and_extract_audio(video_file, timestamps, output_folder)
