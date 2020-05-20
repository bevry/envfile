import { parse, stringify } from './index.js'

let data = ''
process.stdin.on('readable', function () {
	const chunk = process.stdin.read()
	if (chunk) data += chunk.toString()
})
process.stdin.on('end', function () {
	const result = process.argv.includes('json2env')
		? stringify(JSON.parse(data))
		: JSON.stringify(parse(data))
	process.stdout.write(result)
})
