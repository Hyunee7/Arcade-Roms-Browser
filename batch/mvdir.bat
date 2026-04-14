@echo off
echo.
echo --------------------------------------------------------------------------------
echo mvdir.bat %1 %2 시작
echo ................................................................................
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

set SRCDIR=%1
echo d | xcopy %SRCDIR% g:\share\roms\%SYSTEM%\%SRCDIR% /e /h /k
ren %SRCDIR% _%SRCDIR%
mklink /j %SRCDIR% G:\share\roms\%SYSTEM%\%SRCDIR%
del /s /q  _%SRCDIR%
rmdir _%SRCDIR%

goto :end

:getsystemid
set SYSTEM=%~n1
exit /b 0
goto :end

:end
echo ................................................................................
echo mvdir.bat 종료
echo --------------------------------------------------------------------------------
