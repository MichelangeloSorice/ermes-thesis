#!/usr/bin/env bash
domainFile='./resources/domains.txt'
resultDir='./results'
logDir='./logs'

# Number of url to be tested at the same time
urlNumber=$1


#function cleanup(){
#    if [ -d $resultDir ]; then
#        sudo rm -rf $resultDir
#    w
#    if [ -d $logDir ]; then
#        sudo rm -rf $logDir
#    fi
#}


# MAIN COMPUTATION
if [ ! -d $resultDir ]; then
    mkdir $resultDir
fi

exec 1>log.txt 2>errors.txt

formattedStartDate=`date '+%Y-%m-%d %H:%M:%S'`
echo "Processing started at: ${formattedStartDate}"

## First run with chrome
echo ""
echo "++++++++++++++++++++++++++++++++++++++++"
echo "Running tests with Profile1 - Vanilla configuration"
head -n ${urlNumber} ${domainFile} | xargs -L 1 -P 10 ./runBrowsertime.sh  "Profile 1"

echo ""
echo "++++++++++++++++++++++++++++++++++++++++"
echo "Running tests with Profile2 - Light uBlock configuration"
head -n ${urlNumber} ${domainFile} | xargs -L 1 -P 10 ./runBrowsertime.sh "Profile 2"

echo ""
echo "++++++++++++++++++++++++++++++++++++++++"
echo "Running tests with Profile3 - Hard uBlock configuration"
head -n ${urlNumber} ${domainFile} | xargs -L 1 -P 10 ./runBrowsertime.sh "Profile 3"

echo ""
echo "++++++++++++++++++++++++++++++++++++++++"
echo "Running tests with Profile4 - Hard uBlock configuration plus NoScript"
head -n ${urlNumber} ${domainFile} | xargs -L 1 -P 10 ./runBrowsertime.sh "Profile 4"


formattedEndDate=`date '+%Y-%m-%d %H:%M:%S'`
echo ""
echo "++++++++++++++++++++++++++++++++++++++++"
echo "Processing ended at: ${formattedEndDate}"
echo "++++++++++++++++++++++++++++++++++++++++"
echo ""