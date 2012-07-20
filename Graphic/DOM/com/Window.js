/**
 * Created with JetBrains WebStorm.
 * User: Locke
 * Date: 2012/7/17
 * Time: 下午 3:52
 * To change this template use File | Settings | File Templates.
 */
var Graphic = Graphic = Graphic || {};
Graphic.DOM = Graphic.DOM || {};
Graphic.DOM.Base = cc.Class.extend({
    _Element:null,
    ctor:function(element){
        if(!element) throw "Error!";
        this._Element = element;
    }
});