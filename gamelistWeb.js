/******************************************************************************
 * 모듈 로드
 ******************************************************************************/
/******************************************************************************
 * 함수
 ******************************************************************************/
String.prototype.format = function() {             // 숫차포멧변환 3자리 마다 ',' 추가
	if(isNaN(this)) return this;
	var reg = /(^[+-]?\d+)(\d{3})/;                // 정규식정의
	this.rep = this + '';                          // 문자로 변환
	while (reg.test(this.rep)) this.rep = this.rep.replace(reg, '$1' + ',' + '$2');
	return this.rep;
}
Number.prototype.format = function() {             // 숫차포멧변환 3자리 마다 ',' 추가
	if(isNaN(this)) return this;
	return (this + '').format();
}
Number.prototype.to2=function(){return this<10?'0'+this:this;} // 숫자 2자리
Number.prototype.to3=function(){return ('000'+this).substr(-3)} // 숫자 3자리
Date.prototype.getDTTM = function(){ // 로그용 YYYY-MM-DD HH:Mi:SS.sss 형식 시각
    with(this){
        return getFullYear() + '-' + (getMonth()+1).to2() + '-' + getDate().to2()
             + ' '
             + getHours().to2() + ':' + getMinutes().to2() + ':' + getSeconds().to2()
             + '.' + getMilliseconds().to3();
    }
}
Date.prototype.getDTTM2 = function(){ // 로그용 YYYY-MM-DD HH:Mi:SS.sss 형식 시각
    with(this){
        return ''+getFullYear() + (getMonth()+1).to2() + getDate().to2()
             + '.'
             + getHours().to2() + getMinutes().to2() + getSeconds().to2()
             + '(' + getMilliseconds().to3() + ')';
    }
}
Date.prototype.getDTTM3 = function(){ // 로그용 YYYY-MM-DD HH:Mi:SS.sss 형식 시각
    with(this){
        return ''+getFullYear() + (getMonth()+1).to2() + getDate().to2()
             + + getHours().to2() + getMinutes().to2() + getSeconds().to2()
             + getMilliseconds().to3();
    }
}
String.prototype.getContentType = function(){ // ContentType 설정
    var extname = require('path').extname(''+this); // 확장문자 추출
    var contentType = 'text/html';
    switch (extname.toLowerCase()) {
//        case '.txt' : contentType = 'text/text';            break;
        case '.js'  : contentType = 'text/javascript';      break;
        case '.css' : contentType = 'text/css';             break;
        case '.json': contentType = 'application/json';     break;
        case '.xml' : contentType = 'application/xml';      break;
        case '.xsl' : contentType = 'application/xml';      break;

        // image
        case '.ico' :
        case '.png' : contentType = 'image/png';            break;
        case '.thm' :                                                // AirComics 썸네일(디렉토리명, 파일명과 같음)
        case '.jpeg':
        case '.jpg' : contentType = 'image/jpg';            break;
        case '.gif' : contentType = 'image/gif';            break;   

        case '.svg' : contentType = 'image/svg+xml';        break;   
        case '.svgz': contentType = 'image/svg+xml';        break;   

        // audio
        case '.wav' : contentType = 'audio/wav';            break;
        case '.mp3' : contentType = 'audio/mp3';            break;
        // video
        case '.mov' : contentType = 'video/quicktime';      break;   // QuickTime
        case '.3gp' : contentType = 'video/3gpp';           break;   // 3GP Mobile
        case '.avi' : contentType = 'video/x-msvideo';      break;   // A/V Interleave
        case '.wmv' : contentType = 'video/x-ms-wmv';       break;   // Windows Media
        case '.flv' : contentType = 'video/x-flv';          break;   // Flash
        case '.mp4' : contentType = 'video/mp4';            break;   // MPEG-4
        case '.m3u8': contentType = 'application/x-mpegURL';break;   // iPhone Index
        case '.ts'  : contentType = 'video/MP2T';           break;   // iPhone Segment
        // Compress
        case '.zip' : contentType = 'application/zip';            break;   // zip 
        case '.7z'  : contentType = 'application/x-7z-compressed';break;   // 7z
    }
    return contentType;
}

/******************************************************************************
 * 모듈 로드
 ******************************************************************************/
var xml2js = require('xml2js');
var http   = require('http');
var util   = require('util');
var path   = require("path");
// npm install sqlite3
const sqlite3 = require('sqlite3').verbose(); // verbose모드 - stack trace 정보를 덧붙여줌.

// console.log() 파일쓰기로 변경
var fs       = require('fs');
var log_file = fs.createWriteStream(__dirname + '/logs/roms.'+new Date().getDTTM2()+'.log', {flags : 'w'});
var log_stdout = process.stdout;
console.log = function(){
  log_file  .write(new Date().getDTTM() + ' ' + util.format.apply(null,arguments) + '\n');
  log_stdout.write(new Date().getDTTM() + ' ' + util.format.apply(null,arguments) + '\n');
}
console.error = console.log;

/******************************************************************************
 * 전역변수
 ******************************************************************************/
var parser = new xml2js.Parser();

var port   = 10086;           // 사용할 포트번호
var isDebug = true;
var isDev   = true;
// 서버 채크용
var os = require('os');

if(process.argv[2]) console.log(process.argv[2]);
var imgRoot = (process.argv[2]?process.argv[2]:__dirname);
var list = ''; // 리스트 출력 버퍼
if(isDebug) console.log(`imgRoot: ${imgRoot}`);
var sdImgPath='';
var system=''; 
var romPathIsDirectorySystem = false;

var ROMSHDD='G:'; // 롬수집경로
if(isDebug) ROMSHDD='//HYUNEESRV/g$';

/*** /
// 디렉토리 크기 구하기
//const path = require('path');
const { readdir, stat } = require('fs/promises');

const dirSize = async directory => {
  const files = await readdir( directory );
  const stats = files.map( file => stat( path.join( directory, file ) ) );

  return ( await Promise.all( stats ) ).reduce( ( accumulator, { size } ) => accumulator + size, 0 );
}
/////
                                            // 디렉토리 크기 구하기
                                            console.log(' RomSize:'+romFile);
                                            ( async () => {
                                              var romPath = romFile.replace(path.basename(romFile), '');
                                              console.log( romPath );
                                              const size = await dirSize( romPath );
                                              console.log( size );
                                            } )();

***/

function getServerIp() { // 서버 IP 가져오기
    var ifaces = os.networkInterfaces();
    var result = [];
    for (var dev in ifaces) {
        var alias = 0;
        ifaces[dev].forEach(function(details) {
            if (details.family == 'IPv4' && details.internal === false) {
                result.push(details.address);
                ++alias;
            }
        });
    }
    return result;
}

function getRemoteIP(request){
    var ip = request.headers['x-forwarded-for'] || 
         request.connection.remoteAddress || 
         request.socket.remoteAddress ||
         (request.connection.socket ? request.connection.socket.remoteAddress : null);
    if (request.headers['x-forwarded-for']) {
        ip = request.headers['x-forwarded-for'].split(",")[0];
    } else if (request.connection && request.connection.remoteAddress) {
        ip = request.connection.remoteAddress;
    } else {
        ip = request.ip;
    }
    return ip;
}
// 접속 ip, url 출력
function putWebStartLog(request){
//const putWebStartLog = async request => {
    console.log(getRemoteIP(request), request.url);
}

function isXmlDelGame(obj){
    // xml 파일이면 제외함
    if(obj.path[0].indexOf('.xml')>0) return true;
    // bios 제외
    if(obj.path[0].indexOf('cpzn1')>0) return true;
    if(obj.path[0].indexOf('cpzn2')>0) return true;
    if(obj.path[0].indexOf('decocass')>0) return true;
    if(obj.path[0].indexOf('galpandx')>0) return true;
    if(obj.path[0].indexOf('konamigx')>0) return true;
    if(obj.path[0].indexOf('megaplay')>0) return true;
    if(obj.path[0].indexOf('megatech')>0) return true;
    if(obj.path[0].indexOf('neogeo')>0) return true;
    if(obj.path[0].indexOf('pgm')>0) return true;
    if(obj.path[0].indexOf('playch10')>0) return true;
    if(obj.path[0].indexOf('skns')>0) return true;
    if(obj.path[0].indexOf('stvbios')>0) return true;
    if(obj.path[0].indexOf('taitofx1')>0) return true;
    if(obj.path[0].indexOf('tps')>0) return true;
    // 제목에 notgame 이 있으면 제외함
    if(obj.name[0].indexOf('notgame')>0) return true;
    // hidden 이 true 이면 제외함
    if(obj['hidden']) if(obj['hidden'][0]=='true') return true;

    return false;
}

// zip 파일 압축
const archiver = require("archiver");
function createZipFromFile(_files,filename,response){
    var zipFilename = new Date().getDTTM2() + ".zip";
//    var zipFilename = __dirname + "/xml/testfile.zip";
    var xmlFilename = 'gamelist.xml';
    const output = fs.createWriteStream(__dirname + "/xml/" + zipFilename);
    const archive = archiver("zip", {
        zlib: { level: 9 } // set compression level to the highest
    });

    // listen for all archive data to be written
    // 'close' event is fired only when a file descriptor is involved
    output.on('close', function() {
        console.log('ZIP 생성완료! - ' + archive.pointer() + ' total bytes');
        fs.unlinkSync(xmlFilename);
        io.emit('zipdownload', JSON.stringify({down:zipFilename, name:encodeURI(filename)}) );

        response.setHeader("Content-Disposition", "attachment; filename=" + encodeURI(filename));
//        response.setHeader("Content-Type","application/zip"); 
        response.setHeader("Content-Type","binary/octet-stream");  
        response.setHeader('Content-Length', archive.pointer());

        var zipStream = fs.createReadStream(__dirname + "/xml/" + zipFilename);
        zipStream.pipe(response);
        zipStream.on('close',()=>{
            // 다운로드 후 삭제
            //fs.unlinkSync(xmlFilename);
            fs.unlinkSync(__dirname + "/xml/" + zipFilename);
            console.log('ZIP 전송완료!');
        });
        zipStream.on('error',err=>{
            console.error('ZIP Error:',err);
        });
    });
    archive.pipe(output);
//    response.setHeader("Content-Disposition", "attachment; filename=" + encodeURI(filename));
//    response.setHeader("Content-Type","binary/octet-stream");  
//    archive.pipe(response);

    _files.forEach(function(file){
        if(file.path.indexOf('gamelist')>=0){
            xmlFilename = file.fullpath;
            file.path =  file.path.replace(/.\d{8}.\d{6}\(\d{2,3}\)/,'');
        }
        // 존재하는 파일이고, 디렉토리가 아니면
        //if (fs.existsSync(file.fullpath) && !fs.lstatSync(file.fullpath).isDirectory()) {
        // 존재하는 경로인경우
//        if ( fs.existsSync(file.fullpath) ) {
//            if(isDebug) console.log('ZIP', file.fullpath, file.path);
//            archive.file(file.fullpath, { name: file.path });
        var fp = getLinkFile(file.fullpath);
        if ( fs.existsSync(fp) ) {
            if(isDebug) console.log('ZIP', fp, file.path);
            archive.file(fp, { name: file.path });
        }
    })

    archive.finalize();
    //if(isDebug) console.log('ZIP 생성완료!');
} //function createZipFromFile(_files,filename,response){

// 디렉토리 용량 구하기
function getDirSize(path){
    var size = 0;
    var basePath=imgRoot + '/share/roms/'+system+'/';
    fs.readdirSync(basePath+path, {withFileTypes:true}).forEach(p=>{
        if(p.isDirectory()) size += getDirSize(path+'/'+p.name);
        else {
            var filesize = fs.statSync(basePath+path+'/'+p.name).size;
            size += filesize;
            //if(isDebug) console.log(path+'/'+p.name, filesize);
        }
    });
    return size;
}

// 심링크파일의 경우 대상파일로 변경
function getLinkFile(path){
    try{
        if(fs.lstatSync(path).isSymbolicLink()){
            var _path = fs.readlinkSync(path);
            if(isDebug) console.log('symlink target:',_path);
            if(isDebug) _path = _path.replace('G:','//HYUNEESRV/g$');
            if(isDebug) console.log('rename target:',_path);
            return _path;
        }else{
            return path;
        }
    }catch(e){
        return path;
        //return ROMSHDD + path;
    }
}

/*
var Message = (msg=>this._msg = msg||''};
Message.prototype = {
    add : (msg)=>
}
*/

/******************************************************************************
 * http Route 함수
 ******************************************************************************/

// /filelist? 처리
var routeFilelist = (req, res)=>{
    try{
        var _url = req.url;
        var queryData = new URL('http://loaclhost:10086' + _url);
        var sdImg   = queryData.searchParams.get('sd');
        var system  = queryData.searchParams.get('sid');
        var ext     = queryData.searchParams.get('ext');
        var keyword = queryData.searchParams.get('q');
        //console.log('__dirname:',__dirname);
//        const filelist =  new sqlite3.Database( __dirname+'/db/filelist.sqlite' );
        const filelist =  new sqlite3.Database( __dirname+'/db/games.files.sqlite3' );
        //res.writeHead(200, { 'Content-Type': 'text:html' });
        //res.end('{code:0,msg:"db연결성공"}', 'utf-8')
        //var selSQL = "SELECT uid, sdimage, system, size, ext, name, path FROM filelist LIMIT 0, 20";
        //filelist.get(selSQL, (err,row)=>{
        //var selSQL = "SELECT uid, sdimage, system, size, ext, name, path FROM filelist WHERE";// LIMIT 0, 20";
        var selSQL = "SELECT sdimage, system, name, size, ext, path FROM filelist WHERE";// LIMIT 0, 20";
        var subsql = '';
        if(sdImg  ) subsql  = (subsql?''     :' WHERE ') + "sdimage='"+sdImg+"' ";
        if(system ) subsql += (subsql?' AND ':' WHERE ') + "system='"+system+"' ";
        if(ext    ) subsql += (subsql?' AND ':' WHERE ') + "ext='"+ext+"' ";
        if(keyword) subsql += (subsql?' AND ':' WHERE ') + "name like '%"+keyword+"%' ";
//        filelist.get(selSQL, 'ddragon.zip', (err,row)=>{
        if(isDebug) console.log("subsql:",subsql);
        console.log(getRemoteIP(req),"routeFilelist 조회시작");
        //filelist.all(selSQL, keyword, (err,row)=>{
        if(isDebug) console.log(selSQL.replace('WHERE',subsql))
        filelist.all(selSQL.replace('WHERE',subsql), (err,row)=>{
            if(err) throw err;
            if(row === undefined) console.log(getRemoteIP(req),"결과 없음");
            //console.log(row);
            console.log(getRemoteIP(req),"routeFilelist 조회완료 :", row.length);
            res.writeHead(200, { 'Content-Type': 'text:json' });
            res.end(JSON.stringify(row), 'utf-8');
        });
        filelist.close();
    }catch(err){
        //filelist.close();
        console.log(err);
        res.writeHead(500); // ??
        res.end('{code:500,msg:"Sorry, check with the site admin for error: '+err.code+' ..."}');
        res.end(); 
    }
}

// filelist 의 selectBox 아이템 목록
var routeFilelistSelectItems = (req, res)=>{
    try{
        var _url = req.url;
        var queryData = new URL('http://loaclhost:10086' + _url);
        var id   = queryData.searchParams.get('id');
//        const filelist =  new sqlite3.Database( __dirname+'/db/filelist.sqlite' );
        const filelist =  new sqlite3.Database( __dirname+'/db/games.files.sqlite3' );

        var selSQL = "SELECT DISTINCT "+id+" FROM filelist f ";// LIMIT 0, 20";
        console.log(getRemoteIP(req),"routeFilelistSelectItems 조회시작");
        filelist.all(selSQL, (err,row)=>{
            if(err) throw err;
            if(row === undefined) console.log(getRemoteIP(req),"결과 없음");
            //console.log(row);
            console.log(getRemoteIP(req),"routeFilelistSelectItems 조회완료 :", row.length);
            res.writeHead(200, { 'Content-Type': 'text:json' });
            res.end(JSON.stringify(row), 'utf-8');
        });

        filelist.close();
    }catch(err){
        //filelist.close();
        console.log(err);
        res.writeHead(500); // ??
        res.end('{code:500,msg:"Sorry, check with the site admin for error: '+err.code+' ..."}');
        res.end(); 
    }
}


// gamelist 의 selectBox 아이템 목록 -> 못쓰는거임
var routeGamelistSelectItems = (req, res)=>{
    const _db=null;
    try{
        var _url = req.url;
        var queryData = new URL('http://loaclhost:10086' + _url);
        var id   = queryData.searchParams.get('id');
        _db =  new sqlite3.Database( __dirname+'/db/games.files.sqlite3' );

        var selSQL = "SELECT DISTINCT "+id+" FROM gamelist f ";// LIMIT 0, 20";
        console.log(getRemoteIP(req),"routeFilelistSelectItems 조회시작");
        console.timeEnd('gamelist');
        _db.all(selSQL, (err,row)=>{
            if(err) throw err;
            if(row === undefined) console.log(getRemoteIP(req),"결과 없음");
            //console.log(row);
            console.log(getRemoteIP(req),"routeFilelistSelectItems 조회완료 :", row.length);
            res.writeHead(200, { 'Content-Type': 'text:json' });
            res.end(JSON.stringify(row), 'utf-8');
            console.timeEnd('gamelist');
        });

        _db.close();
    }catch(err){
        _db.close();
        console.log(err);
        res.writeHead(500); // ??
        res.end('{code:500,msg:"Sorry, check with the site admin for error: '+err.code+' ..."}');
        res.end(); 
    }
}


// gamelist 의 system 목록 조회
var routeGamelistSystem = (req, res)=>{
    //const db=null;
    try{
        var _url = req.url;
        var queryData = new URL('http://loaclhost:10086' + _url);
        var sd   = path.basename(queryData.searchParams.get('sd'));
        const db =  new sqlite3.Database( __dirname+'/db/games.files.sqlite3' );
        var selSQL = 'SELECT sdimage '
                   + '     , "system"'
                   + '     , "system" AS name'
                   + '     , sum(CASE empty WHEN \'false\' THEN 1 ELSE 0 END) AS "exists" '
                   + '     , count("system") AS "count" '
                   + '  FROM gamelist g '
                   + ' WHERE sdimage=\''+decodeURIComponent(sd)+'\''
                   + ' GROUP BY sdimage '
                   + '        , "system"'
                   + ' ORDER BY upper("system") ASC ';
         
        console.log(getRemoteIP(req),selSQL);
        console.log(getRemoteIP(req),"routeGamelistSystem 조회시작");
        console.time('systemlist');
        db.all(selSQL, (err,row)=>{
            if(err) throw err;
            if(row === undefined) console.log(getRemoteIP(req),"결과 없음");
            //console.log(row);
            console.log(getRemoteIP(req),"routeGamelistSystem 조회완료 :", row.length);
            res.writeHead(200, { 'Content-Type': 'text:json' });
            res.end(JSON.stringify(row), 'utf-8');
            console.timeEnd('systemlist');
        });

        db.close();
    }catch(err){
        //if(db) db.close();
        console.log(err);
        res.writeHead(500); // ??
        res.end('{code:500,msg:"Sorry, check with the site admin for error: '+err.code+' ..."}');
        res.end(); 
    }
}

// gamelist 의 system 내 rom 목록 조회
var routeGamelistSystemRoms = (req, res)=>{
    //const db=null;
    try{
        var _url = req.url;
        var queryData = new URL('http://loaclhost:10086' + _url);
        var sd   = path.basename(decodeURIComponent(queryData.searchParams.get('sd')));
        var system = decodeURIComponent(queryData.searchParams.get('sid'));
        const db =  new sqlite3.Database( __dirname+'/db/games.files.sqlite3' );

        var selSQL = `SELECT * `
                   + `  FROM gamelist g `
                   + ` WHERE sdimage='${sd}'`
                   + `   AND "system" = '${system}'`
                 //+ '   AND hidden IS NULL'
                   + ' ORDER BY name';
        console.log(selSQL);
        console.log(getRemoteIP(req),"routeGamelistSystemRoms 조회시작");
        console.time('romlist');
        db.all(selSQL, (err,row)=>{
            if(err) throw err;
            if(row === undefined) console.log(getRemoteIP(req),"결과 없음");
            //console.log(row);
            console.log(getRemoteIP(req),"routeGamelistSystemRoms 조회완료 :", row.length);
            res.writeHead(200, { 'Content-Type': 'text:json' });
            res.end(encodeURIComponent(JSON.stringify({gameList:{game:row}})), 'utf-8');
            console.timeEnd('romlist');
        });

        db.close();
    }catch(err){
        //if(db) db.close();
        console.log(err);
        res.writeHead(500); // ??
        res.end('{code:500,msg:"Sorry, check with the site admin for error: '+err.code+' ..."}');
        res.end(); 
    }
}

// /romlist 처리
var routeRomlist = (req, res)=>{
    //console.log('481:', this);
    try{
        putWebStartLog(req);
        var _url = req.url;
        var queryData = new URL('http://loaclhost:10086' + _url);
        var sdImg   = queryData.searchParams.get('sd');
        var system  = queryData.searchParams.get('sid');
        var empty   = queryData.searchParams.get('empty');
        var keyword = queryData.searchParams.get('q');
        const db =  new sqlite3.Database( __dirname+'/db/games.files.sqlite3' );
        var selSQL = "";
        // 롬 타이틀 조회 화면 시직시 보여질 롬 목록 추출
        if(keyword == 'romliststart'){
            // 존재하는롬, 즐겨찾기 추가된 롬, 랜덤 200개 추출
            selSQL = "select * from gamelist g where empty='false' and favorite='true' order by random() limit 200;";
        } else {
            var _selSQL = "SELECT * FROM gamelist WHERE";// LIMIT 0, 20";
            //var _selSQL = "SELECT * FROM gamelist WHERE LIMIT 0, 200";
            var subsql = '';
            if(sdImg  ) subsql  = (subsql?''     :' WHERE ') + "sdimage='"+sdImg+"' ";
            if(system ) subsql += (subsql?' AND ':' WHERE ') + "system='"+system+"' ";
            console.log('empty:',empty);
            if(empty  ) subsql += (subsql?' AND ':' WHERE ') + "empty='"+empty+"' ";
            //if(keyword) subsql += (subsql?' AND ':' WHERE ') + "name like '%"+keyword+"%' ";

            // 공백문자로 잘라 조회문 조립하기
            if(keyword) subsql += (subsql?' AND ':' WHERE ') + "name like '%"+keyword.trim().split(' ').join("%' and name like '%")+"%' ";

            if(isDebug) console.log("subsql:",subsql);
            selSQL = _selSQL.replace('WHERE',subsql)
        }
        console.log(getRemoteIP(req),"routeRomlist 조회시작");
        if(isDebug) console.log(selSQL)
        db.all(selSQL, (err,row)=>{
            if(err) throw err;
            if(row === undefined) console.log(getRemoteIP(req),"결과 없음");
            //console.log(row);
            console.log(getRemoteIP(req),"routeRomlist 조회완료 :", row.length);
            res.writeHead(200, { 'Content-Type': 'text:json' });
//            res.end(encodeURIComponent(JSON.stringify({gameList:{game:row}})), 'utf-8');
            res.end(encodeURIComponent(JSON.stringify(row)), 'utf-8');
        });
        db.close();
    }catch(err){
        //db.close();
        console.log(err);
        res.writeHead(500); // ??
        res.end('{code:500,msg:"Sorry, check with the site admin for error: '+err.code+' ..."}');
        res.end(); 
    }
}

/******************************************************************************
 * http 서버 설정
 ******************************************************************************/
function webService(request, response) {
//    console.time('timer');
//    console.time('gameList');
    if(isDebug) putWebStartLog(request);

    // 서비스 시작
    try{
        var _url = request.url;
        var queryData = new URL('http://loaclhost:10086' + _url);
        sdImgPath = queryData.searchParams.get('sd');
        if(sdImgPath){
            imgRoot = sdImgPath;
            console.log(`SD Image Path : ${imgRoot}`);
        }
        system = queryData.searchParams.get('sid');
        var download = queryData.searchParams.get('download');
        var basedir = queryData.searchParams.get('basedir');
        var rominfo = queryData.searchParams.get('game');
        var zip_download = queryData.searchParams.get('zip');
        romPathIsDirectorySystem = ['windows','scummvm'].indexOf(system) > -1;

        // 프로세스 종료;
        if(queryData.pathname == '/exit'){
            process.exit();

        // filelist DB 조회처리
        }else if(queryData.pathname == '/filelist'){
            routeFilelist(request,response);

        // filelist DB selectBox 내용 조회 (sdimage, system, ext)
        }else if(queryData.pathname == '/filelistselect'){
            routeFilelistSelectItems(request,response);

        // romlist DB 조회처리
        }else if(queryData.pathname == '/romlist'){
            routeRomlist(request,response);

        // xml 생성, zip 파일 다운로드
        }else if(queryData.pathname == '/genxml'){
            var body = '';
            request.on("data", function (data) {
                body += data;
            });
            request.on("end", function() {
                if(isDebug) console.log('body:',body);
                data = {gameList:JSON.parse(decodeURIComponent(body))};
                if(isDebug) console.log('data.gameList.game.name:',data.gameList.game.name);

                const builder = new xml2js.Builder();
                const romXml = builder.buildObject(data);
                if(isDebug) console.log('romXml:',romXml);

                if(isDebug) console.log(`is_zip :${zip_download}`);
                // 롬정보(xml, 롬, 영상,이미지 파일포함) zip 파일 다운로드
                if(zip_download=='1'){
                    if(isDebug) console.log(`is_zip :${zip_download}`);
                    var xml_filename = __dirname+'/xml/gamelist.'+data.gameList.game.name+'.'+new Date().getDTTM2()+'.xml';
                    fs.writeFileSync(xml_filename, romXml);
                    console.log('XML 생성완료!');

                    // 압축할 대상 목록 작성
                    var _files = [{fullpath:xml_filename, path:path.basename(xml_filename)}];
                    var basePath = imgRoot+'/share/roms/'+system+'/';
                    var compressFiles = ['manual', 'marquee', 'image', 'video', 'thumbnail', 'fanart', 'screenshot', 'mix',
                                         'cartridge', 'boxback', 'boxart', 'wheel', 'titleshot', 'map', 'news', 'bezel']

                    // 하위디렉토리 모두 압축대상에 포함
                    var fTree = function(path){
                        fs.readdirSync(basePath+path, {withFileTypes:true}).forEach(p=>{
                            if(p.isDirectory()) fTree(path+'/'+p.name);
                            else _files.push({fullpath:basePath+path+'/'+p.name
                                             ,path    :         path+'/'+p.name });

                        });
                    }
                    // 롬 경로가 디렉토리이면 하위디렉토리 모두 포함
                    if( fs.lstatSync(basePath+data.gameList.game.path).isDirectory() ){
//                        fTree(data.gameList.game.path);
                        if(path.extname(data.gameList.game.path)=='.game'){
                            fTree( data.gameList.game.path.replace('.game','') );
                            _files.push({fullpath:basePath+data.gameList.game.path
                                        ,path    :         data.gameList.game.path });
                        } else  {
                            fTree( data.gameList.game.path );
                        }
                    } else {
                        if(romPathIsDirectorySystem){ // 롬 경로가 디렉토리인 시스템이면
                            fTree( data.gameList.game.path
                                   .replace('/'+path.basename(data.gameList.game.path),'') );
                        }else{
                            var romFile = imgRoot+'/share/roms/'+system+'/'+data.gameList.game.path;
                            var _romname = path.basename(data.gameList.game.path);
                            var _rompath = data.gameList.game.path.replace(_romname,'');
                            if(path.extname(data.gameList.game.path) == '.gdi'
                                    || path.extname(data.gameList.game.path) == '.cue'
                                    || path.extname(data.gameList.game.path) == '.lst'){ // 롬경로가 .gdi 인경우 파일내 첨부 파일들 용량구함
                                var dataArr = fs.readFileSync(romFile, 'utf-8').replace(/\r/g,'').split('\n');
                                for(var ii=0; ii<dataArr.length; ii++){
                                    try{
                                        var _romfile = dataArr[ii].match(/"(.*)"/)[1];
                                        if(_romfile=='') continue;
                                        _files.push({fullpath:imgRoot+'/share/roms/'+system+'/' + _rompath + _romfile,
                                                     path    :                                    _rompath + _romfile})
                                    }catch(e){
                                        //console.error(e)
                                    }
                                }
                            }else if(path.extname(data.gameList.game.path) == '.m3u'){ // 롬경로가 .m3u 인경우 파일내 첨부 파일들 용량구함
                                var dataArr = fs.readFileSync(romFile, 'utf-8').replace(/\r/g,'').split('\n');
                                //console.log(dataArr);
                                for(var ii=0; ii<dataArr.length; ii++){
                                    try{
                                        var _romfile = dataArr[ii];
                                        if(_romfile=='') continue;
                                        _files.push({fullpath:imgRoot+'/share/roms/'+system+'/' + _rompath + _romfile,
                                                     path    :                                    _rompath + _romfile})
                                    }catch(e){
                                        console.error(e)
                                    }
                                }
                            }
//console.log('_files:',_files);
                            compressFiles.push('path');
                        }
                    }
                    compressFiles.forEach((val)=>{
                        if(data.gameList.game[val]){
                            _files.push({fullpath:basePath+data.gameList.game[val]
                                        ,path    :         data.gameList.game[val] });
                        }
                    });

                    // 다운로드 파일명
                    var filename = `${system}.${data.gameList.game.name}.zip`;
                    if(isDebug) console.log(`filename="${filename}"`);
                    // zip 파일 압축 후 다운로드
                    createZipFromFile(_files,filename,response);

                // xml 파일만 다운로드
                }else{
                    if(isDebug) console.log(`is_xml :${zip_download}`);
                    // 다운로드 파일명
                    var filename = `${system}.${data.gameList.game.name}.gamelist.xml`;
                    if(isDebug) console.log(`filename="${filename}"`);
                    response.setHeader("Content-Disposition", "attachment; filename=" + encodeURI(filename));
                    response.setHeader("Content-Type","application/xml");  
                    //if(isDebug) console.log('xml size:', romXml.length);
                    //response.setHeader('Content-Length', romXml.length);
                    response.end(romXml, 'utf-8');
                }
            })


        // 시스템 목록
        }else if(queryData.pathname == '/systems'){
            var usedb   = queryData.searchParams.get('db');
            if(usedb){
                routeGamelistSystem(request, response);
                return false;
            }

            console.time('systems');
            fs.readdir(imgRoot+'/share/roms', (err, filelist) => {
                var total = 0;
                var nm = '';
                var romList = '';
                var systems = [];
                try{
                    if (err) throw err;
                    for(var i=0; i<filelist.length; i++){
                        if(i%5 == 0) console.log(`System load: ${i}/${filelist.length}` );
                        nm = filelist[i];
                        romList = imgRoot + '/share/roms/'+filelist[i]+'/gamelist.xml';
                        // gamelist.xml 의 game 개수 구하기
                        var flag=0;
                        total = 0;
                        try{
                            parser.parseString(fs.readFileSync(romList, 'utf-8'), function(err, result) {
                                if(!err){
                                    systems.push({name:filelist[i], count:result.gameList.game.length});
                                }
                            });
                        }catch(e){
                        }
                    }
                    console.log(`System load: ${i}/${filelist.length}` );
                    response.writeHead(200, { 'Content-Type': 'text/html;charset=UTF-8' });
                    response.end(JSON.stringify(systems), 'utf-8');
                }catch(e){
                    console.error(`XML romList : ${romList}`);
                    console.error('360:',e);
                    response.writeHead(200, { 'Content-Type': 'text/html;charset=UTF-8' });
                    response.end(JSON.stringify(['ERROR...']), 'utf-8');
                }
                console.timeEnd('systems');
            });


        // 게임목록
        }else if(queryData.pathname == '/system'){
            var usedb   = queryData.searchParams.get('db');
            if(usedb){
                routeGamelistSystemRoms(request, response);
                return false;
            }

            console.time('gameList');
            try{
                var xml = fs.readFileSync(imgRoot + '/share/roms/'+system+'/gamelist.xml', 'utf-8');
                parser.parseString(xml, function(err, result) {
                    response.writeHead(200, { 'Content-Type': 'text/html;charset=UTF-8' });
                    if(err){
                        console.error('374:',err);
                        response.end('{"gameList":{"game":[]}}', 'utf-8');
                    }else{
                        io.emit('gamelistMax', result.gameList.game.length);
                        console.log(`XML[${system}] Total Game: ` + result.gameList.game.length );
                        var existsCnt = 0;

                        // 롬명으로 오름차순 정렬
                        result.gameList.game.sort(function(a, b)  {
                          if(a.name[0].toUpperCase() >   b.name[0].toUpperCase()) return  1;
                          if(a.name[0].toUpperCase() === b.name[0].toUpperCase()) return  0;
                          if(a.name[0].toUpperCase() <   b.name[0].toUpperCase()) return -1;
                        });
                        // xml 에 중복 롬 제거
                        var i=0;
                        for(i=0; i<result.gameList.game.length; i++){
                            if(i%100 == 0) console.log(`XML[${system}] Load: ${i}/${result.gameList.game.length}` );

                            result.gameList.game[i]['empty'     ] = 0;
                            result.gameList.game[i]['pathsize'  ] = 0;
                            result.gameList.game[i]['manualsize'] = 0;

                            var aRom = result.gameList.game[i].path[0];
                            for(var j=i+1; j<result.gameList.game.length; j++){ // 중복롬찾기
                                if( aRom == result.gameList.game[j].path[0]){
                                    result.gameList.game[i]['empty']=1; // 없는롬으로 처리
                                }
                            }
                            if(isXmlDelGame(result.gameList.game[i])){
                                result.gameList.game[i]['empty']=1;
                            }else{
                                // 롬 경로
                                //getLinkFile(_file)
                                var rom = imgRoot + '/share/roms/'+system+'/'+aRom;
                                // 파일이 존재하고, 디렉토리가 아닌경우
                                //if (fs.existsSync(rom) && !fs.lstatSync(rom).isDirectory()) {
                                //console.log(rom, fs.existsSync(rom));
                                //console.log(rom, fs.existsSync(getLinkFile(rom)));
                                //console.log(rom, fs.lstatSync(rom));
                                //if (fs.existsSync(rom)){ // 존재하는 경로
                                if (fs.existsSync(getLinkFile(rom))){ // 존재하는 경로
                                    existsCnt++;
                                    // 롬 경로가 디렉토리이면 하위디렉토리 모두 포함
                                    if( fs.lstatSync(rom).isDirectory() ){
//                                        result.gameList.game[i]['pathsize'] = getDirSize(aRom);
                                        if(path.extname(aRom)=='.game') result.gameList.game[i]['pathsize'] = getDirSize(aRom.replace('.game',''));
                                        else                            result.gameList.game[i]['pathsize'] = getDirSize(aRom);
                                        if(isDebug) console.log(aRom, result.gameList.game[i].pathsize);
                                    } else {
                                        if( romPathIsDirectorySystem ){ // 롬 경로가 디렉토리인 시스템이면 파일이어도 디렉토리합산함.
                                            result.gameList.game[i]['pathsize'] = getDirSize( aRom.split('/').slice(0,2).join('/') );
                                            if(isDebug) console.log(aRom, result.gameList.game[i].pathsize);
                                        }else{
                                            var romFile = imgRoot+'/share/roms/'+system+'/'+result.gameList.game[i].path[0];
                                            var _romname = path.basename(result.gameList.game[i].path[0]);
                                            var _rompath = result.gameList.game[i].path[0].replace(_romname,'');
                                            if(path.extname(result.gameList.game[i].path[0]) == '.gdi'
                                                    || path.extname(result.gameList.game[i].path[0]) == '.cue'
                                                    || path.extname(result.gameList.game[i].path[0]) == '.lst'){
                                                var data = fs.readFileSync(getLinkFile(romFile), 'utf-8');
                                                console.log(result.gameList.game[i].path[0]);
                                                //console.log(data);
                                                var dataArr = data.replace(/\r/g,'').split('\n');
                                                dataArr.push(`"${_romname}"`);
                                                for(var ii=0; ii<dataArr.length; ii++){
                                                    try{
                                                        var _romfile = imgRoot+'/share/roms/'+system+'/'+_rompath+ dataArr[ii].match(/"(.*)"/)[1];
                                                        //console.log(ii,_romfile);
                                                        result.gameList.game[i]['pathsize'] += fs.statSync(getLinkFile(_romfile)).size;
                                                    }catch(e){
                                                        //console.error(e)
                                                    }
                                                }
                                            }else if(path.extname(result.gameList.game[i].path[0]) == '.m3u'){
                                                var data = fs.readFileSync(getLinkFile(romFile), 'utf-8');
                                                var dataArr = data.replace(/\r/g,'').split('\n');
                                                dataArr.push(_romname);
                                                for(var ii=0; ii<dataArr.length; ii++){
                                                    try{
                                                        var _romfile = imgRoot+'/share/roms/'+system+'/'+_rompath+ dataArr[ii];
                                                        result.gameList.game[i]['pathsize'] += fs.statSync(getLinkFile(_romfile)).size;
                                                    }catch(e){
                                                        console.error(e)
                                                    }
                                                }
                                            }else{
                                                try{
                                                    //var romFile = imgRoot+'/share/roms/'+system+'/'+result.gameList.game[i].path[0];
                                                    //const stat = fs.statSync(romFile);
                                                    const stat = fs.statSync( getLinkFile(romFile) ); // 링크파일 처리
                                                    const fileSize = stat.size;
                                                    result.gameList.game[i]['pathsize'] = fileSize;
                                                }catch(e){
                                                    if(isDebug) console.error('  Filsize:',i, e);
                                                }
                                            }
                                        }
                                    }
                                }else{ // 없는 경로의 경우
                                    result.gameList.game[i]['empty']=1;
                                }
                            }

                            // 파일용량 구하기
                            if(result.gameList.game[i]['empty']==0){
                                // 메뉴얼 용량구하기
                                if(result.gameList.game[i]['manual']){
                                    try{
                                        const stat = fs.statSync(imgRoot+'/share/roms/'+system+'/'+result.gameList.game[i].manual[0]);
                                        const fileSize = stat.size;
                                        result.gameList.game[i]['manualsize'] = fileSize;
                                    }catch(e){
                                        if(isDebug) console.error('  Filsize:',i, e);
                                    }
                                }
                                // News 용량구하기
                                if(result.gameList.game[i]['news']){
                                    try{
                                        const stat = fs.statSync(imgRoot+'/share/roms/'+system+'/'+result.gameList.game[i].manual[0]);
                                        const fileSize = stat.size;
                                        result.gameList.game[i]['newssize'] = fileSize;
                                    }catch(e){
                                        if(isDebug) console.error('  Filsize:',i, e);
                                    }
                                }
                            }

                            // 인코딩 수행
                            ['name', 'desc', 'genre', 'family', 'developer',
                             'path', 'publisher', 'video', 'marque', 'image',
                             'thumbnail', 'marquee'].forEach(function(val){
                                try{
                                    result.gameList.game[i][val][0] = encodeURIComponent(decodeURIComponent(result.gameList.game[i][val][0]));
                                }catch(e){
                                    //console.log('  encodeError :'+result.gameList.game[i][val][0]);
                                    //result.gameList.game[i][val][0] = result.gameList.game[i][val][0];
                                }
                            });
                        }

                        console.log(`XML[${system}] Load: ${i}/${result.gameList.game.length}` );
                        console.log(`XML[${system}] Exists Total Game: ${existsCnt}` );
                        response.end(JSON.stringify(result), 'utf-8');
                    }
                });
            }catch(e){
                response.writeHead(404, { 'Content-Type': 'text/html;charset=UTF-8' });
                console.error('329:',e);
                response.end('{"gameList":{"game":[]}}', 'utf-8');
            }
            console.timeEnd('gameList');
        // XML 첨부파일(롬, 메뉴얼) 다운로드
        }else if(download){ // 파일 다운로드
            var _file = (basedir?__dirname:imgRoot) + decodeURIComponent(queryData.pathname);
            if(isDebug) console.log(`Download file: ${_file}`);
            var name = queryData.searchParams.get('name'); // zip다운로드의 경우 변경할 zip파일명
            const filename = name?name:path.basename(_file);  
            if(isDebug) console.log(`filename="${filename}"`);
            _file = getLinkFile(_file);
            var stats = fs.statSync(_file);

            response.setHeader("Content-Disposition", "attachment; filename=" + encodeURI(filename));
            response.setHeader("Content-Type","binary/octet-stream");  
            response.setHeader('Content-Length', stats.size );
            try{
                /** /
                fs.createReadStream(_file).pipe(response);
                if(name){
                    // 다운로드 후 삭제
                    fs.unlinkSync(_file);
                    console.log('ZIP-DOWNLOAD 전송완료!',name,_file);
                    //response.end();
                }else{
                    console.log('DOWNLOAD 전송완료!',_file);
                }
                /**/
                var _stream = fs.createReadStream(_file);
                _stream.on('end',()=>{response.end();})
                _stream.on('close',(err)=>{
                    if(err){
                        console.log(err);
                        return;
                    }
                    // 다운로드 후 삭제
                    //fs.unlinkSync(xmlFilename);
                    if(name){
                        fs.unlinkSync(_file); // 이거 왜 안되지???
                        console.log('ZIP-DOWNLOAD 전송완료!',name,_file);
                        /*setTimeout( ((name,file)=>{
                            var n = name;
                            var f = file;
                            return ()=>{
                                fs.unlinkSync(f);
                                console.log('ZIP-DOWNLOAD 전송완료!',n,f);
                            }
                        })(name,_file), 30000); // 30초후 실행
                        */
                    }else{
                        console.log('DOWNLOAD 전송완료!',_file);
                    }
                });
                _stream.pipe(response);
                /**/


            }catch(err){
                if(isDebug) console.error(err.message);
            }
        }else{
            var _file = '';
            if(queryData.pathname=='/') _file='node/gameListIndex.html';
            else if(_url=='/lib.js'      ) _file='node/lib.js';
            else if(_url=='/sdimgs.js'   ) _file='node/sdimgs.js';          // SD이미지 경로
            else if(_url=='/logo.js'     ) _file='node/logo.js';            // SYSTEM 로고
            else if(_url=='/img/0013.gif') _file='node/img/0013.gif';       // 로딩중 이미지
            else if(_url=='/img/noimage.png') _file='node/img/noimage.png';       //  이미지
            else if(_url=='/file'        ) _file='node/filelistIndex.html'; // 파일목록조회화면
            else if(_url=='/rom'         ) _file='node/romlistIndex.html';  // 롬목록 조회화면
            else if(_url=='/test.js'     ) _file='node/grid/test.js';
            else if(_url=='/testGrid.js' ) _file='node/grid/testGrid.js';
            else if(_url=='/gamelistGrid.js' ) _file='node/grid/gamelistGrid.js';
            else _file = (_url.indexOf('es-theme-carbon')>0?__dirname:imgRoot) + decodeURIComponent(queryData.pathname);
            //response.sendFile(_file);  
			//console.log('_file:',_file);
            // 파일 읽기
            var contentType=_file.getContentType();
            //if(isDebug) console.log(`  _url: ${_url} ${imgRoot}`);
            //if(isDebug) console.log(`  file: ${_file}`);
            // 링크없이 이동된 경우 롬수집 경로로 대체
            if(!fs.existsSync(_file)) _file = ROMSHDD + decodeURIComponent(queryData.pathname);
            //_file = getLinkFile( decodeURIComponent(queryData.pathname) );
            if(contentType.indexOf('video')>=0){
                console.log('VideoFile:',_file);
                const stat = fs.statSync(_file);
                const fileSize = stat.size;
                const head = {
                    'Content-Length': fileSize,
                    'Content-Type': contentType,
                };
                console.log('Video:',_file.replace(imgRoot,'')); // 로그가 길어서...
                console.log('  Head:', head);
                response.writeHead(200, head);
                fs.createReadStream(_file).pipe(response);
            } else {
                fs.readFile(_file, function(error, content) {
                    if (error) {
                        if(isDebug) console.error('404:', error.message);
                        if(error.code == 'ENOENT'){ // 없는 파일/경로인 경우
                            //response.writeHead(200, { 'Content-Type': 'text:html' });
                            response.writeHead(404, { 'Content-Type': 'text:html' });
                            response.end(error.message, 'utf-8');
                        } else {
                            response.writeHead(500); // ??
                            response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                            response.end(); 
                        }
                    } else { // 컨텐츠 출력
                        response.writeHead(200, { 'Content-Type': contentType });
                        response.end(content, 'utf-8');
//                        console.log('  file readed!');
                    }
                    //console.timeEnd('timer');
                });
            }

        }
    }catch(err){
        console.error('[ TRY CATCH ERROR ] 941 Line ...');
        console.error(err);
//        response.writeHead(200, { 'Content-Type': contentType });
        response.writeHead(200, { 'Content-Type': 'text/html;charset=UTF-8' });
        response.end(err.stack, 'utf-8');
    }
};

var httpService = http.createServer(webService);
//httpService.listen(port,()=>{});

console.log('Server running at ');
var IPs = getServerIp(); // 서버 IP 추출
IPs.unshift('loaclhost','127.0.0.1'); // 배열 앞에 삽입(기본주소)
IPs.forEach(function(ip){
    if(ip == '192.168.1.103') isDebug=false; // 운영서버의 경우 디버깅 해제
    console.log(`  http://${ip}:${port}/`);
});
console.log(`isDebug: ${isDebug}`);

//---------------------------------------------------------------------------//
//소켓 처리
var io = require('socket.io')(httpService);
httpService.listen(port);
//httpService.listen(port,()=>{});

//const io = require('socket.io')(httpService, {cors: { origin:"*"}});

// 사용법: await sleep(1000)
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
///////////////////////////////////////////////////////////[느려서 사용않음]///
io.on('connection', (socket)=>{
    console.log('Socket connected! id:',socket.id);
//    socket.emit('message', socket.id + '연결 되었습니다.' ); // 데이타 보내기 (소켓명, 보낼 데이타)
    socket.emit('message', '소켓 연결 되었습니다.' ); // 데이타 보내기 (소켓명, 보낼 데이타)

    socket.on('message', (msg)=>{ // 데이타 받기 (소켓명, 보낸 데이타 처리 함수)
        //console.log(socket.id, msg);
        console.log(socket.id, '소켓 수신: ' + msg);
        if(msg.indexOf('system')>0){
            var queryData = new URL('http://loaclhost:10086' + msg);
            imgRoot = queryData.searchParams.get('sd');
            system  = queryData.searchParams.get('sid');
//            console.log(`소켓 SD Image Path : ${imgRoot}, system`);
            try{
                var xml = fs.readFileSync(imgRoot + '/share/roms/'+system+'/gamelist.xml', 'utf-8');
                parser.parseString(xml, function(err, result) {
                    if(err){
                        console.error('소켓 536:',err);
                    }else{
                        console.log(`소켓 XML[${system}] Total Game: ` + result.gameList.game.length );
                        var existsCnt = 0;

                        // 롬명으로 오름차순 정렬
                        result.gameList.game.sort(function(a, b)  {
                          if(a.name[0].toUpperCase() >   b.name[0].toUpperCase()) return  1;
                          if(a.name[0].toUpperCase() === b.name[0].toUpperCase()) return  0;
                          if(a.name[0].toUpperCase() <   b.name[0].toUpperCase()) return -1;
                        });

                        var i=0;
//                        var count = result.gameList.game.length;
                        io.emit('gamelistMax', result.gameList.game.length);
                        chkExists = new chkExistsObj(imgRoot, system, result);
                        chkExists.run();
                    }
                });
            }catch(e){
                console.error('329:',e);
            }
        }else{
        //console.log('소켓 수신: ' + msg);
//        socket.emit('message', 'Server : "${msg}" 받았습니다.');
            io.emit('message', `Server : "${msg}" 받았습니다. ${socket.id}`);
        }
    });
});

var chkExists;
var chkExistsObj = function(imgRoot,system,result){
    this.result = result;
    this.i=0;
    this.max = result.gameList.game.length;
    this.existsCnt=0;
    this.imgRoot=imgRoot;
    this.system=system;

    this.filesizeCount = 0;

    this.end = ()=>{
                        io.emit('gamelistCurrent', this.i );
                        console.log(`소켓 XML[${this.system}] Load: ${this.i}/${this.max}` );
                        console.log(`소켓 XML[${this.system}] Exists Total Game: ${this.existsCnt}` );
                        io.emit('gamelist', JSON.stringify(this.result) );
    }
    this.getfilesize = (idx)=>{
        try{
            //console.log('getfilesize idx',idx,this.result.gameList.game[idx].path[0]);
            // 경로가 포함된 항목들
            ['path','manual','marquee','image','thumbnail','boxart','boxback','cartridge',
             'fanart','mix','screenshot','titleshot','wheel'].forEach((val)=>{
                if(this.result.gameList.game[idx][val]){ // 항목이 있는경우
                    var _file = this.imgRoot+'/share/roms/'+this.system+'/'
                              + decodeURIComponent(this.result.gameList.game[idx][val][0]);
//                    try{
//                        this.result.gameList.game[idx][val+'size'] = fs.statSync(_file).size;
//                    }catch(e){};
                    console.log('>>>1<<<',idx, _file)
                    fs.stat(_file, ((i,name)=>{
                            return (err, stats) => {
                                console.log('>>>2<<<',idx, _file)
                                if(err){
                                    console.log('>>>3<<<',idx, _file, err)
                                }else {
                                    console.log('>>>4<<<',idx, _file)
                                    console.log(' size:', chkExists.result.gameList.game[i].name, stats.size);
                                    chkExists.result.gameList.game[i][name+'size'] = stats.size;
                                    chkExists.filesizeCount++;
                                }
                            }
                        })(idx,val)
                    );
                }
             })
        }catch(e){
            if(isDebug) console.error('소켓 590:',idx, e);
        }
    }
    this.run = ()=>{
            if(this.i>=this.max){
//                this.end();
                setTimeout(this.end, 0);
                return;
            }

                            io.emit('gamelistCurrent', this.i ); // 현재 진행 카운트
                            if(this.i%100 == 0) console.log(`소켓 XML[${this.system}] Load: ${this.i}/${this.max}` );

                            // 추가항목 - 화면처리용
                            this.result.gameList.game[this.i]['empty'     ] = 0; // 롬없음 여부
                            this.result.gameList.game[this.i]['pathsize'  ] = 0; // 롬파일 용량
                            this.result.gameList.game[this.i]['manualsize'] = 0; // 메뉴얼파일 용량

                            // xml 에 중복 롬 제거
                            var aRom = this.result.gameList.game[this.i].path[0];
                            for(var j=this.i+1; j<this.max; j++){
                                if( aRom == this.result.gameList.game[j].path[0]){
                                    this.result.gameList.game[this.i]['empty']=1;
                                }
                            }
                            if(isXmlDelGame(this.result.gameList.game[this.i])){
                                this.result.gameList.game[this.i]['empty']=1;
                            }else{
                                // 롬 경로
                                var rom = this.imgRoot + '/share/roms/'+this.system+'/'+aRom;
                                fs.exists(rom, ((i, obj)=>{
                                    var idx = i;
                                    //var result=rs;
                                    return (exists) => { 
                                        //console.log('fs.exists', idx, exists ? 'Found' : 'Not Found!', rom); 
                                        if(exists){
                                            if(fs.lstatSync(rom).isDirectory()){ // 디렉토리인 경우
                                                if(this.system=='windows') {
                                                    chkExists.existsCnt++;
                                                    console.log('idx', idx)
                                                    chkExists.getfilesize(idx);
                                                }else{
                                                    obj.empty=1;
                                                }
                                            }else{ // 파일인경우 
                                                chkExists.existsCnt++;
                                                console.log('idx', idx)
                                                chkExists.getfilesize(idx);
                                            }
                                        }else{
                                            obj.empty=1;
                                        }
                                    }
                                })(this.i, this.result.gameList.game[this.i]) ); 
                                /**/
                            };

                            // 인코딩 수행
                            ['name', 'desc', 'genre', 'family', 'developer',
                             'path', 'publisher', 'video', 'marque', 'image',
                             'thumbnail', 'marquee'].forEach((val)=>{
                                try{
                                    this.result.gameList.game[this.i][val][0] = encodeURIComponent(decodeURIComponent(this.result.gameList.game[this.i][val][0]));
                                }catch(e){}
                            });
        this.i++;
        setTimeout(this.run);

    }
}
