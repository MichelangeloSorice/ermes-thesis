# This script computes a diagonal matrix representing a measure of distance among captures
# This distance is the percentage of pixels changing when comparing 2 images

import sys

import numpy as np
from sklearn.cluster import DBSCAN


def similarity(tup1, tup2):
    return np.absolute(tup1[2] - tup2[2])


def main():
    # The only required input is the working directory which must containt an input
    # folder with a screenshots subdirectory
    workdir = sys.argv[1]

    couplesDistances = np.load(workdir + '/output/distanceDataBackup.npy')

    clusters = DBSCAN(eps=0.01, min_samples=10, metric=similarity).fit_predict(couplesDistances)

    dictionary = {}
    for index, elem in enumerate(couplesDistances):
        if str(clusters[index]) in dictionary:
            dictionary[str(clusters[index])].append(elem[0])
            dictionary[str(clusters[index])].append(elem[1])
        else:
            dictionary[str(clusters[index])] = [elem[0], elem[1]]

    for cluster, screensContained in dictionary.items():
        print("Cluster: " + cluster)
        print(set(dictionary[cluster]))


# +++++ Script Entrypoint
main()
