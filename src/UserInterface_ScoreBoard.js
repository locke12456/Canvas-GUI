/**
 * Created with JetBrains WebStorm.
 * User: Locke
 * Date: 2012/7/31
 * Time: 上午 10:39
 * To change this template use File | Settings | File Templates.
 */
var ScoreBoard = cc.Class.extend({
    time:60,
    ctor:function (score, time) {
        this.time = time || this.time;

        cc.Timer.timerWithTarget(this, "Update", 1);
    },
    Update:function (value) {
        setTime(this.time--);
    }

});