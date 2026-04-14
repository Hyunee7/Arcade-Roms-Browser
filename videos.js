const process = require( 'child_process' );
const fs = require( 'fs' );
const sqlite3 = require('sqlite3').verbose(); // verbose모드 - stack trace 정보를 덧붙여줌.
const db =  new sqlite3.Database( __dirname+'/db/romfile.20231113.sqlite' );
var selSQL = "select * from romfile where path='G:\\share\\roms\\잘목복사됨.videos' and link=1";

var cmp = {md5:'Hyunee™'};
try{
    db.all(selSQL, (err,rows)=>{
        if(err) throw err;
        if(rows === undefined) console.log("결과 없음");
        //console.log(row);
        console.log("routeFilelist 조회완료 :", rows.length);
        //console.log(row);
        rows.forEach((row, idx) => {
            console.log(row.filepath);
            if(fs.existsSync(row.filepath)) fs.unlinkSync(row.filepath);
        });
    });
}catch(err){
    console.log(err);
}

//db.close();
