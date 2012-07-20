var Graphic = Graphic = Graphic || {};

Graphic.Sprite = cc.Sprite.extend({
    _x:null,
    _y:null,
    _mask:null,
    _maskShow:null,
    _m_tBeginPos:null,
    _m_tInRange:false,
    _m_tOutRangeDispatched:false,
    _m_tInRangeDispatched:false,
    _m_tRect:null,
    _m_tCurrentRect:null,
    _m_tScaleX:null,
    _m_tScaleY:null,
    _m_tParentRotationChanged:true,
    _m_tParentRotation:0,
    _m_pParentRotation:null,
    _m_tParentPosition:null,
    _m_tCurrentPosition:null,
    _m_tTouchStart:false,
    _m_tRangeChecked:false,
    _listening:false,
    _listeningChildren:[],
    _sleeping:false,
    _main:false,
    touchPosition:null,
    Trigger:null,
    ctor:function (pFile) {
        if (pFile != null)
            this.initWithFile(pFile);
        else
            this.init();
    },
    init:function () {
        this._super();
        this._sleeping = this._listening = false;
        this.setAnchorPoint(cc.ccp(0.5, 0.5));
        //this._position = this.getPosition();
        this._m_tBeginPos = this._m_tParentPosition = cc.PointZero();
        this._m_tRect = this._m_tCurrentRect = new cc.Rect(0, 0, this.getTextureRect().size.width, this.getTextureRect().size.height);
        this._m_tScaleX = this._m_tScaleY = 1;

        this.Trigger = {};
    },
    load:function (pFile) {
        if (pFile != null)
            this.initWithFile(pFile);
        else
            this.init();
    },
    addChild:function (pChild, zOrder) {
        this._super(pChild, zOrder);
        if (this.getRotation() != 0) {
            pChild._m_tParentRotationChanged = true;
            pChild._m_tParentRotation = Math.floor(this.getRotation());
        }
        //if (pChild instanceof Graphic.Sprite)
        //    pChild.updateEventListener();
        //pChild.parent = this;
    },
    setPosition:function (cPoint) {
        this._position = cPoint;
        this._super(cc.ccp(cPoint.x, cPoint.y));
    },
    parentSacleChange:function (x, y) {
        if (x) {
            this._m_tScaleX = x;
            for (var i = 0; i < this.numChildren; i++) {
                this.getChildAt(i).parentSacleChange(value);
            }
        }
        if (y) {
            this._m_tScaleY = y;
            for (var i = 0; i < this.numChildren; i++) {
                this.getChildAt(i).parentSacleChange(null, value);
            }
        }
    },
    setScale:function (value) {
        this._super(value);
        this.setScaleX(value);
        this.setScaleY(value);
    },
    setScaleX:function (value) {
        this._super(value);
        this._m_tScaleX = value;
        if (this._m_tRect && this.getTextureRect().size.width != 0)
            this._m_tRect.size.width = Math.floor(this.getTextureRect().size.width * Math.abs(value));
    },
    setScaleY:function (value) {
        this._super(value);
        this._m_tScaleY = value;
        if (this._m_tRect && this.getTextureRect().size.height != 0)
            this._m_tRect.size.height = Math.floor(this.getTextureRect().size.height * Math.abs(value));
    },
    setOpacity:function (value) {
        this._super(value);
        for (var i = 0; i < this.numChildren; i++) this.getChildAt(i).setOpacity(value);
    },
    setRotation:function (value) {
        this._super(value);
        for (var i = 0; i < this.numChildren; i++) {
            this.getChildAt(i)._m_tParentRotationChanged = true;
            this.getChildAt(i)._m_tParentRotation = Math.floor(value);
        }
    },
    setPosition:function (ponit) {
        this._super(ponit);
        this._m_tParentRotationChanged = true;
    },
    setChildrenPositionChanged:function () {
        for (var i = 0; i < this.numChildren; i++)
            this.getChildAt(i)._m_tParentRotationChanged = true;
    },
    _setNodeDirtyForCache:function () {
        this._super();
        if (this._isCacheDirty) {
            this._m_tParentRotationChanged = true;
            if (this.numChildren > 0) {
                this._m_tCurrentRect = this.boundingBoxToWorld();
                this.setChildrenPositionChanged();
                if (this.getTextureRect().size.width == 0)
                    this._m_tRect = this._m_tCurrentRect;
            }
        }
    },
    _removeUpdate:function (listen_array, entry) {
        var element = listen_array.indexOf(entry);
        if (element != -1) {
            listen_array.splice(element, 1);
        }
    },
    _addUpdate:function (listen_array, entry) {
        var element = listen_array.indexOf(entry);
        if (element == -1) {
            listen_array.push(entry);
        }
    },
    ccTouchesBegan:function (pTouches, pEvent) {
        this._m_tBeginPos = pTouches[0].locationInView(0);
        //var touch = cc.ccpSub(this._m_tBeginPos, this.getCurrentPosition());
        var InRange = this.isInRange();
        this._m_tInRange = InRange;
        if (InRange) {
            this.dispatchEvent(Graphic.MouseEvent.MOUSE_DOWN);
        }
        if (!this.bIsMouseDown) {

        }
        this.bIsMouseDown = true;
        //this.visitUpdate("ccTouchesBegan", pTouches);
    },
    ccTouchesMoved:function (pTouches, pEvent) {
        this._m_tBeginPos = pTouches[0].locationInView(0);
        //var touch = cc.ccpSub(this._m_tBeginPos, this.getCurrentPosition());
        var InRange = this.isInRange();
        this._m_tInRange = InRange;
        this.dispatchEvent(Graphic.MouseEvent.MOUSE_MOVE);

        if (this._m_tInRangeDispatched && !InRange) {
            //if (this.hasEventListener(Graphic.MouseEvent.MOUSE_OUT))
            this.dispatchEvent(Graphic.MouseEvent.MOUSE_OUT);
            this._m_tOutRangeDispatched = true;
            this._m_tInRangeDispatched = !this._m_tOutRangeDispatched;
        } else if (InRange) {
            this.dispatchEvent(Graphic.MouseEvent.MOUSE_OVER);
            this._m_tOutRangeDispatched = false;
            this._m_tInRangeDispatched = !this._m_tOutRangeDispatched;
        }
        if (InRange) {
            this.AllWake();

        } else {
            this.AllSleep();
        }
        //this.visitUpdate("ccTouchesMoved", pTouches);
    },
    ccTouchesEnded:function (pTouches, pEvent) {
        this._m_tBeginPos = pTouches[0].locationInView(0);
        //var touch = cc.ccpSub(this._m_tBeginPos, this.getCurrentPosition());
        var InRange = this.isInRange();
        this._m_tInRange = InRange;
        if (this.bIsMouseDown) {
            this.dispatchEvent(Graphic.MouseEvent.MOUSE_UP);
            if (InRange) {
                this.dispatchEvent(Graphic.MouseEvent.MOUSE_CLICK);
            }
        }
        //this.visitUpdate("ccTouchesEnded", pTouches);
        this.bIsMouseDown = false;
    },
    visitUpdate:function (event, touch) {
        for (var i = 0; i < this._listeningChildren.length; i++)
            this._listeningChildren[i][event](touch);
    },
    visit:function (ctx) {
        // quick return if not visible
        if (!this._isVisible) {
            return;
        }
        var context = ctx || cc.renderContext;

        context.save();

        if (this._grid && this._grid.isActive()) {
            this._grid.beforeDraw();
            this.transformAncestors();
        }

        this.transform(context);
        var i, node;
        if (this._children) {
            // draw children zOrder < 0
            for (i = 0; i < this._children.length; i++) {
                node = this._children[i];
                if (node && node._zOrder < 0) {
                    node.visit(context);
                } else {
                    break;
                }
            }
        }
        this.draw(context);
        if (this._children) {
            for (; i < this._children.length; i++) {
                node = this._children[i];
                if (node && node._zOrder >= 0) {
                    node.visit(context);
                }
            }
        }
        if (this._maskShow) {
            ctx.globalCompositeOperation = "destination-out";
            if (this._mask) {
                this._mask.visit(ctx);
            }
            ctx.globalCompositeOperation = "source-over";
        }
        if (this._grid && this._grid.isActive()) {
            this._grid.afterDraw(this);
        }

        context.restore();

    },
    update:function () {
    }
});
Graphic.Sprite.prototype.position = function () {
    var t = this.nodeToWorldTransform();
    var s = new cc.Size(this.width, this.height);
    s.width = t.a * s.width + t.c * s.height;
    s.height = t.b * s.width + t.d * s.height;
    this._m_tParentRotationChanged = false;
    return cc.ccpAdd(cc.ccp(t.tx, t.ty), cc.ccp(s.width / 2, s.height / 2));
};
Graphic.Sprite.prototype.getCurrentPosition = function () {
    if (this.parent == this.stage)return this._position;
    if (this._m_tParentRotationChanged) {
        var point = this.position();
        this._m_tCurrentPosition = cc.ccp(Math.floor(point.x), Math.floor(point.y));
        this.setChildrenPositionChanged();
    }
    return this._m_tCurrentPosition;
};
Graphic.Sprite.prototype.hitTest = function (point) {
    var width = ((this._m_tScaleX == 1) ? this.width : this._m_tRect.size.width) / 2;
    var height = ((this._m_tScaleY == 1) ? this.height : this._m_tRect.size.height) / 2;
    return Math.abs(point.x) < width && Math.abs(point.y) < height;
};
Graphic.Sprite.prototype.isInRange = function () {
    //if(this._m_tRangeChecked)return this._m_tInRange;
    var touch = this.touchPosition = cc.ccpSub(this._m_tBeginPos, this.getCurrentPosition());
    this._m_tRangeChecked = true;
    return this.hitTest(touch);
};
Graphic.Sprite.prototype.getChildAt = function (index) {
    return (this._children == null && index < this._children.length) ? null : this._children[index];
};
Graphic.Sprite.prototype.dispatchEvent = function (type) {
    if (this.hasEventListener(type))
        Graphic.Event.dispatchEvent(type, this);
};
/*
 @type
 */
Graphic.Sprite.prototype.updateEventListener = function () {
    if (this.parent && this._listening && !this._sleeping)
        this.parent.addListening(this);
    else if (this.parent && !this._listening && this._sleeping) {
        this.parent.removeListening(this);
    }
};
Graphic.Sprite.prototype.hasEventListener = function (type) {
    if (this.Trigger[type.triggerType] == null)
        return false;
    if (this.Trigger[type.triggerType][type.type] == null)
        return false;
    return true;
};
Graphic.Sprite.prototype.addEventListener = function (type, trigger) {
    if (!this._m_tTouchStart) {
        this._listening = true;
        this._sleeping = false;
        this.WakeUp();
    }
    if (this.Trigger[type.triggerType] == null)
        this.Trigger[type.triggerType] = {};
    if (this.Trigger[type.triggerType][type.type] == null)
        this.Trigger[type.triggerType][type.type] = function () {
        };
    this.Trigger[type.triggerType][type.type] = trigger;
};

Graphic.Sprite.prototype.removeEventListener = function (type, trigger) {
    if (this.hasEventListener(type) && this.Trigger[type.triggerType][type.type] == trigger)
        this.Trigger[type.triggerType][type.type] = null;
    else return;
    if (!this._m_tTouchStart)return;
    for (var name in this.Trigger) {
        for (var v in this.Trigger[name]) {
            if (this.Trigger[name][v] != null)
                return;
        }
    }
    this.Sleep();
    this._sleeping = true;
    this._listening = false;
};
Graphic.Sprite.prototype.addListening = function (target) {
    if (target)
        this._addUpdate(this._listeningChildren, target);
};
Graphic.Sprite.prototype.removeListening = function (target) {
    if (target)
        this._removeUpdate(this._listeningChildren, target);
};
Graphic.Sprite.prototype.AllSleep = function () {
    if (this._sleeping)return;
    for (var i = 0; i < this.numChildren; i++) {
        this.getChildAt(i).Sleep();
    }
    this._sleeping = true;
};
Graphic.Sprite.prototype.AllWake = function () {
    if (!this._sleeping)return;
    for (var i = 0; i < this.numChildren; i++) {
        this.getChildAt(i).WakeUp();
    }
    this._sleeping = false;
};
Graphic.Sprite.prototype.Sleep = function () {
    if (!this._listening)return;
    //if (this._main)
    cc.Director.sharedDirector().getTouchDispatcher().removeDelegate(this);
    //else {
    //    if (this.parent) {
    //        this.parent.removeListening(this);
    //    }
    //}
    this._m_tTouchStart = false;
};
Graphic.Sprite.prototype.WakeUp = function () {
    if (!this._listening)return;
    //if (this._main) {
    cc.Director.sharedDirector().getTouchDispatcher().addStandardDelegate(this, 1);
    //} else {
    //        this.addListening(this);
    //}
    this._m_tTouchStart = true;
};
Graphic.Sprite.prototype.__defineGetter__("x", function () {
    return this.getPosition().x;
});

Graphic.Sprite.prototype.__defineSetter__("x", function (value) {
    var point = cc.ccp(value, this.y);
    this.setPosition(point);
    //this._position.x = value;
});

Graphic.Sprite.prototype.__defineGetter__("y", function () {
    return this.getPosition().y;
});

Graphic.Sprite.prototype.__defineSetter__("y", function (value) {
    var point = cc.ccp(this.x, value);
    this.setPosition(point);
    //this._position.y = value;
});

Graphic.Sprite.prototype.__defineGetter__("parent", function () {
    return this.getParent();
});

Graphic.Sprite.prototype.__defineGetter__("mouseX", function () {
    return this._m_tBeginPos.x - this.getCurrentPosition().x;
});

Graphic.Sprite.prototype.__defineGetter__("mouseY", function () {
    return this._m_tBeginPos.y - this.getCurrentPosition().y;
});

Graphic.Sprite.prototype.__defineGetter__("mouseInRange", function () {
    return this._m_tInRange;
});

Graphic.Sprite.prototype.__defineGetter__("numChildren", function () {
    return this._children == null ? 0 : this._children.length;
});

Graphic.Sprite.prototype.__defineGetter__("width", function () {
    return this._m_tScaleX != 1 || this._rect.size.width == 0 ? this._m_tRect.size.width : this._rect.size.width;
});

Graphic.Sprite.prototype.__defineGetter__("height", function () {
    return this._m_tScaleY != 1 || this._rect.size.height == 0 ? this._m_tRect.size.height : this._rect.size.height;
});

Graphic.Sprite.prototype.__defineGetter__("stage", function () {
    return Main.sharedLayer();
});
