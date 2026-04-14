@echo off
echo ===============================================================================================
echo mvdir3.bat Start
echo -----------------------------------------------------------------------------------------------
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

:: 디렉토리 목록 조회 하여 옮김 처리
for /f "tokens=*" %%A in ('dir /b /ad-l') do (
    call:chkdir "%%A" %SYSTEM%
)

:: 입력받은 확장명으로 파일 조회하여 옮김 처리
::for /f "tokens=*" %%A in ('dir /b /a-l *.%1') do call:filemove %SYSTEM% "%%A"

echo.
echo ====== "%SYSTEM%" ROM's ======
::롬파일 옮김(롬파일 확정명 설정)
for /f "tokens=*" %%A in ('dir /b /a-d-l *.zip;*.sh;*.keys;*.chd;*.gz;*.cso;*.pbp;*.smc;*.pce;*.vec;*.dim;*.m3u;*.gba;*.bin;*.cue;*.img;*.nes;*.wad;*.iso;*.crt;*.7z;*.d64;*.t64;*.col;*.gb;*.int;*.md;*.n64;*.pak;*.CD?;*.3ds;*.gcz;*.sfc;*.pcm;*.msu;*.bml;*.wbfs;*.z64;*.avi;*.mp4;*.32x;*.wsc;*.ws;*.fds;*.gg;*.gbc;*.sms;*.a26') do call:filemove %SYSTEM% "%%A"

:: 종료
goto :end



:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:filemove
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:: 파일이동
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

:: 파일이 존재하면 파일용량 비교실시
::        없으면 이동후 링크파일 생성
if exist "G:\share\roms\%arcadesystem%\%romfile%" (
  echo "G:\share\roms\%arcadesystem%\%romfile%" Exists!.
  call:compareFile "%romfile%" "g:\share\roms\%arcadesystem%\%romfile%"
) else (
  echo move "%romfile%" =^> "G:\share\roms\%arcadesystem%\%romfile%"
  move "%romfile%" "G:\share\roms\%arcadesystem%\%romfile%"
  mklink "%romfile%" "G:\share\roms\%arcadesystem%\%romfile%"
)
exit /b 0
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::


:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:compareFile
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:: 파일용량 비교
:: 용량이 같으면 링크 생성후 삭제
::        다르면 ...
SETLOCAL EnableExtensions DisableDelayedExpansion
::용량추출
set SRCSIZE=%~z1
set TRGSIZE=%~z2
::파일명에"제거
set tmp3=%1
set tmp4=%2
set "src=%tmp3:"=%"
set "trg=%tmp4:"=%"

if "%SRCSIZE%" EQU "%TRGSIZE%" (
  echo     %SRCSIZE% : %TRGSIZE% = Same!
  ren "%src%" "%src%_"
  mklink "%src%" "%trg%"
  del /q "%src%_"
) else (
  echo     %SRCSIZE% : %TRGSIZE% = Diff.!!
::  echo %SDIMAGE% %SYSTEM% "%~n1" %~x1
  call:otherLink "%src%" "%BASEDIR%\%SYSTEM%\%~n1.%SRCSIZE%%~x1"
)
exit /b 0
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::



:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:otherLink
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
::같은 파일명에 용량이 다른경우 용량을 붙여 이동후 링크파일 만듦
::echo if not exist %2 
if not exist %2 ( 
    echo move %1 =^> %2
    move %1 %2
) else (
    echo del /q %1
    del /q %1
)
echo mklink %1 %2
mklink %1 %2
exit /b 11
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::



:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:getsdimage
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:: SD 이미지명 추출
set SDIMAGE=%~n1%~x1
exit /b 0
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::


:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:getsystemid
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:: 시스템명 추출
set SYSTEM=%~n1
exit /b 1
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::


:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:chkdir
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:: 예외 디렉토리 처리
if %1 equ "advmame"        exit /b 2
if %1 equ "fba"            exit /b 2
if %1 equ "mame2000"       exit /b 2
if %1 equ "mame2003"       exit /b 2
if %1 equ "mame2003-plus"  exit /b 2
if %1 equ "mame2010"       exit /b 2
call:dirmove %1 %2 1
exit /b 3
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::


:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:dirmove
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:: 디렉토리 이동하기 함수
::SETLOCAL EnableExtensions DisableDelayedExpansion 
::SETLOCAL EnableExtensions EnableDelayedExpansion
SETLOCAL EnableExtensions 
set tmp5=%1
set "SUBDIR=%tmp5:"=%"
echo ====== SUBDIR "%SUBDIR%" ======
set ARCADESYSTEM=%2
set DEEP=%3
::대상에 디렉토리 생성
::echo if not exist "%BASEDIR%\%ARCADESYSTEM%\%SUBDIR%" mkdir "%BASEDIR%\%ARCADESYSTEM%\%SUBDIR%"
if not exist "%BASEDIR%\%ARCADESYSTEM%\%SUBDIR%" mkdir "%BASEDIR%\%ARCADESYSTEM%\%SUBDIR%"

:: 하위디렉토리 있으면 재귀호출함
for /f "tokens=*" %%C in ('dir "%SUBDIR%" /b /ad-l') do (
    call:dirmove "%SUBDIR%\%%C" %ARCADESYSTEM% %DEEP%1
)
:: 파일이동 같은파일은 용량 비교하여 처리함
for /f "tokens=*" %%B in ('dir "%SUBDIR%" /b /a-d-l') do (
::    echo "%SUBDIR%\%%B"
    if exist "%BASEDIR%\%ARCADESYSTEM%\%SUBDIR%\%%B" (
::        echo call:compare "%SUBDIR%\%%B" "%BASEDIR%\%ARCADESYSTEM%\%SUBDIR%\%%B"
        call:compare "%SUBDIR%\%%B" "%BASEDIR%\%ARCADESYSTEM%\%SUBDIR%\%%B"
    ) else (
        echo move "%SUBDIR%\%%B" ^> "%BASEDIR%\%ARCADESYSTEM%\%SUBDIR%\%%B"
        move "%SUBDIR%\%%B" "%BASEDIR%\%ARCADESYSTEM%\%SUBDIR%\%%B"
    )
)

::echo EmptyCheck "%SUBDIR%"
::빈 폴더이면 JUNCTION 만듦 
set SUBFILES=0
:: 하위폴더 파일개수 추출
for /f "tokens=1" %%C in ('dir "%SUBDIR%" /s ^|findstr "File"') do call set SUBFILES=%%C
if "%DEEP%" equ "1" (
::	echo if "%SUBFILES%" equ "0" ^( \mvdir "%SUBDIR%" ^)
	if "%SUBFILES%" equ "0" ( \mvdir "%SUBDIR%" )
) else (
::	echo if "%SUBFILES%" equ "0" ^( rmdir "%SUBDIR%" ^)
	if "%SUBFILES%" equ "0" ( rmdir "%SUBDIR%" )
)
exit /b 2
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::


:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:compare
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:: 용량비교후 처리, 같은 용량이면 삭제함
SETLOCAL EnableExtensions DisableDelayedExpansion
::chcp 65001
::용량추출
set SRCSIZE=%~z1
set TRGSIZE=%~z2
::파일명에"제거
set tmp3=%1
set tmp4=%2
set "src=%tmp3:"=%"
set "trg=%tmp4:"=%"
set "trgRENAME=%~d2%~p2%~n1.%SRCSIZE%%~x1"
::echo trgRENAME %trgRENAME%

::echo %1 %2
::echo %src% %trg%
echo %trg%
::echo %SRCSIZE% : %TRGSIZE%
::echo %SDIMAGE% %SYSTEM% 
if "%SRCSIZE%" EQU "%TRGSIZE%" (
    echo     %SRCSIZE% : %TRGSIZE% = Same, Delete
    del /q "%src%"
) else (
    echo     %SRCSIZE% : %TRGSIZE% = Dist!!
    call:otherLink "%src%" "%trgRENAME%"
)
::chcp 949
exit /b 9
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

:end
echo -----------------------------------------------------------------------------------------------
echo mvdir3.bat End
echo ===============================================================================================
