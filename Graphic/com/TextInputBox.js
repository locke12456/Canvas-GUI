/**
 * Created with JetBrains WebStorm.
 * User: Locke
 * Date: 2012/6/14
 * Time: 下午 4:48
 * To change this template use File | Settings | File Templates.
 */
var Graphic = Graphic = Graphic || {};
Graphic.Component = Graphic.Component || {};

Graphic.Component.TextField = cc.TextFieldTTF.extend({
    ctor:function () {
        this._super();
    },
    insertText:function (text, len) {
        if (len == -1) {
            this._super(text, len);
        } else {
            if (IO.KeyCodeToString != "") {
                this._super(IO.KeyCodeToString, len);
                cc.Log(IO.KeyCodeToString);
            } else this._super(text, len);
        }
    }
});
Graphic.Component.TextField.create = function (placeholder, dimensions, alignment, fontName, fontSize) {
    switch (arguments.length) {
        case 5:
            var ret = new Graphic.Component.TextField();
            if (ret && ret.initWithPlaceHolder("", dimensions, alignment, fontName, fontSize)) {
                if (placeholder) {
                    ret.setPlaceHolder(placeholder);
                }
                return ret;
            }
            return null;
            break;
        case 3:
            var ret = new Graphic.Component.TextField();
            fontName = arguments[1];
            fontSize = arguments[2];
            if (ret && ret.initWithString("", fontName, fontSize)) {
                if (placeholder) {
                    ret.setPlaceHolder(placeholder);
                }
                return ret;
            }
            return null;
            break;
        default:
            throw "Argument must be non-nil ";
            break;
    }
};
Graphic.Component.TextInputBox = Graphic.Sprite.extend({
    _pTrackNode:null,
    _m_tFocusIn:false,
    _nCharLimit:0,
    _pTextFieldAction:null,
    _m_tAnimationBegin:false,
    ctor:function () {
        this.init();
        this._nCharLimit = 10;
        this._pTextFieldAction = cc.RepeatForever.create(
            cc.Sequence.create(
                cc.FadeOut.create(0.25),
                cc.FadeIn.create(0.25)));
        //this.setAnchorPoint(cc.ccp(0.5, 0.5));
        var background = cc.LayerColor.create(cc.ccc4(255, 255, 255, 255), 128, 24);
        this.addChild(background);
        background.setPosition(cc.ccp(-64, 0));
        var textField = Graphic.Component.TextField.create("<click>", new cc.Size(128, 20), cc.TextAlignmentLeft, "Arial", 20);
        textField.setPosition(cc.ccp(0, 12));
        textField.setColor(cc.ccc4(0, 0, 0, 255));
        this.addChild(textField, 1);
        this._pTrackNode = textField;
        this._pTrackNode.action = [cc.FadeTo.create(0.5, 255), cc.FadeTo.create(0.5, 128)];
        this._pTrackNode.actionIndex = 0;
        this._pTrackNode.setDelegate(this);
        this.addEventListener(Graphic.MouseEvent.MOUSE_DOWN, this.onClickTrackNode);
    },
    init:function () {
        this._super();
    },
    onClickTrack:function (evt) {
        if (evt.target._m_tAnimationBegin) {
            var textField = evt.target._pTrackNode;
            Graphic.Animation.Queue.add(textField[textField.actionIndex], Graphic.Dispatcher(Graphic.Event.COMPLETE, evt.target, evt.target.onClickTrack));
            textField.actionIndex = (textField.actionIndex + 1) % textField.action.length;
        }
    },
    onClickTrackNode:function (evt) {
        var clicked = evt.target._m_tInRange;
        var textField = evt.target._pTrackNode;
        if (clicked) {
            // TextFieldTTFTest be clicked
            if (evt.target._m_tAnimationBegin)return;
            cc.Log("TextFieldTTFDefaultTest:CCTextFieldTTF attachWithIME");
            textField.attachWithIME();
            evt.target._m_tAnimationBegin = true;
            //evt.target.onClickTrack(evt);
        }
        else {
            // TextFieldTTFTest not be clicked
            cc.Log("TextFieldTTFDefaultTest:CCTextFieldTTF detachWithIME");
            textField.detachWithIME();
            evt.target._m_tAnimationBegin = false;
        }
    },
    ccTouchesBegan:function (pTouches, pEvent) {
        if (!this.bIsMouseDown) {
            this.dispatchEvent(Graphic.MouseEvent.MOUSE_DOWN);
        }
        this.bIsMouseDown = true;
    },
    ccTouchesEnded:function (pTouches, pEvent) {
        if (this.bIsMouseDown) {
            this.dispatchEvent(Graphic.MouseEvent.MOUSE_DOWN);
        }
        this.bIsMouseDown = false;
    },
    onTextFieldAttachWithIME:function (sender) {
        if (!this._m_tAnimationBegin) {
            this._pTrackNode.runAction(this._pTextFieldAction);
            this._m_tAnimationBegin = true;
        }
        return false;
    },
    onTextFieldDetachWithIME:function (sender) {
        if (this._m_tAnimationBegin) {
            this._pTrackNode.stopAction(this._pTextFieldAction);
            this._pTrackNode.setOpacity(255);
            this._m_tAnimationBegin = false;
        }
        return false;
    },
    onTextFieldInsertText:function (sender, text, len) {
        // if insert enter, treat as default to detach with ime
        if ('\n' == text) {
            return false;
        }

        // if the textfield's char count more than m_nCharLimit, doesn't insert text anymore.
        if (sender.getCharCount() >= this._nCharLimit) {
            return true;
        }
        //this._super(sender, text, len);
    },
    onTextFieldDeleteBackward:function (sender, delText, len) {

    },
    onDraw:function (sender) {
        return false;
    }
});
Graphic.TEXT_DEFAULT_SIZE = cc.Size(128, 20);
Graphic.TEXT_DEFAULT_LAYER_SIZE = cc.Size(128, 24);