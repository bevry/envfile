/** We don't normalize anything, so it is just strings and strings. */
export type Data = Record<string, string>

/** We typecast the value as a string so that it is compatible with envfiles.  */
export type Input = Record<string, any>

// perhaps in the future we can use @bevry/json's toJSON and parseJSON and JSON.stringify to support more advanced types

/** Parse an envfile string. */
export function parse(src: string): Data {
	const result: Data = {}
	const lines = splitInLines(src)
	for (const line of lines) {
		const match = line.match(/^([^=:#]+?)[=:]((.|\n)*)/)
		if (match) {
			const key = match[1].trim()
			const value = match[2].trim().replace(/['"]+/g, '')
			result[key] = value
		}
	}
	return result
}

/** Turn an object into an envfile string. */
export function stringify(obj: Input): string {
	let result = ''
	for (const [key, value] of Object.entries(obj)) {
		if (key) {
			const line = `${key}=${jsonValueToEnv(value)}`
			result += line + '\n'
		}
	}
	return result
}

function splitInLines(src: string): string[] {
	return src
		.replace(/("[\s\S]*?")/g, (_m, cg) => {
			return cg.replace(/\n/g, '%%LINE-BREAK%%')
		})
		.split('\n')
		.filter((i) => Boolean(i.trim()))
		.map((i) => i.replace(/%%LINE-BREAK%%/g, '\n'))
}

function jsonValueToEnv(value: any): string {
	let processedValue = String(value)
	processedValue = processedValue.replace(/\n/g, '\\n')
	processedValue = processedValue.includes('\\n')
		? `"${processedValue}"`
		: processedValue
	return processedValue
}
