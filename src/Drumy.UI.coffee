
# Micro template by John Resig
_template = (str, data) ->
  if not /\W/.test(str)
    fn = cache[str] or _template(document.getElementById(str).innerHTML)
  else 
    string = "
      var p=[],print=function(){p.push.apply(p,arguments);};
      with(obj){p.push('
      #{str
        .replace(/[\r\t\n]/g, " ")
        .split("<%").join("\t")
        .replace(/((^|%>)[^\t]*)'/g, "$1\r")
        .replace(/\t=(.*?)%>/g, "',$1,'")
        .split("\t").join("');")
        .split("%>").join("p.push('")
        .split("\r").join("\\'")
      }
      ');}return p.join('');
    "
    fn = new Function("obj", string)
  if data then fn(data) else fn


class Drumy.UI
  constructor: (drumy) ->
    throw new Error("Requires a Drumy instance") if not drumy