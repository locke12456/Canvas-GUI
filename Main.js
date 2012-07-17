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
    label:null,
    size:null,
    Center:null,
    win:null,
    time:0,
    item:[],
    init:function () {
        //////////////////////////////
        // 1. super init first
        this._super();
//        this.setIsTouchEnabled(true);
        //this._position = this.getPosition();
        return true;
    },
    onEnter:function () {
        this._super();
        this.initLayer();
    },
    update:function () {
        if (this.item.length > 0) {
            if (this.time++ % 30 == 0)
                this.win.addItem(this.item.shift());
        }
        //this.label.setString(this.win.getScrollProgress());
    },
    closeCallback:function () {
        history.go(-1);
    }
});
//Main.bIsMouseDown = null;
Main.prototype.initLayer = function () {
    var size = this.size = cc.Director.sharedDirector().getWinSize();
    var back = cc.LayerColor.create(cc.ccc4(0, 0, 0, 128), size.width, size.height);
    var x = size.width / 4;
    var lazyLayer = new cc.LazyLayer();
    lazyLayer.addChild(back);
    this.addChild(lazyLayer);
    this.label = cc.LabelTTF.create("哈囉 World", "Arial", 38);
    // position the label on the center of the screen
    this.label.setPosition(cc.ccp(size.width / 2, size.height - 40));
    // add the label as a child to this layer
    this.addChild(this.label, 5);
    //var rect =  new Graphic.Sprite();
    //rect.load("Resources/Button00_1.png");
    //Graphic.Utils.FillRect(ctx, cc.RectMake(0, 0, 50, 50), cc.ccc4(255, 255, 255, 255), Graphic.Utils.Gradient.RectVFrom, [cc.ccc4(220, 220, 220, 255),cc.ccc4(225, 225, 225, 255),cc.ccc4(245, 245, 245, 255)]);
    /*
     this.win = new Graphic.ScrollBar(18,192);
     this.win.setPosition(cc.ccp(size.width / 2, size.height / 2));
     this.win.setThumbSize(80);
     var lazyLayer = new cc.LazyLayer();
     this.addChild(lazyLayer);
     lazyLayer.addChild(this.win);*/

    this.win = new Graphic.Component.DataGrid.DataGridView(cc.SizeMake(321, 320), cc.SizeMake(320, 32));
    this.win.setPosition(cc.ccp(size.width / 2, size.height / 2));
    this.win.columns = [
        {label:"ID", width:15},
        {label:"Group", width:20},
        {label:"Information", width:45},
        {label:"Record", width:20}
    ];//,{label:"5",width:20}];

    //this.win.addChild(this.win._mask);

    this.item.push({ID:1, Group:"a", Information:"asd", Record:"一"});
    this.item.push({ID:3, Group:"b", Information:"eewl", Record:"二"});
    this.item.push({ID:5, Group:"ct", Information:"qqq", Record:"三"});
    this.item.push({ID:4, Group:"ABC", Information:"null", Record:"玖"});
    this.item.push({ID:6, Group:"CCC", Information:"null", Record:"陸"});
    this.item.push({ID:2, Group:"BDA", Information:"null", Record:"柒"});
    this.item.push({ID:4, Group:"ABC", Information:"null", Record:"捌"});
    this.item.push({ID:6, Group:"CCC", Information:"null", Record:"拾"});
    this.item.push({ID:2, Group:"BDA", Information:"null", Record:"壹"});
    this.item.push({ID:4, Group:"ABC", Information:"null", Record:"四"});
    this.item.push({ID:6, Group:"CCC", Information:"null", Record:"五"});
    this.item.push({ID:2, Group:"BDA", Information:"null", Record:"六"});
    /**/
    //this.win.sortBy("ID");
    //this.win.sortItem();

    //this.win.setTextureRectInPixels(cc.RectMake(0,0,640,200),false,cc.SizeMake(640,320));
    //this.win._rect=cc.RectMake(0,0,600,280);
    var lazyLayer = new cc.LazyLayer();
    this.addChild(lazyLayer);

    lazyLayer.addChild(this.win);
    /*
     /*
     var texture = Graphic.Utils.GradientTexture( cc.SizeMake(254, 254), cc.ccc4(255, 255, 255, 255), Graphic.Utils.Gradient.RectVFrom, [cc.ccc4(240, 240, 240, 255),cc.ccc4(255, 255, 255, 255)]);
     texture = Graphic.Utils.SetTextureBackgroundSize(texture,256,256);
     texture = Graphic.Utils.TextureToImageData(texture);
     texture = Graphic.Effect.Convolution(cc.renderContext, texture, Graphic.Effect.Bevel, 254);

     this.win = new Graphic.Sprite();
     this.win.initWithTexture(Graphic.Utils.ImageDatasToTexture(texture));
     this.win.setPosition(cc.ccp(size.width / 2, size.height / 2));
     lazyLayer.addChild(this.win);
     var width=function(value){ return Math.floor(value/100*256);};
     var button = new Graphic.SimpleButton(width(30),32);
     button.y=this.win.height-32;
     button.setText("ID");
     this.win.addChild(button);
     var button1 = new Graphic.SimpleButton(width(50),32);
     button1.y=this.win.height-32;

     button1.setText("Information");
     button1.x= button.width-2;
     this.win.addChild(button1);
     var button = new Graphic.SimpleButton(width(20)+4,32);
     button.y=this.win.height-32;
     button.setText("Count");
     button.x= button1.x+button1.width-2;
     this.win.addChild(button);
     /*
     this.win = new Graphic.SimpleButton();
     // this.win.initWithTexture(texture);
     this.win.setPosition(cc.ccp(size.width / 2, size.height / 2));
     this.win.setText("按鈕");
     lazyLayer.addChild(this.win);
     //lazyLayer.addChild(rect);
     /*
     var rect = new Graphic.Sprite();
     rect.load("src/image/rect.png");
     var rect_inside = new Graphic.Sprite();
     rect_inside.load("src/image/rect_inside.png");
     var tWin = this.win = new Graphic.Window();
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
     tWin.runAction(cc.ScaleTo.create(0.5, 4, 1));
     tWin.actionIndex = 0;
     */
    cc.Director.sharedDirector().getScheduler().scheduleUpdateForTarget(this, 0, false);

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
