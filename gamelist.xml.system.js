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
             + 'T'
             + getHours().to2() + getMinutes().to2() + getSeconds().to2()
             + '(' + getMilliseconds().to3() + ')';
    }
}

var fs     = require('fs');
var util   = require('util');
var path   = require("path");
// npm install xml2js
var xml2js = require('xml2js');

/******************************************************************************
 * 함수
 ******************************************************************************/

var sdimgpath;
var systempath;
var xmlData = {};

// gamelist.xml 읽음
var getXmlAdd = (sdimg, system)=>{
    systempath = rootpath+'/'+sdimg+'/share/roms/'+system;
    try{
        var xml = fs.readFileSync(systempath + '/gamelist.xml', 'utf-8');
        parser.parseString(xml, function(err, result) {
            if(err){
                console.log('47 err',err);
                return;
            }
            try {
                if(!xmlData[ system ]) xmlData[system] = {gameList:{game:[]}}; // 최초 생성
                result.gameList.game.forEach(val=>{
                    xmlData[system].gameList.game.push(val);
                })
            } catch (e) {
                console.log( " > ",rompath," : 없음 /", e.message);
            }
        });
    }catch(e){
        //console.error('61 :',e);
    }
}

// 시스템목록 읽음
var getSystems = sdimg=>{
    sdimgpath = rootpath+'/'+sdimg;
    try{
        fs.readdirSync(`${rootpath}/${sdimg}/share/roms`, {withFileTypes:true}).forEach(system=>{
            if(!system.isDirectory()){
                //console.error('시스템 디렉토리 아님:', system.name);
                return true;
            }
            getXmlAdd(sdimg, system.name);
        });
    }catch(e){
        console.error('77 :',e);
    }
}

/******************************************************************************
 * 시작
 ******************************************************************************/
var parser = new xml2js.Parser();

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
    var pDate = new Date().getDTTM2();
    var basedir = `${__dirname}/xml/${pDate}`;
//    fs.mkdir(base)
    // 시스템의 gamelist.xml 저장
    for(var key in xmlData){
        // 롬명으로 오름차순 정렬
        xmlData[key].gameList.game.sort(function(a, b)  {
           if(a.name[0].toUpperCase() >   b.name[0].toUpperCase()) return  1;
           if(a.name[0].toUpperCase() === b.name[0].toUpperCase()) return  0;
           if(a.name[0].toUpperCase() <   b.name[0].toUpperCase()) return -1;
        });
        const builder = new xml2js.Builder();
        const romXml = builder.buildObject(xmlData[key]);
        var dirPath = basedir+'/'+key;
        fs.mkdirSync( dirPath, { recursive: true } );
        var xml_filename = `${dirPath}/gamelist.xml`;
        console.log('xml_filename:',xml_filename);
        fs.writeFileSync(xml_filename, romXml);
        console.log(key+' XML 생성완료!');
    }
} else {
    console.log('70 rootpath:',rootpath);
}
