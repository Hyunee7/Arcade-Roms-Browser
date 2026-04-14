@echo off
set SYSTEM=
set SDIMAGE=
set BASEDIR=G:\share\roms
::SETLOCAL EnableExtensions DisableDelayedExpansion

::SD이미지명 추출
call::getsdimage ..\..\..
::echo %SDIMAGE%
::시스템명추출
call:getsystemid .
::echo %SYSTEM%

::시스템 디렉토리 없으면 만듦
if not exist G:\share\roms\%SYSTEM% mkdir %BASEDIR%\%SYSTEM%

::    call:dirmove %%A %SYSTEM%
for /f "tokens=*" %%A in ('dir /b /ad-l') do (
    call:chkdir %%A %SYSTEM%
)

goto :end

:getsdimage
set SDIMAGE=%~n1%~x1
exit /b 0

:getsystemid
set SYSTEM=%~n1
exit /b 1

::예외 디렉토리 처리
:chkdir
if %1 equ advmame        exit /b 2
if %1 equ fba            exit /b 2
if %1 equ mame2000       exit /b 2
if %1 equ mame2003       exit /b 2
if %1 equ mame2003-plus  exit /b 2
if %1 equ mame2010       exit /b 2
call:dirmove %1 %2 1
exit /b 3

:: 디렉토리 이동하기 함수
:dirmove
::SETLOCAL EnableExtensions DisableDelayedExpansion
SETLOCAL EnableExtensions 
set SUBDIR=%1
set ARCADESYSTEM=%2
set DEEP=%3
::대상에 디렉토리 생성
echo if not exist "%BASEDIR%\%ARCADESYSTEM%\%SUBDIR%" mkdir "%BASEDIR%\%ARCADESYSTEM%\%SUBDIR%"
if not exist "%BASEDIR%\%ARCADESYSTEM%\%SUBDIR%" mkdir "%BASEDIR%\%ARCADESYSTEM%\%SUBDIR%"

:: 하위디렉토리 있으면 재귀호출함
for /f "tokens=*" %%C in ('dir %SUBDIR% /b /ad-l') do (
	call:dirmove %SUBDIR%\%%C %ARCADESYSTEM% %DEEP%1
)
:: 파일이동 같은파일은 용량 비교하여 처리함
for /f "tokens=*" %%B in ('dir %SUBDIR% /b /a-d') do (
    if exist "%BASEDIR%\%ARCADESYSTEM%\%SUBDIR%\%%B" (
        call:compare "%SUBDIR%\%%B" "%BASEDIR%\%ARCADESYSTEM%\%SUBDIR%\%%B"
    ) else (
        echo "%SUBDIR%\%%B" "%BASEDIR%\%ARCADESYSTEM%\%SUBDIR%\%%B"
        move "%SUBDIR%\%%B" "%BASEDIR%\%ARCADESYSTEM%\%SUBDIR%\%%B"
    )
)

::빈 폴더이면 JUNCTION 만듦 
set SUBFILES=0
:: 하위폴더 파일개수 추출
for /f "tokens=1" %%C in ('dir %SUBDIR% /s ^|findstr "File"') do call set SUBFILES=%%C
echo %SUBDIR% SUBFILES %SUBFILES%
if "%DEEP%" equ "1" (
	if %SUBFILES% equ 0 \mvdir %SUBDIR%
) else (
	if %SUBFILES% equ 0 rmdir %SUBDIR%
)
exit /b 2

:compare
:: 용량비교후 처리, 같은 용량이면 삭제함
echo sizeCompare %1 %2
SETLOCAL EnableExtensions DisableDelayedExpansion
::용량추출
set SRCSIZE=%~z1
set TRGSIZE=%~z2
::파일명에"제거
set tmp3=%1
set tmp4=%2
set "src=%tmp3:"=%"
set "trg=%tmp4:"=%"

echo %1 %2
::  echo %SDIMAGE% %SYSTEM% 
if %SRCSIZE% EQU %TRGSIZE% (
    echo %SRCSIZE% : %TRGSIZE% = Same, Delete
    del /q "%src%"
) else (
    echo %SRCSIZE% : %TRGSIZE% = Dist!!
)
exit /b 9

:end