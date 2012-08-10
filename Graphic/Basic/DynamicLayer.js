/**
 * Created with JetBrains WebStorm.
 * User: Locke
 * Date: 2012/8/10
 * Time: 上午 10:47
 * To change this template use File | Settings | File Templates.
 */
var Graphic = Graphic = Graphic || {};
Graphic.DynamicLayer = cc.LazyLayer.extend({
    ctor:function (size, id) {
        if (!size) {
            size = cc.SizeMake(cc.canvas.width, cc.canvas.height);
        }
        if (!id) {
            id = "lazyCanvas" + Date.now();
        }
        this._super();
        this.setAnchorPoint(new cc.Point(0, 0));
        //setup html
        this._setupHtml(size, id);
    },
    _setupHtml:function (size, id) {
        if (!size)return;
        var gameContainer = document.getElementById("Cocos2dGameContainer");
        if (!gameContainer) {
            cc.setupHTML();
            gameContainer = document.getElementById("Cocos2dGameContainer");
        }

        this._layerCanvas = document.createElement("canvas");
        this._layerCanvas.width = size.width;
        this._layerCanvas.height = size.height;
        this._layerCanvas.id = id;
        this._layerCanvas.style.zIndex = this._canvasZOrder;
        this._layerCanvas.style.position = "absolute";
        this._layerCanvas.style.top = "0";
        this._layerCanvas.style.left = "0";
        this._layerContext = this._layerCanvas.getContext("2d");
        this._layerContext.fillStyle = "rgba(0,0,0,1)";
        this._layerContext.translate(0, this._layerCanvas.height);
        gameContainer.appendChild(this._layerCanvas);
        var selfPointer = this;
        window.addEventListener("resize", function (event) {
            selfPointer.adjustSizeForCanvas();
        });
    },
    setPosition:function (point) {
        this._layerCanvas.style.left = (point.x).toString() + "px";
        this._layerCanvas.style.top = point.y.toString() + "px";
    },
    setSize:function (size) {
        this._layerCanvas.width = size.width;
        this._layerCanvas.height = size.height;
    }
});
