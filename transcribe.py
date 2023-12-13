import speech_recognition as sr

def transcribe_video(path):
    try:
        recognizer = sr.Recognizer()

        with sr.AudioFile(path) as source:
            audio = recognizer.record(source)

        transcript = recognizer.recognize_google(audio, language="en-US")
        print("Transcript: {}".format(transcript))
        return transcript

    except sr.UnknownValueError:
        # Handle the case when speech cannot be transcribed
        print("Unable to transcribe the speech. The audio may be too noisy or contain unintelligible speech.")
        return None

    except sr.RequestError as e:
        # Handle API request errors
        print(f"Error while making the API request: {e}")
        return None

    except Exception as e:
        # Handle other unexpected errors
        print(f"An unexpected error occurred: {e}")
        return None
