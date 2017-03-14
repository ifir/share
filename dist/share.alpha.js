/**
 * Share
 * @param {String} selector    父容器的id,class,tag等
 * @param {Object} config 分享配置
 */
;(function(global, factory) {
	if (typeof define === 'function' && define.amd) {
		define(function() {
			return (global.Share = factory(global, global.document));
		});
	} else if (typeof exports === 'object') {
		module.exports = factory(global, global.document);
	} else {
		global.Share = factory(global, global.document);
	}
})(typeof window !== 'undefined' ? window : this, function(window, document) {
	'use strict';
	var base64 = {
		_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
		encode: function(a) {
			var b, c, d, e, f, g, h, i = "",
				j = 0;
			for (a = base64._utf8_encode(a); j < a.length;)
				b = a.charCodeAt(j++),
				c = a.charCodeAt(j++),
				d = a.charCodeAt(j++),
				e = b >> 2,
				f = (3 & b) << 4 | c >> 4,
				g = (15 & c) << 2 | d >> 6,
				h = 63 & d,
				isNaN(c) ? g = h = 64 : isNaN(d) && (h = 64),
				i = i + this._keyStr.charAt(e) + this._keyStr.charAt(f) + this._keyStr.charAt(g) + this._keyStr.charAt(h);
			return i
		},
		decode: function(a) {
			var b, c, d, e, f, g, h, i = "",
				j = 0;
			for (a = a.replace(/[^A-Za-z0-9\+\/\=]/g, ""); j < a.length;)
				e = this._keyStr.indexOf(a.charAt(j++)),
				f = this._keyStr.indexOf(a.charAt(j++)),
				g = this._keyStr.indexOf(a.charAt(j++)),
				h = this._keyStr.indexOf(a.charAt(j++)),
				b = e << 2 | f >> 4,
				c = (15 & f) << 4 | g >> 2,
				d = (3 & g) << 6 | h,
				i += String.fromCharCode(b),
				64 != g && (i += String.fromCharCode(c)),
				64 != h && (i += String.fromCharCode(d));
			return i = base64._utf8_decode(i)
		},
		_utf8_encode: function(a) {
			a = a.replace(/\r\n/g, "\n");
			for (var b = "", c = 0; c < a.length; c++) {
				var d = a.charCodeAt(c);
				d < 128 ? b += String.fromCharCode(d) : d > 127 && d < 2048 ? (b += String.fromCharCode(d >> 6 | 192),
					b += String.fromCharCode(63 & d | 128)) : (b += String.fromCharCode(d >> 12 | 224),
					b += String.fromCharCode(d >> 6 & 63 | 128),
					b += String.fromCharCode(63 & d | 128))
			}
			return b
		},
		_utf8_decode: function(a) {
			for (var b = "", c = 0, d = c1 = c2 = 0; c < a.length;)
				d = a.charCodeAt(c),
				d < 128 ? (b += String.fromCharCode(d),
					c++) : d > 191 && d < 224 ? (c2 = a.charCodeAt(c + 1),
					b += String.fromCharCode((31 & d) << 6 | 63 & c2),
					c += 2) : (c2 = a.charCodeAt(c + 1),
					c3 = a.charCodeAt(c + 2),
					b += String.fromCharCode((15 & d) << 12 | (63 & c2) << 6 | 63 & c3),
					c += 3);
			return b
		}
	};

	function Share(selector, config) {
		var _this = this;
		_this.config = config;
		_this.container = document.querySelectorAll(selector)[0];
		_this.UA = window.navigator.userAgent;
		//_this.appName = '';

		_this.init();

	}

	Share.prototype = {
		constructor: Share,
		//浏览器设备信息
		browsersInfo: {
			isIOS: false,
			isAndroid: false,
			isUCBrowser: false,
			isQQBrowser: false,
			isWeixin: false,
			ucBrowserVersion: 0,
			qqBrowserVersion: 0,
			//当前浏览器下支持原生分享
			supportNativeShare: false,
			// 支持浏览器原生分享的APP
			// [IOS下UC, Android下UC, QQ浏览器]
			nativeShareApps: {
				weixin: ['kWeixin', 'WechatFriends', 1],
				weixintimeline: ['kWeixinFriend', 'WechatTimeline', 8],
				weibo: ['kSinaWeibo', 'SinaWeibo', 11],
				qq: ['kQQ', 'QQ', 4],
				qzone: ['kQZone', 'Qzone', 3]
			}
		},
		//初始化icon图标,api等
		urlAPI: {
			weixin: {
				name: '微信好友',
				icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAOVBMVEVHcEz///////////////////////////////////////////////////////////////////////99PJZNAAAAEnRSTlMAMOCwQGDQ8IAQkFAgn79wwKDPjjl1AAABuUlEQVR4Xu3VwXKFIAwF0IsASVBR8/8f27IBnSeitatOz455w30kSsTf9G8amW1KMy9O8JifSXdCNHhgiqQfBi+4R6KeowV3jKRNwaAr6qXeIcRqx4xLSfVVwqw3RDR5rQbNTtcjGoT2vZJNi+AAUyJIcK7uYGT1Tw0AjGW54dSkhUO2lgMgEy0mnGEtPLJQ1gIArtfHQQtyABYtrACStKBWBVWag+5QmgfdMfg0ah/ZxaGFtSd4gYyc0qCUEo/yLGDwEB90z/oHAVHAdJJ6N8DDDZ0Rwdf7uTsi3OX++cYF1ybO+/sJVhsCvF7zyLw2uIm0w5TLcGKt95w8xlAKE1MOna5e5nGqR92NnfVw4127C4R4nBOhXun6k0UmZ0XYXWl21yqSwxAUZIb0A09aJa6npDiTFg6tBOf0DkYrwS2PAiBBjxw/CShdrpx/GkA/6oFvzkYWvWM6fp+IR15JM4ugfeFQAbEgE/fNYHlWQdleCGnPgCKy/GDiO1zqdiGiw5BeWYFXCUHwKmEV3GFafdhwF3ceYN+0UeMdvk28rRlhi3mx4CHj+NviBPlMqitemVYVvOMMfsu/L0Ath0CgH1P9AAAAAElFTkSuQmCC'
			},
			weixintimeline: {
				name: '微信朋友圈',
				icon:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAOVBMVEVHcEz///////////////////////////////////////////////////////////////////////99PJZNAAAAEnRSTlMA8DB/z6DQPxCAwGAgcLBQ4JAZyUNJAAAB60lEQVR4Xs3X246rMAyF4QRI43Bmvf/DbomhLNUmznRfjS+r/p8gCqfwh0dyn8ZzUp/l27o7dnzMnrpv+hV2Ssjzr2I5JMjrCShIvyCWiIGCAhD7Rj6PACgYABjcg5gioAQNIE71vgegBAsAqdYnwBEIILm9FQhQ8HsKFQCL7SfAETSATfdzhCNYIIoCBsARLID1sy+AIxConYRENIXCZTInQdsRSsj4mMkcgC8QsHthzs7M4RQI2L498roB9t1tzP3DbFq4APYR72U8YOclQQkXwJ7LODg9he0HYM/N5PecrHrs/N3rCdy9XAf987+l0RPQPTK3od8TYM/bwtroCege5fx91L3Mz8Cme6QLUP2Qn4Gie4wXoHrUAN1jvQDV14COvVoD1deAqzdAUT0BtycwqZ6A2/OPWfUE3J5bObAn3O55MYUX+zewSbvn5by8ewJlbfd8Qs53T0DfNJfyMPeWT3dPQAv+sCdwCl12RmxPgLeu6uyBs8AAbSGrh6sFfGH8XGQD+ILdbaMFfOFwXnEIUGjfuScN+ELHkoICPGFyXhQNgFEosHcEDWBQwhIqUwjAEZzX9S0SqAmxC87IqAAjrNL85CFghbiF5kiJBJRQxCtJCIH/fbHr0q627jJ//+lbynjOMeXwh+cfhtCFZYWp8dQAAAAASUVORK5CYII='
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
				scheme: '' //isIOS ? 'mqqapi://share/to_fri?file_type=news&src_type=web&version=1&generalpastboard=1&shareType=1&cflag=1&objectlocation=pasteboard&callback_type=scheme&callback_name=QQ41AF4B2A' : 'mqqapi://share/to_qzone?src_type=app&version=1&file_type=news&req_type=1'
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
		},
		//初始化
		init: function() {
			var _this = this;
			_this.initBrowsersInfo();
			_this.initUrlAPI();
			_this.initStyle();
			_this.initRender();
			_this.initEvent();
			//window.alert(this.browsersInfo.supportNativeShare);
			window.console.log('init');
			window.console.log(this.browsersInfo);
			window.console.log(this.urlAPI);
			var bridgeStr = _this.getBridgeParam();
			if (bridgeStr !== '') {
				_this.shareTo(bridgeStr);
				var url = window.location.href.replace(new RegExp('[&?]bridge=' + bridgeStr, 'gi'), '');
				if (typeof window.history.replaceState === 'function') {
					window.history.replaceState(null, document.title, url);
				} else {
					window.setTimeout(function() {
						window.location.href = url;
					}, 1500);
				}
			}
		},
		//初始化浏览器信息
		initBrowsersInfo: function() {
			var _this = this;
			var info = _this.browsersInfo;
			info.isIOS = _this.getPlantform('iPhone') || _this.getPlantform('iPad') || _this.getPlantform('iPod');
			info.isAndroid = _this.getPlantform('Android');
			info.isUCBrowser = _this.getPlantform('UCBrowser');
			info.isQQBrowser = _this.getPlantform('MQQBrowser');
			info.isWeixin = _this.getPlantform('MicroMessenger');
			info.isUCBrowser && (info.ucBrowserVersion = _this.getVersion('UCBrowser/'));
			info.isQQBrowser && (info.qqBrowserVersion = _this.getVersion('QQBrowser/'));
			info.supportNativeShare = ((info.isIOS && info.ucBrowserVersion >= 10.2) || (info.isAndroid && info.ucBrowserVersion >= 9.7) || (info.qqBrowserVersion >= 5.4));
		},
		//初始化UrlAPI
		initUrlAPI: function() {
			this.urlAPI.qzone.scheme = this.browsersInfo.isIOS ? 'mqqapi://share/to_fri?file_type=news&src_type=web&version=1&generalpastboard=1&shareType=1&cflag=1&objectlocation=pasteboard&callback_type=scheme&callback_name=QQ41AF4B2A' : 'mqqapi://share/to_qzone?src_type=app&version=1&file_type=news&req_type=1';
		},
		//获取设备信息Android & IOS
		getPlantform: function(name) {
			var ua = this.UA.toLowerCase();
			var name = name.toLowerCase();
			var flag = (ua.indexOf(name) !== -1) ? true : false;
			return flag;
		},
		//获取QQ浏览器和UC浏览器版本
		getVersion: function(name) {
			var av = navigator.appVersion.toLowerCase();
			var arr = av.split(name.toLowerCase())[1].split('.');
			var version = parseFloat(arr[0] + '.' + arr[1]);
			return version;
		},
		//分享到
		shareTo: function(appName) {
			var _this = this;
			var browsersInfo = _this.browsersInfo;
			var config = _this.config;
			var nativeShareToAppName, nativeShareConfig, api = _this.urlAPI[appName].api;
			//浏览器是否支持原生分享(QQ浏览器&UC)
			if (browsersInfo.supportNativeShare) {
				//window.console.log();
				//UC
				if (browsersInfo.isUCBrowser) {
					if (browsersInfo.nativeShareApps[appName]) {
						nativeShareToAppName = browsersInfo.isIOS ? browsersInfo.nativeShareApps[appName][0] : browsersInfo.nativeShareApps[appName][1];
					}
					if (nativeShareToAppName) {
						nativeShareConfig = [
							config.title,
							config.desc,
							config.url,
							nativeShareToAppName,
							'',
							'@' + config.from,
							''
						];
						//IOS
						if (window.ucbrowser) {
							window.ucbrowser.web_share && window.ucbrowser.web_share.apply(null, nativeShareConfig);
						}
						//Android
						if (window.ucweb) {
							window.ucweb.startRequest && window.ucweb.startRequest('shell.page_share', nativeShareConfig);
						}
						return;
					}
				}
				//QQ浏览器
				if (browsersInfo.isQQBrowser) {
					browsersInfo.nativeShareApps[appName] && (nativeShareToAppName = browsersInfo.nativeShareApps[appName][2]);
					if (nativeShareToAppName && window.browser) {
						nativeShareConfig = {
							url: config.url,
							title: config.title,
							description: config.desc,
							img_url: config.img,
							img_title: config.img_title,
							to_app: nativeShareToAppName,
							cus_txt: ''
						};
						//QQ浏览器调用原生分享
						browser.app && browser.app.share(nativeShareConfig);
					} else {
						//加载script支持调用浏览器分享接口
						_this.loadScript('//jsapi.qq.com/get?api=app.share', function() {
							_this.shareTo(appName);
						});
					}
					return;
				}
			}

			//普通浏览器,先通过Url Scheme打开QQ浏览器或UC浏览器,在进行分享
			if (appName === 'qq' || appName === 'qzone') {
				var scheme = _this.appendUrlParam(_this.urlAPI[appName].scheme, {
					share_id: '1101685683',
					url: base64.encode(config.url),
					title: base64.encode(config.title),
					description: base64.encode(config.desc),
					previewimageUrl: base64.encode(config.img), //IOS
					image_url: base64.encode(config.img) //Android
				});
				_this.openUrlScheme(scheme);
				return;
			}
			//在普通浏览器里点击微信分享，通过QQ浏览器当桥梁唤起微信客户端
			//如果没有安装QQ浏览器则点击无反应
			if (!browsersInfo.isWeixin && (appName === 'weixin' || appName === 'weixintimeline')) {
				var mttbrowserURL = _this.appendUrlParam(window.location.href, {
					bridge: appName
				});
				_this.openUrlScheme('mttbrowser://url=' + mttbrowserURL);
			}

			// 在微信里点微信分享，弹出右上角提示
			if (browsersInfo.isWeixin && appName === 'weixin') {
				_this.weixinTipMsg();
				return;
			}

			// 对于没有原生分享的网站，使用webapi进行分享
			if (api) {
				for (var k in config) {
					api = api.replace(new RegExp('\\{\\{' + k + '\\}\\}', 'g'), encodeURIComponent(config[k]));
				}
				window.open(api, '_blank');
			}
		},
		//初始化事件
		initRender: function() {
			var _this = this;
			var apps = _this.config.apps;
			var list = [];
			for (var i = 0, len = apps.length; i < len; i++) {
				list.push(
					'<li class="share-item" data-app="' + apps[i] + '">' +
					'<div class="icon-wrap ' + apps[i] + '">' +
					'<img src="' + _this.urlAPI[apps[i]].icon + '" alt="' + apps[i] + '">' +
					'</div>' +
					'</li>'
				);
			}
			_this.container.innerHTML = '<ul class="share-list">' + list.join('') + '</ul>';
		},
		initEvent: function() {
			var _this = this;
			var items = document.querySelectorAll('.share-item');
			for (var i = 0, len = items.length; i < len; i++) {
				items[i].addEventListener('click', function() {
					_this.appName = this.getAttribute('data-app');
					_this.shareTo(_this.appName);
				}, false);
			}
		},
		//初始化样式
		initStyle: function() {

		},
		//加载script
		loadScript: function(url, cb) {
			var script = document.createElement('script');
			var body = document.getElementsByTagName('body')[0];
			script.src = url;
			body.appendChild(script);
			script.onload = script.onreadystatechange = function() {
				if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
					cb && cb();
					script.parentNode.removeChild(script);
					script.onload = script.onreadystatechange = null;
				}
			}
		},
		//实现url scheme 唤醒APP
		openUrlScheme: function(scheme) {
			if (this.browsersInfo.isIOS) {
				//IOS
				window.location.href = scheme;
			} else {
				//Android
				var iframe = document.createElement('iframe');
				iframe.style.display = 'none';
				iframe.src = scheme;
				document.getElementsByTagName('body')[0].appendChild(iframe);
				window.setTimeout(function() {
					iframe && iframe.parentNode && iframe.parentNode.removeChild(iframe);
				}, 2000);
			}
		},
		//setUrl参数
		appendUrlParam: function(url, config) {
			var arr = [],
				newUrl;
			for (var key in config) {
				arr.push(key + '=' + config[key]);
			}
			newUrl = url + (url.indexOf('?') > 0 ? '&' : '?') + arr.join('&');
			return newUrl;
		},
		//获取url上的bridge参数
		getBridgeParam: function() {
			var val = '';
			var url = window.location.search.substr(1);
			var arr = url.split('&');
			for (var i = 0, len = arr.length; i < len; i++) {
				if (arr[i].indexOf('bridge') !== -1) {
					val = arr[i].split('=')[1];
				}
			}
			return val;
		},
		weixinTipMsg: function() {

		}
	};



	return Share;
});