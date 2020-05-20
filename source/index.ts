/** Parse an envfile string */
export function parse<T>(src: string): T {
	// Try parse envfile string
	const result: { [key: string]: any } = {}
	const lines = src.toString().split('\n')
	for (const line of lines) {
		const match = line.match(/^([^=:#]+?)[=:](.*)/)
		if (match) {
			const key = match[1].trim()
			const value = match[2].trim()
			result[key] = value
		}
	}
	return result as T
}

/** Turn an object into an envfile string */
export function stringify(obj: object): string {
	// Prepare
	let result = ''

	// Stringify
	for (const [key, value] of Object.entries(obj)) {
		if (key) {
			const line = `${key}=${String(value)}`
			result += line + '\n'
		}
	}

	// Return
	return result
}
