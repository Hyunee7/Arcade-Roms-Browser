var fs     = require('fs');
var crypto = require('crypto');
var path   = require("path");

if(process.argv[2]) console.error('process.argv[2]',process.argv[2]);
//if(process.argv[3]) console.error('process.argv[3]',process.argv[3]); // 값이 있으면 redirect 용 출력 (컬러 없음)

// \\HYUNEESRV\g$
// \\HYUNEESRV\g$\share\roms\mame\kinst
var rootpath = process.argv[2]?process.argv[2]:"G:";
//var isRedirect = process.argv[3]?true:false;
//var rootpath = path.normalize(__dirname+'\\..');

function md5sum(filename) {
  var genChecksum = null;
  var checksum = crypto.createHash('md5');
  var bytesRead = 1;
  var pos = 0
//  var buffer = new Buffer(1024*64); // 64Kbyte
  var buffer = new Buffer.alloc(1024*64); // 64Kbyte
  var fd = fs.openSync(filename, 'r');
  var data = null;
  while (bytesRead > 0) {
    bytesRead = fs.readSync(fd, buffer, 0, buffer.length, pos);
    pos += bytesRead;
    if (bytesRead === buffer.length) {
      checksum.update(buffer);
    } else {
      data = buffer.slice(0, bytesRead);
      checksum.update(data);
    }
  }
  fs.closeSync(fd);
  genChecksum = checksum.digest('hex');
  return genChecksum;
}

function getDirectory(dir, deep){
//    if(deep >= 4) return;
    try{
        fs.readdirSync(dir, {withFileTypes:true}).forEach(lst=>{
            if(lst.isDirectory()){
                console.error(dir+'\\'+lst.name);
                getDirectory(dir+'\\'+lst.name, deep++);
            } else if(lst.isFile()){
//                return;
                var stats    = fs.statSync(dir+'\\'+lst.name);
                //var sizes    = fs.statSync(dir+'/'+lst.name).size;
                var sizes    = stats.size;
                var fpath    = dir.replace(/\\/g, '\\\\');
                var name     = lst.name;
                var filepath = dir+'\\'+lst.name;
                var _filepath= filepath.replace(/\\/g, '\\\\');
                var ext      = path.extname(lst.name);
//                console.log(/*sp, */sizes, fpath, name, ext, filepath/** /, 'checksum is : ' + md5sum(fpath)/**/);
                /*
                    size              integer,
                    name              text,
                    ext               text,
                    path              text
                    filepath          text,
                    md5               text,
                */
                //console.log(name, fs.statSync(dir+'/'+lst.name));
//                console.log(lst);
                var md5 = md5sum(filepath);
//                var md5 = 'md5sum(filepath)';
                //var isSymbolicLink = lst.isSymbolicLink();
                var isSymbolicLink = fs.existsSync(filepath+'.txt')?1:0;
                //var isSymbolicLink = fs.isLinkSync(filepath);
                console.log(`${sizes}\t${name}\t${ext}\t${fpath}\t${_filepath}\t${md5}\t${isSymbolicLink}`);
            }
        });
    }catch(e){
        console.error(e);
    }
}

getDirectory(rootpath, 0);
