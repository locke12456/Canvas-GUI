/**
 * Created with JetBrains WebStorm.
 * User: Locke
 * Date: 2012/7/25
 * Time: 上午 9:16
 * To change this template use File | Settings | File Templates.
 */
var Graphic = Graphic = Graphic || {};
Graphic.DomSprite = cc.MenuItemImage.extend({
    ctor:function (normal) {
        this._super();
        if (normal != null)normal = normal.src || normal;
        this.init(normal);
        this.dom.style.cursor = "default";

    },
    addEventListener:function (type, callback) {
        switch (type) {
            default :
                this._image.addEventListener(type, callback);
                break;
        }
    }
});
