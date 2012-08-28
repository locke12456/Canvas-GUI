/**
 * Created with JetBrains WebStorm.
 * User: Locke
 * Date: 2012/8/27
 * Time: 上午 11:18
 * To change this template use File | Settings | File Templates.
 */
var Graphic = Graphic || {};
Graphic.PhpReader = cc.Class.extend({
    ctor:function () {

    },
    begin:function (url, object, listener) {
        var time = (new Date()).getTime();
        console.log(url);
        var split = url.split('?');
        console.log(split);
        var hasGetString = split.length != url.length;
        if (object) {
            if (typeof(object) == 'string') {

            }
            if (typeof(object) == 'object') {
                //$.post(url, object, listener);
            }
        } else {
            //$.get(url, listener);
        }
    }
});