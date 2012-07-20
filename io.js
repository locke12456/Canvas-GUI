/**
 * Created with JetBrains WebStorm.
 * User: Locke
 * Date: 2012/6/15
 * Time: 下午 3:18
 * To change this template use File | Settings | File Templates.
 */
var IO = IO = IO || {};
IO.KeyCode = "";
IO.KeyCodeToString = "";
if (navigator.appName == 'Netscape') {
//    document.captureEvents(Event.KEYPRESS);
}
if (navigator.appName != 'Microsoft Internet Explorer') {
    //var cav = document.body.getElementsByTagName("canvas")[0];
    //cav.addEventListener('keypress', onKeyPress);
    //cav.focus();  // 获得焦点之后，才能够对键盘事件进行捕获
}
function InternetExplore(e) {

    var key = e.charCode;
    var code = "[ " + String.fromCharCode(e.charCode) + " ]";
    cc.Log(code);
}
function onKeyPress(e) {
    cc.Log(1);
    try {
        if (e.keyCode || e.which) {
            var code = IO.KeyCode = (e.keyCode == 0) ? e.which : e.keyCode;
            var key = IO.KeyCodeToString = String.fromCharCode(code);
        } else {
            IO.KeyCodeToString = e.which;
        }
        cc.Log(IO.KeyCodeToString + " , " + e.which + " , " + e.keyCode);
    } catch (error) {
        cc.Log(error);
    }

}
