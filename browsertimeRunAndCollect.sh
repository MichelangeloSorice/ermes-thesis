#!/usr/bin/env bash

urlNumber=$1

dockerOptions=(
## Amount of memory shared by container process
'--shm-size=1g'
## Automatically clean up the container and remove the file system when the container exits
'--rm'
## Overriding default script
)

## More options available at https://www.sitespeed.io/documentation/browsertime/configuration/#the-options
browsertimeOptions=(
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

urlArray=()

## Creates a file with a list of ready to use domains from the main 1 million domains list.
## The number of urls collected is provided as parameter from command line
function prepareUrlArray {
    index="0"
    while read -r line
    do
        urlArray[${index}]="${line}"
        index=$[$index+1]
        if [ ${index} -eq ${urlNumber} ]
        then break
        fi
    done < "./resources/domains.txt"

}


function runBrowserTime(){
    index="0"
    mkdir -m 777 results

    echo "DOCKER_OPTIONS: ${dockerOptions[@]} -v "$(pwd)":/browsertime"
    echo "BROWSERTIME_OPTIONS: ${browsertimeOptions[@]}"
    echo ""
    echo " +++++++ Looping over urls +++++++ "
    while [ ${index} -lt ${urlNumber} ];
    do
        runId=$(printf %05d $index)
        echo "Running iteration ${index} - Testing  ${urlArray[$index]}, Output to /results/output_${runId}"
        ##echo "docker run ${dockerOptions[@]} -v $(pwd):/browsertime sitespeedio/browsertime ${urlArray[$index]} ${browsertimeOptions[@]} --resultDir=./results/output_${runId}"
        docker run "${dockerOptions[@]}" -v "$(pwd)":/browsertime sitespeedio/browsertime  "${urlArray[$index]}" "${browsertimeOptions[@]}" --resultDir=./results/output_${runId}
        index=$[$index+1]
        echo ""
    done
    echo " +++++++ Data collection completed +++++++ "
    echo ""
}


function cleanup(){
    sudo rm -rf results/
    sudo rm log.txt errorLog.txt
}



## MAIN COMPUTATION


cleanup

exec 1> log.txt 2> errorLog.txt

echo "Reading ${urlNumber} urls from main list..."
prepareUrlArray ${urlNumber}

formattedStartDate=`date '+%Y-%m-%d %H:%M:%S'`
echo "Processing started at: ${formattedStartDate}"

runBrowserTime ${dockerOptions[@]} ${browsertimeOptions[@]} ${urlNumber} $urlArray

formattedEndDate=`date '+%Y-%m-%d %H:%M:%S'`
##runTime=(`date +%s -d ${formattedEndDate}` - `date +%s -d ${formattedStartDate}`)

echo "Processing ended at: ${formattedEndDate}"