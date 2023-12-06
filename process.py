import os
from moviepy.editor import VideoFileClip
import transcribe  # Assuming you have your transcribe module defined
import semantic  # Assuming you have your semantic module defined
# from emotion_detection import get_emotions
from emotion_analysis import get_emotions


def process_files(correct_answers):
    output_folder = 'output_folder'
    # video_files = [file for file in os.listdir(output_folder) if file.startswith('trimmed_part')]
    audio_files = [file for file in os.listdir(output_folder) if file.startswith('audio_part')]

    # correct_answers = [
    #     "white color",
    #     "dream destination northern areas",
    #     "anything",
    #     "I don't want superpower",
    #     "favorite book"
    # ]

    result = []


    emotions = get_emotions("output.mp4")

    # Process video files
    for audio_file, correct_ans in zip(audio_files, correct_answers):

        answer = {}

        # Process audio transcript and semantic similarity
        audio_path = os.path.join(output_folder, audio_file)
        transcript = transcribe.transcribe_video(audio_path)
        if transcript is None:
            transcript = ""

        answer["TranscribedAnswer"] =transcript

        sentence_embedding_function = semantic.load_word_embeddings()
        similarity_percentage = semantic.calculate_semantic_similarity(transcript, correct_ans, sentence_embedding_function)

        #ans_result = f"Answer for Q{question_count} is correct: {str(answer)}"
        answer["AnswerCorrectness"] = f"{similarity_percentage:.2f}%"
        # if ans_result is None:
        #     ans_result = ""

        result.append(answer)

    # with open("result.txt", "w") as file:
    #     file.write(result)

    # return result

    return emotions, result







