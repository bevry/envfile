// Import
import { deepEqual, equal, errorEqual } from 'assert-helpers'
import kava from 'kava'
import safeps from 'safeps'
import { resolve } from 'path'
import { readJSON } from '@bevry/json'
import { parse, stringify } from './index.js'

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
		const command = `echo "a=1\nb:2\nc = 3\nd : 4" | node ${binPath} env2json | node ${binPath} json2env`
		// @ts-ignore
		safeps.exec(command, { cwd: root }, function (err, stdout) {
			errorEqual(err, null, 'no error to exist')
			equal(stdout.trim(), 'a=1\nb=2\nc=3\nd=4', 'stdout to be as expected')
			done()
		})
	})

	test('comments should be ignored', function (done) {
		const command = `echo "#comments with = are ignored\na=1\n" | node ${binPath} env2json | node ${binPath} json2env`
		// @ts-ignore
		safeps.exec(command, { cwd: root }, function (err, stdout) {
			errorEqual(err, null, 'no error to exist')
			equal(stdout.trim(), 'a=1', 'stdout to be as expected')
			done()
		})
	})

	test('quotes should be preserved and normalized', function (done) {
		const str = `name="bob"\nplanet="earth"\nrace='human'`
		const expected = {
			name: 'bob',
			planet: 'earth',
			race: 'human',
		}
		const result = parse(str)

		deepEqual(result, expected)
		done()
	})

	test('comment should be maintain', function (done) {
		const str = ` #hello\nname="bob"\n#world \nplanet="earth"\nrace='human'`
		const expected = ` #hello\nname=bob\n#world \nplanet=earth\nrace=human`
		const options = { keepComments: true }
		const result = stringify(parse(str, options), options)

		equal(result, expected)
		done()
	})

	test('comment should be maintain correct with blank line', function (done) {
		const str = ` #hello\n\nboo=foo\n\n#world\nhi=he`
		const expected = ` #hello\nboo=foo\n#world\nhi=he`
		const options = { keepComments: true }
		const result = stringify(parse(str, options), options)

		equal(result, expected)
		done()
	})
})
