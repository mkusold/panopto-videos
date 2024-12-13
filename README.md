# Panopto Video Processor

## Setup

- `brew install ffmpeg`
- Download the Chrome Extension [Live Stream Downloader](https://chromewebstore.google.com/detail/live-stream-downloader/looepbdllpjgdmkpdcdffhdbmpbcfekj)

## Usage

1. Go to the class video page and run the Live Stream Downloader. Either download everything or download specific files (it's kind of hard to tell what's what).
1. Put the resulting .mkv files in the `/input` folder. Organize them by folder so that the combiner has context. Eg. `input/Unit-1`
1. Run `yarn start`
1. Your files should be in the `/output` folder. Note: the audio from the talking videos should be combined with the slideshow audio-less videos into a fully usable file that has the presentation slides and the audio of the teacher.

Note: this functionality may be specific to my teacher/class/video files. I have a limited scope of sample data.