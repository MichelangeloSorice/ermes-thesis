# This script computes a diagonal matrix representing a measure of distance among captures
# This distance is the percentage of pixels changing when comparing 2 images

import sys
from os import listdir
from os.path import isfile, join

import cv2
import numpy as np


def main():
    # The only required input is the working directory which must containt an input
    # folder with a screenshots subdirectory
    workdir = sys.argv[1]

    # Retrieving the set of images
    screenshotInputFolder = workdir + 'input/screenshots/'
    fileNamesList = [join(screenshotInputFolder, f)
                     for f in listdir(screenshotInputFolder) if isfile(join(screenshotInputFolder, f))]
    print(fileNamesList)
    imageList = [cv2.imread(file, cv2.IMREAD_UNCHANGED) for file in fileNamesList]
    if len(imageList) < 2:
        print('There are not enough file in the input folder to perform a meaningful comparison!')
        return 1

    # Setting up results container with some basic informations
    tmpResult = np.zeros((len(imageList), len(imageList)))

    rowIndex = 0
    while len(imageList) > 1:
        testImg = imageList.pop()
        for colIndex, img in enumerate(imageList):
            imageDiff = np.absolute(testImg - img)
            distance = round(np.count_nonzero(imageDiff) / imageDiff.size, 3)
            tmpResult[rowIndex, rowIndex + colIndex + 1] = distance
            tmpResult[rowIndex + colIndex + 1, rowIndex] = distance
        rowIndex += 1

    # Now finalResult contains for each block:
    # an array of integers representing the NN0 count for that block in different comparisons
    finalResult = tmpResult
    np.savetxt(workdir + '/output/distanceMatrix.txt', finalResult, fmt="%0.3f")

    # TODO system to exclude images completely different from others
    # TODO improve visual result computation -- binding to number of images


# +++++ Script Entrypoint
main()
