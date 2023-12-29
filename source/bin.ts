// builtin
import { argv, stdin, stdout } from 'process'

// local
import { parse, stringify } from './index.js'

// are we wanting to convert from json to env?
const jsonToEnv = argv.slice(1).join(' ').includes('json2env')

// get the data
let data = ''
stdin.on('readable', function () {
	const chunk = stdin.read()
	if (chunk) data += chunk.toString()
})

// do the conversion
stdin.on('end', function () {
	const result = jsonToEnv
		? stringify(JSON.parse(data))
		: JSON.stringify(parse(data))
	stdout.write(result)
})
