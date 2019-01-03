#!/usr/bin/env bash
# Base Browsertime image containing all custom modifications performed so far
docker build -t browsertime_custom_base -f ./dockerfiles/BrowsertimeWithCommonMods .

# Browsertime containers with overrided script to extract frames from videos
docker build -t browsertime_frame_extraction -f ./dockerfiles/videoFrameExtraction .

# Browsertime image used to record and store in an archive
docker build -t wpr_recorder -f ./dockerfiles/wprRecorder .