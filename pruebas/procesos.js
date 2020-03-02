const ROOT_DIR = 'C:/Repositorio_Arq/03_Design/Services';

const Filehound = require('filehound');

var Services;

Filehound.create()
  .path(ROOT_DIR)
  .ext("wsdl")
  .find()
  .then((subdirectories) => {
    console.log(subdirectories);
});
/*
var spawn = require('child_process').spawn;
var cat = spawn('dir', [directorio, '\s']);

cat.stdout.on('data', (data) => {
    console.log(data.toString()); // bytes
});

const fs = require('fs');
var getDirs = function(rootDir, cb) { 
    fs.readdir(rootDir, function(err, files) { 
        var dirs = []; 
        for (var index = 0; index < files.length; ++index) { 
            var file = files[index];
            console.log(file); 
            if (file[0] !== '.') { 
                var filePath = rootDir + '/' + file; 
                fs.stat(filePath, function(err, stat) {
                    if (stat.isDirectory()) { 
                        dirs.push(this.file); 
                    } 
                    if (files.length === (this.index + 1)) { 
                        return cb(dirs); 
                    } 
                }.bind({index: index, file: file})); 
            }
        }
    });
}
*/