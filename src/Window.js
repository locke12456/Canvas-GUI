/**
 * Created with JetBrains WebStorm.
 * User: Locke
 * Date: 2012/6/13
 * Time: 上午 10:46
 * To change this template use File | Settings | File Templates.
 */
var Graphic = Graphic = Graphic || {};
var SWindow = Graphic.Sprite.extend({
    _m_tForeground:null,
    _m_tBackground:null,
    ctor:function () {
        this.init();
    },
    init:function () {
        this._super();
        this._m_tBackground = new Graphic.Sprite();
        this.addChild(this._m_tBackground);
        this._m_tForeground = new Graphic.Sprite();
        this.addChild(this._m_tForeground);
    },
    addToBackground:function (object, index) {
        this._m_tBackground.addChild(object, index);
    },
    addToForeground:function (object, index) {
        this._m_tForeground.addChild(object, index);
    }
});