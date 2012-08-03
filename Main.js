//include('src/ProcessManager.js');
include('Classes/AppDelegate.js');
//19
include('Graphic/EventHandler/include.js');
include('Graphic/Control/include.js');
include('Graphic/Utils/Utils.js');
include('Graphic/Utils/Timer.js');
include('Graphic/Effect/Convolution.js');
include('Graphic/Basic/include.js');
include('Graphic/com/include.js');
include('src/rules.js');
include('io.js');
//19
var ProcessManager = cc.Layer.extend({
    Level:-1,
    Score:0,
    ctor:function () {
        this._super();
    },
    getLevel:function (score) {
        this.Score = score;
        if (score < ProcessManager.LEVEL_1) return -1;
        if (score >= ProcessManager.LEVEL_5)return 1;
        if (score >= ProcessManager.LEVEL_4)return .75;
        if (score >= ProcessManager.LEVEL_3)return .5;
        if (score >= ProcessManager.LEVEL_2)return .25;
        if (score >= ProcessManager.LEVEL_1)return 0;
    },
    isLevelUP:function (level) {
        if (level != this.Level) {
            this.Level = level;
            return true;
        }
        return false;
    }
});
ProcessManager.LEVEL_1 = 300;
ProcessManager.LEVEL_2 = 450;
ProcessManager.LEVEL_3 = 600;
ProcessManager.LEVEL_4 = 750;
ProcessManager.LEVEL_5 = 900;
var main;
var Main = ProcessManager.extend({
    bIsMouseDown:false,
    size:null,
    time:0,
    label:null,
    basket:null,
    ball:null,
    ballPoints:null,
    ballGetPoints:null,
    scoreBoard:null,
    powerBar:null,
    coin:11,
    ADD_TIME_COST:15,
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
        if (cc.Director.sharedDirector().isPaused())return;
        var level = this.getLevel(this.scoreBoard.getScore());
        switch (this.step) {
            case 0:
                if (this.ball.ActionRunning)return;
                this.powerBar.play(level);
                this.step = 1;
                break
            case 1:
                this.powerBar.stop();
                var miss = !this.powerBar.isHitLine();
                console.log(miss ? "MISS" : "HIT");
                this.ball.Shoot(miss, (miss ? false : this.powerBar.isHitCenter()), this.addScore, this);
                this.step = 0;
                break;
        }
    },
    update:function () {
        return;
    },
    addScore:function (target, sink) {
        if (sink) {
            var text = target.powerBar.isHitCenter() ? "Exelent" : Math.random() * 2 > 1 ? "Great" : "Good";
            target.label.showTextByName(text);
            target.scoreBoard.addScore(text == "Exelent" ? 30 : 20);
            var level = target.getLevel(target.scoreBoard.getScore());
            var result = target.isLevelUP(level);
            if (result) {
                target.addCoin();
            }
        } else
            target.label.showTextByName("Miss");
    },
    addCoin:function () {
        $("#CoinText").text(Graphic.Utils.AutoZeros(1, ++this.coin, true));
    },
    subCoin:function () {
        if (this.coin > 0) {
            if (this.scoreBoard.addTime(this.ADD_TIME_COST))
                $("#CoinText").text(Graphic.Utils.AutoZeros(1, --this.coin, true));
        }
    },
    closeCallback:function () {
        history.go(-1);
    },
    pause:function () {
        cc.Director.sharedDirector().pause();
    },
    resume:function () {
        cc.Director.sharedDirector().resume();
    }
});
//Main.bIsMouseDown = null;
Main.prototype.initLayer = function () {
    var size = this.size = cc.Director.sharedDirector().getWinSize();
    var lazyLayer = new cc.LazyLayer();
    this.addChild(lazyLayer);
    this.scoreBoard = new ScoreBoard(0, 30);
    this.subCoin();
    $("#Coin").show();
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
    this.label = new CSSTextDraw("Null", "BigBlocko", 56);
    this.label.setPosition(cc.ccp(size.width / 2, size.height - 64));
    //this.label.setAnchorPoint(cc.ccp(0.5, 0.5));
    // add the label as a child to this layer
    this.addChild(this.label, 5);
    cc.Director.sharedDirector().getTouchDispatcher().addStandardDelegate(this, 1);
    cc.Director.sharedDirector().getScheduler().scheduleUpdateForTarget(this, 0, false);

};
Main.subCoin = function () {
    if (main)
        main.subCoin();
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
