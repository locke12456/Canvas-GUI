/**
 * Created with JetBrains WebStorm.
 * User: Locke
 * Date: 2012/6/11
 * Time: 上午 9:35
 * To change this template use File | Settings | File Templates.
 */
var Graphic = Graphic = Graphic || {};
Graphic.Animation = cc.Class.extend({
    _m_tAnimationBegin:false,
    _m_tQueue:[],
    ctor:function () {

    },
    isAnimationBegin:function () {
        return this._m_tAnimationBegin;
    },
    AnimationStart:function () {
        if (this._m_tAnimationBegin)return;
        this._m_tAnimationBegin = true;
        cc.Director.sharedDirector().getScheduler().scheduleUpdateForTarget(this, 0, false);
    },
    AnimationStop:function () {
        this._m_tAnimationBegin = false;
        ccc.Director.sharedDirector().getScheduler().unscheduleUpdateForTarget(this);
    },
    addTarget:function (target) {
        this._m_tQueue.push(target);
    },
    removeTarget:function (target) {
        var index = this._m_tQueue.indexOf(target);
        this._m_tQueue.splice(index, 1);
    },
    numActions:function (pTarget) {
        if (pTarget)
            return cc.ActionManager.sharedManager().numberOfRunningActionsInTarget(pTarget.target);
        else return 0;
    },
    dispatch:function (queue) {
        var evt = Graphic.Dispatcher(queue.type, queue.target);
        queue.trigger(evt);
    },
    recycle:function () {
        for (var i = 0; i < this._m_tQueue.length; i++) {
            if (this._m_tQueue[i] == null)this.removeTarget(this._m_tQueue[i]);
        }
        if (this._m_tQueue.length == 0)this.AnimationStop();
    },
    update:function () {
        var recycle = false;
        for (var i = 0; i < this._m_tQueue.length; i++) {
            if (this._m_tQueue[i]) {
                var action = this.numActions(this._m_tQueue[i]);
                if (action == 0) {
                    if (this._m_tQueue[i].type == Graphic.Event.COMPLETE) {
                        if (this._m_tQueue[i].trigger != null) {
                            this.dispatch(this._m_tQueue[i]);
                        }
                    }
                    recycle = true;
                    this._m_tQueue[i] = null;
                }
            }
        }
        if (recycle)this.recycle();
    }
});
Graphic.Animation.prototype.add = function (action, dispatcher) {
    this.AnimationStart();
    cc.ActionManager.sharedManager().addAction(action, dispatcher.target);
    this.addTarget(dispatcher);
};
Graphic.Animation.Queue = new Graphic.Animation();