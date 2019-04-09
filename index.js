#!/usr/bin/env node

const fs = require('fs')
const co = require('co')
const coprompt = require('co-prompt')
const program = require('commander')

const home = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME']
const defaultConfigPath = home + '/.gratitude_config'
var fileConfigExists = null
const defaultGratitudePath = home + '/gratitude.txt'
const newConfigFile = {
	'gratitudes': {
		'default': defaultGratitudePath
	}
}

try {
	fileConfigExists = fs.statSync(defaultConfigPath).isFile()
} catch(e) {
	fileConfigExists = false
}

if (fileConfigExists) {
	const obj = JSON.parse(fs.readFileSync(defaultConfigPath, 'utf8'))

	program
		.version('0.1.0')
		.arguments('<entry>');
}
else {
	co(function* (){
		const gratitudePath = yield coprompt(`Where would you like to store your gratitude journal?  (Leave blank for ${home}/gratitude.txt): `)
		newConfigFile.gratitudes.default = gratitudePath ? gratitudePath : newConfigFile.gratitudes.default
		fs.closeSync(fs.openSync(defaultConfigPath, 'w'))
		fs.writeFileSync(defaultConfigPath, JSON.stringify(newConfigFile, '', 2))
		const entry = yield coprompt(`[Begin writing your entry.  Press return to save.]\n`)
		fs.stat(newConfigFile.gratitudes.default, (err) => {
			if (!err) {
				fs.appendFileSync(newConfigFile.gratitudes.default)
			} else {
				fs.writeFileSync(newConfigFile.gratitudes.default)
				console.log('[Your first entry was successfully added!]')
			}
			process.exit()
		})
	})
}

process.on("SIGINT", () => {
	console.log(`see ya!`)
	process.exit()
})
