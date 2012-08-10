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
        // this.addScore(score);
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
        this._addScore = value ? ScoreBoard.Excellent : ScoreBoard.Normal;
        this.currentScore = this.score + this._addScore;
    },
    stop:function () {
        Graphic.Animation.Queue.remove(this);
    }

});
ScoreBoard.Excellent = 15;
ScoreBoard.Normal = 10;
ScoreBoard.ExcellentCount = 0;
ScoreBoard.GreatCount = 0;
ScoreBoard.GoodCount = 0;
ScoreBoard.MissCount = 0;
ScoreBoard.setTime = function (value) {
    var item = $('#TimeText');
    item.text(value);
};
ScoreBoard.setScore = function (value) {
    var item = $('#ScoreText');
    item.text(value);
};
ScoreBoard.getTargetValue = function (target) {
    var item = $('#' + target);
    return parseInt(item.text());
};
ScoreBoard.addExcellentCount = function () {
    var item = $('#ScoreExcellent');
    var value = ScoreBoard.ExcellentCount = ScoreBoard.ExcellentCount + 1;
    item.text(Graphic.Utils.AutoZeros(1, value, true));
};
ScoreBoard.addGreatCount = function () {
    var item = $('#ScoreGreat');
    var value = ScoreBoard.GreatCount = ScoreBoard.GreatCount + 1;
    item.text(Graphic.Utils.AutoZeros(1, value, true));
};
ScoreBoard.addGoodCount = function () {
    var item = $('#ScoreGood');
    var value = ScoreBoard.GoodCount = ScoreBoard.GoodCount + 1;
    item.text(Graphic.Utils.AutoZeros(1, value, true));
};
ScoreBoard.addMissCount = function () {
    var item = $('#ScoreMiss');
    var value = ScoreBoard.MissCount = ScoreBoard.MissCount + 1;
    item.text(Graphic.Utils.AutoZeros(1, value, true));
};

ScoreBoard.showCalcBoard = function () {
    var that = {Index:0,
        value:[
            ScoreBoard.ExcellentCount ,
            ScoreBoard.GreatCount ,
            ScoreBoard.GoodCount ,
            ScoreBoard.MissCount ],
        Score:[ScoreBoard.Excellent, ScoreBoard.Normal, ScoreBoard.Normal, 0],
        now:0, nowScore:0};
    var target = ["ScoreExcellent", "ScoreGreat", "ScoreGood", "ScoreMiss", "ScoreTotal"];
    that.show = target;
    for (var i = 0; i < target.length; i++) {
        $("#ScoreCalc_T" + (i + 1).toString()).hide();
    }
    $("#ScoreCalc").show();
    Graphic.Animation.Queue.add(new Graphic.Utils.Timer(0.5), Graphic.Animation.Dispatcher(that, null, ScoreBoard.NextTD));
    $('#ScoreCalc_T1').show();
    ScoreBoard.PositionUpdate();
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
ScoreBoard.onScoreCalcUpdate = function (e) {
    var that = e.target;
    var item = $('#' + that.show[that.Index]);
    var elapse = parseInt(that.value[that.Index] * that.elapsed)
    that.now = that.value[that.Index] - elapse;
    var total = that.nowScore + elapse * that.Score[that.Index];
    item.text(Graphic.Utils.AutoZeros(1, that.now, true));
    $('#ScoreTotal').text(Graphic.Utils.AutoZeros(2, total, true));
};
ScoreBoard.onScoreCalcComplete = function (e) {
    var that = e.target;
    var item = $('#' + that.show[that.Index]);
    item.text(Graphic.Utils.AutoZeros(1, 0, true));
    that.nowScore += that.value[that.Index] * that.Score[that.Index];
    $('#ScoreTotal').text(Graphic.Utils.AutoZeros(2, that.nowScore, true));
    while (that.value[++that.Index] == 0 && that.Index < that.value.length);//console.log(that.Index);
    if (that.Index < that.value.length)
        Graphic.Animation.Queue.add(new Graphic.Utils.Timer(1), Graphic.Animation.Dispatcher(that, ScoreBoard.onScoreCalcUpdate, ScoreBoard.onScoreCalcComplete));
};

ScoreBoard.NextTD = function (e) {
    var that = e.target;
    that.Index++;
    $('#ScoreCalc_T' + (that.Index + 1).toString()).show();
    if (that.Index < that.value.length)
        Graphic.Animation.Queue.add(new Graphic.Utils.Timer(1), Graphic.Animation.Dispatcher(that, null, ScoreBoard.NextTD));
    else {
        that.Index = 0;
        Graphic.Animation.Queue.add(new Graphic.Utils.Timer(1), Graphic.Animation.Dispatcher(that, ScoreBoard.onScoreCalcUpdate, ScoreBoard.onScoreCalcComplete));
    }
};
ScoreBoard.PositionUpdate = function () {
    var item = $("#ScoreCalc");
    var left = parseInt(item.css('left'));
    item.css('left', left + 320);
    item.animate({
        left:left,
        opacity:0.8
    }, 1000);
};