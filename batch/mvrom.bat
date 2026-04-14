@echo off
set SYSTEM=
SETLOCAL EnableExtensions DisableDelayedExpansion

::시스템명추출
call:getsystemid .
::echo %SYSTEM%

::디렉토리 없으면 만듦
if exist G:\share\roms\%SYSTEM% (
  echo %SYSTEM%있음
) else (
  echo %SYSTEM%없음
  mkdir G:\share\roms\%SYSTEM%
)

::for /f "tokens=*" %A in ('dir /b /a-l *.zip') do \Batocera\rommv.bat snes "%A"
for /f "tokens=*" %%A in ('dir /b /a-l *.%1') do call:filemove %SYSTEM% "%%A"

goto :end

:getsystemid
set SYSTEM=%~n1
exit /b 0
goto :end

:filemove
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
if exist "G:\share\roms\%arcadesystem%\%romfile%" (
  echo "G:\share\roms\%arcadesystem%\%romfile%" 있음.
) else (
echo  move "%romfile%" "G:\share\roms\%arcadesystem%\%romfile%"
echo  mklink "%romfile%" "G:\share\roms\%arcadesystem%\%romfile%"
)
exit /b 0

:end