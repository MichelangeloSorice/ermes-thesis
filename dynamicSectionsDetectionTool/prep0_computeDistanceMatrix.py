# This script computes a diagonal matrix representing a measure of distance among captures
# This distance is the percentage of pixels changing when comparing 2 images

import sys
from os import listdir
from os.path import isfile, join

import cv2
import numpy as np


def similarity(tup1, tup2):
    return np.absolute(tup1[2] - tup2[2])


def main():
    # The only required input is the working directory which must containt an input
    # folder with a screenshots subdirectory
    workdir = sys.argv[1]

    # Retrieving the set of images filenames and sorting them in alphanumeric order
    screenshotInputFolder = workdir + '/input/screenshots/'
    fileNamesList = [join(screenshotInputFolder, f)
                     for f in listdir(screenshotInputFolder) if isfile(join(screenshotInputFolder, f))]
    fileNamesList = sorted(fileNamesList, key=lambda fn: int(fn.split('screenshots/')[1].split('.')[0]), reverse=True)

    # Reading images and creating a list of tupèles containing the image and the related id
    imageList = [(cv2.imread(file, cv2.IMREAD_UNCHANGED), int(file.split('screenshots/')[1].split('.')[0]))
                 for file in fileNamesList]

    if len(imageList) < 2:
        print('There are not enough file in the input folder to perform a meaningful comparison!')
        return 1

    # Setting up results container
    distanceMatrix = np.zeros((len(imageList), len(imageList)))
    couplesDistances = []

    rowIndex = 0
    while len(imageList) > 1:
        testImgTuple = imageList.pop()
        testImg = testImgTuple[0]
        print("Test image is: " + str(testImgTuple[1]))
        colIndex = rowIndex
        for imgTuple in reversed(imageList):
            colIndex += 1
            imageDiff = np.absolute(testImg - imgTuple[0])
            distance = round(np.count_nonzero(imageDiff) / imageDiff.size, 3)
            print("Distance " + str(distance))
            distanceMatrix[rowIndex][colIndex] = distance
            distanceMatrix[colIndex][rowIndex] = distance
            print("Row index " + str(rowIndex) + " colindex " + str(colIndex))
            couplesDistances.append([testImgTuple[1], imgTuple[1], distance])
        rowIndex += 1

    np.savetxt(workdir + '/output/distanceMatrix.txt', distanceMatrix, fmt="%0.3f")
    np.save(workdir + '/output/distanceDataBackup.npy', np.array(couplesDistances))


# +++++ Script Entrypoint
main()
