/**
 * Created with JetBrains WebStorm.
 * User: Locke
 * Date: 2012/7/4
 * Time: 上午 10:26
 * To change this template use File | Settings | File Templates.
 */
var Graphic = Graphic = Graphic || {};

Graphic.Mask = Graphic.Sprite.extend({
    _maskShow:null,
    _compositeType:null,
    ctor:function () {
        this._super();
    },
    IsMaskShow:function () {
        return this._maskShow;
    },
    /*
     * @param    {Graphic.Mask.Type}     type
     * */
    setCompositeType:function (type) {
        this._compositeType = type;
    },
    getCompositeType:function () {
        return this._compositeType ? this._compositeType : Graphic.Mask.Type.Destination_Out;
    },
    show:function () {
        this._maskShow = true;
    },
    hide:function () {
        this._maskShow = false;
    }
});
Graphic.Mask.Type = Graphic.Mask.Type || {};
Graphic.Mask.Type.Source_Over = "source-over";
Graphic.Mask.Type.Source_In = "source-in";
Graphic.Mask.Type.Source_Out = "source-out";
Graphic.Mask.Type.Source_Atop = "source-atop";
Graphic.Mask.Type.Destination_Over = "destination-over";
Graphic.Mask.Type.Destination_In = "destination-in";
Graphic.Mask.Type.Destination_Out = "destination-out";
Graphic.Mask.Type.Destination_Atop = "destination-atop";
Graphic.Mask.Type.Lighter = "lighter";
Graphic.Mask.Type.Darker = "darker";
Graphic.Mask.Type.Xor = "xor";
Graphic.Mask.Type.Copy = "copy";