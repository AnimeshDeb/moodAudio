# moodVid

Goal:
To make a website that allows users to make AI motivational  videos for youtube, integrating emotional/authentic voices, background music, and professional scripts.

Status 7/17/2025:
- Refactored displaying of script. 
- Implemented sentiment analysis of script for ai background music.

TODO:
- Implement audio implementation (voiceover of script and background music)
    - Generate voiceover from elevenlabs
    - Preload background music set (if AI_music isn't chosen)
    - call music api if (AI_music is chosen)
    - Combine voiceover with background music
- Security measures tbd: honeypot, recaptcha
