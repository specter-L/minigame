var modeData = require("modeData");
var post=function (url, data, callback){
    //创建异步对象
    var xhr = new XMLHttpRequest();
    //设置请求行
    xhr.open('post',url);
    //设置请求头(post有数据发送才需要设置请求头)
    //判断是否有数据发送
    if(data){
          xhr.setRequestHeader('content-type','application/x-www-form-urlencoded');
    }
    //注册回调函数
    xhr.onreadystatechange = function(){
          if(xhr.readyState==4&&xhr.status==200){
              //调用传递的回调函数
              callback(xhr.responseText);
          }
    }
    //发送请求主体
    xhr.send(data);
};

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    },

    start () {
        this.OnClickAuth();
    },
    OnClickAuth(){
        

        let self = this;
        let wx = window['wx'];
        let sysInfo = wx.getSystemInfoSync();
        //获取微信界面大小
        let width = sysInfo.screenWidth;
        let height = sysInfo.screenHeight;
        window.wx.getSetting({
            success (res) {
                
                if (res.authSetting["scope.userInfo"]) {//用户已授权
                    
                    wx.getUserInfo({
                        success(res){
                            modeData.name=res.userInfo.nickName;
                            modeData.url=res.userInfo.avatarUrl;
                            window.wx.login({
                                success: (userRes) => {
                                    post('http://'+modeData.ip+':8080/miniGame/login','code='+userRes.code,
                                    function(res){           
                                        modeData.openId=res;
                                        cc.director.loadScene("main");
                                     });
                                },
                            });
                            
                        }
                    });
                }else{//用户未授权
                    
                    let button = wx.createUserInfoButton({
                    type: 'text',
                    text: '',
                    style: {
                        left: 0,
                        top: 0,
                        width: width,
                        height: height,
                        backgroundColor: '#00000000',//最后两位为透明度
                        color: '#ffffff',
                        fontSize: 20,
                        textAlign: "center",
                        lineHeight: height,
                    }
                    });
                    button.onTap((res) => {
                    if (res.userInfo) {
                        
                        console.log('用户接受授权');
                        modeData.name=res.userInfo.nickName;
                        modeData.url=res.userInfo.avatarUrl;
                        window.wx.login({
                            success: (userRes) => {
                                post('http://'+modeData.ip+':8080/miniGame/login','code='+userRes.code,
                                function(res){           
                                    modeData.openId=res;
                                    cc.director.loadScene("main");
                                 });
                            },
                        });
                        
                        //此时可进行登录操作
                        button.destroy();
                    }else {
                        console.log("用户拒绝授权:");
                        
                    }
                    });
                }
            }
        });

        
       
        
        

        
    }
    

    
    // update (dt) {},
});
