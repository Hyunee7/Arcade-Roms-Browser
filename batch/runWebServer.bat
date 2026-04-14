@echo off
echo gamelistWeb 서비스 종료
taskkill /IM node.exe /t /f

timeout 1 > NUL
echo gamelistWeb 서비스 시작
::start F:\util\node-v13.14.0-win-x64\node e:\batocera\node\gamelistWeb.js "J:\iso\Game\Linux\batocera-v36-pc64-parceiros-64gb-22-04-2023"
start F:\util\node-v13.14.0-win-x64\node e:\batocera\node\gamelistWeb.js
:: 2023-10-09
::F:\util\node-v13.14.0-win-x64\npm install socket.io
::F:\util\node-v13.14.0-win-x64\npm install archiver
::F:\util\node-v13.14.0-win-x64\npm install sqlite3 
 