#!/usr/bin/env bash
python3 ./../../clsfX_testParameters.py $(pwd)
python3 ./../../xxx_genericPlot.py $(pwd) ld_blocksize_acc
python3 ./../../xxx_genericPlot.py $(pwd) ld_blocksize_elpsedtime