module.exports = (function(){
	var opt = {
		desc:"这是一个用来设置inject相关的JSON",
		file:[
			{
				"fileName":"html/index.html",
				"dist":"html",
				"sources":{
						css:"_asset/scripts/dist/a/*.css",
						js:"_asset/scripts/dist/a/*.js"
				}
			}
		]
	};

	return opt;
})();