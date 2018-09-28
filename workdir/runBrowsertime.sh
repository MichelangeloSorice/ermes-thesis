#!/usr/bin/env bash
browser=$1
url=$3
profile=$2
domain=`echo $url | cut -d'/' -f3`

dockerOptions=(
## Amount of memory shared by container process
'--shm-size=1g'
## Automatically clean up the container and remove the file system when the container exits
'--rm'
## Limiting resource usage RAM 8gb CPUS 2
'--memory=8000m'
'--cpus=2'
)

## More options available at https://www.sitespeed.io/documentation/browsertime/configuration/#the-options
browsertimeOptions=(
## Disablig
'--videoParams.addTimer=false'
## Recording video with framerate of 10fps
'--videoParams.framerate=10'
## Ffmpeg param to modify video quality ranges from 0 (max quality) to 51
'--videoParams.crf=26'
## Disabling default filmstrip option as we are going to create scripts in a second moment
'--videoParams.createFilmstrip=false'
## Disabling computation of visual metrics
'--visualMetrics=false'
## Number of test iterations for each url
'--iterations=1'
## Turn this to true to indent json/har files
'--prettyPrint=false'
)

docker run "${dockerOptions[@]}" \
            -e RESULT_DIR=./${browser} \
            -v "$(pwd)"/results/${domain}/${profile}:/browsertime browsertime_${profile}  \
            "${url}" \
            "${browsertimeOptions[@]}" \
            -b ${browser} \
            --resultDir=./${browser}



