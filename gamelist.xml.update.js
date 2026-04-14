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
Date.prototype.getDTTM1 = function(){ // 로그용 YYYYMMDDTHHMiSS 형식 시각
    with(this){
        return ''+getFullYear() + (getMonth()+1).to2() + getDate().to2()
             + 'T'
             + getHours().to2() + getMinutes().to2() + getSeconds().to2();
    }
}
Date.prototype.getDTTM2 = function(){ // 로그용 YYYYMMDD.HHMiSS(sss) 형식 시각
    with(this){
        return ''+getFullYear() + (getMonth()+1).to2() + getDate().to2()
             + '.'
             + getHours().to2() + getMinutes().to2() + getSeconds().to2()
             + '(' + getMilliseconds().to3() + ')';
    }
}

var fs     = require('fs');
var util   = require('util');
var path   = require("path");
// npm install sqlite3
const sqlite3 = require('sqlite3').verbose(); // verbose모드 - stack trace 정보를 덧붙여줌.
// npm install xml2js
var xml2js = require('xml2js');

/******************************************************************************
 * 함수
 ******************************************************************************/
/*
var log_stdout = process.stdout;
console.log = function(){
    log_stdout.write(new Date().getDTTM() + ' ' + util.format.apply(null,arguments) + '\n');
}
console.error = console.log;
*/

var sdimgpath;
var systempath;
// CREATED 채우기용
var getGamelistXmlCreated = (sdimg, system)=>{
    systempath = rootpath+'/'+sdimg+'/share/roms/'+system;
    //console.log(systempath);
    var lastdt = 'ZZZZZZZZZZZZZZZZZZZZZZZZ';
    var gamelistname = '';
    try{
        fs.readdirSync(systempath, {withFileTypes:true}).forEach(dir=>{
            if(dir.name.toUpperCase().indexOf('GAMELIST')>-1){
                var stats = fs.statSync(systempath+'/' + dir.name);

                if(lastdt > stats.mtime.getDTTM2()){
                    gamelistname = dir.name;
                    lastdt=stats.mtime.getDTTM2();
                }else{
                }
            }
        });
        if(lastdt!='ZZZZZZZZZZZZZZZZZZZZZZZZ'){
            //console.log('3', sdimg, system, gamelistname, lastdt);
            //ALTER TABLE gamelist ADD COLUMN created TEXT; -- 생성시각
            //ALTER TABLE gamelist ADD COLUMN modified TEXT; -- 수정시각
            var sql = "UPDATE gamelist set created='CREATED', modified='MODIFIED' WHERE sdimage='SDIMAGE' and system='SYSTEM';";
            console.log(sql.replace('CREATED', lastdt)
                           .replace('MODIFIED', lastdt)
                           .replace('SDIMAGE', sdimg)
                           .replace('SYSTEM', system));
        }
    }catch(e){
        console.error(e);
    }
}
/*
var sql = "SELECT distinct modified FROM gamelist WHERE sdimage='Batocera-V35-PC64-EspecialBase-64GB_03_09_2022' and system='supergrafx'";
        const _db =  new sqlite3.Database( __dirname+'/db/games.files.sqlite3' );
        _db.all(sql, (err,row)=>{
            if(err) throw err;
            if(row === undefined) console.log(" 조회완료 : 결과 없음");
            else{
                console.log(" 조회완료 :");
//            console.log(functionName + " 조회완료 :", row.length);
                console.log(row);
            }
            _db.close();
        });
return;
*/
// MODIFIED 
var getXmlUpdate = (sdimg, system, modified)=>{
    systempath = rootpath+'/'+sdimg+'/share/roms/'+system;
    var xml = fs.readFileSync(systempath + '/gamelist.xml', 'utf-8');
    parser.parseString(xml, function(err, result) {
        if(err){
            //console.log('err',err);
            return;
        }
        try {

            result.gameList.game.forEach(function(rom,idx,data){
                try {
                    var updateSql = [];
                    var name = '';
                    var path = '';
                    for(var key in rom){ // update set 항목 생성
                        if(key == 'name'){ // where 항목
                            name = rom[key][0].replace(/'/g,"''").replace(/\n/g,'\\n');
                            continue;
                        }
                        if(key == 'path'){ // 2023-10-19 중복이 많아서 where 항목 추가함
                            path = rom[key][0].replace(/'/g,"''");
                            continue;
                        }
                        var tmp = '';
                        if(key=='$'){
                            tmp = JSON.stringify(rom[key]);
                            updateSql.push( "_self='" + tmp + "'" );
                        }else if( key=='scrap'){
                            tmp = JSON.stringify(rom[key]);
                            updateSql.push( key + "='" + tmp + "'" );
                        } else {
                            try{
                                tmp = rom[key][0].replace(/'/g,"''").replace(/\n/g,'\\n');
                            }catch(e){
                                tmp = JSON.stringify(rom[key]);
                            }
                            updateSql.push( key + "='" + tmp + "'" );
                        }
                    }
                    var sql = "UPDATE gamelist SET modified='MODIFIED', UPDATESQL "
                            + "WHERE sdimage='SDIMAGE' AND system='SYSTEM' AND name='NAME' AND path='PATH';";
                    console.log(sql.replace('MODIFIED',modified)
                                   .replace('SDIMAGE', sdimg)
                                   .replace('SYSTEM', system)
                                   .replace('NAME', name)
                                   .replace('PATH', path)
                                   .replace('UPDATESQL', updateSql.join()));
                } catch(err) {
                    console.error(err)
                }
            });

        } catch (e) {
            //console.log( " > ",rompath," : 없음 /", e.message);
        }
    });
}
// MODIFIED 
var getGamelistXml = (sdimg, system)=>{
    var functionName = 'getGamelistXml';
    systempath = rootpath+'/'+sdimg+'/share/roms/'+system;
    //console.log(systempath);
    var lastdt = 'ZZZZZZZZZZZZZZZZZZZZZZZZ';
    var gamelistname = '';
    try{
        var modified = '';
        try{
            var stats = fs.statSync(systempath+'/gamelist.xml');
            modified = stats.mtime.getDTTM2();
        }catch(e){
            return;
        }
        const db =  new sqlite3.Database( __dirname+'/db/games.files.sqlite3' );
        var sql = "SELECT distinct modified FROM gamelist WHERE sdimage='SDIMAGE' and system='SYSTEM'"
                 .replace('SDIMAGE', sdimg)
                 .replace('SYSTEM', system);
        //console.log(sql);
        //console.log(functionName + " 조회시작");
        //console.time(functionName+sdimg+system);
        db.all(sql, (err,row)=>{
            if(err) throw err;
            if(row === undefined) console.log(functionName + " 조회완료 : 결과 없음");
            else{
                //console.log(functionName + " 조회완료 :");
//            console.log(functionName + " 조회완료 :", row.length);
                //console.log(row);
                if(row.length){
                    if(modified>row[0].modified) {
                        //console.log(row[0].modified)
                        /*
                        var sql = "UPDATE gamelist set modified='MODIFIED' WHERE sdimage='SDIMAGE' and system='SYSTEM';";
                        console.log(sql.replace('MODIFIED', modified)
                                       .replace('SDIMAGE', sdimg)
                                       .replace('SYSTEM', system));
                        */
                        if(isRedirect){
                            //console.error(sdimg, system, row[0].modified, modified);
                            //console.error(` select name, path, count(path) as cnt\n  from gamelist\n where sdimage='${sdimg}' and system='${system}'\n group by name\n order by count("path") desc`);
                            console.error(`        SELECT sdimage, system, name, path, COUNT(path) AS cnt\n         FROM gamelist\n        WHERE sdimage='${sdimg}' AND system='${system}'\n        GROUP BY name`);
                            console.error('\n        UNION ALL\n');
                        }
                        getXmlUpdate(sdimg, system, modified);
                    }
                }
            }
            db.close();
            //console.timeEnd(functionName+sdimg+system);
        });

    }catch(e){
        console.error(e);
    }
}

var getSystems = sdimg=>{
    sdimgpath = rootpath+'/'+sdimg;
//    console.log('46 basepath:',basepath)
    fs.readdirSync(`${rootpath}/${sdimg}/share/roms`, {withFileTypes:true}).forEach(system=>{
        if(!system.isDirectory()){
            //console.error('시스템 디렉토리 아님:', system.name);
            return true;
        }
        //console.log(system.name);
        getGamelistXml(sdimg, system.name);
    });
}

/******************************************************************************
 * 시작
 ******************************************************************************/
var parser = new xml2js.Parser();
const db =  new sqlite3.Database( __dirname+'/db/games.files.sqlite3' );

if(process.argv[2]) console.error('process.argv[2]',process.argv[2]);
if(process.argv[3]) console.error('process.argv[3]',process.argv[3]); // 값이 있으면 redirect 용 출력 (컬러 없음)

var rootpath = path.normalize(__dirname+'\\..');
var sdimgpath = process.argv[2]?process.argv[2]:rootpath;
var isRedirect = process.argv[3]?true:false;
var isAll = process.argv[2]=='all'?true:false;

if(isAll){
    fs.readdirSync(rootpath, {withFileTypes:true}).forEach(sdimg=>{
        if(sdimg.name.toUpperCase().indexOf('BATOCERA')>=0 || sdimg.name == '[23gb]R-Bat-128GB'){ // sd이미지
            getSystems(sdimg.name);
        }
    });
} else {
    console.log('70 rootpath:',rootpath);
}
