// Import
import { equal, errorEqual } from 'assert-helpers'
import kava from 'kava'
import safeps from 'safeps'
import { resolve } from 'path'
import { readJSON } from '@bevry/json'

import filedirname from 'filedirname'
const [file, dir] = filedirname()
const root = resolve(dir, '..')
const packagePath = resolve(root, 'package.json')

let binPath: string
kava.test('envfile test prep', function (done) {
	Promise.resolve()
		.then(async function () {
			binPath = resolve(root, (await readJSON<any>(packagePath)).bin)
		})
		.finally(done)
})

// Test
kava.suite('envfile', function (suite, test) {
	test('should work without comments', function (done) {
		const command = `echo "a=1\\nb:2\\nc = 3\\nd : 4" | node ${binPath} env2json | node ${binPath} json2env`
		// @ts-ignore
		safeps.exec(command, { cwd: root }, function (err, stdout) {
			errorEqual(err, null, 'no error to exist')
			equal(stdout.trim(), 'a=1\nb=2\nc=3\nd=4', 'stdout to be as expected')
			done()
		})
	})

	test('comments should be ignored', function (done) {
		const command = `echo "#comments with = are ignored\\na=1\\n" | node ${binPath} env2json | node ${binPath} json2env`
		// @ts-ignore
		safeps.exec(command, { cwd: root }, function (err, stdout) {
			errorEqual(err, null, 'no error to exist')
			equal(stdout.trim(), 'a=1', 'stdout to be as expected')
			done()
		})
	})
})
