#!/usr/bin/env bash
# The only needed input it the domain name
index=0
mkdir ./browsertime-results/${1}_allScreens
for screen in ./browsertime-results/${1}_beauty_fitness/screenshots/*.jpg; do
    cp "${screen}" ./browsertime-results/${1}_allScreens/"${index}.jpg"
    index=$(($index+1))
done

for screen in ./browsertime-results/${1}_food_drink/screenshots/*.jpg; do
    cp "${screen}" ./browsertime-results/${1}_allScreens/"${index}.jpg"
    index=$(($index+1))
done

for screen in ./browsertime-results/${1}_movie/screenshots/*.jpg; do
    cp "${screen}" ./browsertime-results/${1}_allScreens/"${index}.jpg"
    index=$(($index+1))
done

for screen in ./browsertime-results/${1}_shopping/screenshots/*.jpg; do
    cp "${screen}" ./browsertime-results/${1}_allScreens/"${index}.jpg"
    index=$(($index+1))
done

for screen in ./browsertime-results/${1}_sport/screenshots/*.jpg; do
    cp "${screen}" ./browsertime-results/${1}_allScreens/"${index}.jpg"
    index=$(($index+1))
done