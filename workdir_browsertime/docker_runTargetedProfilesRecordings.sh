#!/usr/bin/env bash
## runTargetedProfilesRecordings <url> <recordsPerProfile>
url=$1
perProfileRecords=$2
resultDirBase=`echo $url | cut -d'/' -f3 | cut -d'.' -f2`

## Keep the mapping among chrome targeted profiles directories and their names
profileDirectories=("'Profile 8'" 'Profile 8' 'Profile 11' 'Profile 12' 'Profile 10')
profileNames=('MOVIE' 'SPORTS' 'BEAUTY_AND_FITNESS' 'FOOD_AND_DRINK' 'SHOPPING')


## Passing the index to the runWebPageReplay to markDifferently the archives
profileIndex=0
while [ $profileIndex -lt 1 ]; do
   echo "Collecting records for profile ${profileNames[${profileIndex}]}..."
   resultDir="${resultDirBase}/${profileNames[${profileIndex}]}"
   echo "Results in ${resultDir}..."
   ./runRercordings.sh $url $perProfileRecords $resultDir "${profileDirectories[${profileIndex}]}"
   profileIndex=$(($profileIndex+1))
done
