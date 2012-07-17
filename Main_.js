include('Classes/AppDelegate.js');
//19
include('Graphic/Event/Event.js');
include('Graphic/Event/MouseEvent.js');
include('Graphic/Animation/Animation.js');
include('Graphic/Basic/Sprite.js');
//19
var main;
var Main = cc.Layer.extend({
    bIsMouseDown:false,
    _m_tBeginPos:null,
    helloImg:null,
    helloLabel:null,
    circle:null,
    pSprite:null,
    size:null,
    Sprite:null,
    Child:null,
    Center:null,
    pTheta:0,
    ptheta:0,
    cycle:null,
    init:function () {
        //////////////////////////////
        // 1. super init first
        this._super();
        this.initLayer();
        this.setIsTouchEnabled(true);
        //this._position = this.getPosition();
        return true;
    },
    ccTouchesBegan:function (pTouches, pEvent) {
        if (!this.bIsMouseDown) {
            this._m_tBeginPos = cc.ccp(pTouches[0].locationInView(0).x, pTouches[0].locationInView(0).y);
            //this._m_tBeginPos = pTouches[0].locationInView(0).y;
        }
        this.bIsMouseDown = true;
    },
    ccTouchesMoved:function (pTouches, pEvent) {
        if (this.bIsMouseDown) {
            var touchLocation = pTouches[0].locationInView(0).y;
            var nMoveY = touchLocation - this._m_tBeginPos;
            var curPos = cc.ccp(this.getPosition().x, this.getPosition().y);
            var nextPos = cc.ccp(curPos.x, curPos.y + nMoveY);
            var winSize = cc.Director.sharedDirector().getWinSize();

            if (nextPos.y < 0.0) {
                return;
            }
            this._m_tBeginPos = cc.ccp(pTouches[0].locationInView(0).x, pTouches[0].locationInView(0).y);
            s_tCurPos = nextPos;
        }
    },
    ccTouchesEnded:function () {
        this.bIsMouseDown = false;
    },
    closeCallback:function () {
        history.go(-1);
    },
    update:null
});
//Main.bIsMouseDown = null;
Main.prototype.initLayer = function () {
    /////////////////////////////
    // 2. add a menu item with "X" image, which is clicked to quit the program
    //    you may modify it.
    // ask director the window size
    var size = this.size = cc.Director.sharedDirector().getWinSize();

    this._m_tBeginPos = cc.PointZero();

    // add a "close" icon to exit the progress. it's an autorelease object
    var pCloseItem = cc.MenuItemImage.create("Resources/CloseNormal.png", "Resources/CloseSelected.png", this, this.closeCallback);
    pCloseItem.setAnchorPoint(new cc.Point(0.5, 0.5));

    var pMenu = cc.Menu.create(pCloseItem, null);
    pMenu.setPosition(cc.PointZero());
    this.addChild(pMenu, 1);

    pCloseItem.setPosition(new cc.Point(size.width - 30, 30));

    /////////////////////////////
    // 3. add your codes below...
    // add a label shows "Hello World"
    // create and initialize a label
    this.helloLabel = cc.LabelTTF.create("哈囉 World", "Arial", 38);
    // position the label on the center of the screen
    this.helloLabel.setPosition(cc.ccp(size.width / 2, size.height - 40));
    // add the label as a child to this layer
    this.addChild(this.helloLabel, 5);

    var lazyLayer = new cc.LazyLayer();
    this.addChild(lazyLayer);

    // add "HelloWorld" splash screen"
    this.pSprite = cc.Sprite.create("Resources/HelloWorld.png");
    this.pSprite.setAnchorPoint(cc.ccp(0.5, 0.5));
    this.pSprite.setPosition(cc.ccp(size.width / 2, size.height / 2));
    this.Center = new cc.Point(size.width / 2, size.height / 2);
    this.Sprite = new Graphic.Sprite();
    this.Sprite.load("Resources/CloseNormal.png");
    this.Sprite.x = 200;
    this.Sprite.y = 200;
    var Child = this.Child = new Graphic.Sprite();
    Child.load("Resources/CloseSelected.png");
    Child.x = 140;
    Child.y = 140;
    this.Sprite.addChild(Child);
    this.Child.addEventListener(Graphic.MouseEvent.MOUSE_OVER, test_complete);
    //this.Child.addEventListener(Graphic.MouseEvent.MOUSE_OUT, test_out);
    lazyLayer.addChild(this.pSprite, 0);

    lazyLayer = new cc.LazyLayer();
    this.addChild(lazyLayer);
    lazyLayer.addChild(this.Sprite, 4);
    var color = [cc.RED(), cc.GREEN(), cc.BLUE()];
    this.cycle = [];
    this.pTheta = 0;

    for (var i = 1, j = 1, k = 32; i < 115; i++) {

        var pChild = new Graphic.Sprite();
        pChild.load("Resources/CloseSelected.png");
        var point = Main.Recyle(this.pTheta);
        pChild.x = 20 + point.x * (j * 32);//(i + 10) / 10 * 32;
        pChild.y = 20 + point.y * (j * 32);
        this.pTheta = (this.pTheta + k);
        if (k > 0) {
            k = this.pTheta > 360 ? k - 6 : k;
            j = this.pTheta > 360 ? j + 1 : j;
            if (this.pTheta > 360 || i == 1) {
                Child = new Graphic.Sprite();
                Child.load("Resources/CloseSelected.png");
                Child.x = size.width / 2;// + 20;
                Child.y = size.height / 2;// + 20;
                this.cycle.push(Child);
                lazyLayer.addChild(Child);
            }
        }
        else k = 4;
        this.pTheta %= 360;
        Child.addChild(pChild);
        //j=this.pTheta==0?j+1:j;
        pChild.setTag("pChild_" + i);
        pChild.addEventListener(Graphic.MouseEvent.MOUSE_OVER, test_in);
        pChild.addEventListener(Graphic.MouseEvent.MOUSE_OUT, test_out);

    }
    this.cycle[this.cycle.length - 2].setRotation(90);

    //this.addChild(Child);
    //Child.setRotation(90);
    //pChild.setTag("pChild_" + i);
    //pChild.addEventListener(Graphic.MouseEvent.MOUSE_DOWN, test_in);
    //pChild.addEventListener(Graphic.MouseEvent.MOUSE_UP, test_out);
    //a.width = 100;

    cc.Director.sharedDirector().getScheduler().scheduleUpdateForTarget(this, 0, false);

};
var test_out = function (evt) {
    //aptana.log("your log message");
    var now = parseInt(evt.target.getCurrentPosition().x) + "," + parseInt(evt.target.getCurrentPosition().y);
    now += "   " + evt.target.getTag() + ",(" + parseInt(evt.target.mouseX) + "," + parseInt(evt.target.mouseY);
    now += ")   " + parseInt(evt.target._m_tBeginPos.x) + "," + parseInt(evt.target._m_tBeginPos.y);
    //aptana.log(now);
    evt.target.stage.helloLabel.setString(now);
    var num = cc.ActionManager.sharedManager().numberOfRunningActionsInTarget(evt.target);
    if (evt.target.actions == null) {
        evt.target.actions = [];
        var speed = 0.5;
        evt.target.actionIndex = 0;
        var actionTo = cc.ScaleTo.create(speed, 2);
        var actionBy = cc.ScaleBy.create(speed, .5);
        var actionBy2 = cc.ScaleBy.create(0, 2);
        var actionByBack = actionBy.reverse();
        var actionBy2Back = actionBy2.reverse();
        evt.target.actions.push(actionTo);
        evt.target.actions.push(actionBy);
        evt.target.actions.push(actionBy2);
    }
    if (evt.target.actionIndex == 1) {
        // evt.target.runAction(evt.target.actions[evt.target.actionIndex]);
        evt.target.setOpacity(255);
        if (num != 0) {
            cc.ActionManager.sharedManager().removeAction(evt.target.actions[0], evt.target);
            evt.target.setScale(2);
        }
        cc.ActionManager.sharedManager().addAction(evt.target.actions[evt.target.actionIndex], evt.target);
        evt.target.actionIndex = 0;
        //evt.target.runAction(evt.target.actions[2]);
    }
};
var test_in = function (evt) {

    var now = parseInt(evt.target.getCurrentPosition().x) + "," + parseInt(evt.target.getCurrentPosition().y);
    now += "   " + evt.target.getTag() + ",(" + parseInt(evt.target.mouseX) + "," + parseInt(evt.target.mouseY);
    now += ")   " + parseInt(evt.target._m_tBeginPos.x) + "," + parseInt(evt.target._m_tBeginPos.y);
    evt.target.stage.helloLabel.setString(now);
    var num = cc.ActionManager.sharedManager().numberOfRunningActionsInTarget(evt.target);
    if (evt.target.actions == null) {
        evt.target.actions = [];
        var speed = 0.5;
        evt.target.actionIndex = 0;
        var actionTo = cc.ScaleTo.create(speed, 2);
        var actionBy = cc.ScaleBy.create(speed, .5);
        var actionBy2 = cc.ScaleBy.create(0, 2);
        evt.target.actions.push(actionTo);
        evt.target.actions.push(actionBy);
        evt.target.actions.push(actionBy2);

    }
    //Graphic.Animation.Queue.add(evt.target.actions[evt.target.actionIndex], Graphic.Dispatcher(Graphic.Event.COMPLETE, evt.target, test_complete));
    //evt.target.removeEventListener(Graphic.MouseEvent.MOUSE_OVER, test_in);
    //return;
    if (evt.target.actionIndex == 0) {
        evt.target.setOpacity(127);
        if (num != 0) {
            cc.ActionManager.sharedManager().removeAction(evt.target.actions[evt.target.actionIndex], evt.target);
            evt.target.setScale(1);
        }

        cc.ActionManager.sharedManager().addAction(evt.target.actions[evt.target.actionIndex], evt.target);
        evt.target.actionIndex = 1;
    }
};
var test_complete = function (evt) {
    if (evt.target.actions == null) {
        evt.target.actions = [];
        var speed = 0.5;
        evt.target.actionIndex = 0;
        var actionTo = cc.ScaleTo.create(speed, 2);
        var actionBy = cc.ScaleBy.create(speed, .5);
        var actionBy2 = cc.ScaleBy.create(0, 2);
        evt.target.actions.push(actionTo);
        evt.target.actions.push(actionBy);
        evt.target.actions.push(actionBy2);
        // evt.target.removeEventListener(Graphic.MouseEvent.MOUSE_OVER, test_complete);
    }
    if (evt.target.actionIndex == 0)evt.target.removeEventListener(Graphic.MouseEvent.MOUSE_OVER, test_complete);
    var action = evt.target.actions[evt.target.actionIndex % 2];
    evt.target.actionIndex = (evt.target.actionIndex + 1) % 21;
    if (evt.target.actionIndex == 0) {
        evt.target.addEventListener(Graphic.MouseEvent.MOUSE_OVER, test_complete);
    } else
        Graphic.Animation.Queue.add(action, Graphic.Dispatcher(Graphic.Event.COMPLETE, evt.target, test_complete));
};
Main.prototype.update = function () {
    //return;
    var string = ["H", "E", "L", "L", "O", " ", "W", "O", "R", "L", "D", "!"];
    var time = cc.Director.sharedDirector().getTimeScale();
    if (time == 1) {
        //this.helloLabel.setPosition(cc.ccp(this.size.width / 2, this.size.height - (Math.random() * 100)));
        /*
         var now = "";//parseInt(this.Sprite.mouseX) + "," + parseInt(this.Sprite.mouseY);
         now = this.helloLabel.getString();
         var index = parseInt(this.pTheta / 10) % string.length;
         if(index == 0)
         now = "";
         now = index != now.length ? now : now + string[index];
         this.helloLabel.setString(now);
         */
    } else {

    }
    if (this.Sprite != null) {
        var parent = this.Sprite.parent;
        var point = Main.Recyle(-this.pTheta);
        this.pTheta = (this.pTheta + 1) % 360;
        this.Sprite.x = Math.floor(this.Center.x + (point.x * 192));
        //=this.a.x+1;
        this.Sprite.y = Math.floor(this.Center.y + (point.y * 192));
        this.Sprite.setRotation(this.pTheta);
        point = Main.Recyle(this.ptheta);
        this.ptheta = (this.ptheta + 5) % 360;
        //this.Child.setPosition(cc.ccp((20+(point.x*30),20+(point.y*30))));
        this.Child.x = Math.floor(20 + (point.x * (this.Child.width * 0.7)));
        this.Child.y = Math.floor(20 + (point.y * (this.Child.height * 0.7)));
        this.Child.setRotation(this.ptheta);
        this.cycle[this.cycle.length - 2].setRotation(this.ptheta);
        this.cycle[this.cycle.length - 4].setRotation(-this.pTheta);
        //for(var i = 0;i<this.cycle.length;i++)
        //    this.cycle[i].setRotation(i%2==0?0:this.pTheta);
    }

};
Main.Recyle = function (theta) {
    var radians = theta * (Math.PI) / 180;
    var point = new cc.Point();
    point.x = Math.sin(radians);
    point.y = Math.cos(radians);
    return point;
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
