/**
 * Created with JetBrains WebStorm.
 * User: Locke
 * Date: 2012/7/31
 * Time: 上午 10:39
 * To change this template use File | Settings | File Templates.
 */
//var ScoreBoard = ScoreBoard || {};
var ScoreBoard = cc.Class.extend({
    _addTime:0,
    time:0,
    currentTime:0,
    _addScore:0,
    score:0,
    currentScore:0,
    ctor:function (score, time) {
        this.addScore(score);
        this.addTime(time);
        Graphic.Animation.Queue.add(new Graphic.Utils.Timer(1), Graphic.Animation.Dispatcher(this, ScoreBoard.onUpdate, ScoreBoard.onTimerUpdateComplete));
        $("#Score").show();
        // cc.Timer.timerWithTarget(this, "Update", 1);
    },
    addTime:function (value) {
        if (this.currentTime + value > 100)return false;
        if (this.currentTime == 0) {
            Main.sharedLayer().resume();
            var time = Graphic.Utils.AutoZeros(1, value, true);
            ScoreBoard.setTime(time);
        }
        this._addTime = value;
        this.currentTime = this.currentTime + value;
        return true;
    },
    getScore:function () {
        return this.currentScore;
    },
    addScore:function (value) {
        this._addScore = value;
        this.currentScore = this.score + value;
    }

});
ScoreBoard.setTime = function (value) {
    var item = $('#TimeText');
    item.text(value);
};
ScoreBoard.setScore = function (value) {
    var item = $('#ScoreText');
    item.text(value);
};
ScoreBoard.onUpdate = function (e) {
    if (e.target._addScore == 0 && e.target._addTime == 0)return;
    if (e.target.score < e.target.currentScore) {
        e.target.score = (e.target._addScore / 2) < 1 ? e.target.score + 1 : e.target.score + (e.target._addScore / 2);
        e.target.score = parseInt(e.target.score);
        e.target._addScore = e.target._addScore - (e.target._addScore / 2);
        if (e.target.score >= e.target.currentScore) {
            e.target.score = e.target.currentScore;
            e.target._addScore = 0;
        }
        var score = Graphic.Utils.AutoZeros(2, e.target.score, true);
        ScoreBoard.setScore(score);
    }
    if (e.target.time < e.target.currentTime) {
        e.target.time = (e.target._addTime / 10) < 1 ? e.target.time + 1 : e.target.time + (e.target._addTime / 10);
        e.target.time = parseInt(e.target.time);
        e.target._addTime = e.target._addTime - (e.target._addTime / 10);
        if (e.target.time >= e.target.currentTime) {
            e.target.time = e.target.currentTime;
            e.target._addTime = 0;
        }
        var time = Graphic.Utils.AutoZeros(1, e.target.time, true);
        ScoreBoard.setTime(time);
    }
};
ScoreBoard.onTimerUpdateComplete = function (e) {
    if (e.target.currentTime == 0) {
        Main.sharedLayer().pause();
        var time = Graphic.Utils.AutoZeros(1, 0, true);
    } else
        var time = Graphic.Utils.AutoZeros(1, --e.target.currentTime, true);
    ScoreBoard.setTime(time);
    Graphic.Animation.Queue.add(new Graphic.Utils.Timer(1), Graphic.Animation.Dispatcher(e.target, ScoreBoard.onUpdate, ScoreBoard.onTimerUpdateComplete));
};