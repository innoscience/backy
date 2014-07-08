"use strict";

var version = '0.1.3';

var fs = require('fs');
var sys = require('sys');
var path = require('path');
var exec = require('child_process').exec;

var options = {'force': false, 'flags': 'czvf', 'file': '', 'halt': false , 'config':[], 'output': false, 'test': false};

function argHandler(arg) {

    if (arg == '--force' || arg == '-f') {
        options.force = true;
    }
    else if (arg.substr(0, 8) == '--config' || arg.substr(0, 2) == '-c') {
        var config;
        if (arg.substr(0, 2) == '-c') {
             config = arg.substr(3);
        }
        else {
            config = arg.substr(9);
        }

        try {
            options.config = JSON.parse(config);
        }
        catch(err) {
            console.log('ERROR: Invalid config json string');
            console.log(err);
            options.halt = true;
        }
    }
    else if (arg == '--nogzip' || arg == '-nz') {
        options.flags = 'cvf';
    }
    else if (arg.search(/\.tar(\.gz)?$/i) > 0) {
        options.file = arg;
    }
    else if (arg == '--output' || arg == '-o') {
        options.output = true;
    }
    else if (arg == '--test' || arg == '-t') {
        options.test = true;
    }
    else if (arg == '--help' || arg == '-help' || arg == '-?' || arg == '-h') {
        help();
        options.halt = true;
    }
    else if (arg == '--version' || arg == '-v') {
        console.log('backy '+version);
        options.halt = true;
    }
    else {
        console.log("ERROR: Invalid option '"+arg+"'");
        help();
        options.halt = true;
        return false;
    }
    return true;
}

function help() {
    console.log('Usage: backy [Optional: <filename.tar.gz>]');
    console.log('Options:');
    console.log('-c / --config=\'["--parm", "--parm2"]\': Pass parameters to tar.');
    console.log('-f / --force : Force overwriting of archive file.');
    console.log('-o / --output : Output tar results.');
    console.log('-t / --test : Test run without running tar command.');
    console.log('-nz / --nogzip : Disable Gzipping of archives.');
    console.log('-h / --help : This help message');
    console.log('-v / --version : Get current version');
}

function compressThis() {
    var projectDir = process.cwd();
    var projectName = path.basename(projectDir);
    var backupTarget = projectName+"-"+(new Date).valueOf()+".tar.gz";

    if(process.argv.length > 2) {
        for (var i = 2; i < process.argv.length; i++) {
            argHandler(process.argv[i]);
        }
    }

    if (options.halt) {
        return;
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

        var command = 'tar -'+options.flags+' '+backupTarget+' -C "'+projectDir+'" . --exclude="./*.gz" --exclude="'+backupTarget+'" '+excludes+" "+options.config.join(" ");

        console.log("Running: "+command);
        if (!options.test) {
            console.log("Backing up files to '"+backupTarget+"'...");
            exec(command, function (ERROR, stdout, stderr) {
                if (stdout) {
                    if (options.output) {
                        console.log(stdout);
                    }
                    console.log("Results: OK.");
                    console.log("Back up complete.");
                }
                else {
                    sys.puts('Results: ERROR');
                    sys.puts(stderr);
                }
            });
        }
        else {
            console.log("Test run complete.");
        }

    } else {
        console.log("ERROR: Backup already exists: " + backupTarget);
    }
}

exports.compress = compressThis;