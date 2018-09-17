#!/usr/bin/env bash
## Creates a file with a list of ready to use domains from the main list.
outputFile="./resources/domains.txt"

## Remove previous version of the file
rm $outputFile

while read -r line
do
   url=`echo $line | cut -d' ' -f2 | cut -d'\' -f1`
   echo "https://www.${url}" >> $outputFile
done < "./resources/top1M_UsDomains.txt"
