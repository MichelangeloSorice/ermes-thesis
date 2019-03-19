#!/usr/bin/env bash
 source activate opencv

 python3 xxx_genericPlot.py ./classificationParamsTests/test1_BlockParams/ ld_blocksize_acc
 python3 xxx_genericPlot.py ./classificationParamsTests/test1_BlockParams/ ld_blocksize_elapsedtime

 python3 xxx_genericPlot.py ./classificationParamsTests/test2_BlockHasChangedTh/ ld_nn0th_acc
 python3 xxx_genericPlot.py ./classificationParamsTests/test2_BlockHasChangedTh/ ld_nn0th_elapsedtime

 python3 xxx_genericPlot.py ./classificationParamsTests/test3_highlvlMinDist/ ld_highlvlmidist_acc
 python3 xxx_genericPlot.py ./classificationParamsTests/test3_highlvlMinDist/ ld_highlvlmindist_elapsedtime

 python3 xxx_genericPlot.py ./classificationParamsTests/test4_highlvlMaxDist/ ld_highlvlmaxdist_acc
 python3 xxx_genericPlot.py ./classificationParamsTests/test4_highlvlMaxDist/ ld_highlvlmaxdist_elapsedtime

 python3 xxx_genericPlot.py ./classificationParamsTests/test6_coreWindowWidth/ ld_multixspan_corewindowxstart_acc
 python3 xxx_genericPlot.py ./classificationParamsTests/test6_coreWindowWidth/ ld_multixspan_corewindowxstart_elapsedtime

 python3 xxx_genericPlot.py ./classificationParamsTests/test7_coreWindowHeight/ ld_multiyspan_corewindowystart_acc
 python3 xxx_genericPlot.py ./classificationParamsTests/test7_coreWindowHeight/ ld_multiyspan_corewindowystart_elapsedtime

 python3 xxx_genericPlot.py ./classificationParamsTests/test8_corelvlMinDist/ ld_corelvlmindist_acc
 python3 xxx_genericPlot.py ./classificationParamsTests/test8_corelvlMinDist/ ld_corelvlmindist_elapsedtime

 python3 xxx_genericPlot.py ./classificationParamsTests/test9_corelvlMaxDist/ ld_corelvlmaxdist_acc
 python3 xxx_genericPlot.py ./classificationParamsTests/test9_corelvlMaxDist/ ld_corelvlmaxdist_elapsedtime

 python3 xxx_genericPlot.py ./classificationParamsTests/test10_consecPatternCount/ ld_patterncount_acc
 python3 xxx_genericPlot.py ./classificationParamsTests/test10_consecPatternCount/ ld_patterncount_elpsedtime

 python3 xxx_genericPlot.py ./classificationParamsTests/test11_patternShape/ ld_patternshape_acc
 python3 xxx_genericPlot.py ./classificationParamsTests/test11_patternShape/ ld_patternshape_elapsedtime

 python3 xxx_genericPlot.py ./classificationParamsTests/test12_searchWindowWidth/ ld_multixspan_searchwindowxstart_acc
 python3 xxx_genericPlot.py ./classificationParamsTests/test12_searchWindowWidth/ ld_multixspan_searchwindowxstart_elapsedtime

 python3 xxx_genericPlot.py ./classificationParamsTests/test13_searchWindowHeight/ ld_multiyspan_searchwindowystart_acc
 python3 xxx_genericPlot.py ./classificationParamsTests/test13_searchWindowHeight/ ld_multiyspan_searchwindowystart_elapsedtime


 python3 xxx_genericPlot.py ./secDetectionParamsTests/test1_nn0pde/ sd_multipde_nn0th_acc

 python3 xxx_genericPlot.py ./secDetectionParamsTests/test2_limitCaptures/ sd_limitcaptures_acc
