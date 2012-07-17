/**
 * @author Locke
 */
var Graphic = Graphic = Graphic || {};

Graphic.Event = cc.Class.extend({
    type:"Event",
    triggerType:null
});
Graphic.Event.TriggerType = {};
Graphic.Event.TriggerType.EVENT = "event";
Graphic.Event.COMPLETE = {
    type:"complete",
    triggerType:Graphic.Event.TriggerType.EVENT
};
Graphic.Event.ACTIVE = {
    type:"active",
    triggerType:Graphic.Event.TriggerType.EVENT
};
Graphic.Event.CONNECT = {
    type:"connect",
    triggerType:Graphic.Event.TriggerType.EVENT
};
Graphic.Event.ADD = {
    type:"add",
    triggerType:Graphic.Event.TriggerType.EVENT
};
Graphic.Event.REMOVE = {
    type:"remove",
    triggerType:Graphic.Event.TriggerType.EVENT
};

Graphic.Event.dispatchEvent = function (type, target) {
    var evt = Graphic.Dispatcher(type, target);
    target.Trigger[type.triggerType][type.type](evt);
};

Graphic.Dispatcher = function (_type, _target, _trigger) {
    return {
        trigger:_trigger,
        target:_target,
        type:_type
    };
};
