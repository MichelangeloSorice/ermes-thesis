#!/usr/bin/env bash
# Base Browsertime image containing all custom modifications performed so far
docker build -t browsertime_custom_base -f ./dockerfiles/BrowsertimeWithCommonMods

# Browsertime containers with overrided index file to run custom chrome profiles
docker build -t browsertime_profile1 -f ./dockerfiles/DockerfileP1 .
docker build -t browsertime_profile2 -f ./dockerfiles/DockerfileP2 .
docker build -t browsertime_profile3 -f ./dockerfiles/DockerfileP3 .
docker build -t browsertime_profile4 -f ./dockerfiles/DockerfileP4 .

# Browsertime image used to record and store in an archive
docker build -t wpr_recorder -f ./dockerfiles/wprRecorder .