"use strict";

var fs = require('fs');
var sys = require('sys');
var path = require('path');
var exec = require('child_process').exec;

var options = {'force': false, 'nogzip': false, 'file': '', 'halt': false , 'output': false, 'test': false};

function argHandler(arg) {

    if (arg == '--force' || arg == '-f') {
        options.force = true;
        return true;
    }
    else if (arg == '--nogzip' || arg == '-nz') {
        options.nogzip = true;
        return true;
    }
    else if (arg.search(/\.tar(\.gz)?$/i) > 0) {
        options.file = arg;
        return true;
    }
    else if (arg == '--output' || arg == '-o') {
        options.output = true;
        return true;
    }
    else if (arg == '--test' || arg == '-t') {
        options.test = true;
        return true;
    }
    else if (arg == '--help' || arg == '-help' || arg == '-?' || arg == '-h') {
        console.log('Usage: backy');
        console.log('Options:');
        console.log('--force / -f : Force overwriting of archive file.');
        console.log('--nogzip / -nz : Disable Gzipping of archives.');
        console.log('--output / -o : Output tar results.');
        console.log('--test / -t : Test run without running tar command.');
        console.log('--help / -help / -h / -? : This help message');
        console.log('--version / -v');
        console.log('<filename.tar[.gz]> : Specify filename for archive.');
        options.halt = true;
    }
    else if (arg == '--version' || arg == '-v') {
        console.log('backy 0.1.2');
        options.halt = true;
    }
    return false;
}

function compressThis() {
    var projectDir = process.cwd();
    var projectName = path.basename(projectDir);
    var backupTarget = projectName+"-"+(new Date).valueOf()+".tar.gz";

    if(process.argv.length > 2) {
        for (var i = 2; i < process.argv.length; i++) {
            if (!argHandler(process.argv[i])){
                if (!options.halt) {
                    console.log("Error: Invalid option: "+process.argv[i]);
                }
                return;
            }
        }
    }

    if (options.file) {
        backupTarget = options.file;
    }

    if(!fs.existsSync(backupTarget) || options.force) {

        var excludes = '';

        if(!fs.existsSync('.gitignore')) {
            console.log("Warning: No .gitignore file found.");
        }
        else {
            var gitcontents = fs.readFileSync('.gitignore').toString().split("\n");
            var line;
            for (line in gitcontents) {
                if (gitcontents[line].length > 0 && gitcontents[line].substr(0, 1) != '#') {
                    excludes += ' --exclude="./'+gitcontents[line].replace(/\/$|^\//g, '')+'"';
                }
            }
        }

        console.log("Backing up files to '"+backupTarget+"'...");
        var flags = 'czvf';
        if (options.nogzip) {
            flags = 'cvf';
        }
        var command = 'tar -'+flags+' '+backupTarget+' -C "'+projectDir+'" . --exclude="./*.gz" --exclude="'+backupTarget+'" '+excludes;

        console.log("Running "+command);
        if (!options.test) {
            exec(command, function (error, stdout, stderr) {
                if (stdout) {
                    if (options.output) {
                        console.log(stdout);
                    }
                    console.log("Results: OK.");
                    console.log("Back up complete.");
                }
                else {
                    sys.puts('Results: Error');
                    sys.puts(stderr);
                }
            });
        }
        else {
            console.log("Test run complete.");
        }

    } else {
        console.log("Error: Backup already exists: " + backupTarget);
    }
}

exports.compress = compressThis;