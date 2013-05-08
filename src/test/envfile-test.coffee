# Import
{expect} = require('chai')
{describe,it} = require('joe')
{exec} = require('child_process')

# Test
describe 'envfile', (describe,it) ->
	it 'binary executables should work as expected', (done) ->
		envfile2jsonPath = __dirname+'/../../bin/envfile2json.js'
		json2envfilePath = __dirname+'/../../bin/json2envfile.js'
		command = """echo "a=1\\nb:2\\nc = 3\\nd : 4" | node #{envfile2jsonPath} | node #{json2envfilePath}"""
		exec command, (err,stdout) ->
			expect(err).to.eql(null)
			expect(stdout.trim()).to.eql('a=1\nb=2\nc=3\nd=4')
			done()