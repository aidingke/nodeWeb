var o = {
	//初始化
	init : function () {
		o.initHtml();
		o.bind();
		o.getHtmlString('.conts');
		o.initFloatBtn();
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
	}
}
//初始化webSite对象
o.init();


jQuery.extend({
		o:{
			name:'323232'
		}
	})
	