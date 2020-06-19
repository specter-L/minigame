
cc.Class({
    extends: cc.Component,

    properties: {
        //主界面的属性
       bgStart:cc.Button,
       bgGlory:cc.Button,
       candy:cc.Sprite,
       bgMain:cc.Sprite,
       gloryPanel:cc.Sprite
    },

   

    onLoad () {
        this.gloryPanel.node.active=false;
    },
    
    clickBtn_main(event,str){
        
        if(str=='glory'){
            //显示成就界面
            this.gloryPanel.node.active=true;
            //改变透明度
            this.bgMain.node.opacity=50;
            this.bgStart.node.opacity=10;
            this.bgGlory.node.opacity=10;
            this.candy.node.opacity=10;
        }else if(str=='gameStart'){

        }else if(str=='gloryClose'){
            //隐藏成就界面
            this.gloryPanel.node.active=false;
            //回复透明度
            this.bgMain.node.opacity=255;
            this.bgStart.node.opacity=255;
            this.bgGlory.node.opacity=255;
            this.candy.node.opacity=255;
        }
    }

    // start () {

    // },

    // update (dt) {},
});
