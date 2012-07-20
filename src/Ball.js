/**
 * Created with JetBrains WebStorm.
 * User: Locke
 * Date: 2012/7/20
 * Time: 下午 1:32
 * To change this template use File | Settings | File Templates.
 */
var BALL_SIZE = 110;
var BALL_Bezier_Points = [];
function Init_GetBall() {

    var obj = {x:300, y:134, width:BALL_SIZE * 0.4, height:BALL_SIZE * 0.4, bezier:[
        {x:205, y:340},
        {x:207, y:43.5},
        {x:284.5, y:36.25}
    ], time:0.7, transition:"linear"};
    return obj;
}

function Init_BALL_Points() {
    BALL_Bezier_Points[0] = [new cc.Point(196, 432), {x:277, y:70, width:BALL_SIZE * 0.4, height:BALL_SIZE * 0.4, bezier:[
        {x:205, y:340},
        {x:207, y:43.5},
        {x:284.5, y:36.25}
    ], time:0.7, transition:"linear"}];
    BALL_Bezier_Points[1] = [new cc.Point(280, 406), {x:277, y:70, width:BALL_SIZE * 0.4, height:BALL_SIZE * 0.4, bezier:[
        {x:286, y:236},
        {x:282, y:10}
    ], time:0.7, transition:"linear"}];
    BALL_Bezier_Points[2] = [new cc.Point(351, 404), {x:277, y:70, width:BALL_SIZE * 0.4, height:BALL_SIZE * 0.4, bezier:[
        {x:342, y:191},
        {x:295, y:9}
    ], time:0.7, transition:"linear"}];
    BALL_Bezier_Points[3] = [new cc.Point(171, 444), {x:277, y:70, width:BALL_SIZE * 0.4, height:BALL_SIZE * 0.4, bezier:[
        {x:186, y:125},
        {x:242, y:20}
    ], time:0.7, transition:"linear"}];
    BALL_Bezier_Points[4] = [new cc.Point(263, 413), {x:277, y:70, width:BALL_SIZE * 0.4, height:BALL_SIZE * 0.4, bezier:[
        {x:293, y:137},
        {x:290, y:23}
    ], time:0.7, transition:"linear"}];
    BALL_Bezier_Points[5] = [new cc.Point(277, 70), {x:276, y:63, bezier:[
        {x:270, y:74.75},
        {x:317.25, y:72.5},
        {x:296.25, y:73.75},
        {x:248.75, y:74.25},
        {x:213.5, y:72.75}
    ], time:0.5, transition:"linear"}];
    BALL_Bezier_Points[6] = [new cc.Point(276, 409), {x:224, y:89, width:BALL_SIZE * 0.4, height:BALL_SIZE * 0.4, bezier:{x:286, y:33}, time:0.7, transition:"linear"}];
    BALL_Bezier_Points[7] = [new cc.Point(277, 409), {x:334, y:80, width:BALL_SIZE * 0.4, height:BALL_SIZE * 0.4, bezier:{x:286, y:33}, time:0.7, transition:"linear"}];
}