## Synopsis

This is a simple node package to backup your project's files to a `.tar.gz` archive, excluding files based on the project's `.gitignore`. Comments in the `.gitignore` file are ignored as well. Useful for projects using Composer, Bower or other package managers. 

## Installation

> Note: the tar utility must be available on the host OS in additon to Node / NPM.

	sudo npm install backy -G

## Usage

In a terminal in the root of your project, run:

	backy
	# RESULTS: {project}-{timestamp}.tar.gz

#### Example
	 
In the case of running the `backy` command in `/home/awesomeonius/project` all files/directories listed in the `.gitignore`:

	> cd /home/awesomeonius/project
	> backy	
	# RESULTS: /home/awesomeonius/project/project-{timestamp}.tar.gz

## Options

The options below can be combined as required.

#### Show help

	backy [ --help | -h | -? ]

#### Specify the archive name:

	backy archive-name.tar.gz

#### Disable Gzip

	backy [ --nogzip | -nz ]
	

#### Force Overwriting of Backup Archive

	backy [ --force | -f ]

#### Test run without archiving

	backy [ --test | -t ]

#### Get version

	backy [ -- version | -v ]

## Todo

- Add option to pass arguments to Tar

## License

Licensed under the MIT License (MIT)

Copyright (c) 2014 Brandon Fenning