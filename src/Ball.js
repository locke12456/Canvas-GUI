/**
 * Created with JetBrains WebStorm.
 * User: Locke
 * Date: 2012/7/20
 * Time: 下午 1:32
 * To change this template use File | Settings | File Templates.
 */
var Graphic = Graphic = Graphic || {};
var Ball = Graphic.Sprite.extend({
    shooting:[],
    miss:[],
    sink:null,
    isMiss:false,
    BallPosition:null,
    shootIndex:0,
    shift:0,
    gravity:0,
    basket:null,
    complete:true,
    final:false,
    IsAir:false,
    ActionRunning:false,
    ctor:function (image, basket) {
        this._super(image);
        //this.init(image);
        Ball.Init_BALL_Points(this);
        this.basket = basket;
        this.scheduleUpdateWithPriority(1);
        this.pauseSchedulerAndActions();
    },
    Shoot:function (miss, IsAir) {
        if (this.ActionRunning)return;
        console.log("touch");
        this.resumeSchedulerAndActions();
        this.final = false;
        this.complete = true;
        this.ActionRunning = true;
        this.IsAir = !IsAir ? false : IsAir;
        this.shootIndex = parseInt(Math.random() * this.shooting.length);
        if (!miss) {
            this.shift = this.shooting[this.shootIndex][0].x < this.BallPosition.x ? 1 : -1;
            Graphic.Animation.Queue.add(cc.ScaleTo.create(0.6, 0.4, 0.4), Graphic.Animation.Dispatcher(this, Ball.onShooting, Ball.onShootComplete));
        } else {
            this.shift = this.miss[this.shootIndex % (this.miss.length - 1)][this.miss[this.shootIndex % (this.miss.length - 1)].length - 1].x > this.BallPosition.x ? 1 : -1;
            Graphic.Animation.Queue.add(cc.ScaleTo.create(0.4, 0.4, 0.4), Graphic.Animation.Dispatcher(this, Ball.onMiss, Ball.onMissComplete));
        }
    },
    update:function () {
        if (this.complete)return;
        if (!this.complete) {
            var move = this.shift;
            this.setRotation(this.getRotation() + move);
            this.x += move;
            this.y += this.gravity;
            this.gravity -= 0.5;
            if (this.y < Ball.BOTTON) {
                this.y = Ball.BOTTON;
                this.gravity *= -0.4;
            }
            if (Math.abs(this.gravity) < 0.05) {
                console.log(Math.abs(this.gravity));
                Graphic.Animation.Queue.add(cc.FadeTo.create(0.4, 0), Graphic.Animation.Dispatcher(this, null, Ball.onFinalUpdateComplete));
                this.complete = true;
            }
        }
    }
});
Ball.BALL_SIZE = 110;
Ball.BALL_Bezier_Points = [];
Ball.BOTTON = 261;
Ball.Init_GetBall = function (ball) {
    var obj = {x:300, y:134, width:0.4, height:0.4, bezier:[
        {x:205, y:340},
        {x:207, y:43.5},
        {x:284.5, y:36.25}
    ], time:0.7, transition:"linear"};

    return obj;
};

Ball.Init_BALL_Points = function (ball) {
    //shooting rule
    Ball.BALL_Bezier_Points[0] = [new cc.Point(196, 432), {x:277, y:70, width:0.4, height:0.4, bezier:[
        {x:205, y:340},
        {x:207, y:43.5},
        {x:284.5, y:36.25}
    ], time:0.7, transition:"linear"}];
    Ball.BALL_Bezier_Points[1] = [new cc.Point(280, 406), {x:277, y:70, width:0.4, height:0.4, bezier:[
        {x:286, y:236},
        {x:282, y:10}
    ], time:0.7, transition:"linear"}];
    Ball.BALL_Bezier_Points[2] = [new cc.Point(351, 404), {x:277, y:70, width:0.4, height:0.4, bezier:[
        {x:342, y:191},
        {x:295, y:9}
    ], time:0.7, transition:"linear"}];
    Ball.BALL_Bezier_Points[3] = [new cc.Point(171, 444), {x:277, y:70, width:0.4, height:0.4, bezier:[
        {x:186, y:125},
        {x:242, y:20}
    ], time:0.7, transition:"linear"}];
    Ball.BALL_Bezier_Points[4] = [new cc.Point(263, 413), {x:277, y:70, width:0.4, height:0.4, bezier:[
        {x:293, y:137},
        {x:290, y:23}
    ], time:0.7, transition:"linear"}];

    //進籃
    Ball.BALL_Bezier_Points[5] = [new cc.Point(277, 70), {x:276, y:63, bezier:[
        {x:270, y:74.75},
        {x:317.25, y:72.5},
        {x:296.25, y:73.75},
        {x:248.75, y:74.25},
        {x:213.5, y:72.75}
    ], time:0.5, transition:"linear"}];

    //MISS 1
    Ball.BALL_Bezier_Points[6] = [new cc.Point(276, 409), {x:224, y:89, width:0.4, height:0.4, bezier:[
        {x:286, y:33}
    ], time:0.7, transition:"linear"}];
    //MISS 2
    Ball.BALL_Bezier_Points[7] = [new cc.Point(277, 409), {x:334, y:80, width:0.4, height:0.4, bezier:[
        {x:286, y:33}
    ], time:0.7, transition:"linear"}];
    //MISS 3
    Ball.BALL_Bezier_Points[8] = [new cc.Point(277, 70), {x:276, y:63, bezier:[
        {x:270, y:74.75},
        {x:317.25, y:72.5},
        {x:296.25, y:73.75},
        {x:248.75, y:74.25},
        {x:213.5, y:72.75}
    ], time:0.5, transition:"linear"}];
    var obj = Ball.BALL_Bezier_Points[8][1];
    obj.bezier[3].y += 5;
    obj.bezier[4].x += 10;
    obj.bezier[4].y -= 10;
    obj.x = obj.x + 40;
    obj.time = 0.4;
    //init shooting
    for (var i = 0; i < 5; i++) {
        ball.shooting.push(Ball.BezierCreate(Ball.BALL_Bezier_Points[i][0], Ball.BALL_Bezier_Points[i][1], Ball.BALL_Bezier_Points[i][1].bezier));
    }
    //init sink
    ball.sink = Ball.BezierCreate(Ball.BALL_Bezier_Points[5][0], Ball.BALL_Bezier_Points[5][1], Ball.BALL_Bezier_Points[5][1].bezier);
    //init miss
    for (var i = 6; i < 9; i++) {
        ball.miss.push(Ball.BezierCreate(Ball.BALL_Bezier_Points[i][0], Ball.BALL_Bezier_Points[i][1], Ball.BALL_Bezier_Points[i][1].bezier));
    }
};
Ball.BezierCreate = function (start, end, points) {
    var height = cc.Director.sharedDirector().getWinSize().height;
    Graphic.Utils.PointsToCartesian(start, height);
    Graphic.Utils.PointsToCartesian(end, height);
    Graphic.Utils.PointsToCartesian(points, height);
    return Graphic.Utils.bezier_Make(start, end, points);
};
Ball.onShooting = function (e) {
    var point = e.target.shooting[e.target.shootIndex];
    var time = parseInt((point.length - 1) * e.target.elapsed);
    e.target.x = point[time].x;
    e.target.y = point[time].y;
    e.target.setRotation(e.target.getRotation() + 2);
};
Ball.onShootComplete = function (e) {
    var point = e.target.shooting[e.target.shootIndex];
    e.target.x = point[point.length - 1].x;
    e.target.y = point[point.length - 1].y;
    if (!e.target.IsAir)
        Graphic.Animation.Queue.add(cc.RotateTo.create(1.0, 720), Graphic.Animation.Dispatcher(e.target, Ball.onSink, Ball.onSinkComplete));
    else {
        Ball.onSinkComplete(e);
    }
};
Ball.onSink = function (e) {
    var point = e.target.sink;
    var time = parseInt((point.length - 1) * e.target.elapsed);
    e.target.x = point[time].x;
    e.target.y = point[time].y;
    e.target.basket.setRotation(1 - Math.random() * 2);
};
Ball.onSinkComplete = function (e) {
    e.target.gravity = -6;
    e.target.complete = false;
};
Ball.onMiss = function (e) {
    var point = e.target.miss[e.target.shootIndex % (e.target.miss.length - 1)];
    var time = parseInt((point.length - 1) * e.target.elapsed);
    e.target.x = point[time].x;
    e.target.y = point[time].y;
    if (e.target.elapsed > 0.8)
        e.target.basket.setRotation(1 - Math.random() * 2);
};
Ball.onMissComplete = function (e) {
    e.target.gravity = -8;
    e.target.complete = false;
};

Ball.onFinalUpdateComplete = function (e) {
    var size = cc.Director.sharedDirector().getWinSize();
    e.target.setPosition(cc.ccp(size.width, 0));
    //e.target.runAction();
    Graphic.Animation.Queue.add(cc.MoveTo.create(0.4, e.target.BallPosition), Graphic.Animation.Dispatcher(e.target, Ball.onUpdate, Ball.onUpdateComplete));
    // e.target.runAction(cc.FadeTo.create(0.4,1));
};
Ball.onUpdate = function (e) {
    e.target.setScale(e.target.elapsed);
    e.target.setRotation(e.target.getRotation() + 2);
    e.target.setOpacity(e.target.elapsed * 255);
};
Ball.onUpdateComplete = function (e) {
    e.target.final = true;
    e.target.complete = false;
    e.target.ActionRunning = false;
    e.target.setOpacity(255);
    e.target.setScale(1);
    e.target.setRotation(0);
    e.target.pauseSchedulerAndActions();
};