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
8、
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
        img:'https://hbfile.b0.upaiyun.com/img/category_page/2e94335da287cfdfd7990bd88eb8ff37262e322492a5',// 图片
        img_title:'图片标题',// 图片标题
        from:'fir', // 来源
        //自定义你想分享到的APP
        apps:['weixin', 'weixintimeline', 'qq', 'qzone', 'weibo'],
        //微信config
        WXconfig:{
        	swapTitleInWX: false, // 是否标题内容互换（仅朋友圈，因朋友圈内只显示标题）
			appId: 'appId', // 公众号的唯一标识
			timestamp: 'timestamp', // 生成签名的时间戳
			nonceStr: 'nonceStr', // 生成签名的随机串
			signature: 'signature' // 签名
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