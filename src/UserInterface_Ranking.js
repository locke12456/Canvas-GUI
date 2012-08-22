/**
 * Created with JetBrains WebStorm.
 * User: Locke
 * Date: 2012/8/22
 * Time: 下午 4:30
 * To change this template use File | Settings | File Templates.
 */
var STATIC_HOST = STATIC_HOST || "";
var update = null;
var RankingData = cc.Class.extend({
    uid:0,
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
    update:function (gid, nickname, score, record) {
        $.post(STATIC_HOST + "updateScore.php", {
            gid:gid,
            uid:this.getUid(),
            nickname:nickname,
            total:score,
            score:record
        });
    },
    _initUid:function (data) {
        update.uid = data;
    }
});
var Ranking = cc.Class.extend({
    ranking_data:null,
    ctor:function () {
        this.init();
        this.ranking_data = new RankingData();
    },
    init:function () {
        for (var i = 1; i <= 9; i++) {
            $("#RankingTable").append('<tr id="Ranking_T' + i + '"><td class="RankingRank">000</td><td class="RankingNickname">000</td><td class="RankingScore">000</td></tr>');
        }
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