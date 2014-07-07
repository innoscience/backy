"use strict";
var fs = require('fs');
var sys = require('sys');
var path = require('path');
var exec = require('child_process').exec;

function compressThis() {

    if(!fs.existsSync('.gitignore')) {
        console.log("Error: .gitignore required.");
        return;
    }

    var projectDir = process.cwd();
    var projectName = path.basename(projectDir);
    var backupTarget;

    if(process.argv.length > 2) {
        backupTarget = process.argv[2];
    }
    else {
        backupTarget = projectName+"-"+(new Date).valueOf()+".tar.gz";
    }

    if(!fs.existsSync(backupTarget)) {
        var gitcontents = fs.readFileSync('.gitignore').toString().split("\n");
        var excludes = '';
        var line;
        for (line in gitcontents) {
            if (gitcontents[line].length > 0 && gitcontents[line].substr(0, 1) != '#') {
                excludes += ' --exclude="./'+gitcontents[line].replace(/\/$|^\//g, '')+'"';
            }
        }

        console.log("Backing up files to '"+backupTarget+"'...");

        var command = 'tar -czvf '+backupTarget+' -C "'+projectDir+'" . --exclude="./*.gz" --exclude="'+backupTarget+'" '+excludes;

        console.log("Running "+command);
        exec(command, function (error, stdout, stderr) {
            if (stdout) {
                sys.puts('Results: OK');
                console.log("Back up complete.");
            }
            else {
                sys.puts('Results: Error');
                sys.puts(stderr);
            }
        });

    } else {
        console.log("Error: Backup already exists: " + backupTarget);
    }

}

exports.compress = compressThis;