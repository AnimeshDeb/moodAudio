# moodVid

Goal:
To make a website that allows users to make AI motivational  videos for youtube, integrating emotional/authentic voices, background music, and professional scripts.

Status 7/20/2025:
- Implemented ffmpeg to combine generated voiceover with background music. 
- Implemented file path security when using ffmpeg


TODO:
- Code review (Refactor certain code to make it look neater if need be)
- Implement dynamic music path for each preset music track.
- Get images from pixabay for the video
    - Break script into chunks
    - get image from keywords for each chunk
    - combine audio with each image using ffmpeg
- Security measures tbd: honeypot, recaptcha
