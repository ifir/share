/**
 * ShareApp
 * @param {String} selector    父容器的id,class,tag等
 * @param {Object} config 分享配置
 */
;(function(global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(function() {
            return (global.ShareApp = factory(global, global.document));
        });
    } else if (typeof exports === 'object') {
        module.exports = factory(global, global.document);
    } else {
        global.ShareApp = factory(global, global.document);
    }
})(typeof window !== 'undefined' ? window : this, function(window, document) {
    'use strict';
    //字符转码用于QQ分享到朋友和QQ空间
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

    function ShareApp(selector, config) {
        var _this = this;
        _this.config = config;
        _this.container = document.querySelectorAll(selector)[0];
        _this.UA = window.navigator.userAgent;
        _this.init();

    }

    ShareApp.prototype = {
        constructor: ShareApp,
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
            //支持浏览器原生分享的APP
            //[IOS下UC, Android下UC, QQ浏览器]
            nativeShareApps: {
                weixin: ['kWeixin', 'WechatFriends', 1],
                weixintimeline: ['kWeixinFriend', 'WechatTimeline', 8],
                weibo: ['kSinaWeibo', 'SinaWeibo', 11],
                qq: ['kQQ', 'QQ', 4],
                qzone: ['kQZone', 'Qzone', 3]
            }
        },
        //icon图标,api，url scheme等
        urlAPI: {
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
            }
            /*,
            tieba: {
                name: '百度贴吧',
                icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAOVBMVEVHcEz///////////////////////////////////////////////////////////////////////99PJZNAAAAEnRSTlMAMPCggL8QwD9/4NCQsHDPYFAr85NjAAABBklEQVR4Xu3V3Y6DIBCG4QFxoP5u5/4vdrM4+2kTaoD+eMJ7QtvUJxHHQF+sFbboabdkhGTrOSDJyoEGWI9sFeAJ+csAjzUJhD2uAY6FK4AG1M9BAxrQawr02nQOdDsg6fw54K4E1lcBeRHgNDA4NJwD97guByBxYJwBXVxXpsn/lQsgthKbSSsFFtFcHcCD/PdTBThB1lQARg4NXArgBnQj+2JgltjIKnSFQIcT546NLAE62Udg0s8Go3xDQxrgVbYsH3eDc18msz4emQH/ywTswwTiJkaTCyyCjdfG+DwoF6BZr0dGv+UCbPV65BYqASjg/UGFk+gMVQLoM0CIGUIGP7yr1i+rL2X5ejXICAAAAABJRU5ErkJggg==',
                api: 'http://tieba.baidu.com/f/commit/share/openShareApi?url={{url}}&title={{title}}&desc={{desc}}'
            }*/
        },
        //初始化
        init: function() {
            var _this = this;
            _this.initBrowsersInfo();
            _this.initUrlAPI();
            _this.initStyle();
            _this.initRender();
            _this.initEvent();
            window.console.log('init');
            window.console.log(this.browsersInfo);
            window.console.log(this.urlAPI);
            //this.weixinTipMsg();
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
            //执行微信,QQ,qzone   APP 中点击系统的分享调用JS SDK分享
            _this.appJSSDK();
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
                        window.setTimeout(function() {
                            //IOS
                            if (window.ucbrowser) {
                                window.ucbrowser.web_share && window.ucbrowser.web_share.apply(null, nativeShareConfig);
                            }
                            //Android
                            if (window.ucweb) {
                                window.ucweb.startRequest && window.ucweb.startRequest('shell.page_share', nativeShareConfig);
                            }
                        }, 100);
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
                //分享为贴吧，腾讯微博，易信
                if (appName === 'tqq' || appName === 'tieba' || appName === 'yixin') {
                    (function() {
                        for (var k in config) {
                            api = api.replace(new RegExp('\\{\\{' + k + '\\}\\}', 'g'), encodeURIComponent(config[k]));
                        }
                        window.open(api, '_blank');
                    })();
                }
            }
            //普通浏览器,先通过Url Scheme打开QQ浏览器或UC浏览器,在进行分享
            if (!browsersInfo.isWeixin && (appName === 'qq' || appName === 'qzone')) {
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
            //在普通浏览器里点击微信分享，通过UC或QQ浏览器当桥梁唤起微信客户端
            //如果没有安装UC或QQ浏览器则点击无反应
            if (!browsersInfo.isWeixin && (appName === 'weixin' || appName === 'weixintimeline')) {
                var browserURL = _this.appendUrlParam(window.location.href, {
                    bridge: appName
                });
                //alert(browserURL);
                _this.config.bridgeBrowser === 'qqbrowser' ? _this.openUrlScheme('mttbrowser://url=' + browserURL) : _this.openUrlScheme('ucbrowser://' + browserURL);
            }
            //在微信里点微信分享，弹出右上角提示
            if (browsersInfo.isWeixin && (appName === 'weixin' || appName === 'weixintimeline' || appName === 'qq' || appName === 'qzone')) {
                _this.weixinTipMsg();
                return;
            }
            //对于没有原生分享的网站，使用webapi进行分享
            if (api) {
                (function() {
                    for (var k in config) {
                        api = api.replace(new RegExp('\\{\\{' + k + '\\}\\}', 'g'), encodeURIComponent(config[k]));
                    }
                    window.open(api, '_blank');
                })();
            }
        },
        //初始化DOM
        initRender: function() {
            var _this = this;
            var apps = _this.config.apps;
            var list = [];
            for (var i = 0, len = apps.length; i < len; i++) {
                list.push(
                    '<li class="share-item" data-app="' + apps[i] + '">' +
                    '<div class="icon-wrap ' + apps[i] + '">' +
                    '<img src="' + _this.urlAPI[apps[i]].icon + '" alt="' + _this.urlAPI[apps[i]].name + '">' +
                    '</div>' +
                    '</li>'
                );
            }
            _this.container.innerHTML = '<ul class="share-list">' + list.join('') + '</ul>';
        },
        //初始化事件
        initEvent: function() {
            var _this = this;
            var items = document.querySelectorAll('.share-item');
            var startTime = 0,
                endTime = 0;
            for (var i = 0, len = items.length; i < len; i++) {
                items[i].addEventListener('touchstart', function() {
                    startTime = Date.now();
                }, false);
                items[i].addEventListener('touchend', function() {
                    endTime = Date.now();
                    if (endTime - startTime < 500) {
                        _this.appName = this.getAttribute('data-app');
                        _this.shareTo(_this.appName);
                    }
                    startTime = 0;
                    endTime = 0;
                }, false);
            }
        },
        //初始化样式
        initStyle: function() {
            var styles = document.createElement('style');
            styles.type = 'text/css';
            var stylesArr = [
                '.share-list{width: 100%;overflow: hidden;font-size: 0;}\n',
                '.share-list .share-item{display: inline-block;width: 25%;font-size: 14px;margin-bottom: 16px;}\n',
                '.share-list .weixin{background-color: #49b233;}\n',
                '.share-list .weixintimeline{background-color: #1cb526;}\n',
                '.share-list .qq{background-color: #4081e1;}\n',
                '.share-list .qzone{background-color: #fdbe3d;}\n',
                '.share-list .weibo{background-color: #f04e59;}\n',
                '.share-list .yixin{background-color: #23cfaf;}\n',
                '.share-list .tqq{background-color: #97cbe1;}\n',
                '.share-list .tieba{background-color: #5b95f0;}\n',
                '.share-list .icon-wrap{width: 50px;height: 50px;text-align: center;vertical-align: middle;margin: 0 auto;border-radius: 50%;line-height: 50px;}\n',
                '.share-item img{width: 36px;vertical-align: middle;margin-top: -2px;}\n',
                '.weixinshare-mask{position:fixed;top:0;left:0;z-index:9999;width:100%;height:100%;background:rgba(0,0,0,.85);}\n',
                '.weixinshare-tip{display:block;width:117px;height:114px;position:absolute;top:10px;right:20px;}'
            ];
            styles.innerHTML = stylesArr.join('');
            document.getElementsByTagName('head')[0].appendChild(styles);
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
        //微信内提示右上角分享按钮
        weixinTipMsg: function() {
            var imgBase64 = 'data:image/png;base64,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';
            var div = document.createElement('div');
            div.className = 'weixinshare-mask';
            div.innerHTML = '<img class="weixinshare-tip" src="' + imgBase64 + '" alt="点击右上角分享" />';
            document.getElementsByTagName('body')[0].appendChild(div);
            window.setTimeout(function() {
                div && div.parentNode && div.parentNode.removeChild(div);
            }, 1500);
        },
        //对外分享组件接口文档，定制微信，手机QQ，QQ空间APP内的分享内容
        //文档:http://open.mobile.qq.com/api/component/share
        appJSSDK: function() {
            var config = this.config;
            this.loadScript('http://qzonestyle.gtimg.cn/qzone/qzact/common/share/share.js', function() {
                /**
                 * 定制接口
                 * @param opts 定制内容
                 */
                setShareInfo({
                    title: config.title, // 分享标题
                    summary: config.desc, // 分享内容
                    pic: config.img, // 分享图片
                    url: config.url, // 分享链接
                    // 微信权限验证配置信息，若不在微信传播，可忽略
                    WXconfig: {
                        swapTitleInWX: config.WXconfig.swapTitleInWX, // 是否标题内容互换（仅朋友圈，因朋友圈内只显示标题）
                        appId: config.WXconfig.appId, // 公众号的唯一标识
                        timestamp: config.WXconfig.timestamp, //生成签名的时间戳
                        nonceStr: config.WXconfig.nonceStr, //生成签名的随机串
                        signature: config.WXconfig.signature //签名
                    }
                });
            });
        }
    };
    return ShareApp;
});