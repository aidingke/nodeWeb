
// (function($){
var o = {
	//初始化
	init : function () {
		o.initHtml();
		o.bind();
		// o.getHtmlString('.conts');
		// o.initFloatBtn();
	},
	//初始化绑定事件
	bind : function () {

	},
	//初始化ele
	initHtml:function(){

	},
	// 设置菜单当前页对应项激活
	setHeader:function(){

	},
	// 初始化浮动按钮
	initFloatBtn:function(){
		$("body").append('<section class="floatBtn">\
			<a href="https://www.wanguoqiche.com/down/index.html?appType=1" class="itemBtn app">体验捕车</a>\
			<a href="https://www.wanguoqiche.com/intro/bucheDemoReport/index.html" class="itemBtn report">体验报告</a>\
			<a href="javascript:" class="itemBtn scrollTop">返回顶部</a>\
		</section>');
	},
	//传入对应参数名，返回url参数值
	getHtmlString : function (x) {
		$(x).each(function (index, domEle) { 
	      // domEle == this 
	      $(domEle).html($(domEle).text());  
	    });
	},
	creatDialog:function(x,w,h){
		// w?w:'320';
		// h?h:320;
		if(typeof w == "undefined" || w == null || w == ""){
	        w=320;
	    }
	    if(typeof h == "undefined" || h == null || h == ""){
	        // h=320;
	    }
		art.dialog({
          id: 'msg',
          title: '温馨提示',
          content: x,
          width: w,
          height: h,
          lock:'true',
          fixed: true,
          drag: false,
          resize: false
        })
        art.dialog({id: 'msg'}).title('2秒后关闭').time(2);
	},
	creatTips:function(x){
		var dg = art.dialog({title:false, content:x}).time(2);;
	}
}
//初始化webSite对象
o.init();
// console.log(o.getHtmlString)
// $.extend({
// 	getHtmlString:o.getHtmlString,
// 	age:1000
// })
	

// })(jQuery)



	