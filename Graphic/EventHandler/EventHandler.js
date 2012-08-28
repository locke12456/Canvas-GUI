/**
 * Created with JetBrains WebStorm.
 * User: Locke
 * Date: 2012/8/27
 * Time: 下午 2:23
 * To change this template use File | Settings | File Templates.
 */
var Graphic = Graphic || {};
Graphic.EventHandler = cc.Class.extend({
    _evt:{},
    ctor:function () {

    },
    updtae:function () {
        if (this._evt) {
            for (var type in this._evt) {
                if (this._evt[type] && this._evt[type].length > 0) {
                    for (var i = 0; i < this._evt[type].length; i++) {
                        if (this._evt[type][i] && this._evt[type][i].isActive) {
                            this.dispatchEvent(type);
                        }
                    }
                }
            }
        }
    },
    addEventListener:function (type, callback) {
        type.triggerType
    },
    removeEventListener:function (type, callback) {

    },
    dispatchEvent:function (type) {

    }
});