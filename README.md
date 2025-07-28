# moodVid

Goal:
To make a website that allows users to make AI motivational  videos for youtube, integrating emotional/authentic voices, background music, and professional scripts.

Status 7/28/2025:
- All music tracks are added to redis.
- All voice+music process occurs in stdin 



TODO:
- Try using an alternative voice generator for now because of api limit with elevenlabs
- Code review (Refactor certain code to make it look neater if need be)
- Implement dynamic music path for each preset music track.
- Get images from pixabay for the video
    - Break script into chunks
    - get image from keywords for each chunk
    - combine audio with each image using ffmpeg
- Security measures tbd: honeypot, recaptcha
