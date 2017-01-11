define(function(require , exports , module) {
	var sjt=require("../core/sjt");
	return function(e,t){
		t=t||Object;
		try{
			var r=sjt(e,t)
		}
		catch(i){
			console.log('shareTmp error');
		}return r
	}
});
