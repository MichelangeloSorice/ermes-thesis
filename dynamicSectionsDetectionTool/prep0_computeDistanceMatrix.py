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

    # Retrieving the set of images filenames and sorting them in alphanumeric order
    screenshotInputFolder = workdir + 'input/screenshots/'
    fileNamesList = [join(screenshotInputFolder, f)
                     for f in listdir(screenshotInputFolder) if isfile(join(screenshotInputFolder, f))]
    fileNamesList = sorted(fileNamesList, key=lambda fn: int(fn.split('screenshots/')[1].split('.')[0]), reverse=True)

    # Reading images
    imageList = [cv2.imread(file, cv2.IMREAD_UNCHANGED) for file in fileNamesList]
    if len(imageList) < 2:
        print('There are not enough file in the input folder to perform a meaningful comparison!')
        return 1

    # Setting up results container
    tmpResult = np.zeros((len(imageList), len(imageList)))

    rowIndex = 0
    while len(imageList) > 1:
        testImg = imageList.pop()
        print("Test image is: " + fileNamesList.pop())
        cv2.imshow('image', testImg)
        cv2.waitKey(0)
        colIndex = rowIndex
        for img in reversed(imageList):
            colIndex += 1
            cv2.imshow('image', img)
            cv2.waitKey(0)
            imageDiff = np.absolute(testImg - img)
            distance = round(np.count_nonzero(imageDiff) / imageDiff.size, 3)
            print("Distance " + str(distance))
            tmpResult[rowIndex][colIndex] = distance
            tmpResult[colIndex][rowIndex] = distance
            print("Row index " + str(rowIndex) + " colindex " + str(colIndex))
        rowIndex += 1

    # Now finalResult contains for each block:
    # an array of integers representing the NN0 count for that block in different comparisons
    finalResult = tmpResult
    np.savetxt(workdir + '/output/distanceMatrix.txt', finalResult, fmt="%0.3f")

    # TODO system to exclude images completely different from others
    # TODO improve visual result computation -- binding to number of images


# +++++ Script Entrypoint
main()
