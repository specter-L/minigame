

var modeData = require('modeData');
cc.Class({
    extends: cc.Component,

    properties: {
        mode:{
            default:[],
            type:[cc.Button]
        },
        difficulty:{
            default:[],
            type:[cc.Button]
        },
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //隐藏难度选择
        for(var i=0;i<this.difficulty.length;i++){
            this.difficulty[i].node.active=false;
        }
    },

    clickMode(e){
        var node=e.target;
        //隐藏模式选择
        for(var i=0;i<this.mode.length;i++){
            this.mode[i].node.active=false;
        }
        //显示难度选择
        for(var i=0;i<this.difficulty.length;i++){
            this.difficulty[i].node.active=true;
        }
        //选择模式
        switch(node.name){
            case 'btnmode1':
                modeData.mode=1;
                break;

            case 'btnmode2':               
                modeData.mode=2;
                break;
            case 'btnmode3':               
                modeData.mode=3;
                break;
        }
        
    },

    clickDifficulty(e){
        var node=e.target;
        //选择难度
        switch(node.name){
            case 'btn_difficulty1':
                modeData.difficulty=1;
                break;
            case 'btn_difficulty2':
                modeData.difficulty=2;
                break;
            case 'btn_difficulty3':
                modeData.difficulty=3;
                break;      
            case 'btn_difficulty4':
                modeData.difficulty=4;
                break;  
            case 'btn_difficulty5':
                modeData.difficulty=5;
                break;
        }
        
        if(modeData.mode==1){
            cc.director.loadScene("model1");
        }else if(modeData.mode==2){
            cc.director.loadScene("model2");
        }else if(modeData.mode==3){
            cc.director.loadScene("model3");
        }

    }
    // start () {

    // },

    // update (dt) {},
});
