/** We don't normalize anything, so it is just strings and strings. */
export type Data = Record<string, string>

/** We typecast the value as a string so that it is compatible with envfiles.  */
export type Input = Record<string, any>

export type ParseOptions = {
	// This only work when use direct with api, not work via bin
	keepComments: boolean
}

export type StringifyOptions = {
	keepComments: boolean
}

// perhaps in the future we can use @bevry/json's toJSON and parseJSON and JSON.stringify to support more advanced types

/** Parse an envfile string. */
export function parse(
	src: string,
	options: ParseOptions = { keepComments: false }
): Data {
	const result: Data = {}
	const lines = src.toString().split('\n')
	let notHandleCount = 0
	for (const [lineIndex, line] of lines.entries()) {
		const match = line.match(/^([^=:#]+?)[=:](.*)/)
		if (match) {
			const key = match[1].trim()
			const value = match[2].trim().replace(/['"]+/g, '')
			result[key] = value
		} else if (options.keepComments && line.trim().startsWith('#')) {
			const sym = Symbol.for(`comment#${lineIndex - notHandleCount}`)
			result[sym as any] = line
		} else {
			notHandleCount++
		}
	}
	return result
}

/** Turn an object into an envfile string. */
export function stringify(
	obj: Input,
	options: StringifyOptions = { keepComments: false }
): string {
	const result = []
	for (const key of Reflect.ownKeys(obj)) {
		const value = obj[key as string]
		if (key) {
			if (
				typeof key === 'symbol' &&
				(key as Symbol).toString().startsWith('Symbol(comment')
			) {
				if (options.keepComments) {
					const [_, lineIndex] = (
						(key as Symbol).description ?? 'comment#0'
					).split('#')
					result.splice(parseInt(lineIndex, 10), 0, value)
				}
			} else {
				const line = `${key as string}=${String(value)}`
				result.push(line)
			}
		}
	}
	return result.join('\n')
}
