/**
 * Created with JetBrains WebStorm.
 * User: Locke
 * Date: 2012/8/3
 * Time: 上午 9:36
 * To change this template use File | Settings | File Templates.
 */
var CSSTextType = cc.Class.extend({
    text:null,
    size:null,
    color:null,
    position:null,
    ctor:function (value, size, color, position) {
        this.text = value;
        this.size = size;
        this.color = color;
        this.position = position;
    }
});
var CSSTextDraw = Graphic.Sprite.extend({
    textTable:{},
    font:null,
    position:null,
    ctor:function (value, font, size) {
        this._super();
        this.initText();
        this.font = cc.LabelTTF.create(value, font, size);
        this.font.setVerticalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this.addChild(this.font);
        this.setVisible(false);
    },
    initText:function () {
        this.addToTextTable("Miss", 64, cc.ccc3(0xff, 0, 0));
        this.addToTextTable("Good", 64, cc.ccc3(0x66, 0, 0xcc));
        this.addToTextTable("Great", 64, cc.ccc3(0, 0x66, 0xff));
        this.addToTextTable("Excellent", 64, cc.ccc3(0xF1, 0xDF, 0x41));
    },
    setPosition:function (pos) {
        this._super(pos);
        this.position = pos;
    },
    addToTextTable:function (value, size, color) {
        this.textTable[value] = (new CSSTextType(value, size, color));
    },
    showTextByName:function (name) {
        this.setVisible(true);
        var text = this.textTable[name];
        if (this.font.getString() != text.text) {
            this.font.setString(text.text);
            this.font.setColor(text.color);
            this.font.setFontSize(text.size);
        }
        Graphic.Animation.Queue.add(cc.MoveTo.create(1, cc.ccp(0, 56)), Graphic.Animation.Dispatcher(this.font, CSSTextDraw.onUpdate, CSSTextDraw.onUpdateComplete));
    },
    stop:function () {
        Graphic.Animation.Queue.remove(this.font);
    }

});
CSSTextDraw.onUpdate = function (e) {
    e.target.setOpacity(255 - (192 * e.target.elapsed));
};
CSSTextDraw.onUpdateComplete = function (e) {
    e.target._parent.setVisible(false);
    e.target.setOpacity(255);
    e.target.setPosition(cc.ccp(0, 0));
};
var TextAnimationType = cc.Class.extend({
    text:null,
    MAX:null,
    MIN:null,
    Color:null,
    ctor:function (value, min, max, color) {
        this.text = value;
        this.MIN = min;
        this.MAX = max;
        this.color = color;
    }
});
var TextAnimation = Graphic.CustomSizeTTF.extend({
    animationTable:[],
    animationIndex:0,
    setTextAnimation:function (text, transform) {
        var index = this.getTextIndex(text);
        this.animationTable[index] = transform;
    },
    play:function (index) {
        this.animationIndex = index ? index : this.animationIndex + 1;

        Graphic.Animation.Queue.add(new Graphic.Utils.Timer(1), Graphic.Animation.Dispatcher(this, TextAnimation.onUpdate, TextAnimation.onUpdateComplete));
    },
    _updateOffset:function () {
        var index = 0;
        var shift = 0;
        var y = 0;
        do {
            var text = this._textTable[index++];
            shift += text._contentSize.width;
        } while (index < this._textTable.length);
        this._offsetX = -shift / 2;
    }
});
TextAnimation.onUpdate = function (e) {
    var transform = e.target.animationTable[e.target.animationIndex];
    e.target.setFontSize(transform.MIN + (parseInt((transform.MAX - transform.MIN) * (1 - e.target.elapsed))), e.target.getStringByIndex(transform.text));
};
TextAnimation.onUpdateComplete = function (e) {
    //e.target._parent.setVisible(false);
    if (e.target.animationIndex + 1 < e.target.animationTable.length)
        e.target.play();
    else e.target.animationIndex = 0;
};

