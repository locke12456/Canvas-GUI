/**
 * Created with JetBrains WebStorm.
 * User: Locke
 * Date: 2012/8/3
 * Time: 下午 3:22
 * To change this template use File | Settings | File Templates.
 */
var ProcessManager = cc.Layer.extend({
    ctor:function () {
        this._super();
    },
    getLevel:function (score) {
        if (score < ProcessManager.LEVEL_1) return -1;
        if (score >= ProcessManager.LEVEL_5)return 1;
        if (score >= ProcessManager.LEVEL_4)return .75;
        if (score >= ProcessManager.LEVEL_3)return .5;
        if (score >= ProcessManager.LEVEL_2)return .25;
        if (score >= ProcessManager.LEVEL_1)return 0;
    }
});
ProcessManager.LEVEL_1 = 300;
ProcessManager.LEVEL_2 = 450;
ProcessManager.LEVEL_3 = 600;
ProcessManager.LEVEL_4 = 750;
ProcessManager.LEVEL_5 = 900;