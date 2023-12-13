from moviepy.editor import VideoFileClip, AudioFileClip, CompositeVideoClip


def merge_video_and_audio(video_path, audio_path, output_path):
    # Load video and audio files
    video_clip = VideoFileClip(video_path)
    audio_clip = AudioFileClip(audio_path)

    # Set video duration to match audio duration (in case they differ)
    video_clip = video_clip.set_duration(audio_clip.duration)

    # Set video's audio to None, effectively removing the sound
    video_clip = video_clip.set_audio(None)

    # Merge the video and audio
    final_clip = CompositeVideoClip([video_clip.set_audio(audio_clip)])

    # Write the final result to a new video file
    final_clip.write_videofile(output_path, codec="libx264", audio_codec="aac")

    # Close the video and audio clips
    final_clip.close()
    video_clip.close()
    audio_clip.close()


# # Example usage
# video_path = 'output.mp4'
# audio_path = 'output.wav'
# output_path = 'merged_output.mp4'

# merge_video_and_audio(video_path, audio_path, output_path)
