/**
 * Created with JetBrains WebStorm.
 * User: Locke
 * Date: 2012/6/27
 * Time: 下午 5:03
 * To change this template use File | Settings | File Templates.
 */
var Graphic = Graphic = Graphic || {};
Graphic.Component = Graphic.Component || {};
Graphic.Component.ScrollBar = Graphic.Sprite.extend({
    _upArrow:null,
    _downArrow:null,
    _track:null,
    _thumb:null,
    _thumb_maxSize:null,
    _thumb_minSize:null,
    _thumb_currentSize:null,
    _thumb_top:null,
    _thumb_bottom:null,
    _scroll:0,
    _mainSize:null,
    _running:false,
    _lastPercent:0,
    _used:false,
    _drag_pos:null,
    ctor:function (width, height) {
        this._super();
        this._mainSize = cc.SizeMake(width, height);
        var texture = Graphic.Utils.GradientTexture(cc.SizeMake(width - 2, height), cc.ccc4(192, 192, 192, 192));

        this._drag_pos = cc.PointZero();
        this._track = new Graphic.Sprite();
        this._track.initWithTexture(texture);
        this.addChild(this._track);

        var up = "▲", down = "▼";
        this._upArrow = new Graphic.Component.SimpleButton(width, width, Graphic.Component.SimpleButton.Default);
        this._upArrow.setPosition(cc.ccp(-1, height - 1));
        this._upArrow.setText(up);
        this._upArrow.addEventListener(Graphic.ButtonEvent.BUTTON_DOWN, Graphic.Component.ScrollBar.MOVE_UP);
        this._upArrow.addEventListener(Graphic.MouseEvent.MOUSE_UP, Graphic.Component.ScrollBar.REMOVE);
        this._upArrow.addEventListener(Graphic.MouseEvent.MOUSE_OUT, Graphic.Component.ScrollBar.REMOVE);

        this._downArrow = new Graphic.Component.SimpleButton(width, width, Graphic.Component.SimpleButton.Default);
        this._downArrow.setPosition(cc.ccp(-1, -(width) + 1));
        this._downArrow.setText(down);
        this._downArrow.addEventListener(Graphic.ButtonEvent.BUTTON_DOWN, Graphic.Component.ScrollBar.MOVE_DOWN);
        this._downArrow.addEventListener(Graphic.MouseEvent.MOUSE_OUT, Graphic.Component.ScrollBar.REMOVE);
        this._downArrow.addEventListener(Graphic.MouseEvent.MOUSE_UP, Graphic.Component.ScrollBar.REMOVE);

        this._thumb_currentSize = height / 10;
        this._thumb_minSize = height / 10;
        this._thumb_maxSize = height;
        this._thumb_top = 0;
        this._thumb_bottom = height - this._thumb_currentSize + 2;
        this._thumb = new Graphic.Component.SimpleButton(width, this._thumb_currentSize, Graphic.Component.SimpleButton.Default);
        this._thumb.setPosition(cc.ccp(-1, this._thumb_bottom));

        this._thumb.addEventListener(Graphic.ButtonEvent.BUTTON_DOWN, Graphic.Component.ScrollBar.DRAG);
        this._thumb.addEventListener(Graphic.MouseEvent.MOUSE_OUT, Graphic.Component.ScrollBar.DROP);
        this._thumb.addEventListener(Graphic.ButtonEvent.BUTTON_UP, Graphic.Component.ScrollBar.DROP);

        //this._track.addEventListener(Graphic.MouseEvent.MOUSE_DOWN,Graphic.Component.ScrollBar.TRACK);
        this._track.addChild(this._upArrow);
        this._track.addChild(this._thumb);
        this._track.addChild(this._downArrow);
    },
    setThumbSize:function (percent) {
        this._thumb_currentSize = this._thumb_minSize + (((this._thumb_maxSize - this._thumb_minSize) / 100) * percent);
        this._thumb_bottom = this._thumb_maxSize - this._thumb_currentSize + 2;
        this._thumb.initSize(this._mainSize.width, this._thumb_currentSize);
        this._thumb.setPosition(cc.ccp(-1, this._thumb_bottom));
    },
    setScroll_Up:function (deviation) {
        var move = this._thumb.y + deviation;
        if (move < this._thumb_bottom)
            this._thumb.y = move;
        else if (this._thumb.y != this._thumb_bottom)
            this._thumb.y = this._thumb_bottom;
        else return;
        var dev = this.getScrollProgress() - this._lastPercent;
        if (Math.abs(dev) >= 1) {
            this._lastPercent = this.getScrollProgress();
            this.dispatchEvent(Graphic.ScrollEvent.SCROLL);
            this.dispatchEvent(Graphic.ScrollEvent.SCROLL_UP);

        }
    },
    setScroll_Down:function (deviation) {
        var move = this._thumb.y - deviation;
        if (move > this._thumb_top)
            this._thumb.y = move;
        else if (this._thumb.y != this._thumb_top)
            this._thumb.y = this._thumb_top;
        else return;
        var dev = this.getScrollProgress() - this._lastPercent;
        if (Math.abs(dev) >= 1) {
            this._lastPercent = this.getScrollProgress();
            this.dispatchEvent(Graphic.ScrollEvent.SCROLL);
            this.dispatchEvent(Graphic.ScrollEvent.SCROLL_DOWN);
        }
    },
    getScrollProgress:function () {
        var percent = Math.floor((this._thumb_bottom - this._thumb.y) / this._thumb_bottom * 100);
        return percent > 100 ? 100 : percent;
    },
    update:function () {
        switch (this._scroll) {
            case 1:
                this.setScroll_Up(1);
                break;
            case 2:
                this.setScroll_Down(1);
                break;
        }
    }
});
Graphic.Component.ScrollBar.DRAG = function (evt) {
    var scroll_bar = evt.target.parent.parent;
    if (!scroll_bar._used) {
        scroll_bar._used = true;
        scroll_bar._drag_pos = evt.target._m_tBeginPos;
        return;
    }
    if (scroll_bar._drag_pos.y < evt.target._m_tBeginPos.y) {
        scroll_bar.setScroll_Up(Math.abs(scroll_bar._drag_pos.y - evt.target._m_tBeginPos.y));
    } else if (scroll_bar._drag_pos.y > evt.target._m_tBeginPos.y) {
        scroll_bar.setScroll_Down(Math.abs(scroll_bar._drag_pos.y - evt.target._m_tBeginPos.y));
    }
    scroll_bar._drag_pos = evt.target._m_tBeginPos;
};
Graphic.Component.ScrollBar.DROP = function (evt) {
    var scroll_bar = evt.target.parent.parent;
    scroll_bar._used = false;
};
Graphic.Component.ScrollBar.MOVE_UP = function (evt) {
    var scroll_bar = evt.target.parent.parent;
    if (!scroll_bar._running) {
        scroll_bar._running = true;
        cc.Director.sharedDirector().getScheduler().scheduleUpdateForTarget(scroll_bar, 1, false);
    }
    scroll_bar._scroll = 1;
};
Graphic.Component.ScrollBar.MOVE_DOWN = function (evt) {
    var scroll_bar = evt.target.parent.parent;
    if (!scroll_bar._running) {
        scroll_bar._running = true;
        cc.Director.sharedDirector().getScheduler().scheduleUpdateForTarget(scroll_bar, 1, false);
    }
    scroll_bar._scroll = 2;
};
Graphic.Component.ScrollBar.REMOVE = function (evt) {
    var scroll_bar = evt.target.parent.parent;
    if (scroll_bar._running) {
        scroll_bar._running = false;
        cc.Director.sharedDirector().getScheduler().unscheduleUpdateForTarget(scroll_bar);
    }
    scroll_bar._used = false;
    scroll_bar._scroll = 0;
};