import { parse, stringify } from './index.js'

function toEnv() {
	return process.argv.slice(1).join(' ').includes('json2env')
}

let data = ''
process.stdin.on('readable', function () {
	const chunk = process.stdin.read()
	if (chunk) data += chunk.toString()
})

process.stdin.on('end', function () {
	const result = toEnv()
		? stringify(JSON.parse(data))
		: JSON.stringify(parse(data))
	process.stdout.write(result)
})
