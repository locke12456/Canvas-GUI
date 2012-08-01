/**
 * Created with JetBrains WebStorm.
 * User: Locke
 * Date: 2012/8/1
 * Time: 上午 10:22
 * To change this template use File | Settings | File Templates.
 */
var Graphic = Graphic = Graphic || {};
Graphic.Utils = Graphic.Utils || {};
Graphic.Utils.Timer = cc.ActionInterval.extend({
    ctor:function (d) {
        // this._super();
        this.initWithDuration(d);
    },
    update:function (time) {

    }
});