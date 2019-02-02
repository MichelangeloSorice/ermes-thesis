# This script performs comparisons among captures, splitting each capture into basic blocks
# and subtracting corresponding block. The output is a file containing for each subBlock
# the count of non zero valued pixels found for each comparison

import json
import sys
from os import listdir
from os.path import join

import cv2
import numpy as np





def main():
    # The working directory which must containt an input folder
    workdir = sys.argv[1]
    # keyWord indicating which comparison we should made
    # optimal - compare all clsf<x>_tplSummary.json with the optimal classification
    # compare - compare results of two algorithms




# +++++ Script Entrypoint
main()
