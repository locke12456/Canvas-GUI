/**
 * Created with JetBrains WebStorm.
 * User: Locke
 * Date: 2012/6/26
 * Time: 上午 9:41
 * To change this template use File | Settings | File Templates.
 */
var Graphic = Graphic = Graphic || {};
Graphic.lib_path = Graphic.lib_path || "";
Graphic.EventHandler = Graphic.lib_path + "Graphic/EventHandler/";
include(Graphic.EventHandler + 'Event.js');
include(Graphic.EventHandler + 'MouseEvent.js');
include(Graphic.EventHandler + 'ButtonEvent.js');
include(Graphic.EventHandler + 'ScrollEvent.js');