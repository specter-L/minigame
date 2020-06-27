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

var pageNum=1;//页数
var wordsHistory=[];
cc.Class({
    extends: cc.Component,

    properties: {
        //主界面的属性
        bgStart:cc.Button,
        bgGlory:cc.Button,
        bgMain:cc.Sprite,
        gloryPanel:cc.Sprite,
        avatar:cc.Sprite,
        userName:cc.Label,
        trophyLabel:cc.Label,
        btnWord:cc.Button,

        modeNum:{
            default:[],
            type:[cc.Label]
        },
        modeGloryNum:{
            default:[],
            type:[cc.Label]
        },

        gloryWordView:cc.Sprite,
        nineWords:{
            default:[],
            type:[cc.Sprite]
        },
        pageLabel:cc.Label,
        blackSprite:cc.Sprite,

        wordInfo:{
            default:[],
            type:[cc.Label]
        },
        gloryWordMessage:cc.Sprite
    },

   
    //设置头像图片和昵称和奖杯
    onLoad () {
        

        var obj=this;
        post('http://'+modeData.ip+':8080/miniGame/glory','openId='+modeData.openId,
            function(res){
                obj.trophyLabel.string='X '+res;
            }
        );

        this.gloryPanel.node.active=false;
        this.loadImg(modeData.url+'?aaa=aa.jpg');      
        this.userName.string=modeData.name;
    },
    
    clickBtn_main(event,str){
        var obj=this;
        if(str=='glory'){
            //显示成就界面
            this.gloryPanel.node.active=true;
            this.blackSprite.node.active=true;
            //改变透明度
            this.bgMain.node.opacity=50;
            this.bgStart.node.opacity=10;
            this.bgGlory.node.opacity=10;
            this.btnWord.node.opacity=10;
            post('http://'+modeData.ip+':8080/miniGame/gloryInfo','openId='+modeData.openId,
                function(res){
                    var result=JSON.parse(res);
                    obj.modeGloryNum[0].string='X '+result.glory1;
                    obj.modeGloryNum[1].string='X '+result.glory2;
                    obj.modeGloryNum[2].string='X '+result.glory3;
                    obj.modeNum[0].string=result.modeNum1;
                    obj.modeNum[1].string=result.modeNum2;
                    obj.modeNum[2].string=result.modeNum3;
                }

            );

        }else if(str=='gameStart'){
            cc.director.loadScene("modeSelection");
        }else if(str=='gloryClose'){
            //隐藏成就界面
            this.gloryPanel.node.active=false;
            this.blackSprite.node.active=false;
            //回复透明度
            this.bgMain.node.opacity=255;
            this.bgStart.node.opacity=255;
            this.bgGlory.node.opacity=255;
            this.btnWord.node.opacity=255;
        }else if(str=='btnWord'){
            this.gloryWordView.node.active=true;
            this.blackSprite.node.active=true;
            this.bgMain.node.opacity=50;
            this.bgStart.node.opacity=10;
            this.bgGlory.node.opacity=10;
            this.btnWord.node.opacity=10;
            
            post('http://'+modeData.ip+':8080/miniGame/wordHistory','openId='+modeData.openId,
                function(res){//初始化第一页
                    obj.pageLabel.string=1;//初始化第一页页数
                    var result=JSON.parse(res);
                    
                    if(result!=null){
                        wordsHistory=result;
                        pageNum=Math.ceil(result.length/9);//页数
                        if(pageNum>1){
                            for(var i=0;i<9;i++){
                                obj.nineWords[i].node.active=true;
                                obj.nineWords[i].node.children[0].getComponent(cc.Label).string=result[i].word;
                            }
                        }else{
                            for(var i=0;i<result.length;i++){
                                obj.nineWords[i].node.active=true;
                                obj.nineWords[i].node.children[0].getComponent(cc.Label).string=result[i].word;
                            }
                        }
                        
                    }
                }
            );
        }else if(str=='gloryWordViewClose'){
            this.gloryWordView.node.active=false;
            this.blackSprite.node.active=false;
            this.bgMain.node.opacity=255;
            this.bgStart.node.opacity=255;
            this.bgGlory.node.opacity=255;
            this.btnWord.node.opacity=255;

            for(var i=0;i<9;i++){
                obj.nineWords[i].node.active=false;
            }
        }else if(str=='btnBack'){
            

            var pageVal=parseInt(this.pageLabel.string);
            if((pageVal-1)<1||pageNum==1){
                console.log('额');
                return;
            }else{
                for(var i=0;i<9;i++){
                    this.nineWords[i].node.active=false;
                }
                pageVal--;
                this.pageLabel.string=pageVal;
                var index=0;
                for(var i=(pageVal-1)*9;i<(pageVal-1)*9+9;i++){
                    if(i>wordsHistory.length-1){
                        break;
                    }
                    this.nineWords[index].node.active=true;
                    this.nineWords[index].node.children[0].getComponent(cc.Label).string=wordsHistory[i].word;
                    index++;
                }
            }
        }else if(str=='btnNext'){
            
            var pageVal=parseInt(this.pageLabel.string);
            console.log(pageVal+1);
            if((pageVal+1)>pageNum||pageNum==1){
                console.log('额');
                return;
            }else{
                for(var i=0;i<9;i++){
                    this.nineWords[i].node.active=false;
                }
                pageVal++;
                this.pageLabel.string=pageVal;
                var index=0;
                for(var i=(pageVal-1)*9;i<(pageVal-1)*9+9;i++){
                    if(i>wordsHistory.length-1){
                        break;
                    }
                    this.nineWords[index].node.active=true;
                    this.nineWords[index].node.children[0].getComponent(cc.Label).string=wordsHistory[i].word;
                    index++;
                }
            }
        }
    },

    clickAWordInfo(e){
        var node=e.target;
        var obj=this;
        if(node.name=='wordMessageClose'){
            this.gloryWordMessage.node.active=false;
            this.gloryWordView.node.opacity=255;
        }else{
            post('http://'+modeData.ip+':8080/miniGame/aWordInfo','wordStr='+node.getComponent(cc.Label).string,
                function(res){
                    console.log(res);
                    var result=JSON.parse(res);
                    obj.wordInfo[0].string=result.word;
                    obj.wordInfo[1].string=result.spell;
                    obj.wordInfo[2].string=result.strokeNumber;
                    obj.wordInfo[3].string=result.radicals;
                }
            );
            this.gloryWordMessage.node.active=true;
            this.gloryWordView.node.opacity=30;
        }
    },

    loadImg(url){
        var obj=this;
        cc.loader.load(url, function (err, texture) {
            
            obj.avatar.spriteFrame  = new cc.SpriteFrame(texture);
            
        });
    }

    // start () {

    // },

    // update (dt) {},
});
