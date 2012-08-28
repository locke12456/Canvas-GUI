/**
 * Created with JetBrains WebStorm.
 * User: Locke
 * Date: 2012/8/22
 * Time: 下午 4:30
 * To change this template use File | Settings | File Templates.
 */
var STATIC_HOST = STATIC_HOST || "";
var TotalScore = TotalScore || 300;
var Record = Record || "";
var Nickname = Nickname || "";
var update = null;
var static_Ranking = null;
var RankingData = cc.Class.extend({
    gid:0,
    uid:0,
    Top10:null,
    ranking:null,
    count:0,
    rank:0,
    startIndex:0,
    _callback:null,
    _target:null,
    ctor:function () {
        this.init();
        update = this;
    },
    init:function () {
        var uri = STATIC_HOST + "getUid.php";
        $.get(uri, this._initUid);
    },
    getUid:function () {
        return this.uid;
    },
    readTop10:function (callback, target) {
        var uri = STATIC_HOST + "Top10.php";
        $.get(uri, this._initTop10);
        this._callback = callback;
        this._target = target;
    },
    readRanking:function (nickname, total, callback, target) {
        var uri = STATIC_HOST + "getRanking.php";
        $.post(uri, {
            gid:this.gid,
            uid:this.getUid(),
            nickname:nickname
        }, this._initRanking);
        this._callback = callback;
        this._target = target;
    },
    update:function (nickname, score, record) {
        $.post(STATIC_HOST + "updateScore.php?nickname=" + nickname, {
            gid:this.gid,
            uid:this.getUid(),
            nickname:nickname,
            total:score,
            score:record
        }, Ranking.ReadRanking).error(function () {
                alert("保存失敗！");
            });
    },
    _initUid:function (data) {
        update.uid = data;
    },
    _initTop10:function (data) {
        var ranking = JSON.parse(data)
        update.Top10 = [];
        var length = 10;
        var i = 0;
        while (i < length)update.Top10.push(ranking[i++]);
        if (update._callback)update._callback(update._target);
    },
    _initRanking:function (data) {
        var ranking = JSON.parse(data)
        update.ranking = [];
        var length = ranking.length;
        var i = 0;
        while (i < length)update.ranking.push(ranking[i++]);
        update.count = parseInt(ranking.count);
        update.rank = parseInt(ranking.rank);
        update.startIndex = parseInt(ranking.start) + 1;
        if (update._callback)update._callback(update._target);
    }
});
var Ranking = cc.Class.extend({
    type:null,
    ranking_data:null,
    PlayIndex:0,

    ctor:function () {
        this.init();
        this.ranking_data = new RankingData();
        this.ranking_data.gid = 1;
        static_Ranking = this;
    },
    init:function () {
        for (var i = 1; i <= 10; i++) {
            $("#RankingTable").append('<tr id="Ranking_T' + i + '"><td id="rank' + i + '"class="RankingRank">000</td><td id="name' + i + '" class="RankingNickname">000</td><td id="score' + i + '" class="RankingScore">000</td></tr>');
            $("#Ranking_T" + i).hide();
        }
        $("#Ranking").append('<table align="center" style="width: 360px"><tr id="Other"><td id="Top10" class="RankingTop9" onclick="Ranking.TOP10()">Top 10</td><td id="Self" class="RankingSelf" onclick="Ranking.ReadRanking()">自己的排名</td></tr></table>');
    },
    UpdateScore:function (gid, nickname, score, json) {
        this.ranking_data.update(nickname, score, json);
    },
    initRanking:function (target) {
        target.hideAll();
        var ranking_data = target.ranking_data;
        var data = target.type == "Top10" ? ranking_data.Top10 : ranking_data.ranking;
        var count = ranking_data.count - ranking_data.rank - 5;
        var result = false;
        for (var i = 0; i < data.length; i++) {
            var index = i + 1;
            var rank = data[i].seq;
            if (!result && data[i].nickname == Nickname && parseInt(data[i].total_score) == TotalScore) {
                target.setSpecialStyle(index);
                result = true;
            }
            else
                target.setDefaultStyle(index);
            if (rank < ranking_data.count + 1) {
                target.setRank(index, Graphic.Utils.AutoZeros(2, data[i].seq, true));
                target.setNickname(index, data[i].nickname);
                target.setScore(index, data[i].total_score);
                target.PlayIndex = index;
            }
        }
        Graphic.Animation.Queue.add(new Graphic.Utils.Timer(Ranking.AnimationTime), Graphic.Animation.Dispatcher(target, null, Ranking.AnimationComplete));
    },
    show:function (index) {
        $("#Ranking_T" + index).show();
    },
    hide:function (index) {
        $("#Ranking_T" + index).hide();
    },
    hideAll:function () {
        for (var i = 1; i <= 10; i++) {
            this.hide(i);
        }
    },
    setDefaultStyle:function (index) {
        if ($("#rank" + index).hasClass("RankingRank"))
            return;
        this.removeSpecialStyle(index);
        $("#rank" + index).toggleClass("RankingRank", true);
        $("#name" + index).toggleClass("RankingNickname", true);
        $("#score" + index).toggleClass("RankingScore", true);
    },
    setSpecialStyle:function (index) {
        if ($("#rank" + index).hasClass("RankingSRank"))
            return;
        this.removeDefaultStyle(index);
        $("#rank" + index).toggleClass("RankingSRank", true);
        $("#name" + index).toggleClass("RankingSNickname", true);
        $("#score" + index).toggleClass("RankingSScore", true);
    },
    removeDefaultStyle:function (index) {
        if (!$("#rank" + index).hasClass("RankingRank"))return;
        $("#rank" + index).removeClass("RankingRank");
        $("#name" + index).removeClass("RankingNickname");
        $("#score" + index).removeClass("RankingScore");
    },
    removeSpecialStyle:function (index) {
        if (!$("#rank" + index).hasClass("RankingSRank"))return;
        $("#rank" + index).removeClass("RankingSRank");
        $("#name" + index).removeClass("RankingSNickname");
        $("#score" + index).removeClass("RankingSScore");
    },
    setRank:function (index, value) {
        $("#Ranking_T" + index).children('td')[0].textContent = value;
    },
    setNickname:function (index, value) {
        $("#Ranking_T" + index).children('td')[1].textContent = value;
    },
    setScore:function (index, value) {
        $("#Ranking_T" + index).children('td')[2].textContent = value;
    }
});
Ranking.AnimationTime = 0.1;
Ranking.UpdateScore = function () {
    var nickname = $("#Input").val();
    if (!nickname || nickname.length < 3 || nickname == "") {
        if (!nickname && nickname.length < 3)
            alert("暱稱太短");
        else
            alert("請輸入暱稱");
        return;
    }
    Nickname = nickname;
    static_Ranking.UpdateScore(1, nickname, TotalScore, Record);
}
Ranking.TOP10 = function () {
    $("#Ranking").show();
    static_Ranking.type = "Top10";
    if (!update.Top10)static_Ranking.ranking_data.readTop10(static_Ranking.initRanking, static_Ranking);
    else static_Ranking.initRanking(static_Ranking);
};
Ranking.ReadRanking = function (data) {
    $("#SetNickname").hide();
    $("#Ranking").show();
    static_Ranking.type = "Ranking";
    if (!update.ranking)static_Ranking.ranking_data.readRanking(null, null, static_Ranking.initRanking, static_Ranking);
    else static_Ranking.initRanking(static_Ranking);
};
Ranking.AnimationComplete = function (e) {
    e.target.show(e.target.PlayIndex--);
    if (e.target.PlayIndex > 0)
        Graphic.Animation.Queue.add(new Graphic.Utils.Timer(Ranking.AnimationTime), Graphic.Animation.Dispatcher(e.target, null, Ranking.AnimationComplete));
}