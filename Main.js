include('Classes/AppDelegate.js');
//19
include('Graphic/EventHandler/include.js');
include('Graphic/Control/include.js');
include('Graphic/Utils/Utils.js');
include('Graphic/Effect/Convolution.js');
include('Graphic/Basic/include.js');
include('Graphic/com/include.js');
include('io.js');
//19

var main;
var Main = cc.Layer.extend({
    bIsMouseDown:false,
    size:null,
    time:0,
    basket:null,
    ball:null,
    ballPoints:null,
    ballGetPoints:null,
    item:[],
    init:function () {
        //////////////////////////////
        // 1. super init first
        this._super();
        return true;
    },
    onEnter:function () {
        this._super();
        this.initLayer();
    },
    update:function () {
        var percent = this.time / 33 * 0.6;
        var point = this.time < this.ballPoints.length ? this.ballPoints : this.ballGetPoints;
        var time = this.time < this.ballPoints.length ? this.time : this.time - this.ballPoints.length;
        this.ball.x = point[time].x;
        this.ball.y = point[time].y;
        if (this.time < 33) {
            this.ball.setScale(1 - percent);
        }//else if(this.time%3==0)this.basket.setRotation(-2+(this.time%4));
        this.ball.setRotation(this.ball.getRotation() + 10);
        //this.label.setString(this.win.getScrollProgress());
        this.time = (this.time + 1) % (this.ballPoints.length + this.ballGetPoints.length);
    },
    closeCallback:function () {
        history.go(-1);
    }
});
//Main.bIsMouseDown = null;
Main.prototype.initLayer = function () {
    var size = this.size = cc.Director.sharedDirector().getWinSize();
    var lazyLayer = new cc.LazyLayer();
    this.addChild(lazyLayer);

    //init background
    var background = cc.Sprite.create("src/Image/Background.png");
    background.setAnchorPoint(cc.ccp(0.5, 0.5));
    background.setPosition(cc.ccp(size.width / 2, size.height / 2));
    lazyLayer.addChild(background, 4);
    console.log(background.x);
    var lazyLayer = new cc.LazyLayer();
    this.addChild(lazyLayer);
    this.basket = new Graphic.Sprite("src/Image/Basket.png");
    this.basket.setAnchorPoint(cc.ccp(0.5, 0));
    this.basket.setPosition(cc.ccp(size.width / 2, size.height - 274));
    lazyLayer.addChild(this.basket);

    this.ball = new Graphic.Sprite("src/Image/basketball.png");
    this.ball.setAnchorPoint(cc.ccp(0.5, 0.5));
    this.ball.setPosition(cc.ccp(size.width / 2, 8));
    lazyLayer.addChild(this.ball);
    var p1 = {x:this.ball.x, y:this.ball.y};
    var p2 = {x:277, y:this.size.height - 70};
    var arr = [
        {x:205, y:this.size.height - 340},
        {x:207, y:this.size.height - 43.5},
        {x:284.5, y:this.size.height - 36.25}
    ];
    this.ballPoints = Graphic.Utils.bezier_Make(p1, p2, arr);
    p1 = {x:277, y:this.size.height - 70};
    p2 = {x:276, y:this.size.height - 63};
    arr = [
        {x:270, y:this.size.height - 74.75},
        {x:317.25, y:this.size.height - 72.5},
        {x:296.25, y:this.size.height - 73.75},
        {x:248.75, y:this.size.height - 74.25},
        {x:213.5, y:this.size.height - 72.75}
    ];
    /*[
     {x:205, y:this.size.height - 340},
     {x:207, y:this.size.height - 43.5},
     {x:284.5, y:this.size.height - 36.25}
     ]*/
    this.ballGetPoints = Graphic.Utils.bezier_Make(p1, p2, arr);
    console.log(this.ballPoints.length);
    cc.Director.sharedDirector().getScheduler().scheduleUpdateForTarget(this, 0, false);

};
Main.scene = function () {
    // 'scene' is an autorelease object
    var scene = cc.Scene.create();
    // 'layer' is an autorelease object
    var layer = Main.node();
    scene.addChild(layer);
    return scene;
};

// implement the "static node()" method manually
Main.node = function () {
    var pRet = new Main();

    // Init the Main display layer.
    if (pRet && pRet.init()) {
        main = pRet;
        return pRet;
    }

    return null;
};
Main.sharedLayer = function () {
    if (main != null)
        return main;
    else
        return Main.node();
};
