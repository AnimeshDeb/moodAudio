# moodVid

Goal:
To make a website that allows users to make AI motivational  videos for youtube, integrating emotional/authentic voices, background music, and professional scripts.

Status 8/6/2025:
-  Working on processing combined music+voiceover audio with visuals
- Bug with ffmpeg static fixed. Before we didn't indicate when streams would be done to ffmpeg, which stopped the audio processing. Now the combined audio is successfully created.
- Bug discovered: Voiceover voices previous script, not the current one that's generated.



TODO:
- Solve bug: voiceover voices previously generated script, not the current one thats generated. 
- Code review (Refactor certain code to make it look neater if need be)
- Get images from pixabay for the video
    - Break script into chunks
    - get image from keywords for each chunk
    - combine audio with each image using ffmpeg
- Security measures tbd: honeypot, recaptcha
