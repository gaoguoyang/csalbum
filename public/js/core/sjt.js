define(function(require , exports , module) {
	var n={};
	return function r(e,t){
		var i=/\W/.test(e)?new Function("obj","var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('"+e.replace(/[\r\t\n]/g," ").split("<?").join("	").replace(/((^|\?>)[^\t]*)'/g,"$1\r").replace(/\t=(.*?)\?>/g,"',$1,'").split("	").join("');").split("?>").join("p.push('").split("\r").join("\\'")+"');}return p.join('');"):n[e]=n[e]||r(document.getElementById(e).innerHTML);
		return t?i(t):i
	}
})
