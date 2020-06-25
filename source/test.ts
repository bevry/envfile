// Import
import { equal, errorEqual } from 'assert-helpers'
import kava from 'kava'
import { exec } from 'safeps'
import { resolve } from 'path'

const pwd = resolve(__dirname, '..')

// Test
kava.suite('envfile', function (describe, it) {
	it('should work without comments', function (done) {
		const command = `echo "a=1\\nb:2\\nc = 3\\nd : 4" | npx . env2json | npx . json2env`
		// @ts-ignore
		exec(command, { cwd: pwd }, function (err, stdout) {
			errorEqual(err, null, 'no error to exist')
			equal(stdout.trim(), 'a=1\nb=2\nc=3\nd=4', 'stdout to be as expected')
			done()
		})
	})

	it('comments should be ignored', function (done) {
		const command = `echo "#comments with = are ignored\\na=1\\n" | npx . env2json | npx . json2env`
		// @ts-ignore
		exec(command, { cwd: pwd }, function (err, stdout) {
			errorEqual(err, null, 'no error to exist')
			equal(stdout.trim(), 'a=1', 'stdout to be as expected')
			done()
		})
	})
})
