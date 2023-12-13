import cv2
from deepface import DeepFace
    

def get_emotions(video_path):
    camera = cv2.VideoCapture(video_path)
    # Check if the video is opened correctly
    if not camera.isOpened():
        raise IOError("Cannot open video")

    # Initialize emotion counters
    angry = 0
    disgust = 0
    fear = 0
    nervous = 0
    smile = 0
    neutral = 0
    total = 0

    positive = 0
    negative = 0

    while True:
        # Read the next frame from the video
        success, frame = camera.read()
        if not success:
            break

        result = DeepFace.analyze(frame, actions=["emotion"], enforce_detection=False)
        emotion = result[0]["dominant_emotion"]

        if emotion == "angry":
            angry += 1
        elif emotion == "disgust":
            disgust += 1
        elif emotion == "fear":
            fear += 1
        elif emotion == "happy":
            emotion = "smile"
            smile += 1
        elif emotion == "neutral":
            emotion = "neutral"
            neutral += 1
        elif emotion == "sad" or emotion == "surprise":
            emotion = "nervous"
            nervous += 1

        total = angry + fear + disgust + smile + nervous + neutral
        if total == 0:
            total = 1

    positive = (smile) * 100 / total
    negative = (angry + fear + disgust + nervous) * 100 / total

    emotion_data = {
        "Angry": angry * 100 / total,
        "Disgust": disgust * 100 / total,
        "Fear": fear * 100 / total,
        "Smile": smile * 100 / total,
        "Nervous": nervous * 100 / total,
        "Neutral": neutral * 100 / total,
        "Negative": negative,
        "Positive": positive,
    }

    # Convert the dictionary to a JSON string
    # json_output = json.dumps(emotion_data, indent=4)
    # print("type", type(json_output))

    return emotion_data

    # Convert the dictionary to a JSON string
    # json_output = json.dumps(emotion_data, indent=4)

    # # Save the JSON output to a file
    # with open("emotion.json", "w") as json_file:
    #     json_file.write(json_output)

    # print("JSON data saved to emotion.json")
