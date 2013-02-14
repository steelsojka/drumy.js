exec = require('child_process').exec
fs = require('fs')
wrench = require('./build/wrench')

CLOSURE_PATH = "build/compiler.jar"
JS_DIR = "js/"
COFFEE_DIR = "src/"
DIST_DIR = "dist/"
UI_DIR = "src/ui"
CONCAT_OUTPUT = "#{DIST_DIR}Drumy.js"
MINIFIED_OUTPUT = "#{DIST_DIR}Drumy.min.js"
HEADER_FILES = [
  CONCAT_OUTPUT
  MINIFIED_OUTPUT
  "#{DIST_DIR}Drumy.UI.min.js"
]
VERSION = 0.2

JS_FILES = [
  "Drumy.Event.js"
  "Drumy.Core.js"
  "Drumy.Pad.js"
  "Drumy.Voice.js"
]

JS_EXTRAS = [
  "Drumy.UI.js"
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

minifyExtras = (callback) ->
  asyncLoop(
    length: JS_EXTRAS.length
    func: (next, i) ->
      file = JS_EXTRAS[i]
      exec("java -jar #{CLOSURE_PATH} --js #{JS_DIR + file} --js_output_file #{DIST_DIR + file.replace(".js", ".min.js")}", next)
    callback: -> 
      callback?()
  )

minifyCore = (callback) ->
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
task "minifyCore", "Minify the compiled JS", minifyCore
task "minifyExtras", "Minify non core files", minifyExtras
task "compile", "Compile the coffeescript", compile
task "clean", "Clean distribution directory", clean
task "build", "Build the project", ->
  clean ->
    compile ->
      concat ->
        minifyCore ->
          minifyExtras ->
            asyncLoop(
              length: HEADER_FILES.length
              func: (next, i) ->
                prependHeader(HEADER_FILES[i], -> next())
                return
              callback: ->
                console.log("Copying UI directory... #{UI_DIR} to #{DIST_DIR}ui")
                wrench.copyDirSyncRecursive(UI_DIR, "#{DIST_DIR}ui")
                console.log("Build finished")
            )
     
  

