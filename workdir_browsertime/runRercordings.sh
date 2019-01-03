# Params <url> <nRecords> <outFolderName> <profileDir>

#!/usr/bin/env bash
outputDir="$(pwd)/resources/webPageReplay/$3"
resultsDir="$outputDir/results"
recordsDir="$outputDir/records"


if [ ! -d $outputDir ]; then
    mkdir -p $outputDir
    mkdir $resultsDir
    mkdir $recordsDir
fi

echo "Recording ${2} times"

docker run  --cap-add=NET_ADMIN --shm-size=1g \
            -e RECORD=${2} -e LATENCY=100 \
            -v ${recordsDir}:/tmp/recordsFolder -v ${resultsDir}:/browsertime \
            wpr_recorder:latest $1 -n 1 --screenshot --video=false --visualMetrics=false \
            --chrome.args=--profile-directory="${4}" \
            --chrome.args=--user-data-dir="/config/google-chrome"