/**
 * @author Locke
 */

var Graphic = Graphic = Graphic || {};
Graphic.MouseEvent = Graphic.Event.extend({
    type:"MouseEvent",
    triggerType:null
});
Graphic.MouseEvent.TriggerType = {};
Graphic.MouseEvent.TriggerType.MOVE = "move";
//Graphic.MouseEvent.TriggerType.MOVE_IN = "move_in";
//Graphic.MouseEvent.TriggerType.MOVE_OUT = "move_out";
Graphic.MouseEvent.TriggerType.CLICK = "click_up";
//Graphic.MouseEvent.TriggerType.CLICK_DOWN = "click_down";
Graphic.MouseEvent.MOUSE_CLICK = {
    type:"mouse_click",
    triggerType:Graphic.MouseEvent.TriggerType.CLICK
};
Graphic.MouseEvent.MOUSE_UP = {
    type:"mouse_up",
    triggerType:Graphic.MouseEvent.TriggerType.CLICK
};
Graphic.MouseEvent.MOUSE_DOWN = {
    type:"mouse_down",
    triggerType:Graphic.MouseEvent.TriggerType.CLICK
};
Graphic.MouseEvent.MOUSE_OVER = {
    type:"mouse_over",
    triggerType:Graphic.MouseEvent.TriggerType.MOVE
};
Graphic.MouseEvent.MOUSE_OUT = {
    type:"mouse_out",
    triggerType:Graphic.MouseEvent.TriggerType.MOVE
};
Graphic.MouseEvent.MOUSE_MOVE = {
    type:"mouse_move",
    triggerType:Graphic.MouseEvent.TriggerType.MOVE
};
