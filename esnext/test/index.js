'use strict'

// Import
const pathUtil = require('path')
const {equal, errorEqual} = require('assert-helpers')
const {describe} = require('joe')
const {exec} = require('safeps')

// Test
describe('envfile', function (describe, it) {
	it('binary executables should work as expected', function (done) {
		const envfile2jsonPath = pathUtil.join(__dirname, '..', '..', 'bin', 'envfile2json.js')
		const json2envfilePath = pathUtil.join(__dirname, '..', '..', 'bin', 'json2envfile.js')
		const command = `echo "a=1\\nb:2\\nc = 3\\nd : 4" | node ${envfile2jsonPath} | node ${json2envfilePath}`
		process.env.DEBUG_ESNEXTGUARDIAN = ''
		exec(command, function (err, stdout) {
			errorEqual(err, null, 'no error to exist')
			equal(stdout.trim(), 'a=1\nb=2\nc=3\nd=4', 'stdout to be as expected')
			done()
		})
	})
})
