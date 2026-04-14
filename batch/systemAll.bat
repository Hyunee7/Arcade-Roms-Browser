:: 시스템전체 디렉토리에 gamelist.xml 이 있는 시스템을 찾아 
:: 롬옮김(mvdir3.bat)수행 하는 배치 
@echo off
echo ////////////////////////////////////////////////////////////////////////////////
echo %0 Start
echo ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
set RETURNCD=%CD%
for /f "tokens=*" %%A in ('dir /a-d-l /b /s gamelist.xml') do (
    cd "%%~pA"
    call:checkSystem . ..
)
::    echo ====== %%~pA ======
::    call \mvdir3.bat
goto :jobEnd

:checkSystem
:: roms/psp/psp mimis/gamelist.xml 이 발견되어
:: roms/psp/psp mimis/ 를 시스템으로 처리하여 롬이동하는 명령이 수행되는 문제가 발생함.
:: 현재디렉토리 이전 디렉토리가 roms 인 경우에만 수행하게 변경함.
echo SYSTEM "%~n1"
if "%~n2" equ "roms" call \mvdir3.bat
goto :end
::exit /b 1

:jobEnd
cd %RETURNCD%
echo ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
echo %0 End
echo ////////////////////////////////////////////////////////////////////////////////

:end