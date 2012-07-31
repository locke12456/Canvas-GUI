include('Classes/AppDelegate.js');
//19
include('Graphic/EventHandler/include.js');
include('Graphic/Control/include.js');
include('Graphic/Utils/Utils.js');
include('Graphic/Effect/Convolution.js');
include('Graphic/Basic/include.js');
include('Graphic/com/include.js');
include('src/rules.js');
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
    powerBar:null,
    step:0,
    index:0,
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
    ccTouchesBegan:function (pTouches, pEvent) {

    },
    ccTouchesMoved:function (pTouches, pEvent) {

    },
    ccTouchesEnded:function (pTouches, pEvent) {
        switch (this.step) {
            case 0:
                if (this.ball.ActionRunning)return;
                this.powerBar.play();
                this.step = 1;
                break
            case 1:
                this.powerBar.stop();
                var miss = !this.powerBar.isHitLine();
                console.log(miss ? "MISS" : "HIT");
                this.ball.Shoot(miss, (miss ? false : Math.random() * 2 < 1));
                this.step = 0;

                break;
        }
    },
    update:function () {
        return;
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
    this.basket = new Graphic.Sprite("src/Image/Basket.png", this.basket);
    this.basket.setAnchorPoint(cc.ccp(0.5, 0));
    this.basket.setPosition(cc.ccp(size.width / 2, size.height - 274));
    lazyLayer.addChild(this.basket);
    this.ball = new Ball("src/Image/basketball.png", this.basket);
    this.ball.setAnchorPoint(cc.ccp(0.5, 0.5));
    this.ball.setPosition(cc.ccp(size.width / 2, 8));
    this.ball.BallPosition = cc.ccp(size.width / 2, 8);
    lazyLayer.addChild(this.ball);
    //this.ball.Shoot(false);
    this.powerBar = new PowerBar("src/Image/PowerBar/cover.png", "src/Image/PowerBar/bar.png", "src/Image/PowerBar/mask.png");
    this.powerBar.setPosition(cc.ccp(size.width / 2 - 153, size.height / 2));
    this.addChild(this.powerBar);
    Ball.BOTTON = size.height - 261;


    this.ballPoints = this.ball.shooting[1];
    this.ballGetPoints = this.ball.sink;
    console.log(this.ballPoints.length);
    cc.Director.sharedDirector().getTouchDispatcher().addStandardDelegate(this, 1);
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
