#!/usr/bin/env bash
# Preparing a fresh copy of profiles
rm -rf /tmp/shopping
rm -rf /tmp/movie
rm -rf /tmp/sport
rm -rf /tmp/food_drink
rm -rf /tmp/beauty_fitness

cp -R /home/michelangelo/IdeaProjects/ermes-thesis/resources/chrome-targeted-profiles-backup/* /tmp

#head -n 5 ./profileDirs | xargs -L 1 -P 5 ./runTargetedProfilesTests.sh https://www.androidworld.it 20
#head -n 5 ./profileDirs | xargs -L 1 -P 5 ./runTargetedProfilesTests.sh https://www.virginradio.it 20
#head -n 5 ./profileDirs | xargs -L 1 -P 5 ./runTargetedProfilesTests.sh https://www.hwupgrade.it 20
#head -n 5 ./profileDirs | xargs -L 1 -P 5 ./runTargetedProfilesTests.sh https://www.aranzulla.it 20
head -n 5 ./profileDirs | xargs -L 1 -P 5 ./runTargetedProfilesTests.sh https://www.repubblica.it 20
