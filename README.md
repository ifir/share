# share-app v0.0.1

## 原生无依赖，移动端分享插件(完善ing...)

## js移动端原生分享

### 开发

> gulp dev

### 打包

> gulp build

```
实现的主要功能:
1、IOS/Android原生分享
2、通过URL Scheme 唤醒APP实现分享
3、对于一些浏览器不支持原生分享,采用以QQ浏览器或者UC浏览器作为中间桥梁实现原生分享
4、在微信,QQ,Qzon三个APP内部浏览器打开浏览器分享实现调用JS SDK实现分享
5、在微信内部不允许进行其他APP跳转，会有出现提示点击右上角分享
6、自定义设置需要分享的APP
7、无依赖，引用一个js文件即可，无需关心图片和样式
8、自定义作为中间桥梁浏览器仅限UC和QQ浏览器,默认UC
9、默认样式可以不渲染,icon也可自定义(可传入base64位，url，你的图片路径),根据自己的喜好设置
10、内嵌的APP html5如果有分享可以调用其自身APP分享接口
Tips:不支持原生分享指的是JS无法调用浏览器分享接口
```

### 如何使用
1、页面引用
```
<script src="youpath/share-app.js"></script>
<script>
	var config = {
        url:window.location.href,// 分享的网页链接
        title:'分享标题',// 标题
        desc:'分享描述',// 描述
        img:'http://.......',// 图片
        img_title:'图片标题',// 图片标题
        from:'振霖', // 来源
        //自定义你想分享到的APP，默认['weixin', 'weixintimeline', 'qq', 'weibo']；
        //支持的app有 ['weixin', 'weixintimeline', 'qq', 'weibo', 'qzone', 'yixin']
        apps:['weixin', 'weixintimeline', 'qq', 'qzone', 'weibo'],
        //微信config，如果不需要分享到微信可忽略WXconfig配置
        WXconfig:{
        	swapTitleInWX: false, // 是否标题内容互换（仅朋友圈，因朋友圈内只显示标题）
			appId: 'appId', // 公众号的唯一标识
			timestamp: 'timestamp', // 生成签名的时间戳
			nonceStr: 'nonceStr', // 生成签名的随机串
			signature: 'signature' // 签名
        },
        bridgeBrowser:'qqbrowser' //默认ucbrowser
        //是否采用默认样式，默认true
        defaultStyles: true,
        //是否采用自己的图标，默认不采用，不需要配置setIcons
        //defaultIcons设置false，进行icon的修改
        setIcons: {
            defaultIcons: false,
            icons: {
                weixin: ''
            }
        },
        //bridgeBrowser:'qqbrowser' //默认ucbrowser
        //如果是APP内嵌网页,直接调用本app的分享js接口
        //nativeAppJSApi函数内部还需要分享接口是否支持进行判断,如果成功请return
        nativeAppJSApi: function () {
            console.log(1);
            return;
        }
    };
    //ShareApp(selector, config)
    //selector为生成分享图标的父容器
    //config为分享配置
	var shareApp = new ShareApp('.container',config);
</script>
```
### OR

2、npm安装(还没有发布^_^)

> npm install --save share-app
```
var ShareApp = require('share-app');
var config = {...};
var shareApp = new ShareApp('.container',config);
```