/**
 * Created with JetBrains WebStorm.
 * User: Locke
 * Date: 2012/7/5
 * Time: 下午 3:45
 * To change this template use File | Settings | File Templates.
 */
var Graphic = Graphic = Graphic || {};
Graphic.ScrollEvent = Graphic.Event.extend({
    type:"ScrollEvent",
    triggerType:null
});
Graphic.ScrollEvent.TriggerType = {};
Graphic.ScrollEvent.TriggerType.SCROLL = "scroll";
Graphic.ScrollEvent.SCROLL_UP = {
    type:"scroll_up",
    triggerType:Graphic.ScrollEvent.TriggerType.SCROLL
};
Graphic.ScrollEvent.SCROLL_DOWN = {
    type:"scroll_down",
    triggerType:Graphic.ScrollEvent.TriggerType.SCROLL
};
Graphic.ScrollEvent.SCROLL = {
    type:"scroll",
    triggerType:Graphic.ScrollEvent.TriggerType.SCROLL
};