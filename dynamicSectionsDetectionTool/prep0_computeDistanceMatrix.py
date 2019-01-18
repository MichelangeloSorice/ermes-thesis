# This script computes a diagonal matrix representing a measure of distance among captures
# This distance is the percentage of pixels changing when comparing 2 images

import sys
from os import listdir
from os.path import isfile, join

import cv2
import numpy as np
from sklearn.cluster import DBSCAN


def similarity(tup1, tup2):
    return np.absolute(tup1[2] - tup2[2])


def main():
    # The only required input is the working directory which must containt an input
    # folder with a screenshots subdirectory
    workdir = sys.argv[1]

    # Retrieving the set of images filenames and sorting them in alphanumeric order
    screenshotInputFolder = workdir + 'input/screenshots/'
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
    tmpResult = np.zeros((len(imageList), len(imageList)))
    couplesDistancesTuples = []

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
            tmpResult[rowIndex][colIndex] = distance
            tmpResult[colIndex][rowIndex] = distance
            print("Row index " + str(rowIndex) + " colindex " + str(colIndex))
            couplesDistancesTuples.append((testImgTuple[1], imgTuple[1], distance))
        rowIndex += 1

    # Now finalResult contains for each block:
    # an array of integers representing the NN0 count for that block in different comparisons
    finalResult = tmpResult
    np.savetxt(workdir + '/output/distanceMatrix.txt', finalResult, fmt="%0.3f")

    clusters = DBSCAN(eps=0.01, min_samples=5, metric=similarity).fit_predict(couplesDistancesTuples)

    dictionary = {}
    for index, elem in enumerate(couplesDistancesTuples):
        if str(clusters[index]) in dictionary:
            dictionary[str(clusters[index])].append(elem[0])
            dictionary[str(clusters[index])].append(elem[1])
        else:
            dictionary[str(clusters[index])] = [elem[0], elem[1]]

    for cluster, screensContained in dictionary.items():
        print("Cluster: " + cluster)
        print(set(dictionary[cluster]))

    # TODO system to exclude images completely different from others
    # TODO improve visual result computation -- binding to number of images


# +++++ Script Entrypoint
main()
