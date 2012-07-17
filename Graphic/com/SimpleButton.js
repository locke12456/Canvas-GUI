/**
 * Created with JetBrains WebStorm.
 * User: Locke
 * Date: 2012/6/21
 * Time: 上午 11:09
 * To change this template use File | Settings | File Templates.
 */
var Graphic = Graphic = Graphic || {};
Graphic.Component = Graphic.Component || {};
Graphic.Component.SimpleButton = Graphic.Component.Button.extend({
    _currentItem:null,
    ctor:function (width, height, type) {
        this._super();
        this.init();
        if (!width) {
            width = Graphic.Component.SimpleButton.defaultWidth;
        }
        if (!height) {
            height = Graphic.Component.SimpleButton.defaultHeight;
        }
        if (!type) {
            type = Graphic.Component.SimpleButton.Default;
        }
        this._default_texture_size = cc.SizeMake(width, height);
        var texture = Graphic.Utils.GradientTexture(cc.SizeMake(width - 2, height - 2), cc.ccc4(255, 255, 255, 255), Graphic.Utils.Gradient.RectVFrom, type);
        texture = Graphic.Utils.SetTextureBackgroundSize(texture, width, height);
        this.initWithTexture(texture);
        this.initText();
    },
    _setNodeDirtyForCache:function () {
        this._super();
        if (this._bButtonUp)
            this._currentItem = this._bButtonUp.isVisible() ? this._bButtonUp : this._bButtonDown;
    },
    initSize:function (width, height, type) {
        this.removeChild(this._bButtonDown);
        this.removeChild(this._bButtonUp);
        this._bButtonUp = null;
        this._bButtonDown = null;
        this._textField = null;
        if (!type) {
            type = Graphic.Component.SimpleButton.Default;
        }
        this._default_texture_size = cc.SizeMake(width, height);
        var texture = Graphic.Utils.GradientTexture(cc.SizeMake(width - 2, height - 2), cc.ccc4(255, 255, 255, 255), Graphic.Utils.Gradient.RectVFrom, type);
        texture = Graphic.Utils.SetTextureBackgroundSize(texture, width, height);
        this.initWithTexture(texture);
        this.initText();
    },
    initText:function () {
        if (this._textField) return;
        var fontSize = Math.floor(this._default_texture.height - this._default_texture.height / 2);
        this._textField = cc.LabelTTF.create("", this._m_tRect.size, cc.TEXT_ALIGNMENT_CENTER, "Arial", fontSize);
        this._textField.setPosition(cc.ccp(this._default_texture.width / 2, this._m_tRect.size.height / 2));
        this._textField.setAnchorPoint(cc.ccp(0.5, 0.9));
        this._textField.setColor(cc.ccc4(0, 0, 0, 255));
        //this._textField.detachWithIME();
        //this._textField.removeDelegate();
        this._default_texture.addChild(this._textField);
        this._default_texture.setAnchorPoint(cc.ccp(0, 1));
        //this.addChild(this._default_texture);
    },
    setText:function (text) {
        this._textField.setString(text);
        var copy = Graphic.Utils.CreateCanvas(this._default_texture.width, this._default_texture.height);
        this._default_texture.visit(copy);
        var texture = Graphic.Utils.CreateImageData(copy);
        var up = Graphic.Effect.Convolution(cc.renderContext, texture, Graphic.Effect.Bevel, 254);
        var down = Graphic.Effect.Convolution(cc.renderContext, texture, Graphic.Effect.vBevel, 254);
        this._bButtonDown.setTexture(Graphic.Utils.ImageDatasToTexture(down));
        this._bButtonUp.setTexture(Graphic.Utils.ImageDatasToTexture(up));
    }

});
Graphic.Component.SimpleButton.prototype.__defineGetter__("width", function () {
    return this._m_tScaleX * this._default_texture_size.width;
});

Graphic.Component.SimpleButton.prototype.__defineGetter__("height", function () {
    return this._m_tScaleY * this._default_texture_size.height;
});
Graphic.Component.SimpleButton.defaultWidth = 128;
Graphic.Component.SimpleButton.defaultHeight = 32;
Graphic.Component.SimpleButton.Default = [cc.ccc4(200, 200, 200, 255), cc.ccc4(255, 255, 255, 255)];
Graphic.Component.SimpleButton.General = [cc.ccc4(250, 250, 250, 255), cc.ccc4(255, 255, 255, 255)];