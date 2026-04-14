const process = require( 'child_process' );
const fs = require( 'fs' );
const sqlite3 = require('sqlite3').verbose(); // verbose모드 - stack trace 정보를 덧붙여줌.
const db =  new sqlite3.Database( 'D:\\Batocera\\svn\\db\\romfile.20231111.sqlite' );
var selSQL = "select uid, size, link, name, path, filepath, md5  from romfile where /**/link=0 and /**/md5 in ("
           + "    select md5 from (select count(md5) as cnt, size, name, path, md5  from romfile where link=0 and size>1000000 group by md5 order by count(md5) desc, size desc)"
           + "     where cnt>1"
           + ")"
//           + " order by \"size\" desc, md5, path desc"
//           + " order by \"size\" desc, md5, uid DESC "
           + " order by \"size\" desc, md5 "
//           + " limit 0, 2";
//           + " limit 0, 7";
           + " limit 0, 10";
const updateSQL = "update romfile set link=1 where uid=?";
const updateStmt = db.prepare(updateSQL);

var cmp = {md5:'Hyunee™'};
try{
    db.all(selSQL, (err,rows)=>{
        if(err) throw err;
        if(rows === undefined) console.log("결과 없음");
        console.error("routeFilelist 조회완료 :", rows.length);
        rows.forEach((row, idx) => {
            idx++;
            if(row.md5 == cmp.md5){
                console.log(`::index : ${idx} ==> ${cmp.idx}`);
                console.log(`start explorer "${row.path}"`);
                console.log(`cd "${row.path}"`);
                console.log(`ren "${row.name}" "${row.name}_"`);
                console.log(`echo ${row.path}^>mklink /h "${row.name}" "${cmp.filepath}" >> "${row.name}.txt"`);
                console.log(`mklink /h "${row.name}" "${cmp.filepath}" >> "${row.name}.txt"`);
                console.log(' ');
            } else {
                cmp = row;
                cmp.idx = idx;
            }
        });
    });
}catch(err){
    console.log(err);
}

//db.close();
