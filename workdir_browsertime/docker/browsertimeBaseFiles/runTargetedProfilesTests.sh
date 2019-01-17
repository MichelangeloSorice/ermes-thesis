#!/usr/bin/env bash
## Assuming that under tmp we have 5 folders with targeted user data directories
## Parameters <url> <perProfileVisits> <usrDataDir>
profileName=`echo ${3} | cut -d'/' -f3`
domain=`echo ${1} | cut -d'/' -f3 | cut -d'.' -f2`


browsertimeOptions=(
## Chrome is the default Browser
## We are only interested in screenshots
'--screenshot'
## Disabling video stuff
'--video=false'
'--visualMetrics=false'
## Turn this to true to indent json/har files
'--prettyPrint=false'
## Important allows multiple systems to interact with the same cookies as they are stored in plaintext
'--chrome.args=--passoword-store=basic'
)

echo "Running instance for profile ${3} on ${domain}"

./bin/browsertime.js ${1} -n ${2} "${browsertimeOptions[@]}" \
                    --chrome.args=--user-data-dir=${3} \
                    --resultDir="browsertime-results/${domain}_${profileName}"

#Is important to run visits for each profile in parallel to minimize the time width of data collection
#head -n 5 ./profileDirs | xargs -L 1 -P 5 ./runTargetedProfilesTests.sh https://www.repubblica.it 1