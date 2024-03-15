// external
import { deepEqual, equal, errorEqual } from 'assert-helpers'
import kava from 'kava'
import safeps from 'safeps'
import filedirname from 'filedirname'

// builtin
import { resolve } from 'path'

// local
import { parse, stringify } from './index.js'

// prepare
const [file, dir] = filedirname()
const root = resolve(dir, '..')
const binPath = resolve(dir, 'bin.js')

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

	test('line breaks inside quotes should be preserved on parse', function (done) {
		const str = `name="bob\nmarley"\nplanet=earth`
		const expected = {
			name: 'bob\nmarley',
			planet: 'earth',
		}
		const result = parse(str)

		deepEqual(result, expected)
		done()
	})

	test('line breaks inside quotes should be preserved on stringify', function (done) {
		const input = {
			name: 'bob\nmarley',
			planet: 'earth',
		}
		const expected = `name="bob\\nmarley"\nplanet=earth\n`
		const result = stringify(input)

		deepEqual(result, expected)
		done()
	})

	test('quotes inside quotes should be preserved', function (done) {
		const str = `name="[{"key":"foo"},{"key":"bar"}]"\nplanet="earth"\nrace='human'`
		const expected = {
			name: '[{"key":"foo"},{"key":"bar"}]',
			planet: 'earth',
			race: 'human',
		}
		const result = parse(str)

		deepEqual(result, expected)
		done()
	})
})
