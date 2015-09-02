#!/usr/bin/env node

var program = require('commander');
var pack = require('./package.json');
var shell = require('shelljs');
var ghdownload = require('github-download');

var project_folder = process.cwd();

program
  .version(pack.version)
  .option('init <project-name>', 'Creates a folder for the project', '')
  .parse(process.argv);

console.log(program.init, process.cwd());
if (program.init !== ''){
   // check git availability
   if (!shell.which('git')) {
      shell.echo('Sorry, this script requires git');
      shell.exit(1);
   }
   // create the folder
   shell.mkdir('-p', program.init); 
   project_folder += '/'+program.init;
   ghdownload({
        user: 'cortezcristian', 
        repo: 'anyandgo', 
        ref: 'master'}, 
        project_folder)
    .on('dir', function(dir) {
      console.log(dir)
    })
    .on('file', function(file) {
      console.log(file)
    })
    .on('zip', function(zipUrl) { //only emitted if Github API limit is reached and the zip file is downloaded
      console.log(zipUrl)
    })
    .on('error', function(err) {
      console.error(err)
    })
    .on('end', function() {
      console.log('You have successfully created the anyandgo project');
      console.log('Try:');
      console.log('     cd '+program.init);
      console.log('     npm install && bower install && grunt');
      /*
      shell.exec('tree -L 2 '+project_folder, function(err, stdout, sderr) {
        console.log(stdout)
      });
        */
    });
}
