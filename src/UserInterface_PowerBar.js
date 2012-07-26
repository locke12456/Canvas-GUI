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
        this._bar = new Graphic.Sprite();
        var barIMG = this._progressLine = new Graphic.Sprite(bar);
        barIMG.setAnchorPoint(cc.ccp(0, 0.5));
        barIMG.setScaleX(0);
        this._bar.addChild(barIMG);
        this._bar.initMask();
        this._bar._mask.setCompositeType(Graphic.Mask.Type.Destination_Out);
        this._bar._mask.addChild(new Graphic.Sprite(mask));
        this._bar._mask.getChildAt(0).setAnchorPoint(cc.ccp(0, 0.5));
        this.addChild(this._bar);
        this._cover = new Graphic.Sprite(cover);
        this._cover.setAnchorPoint(cc.ccp(0, 0.5));
        this.addChild(this._cover);
        this.play();
    },
    play:function () {
        //this.setVisible(true);
        var action = cc.Sequence.create(
            cc.DelayTime.create(1),
            cc.CallFunc.create(this, this._repeat),
            null);
        this._progressLine.runAction(action);
        Graphic.Animation.Queue.add(cc.ScaleTo.create(2, this._progressLine.getScaleX() == 0 ? 1 : 0, 1), Graphic.Animation.Dispatcher(this._progressLine, null, PowerBar.PROGRESS_REPEAT));
    },
    stop:function () {

    },
    _repeat:function (e) {

    }
});
PowerBar.PROGRESS_REPEAT = function (e) {
    Graphic.Animation.Queue.add(cc.ScaleTo.create(2, e.target.getScaleX() == 0 ? 1 : 0, 1), Graphic.Animation.Dispatcher(e.target, null, PowerBar.PROGRESS_REPEAT));
};