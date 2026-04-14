@echo off
set TMP1=%DATE%T%TIME%
set TMP2=%TMP1:-=%
set TMP3=%TMP2::=%
set DTTM=%TMP3:~0,13%
::echo %TMP4%
::echo g node\files.js G: ^> romlist.20231111T0034.txt
::echo g node\files.js G: ^> romlist.%DTTM%.txt
::g node\files.js G: > romlist.%DTTM%.txt
g node\files.js G: > romlist.%DTTM%.txt.csv