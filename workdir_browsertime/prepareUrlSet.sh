#!/usr/bin/env bash
## Creates a file with a list of ready to use domains from the main list.
outputFile="./resources/domains.txt"
hidden="Hidden"

## Remove previous version of the file
rm $outputFile

index="0"
while read -r line;
do
   url=`echo $line | cut -d' ' -f2 | cut -d'\' -f1`
   if [ ${url} == ${hidden} ]; then
    continue
   else
    echo "https://www.${url}" >> $outputFile
    index=$[$index+1]
   fi
#   if [ ${index} -eq ${urlNumber} ]; then
#   break
#   fi
done < "./resources/top1M_UsDomains.txt"
