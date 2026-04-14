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
Date.prototype.getDTTM2 = function(){ // 로그용 YYYY-MM-DD HH:Mi:SS.sss 형식 시각
    with(this){
        return ''+getFullYear() + (getMonth()+1).to2() + getDate().to2()
             + '.'
             + getHours().to2() + getMinutes().to2() + getSeconds().to2()
             + '(' + getMilliseconds().to3() + ')';
    }
}

// npm install sqlite3
const sqlite3 = require('sqlite3').verbose(); // verbose모드 - stack trace 정보를 덧붙여줌.
// npm install xml2js
var xml2js = require('xml2js');
var fs     = require('fs');
var path   = require("path");

var parser = new xml2js.Parser();
//const db =  new sqlite3.Database( 'gamelist.sqlite3' );
//const filelist =  new sqlite3.Database( 'filelist.sqlite' );

var fields = {};
var system = '';
var romPathIsDirectorySystem  = false;
var 누락목록 = {};
var romspath = '';

// 디렉토리 용량 구하기
function getDirSize(path){
    var size = -1;
    var basePath=dFile + '/share/roms/'+system+'/';
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

function gameList(system){
    var ret = {xml:0,exists:0,except:0,utelatelse:0,objs:0,files:0,directorys:0,systemsize:0};
    var romfile = [];
    var filesize = 0;

    rompath = romspath+system+'/';
    //console.log('rompath:',rompath);
    system =system;
    누락목록[system]=[];
    romPathIsDirectorySystem = ['windows','scummvm'].indexOf(system) > -1;

    try{
        fs.readdirSync(rompath, {withFileTypes:true}).forEach(p=>{
            filesize = 0;

            if(p.isFile()){
                if(p.name.indexOf('.xml')>0) return;
                if(p.name.indexOf('.txt')>0) return;
                if(p.name.indexOf('.nv' )>0) return;
                if(p.name.indexOf('.gdi')>0) return;
                if(p.name.indexOf('.cue')>0) return;
                if(p.name.indexOf('.m3u')>0) return;
                if(p.name.indexOf('.srm')>0) return;
                if(p.name.indexOf('.lst')>0) return;
                if(p.name.indexOf('.eeprom')>0) return;
                if(p.name.indexOf('.nvmem')>0) return;

                filesize = fs.statSync(`${rompath}/${p.name}`).size;
            }else{
                filesize = getDirSize(p.name);
            }
            romfile.push({name:p.name, type:p.isFile()?'file':'directory', size:filesize});
            p.isFile() ? ret.files++ : ret.directorys++;
            ret.systemsize += filesize;
        });
    }catch(e){
        //console.log(`90    ${rompath}`);
    }
    ret.objs = romfile.length;

    try {
        var xml = fs.readFileSync(rompath + 'gamelist.xml', 'utf-8');
        parser.parseString(xml, function(err, result) {
            if(err){
                console.log('err',err);
                return;
            }
            try {
                ret.xml = result.gameList.game.length;
                var existsCnt = 0;

                result.gameList.game.sort(function(a, b)  {
                  if(a.name > b.name) return 1;
                  if(a.name === b.name) return 0;
                  if(a.name < b.name) return -1;
                });
                
                // xml 에 중복 롬 제거
                for(var i=0; i<result.gameList.game.length-1; i++){
                    var aRom = result.gameList.game[i].path[0];
                    for(var j=i+1; j<result.gameList.game.length; j++){
                        if( aRom == result.gameList.game[j].path[0]){
                            result.gameList.game.splice(j,1); // 중복 제거
                        }
                    }
//                    var idx = result.gameList.game.findIndex(function(item) {return item.f1 === 1}) // findIndex = find + indexOf
//                    if (idx > -1) a.splice(idx, 1)
                }

                result.gameList.game.forEach(function(obj,idx,data){
                    try {
                        /**/
                        var _excep = false;
                        // xml 파일이면 제외함
                        if(obj.path[0].indexOf('.xml')>0) _excep=true;
                        // bios 제외
                        if(obj.path[0].indexOf('cpzn1')>0) _excep=true;
                        if(obj.path[0].indexOf('cpzn2')>0) _excep=true;
                        if(obj.path[0].indexOf('decocass')>0) _excep=true;
                        if(obj.path[0].indexOf('galpandx')>0) _excep=true;
                        if(obj.path[0].indexOf('konamigx')>0) _excep=true;
                        if(obj.path[0].indexOf('megaplay')>0) _excep=true;
                        if(obj.path[0].indexOf('megatech')>0) _excep=true;
                        if(obj.path[0].indexOf('neogeo')>0) _excep=true;
                        if(obj.path[0].indexOf('pgm')>0) _excep=true;
                        if(obj.path[0].indexOf('playch10')>0) _excep=true;
                        if(obj.path[0].indexOf('skns')>0) _excep=true;
                        if(obj.path[0].indexOf('stvbios')>0) _excep=true;
                        if(obj.path[0].indexOf('taitofx1')>0) _excep=true;
                        if(obj.path[0].indexOf('tps')>0) _excep=true;
                        // 제목에 notgame 이 있으면 제외함
                        if(obj.name[0].indexOf('notgame')>0) _excep=true;
                        // hidden 이 true 이면 제외함
                        if(obj['hidden']) if(obj['hidden'][0]=='true') _excep=true;

                        if(_excep){ //제외
                            ret.except++;
                            return;
                        }
                        // 롬 경로
                        var rom = rompath+'/'+obj.path[0];
                        // 파일이 존재하고, 디렉토리가 아닌경우
                        //if (fs.existsSync(rom) && !fs.lstatSync(rom).isDirectory()) {
                        if (fs.existsSync(rom)){ // 존재하는 경로
                            if(fs.lstatSync(rom).isDirectory()){ // 디렉토리인 경우
                                if(system == 'windows' || system == 'scummvm') { // 시스템이 windows 인경우 존재 하는롬으로 인정 
                                    existsCnt++;
                                    // 있는 롬 타이틀명 출력
                                    // console.log(existsCnt, obj.name[0]);
                                }
                            }else{ // 파일인경우 
                                existsCnt++;
                                // 있는 롬 타이틀명 출력
                                // console.log(existsCnt, obj.name[0]);
                            }
                        }
                        obj['_system']=system;
                        obj['_sdimage']=path.basename(dFile);
                    } catch(err) {
                        console.error(err)
                    }
                });
                ret.exists=existsCnt;

                // 파일은 있으나 xml 에 없는 롬-누락
                var _cnt = 0;
                var pathfield = ['path','manual','video','marquee','image','thumbnail','boxart','boxback','cartridge',
                                 'fanart','mix','screenshot','titleshot','wheel']
                romfile.forEach(val=>{
                    var check = 1;
                    var games = result.gameList.game;
                    var f;
                    var p
                    for(var _j=0; _j<games.length; _j++){
                        var _break = 0;
                        for(var _i=0; _i<pathfield.length; _i++){
                            if(games[_j][ pathfield[_i] ]){
                                if(games[_j][ pathfield[_i] ][0].indexOf(val.name)>-1){
                                    check = 0;
                                    _break = 1;
                                    break;
                                }
                            }
                        }
                        if(_break) break;
                    }
                    if(check){
                        _cnt++;
                        누락목록[system].push(val);
                        if(!isRedirect)console.log(`   누락 ${_cnt} :`, val);
                    }
                });
                ret.utelatelse = _cnt;
            } catch (e) {
                console.log( " > ",rompath," : 없음 /", e.message);
            }
        //  console.log( JSON.stringify(result) );
        });
    } catch (e) {
        //console.log( " > Total Game : 없음" );
        //console.error('215:',e);
        //console.error('216:',e.code,e.path);
//        console.log('Error Message :', e.message);
        //      list = '<pre>'+e.message+'</pre>';
        //console.log(`218    ${rompath}\\gamelist.xml 없음`);
    } 
    return ret;
}

function fieldsGet(obj, target){
    for(var key in obj){
        try {
            if(obj[key]) {
                //if(key=='cover') console.log('cover:',obj[key]);
                if(!target[key]) target[key]={};
                if(Array.isArray(obj[key])){
                    if(typeof obj[key][0]=='object'){
                        fieldsGet(obj[key][0], target[key]);
                    }else
                        //target[key] = obj[key][0];
                        if((target[key].length||0) < (''+obj[key][0]).length){
                            //if(key == 'players') console.log('[0]', target[key].length, obj[key][0].length, (target[key].length||0) < obj[key][0].length, target[key], obj[key][0]);
                            target[key] = obj[key][0]||'';
                        }
                }else{
                    if(typeof obj[key]=='object'){
                        fieldsGet(obj[key], target[key]);
                    }else
                        //target[key] = obj[key];
                        if((target[key].length||0) < (''+obj[key]).length){
                            //if(key == 'players') console.log('   ', target[key].length, obj[key].length, (target[key].length||0) < obj[key].length, target[key], obj[key]);
                            target[key] = obj[key]||'';
                        }
                }
            }
        } catch(err) {
            console.log('243 :', key)
            console.error('244 :', err)
        }
    }
}

// 경로 전체용량 구함. 없으면 -1 반환
function getPathSize(sdimage, system, _path){
    var _size=-1;
    try {

        var romFile = `${rootpath}/${sdimage}/share/roms/${system}/${_path}`;
        if (!fs.existsSync(romFile)){ // 존재하는 경로
            return -1;
        }

        if( system == 'windows' || system == 'scummvm' ){ // 롬 경로가 디렉토리인 시스템이면
            _size = getDirSize(_path.split('/').slice(0,2).join('/'));
        } else if(fs.lstatSync(romFile).isDirectory()){
            //console.log(_path, path.extname(_path));
            if(path.extname(_path)=='.game') _size = getDirSize(_path.replace('.game',''));
            else                             _size = getDirSize(_path);
        } else {
            var _romname = path.basename(_path);
            var _rompath = _path.replace(_romname,'');
            if(path.extname(_path) == '.gdi' || path.extname(_path) == '.cue' || path.extname(_path) == '.lst'){
                var data = fs.readFileSync(romFile, 'utf-8');
                //console.log(_path);
                var dataArr = data.replace(/\r/g,'').split('\n');
                dataArr.push(`"${_romname}"`);
                //console.log(dataArr)
                for(var ii=0; ii<dataArr.length; ii++){
                    try{
                        var _romfile = rootpath+'/'+sdimage+'/share/roms/'+system+'/'+_rompath+ dataArr[ii].match(/"(.*)"/)[1];
                        //console.log(_romfile);
                        _size += fs.statSync(_romfile).size;
                        //console.log('   ',_path, _size);
                    }catch(e){
                        //console.error(e)
                        //console.log('    ',e)
                    }
                }
            }else if(path.extname(_path) == '.m3u'){
                var data = fs.readFileSync(romFile, 'utf-8');
                var dataArr = data.replace(/\r/g,'').split('\n');
                dataArr.push(_romname);
                for(var ii=0; ii<dataArr.length; ii++){
                    try{
                        var _romfile = rootpath+'/'+sdimage+'/share/roms/'+system+'/'+_rompath+ dataArr[ii];
                        _size += fs.statSync(_romfile).size;
                    }catch(e){
                        //console.error(e)
                    }
                }
            }else{
                try{
                    const stat = fs.statSync(romFile);
                    const fileSize = stat.size;
                    _size = fileSize;
                }catch(e){
                    if(isDebug) console.error('  Filsize:',i, e);
                }
            }
        }
    }catch(e){
        //console.error('302:', e.message)
        if(e.code != 'ENOENT') console.error('303:', e.message)
    }
    return _size;
}

if(process.argv[2]) console.error('process.argv[2]',process.argv[2]);
if(process.argv[3]) console.error('process.argv[3]',process.argv[3]); // 값이 있으면 redirect 용 출력 (컬러 없음)

var dFile = process.argv[2]?process.argv[2]:"D:/Batocera";
var isRedirect = process.argv[3]?true:false;
var rootpath = path.normalize(__dirname+'\\..');

// gameslist.xml 전체 항목조사
// 이미지전체 xml 의 필드 조회 - 실행 : node gamelist.js field
// 전체 image gamelist 항목정보 : node gamelist.js field      화면출력용
// 전체 image gamelist 항목정보 : node gamelist.js field 1    리다이렉션용
// 전체 image gamelist 항목 sqlite3저장 : node gamelist.js sqlite  화면출력용?
// 전체 image 게임정보 : node gamelist.js all      화면출력용
//                       node gamelist.js all 1    리다이렉트용
// 개별 image 게임정보 : node gamelist.js "e:\batocera\batocera_DVI [29.8GB]"      화면출력용
//                       node gamelist.js "e:\batocera\batocera_DVI [29.8GB]" 1    리다이렉트용
// 전체 image 의 roms 이하 파일 목록 : node gamelist.js filelist 1      화면출력용
if(dFile == 'fields' || dFile == 'sqlite' || dFile == 'all' || dFile=='filelist'){
    var countimg = 0;
    var isAll = dFile=='all'?true:false;
    var isFields = dFile=='fields'?true:dFile=='sqlite'?true:dFile=='filelist'?true:false;
    var isSqlite = dFile=='sqlite'?true:false;
    var isFilelist = dFile=='filelist'?true:false;

    fs.readdirSync(rootpath, {withFileTypes:true}).forEach(img=>{
//        if(img.name.toUpperCase().indexOf('BATOCERA')>=0){
//        if(img.name == '[23gb]R-Bat-128GB'){ // 누락된 롬 이미지
//        if(img.name == 'Batocera-V38-Parceiros-PC64-64GB_21_10_2023'){ // 2023-10-24 추가된 롬 이미지
//        if(img.name == '[23gb]R-Bat-128GB' || img.name == 'Batocera-V38-Parceiros-PC64-64GB_21_10_2023'){ // 2023-10-24 추가된 롬 이미지
        if(img.name == 'Batocera-V38-Parceiros-PC64-16GB_21_10_2023'){ // 2023-10-27 추가된 롬 이미지
            countimg++;
            //console.log(countimg.to2()+ `. [${img.name}]`);
            if(isRedirect) console.error(countimg.to2() + `. [${img.name}]`);
            dFile = `${rootpath}\\${img.name}`;
            if(isAll){
                console.log('* system [ xml중 존재하는 롬 / xml의 롬 개수]\n');
                getSystemInfo(`${rootpath}/${img.name}`);
            }
            if(isFields){
                try{
                    fs.readdirSync(`${rootpath}/${img.name}/share/roms`, {withFileTypes:true}).forEach(_system=>{
                        if(_system.isFile()){
                            console.log(`    ${rootpath}\\${img.name}\\share\\roms\\${_system.name}`);
                        } else {
                            try{
                                system = _system.name;

                                if(isSqlite) console.error('   ', system);
                                if(isRedirect) console.error(countimg.to2() + `. [${img.name}]`, system);
                                if(isFilelist){
                                    //var insertStmt = filelist.prepare('INSERT INTO filelist (sdimage, system, size, ext, ename, path) VALUES(?, ?, ?, ?, ?, ?)');
                                    
                                    function getFilelistsize(_path){
                                        fs.readdirSync(_path, {withFileTypes:true}).forEach(dir=>{
                                            var _fullpath = `${_path}/${dir.name}`;
                                            if(dir.isDirectory()) getFilelistsize(_fullpath);
                                            else {
                                                var dirSize = fs.statSync(_fullpath).size;
                                                var filesize = `000000000000${dirSize}`.substr(-12);
                                                var ext = path.extname(dir.name);
                                                //console.log(`${filesize }\t${ext}\t${dir.name}\t${_fullpath}`.replace(/\//g,'\\').replace('node\\..\\',''));
                                                var _fp =  path.normalize(_fullpath);
                                                console.log(`${img.name}\t${system}\t${dirSize}\t${ext}\t${dir.name}\t${_fp}`.replace(/\//g,'\\'));
                                                //insertStmt.run(img.name, system, dirSize, ext, dir.name, _fullpath.replace(/\//g,'\\').replace('node\\..\\','') );
                                            }
                                        });
                                    }
                                    getFilelistsize(`${rootpath}\\${img.name}\\share\\roms\\${_system.name}`);
                                    return;
                                }
                                var xml = fs.readFileSync(`${rootpath}/${img.name}/share/roms/${_system.name}/gamelist.xml`, 'utf-8');
                                parser.parseString(xml, (err, result)=>{
                                    if(err){
                                        console.log(`    ${rootpath}/${img.name}/${_system.name}/gamelist.xml ParseError`, e);
                                    }else{
                                        try {
                                            result.gameList.game.forEach((obj,idx,data)=>{
                                                // 추가항목
                                                obj['sdimage'] = img.name; // 이미지명
                                                obj['system' ] = system;   // 시스템명
                                                obj['empty'  ] = 'true';   // 롬 없음

                                                /**/
                                                // 경로가 포함된 항목이면 경로의 파일 용량 구함.
                                                ['path', 'manual', 'marquee', 'image', 'video', 'thumbnail', 'fanart', 'screenshot', 'mix', 'cartridge',
                                                 'boxback', 'boxart', 'wheel', 'titleshot', 'map', 'news', 'bezel'].forEach((val)=>{
                                                    if(obj[val]){ // 항목이 있는경우
                                                        // 용량구하기
                                                        obj[val+'size'] = getPathSize(img.name, _system.name, obj[val][0]);
                                                        // path의 용량이 -1이면 없는 롬
                                                        if(val=='path') if(obj[val+'size'] >= 0) obj['empty' ] = 'false'; // 존재하는 롬
                                                    }
                                                });
                                                /**/
                                                if(isSqlite) {
                                                    /**/
                                                    var sql = 'INSERT INTO gamelist(!FIELDS!) VALUES(!VALUES!)';
                                                    var _fields=[];
                                                    var keys=[];
                                                    var fieldvalues=[];
                                                    var values=[];
                                                    for(var key in obj){
                                                        fieldvalues.push('?');
                                                        if(key == '$' ){
                                                            keys  .push( '_self' );
                                                            _fields.push({key:key, value:JSON.stringify(obj[key][0])});
                                                            values.push( JSON.stringify(obj[key][0]) );
                                                        }else if(key=='scrap'){
                                                            keys  .push( key );
                                                            _fields.push({key:key, value:JSON.stringify(obj[key][0])});
                                                            values.push( JSON.stringify(obj[key][0]) );
                                                        } else {
                                                            keys  .push( key );
                                                            //_fields.push(key);
                                                            if(Array.isArray(obj[key])){
                                                                _fields.push({key:key, value:obj[key][0]});
                                                                values.push( obj[key][0] );
                                                            }else{
                                                                _fields.push({key:key, value:obj[key]});
                                                                values.push( obj[key] );
                                                            }
                                                        }
                                                    }
                                                    // 느려서 폐기함
                                                    //var insertSql = sql.replace(/!FIELDS!/,keys.join()).replace(/!VALUES!/,fieldvalues.join());
                                                    //insertStmt = db.prepare(insertSql);
                                                    //insertStmt.run(values);
                                                    // sql용
                                                    values.forEach((item,idx)=>{
                                                        try{
                                                            values[idx] = item.replace(/'/g,"''")
                                                                              .replace(/\n/g,'\\n');
                                                        }catch(e){}
                                                    });
                                                    console.log(sql.replace(/!FIELDS!/,keys.join())
                                                                   .replace(/!VALUES!/,"'"+values.join("','")+"'")
                                                               +';');
                                                    // cvs용
                                                    //console.log(values.join('\t'));
                                                    /**/
                                                } else {
                                                    // 항목추출
                                                    fieldsGet(obj, fields);
                                                }
                                            });
                                        }catch(e){
                                            console.error('    XML fieldsGet ERR',`${rootpath}\\${img.name}\\share\\roms\\${_system.name}\\gamelist.xml`,e);
                                        }
                                    }
                                });
                            }catch(e){
                                //console.error('457:', e);
                            }
                        } // if(_system.isFile()){ ... } else {
                    }); // fs.readdirSync(`${rootpath}/${img.name}/share/roms`, {withFileTypes:true}).forEach(_system=>{
                } catch(e) {
                    console.error(`301    ${rootpath}\\${img.name}`, e);
                }
            } // if(dFile=='fields'){
        } // if(img.name.toUpperCase().indexOf('BATOCERA')>=0){
    }); // fs.readdirSync(rootpath, {withFileTypes:true}).forEach(img=>{
    //if(isFields ^ isSqlite ^ isFilelist) console.log( "Fields :", fields  );
    if(isSqlite){
        //db.close();
        //filelist.close();
    }
    return;
} else { //if(dFile == 'fields'){
    console.log('* system [ xml중 존재하는 롬 / xml의 롬 개수]\n');
    getSystemInfo(dFile)
} //if(dFile == 'fields'){...} else {


function getSystemInfo(dFile){
    var total = 0;
    try{
        romspath = dFile+(dFile.indexOf('roms')>0?'/':"/share/roms/");
        console.log(dFile, romspath);
        fs.readdirSync(romspath).forEach(_filelist=>{
            system = _filelist;
            var count = gameList( _filelist );
            //console.log('count:',count);
            total+=count.exists;
            var msg = _filelist + ' [ ' + count.exists + '/' + count.xml + ' ]';
            var isprint = false;
            for(var key in count){ // 숫자 3자리 , 추가
                if(count[key] > 0) isprint = true;
                if(key=='exists') continue;
                count[key] = count[key].format();
            };

            if(count.exists){
                if(!isRedirect) console.log('\x1b[36m%s\x1b[0m', '+ '+msg+' ... '+total+ JSON.stringify(count));  //cyan
                else           console.log('+ '+msg+' ... '+total +' ' + JSON.stringify(count));  //cyan
            }else{
                if(isprint){
                    if(!isRedirect) console.log('\x1b[90m%s\x1b[0m', '  '+msg +' ' + JSON.stringify(count));  //FgGray
                    else           console.log('  '+msg, JSON.stringify(count));  //FgGray
                }
            }

            if(isRedirect){
                if(누락목록[system].langth) console.log('   =[누락 항목]=====');
                누락목록[system].forEach((누락,i)=>{
                    //console.log('    누락 '+(i+1).to2() + ' ' + JSON.stringify(누락));
                    var 정보 = '';
                    if(누락.type == 'file') 정보+=`./${누락.name}`;
                    else                    정보+=`./${누락.name}/`;
                    정보 += "\t" + 누락.size.format();

                    console.log('    '+(i+1).to2() + ' ' + 정보);
                });
                누락목록 = [];
            }
        });
    }catch(e){
        console.error('338:',e);
        //console.log('    ',e);
        //console.log(`    ${rootpath}\\${img.name}\\share\\roms\\${system.name}`);
    }
    console.log( "Total Games :", total  );
    /** /
    console.log( "\n---\n" );
    console.log( "Fields :", fields  );
    /**/
    console.log( "-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-" );
    console.log( "\n\n" );
}


/******************************************************************
console.log('\x1b[36m%s\x1b[0m', 'I am cyan');  //cyan
console.log('\x1b[33m%s\x1b[0m', stringToMakeYellow);  //yellow

Colors reference

Reset = "\x1b[0m"
Bright = "\x1b[1m"
Dim = "\x1b[2m"
Underscore = "\x1b[4m"
Blink = "\x1b[5m"
Reverse = "\x1b[7m"
Hidden = "\x1b[8m"

FgBlack = "\x1b[30m"
FgRed = "\x1b[31m"
FgGreen = "\x1b[32m"
FgYellow = "\x1b[33m"
FgBlue = "\x1b[34m"
FgMagenta = "\x1b[35m"
FgCyan = "\x1b[36m"
FgWhite = "\x1b[37m"
FgGray = "\x1b[90m"

BgBlack = "\x1b[40m"
BgRed = "\x1b[41m"
BgGreen = "\x1b[42m"
BgYellow = "\x1b[43m"
BgBlue = "\x1b[44m"
BgMagenta = "\x1b[45m"
BgCyan = "\x1b[46m"
BgWhite = "\x1b[47m"
BgGray = "\x1b[100m"
******************************************************************/