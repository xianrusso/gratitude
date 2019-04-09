#!/usr/bin/env node
console.log("Hello World!");

const prompt = require('co-prompt');
const program = require('commander');

program
	.version('0.1.0')
	.option('-a, --add-entry', 'Add new gratitude entry');

