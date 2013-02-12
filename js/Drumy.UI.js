(function() {
  var _template;

  _template = function(str, data) {
    var fn, string;
    if (!/\W/.test(str)) {
      fn = cache[str] || _template(document.getElementById(str).innerHTML);
    } else {
      string = "      var p=[],print=function(){p.push.apply(p,arguments);};      with(obj){p.push('      " + (str.replace(/[\r\t\n]/g, " ").split("<%").join("\t").replace(/((^|%>)[^\t]*)'/g, "$1\r").replace(/\t=(.*?)%>/g, "',$1,'").split("\t").join("');").split("%>").join("p.push('").split("\r").join("\\'")) + "      ');}return p.join('');    ";
      fn = new Function("obj", string);
    }
    if (data) {
      return fn(data);
    } else {
      return fn;
    }
  };

  Drumy.UI = (function() {

    function UI(drumy) {
      if (!drumy) throw new Error("Requires a Drumy instance");
    }

    return UI;

  })();

}).call(this);
