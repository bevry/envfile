/* eslint no-sync:0, no-unused-vars:0, no-magic-numbers:0 */
'use strict'

// Requires
const ambi = require('ambi')
const eachr = require('eachr')
const typeChecker = require('typechecker')
const fsUtil = require('fs')

// Define
module.exports = class {
	// Parse an env file asynchronously
	// next(err,obj)
	static parseFile (filePath, next) {
		// Read
		fsUtil.readFile(filePath, (err, data) => {
			// Check
			if (err)  return next(err)  // exit

			// Parse
			this.parse(data.toString(), next)
		})

		// Chain
		return this
	}

	// Parse an env file synchronously
	static parseFileSync (filePath) {
		// Read
		const data = fsUtil.readFileSync(filePath)

		// Check the result
		if ( typeChecker.isError(data) ) {
			// An error occured
			return data
		}
		else {
			// Parse the result
			return this.parseSync(data.toString())
		}
	}

	// Parse an envfile string
	// next(err,obj)
	static parse (src, next) {
		// Call the synchronous method asynchronously and avoid zalgo by wrapping in nextTick
		process.nextTick(() => {
			ambi(this.parseSync, src, next)
		})

		// Chain
		return this
	}

	// Parse an envfile string synchronously
	static parseSync (src) {
		// Try parse JSON
		try {
			return JSON.parse(src.toString())
		}

		// Try parse envfile string
		catch ( err ) {
			const result = {}
			const lines = src.toString().split('\n')
			for ( const line of lines ) {
				const match = line.match(/^([^=:]+?)[=\:](.*)/)
				if ( match ) {
					const key = match[1].trim()
					const value = match[2].trim()
					result[key] = value
				}
			}
			return result
		}
	}

	// Turn an object into envfile string
	// next(err,str)
	static stringify (obj, next) {
		// Call the synchronous method asynchronously and avoid zalgo by wrapping in nextTick
		process.nextTick(() => {
			ambi(this.stringifySync, obj, next)
		})

		// Chain
		return this
	}

	// Turn an object into an envfile synchronously
	static stringifySync (obj) {
		// Prepare
		let result = ''

		// Stringify
		eachr(obj, function (value, key) {
			if ( key ) {
				const line = `${key}=${String(value)}`
				result += line + '\n'
			}
		})

		// Return
		return result
	}
}
