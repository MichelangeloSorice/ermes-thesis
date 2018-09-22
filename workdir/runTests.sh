#!/usr/bin/env bash

domainFile='./resources/domains.txt'
resultDir='./results'
logDir='./logs'
urlNumber=$1


#function cleanup(){
#    if [ -d $resultDir ]; then
#        sudo rm -rf $resultDir
#    w
#    if [ -d $logDir ]; then
#        sudo rm -rf $logDir
#    fi
#}

##
# MAIN COMPUTATION

if [ ! -d $resultDir ]; then
    mkdir $resultDir
fi

formattedStartDate=`date '+%Y-%m-%d %H:%M:%S'`
echo "Processing started at: ${formattedStartDate}"

## First run with chrome
head -n ${urlNumber} ${domainFile} | xargs -L 1 -P 10 ./runBrowsertime.sh "chrome"

## Second run with firefox
#xargs -L 2 -P 10 -a ./resources/domains.txt ./runBrowsertime.sh "firefox"

formattedEndDate=`date '+%Y-%m-%d %H:%M:%S'`
echo "Processing ended at: ${formattedEndDate}"