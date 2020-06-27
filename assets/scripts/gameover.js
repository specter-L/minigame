var modeData = require('modeData');
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
        trophy:{
            default:[],
            type:[cc.Sprite]
        },
        trophyImg:cc.SpriteFrame,
        feetbackLabel:cc.Label,
        messageView:cc.Sprite,
        feetbackView:cc.Sprite
    },

    onLoad(){
        this.messageView.node.active=false;
        this.feetbackView.node.active=true;
    },

    start () {
        if(modeData.mode==3){//关卡3
            
            if(modeData.timeCount==0){
                cc.log('hashasha');
                this.feetbackLabel.getComponent(cc.Label).string='很遗憾,你没有在规定时间内完成！';
                modeData.score1=modeData.score2=0;
                return;
            }
            var score=Math.floor(modeData.score1+modeData.score2);
            if(score==3){
                this.feetbackLabel.getComponent(cc.Label).string='恭喜你全部答对,再接再厉！';
            }else{
                //显示第一题找部首信息
                if(modeData.score1==1.5){
                    this.feetbackLabel.getComponent(cc.Label).string='你成功挑战第一题(找部首)\n';
                }else{
                    if(modeData.score1==0){
                        this.feetbackLabel.getComponent(cc.Label).string='第一题(找部首),你选择了错误选项,正确答案如下\n';
                    }else if(modeData.score1==1){
                        this.feetbackLabel.getComponent(cc.Label).string='第一题(找部首),你选择的正确选项不完整,正确答案如下\n'
                    }
                    
                    this.feetbackLabel.getComponent(cc.Label).string+='部首[ '+modeData.correctOpt1[0].radicals+' ]:'
                    for(var i=0;i<modeData.correctOpt1.length;i++){
                        this.feetbackLabel.getComponent(cc.Label).string+=modeData.correctOpt1[i].word+'\t';
                    }
                    this.feetbackLabel.getComponent(cc.Label).string+='\n';
                }
                //显示第二题找笔画信息
                this.feetbackLabel.getComponent(cc.Label).string+='\n';
                if(modeData.score2==1.5){
                    this.feetbackLabel.getComponent(cc.Label).string+='你成功挑战第二题(找笔画)\n';
                }else{
                    if(modeData.score2==0){
                        this.feetbackLabel.getComponent(cc.Label).string+='第二题(找笔画),你选择了错误选项,正确答案如下\n';
                    }else if(modeData.score2==1){
                        this.feetbackLabel.getComponent(cc.Label).string+='第二题(找笔画),你选择的正确选项不完整,正确答案如下\n'
                    }
                    
                    this.feetbackLabel.getComponent(cc.Label).string+='笔画[ '+modeData.correctOpt2[0].strokeNumber+' ]:'
                    for(var i=0;i<modeData.correctOpt2.length;i++){
                        this.feetbackLabel.getComponent(cc.Label).string+=modeData.correctOpt2[i].word+'\t';
                    }
                    
                }
            }
        }else{//关卡1 2
            if(modeData.correctArray.length==3){
                this.feetbackLabel.getComponent(cc.Label).string='恭喜你全部答对，再接再厉！';
            }else{
                this.feetbackLabel.getComponent(cc.Label).string='你答对了'+modeData.correctArray.length+'道题,请不要气馁,下次再战!'+'请及时改正错题!'+'\n';
                for(var i=0;i<modeData.unCorrectArray.length;i++){
                    this.feetbackLabel.getComponent(cc.Label).string+='\n'+modeData.unCorrectArray[i].word+'→'+modeData.unCorrectArray[i].spell+'\t';
                }
            }
        }
    },
    //显示奖杯个数
    show(){
        
        if(modeData.mode==3){
            var score=Math.floor(modeData.score1+modeData.score2);
            post('http://'+modeData.ip+':8080/miniGame/gloryUpd','mode='+modeData.mode+'&score='+score+'&openId='+modeData.openId,
                function(res){

                }
            );

            for(var i=0;i<score;i++){
                cc.log(this.trophy[i].node.getComponent(cc.Sprite).spriteFrame);
                cc.tween(this.trophy[i].node).to(0,{opacity:0}).to(1.5,{opacity:255}).start();
                this.trophy[i].node.getComponent(cc.Sprite).spriteFrame= this.trophyImg;
            }
            this.messageView.node.active=true;
            modeData.correctOpt1=[];
            modeData.correctOpt2=[];
            modeData.score1=null;
            modeData.score2=null;
            modeData.timeCount=60;
        }else{
            post('http://'+modeData.ip+':8080/miniGame/gloryUpd','mode='+modeData.mode+'&score='+modeData.correctArray.length+'&openId='+modeData.openId,
                function(res){

                }
            );
            for(var i=0;i<modeData.correctArray.length;i++){
                cc.log(this.trophy[i].node.getComponent(cc.Sprite).spriteFrame);
                cc.tween(this.trophy[i].node).to(0,{opacity:0}).to(1.5,{opacity:255}).start();
                this.trophy[i].node.getComponent(cc.Sprite).spriteFrame= this.trophyImg;
            }
            this.messageView.node.active=true;
            modeData.correctArray=[];
            modeData.unCorrectArray=[];
        }
    },

    clickBtn(e){
        var node=e.target;
        switch(node.name){
            case 'btnagain':
                if(modeData.mode==1){
                    cc.director.loadScene("model1");
                }else if(modeData.mode==2){
                    cc.director.loadScene("model2");
                }else if(modeData.mode==3){
                    cc.director.loadScene("model3");
                }
                break;
            case 'btnback':
                cc.director.loadScene("main");
                break;
            case 'btnSure':
                this.feetbackView.node.active=false;
                
                this.show();
                break;
        }
    }
    

    // update (dt) {},
});
