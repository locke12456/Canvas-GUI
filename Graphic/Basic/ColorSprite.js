/**
 * Created with JetBrains WebStorm.
 * User: Locke
 * Date: 2012/6/19
 * Time: 上午 10:57
 * To change this template use File | Settings | File Templates.
 */
var Graphic = Graphic = Graphic || {};

Graphic.ColorSprite = cc.Sprite.extend({
    _squareVertices:[],
    _squareColors:[],
    _opacity:0,
    _color:new cc.Color3B(255, 255, 255),
    _blendFunc:new cc.BlendFunc(cc.BLEND_SRC, cc.BLEND_DST),

    /**
     * Constructor
     */
    ctor:function (color) {
        this._squareVertices = [new cc.Vertex2F(0, 0), new cc.Vertex2F(0, 0), new cc.Vertex2F(0, 0), new cc.Vertex2F(0, 0)];
        this._squareColors = [new cc.Color4B(0, 0, 0, 1), new cc.Color4B(0, 0, 0, 1), new cc.Color4B(0, 0, 0, 1), new cc.Color4B(0, 0, 0, 1)];
        this._color = new cc.Color3B(0, 0, 0);
        this._super();
        if (color) {
            this.initWithColor(color);
        }
        this.setAnchorPoint(cc.ccp(0.5, 0.5));
    },

    /**
     * opacity getter
     * @return {Number}
     */
    getOpacity:function () {
        return this._opacity;
    },

    /**
     * opacity setter
     * @param {Number} Var a number between 0 and 255, 0 is totally transparent
     */
    setOpacity:function (Var) {
        this._opacity = Var;
        this._updateColor();

        //this._addDirtyRegionToDirector(this.boundingBoxToWorld());
        this.setNodeDirty();
    },

    /**
     * color getter
     * @return {cc.Color3B}
     */
    getColor:function () {
        return this._color;
    },

    /**
     * color setter
     * @param {cc.Color3B} Var
     */
    setColor:function (Var) {
        this._color = Var;
        this._updateColor();

        //this._addDirtyRegionToDirector(this.boundingBoxToWorld());
        this.setNodeDirty();
    },

    /**
     * blendFunc getter
     * @return {cc.BlendFunc}
     */
    getBlendFunc:function () {
        return this._blendFunc;
    },

    /**
     * blendFunc setter
     * @param {cc.BlendFunc} Var
     */
    setBlendFunc:function (Var) {
        this._blendFunc = Var;
    },

    /**
     * @param color
     * @return {Boolean}
     */
    initWithColor:function (color) {
        this._blendFunc.src = cc.BLEND_SRC;
        this._blendFunc.dst = cc.BLEND_DST;
        this._color = new cc.Color3B(color.r, color.g, color.b);
        this._opacity = color.a;

        for (var i = 0; i < this._squareVertices.length; i++) {
            this._squareVertices[i].x = 0.0;
            this._squareVertices[i].y = 0.0;
        }
        this._updateColor();
        return true;
    },

    /**
     * override contentSize
     * @param {cc.Size} size
     */
    setContentSize:function (size) {
        this._squareVertices[1].x = size.width * cc.CONTENT_SCALE_FACTOR();
        this._squareVertices[2].y = size.height * cc.CONTENT_SCALE_FACTOR();
        this._squareVertices[3].x = size.width * cc.CONTENT_SCALE_FACTOR();
        this._squareVertices[3].y = size.height * cc.CONTENT_SCALE_FACTOR();
        this._super(size);
    },

    /**
     * change width and height in Points
     * @param {Number} w width
     * @param {Number} h height
     */
    changeWidthAndHeight:function (w, h) {
        this.setContentSize(cc.SizeMake(w, h));
    },

    /**
     * change width in Points
     * @param {Number} w width
     */
    changeWidth:function (w) {
        this.setContentSize(cc.SizeMake(w, this._contentSize.height));
    },

    /**
     * change height in Points
     * @param {Number} h height
     */
    changeHeight:function (h) {
        this.setContentSize(cc.SizeMake(this._contentSize.width, h));
    },
    _updateColor:function () {
        for (var i = 0; i < 4; i++) {
            this._squareColors[i].r = Math.round(this._color.r);
            this._squareColors[i].g = Math.round(this._color.g);
            this._squareColors[i].b = Math.round(this._color.b);
            this._squareColors[i].a = Math.round(this._opacity);
        }
    },

    setIsOpacityModifyRGB:function (value) {
    },
    getIsOpacityModifyRGB:function () {
        return false;
    },
    draw:function (ctx) {

    }
});
Graphic.ColorRect = Graphic.ColorSprite.extend({
    lineWidth:5,
    lineColor:cc.ccc4(0, 0, 0, 255),
    ctor:function (color) {
        this._super(color);
    },
    draw:function (ctx) {
        var context = ctx || cc.renderContext;

        if (cc.renderContextType == cc.CANVAS) {
            //context.globalAlpha = this.getOpacity() / 255;
            context.globalAlpha = this._opacity / 255;
            if (this._flipX) {
                context.scale(-1, 1);
            }
            if (this._flipY) {
                context.scale(1, -1);
            }
            var offsetPixels = this._offsetPositionInPixels;
            var pos = new cc.Point(0 | ( -this._anchorPointInPixels.x + offsetPixels.x), 0 | ( -this._anchorPointInPixels.y + offsetPixels.y));

            var tWidth = this.getContentSize().width;
            var tHeight = this.getContentSize().height;
            var tGradient = context.createLinearGradient(-this.getAnchorPointInPixels().x, this.getAnchorPointInPixels().y,
                -this.getAnchorPointInPixels().x + tWidth, -(this.getAnchorPointInPixels().y + tHeight));

            tGradient.addColorStop(0, "rgba(" + this._squareColors[0].r + "," + this._squareColors[0].g + ","
                + this._squareColors[0].b + "," + this._squareColors[0].a / 255 + ")");
            tGradient.addColorStop(1, "rgba(" + this._squareColors[3].r + "," + this._squareColors[3].g + ","
                + this._squareColors[3].b + "," + this._squareColors[3].a / 255 + ")");

            context.fillStyle = tGradient;
            context.fillRect(-this.getAnchorPointInPixels().x, this.getAnchorPointInPixels().y, tWidth, -tHeight);
            var s = this._contentSize;
            var vertices = [cc.ccp(-this._anchorPointInPixels.x + offsetPixels.x, this.getAnchorPointInPixels().y)
                , cc.ccp(-this.getAnchorPointInPixels().x + tWidth, this.getAnchorPointInPixels().y)
                , cc.ccp(-this.getAnchorPointInPixels().x + tWidth, -(this.getAnchorPointInPixels().y ))
                , cc.ccp(-this._anchorPointInPixels.x + offsetPixels.x, -(this.getAnchorPointInPixels().y))];
            Graphic.Utils.DrawPoly(context, vertices, this.lineWidth, this.lineColor, 4, true);

        }
        this._super();
    }
});
