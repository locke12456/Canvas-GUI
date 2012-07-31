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

        var texture = Graphic.Utils.GradientTexture(cc.SizeMake(12, this._cover.height - 4), cc.ccc4(0, 255, 0, 255));
        this._barLine = new Graphic.Sprite();
        this._barLine.initWithTexture(texture);
        this._barLine.x = this._cover.width / 2;
        this.addChild(this._barLine);
        this.addChild(this._cover);
        this.setVisible(false);
        // this.play();
    },
    play:function () {
        this.setVisible(true);
        this.setOpacity(255);
        var action = cc.Sequence.create(
            cc.DelayTime.create(1),
            cc.CallFunc.create(this, this._repeat),
            null);
        this._progressLine.runAction(action);
        this._progressLine.setScaleX(0);
        Graphic.Animation.Queue.add(cc.ScaleTo.create(2, 1, 1), Graphic.Animation.Dispatcher(this._progressLine, null, PowerBar.PROGRESS_REPEAT));
    },
    stop:function () {
        Graphic.Animation.Queue.remove(this._progressLine);
        Graphic.Animation.Queue.add(cc.FadeOut.create(1), Graphic.Animation.Dispatcher(this, null, PowerBar.FadeComplete));
    },
    isHitLine:function () {
        console.log(this._progressLine.getScaleX() > 0.45 && this._progressLine.getScaleX() < 0.55 ? "in range" : "out of range");
        return this._progressLine.getScaleX() > 0.45 && this._progressLine.getScaleX() < 0.55;
    }
});
PowerBar.PROGRESS_REPEAT = function (e) {
    Graphic.Animation.Queue.add(cc.ScaleTo.create(2, e.target.getScaleX() == 0 ? 1 : 0, 1), Graphic.Animation.Dispatcher(e.target, null, PowerBar.PROGRESS_REPEAT));
};
PowerBar.FadeComplete = function (e) {
    e.target.setVisible(false);
};