const process = require( 'child_process' );
const fs = require( 'fs' );
const sqlite3 = require('sqlite3').verbose(); // verbose모드 - stack trace 정보를 덧붙여줌.
const db =  new sqlite3.Database( __dirname+'/db/romfile.20231113.sqlite' );
var selSQL = "select uid, size, link, name, path, filepath, md5  from romfile where /**/link=0 and /**/md5 in ("
           + "    select md5 from (select count(md5) as cnt, size, name, path, md5  from romfile where link=0 and size>1024 group by md5 order by count(md5) desc, size desc)"
           + "     where cnt>1"
           + ")"
//           + " order by \"size\" desc, md5, path desc"
//           + " order by \"size\" desc, md5, uid DESC "
           + " order by \"size\" desc, md5 "
//           + " limit 0, 2";
//           + " limit 0, 7";
//           + " limit 0, 10";
//           + " limit 0, 500";
           + " limit 0, 1000";
const updateSQL = "UPDATE romfile SET link=1 WHERE uid=?";
const updateStmt = db.prepare(updateSQL);

var cmp = {md5:'Hyunee™'};
try{
    db.all(selSQL, (err,rows)=>{
        if(err) throw err;
        if(rows === undefined) console.log("결과 없음");
        //console.log(row);
        console.log("routeFilelist 조회완료 :", rows.length);
        //console.log(row);
        rows.forEach((row, idx) => {
            idx++;
//            console.log(row);
            if(row.md5 == cmp.md5){
                //console.error(`::index : ${idx} ==> ${cmp.idx}`);
                var txt = `${row.filepath}.txt`;

                //var isSymbolicLink = fs.existsSync(`${row.filepath}.txt`)?1:0;
                var isSymbolicLink = fs.existsSync(txt)?1:0;
                if(isSymbolicLink){
                    console.log(`${txt} 있음`);

                    if( fs.existsSync(row.filepath) ){
                        console.log(`fsutil hardlink list "${cmp.filepath}"`);
                        process.exec(`fsutil hardlink list "${cmp.filepath}"`, (err,stdout,stderr)=>{
                            if(err){
                                console.error(`exec error: ${err}`);
                                return;
                            }
                            console.log(stdout);
                            //console.log('DB Update!!');
                            /*
                            updateStmt.run(row.uid, err=>{
                                console.log(`    Update "${row.name}"`);
                            });
                            */
                            db.run(updateSQL,[row.uid], err=>{
                                if(err) throw err;
                                console.log(`  ${idx}  Update "${row.name}"`);
                            });
                            //db.serialize( () => {
                            //    db.run(updateSQL,[row.uid]);
                            //});
                        });
//                        updateStmt.run(row.uid);
                    } else {
                        //fs.unlinkSync(row.filepath);
                        fs.unlinkSync(txt);
                    }
//                    fs.renameSync(row.filepath+'_',row.filepath);
                    //updateStmt.run( row.uid );
                } else {
                    console.error(`"${row.filepath}" => "${cmp.filepath}"`);
//                    console.log  (`"${row.filepath}" => "${cmp.filepath}"`);

                    //console. log(`ren "${row.filepath}" "${row.filepath}_"`);
                    //process.exec(`ren "${row.filepath}" "${row.filepath}_"`);
                    //try{fs.renameSync(row.filepath, row.filepath+'_');}catch(e){console.log(`${row.filepath} 없음`);}
                    if( fs.existsSync(row.filepath) ) fs.unlinkSync(row.filepath);

//                    process.execSync(`echo ${row.path}^>mklink /h "${row.name}" "${cmp.filepath}" >> "${txt}"`);
                    var dospath = row.path.replace('&','^&');
                    process.execSync(`echo ${dospath}^>mklink /h "${row.name}" "${cmp.filepath}" >> "${txt}"`);
                    process.execSync(`mklink /h "${row.filepath}" "${cmp.filepath}" >> "${txt}"`);
                        process.exec(`fsutil hardlink list "${cmp.filepath}"`, (err,stdout,stderr)=>{
                            if(err){
                                console.error(`exec error: ${err}`);
                                return;
                            }
                            console.log(stdout);
                            //console.log('DB Update!!');
                            //updateStmt.run(row.uid, );
                            db.run(updateSQL,[row.uid], err=>{
                                if(err) throw err;
                                console.log(`  ${idx}  Update "${row.name}"`);
                            });
                        });
                }
                //updateStmt.run(row.uid);
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
