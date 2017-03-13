function share(config) {
	var ah = {
        url: config.url,
        title: config.title,
        description: config.desc,
        img_url: config.img,
        img_title: config.img_title,
        to_app: 1,//微信好友1,腾讯微博2,QQ空间3,QQ好友4,生成二维码7,微信朋友圈8,啾啾分享9,复制网址10,分享到微博11,创意分享13
        cus_txt: "请输入此时此刻想要分享的内容"
    };
    
    if (typeof browser != "undefined") {
        if (typeof browser.app != "undefined") {
        	//alert(browser.app.share);
            browser.app.share(ah);
        }
    }else{
    	var d = document.createElement("script");
	    var a = document.getElementsByTagName("body")[0];
	    d.setAttribute("src", '//jsapi.qq.com/get?api=app.share');
	    a.appendChild(d);
	    share(config)
    }
}