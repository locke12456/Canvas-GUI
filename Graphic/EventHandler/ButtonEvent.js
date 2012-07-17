/**
 * Created with JetBrains WebStorm.
 * User: Locke
 * Date: 2012/6/19
 * Time: 上午 9:19
 * To change this template use File | Settings | File Templates.
 */
var Graphic = Graphic = Graphic || {};
Graphic.ButtonEvent = Graphic.Event.extend({
    type:"ButtonEvent",
    triggerType:null
});
Graphic.ButtonEvent.TriggerType = {};
Graphic.ButtonEvent.TriggerType.CLICK = "b_click";
Graphic.ButtonEvent.BUTTON_CLICK = {
    type:"button_click",
    triggerType:Graphic.MouseEvent.TriggerType.CLICK
};
Graphic.ButtonEvent.BUTTON_UP = {
    type:"button_up",
    triggerType:Graphic.ButtonEvent.TriggerType.CLICK
};
Graphic.ButtonEvent.BUTTON_DOWN = {
    type:"button_down",
    triggerType:Graphic.ButtonEvent.TriggerType.CLICK
};