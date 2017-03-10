;(function(global, factory) {
	if (typeof define === 'function' && define.amd) {
		define(function() {
			return (global.share = factory(global, global.document));
		});
	} else if (typeof exports === 'object') {
		module.exports = factory(global, global.document);
	} else {
		global.share = factory(global, global.document);
	}
})(typeof window !== 'undefined' ? window : this, function(window, document) {
	'use strict';
	//设备检测
	var plantform = {
		ua: navigator.userAgent.toLowerCase(),
		getPlantform: function(deviceStr) {
			var deviceStr = deviceStr.toLowerCase();
			return plantform.ua.indexOf(deviceStr) !== -1;
		},
		getVersion: function(deviceStr) {
			var arr = (ua.split(deviceStr.toLowerCase())[1]).split('.');
			return parseFloat(arr[0] + '.' + arr[1]);
		},
		device: function() {
			var that = this;
			var obj = {
				isIOS: that.getPlantform('iPhone') || that.getPlantform('iPad') || that.getPlantform('iPod'),
				isAndroid: that.getPlantform('Android'),
				isUCBrowser: that.getPlantform('UCBrowser'),
				isQQBrowser: that.getPlantform('MQQBrowser'),
				isWeixin: that.getPlantform('MicroMessenger'),
				qqBrowserVersion: this.isQQBrowser ? getVersion('MQQBrowser/') : 0,
				ucBrowserVersion: this.isUCBrowser ? getVersion('UCBrowser/') : 0,
				//是否支持浏览器原生分享
				supportNativeShare: ( (this.isIOS && this.ucBrowserVersion >= 10.2) || (this.isAndroid && this.ucBrowserVersion >= 9.7) || (this.qqBrowserVersion >= 5.4) ) ? true : false,
				// 支持浏览器原生分享的APP
				// [IOS下UC, Android下UC, QQ浏览器]
				nativeShareApps: {
					weixin: ['kWeixin', 'WechatFriends', 1],
					weixintimeline: ['kWeixinFriend', 'WechatTimeline', 8],
					weibo: ['kSinaWeibo', 'SinaWeibo', 11],
					qq: ['kQQ', 'QQ', 4],
					qzone: ['kQZone', 'Qzone', 3]
				}
			};
			return obj;
		}
	};

	/**
	 * [share description]
	 * @param  {String} selector DOM标识
	 * @param  {Object} config   分享标识
	 */
	function share(selector, config) {
		if(typeof selector !== 'string'){
			console.error('You msut write selector(eg:"#div"or".div span"...)!');
			return;
		}
		if(typeof config === 'undefined'){
			console.error('You msut write config!');
			return;
		}
		var ele = document.querySelectorAll(selector);
		var deviceObj = plantform.device();
		config.from = window.location.host;
		console.log(config);
		console.log(deviceObj);
		console.log(share.base64);
		//share.to(deviceObj, 'weixin');
		share.render(ele);
		share.initEvent(deviceObj, selector, function(deviceObj, site, config){
			share.to(deviceObj, site, config);
		});
		// 普通浏览器没有webapi的分享是通过QQ浏览器当桥梁进行的，
  		// 需要通过URL参数判断分享到哪个地方
		// var site = share.getQuery('bridge');
		// if (site && typeof history.replaceState === 'function') {
		// 	var url = window.location.href.replace(new RegExp('[&?]bridge='+site, 'gi'), '');
		// 	history.replaceState(null, document.title, url);
		// 	share.to(deviceObj, site, config);
		// }
	}
	//分享到
	share.to = function(deviceObj, site, data){
		var app, config, api = share.base64[site].api;
		//在UC和QQ浏览器支持原生分享
		if(deviceObj.supportNativeShare){
			//UC
			if(deviceObj.isUCBrowser){
				if(deviceObj.nativeShareApps[site]) {
		        	app = device.isIOS ? nativeShareApps[site][0] : nativeShareApps[site][1];
				}
				if(app !== undefined){
					config = [data.title, data.disc, data.url, app, '', '@'+data.from, ''];
					// android
			        if (window.ucweb) {
			          ucweb.startRequest && ucweb.startRequest('shell.page_share', config);
			        }
			        // ios
			        if (window.ucbrowser) {
			          ucbrowser.web_share && ucbrowser.web_share.apply(null, config);
			        }
			        return;
				}
			}
			//QQ浏览器
			if(deviceObj.isQQBrowser){
				alert('qq')
				deviceObj.nativeShareApps[site] && (app = nativeShareApps[site][2]);
				if(app !== undefined) {
			        if (window.browser) {
						config = {
							url: data.url,
							title: data.title,
							description: data.disc,
							img_url: data.pic,
							img_title: data.title,
							to_app: app,
							cus_txt: ''
						};

						browser.app && browser.app.share(shareInfo);
			        } else {
						share.loadScript('//jsapi.qq.com/get?api=app.share', function() {
							share.to(deviceObj, site, data);
						});
			        }
			        return;
			      }
			}
		}
		// 在普通浏览器里，使用URL Scheme唤起QQ客户端进行分享
		if(site === 'qzone' || site === 'qq') {
			var scheme = share.setQuery(sitesObj[site].scheme, {
				share_id: '1101685683',
				url: data.url,
				title: data.title,
				description: data.disc,
				previewimageUrl: data.pic, //For IOS
				image_url: data.pic //For Android
			});
			share.urlScheme(deviceObj, scheme);
			return;
		}
		// 在普通浏览器里点击微信分享，通过QQ浏览器当桥梁唤起微信客户端
		// 如果没有安装QQ浏览器则点击无反应
		if(site.indexOf('weixin') !== -1) {
			var mttbrowserURL = share.setQuery(window.location.href, {bridge: site});
			share.urlScheme(deviceObj, 'mttbrowser://url=' + mttbrowserURL);
		}

		// 在微信里点微信分享，弹出右上角提示
		if(deviceObj.isWeixin && (site.indexOf('weixin') !== -1)) {
			alert('请点击右上角');
			return;
		}

		// 对于没有原生分享的网站，使用webapi进行分享
		if(api) {
			for(var k in data) {
				api = api.replace(new RegExp('{{' + k + '}}', 'g'), encodeURIComponent(data[k]));
			}
			window.open(api, '_blank');
		}
	}
	//通过URL Scheme 打开APP
	share.urlScheme = function(deviceObj, scheme){
			console.log(deviceObj)
		if (deviceObj.isIOS) {
			//IOS
			window.location.href = scheme;
		} else {
			//Andorid
			var iframe = document.createElement('iframe');
			iframe.style.display = 'none';
			iframe.src = scheme;
			document.body.appendChild(iframe);
			window.setTimeout(function() {
				iframe && iframe.parentNode && iframe.parentNode.removeChild(iframe);
			}, 2000);
		}
	}
	//渲染DOM
	share.render = function(ele){
		ele[0].innerHTML = '<button data-site="weixin">分享</button>';
	}
	//初始化事件
	share.initEvent = function(deviceObj, selector, cb){
		var icons = document.querySelectorAll(selector + ' button[data-site]');
		for(var i = 0, len = icons.length; i < len; i++){
			icons[i].addEventListener('click', function(){
				var site = this.getAttribute('data-site');
				console.log(site)
				cb && cb(deviceObj, site);
			});
		}
	}
	//设置url
	share.setQuery = function(url, config){
		var arr = [];
		for(var k in config) {
			arr.push(k + '=' + config[k]);
		}
		return url + (url.indexOf('?') !== -1 ? '&' : '?') + arr.join('&');
	}
	//获取url  bridge参数实现间接跳转
	share.getQuery = function(){
		var query = window.location.search.substring(1);
		var arrParams = query.split('&');
		var length = arrParams.length;
		for (var i = 0; i < length; i++) {
			var pair = arrParams[i].split('=');
			if (decodeURIComponent(pair[0]) === 'bridge') {
				return decodeURIComponent(pair[1]);
			}
		}
	}
	//加载脚本
	share.loadScript = function(url, cb){
		var script = doc.createElement('script');
		script.src = url;
		script.onload = onreadystatechange = function() {
			if (!this.readyState || this.readyState === 'load' || this.readyState === 'complete') {
				cb && cb();
				script.onload = onreadystatechange;
				script.parentNode.removeChild(script);
			}
		};
		body.appendChild(script);
	}
	//图片base64
	share.base64 = {
		weixin: {
			name: '微信好友',
			icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAOVBMVEVHcEz///////////////////////////////////////////////////////////////////////99PJZNAAAAEnRSTlMAMOCwQGDQ8IAQkFAgn79wwKDPjjl1AAABuUlEQVR4Xu3VwXKFIAwF0IsASVBR8/8f27IBnSeitatOz455w30kSsTf9G8amW1KMy9O8JifSXdCNHhgiqQfBi+4R6KeowV3jKRNwaAr6qXeIcRqx4xLSfVVwqw3RDR5rQbNTtcjGoT2vZJNi+AAUyJIcK7uYGT1Tw0AjGW54dSkhUO2lgMgEy0mnGEtPLJQ1gIArtfHQQtyABYtrACStKBWBVWag+5QmgfdMfg0ah/ZxaGFtSd4gYyc0qCUEo/yLGDwEB90z/oHAVHAdJJ6N8DDDZ0Rwdf7uTsi3OX++cYF1ybO+/sJVhsCvF7zyLw2uIm0w5TLcGKt95w8xlAKE1MOna5e5nGqR92NnfVw4127C4R4nBOhXun6k0UmZ0XYXWl21yqSwxAUZIb0A09aJa6npDiTFg6tBOf0DkYrwS2PAiBBjxw/CShdrpx/GkA/6oFvzkYWvWM6fp+IR15JM4ugfeFQAbEgE/fNYHlWQdleCGnPgCKy/GDiO1zqdiGiw5BeWYFXCUHwKmEV3GFafdhwF3ceYN+0UeMdvk28rRlhi3mx4CHj+NviBPlMqitemVYVvOMMfsu/L0Ath0CgH1P9AAAAAElFTkSuQmCC'
		},
		weixintimeline: {
			name: '微信朋友圈',
			icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAOVBMVEVHcEz///////////////////////////////////////////////////////////////////////99PJZNAAAAEnRSTlMA8DB/z6DQPxCAwGAgcLBQ4JAZyUNJAAAB60lEQVR4Xs3X246rMAyF4QRI43Bmvf/DbomhLNUmznRfjS+r/p8gCqfwh0dyn8ZzUp/l27o7dnzMnrpv+hV2Ssjzr2I5JMjrCShIvyCWiIGCAhD7Rj6PACgYABjcg5gioAQNIE71vgegBAsAqdYnwBEIILm9FQhQ8HsKFQCL7SfAETSATfdzhCNYIIoCBsARLID1sy+AIxConYRENIXCZTInQdsRSsj4mMkcgC8QsHthzs7M4RQI2L498roB9t1tzP3DbFq4APYR72U8YOclQQkXwJ7LODg9he0HYM/N5PecrHrs/N3rCdy9XAf987+l0RPQPTK3od8TYM/bwtroCege5fx91L3Mz8Cme6QLUP2Qn4Gie4wXoHrUAN1jvQDV14COvVoD1deAqzdAUT0BtycwqZ6A2/OPWfUE3J5bObAn3O55MYUX+zewSbvn5by8ewJlbfd8Qs53T0DfNJfyMPeWT3dPQAv+sCdwCl12RmxPgLeu6uyBs8AAbSGrh6sFfGH8XGQD+ILdbaMFfOFwXnEIUGjfuScN+ELHkoICPGFyXhQNgFEosHcEDWBQwhIqUwjAEZzX9S0SqAmxC87IqAAjrNL85CFghbiF5kiJBJRQxCtJCIH/fbHr0q627jJ//+lbynjOMeXwh+cfhtCFZYWp8dQAAAAASUVORK5CYII='
		},
		qq: {
			name: 'QQ好友',
			icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAP1BMVEVHcEz///////////////////////////////////////////////////////////////////////////////9KjZoYAAAAFHRSTlMAIGAwgKDwQBDA0FDfsHDgkD+PT2O/b44AAAGsSURBVHhe1dfddqsgEAXgzf8AYmw67/+sPUe7zHLhONjctN9dFHaMCVuCX859/GPwM+5Z+Ft+fuIuO/FB9IQb6sSd6DHsyaeKwxAqLIhpcL7MQdf4QtQTZr5UoDCRr3lcC6yIhCuGVV65ANWEK5F1CbLKAxbIPA/IkGUeARkPMe8GJEjS3w+o7wY0HrJAYGzmEQECT/Rgna9OCgBcGXl/j1M095Xa8xADqtMXVF7HzIQzCzamidMTVqniRHpVtguRO2U2+DZPhA5NzPb1yi6Fd4+8VDq0xiJ0STskm7RyOKB8uqRpu+hYobDbwCaWWU64kLLUKtNI4dgs/p6dXnmfz4lfOIp1nLFJ8769+rA+x+tFfXJt4dYjbupP5FuLmu8HZCnA/ihgLZLHSMA+MPRtaLYTakBO/U206xHL/02WtvsqqWjdho0iFwCFNzkEeX5eh2cc2UAA3Oiz1bUkbfJU9s1dWoAiaPNV5Y2N6l6nshiM8kdBN0PkeYiFgHhMu7NRLlH5DMpXGGD7TIJojn1t1QcfNMIFsm3PKDNhVcOe8VgMVJRW3bGaEuEX+gJWbpMHBa1eygAAAABJRU5ErkJggg==',
			scheme: 'mqqapi://share/to_fri?src_type=web&version=1&file_type=news'
		},
		qzone: {
			name: 'QQ空间',
			icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAP1BMVEVHcEz///////////////////////////////////////////////////////////////////////////////9KjZoYAAAAFHRSTlMAYECgEPAwwH8/4NAgUJCwcM+fr0RbN4IAAAGVSURBVHhe7ZbdkoMgDIUVE2ARf7o97/+s22k7pZmAUJnZq36XmBwPJgGHf+CLQ+zKN8DUJbABXRYi0GdhArosRNy5dhoAzMl8whN3UsADXRaI0WfBA30WGOiyMOKd8XOBIATCGQNdFoghCXSiBAJ/YgoEXJgp+5PjCs1Vh9H9yOjA3gRoVcuzK5KtjHVqu27db/Y0vyLKvtZ35AjOjz+itE74tEPCMBJa5hFKF5EvHdoAiX5XFPkTDRKaUWK7x1oW+YOCJuRZB5lfHoysAo9tsy2idKlGtZZnST7Fpxa9Fgr5aafqU/0qzTI0q62SyHc0HJOajU2mfeCHVoE55vKx1QSC7DTLkFxqAtJp1DPSdJ/yksZs34I6Qw4waXgStHjHjZecKVbKjuvcUIYdYF/GVf+YPGq42k9NDa71URX6SIB3MaH1MkAykb44xnaB8HyZnZvHySLBb5E7N5bBvMVF0Yxb2zgtL/eL0g540tJHng4e2qqAK4TER5GXShvwQZ2WUCmDA9bDTqP1eJz8ZoYKVoX08uUPi2Bapj4cFIsAAAAASUVORK5CYII=',
			api: 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={{url}}&title={{title}}&pics={{pic}}&desc={{desc}}',
    		scheme: plantform.device().isIOS ? 'mqqapi://share/to_fri?file_type=news&src_type=web&version=1&generalpastboard=1&shareType=1&cflag=1&objectlocation=pasteboard&callback_type=scheme&callback_name=QQ41AF4B2A' : 'mqqapi://share/to_qzone?src_type=app&version=1&file_type=news&req_type=1'
		},
		weibo: {
		    name: '新浪微博',
		    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAPFBMVEVHcEz///////////////////////////////////////////////////////////////////////////+PybD1AAAAE3RSTlMAoGAw0PCAEEDAIHDfsJBQ4I+vnt3bXwAAAkdJREFUeF7tVtuCqyAMLAghAfHG///rqW0xwWjd9nHPzgsWyGQgF3r7v/CHzrhSiieau+8I+rKhn8MXBEXCp88JqDRwn4tIkBAtZM8MXwKJGb7E+FBBb3YEa4jI4GlMHwzpVKMpL5ggrdzqdo4bgz8+RFwKYzjIhEcWwKkEKA2EEy9DGKY1o3hRyGyBvDaUCnP/ZdcPldXWlx1Aslu0ptLGdbQ7+7kooPJRJbjnKPFkP7wDvEPs8vcxcypoexkFhOV1/8vjyOP6eR9hT7AUDZ/a2ZUBFQH7v0Sul/AyoM/sW899k2e2/JgAn+GLTSp2P7R3j4iArXcZa/H1aicNAIbIq6BIn3QcgGxFhsbRNFFggHf1J0rXNujmMNV2jFcdm3jHSY24FN8U8HmzjlylHnYaQ2V3Hc+NAKlVY05belLTtrqTTTHUSVVDr4Wp2qOM6SxOcVLknZzTOUmHzS7rE9QUGVVBH0nwgiA3jSN6kYzPkcM2iZpgUKNpkCphJ4EOm7VreicLgHqcngneKBjFjU4WMZe+q8mjCNo4ZhkD3OKZxYXplE8qCpYJUv1ibypA8dbkBzf4sImJ+mkx8mXan6HnY0KbNT5w0YsplYqw7fLYyE26a41szLH3kXU6ckpt0FMMJ4vRtIl8ac+rLqoX2mE9Zq/tNYPfCjKvHG7AugzquVcMz7yh7mgNWNKEF//cymJDaz0aL9zz4htHNFvE+86IaabC8EO8vUdIU9GQ78U1OqCiMRnLzq+BFjIR+TIRkYGE4fbb8Yd/KxZhLtPWraEAAAAASUVORK5CYII=',
		    api: 'http://service.weibo.com/share/share.php?url={{url}}&title={{title}}&pic={{pic}}'
		},
		yixin: {
			name: '易信',
			icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAP1BMVEVHcEz///////////////////////////////////////////////////////////////////////////////9KjZoYAAAAFHRSTlMAMMAgQGCgEPCAcNBQsOCQ37+Pr/HIP5wAAAI0SURBVHhetVfdeuwgCFyNfxhNTJb3f9Zz03aqYvS0X+du10AGGIS8/hjeGLP9zHSz7gr8gcvZ7f+s484tyr3sw7xZxpVWzNXFYxQzzdrNz3g/B6IKzxCe4rC8gnto73gNb79mv2eiSET64PbEz+2z9ThScZ97IAbYdbk2uvLgOvvEgBZLZapIqBVvwFkcaaQKspEU5BfUWpmDl05gP/dwvgAfevu5h02qwLTfTqkSPoDWFHtPAbyORh8qEbVXmuopwKmtqkblQ3Z2oNjwqYEvAlW6oAwuSC0exwujRKC+WML3o4yGaf7weChyA9WpHjHAH3TPQC+82i3SGntly92jkYSKkRFKBQRJd1T9FOUGJCEJeeBAswASMqQhjIpjYQFOdoDX7XDAErTgoMBBE8KcAVjnRQdxFAKhOzsdylq0AwfQgeceh1RlXVX1fBxyUYqQqogKHvHHQy/41qt0S6oHArbNiwYhQIV6GMozBL0BmmIigxJbPYMuKIgNZSQCuMK+MhY2eYrZwRT20E0b6i3zxwxBBPgTWrA7A9kP5gobabmI8b4CAzoN1xg92A6ihnxdM2uHGwLVkjGRCENtsGHk6uxY2OIU4kfFROkWO5ns0MBoFBUrsUjgyW62ZgYn7Ro2PyyKOzcIwneKj7Bv4eEBKG9Kn+VShq7HTcpnXsPuf7eua8kea8kU9HrCpifmhxnaothjBHotwB5Dc/9aQ3JCLjLEuwJzagb0mfwPP70p4fP7T/APapCRU7q26PsAAAAASUVORK5CYII=',
			api: 'http://open.yixin.im/share?url={{url}}&title={{title}}&pic={{pic}}&desc={{desc}}'
		},
		tqq: {
			name: '腾讯微博',
			icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAOVBMVEVHcEz///////////////////////////////////////////////////////////////////////99PJZNAAAAEnRSTlMAoLAwwECAEPAg0HDgYFCQv48OkrAuAAAB90lEQVR4Xu2UXZOjIBBFG+RTQJPz/3/sbqKxnZCpcczD1lblPNGl3Kb70sj/xochXG2Y5CzTBUiQgpyiUEu86TjGKL8nYB/b2k8KUXoGrAaN+butzVaAZFuWL9i0lzVotCMbFMxeIi85r3CN97BIT0gA1RnjRgCusuHx9z7ColRtf3oL1LKmzaUCl6gtvC0dQL3FznX7R0ghilIS2u3AvREA42sBC2l4avwIoyxM9xKGBEy3OD2XMEONr041r8tlMczYxdT21H/NvycnGNRGNdA+22igyAsaXL5epIwR8YTuAHUXeV277QgNE5dcXvLczYnWNFXAxEcE83aadDM5phSlt4C8+XUnPWI1QrwDavT0o6R/eVYuWoNs5BLml8MIVru5krcTdfZ0CgMETbjiNwHfm5PStI/9cQG9pDbvQi0h8CA+CfSje9EP4PTyLgQ1SF6S56SXb2T1dttvZCVR5RtiizpKtMdI5eBG27Q6jPzMsPg+9SNlYJIDjCASUzdSHqocYXDlns31D8IkR/HLBCgqeYwLT1MeDaQoB+nLHUbt6REMNFEGw4H9/aMUjQlTC9cK4KIcpywWFjZqk98wQl7fYYBkJvkVGey68n/J8lsKNDmNPqvnqVR5hwxGTqOv4nkKeHmH8K6AA/kIfAQKSd6jePl3fPgDOtEg/yPlfh8AAAAASUVORK5CYII=',
			api: 'http://share.v.t.qq.com/index.php?c=share&a=index&url={{url}}&title={{title}}&pic={{pic}}'
		},
		tieba: {
		    name: '百度贴吧',
		    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAOVBMVEVHcEz///////////////////////////////////////////////////////////////////////99PJZNAAAAEnRSTlMAMPCggL8QwD9/4NCQsHDPYFAr85NjAAABBklEQVR4Xu3V3Y6DIBCG4QFxoP5u5/4vdrM4+2kTaoD+eMJ7QtvUJxHHQF+sFbboabdkhGTrOSDJyoEGWI9sFeAJ+csAjzUJhD2uAY6FK4AG1M9BAxrQawr02nQOdDsg6fw54K4E1lcBeRHgNDA4NJwD97guByBxYJwBXVxXpsn/lQsgthKbSSsFFtFcHcCD/PdTBThB1lQARg4NXArgBnQj+2JgltjIKnSFQIcT546NLAE62Udg0s8Go3xDQxrgVbYsH3eDc18msz4emQH/ywTswwTiJkaTCyyCjdfG+DwoF6BZr0dGv+UCbPV65BYqASjg/UGFk+gMVQLoM0CIGUIGP7yr1i+rL2X5ejXICAAAAABJRU5ErkJggg==',
		    api: 'http://tieba.baidu.com/f/commit/share/openShareApi?url={{url}}&title={{title}}&desc={{desc}}'
		}
	}
	//初始化style
	share.initStyle = function() {
		console.log('initStyle');
	}






	return share;
});