/**
 * Created with JetBrains WebStorm.
 * User: Locke
 * Date: 2012/7/24
 * Time: 上午 9:59
 * To change this template use File | Settings | File Templates.
 */
var Question = cc.Class.extend({
    question:null,
    answer:null,
    currentSelection:null,
    A:null,
    B:null,
    C:null,
    D:null,
    ctor:function (question, answer) {
        this.question = question;
        this.answer = answer;
    },
    setSelection:function (answer, A, B, C, D) {
        if (!A || !B || !C || !D) {
            var rand = parseInt(Math.random() * 4);
            this.currentSelection = rand;
            switch (rand) {
                case 0:
                    this.A = this.answer;
                    this.B = (parseInt(this.answer) * 3 % 100 + 5).toString();
                    this.C = (parseInt(this.answer) * 4 % 100 + 5).toString();
                    this.D = (parseInt(this.answer) * 5 % 100 + 5).toString();
                    break;
                case 1:
                    this.B = this.answer;
                    this.A = (parseInt(this.answer) * 3 % 100 + 5).toString();
                    this.C = (parseInt(this.answer) * 4 % 100 + 5).toString();
                    this.D = (parseInt(this.answer) * 5 % 100 + 5).toString();
                    break;
                case 2:
                    this.C = this.answer;
                    this.B = (parseInt(this.answer) * 3 % 100 + 5).toString();
                    this.A = (parseInt(this.answer) * 4 % 100 + 5).toString();
                    this.D = (parseInt(this.answer) * 5 % 100 + 5).toString();
                    break;
                case 3:
                    this.D = this.answer;
                    this.B = (parseInt(this.answer) * 3 % 100 + 5).toString();
                    this.C = (parseInt(this.answer) * 4 % 100 + 5).toString();
                    this.A = (parseInt(this.answer) * 5 % 100 + 5).toString();
                    break;
            }
        } else {
            this.A = A;
            this.B = B;
            this.C = C;
            this.D = D;
        }
        this.answer = answer;
    }
});
var QuestionManager = cc.Class.extend({
    _question:[],
    _index:0,
    _nextIndex:0,
    _board:null,
    ctor:function (questions, board) {

    },
    init:function () {

    },
    next:function () {

    },
    setQuestion:function (value, index) {
        this._question[index].question = value;
    },
    getQuestion:function (index) {
        if (!index)return this._question[this._index].question;
    },
    setAnswer:function (value, index) {
        this._question[index].answer = value;
    },
    getAnswer:function (index) {
        if (!index)return this._question[this._index].answer;
    }
});