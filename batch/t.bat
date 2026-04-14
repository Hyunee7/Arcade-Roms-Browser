@echo off

call:systemcopy

goto :end

:systemcopy
set SYSTEM=
set SDIMAGE=
set BASEDIR=G:\share\roms

::SD이미지명 추출
call::getsdimage ..\..\..
echo %SDIMAGE%
::시스템명추출
call:getsystemid .
echo %SYSTEM%

::시스템 디렉토리 없으면 만듦
if not exist G:\share\roms\%SYSTEM% mkdir %BASEDIR%\%SYSTEM%

for /f "tokens=*" %%A in ('dir /b /ad-l') do (
	echo call:skipdir %%A %SYSTEM%
)
exit /b 21


::예외 디렉토리 처리
:skipdir
if "%1" equ "advmame" exit /b 2
if %1 equ fba  exit /b 2
if %1 equ mame2000  exit /b 2
if %1 equ mame2003  exit /b 2
if %1 equ mame2003-plus  exit /b 2
if %1 equ mame2010  exit /b 2
echo call:dirmove %1 %2 1
exit /b 3

:dirmove
::SETLOCAL EnableExtensions DisableDelayedExpansion
SETLOCAL EnableExtensions 
set SUBDIR=%1
set ARCADESYSTEM=%2
set DEEP=%3
echo if not exist "%BASEDIR%\%ARCADESYSTEM%\%SUBDIR%" mkdir "%BASEDIR%\%ARCADESYSTEM%\%SUBDIR%"
if not exist "%BASEDIR%\%ARCADESYSTEM%\%SUBDIR%" mkdir "%BASEDIR%\%ARCADESYSTEM%\%SUBDIR%"

for /f "tokens=*" %%C in ('dir %SUBDIR% /b /ad-l') do (
	call:dirmove %SUBDIR%\%%C %ARCADESYSTEM% %DEEP%1
)
for /f "tokens=*" %%B in ('dir %SUBDIR% /b /a-d') do (
	echo move "%SUBDIR%\%%B" "%BASEDIR%\%ARCADESYSTEM%\%SUBDIR%\%%B"
	echo move "%SUBDIR%\%%B" "%BASEDIR%\%ARCADESYSTEM%\%SUBDIR%\%%B"
)
::echo %DEEP%

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
::빈 폴더이면 JUNCTION 만듦 
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
set SUBFILES=0
:: 하위폴더 파일개수 추출
for /f "tokens=1" %%C in ('dir %SUBDIR% /s ^|findstr "File"') do call set SUBFILES=%%C
echo %SUBDIR% SUBFILES %SUBFILES%
if "%DEEP%" equ "1" (
	echo if %SUBFILES% equ 0 mvdir %SUBDIR%
) else (
	echo if %SUBFILES% equ 0 rmdir %SUBDIR%
)

exit /b 4

:dirmove_test
set SUBDIR=%1
echo %SUBDIR%
::빈 폴더이면 JUNCTION 만듦 
::    echo %SUBDIR% %%C
::    if %%C equ 0 echo 없음
for /f "tokens=1" %%C in ('dir %SUBDIR% ^|findstr "File"') do (
    if %%C equ 0 mvdir %SUBDIR%
)
exit /b 2

:getsdimage
set SDIMAGE=%~n1%~x1
exit /b 0

:getsystemid
set SYSTEM=%~n1
exit /b 1

:end