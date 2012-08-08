/**
 * Created with JetBrains WebStorm.
 * User: Locke
 * Date: 2012/7/24
 * Time: 下午 2:39
 * To change this template use File | Settings | File Templates.
 */
var Graphic = Graphic = Graphic || {};
var PowerBar = Graphic.Sprite.extend({
    _bar:null,
    _barLine:null,
    _cover:null,
    _progressLine:null,
    _LinePosition:null,
    SPEED:3,
    DEFAULT_SPEED:3,
    shift:0,
    ctor:function (cover, bar, mask) {
        this._super();
        //cover
        this._cover = new Graphic.Sprite(cover);
        this._cover.setAnchorPoint(cc.ccp(0, 0.5));
        //bar
        this._bar = new Graphic.Sprite();
        var barIMG = this._progressLine = new Graphic.Sprite();
        //init bar's texture
        bar = Graphic.Utils.GradientTexture(cc.SizeMake(this._cover.width, this._cover.height), cc.ccc4(255, 0, 0, 255));
        barIMG.initWithTexture(bar);
        barIMG.setAnchorPoint(cc.ccp(0, 0.5));
        barIMG.setScaleX(0);
        this._bar.addChild(barIMG);
        //ini mask
        this._bar.initMask();
        this._bar._mask.setCompositeType(Graphic.Mask.Type.Destination_Out);
        this._bar._mask.addChild(new Graphic.Sprite(mask));
        this._bar._mask.getChildAt(0).setAnchorPoint(cc.ccp(0, 0.5));
        this.addChild(this._bar);

        var texture = Graphic.Utils.GradientTexture(cc.SizeMake(this._cover.width * PowerBar.BAR_WIDTH, this._cover.height - 4), cc.ccc4(0, 255, 0, 255));
        this._LinePosition = 0.8;
        this._barLine = new Graphic.Sprite();
        this._barLine.initWithTexture(texture);
        this._barLine.x = this._cover.width * this._LinePosition;
        this.addChild(this._barLine);
        this.addChild(this._cover);
        this.setVisible(false);
        // this.play();
    },
    play:function (barMove) {
        this.setVisible(true);
        this.setOpacity(255);
        var action = cc.Sequence.create(
            cc.DelayTime.create(1),
            cc.CallFunc.create(this, this._repeat),
            null);
        this._progressLine.runAction(action);
        this._progressLine.setScaleX(0);
        Graphic.Animation.Queue.add(cc.ScaleTo.create(2, 1, 1), Graphic.Animation.Dispatcher(this._progressLine, null, PowerBar.PROGRESS_REPEAT));
        if (barMove >= 0) {
            this.SPEED = this.DEFAULT_SPEED - barMove;
            Graphic.Animation.Queue.add(new Graphic.Utils.Timer(this.SPEED), Graphic.Animation.Dispatcher(this, PowerBar.onBarUpdate, PowerBar.onBarUpdateComplete));
        }
    },
    stop:function () {
        this.shift = this.shift == 1 ? 0 : 1;
        Graphic.Animation.Queue.remove(this);
        Graphic.Animation.Queue.remove(this._progressLine);
        Graphic.Animation.Queue.add(cc.FadeOut.create(0.5), Graphic.Animation.Dispatcher(this, null, PowerBar.FadeComplete));
    },
    isHitLine:function () {
        return this.__inRange(PowerBar.BAR_WIDTH);
    },
    isHitCenter:function () {
        return this.__inRange(PowerBar.BAR_CENTER);
    },
    __inRange:function (shift) {
        var range_left = this._LinePosition - shift;
        var range_right = this._LinePosition + shift;
        /*
         console.log("position:"+this._progressLine.getScaleX());
         console.log("target:"+range_left);
         console.log(this._progressLine.getScaleX() > range_left && this._progressLine.getScaleX() < range_right ? "in range" : "out of range");
         */
        return this._progressLine.getScaleX() > range_left && this._progressLine.getScaleX() < range_right;
    }
});
PowerBar.onBarUpdate = function (e) {
    var shift = e.target.shift == 1 ? (e.target.shift - e.target.elapsed) : e.target.elapsed;
    e.target._LinePosition = (shift) * 0.7 + 0.15;
    e.target._barLine.x = e.target._cover.width * e.target._LinePosition;
};
PowerBar.onBarUpdateComplete = function (e) {
    e.target.shift = e.target.shift == 1 ? 0 : 1;
    Graphic.Animation.Queue.add(new Graphic.Utils.Timer(e.target.SPEED), Graphic.Animation.Dispatcher(e.target, PowerBar.onBarUpdate, PowerBar.onBarUpdateComplete));
};
PowerBar.PROGRESS_REPEAT = function (e) {
    Graphic.Animation.Queue.add(cc.ScaleTo.create(2, e.target.getScaleX() == 0 ? 1 : 0, 1), Graphic.Animation.Dispatcher(e.target, null, PowerBar.PROGRESS_REPEAT));
};
PowerBar.FadeComplete = function (e) {
    e.target.setVisible(false);
};
PowerBar.BAR_WIDTH = 0.05;
PowerBar.BAR_CENTER = 0.025;