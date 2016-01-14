# Requires
fsUtil = require('fs')

# Define
envfile =
	# Parse an env file asynchronously
	# next(err,obj)
	parseFile: (filePath,opts,next) ->
		# Prepare
		if opts? is true and next? is false
			next = opts
			opts = null
		opts or= {}

		# Read
		fsUtil.readFile filePath, (err,data) =>
			# Check
			return next(err)  if err

			# Parse
			dataStr = data.toString()
			@parse(dataStr, opts, next)

		# Chain
		@

	# Parse an env file synchronously
	parseFileSync: (filePath,opts) ->
		# Prepare
		opts or= {}

		# Read
		data = fsUtil.readFileSync(filePath)

		# Check the result
		if data instanceof Error
			# An error occured
			result = data
		else
			# Parse the result
			dataStr = data.toString()
			result = @parseSync(dataStr, opts)

		# Return
		return result

	# Parse an envfile string
	# next(err,obj)
	parse: (src,opts,next) ->
		# Prepare
		if opts? is true and next? is false
			next = opts
			opts = null
		opts or= {}

		# currently the parser only exists in a synchronous version
		# so we use an instant timeout to simulate async code without any overhead
		process.nextTick =>
			# Parse
			result = @parseSync(src,opts)

			# Check for error
			if result instanceof Error
				# Error
				next(result)
			else
				# Success
				next(null, result)

		# Chain
		@

	# Parse an envfile string synchronously
	parseSync: (src,opts) ->
		# Prepare
		opts or= {}

		# Try parse JSON
		try
			result = JSON.parse(src)

		# Try parse envfile string
		catch err
			result = {}
			lines = src.toString().split('\n')
			for line in lines
				match = line.match(/^([^=:]+?)[=\:](.*)/)
				if match
					key = match[1].trim()
					value = match[2].trim()
					result[key] = value

		# Return
		return result

	# Turn an object into envfile string
	# next(err,str)
	stringify: (obj,next) ->
		# currently the parser only exists in a synchronous version
		# so we use an instant timeout to simulate async code without any overhead
		process.nextTick =>
			# Stringify
			result = @stringifySync(obj)

			# Check
			if result instanceof Error
				# Error
				next(result)
			else
				# Success
				next(null, result)

		# Chain
		@

	# Turn an object into an envfile synchronously
	stringifySync: (obj) ->
		# Prepare
		result = ''

		# Stringify
		for own key,value of obj
			if key
				line = key+'='+String(value)
				result += line+'\n'

		# Return
		return result

# Export
module.exports = envfile
