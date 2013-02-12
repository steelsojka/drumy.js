exec = require('child_process').exec
fs = require('fs')

CLOSURE_PATH = "build/compiler.jar"
JS_DIR = "js/"
COFFEE_DIR = "src/"
DIST_DIR = "dist/"
CONCAT_OUTPUT = "#{DIST_DIR}Drumy.js"
MINIFIED_OUTPUT = "#{DIST_DIR}Drumy.min.js"
HEADER_FILES = [
  CONCAT_OUTPUT
  MINIFIED_OUTPUT
]
VERSION = 0.1

JS_FILES = [
  "Drumy.Core.js"
  "Drumy.Pad.js"
  "Drumy.Voice.js"
]

HEADER = ["/**" 
          " * @FILENAME@ v#{VERSION}"
          " *"
          " * A customizable drum pad console for trigger drum sounds"
          " * @author Steven Sojka - #{new Date().toLocaleDateString()}"
          " *"
          " * MIT Licensed"
          " */"
          ""].join("\n");

asyncLoop = (o) ->
  i = -1
  next = ->
    if ++i is o.length
      o.callback()
      return
    o.func(next, i)
    return
  next()
  return

concat = (callback) ->
  console.log("Concatenating files... #{JS_FILES.join(" ")}")
  files = JS_FILES.map((a) -> JS_DIR + a)
  exec("cat #{files.join(" ")} > #{CONCAT_OUTPUT}", callback)
  return

minify = (callback) ->
  console.log("Minifying files...")
  exec("java -jar #{CLOSURE_PATH} --js #{CONCAT_OUTPUT} --js_output_file #{MINIFIED_OUTPUT}", callback)
  return

compile = (callback) ->
  console.log("Compiling files...")
  exec("coffee --output #{JS_DIR} --compile #{COFFEE_DIR}", callback)
  return

clean = (callback) ->
  console.log("Cleaning directory...")
  exec "rm -rf #{DIST_DIR}", (err) ->
    fs.mkdir DIST_DIR, ->
      exec "rm -rf #{JS_DIR}"
      callback()
      return
    return
  return


prependHeader = (file, callback) ->
  console.log("Prepending header to #{file}")
  _file = file.replace(/.*\//, "")
  fs.readFile file, 'utf8', (err, data) ->
    throw err if err
    fs.writeFile(file, HEADER.replace("@FILENAME@", _file) + data, callback)
    return
  return

task "concat", "Concat the compiled JS", concat
task "minify", "Minify the compiled JS", minify
task "compile", "Compile the coffeescript", compile
task "clean", "Clean distribution directory", clean
task "build", "Build the project", ->
  clean ->
    compile ->
      concat ->
        minify ->
          asyncLoop({
            length: HEADER_FILES.length
            func: (next, i) ->
              prependHeader(HEADER_FILES[i], -> next())
              return
            callback: ->
              console.log("Build finished")
          })
          return
        return
      return
    return
  return
        
  

