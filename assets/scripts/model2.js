var modeData = require('modeData');
var correct=null;
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
        wordLabel:cc.Label,
        choice:{
            default:[],
            type:[cc.Label]
        },
    },
    onLoad () {

    },
    start () {
        var ip='http://localhost:8080/miniGame/mode2';
        var param='mode='+modeData.mode+'&difficulty='+modeData.difficulty;
        var obj=this;
        post(ip,param,
            function(res){
                cc.log(res);
                var result=JSON.parse(res);
                correct=result[3];
                obj.wordLabel.string=correct.word;
            

                var index;//第几个选项
                var ind=0;//响应结果数组中的第几个
                var temp=[0,1,2,3];
                while(temp.length!=0&&ind<4){
                    index=Math.floor(Math.random()*temp.length);
                    obj.choice[temp[index]].string=result[ind].spell;//响应结果数组中的某一个随机放入某个选项
                    temp.splice(index,1);
                    ind++;
                }
            
            }
        );
    },


    clickOpt(e){
        var node=e.target;
        if(node.children[0].children[0].getComponent(cc.Label).string==correct.spell){
            modeData.correctArray.push(correct);
            if((modeData.correctArray.length+modeData.unCorrectArray.length)==3){
                cc.director.loadScene("gameover");
            }else{
                this.start(); 
            }
            
            
        }else{
            modeData.unCorrectArray.push(correct);
            if((modeData.correctArray.length+modeData.unCorrectArray.length)==3){
                cc.director.loadScene("gameover");
            }else{
                this.start(); 
            }
        }
        
    }
    

    // update (dt) {},
});
