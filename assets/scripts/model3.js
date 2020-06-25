var modeData = require('modeData');
var state;
var post=function post(url, data, callback){
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
        choice:{
            default:[],
            type:[cc.Label]
        },
        problem:cc.Label
    },

    onLoad () {
        state=0;//找部首
    },

    start () {
        var ip='http://localhost:8080/miniGame/mode3';
        var param='mode='+modeData.mode+'&difficulty='+modeData.difficulty+'&state='+state;
        var obj=this;
        if(state==0){
            post(ip,param,
                function(res){
                    cc.log(res);
                    var result=JSON.parse(res);
                    var correct=result[0];
                    for(var i=0;i<result.length;i++){
                        if(result[i].radicals==correct.radicals){
                            modeData.correctOpt1.push(result[i]);
                        }
                    }
                    obj.problem.string='选择所有偏旁为[  '+correct.radicals+'  ]字旁的汉字';
    
                    var index;//第几个选项
                    var ind=0;//响应结果数组中的第几个
                    var temp=[0,1,2,3,4,5];
                    while(temp.length!=0&&ind<6){
                        index=Math.floor(Math.random()*temp.length);
                        obj.choice[temp[index]].string=result[ind].word;//响应结果数组中的某一个随机放入某个选项
                        temp.splice(index,1);
                        ind++;
                    }
                
                }
            );
        }else if(state==1){
            post(ip,param,
                function(res){
                    cc.log(res);
                    var result=JSON.parse(res);
                    var correct=result[0];
                    for(var i=0;i<result.length;i++){
                        if(result[i].strokeNumber==correct.strokeNumber){
                            modeData.correctOpt2.push(result[i]);
                        }
                    }
                    obj.problem.string='选择所有笔画为[  '+correct.strokeNumber+'  ]的汉字';
    
                    var index;//第几个选项
                    var ind=0;//响应结果数组中的第几个
                    var temp=[0,1,2,3,4,5];
                    while(temp.length!=0&&ind<6){
                        index=Math.floor(Math.random()*temp.length);
                        obj.choice[temp[index]].string=result[ind].word;//响应结果数组中的某一个随机放入某个选项
                        temp.splice(index,1);
                        ind++;
                    }
                
                }
            );
        }
        
    },

    clickCommit(e){
        var node=e.target;

        cc.log(node.name);

        if(node.name=='btnsure'){
            var playerChoiceNum=0;
            var score;
            var correctOpt;
            if(state==0){
                score=modeData.score1;
                correctOpt=modeData.correctOpt1;
            }else if(state==1){
                score=modeData.score2;
                correctOpt=modeData.correctOpt2;
            }
            for(var i=0;i<this.choice.length;i++){
                var color=this.choice[i].node.color;
                cc.log(color);
                if(color.r==0&&color.g==0&&color.b==0&&color.a==255){
                    playerChoiceNum++;
                    if(!this.isInclude(this.choice[i].string)){
                        score=0;
                        break;
                    }
                }
            }
            cc.log('多少个黑的：'+playerChoiceNum);
            if(playerChoiceNum<correctOpt.length&&score==null){
                score=1;
            }else if(playerChoiceNum==correctOpt.length&&score==null){
                score=1.5;
            }
            if(state==0){
                modeData.score1=score;
                modeData.correctOpt1=correctOpt;
            }else if(state==1){
                modeData.score2=score;
                modeData.correctOpt2=correctOpt;
            }
            
            if(state==0){
                state++;
                for(var i=0;i<this.choice.length;i++){
                    this.choice[i].node.color=new cc.Color(255,255,255,255);
                }
                this.start();
            }else if(state==1){
                
                cc.director.loadScene("gameover");
            }
        }else{
            var color=node.children[0].children[0].color;
            if(color.r==255&&color.g==255&&color.b==255&&color.a==255){
                color=new cc.Color(0,0,0,255);
            }else if(color.r==0&&color.g==0&&color.b==0&&color.a==255){
                color=new cc.Color(255,255,255,255);
            }
            node.children[0].children[0].color=color;
        }
    },

    isInclude(word){
        if(state==0){
            for(var i=0;i<modeData.correctOpt1.length;i++){
                if(word==modeData.correctOpt1[i].word){
                    return true;
                }
            }
        }else if(state==1){
            for(var i=0;i<modeData.correctOpt2.length;i++){
                if(word==modeData.correctOpt2[i].word){
                    return true;
                }
            }
        }
        
        return false;
    }
    // update (dt) {},
});
