/**
 * Share
 * @param {String} selector    父容器的id,class,tag等
 * @param {Object} config 分享配置
 */
;(function(global, factory) {
	if(typeof define === 'function' && define.amd){
		define(function() {
			return (global.Share = factory(global, global.document));
		});
	}else if(typeof exports === 'object'){
		module.exports = factory(global, global.document);
	}else {
		global.Share = factory(global, global.document);
	}
})(typeof window !== 'undefined' ? window : this, function(window, document){
	'use strict';
	function Share(selector, config, cb) {
		var _this = this;

		_this.container = document.querySelectorAll(selector);
		_this.UA = window.navigator.userAgent;
		_this.appName = Share.getAppName();

		cb && cb();
		_this.init();

	}
	//获取App名称
	Share.getAppName = function(){

	}
	Share.prototype = {
		constructor: Share,
		//浏览器设备信息
		browsersInfo:{
			isUCBrowser: false,
			isQQBrowser: false,

		},
		//初始化icon图标,api等
		initAPI:{
			weixin:{
				name: '微信好友',
				icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAADIklEQVRo3u2aPW6kMBTHp9uWntoXcLnFSFulSTcHmH6abdxzAI5AzwXcphjtATgALRdw6QKJGOmxchwDD+MPZhekv5RIA/bPfp+GyzAMl/9JlxP4BD6BT+CXAna93v/8pEpMqVZ6KnVKQmlQkvB3o8SVCqW3Xx+/f1wSXpuBAbICuMFBEhbglgIeDawmeIVdHDxqXDQWE3wVWE0oB5MdAmoEvyUHHn1O88kYGhc2SwKsBn4o9RFhJ41BLo8KDLBDQnWhoL8Bj76UGHZSG8K8vwCrAQjSZyWYXuu4e0/kODw0MCbtcN3cIF1JxH1Cj8Tj7iHHuwcBhoiMmXRm8fkKcS+bKWKcxvQBjFntdiail4h7b5b7MqQbMK/A4LtYH6SWiWMWq7bcd8cGMN/AbAOwgN9T0JYqjIPrEEh9Ys9C7wHmB0lFAqylhAW5gUZLID6B24SQEoJelNZxAhYJQHsA/VJRjdCQ6gqtz55yfgP/V2AB1BU4Rb1MLe1n7bD4HbgAOeoO17rpeuyze1iw/Eg+XBmmWwUKfI814DrGzhqHCk1MSzKBQ7eD7TQ45OAukkU9TegJOA/c7FOtlIydAvlcLc0jmHKqAqewAdNAu0w3dGMtuBdDWILUKjKO+C2x9cO+o2ajPbtBRNfc6KSWfP2xsUXlNmDfPlZouRa9OEgXIBuPpkbrJbYzLeKxELlu6JelXn0h5lEYOR0TH9jcqSX1BJ0hzVk36wokke1mtcEq+dK5NN2ZL6X2LHmQ9rNbe/OQ76hzhWZuw0EkV98twYRddrp/SeCN511zPvwaJg2TZQtRFRulm4MAcwxwY6mG7mCqBPJfCRGz0b4CENMheqA20EWPtaBFbKAOn0Zc349xQJitAbM9oMaz2sTAJeaFOPV1kpj4rWQ3BdBdX/E4QKdoD/speKYAziOedli7qqjAnuv0TY1/MmAt+reBzZh5+TDNI3QWyKfF0idQyYCN6O1zt8VSZkkObIBzh3M1W4n7dnhgw9T1crXVytUOyte/L9OgxL0b0b98GWDXC8DZtDD/PLBhIbNvE88v4k/gE/gEPoGPrk9msWKy2OFy6gAAAABJRU5ErkJggg=='
			},
			weixintimeline:{
				name: '微信朋友圈',
				icon: 'data:image/png;base64,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'
			},
			qq:{
				name: 'QQ好友',
				icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAACjUlEQVRo3u3bzytEURQH8IkoaymKhc2Y/AEsJvkH2Cj/gEh2SKyUjZT/wJpkhQWRkg1KWahZSU1hQUjMoIwf43vq3Lq9ZqFx7z3n5alv6jZzzvmENzPvXqlyuZz6T0kl4AT8z8B//UrvFjqQKWQDuUCKSJlT5LUNfkzHX/uJgTF8H3Jo4X4bek5fbMAYtgXZrgIaDdVoUQ3GgF3IrQOsCdXqUgnGYN3Is0OsCdXsVgXGQG3IvQesCdVuUwHGIDVVXpyquZjVaACPBsCajIqCMUADchMQTL0aJMFjAbEmY5LgMwHwmQgYjTsFsCadEuAZQfCMBHhHELwjAX4UBD8GBaNhsyDWpDkkOKsAnA0JHlQAHgwJHlIAHgoJHlcAHk/AHsETCsATIcGbCsCbQcBo1Ip8KgDTDK0hwHMKsCZzXsFoUItcKwLTLLU+wf2KsCb9PsFbCsFbXsC8o/ClEPxl71C4BE8rxJpM+wDnFINzTsEomFGMNcm4BM/GADzrEnwSA/CJEzAKNSLfMQDTjI0uwAMxwJoMuAAvxgi86AK8Hyn6hhQU4Ao8i7227wJ8FSk6iZwqAJ/yLPbapQvwh1XwgDfAVxSAV3iWA2ut5AJsit2ZD9z4PqIAPGLdkLgz6y7A9HfyjvREdh5KgtiSvfNAs/GMby7AC0hvhTsfq4Lg1Qrz9NKsPjfT0kL3tqhnWuoEwLwAeF7yyEMdchQQS73qpI8tNSHnAbDUo0nLSTw6IvziEfvy26PFvn+laZ94nV8SfP+E37lXNjgYTeuRZcGXJepdHxI8rOCd1nBIcDuyxFfN68ixfjuvyBPygOT5Df8essbZ47U8P+aJn1OpVpF7HXPvdi/g5L9aEnACVp0f3GVE2hV/PiQAAAAASUVORK5CYII=',
				scheme: 'mqqapi://share/to_fri?src_type=web&version=1&file_type=news'
			},
			qzone:{
				name: 'QQ空间',
				icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAFCUlEQVRo3u2beYhNURzHn2Fkl6SQ7MSY5im7LJGsGRKjZJmIKEuETIhQZP8DoWTLmvwhhBDxj2ZiEv5AlmxZso2d8Xx/M7+b675z3z3Lffe+l/nj03vem3fu+Z7f7/zO+f3OEYnFYpH/iUiF4P9F8O+iaKS0MKfs1U5pYTTuMx+4Du7o/t6tT9bnzu/p374Jpt8oMgG/izGzqH0VQhaco2Oh1zbBJXhmZfVBC0Fw+Ygrd7TAJtZiraqVQxKcozrvauK1VCA4hrbqqw5eKC6t2MEtIrHMfj+CYSoJbppArEX7NBAclbXuCQnBl0zmbyotS1EJsRa9UtrCCpsMWcH3ypc6N1Jf8EAFsRyxo2Nko3Kogl3m2iNVweBVerh0vOCpNqupil6QFoLtlsb7DxrWtfgOMtPEwmVtrFSYs+LPsVFRmb+hCcb7RkrWTOzurVLNwlVAFhgFloJDjmxINUI7Lf4eHAXLwGiQDaoGJbge6AbywTpwGjwzmKe6vABnwQYwBfQA9U0FtwAjwWJwANyg3FXDJUX8BG/BE/CQXz8aDsJnUAwOk6dBIHlcay/Bc8BJcN8nS5D1z+Jh6/E6jTch2RggmuM1QAZH9Ay8rwtagr5gOtgJbvnQhwfkiXjGfJFgP0ReAHNBJ57f8TGgMH6zkiBGUDub8De/TPsWJxiNdnNL0D2gvfIs0CBRguER2b0ibx12W91g2E8guKwE012xsUWCTtblpakp0whtU4czdAQz/cE3TcGDqA2hYG68l0JjxzhangM3ed6WcGCyB6mPHJyuc25Mv5kEwW0lBK9RFvk3kOZa7Yhc2k6/AJeZN+WDHOf2DXkgddsda2/PSzAxICDBF+FdLR3zPJc3HbptTnSml8J1WMDwJAol1x8vCGqbDNudIdIiK9gabb/FXgVNHNG4vWJ1RMQcNx0qgiO8j/VL7DJB+7Ss/TZMNBYlqq25LEsJGe/DzmuAQ2gdWPaIbgppY5VX/3UER3jO6YglUbXtVU5eH5/5IHa1TN9VXdrONJN5VS42Z7ZP02OLbLnYRLA157w6cxd0dvl9b7AZFEnNXTG7VerjpoIJspLbpn4PXFG2JkXbzxFgCZ8xXeW08XMCN9+veuQjs/GQOfIoFnRopk+3BCip7wD68NI4Ds+khD/fkWVlQlAuqJZsCxNPbUIfcjoXSRaOfTclOmv5uHUryEy2hVvbxFK5p6bJ+bFELa05yANbwW3bsw/KtOeHhYfxAx+La2FGghtAcE+OE3s5E5NNT5MmeB4/9AN3rD9XMCnLqQXBVbnqUZmL6tU4kafv23AEp7V4InecLHeKb/d88YjQj+ypn5ZgjSsH210684MznZfgOW8uXnD5toS/N11/t6kayA8LX05GFiV5DlVkLFgxYJGLvguhJm0NyA8qG6l4pKlLt9O0jEk29M/foA9dghQ8IgzrOgZ4nIpXms7hhWELBiuCFLzLoKN0ojAZrjmJj3BiBilnMMsSGriiWbCfLDiBoBz7mmZ7gQiuxGusbNC6yNmQ65ELMxScURD8Cc+sHoRLN5fsEB3MDfG6IiGAykDHJQNXtrZghQAwWGJudZW9E5KAjmCf4xqE81JqXhDLUoFg3aTjlB0gKu0p8ve/sriU81WwTq/WFlzWARmKoucdB9FUqmmmvDVVv/DWmPNf++2ga0HM4Y2c7C/nzEcvBSw0qoQU8GH3Tu0oXfHfeCoEVwhOS/4A1ia5UwVI7WAAAAAASUVORK5CYII=',
				api: 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={{url}}&title={{title}}&pics={{pic}}&desc={{desc}}',
	    		//scheme: plantform.device().isIOS ? 'mqqapi://share/to_fri?file_type=news&src_type=web&version=1&generalpastboard=1&shareType=1&cflag=1&objectlocation=pasteboard&callback_type=scheme&callback_name=QQ41AF4B2A' : 'mqqapi://share/to_qzone?src_type=app&version=1&file_type=news&req_type=1'
			},
			weibo:{
			    name: '新浪微博',
			    icon: 'data:image/png;base64,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',
			    api: 'http://service.weibo.com/share/share.php?url={{url}}&title={{title}}&pic={{pic}}'
			},
			// yixin: {
			// 	name: '易信',
			// 	icon: '',
			// 	api: 'http://open.yixin.im/share?url={{url}}&title={{title}}&pic={{pic}}&desc={{desc}}'
			// },
			// tqq: {
			// 	name: '腾讯微博',
			// 	icon: '',
			// 	api: 'http://share.v.t.qq.com/index.php?c=share&a=index&url={{url}}&title={{title}}&pic={{pic}}'
			// },
			// tieba: {
			//     name: '百度贴吧',
			//     icon: '',
			//     api: 'http://tieba.baidu.com/f/commit/share/openShareApi?url={{url}}&title={{title}}&desc={{desc}}'
			// }
		},
		//初始化
		init: function(){
			var _this = this;
			_this.initStyle();
			_this.initRender();
			_this.initEvent();
			window.console.log('init');
		},
		//获取设备信息Android & IOS
		getPlantform: function(){

		},
		//获取QQ浏览器和UC浏览器版本
		getVersion: function(){

		},
		//分享到
		shareTo: function(){

		},
		//初始化事件
		initRender: function(){

		},
		initEvent: function(){

		},
		//初始化样式
		initStyle: function(){

		},
		//加载script
		loadScript: function(){
			var script = document.createElement()
		},
		//实现url scheme 唤醒APP
		urlScheme: function(){

		},
		//获取bridge参数
		getBridgeParam: function(){

		},
		//设置bridge参数
		setBridgeParam: function(){

		},
		//字符串作为URI组件进行编码
		encodeURI: function(){

		}
	};





	return Share;
});