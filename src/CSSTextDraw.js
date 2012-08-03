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
    ctor:function (value, size, color) {
        this.text = value;
        this.size = size;
        this.color = color;
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
        this.addToTextTable("Miss", 64, cc.ccc3(255, 0, 0));
        this.addToTextTable("Good", 64, cc.ccc3(0x66, 0, 0xcc));
        this.addToTextTable("Great", 64, cc.ccc3(0, 0x66, 0xff));
        this.addToTextTable("Exelent", 64, cc.ccc3(0xF1, 0xDF, 0x41));
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
