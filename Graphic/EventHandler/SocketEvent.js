/**
 * Created with JetBrains WebStorm.
 * User: Locke
 * Date: 2012/8/27
 * Time: 上午 10:38
 * To change this template use File | Settings | File Templates.
 */
var Graphic = Graphic || {};
Graphic.Socket = Graphic.Socket || {};
Graphic.SocketEvent = Graphic.Event.extend({
    type:"SocketEvent",
    triggerType:null
});
Graphic.SocketEvent.TriggerType.CONNECT = "CONNECT_EVENT";
Graphic.SocketEvent.TriggerType.MESSAGE = "MESSAGE_EVENT";
Graphic.SocketEvent.SERVER_RESPONSE = {
    type:"SERVER_RESPONSE"
};
Graphic.SocketEvent.SENT = {
    type:"SENT",
    triggerType:Graphic.SocketEvent.TriggerType.CONNECT
};
Graphic.SocketEvent.LOGIN = {
    type:"LOGIN",
    triggerType:Graphic.SocketEvent.TriggerType.CONNECT
};
Graphic.SocketEvent.MESSAGE = {
    type:"MESSAGE",
    triggerType:Graphic.SocketEvent.TriggerType.MESSAGE
};
Graphic.SocketEvent.PUBLIC_MESSAGE = {
    type:"PUBLIC_MESSAGE",
    triggerType:Graphic.SocketEvent.TriggerType.MESSAGE
};
Graphic.SocketEvent.CONNECT = {
    type:"socket_connect",
    triggerType:Graphic.SocketEvent.TriggerType.CONNECT
};
Graphic.SocketEvent.COMPLETE = {
    type:"socket_complete",
    triggerType:Graphic.SocketEvent.TriggerType.CONNECT
};
Graphic.SocketEvent.USER_CONNECT = {
    type:"user_connect",
    triggerType:Graphic.SocketEvent.TriggerType.CONNECT
};
Graphic.SocketEvent.USER_LEAVE = {
    type:"user_leave",
    triggerType:Graphic.SocketEvent.TriggerType.CONNECT
};