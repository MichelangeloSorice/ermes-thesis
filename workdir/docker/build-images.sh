#!/usr/bin/env bash
docker build -t browsertime_profile1 -f ./dockerfiles/DockerfileP1 .

docker build -t browsertime_profile2 -f ./dockerfiles/DockerfileP2 .

docker build -t browsertime_profile3 -f ./dockerfiles/DockerfileP3 .

docker build -t browsertime_profile4 -f ./dockerfiles/DockerfileP4 .