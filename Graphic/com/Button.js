/**
 * Created with JetBrains WebStorm.
 * User: Locke
 * Date: 2012/6/18
 * Time: 上午 9:48
 * To change this template use File | Settings | File Templates.
 */
var Graphic = Graphic = Graphic || {};
Graphic.Component = Graphic.Component || {};
Graphic.Component.Button = Graphic.Sprite.extend({
    _bButtonDown:null,
    _bButtonUp:null,
    _moveEffect:null,
    _default_texture:null,
    _default_texture_size:null,
    _textField:null,

    ctor:function (pButtonUp, pButtonDown) {
        this.init();

        switch (arguments.length) {
            case 2:
            case 1:
                var texture;
                if (typeof pButtonUp == "string") {
                    this.initWithTexture(pButtonUp, pButtonDown);

                } else if (typeof pButtonUp == "object") {
                    texture = Graphic.Utils.TextureToImageData(pButtonUp.getTexture());
                    texture = Graphic.Effect.Convolution(cc.renderContext, texture, Graphic.Effect.vBevel, 254);
                    pButtonDown = this._initConver(texture, pButtonUp.getContentSize());
                    delete texture;
                    this.initChild(pButtonUp, pButtonDown);
                } else if (typeof pButtonUp == "object" && typeof pButtonDown == "object") {
                    this.initChild(pButtonUp, pButtonDown);
                }
                this.setScale(1);
                break;
        }

    },
    init:function () {
        this._super();
    },

    initWithTexture:function (texture, color) {
        if (typeof texture == "string") {
            var mTexture = this._default_texture = new Graphic.Sprite(texture);
        } else {
            var mTexture = this._default_texture = new Graphic.Sprite();
            mTexture.initWithTexture(texture);
        }
        var rect = cc.RectMake(0, 0, mTexture.getContentSize().width, mTexture.getContentSize().height);
        if (color) {
            mTexture.setColor(color);
        }
        texture = Graphic.Utils.TextureToImageData(mTexture.getTexture());
        var up = Graphic.Effect.Convolution(cc.renderContext, texture, Graphic.Effect.Bevel, 254);
        var down = Graphic.Effect.Convolution(cc.renderContext, texture, Graphic.Effect.vBevel, 254);
        var pButtonDown = this._initConver(down, rect);
        var pButtonUp = this._initConver(up, rect);
        this.setAnchorPoint(cc.ccp(0.5, 0.5));
        this._bButtonDown = pButtonDown;
        this._bButtonUp = pButtonUp;
        this.initChild(pButtonUp, pButtonDown);
        this.setScale(1);
        delete texture;
    },
    initChild:function (pButtonUp, pButtonDown) {
        this.addChild(pButtonUp);
        this.addChild(pButtonDown);
        pButtonDown.setVisible(this.bIsMouseDown);
        pButtonUp.setVisible(!this.bIsMouseDown);
        this.addEventListener(Graphic.MouseEvent.MOUSE_MOVE, function (evt) {
        });
    },
    _initConver:function (texture, rect) {
        var pButton = new Graphic.Sprite();
        pButton.initWithTexture(Graphic.Utils.ImageDatasToTexture(texture), rect);
        pButton.setAnchorPoint(cc.ccp(0, 0));
        return pButton;
    },

    setColor:function (color) {
        this._bButtonUp.setColor(color);
        this._bButtonDown.setColor(color);
    },
    ccTouchesBegan:function (pTouches, pEvent) {
        this._super(pTouches, pEvent);
        var InRange = this._m_tInRange;
        if (InRange) {
            var bIsMouseDown = this.bIsMouseDown;
            this._bButtonDown.setVisible(bIsMouseDown);
            this._bButtonUp.setVisible(!bIsMouseDown);
            this.dispatchEvent(Graphic.ButtonEvent.BUTTON_DOWN);
        }
    },
    ccTouchesMoved:function (pTouches, pEvent) {
        this._super(pTouches, pEvent);
        var InRange = this._m_tInRange;
        if (!InRange) {
            var bIsMouseDown = this.bIsMouseDown = false;
            if (this._bButtonDown.isVisible() != bIsMouseDown) {
                this._bButtonDown.setVisible(bIsMouseDown);
                this._bButtonUp.setVisible(!bIsMouseDown);
            }
        } else {
            if (this.bIsMouseDown)
                this.dispatchEvent(Graphic.ButtonEvent.BUTTON_DOWN);
        }
    },
    ccTouchesEnded:function (pTouches, pEvent) {
        this._super(pTouches, pEvent);
        var InRange = this._m_tInRange;
        if (InRange) {
            var bIsMouseDown = this.bIsMouseDown;
            this._bButtonDown.setVisible(bIsMouseDown);
            this._bButtonUp.setVisible(!bIsMouseDown);
            this.dispatchEvent(Graphic.ButtonEvent.BUTTON_UP);
            this.dispatchEvent(Graphic.ButtonEvent.BUTTON_CLICK);
        }
    },
    dispatchEvent:function (evt) {
        this._super(evt);
        if (evt.triggerType == Graphic.MouseEvent.TriggerType.MOVE && this._moveEffect)this._moveEffect.dispatch(evt, this);
    }
});
Graphic.Component.Button.prototype.setMoveEffect = function (type) {
    this._moveEffect = type;
    this._moveEffect.init(this);
};
Graphic.Component.Button.MoveEffect = {};
Graphic.Component.Button.MoveEffect.Alpha =
{
    init:function (target) {
        target.setOpacity(255);
    },
    dispatch:function (evt, target) {
        if (evt == Graphic.MouseEvent.MOUSE_OVER) {
            target.setOpacity(128);
        } else if (evt == Graphic.MouseEvent.MOUSE_OUT) {
            target.setOpacity(255);
        }
    }
};

Graphic.Component.Button.MoveEffect.AlphaInverse =
{
    init:function (target) {
        target.setOpacity(128);
    },
    dispatch:function (evt, target) {
        if (evt == Graphic.MouseEvent.MOUSE_OVER) {
            target.setOpacity(255);
        } else if (evt == Graphic.MouseEvent.MOUSE_OUT) {
            target.setOpacity(128);
        }
    }
};