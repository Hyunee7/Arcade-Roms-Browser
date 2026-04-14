@echo off
set SYSTEM=
set SDIMAGE=
SETLOCAL EnableExtensions DisableDelayedExpansion

::SD이미지명 추출
call::getsdimage ..\..\..
::echo %SDIMAGE%
::시스템명추출
call:getsystemid .
::echo %SYSTEM%

::디렉토리 없으면 만듦
if not exist G:\share\roms\%SYSTEM% mkdir G:\share\roms\%SYSTEM%

::for /f "tokens=*" %A in ('dir /b /a-l *.zip') do \Batocera\rommv.bat snes "%A"
for /f "tokens=*" %%A in ('dir /b /a-l *.%1') do call:filemove %SYSTEM% "%%A"

goto :end

:getsdimage
set SDIMAGE=%~n1%~x1
exit /b 0
goto :end

:getsystemid
set SYSTEM=%~n1
exit /b 0
goto :end

:filemove
set SRCSIZE=
set TRGSIZE=
SETLOCAL EnableExtensions DisableDelayedExpansion
::echo %1
::echo "%2"
set arcadesystem=%1
::set romfile=%2
set tmp1=%2
set "romfile=%tmp1:"=%"
::set "tmp2=%tmp1:"=%"
::echo "%tmp2%"

::echo system : arcadesystem
::echo romfile : %romfile%
::echo target : G:\share\roms\%arcadesystem%\%romfile%
::  call:filesize "%romfile%"
::  call:filesize "g:\share\roms\%arcadesystem%\%romfile%"
if exist "G:\share\roms\%arcadesystem%\%romfile%" (
  echo "G:\share\roms\%arcadesystem%\%romfile%" Exists!.
  call:compare "%romfile%" "g:\share\roms\%arcadesystem%\%romfile%"
) else (
  move "%romfile%" "G:\share\roms\%arcadesystem%\%romfile%"
  mklink "%romfile%" "G:\share\roms\%arcadesystem%\%romfile%"
)
exit /b 0

:filesize
echo     %~z1 %1
exit /b 0

:srcsize
set SRCSIZE=%~z1
exit /b 0

:trgsize
set TRGSIZE=%~z1
exit /b 0

:compare
SETLOCAL EnableExtensions DisableDelayedExpansion
::용량추출
set SRCSIZE=%~z1
set TRGSIZE=%~z2
::파일명에"제거
set tmp3=%1
set tmp4=%2
set "src=%tmp3:"=%"
set "trg=%tmp4:"=%"

if %SRCSIZE% EQU %TRGSIZE% (
  echo %SRCSIZE% : %TRGSIZE% = Same!
  ren "%src%" "%src%_"
  mklink "%src%" "%trg%"
  del /q "%src%_"
) else (
  echo %SRCSIZE% : %TRGSIZE% = Dist.!!
  echo %SDIMAGE% %SYSTEM% 
)
exit /b 0


:end