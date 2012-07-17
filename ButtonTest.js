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
    Center:null,
    win:null,
    init:function () {
        //////////////////////////////
        // 1. super init first
        this._super();
        this.setIsTouchEnabled(true);
        //this._position = this.getPosition();
        return true;
    },
    onEnter:function () {
        this._super();
        this.initLayer();
    },
    closeCallback:function () {
        history.go(-1);
    },
    update:null
});
//Main.bIsMouseDown = null;
Main.prototype.initLayer = function () {
    var size = this.size = cc.Director.sharedDirector().getWinSize();
    var back = cc.LayerColor.create(cc.ccc4(0, 0, 0, 128), size.width, size.height);
    var x = size.width / 4;
    var lazyLayer = new cc.LazyLayer();
    this.addChild(lazyLayer);
    lazyLayer.addChild(back);
    for (var i = 0; i < 10; i++) {
        var button = new Graphic.Component.Button("Resources/Button0" + i + "_1.png");
        button.setPosition(cc.ccp(x - button.width / 2, size.height / 2 - button.height / 2));
        button.setMoveEffect(Graphic.Component.Button.MoveEffect.AlphaInverse);
        lazyLayer.addChild(button);
        x += button.width;
    }

    /*
     var sprite = new Graphic.Sprite();
     var pic = new Graphic.Sprite("Resources/cocos64.png");
     var down = new Graphic.Sprite();
     var up = new Graphic.Sprite();

     var texture = Graphic.Utils.TextureToImageData(pic.getTexture());
     var d = Graphic.Effect.Convolution(cc.renderContext,texture,Graphic.Effect.vBevel,254);
     var u = Graphic.Effect.Convolution(cc.renderContext,texture,Graphic.Effect.Bevel,254);
     up.initWithTexture(Graphic.Utils.ImageDatasToTexture(u),cc.RectMake(0,0,pic.getContentSize().width,pic.getContentSize().height));
     down.initWithTexture(Graphic.Utils.ImageDatasToTexture(d),cc.RectMake(0,0,pic.getContentSize().width,pic.getContentSize().height));
     sprite.setPosition(cc.ccp(size.width / 2, size.height / 2));
     sprite.addChild(up);
     sprite.addChild(down);

     sprite.addEventListener(Graphic.MouseEvent.MOUSE_DOWN, button);
     sprite.addEventListener(Graphic.MouseEvent.MOUSE_UP, button);
     //sprite.addEventListener(Graphic.MouseEvent.MOUSE_OVER, move);
     //sprite.addEventListener(Graphic.MouseEvent.MOUSE_OUT, move);
     sprite.dispatchEvent(Graphic.MouseEvent.MOUSE_UP);
     this.addChild(sprite);
     var color =new Graphic.ColorRect(cc.ccc4(11,128,128, 128));
     color.setPosition(cc.ccp(size.width/2, size.height/2));
     color.setContentSize(cc.SizeMake(30, 30));
     color.setAnchorPoint(cc.ccp(-0.05, 1.05));
     var sprite = new Graphic.Sprite();
     var up = new Graphic.Sprite();
     var down = new Graphic.Sprite();
     var texture = Graphic.Utils.SpriteToImageData(color) ;
     var utexture= Graphic.Effect.Convolution(cc.renderContext,texture,Graphic.Effect.Bevel,0);
     var dtexture= Graphic.Effect.Convolution(cc.renderContext,utexture,Graphic.Effect.vBevel,0);
     delete texture;
     //texture= Graphic.Effect.Convolution(cc.renderContext,texture,Graphic.Effect.vBevel,0);
     up.initWithTexture(Graphic.Utils.ImageDatasToTexture(utexture), cc.RectMake(0,0,30,30))
     up.setScaleX(2);
     sprite.setPosition(cc.ccp(size.width / 2+60, size.height / 2));
     down.initWithTexture(Graphic.Utils.ImageDatasToTexture(dtexture), cc.RectMake(0,0,30,30))
     down.setScaleX(2);
     sprite.addChild(up);
     sprite.addChild(down);

     sprite.addEventListener(Graphic.MouseEvent.MOUSE_DOWN, button);
     sprite.addEventListener(Graphic.MouseEvent.MOUSE_UP, button);
     //sprite.addEventListener(Graphic.MouseEvent.MOUSE_OVER, move);
     //sprite.addEventListener(Graphic.MouseEvent.MOUSE_OUT, move);
     sprite.dispatchEvent(Graphic.MouseEvent.MOUSE_UP);
     this.addChild(sprite);
     color.setAnchorPoint(cc.ccp(0.5, 0.5));
     this.addChild(color);
     /*
     var text = new Graphic.Component.TextInputBox();
     text.setPosition(cc.ccp(size.width/2, size.height/2));
     this.addChild(text);

     /*
     var rect = new Graphic.Sprite();
     rect.load("src/image/rect.png");
     var rect_inside = new Graphic.Sprite();
     rect_inside.load("src/image/rect_inside.png");
     var tWin = this.win = new SWindow();
     //tWin.init();
     tWin.addToBackground(rect_inside);
     tWin.addToForeground(rect);
     // When five parameters
     //textField.setPosition(cc.ccp(50, 0));
     rect_inside.setScaleX(1.15);
     rect_inside.setScaleY(1.12);
     rect_inside.y += 6;
     tWin.setPosition(cc.ccp(size.width / 2, size.height / 2));
     tWin.setScale(2);
     // tWin.addEventListener(Graphic.MouseEvent.MOUSE_CLICK, moveLU);

     this.addChild(tWin);

     var speed = 0.1;
     var action = [cc.MoveTo.create(speed, cc.ccp(tWin.width / 2, size.height - tWin.height / 2)),
     cc.MoveTo.create(speed, cc.ccp(size.width - tWin.width / 2, size.height - tWin.height / 2)),
     cc.MoveTo.create(speed, cc.ccp(size.width - tWin.width / 2, size.height - tWin.height)),
     cc.MoveTo.create(speed, cc.ccp(tWin.width / 2, size.height - tWin.height))
     ];

     var scale = [cc.ScaleTo.create(speed, -2, -2), cc.ScaleTo.create(speed, 2, -2), cc.ScaleTo.create(speed, 2, 2), cc.ScaleTo.create(speed, -2, 2)];
     tWin.scale = scale;
     tWin.action = action;
     tWin.setScale(.5);
     tWin.runAction(cc.ScaleTo.create(0.5, 2, 2));
     tWin.actionIndex = 0;
     cc.Director.sharedDirector().getScheduler().scheduleUpdateForTarget(this, 0, false);
     */
};
var button = function (evt) {
    var sprite = evt.target;

    var bIsMouseDown = (evt.type == Graphic.MouseEvent.MOUSE_DOWN);
    sprite.getChildAt(1).setVisible(bIsMouseDown);
    sprite.getChildAt(0).setVisible(!bIsMouseDown);
};
var move = function (evt) {
    var sprite = evt.target;

    var bIsMouseDown = (evt.type == Graphic.MouseEvent.MOUSE_OVER);
    sprite.setOpacity(bIsMouseDown ? 192 : 255);
};
var moveLU = function (evt) {
    var tWin = evt.target;
    var size = cc.Director.sharedDirector().getWinSize();
    tWin.runAction(tWin.action[tWin.actionIndex]);
    tWin.runAction(tWin.scale[tWin.actionIndex]);
    tWin.actionIndex = (tWin.actionIndex + 1) % tWin.action.length;
};
Main.prototype.update = function () {
//   this.win.x--;//position();

};
Main.scene = function () {
    // 'scene' is an autorelease object
    var scene = cc.Scene.create();
    // 'layer' is an autorelease object
    var layer = this.node();
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
