/**
 * Created with JetBrains WebStorm.
 * User: Locke
 * Date: 2012/6/19
 * Time: 上午 9:30
 * To change this template use File | Settings | File Templates.
 */
var Graphic = Graphic = Graphic || {};
Graphic.Component = Graphic.Component || {};
Graphic.Component.DataGrid = Graphic.Component.DataGrid || {};
Graphic.Component.DataGrid.Sort = null;
Graphic.Component.DataGrid.SortType = null;
Graphic.Component.DataGrid.SortCase = "UPPER";
Graphic.Component.DataGrid.BEGIN_SORT = function (evt) {
    var target = evt.target;
    var DataGridView = target.parent.parent;
    Graphic.Component.DataGrid.SortCase = Graphic.Component.DataGrid.SortCase == "UPPER" ? "LOWER" : "UPPER";
    DataGridView.sortBy(target.id);
    DataGridView.sortItem();
};
Graphic.Component.DataGrid.UPPER = function (a, b) {
    if (Graphic.Component.DataGrid.SortType == "Number") return parseFloat(a[Graphic.Component.DataGrid.Sort]) - parseFloat(b[Graphic.Component.DataGrid.Sort]);
    else {
        var a = a[Graphic.Component.DataGrid.Sort].label.toLowerCase();
        var b = b[Graphic.Component.DataGrid.Sort].label.toLowerCase();
        return b.localeCompare(a);//(a < b) ? -1 : 1;
    }
};
Graphic.Component.DataGrid.LOWER = function (a, b) {
    if (Graphic.Component.DataGrid.SortType == "Number") return parseFloat(b[Graphic.Component.DataGrid.Sort]) - parseFloat(a[Graphic.Component.DataGrid.Sort]);
    else {
        var a = a[Graphic.Component.DataGrid.Sort].label.toLowerCase();
        var b = b[Graphic.Component.DataGrid.Sort].label.toLowerCase();
        return a.localeCompare(b);//(a > b) ? -1 : 1;
    }
};
Graphic.Component.DataGrid.SCROLL = function (evt) {
    var data_grid = evt.target.parent;
    //if (data_grid._scrollbar.getScrollProgress() % 5 == 0)
    data_grid._update = true;
};
Graphic.Component.DataGrid.DataGridView = Graphic.Sprite.extend({
    item:null,
    _default_texture:null,
    _default_texture_size:null,
    _column:null,
    _row:null,
    _rows:null,
    _rowHeight:null,
    _sortBy:null,
    _gridSize:null,
    _columnSize:null,
    _update:false,
    _updateRate:0,
    _scrollbar:null,
    _maskLeft:null,
    _maskRight:null,
    _maskUp:null,
    _maskDown:null,
    _hideItemStartIndex:0,
    _hideItemEndIndex:0,
    ctor:function (gridSize, columnSize) {
        this._gridSize = gridSize;
        this._columnSize = columnSize;
        if (!gridSize) {
            this._gridSize = cc.SizeMake(Graphic.Component.DataGrid.defaultWidth, Graphic.Component.DataGrid.defaultHeight);
        }
        if (!columnSize) {
            this._columnSize = cc.SizeMake(Graphic.Component.DataGrid.defaultColumnWidth, Graphic.Component.DataGrid.defaultColumnHeight);
        }
        this.init();
        var texture = Graphic.Utils.GradientTexture(cc.SizeMake(this._gridSize.width - 2, this._gridSize.height - 2), cc.ccc4(255, 255, 255, 255), Graphic.Utils.Gradient.RectVFrom, [cc.ccc4(240, 240, 240, 240), cc.ccc4(255, 255, 255, 255)]);
        texture = Graphic.Utils.SetTextureBackgroundSize(texture, this._gridSize.width, this._gridSize.height);
        texture = Graphic.Utils.TextureToImageData(texture);
        texture = Graphic.Effect.Convolution(cc.renderContext, texture, Graphic.Effect.Bevel, 254);
        var size = cc.SizeMake(this._columnSize.height * .5, this._gridSize.height - this._columnSize.height * 2);
        this._scrollbar = new Graphic.Component.ScrollBar(size.width, size.height);
        this._scrollbar.setPosition(cc.ccp(this._gridSize.width - size.width / 2, this._gridSize.height / 2 - this._columnSize.height * .5 - 2));
        this._scrollbar.addEventListener(Graphic.ScrollEvent.SCROLL, Graphic.Component.DataGrid.SCROLL);
        this.initWithTexture(Graphic.Utils.ImageDatasToTexture(texture));
        this.addEventListener(Graphic.MouseEvent.MOUSE_MOVE, function (evt) {
        });
        this.initMask();
        cc.Director.sharedDirector().getScheduler().scheduleUpdateForTarget(this, 0, false);
    },
    init:function () {
        this._super();
        this._column = new Graphic.Component.DataGrid.Columns(Graphic.Component.DataGrid.defaultColumnMinWidth, this._columnSize.width, this._columnSize.height);
        this._row = new Graphic.Sprite();
        this._row.setAnchorPoint(cc.ccp(0, 0));
        this._rows = [];
    },
    initMask:function () {
        var texture = Graphic.Utils.GradientTexture(cc.SizeMake(this._gridSize.width, this._columnSize.height), cc.ccc4(0, 0, 0, 255));

        this._mask = new Graphic.Sprite();
        this._maskShow = true;
        //this.win._mask.setVisible(true);
        this._maskDown = new Graphic.Sprite();
        this._maskDown.initWithTexture(texture);
        this._maskDown.setPosition(cc.ccp(0, -(this._gridSize.height / 2 + this._columnSize.height / 2) + 1));
        this._mask.addChild(this._maskDown);

        this._maskUp = new Graphic.Sprite();
        this._maskUp.initWithTexture(texture);
        this._maskUp.setPosition(cc.ccp(0, (this._gridSize.height / 2 + this._columnSize.height / 2) - 1));
        this._mask.addChild(this._maskUp);
    },
    addItem:function (item) {
        var type = this._column.getColumnsID();
        var array = [];
        var top = (this._gridSize.height - this._columnSize.height);
        for (var i = 0; i < type.length; i++) {
            array.push({label:item[type[i].label].toString(), width:type[i].width, type:type[i].label.toString()});
        }
        var row = new Graphic.Component.DataGrid.Rows(Graphic.Component.DataGrid.defaultColumnMinWidth, this._columnSize.width, this._columnSize.height);
        this._rows.push(row);
        row.__row = array;
        row.initRows();
        row.y = ((-this._columnSize.height * (this._rows.length)) + (2 * this._rows.length));
        this._IsItemOverflow(row);
        this._rowHeight = ((this._columnSize.height * (this._rows.length)) - (2 * this._rows.length));
        var overflow = this._rowHeight - top;
        if (overflow > 0) {
            var percent = overflow / top * 100;
            percent = 100 - percent < 0 ? 1 : 100 - percent;
            this._scrollbar.setThumbSize(percent);
        }
        //cc.Log(overflow);
        if (!this._row.parent) {
            this.sortItem();
        }
        this._row.addChild(row);

        this._update_row();
    },
    getScrollOffset:function () {
        var ScrollTo = this._scrollbar.getScrollProgress();
        return cc.PointMake(0, ScrollTo + 2);
    },
    sortBy:function (arg) {
        if (this._rows.length < 2)return;
        var type = parseInt(this._rows[arg]);
        Graphic.Component.DataGrid.SortType = (typeof type == "int") ? "Number" : "string";
        Graphic.Component.DataGrid.Sort = arg;
        this._rows.sort(Graphic.Component.DataGrid[Graphic.Component.DataGrid.SortCase]);
    },
    sortItem:function () {
        var temp = [];
        this.removeChild(this._scrollbar);
        this.removeChild(this._column);

        for (var i = 0; i < this._rows.length; i++) {
            this._row.removeChild(this._rows[i]);
        }
        for (var i = 0; i < this._rows.length; i++) {
            temp.push(this._rows[i]);
            //this.addChild(temp[i], 0);
            temp[i].y = ((-this._columnSize.height * (temp.length)) + (2 * temp.length));
            this._IsItemOverflow(this._rows[i]);
            this._row.addChild(temp[i], 0);
        }

        this._update_row();
        this.addChild(this._row);
        this.addChild(this._column);
        this.addChild(this._scrollbar);
    },
    setScale:function (value) {
    },
    setScaleX:function (value) {
    },
    setScaleY:function (value) {
    },
    _update_row:function () {
        var offset = this.getScrollOffset().y;
        var top = (this._gridSize.height - this._columnSize.height);
        var bottom = this._rowHeight;
        var total = bottom < top ? 0 : (bottom - top) / 100;
        this._row.y = (this._gridSize.height - this._columnSize.height) + total * offset;
        /*for (var i = 0; i < this._rows.length; i++) {
         this._rows[i].y = this._column.y - ((this._columnSize.height * (i + 1)) - (2 * (i + 1))) + offset;
         }*/
    },
    _IsItemOverflow:function (item) {
        //if (!item)return;
        var overflow = (item.y + this._row.y) < -this._columnSize.height || (item.y + this._row.y) > this._gridSize.height;
        if (item.isVisible()) {
            if (overflow)
                item.setVisible(false);
        } else {
            if (!overflow)
                item.setVisible(true);
        }
    },
    _checkOverflow:function () {
        //return;
        if (!this._isCacheDirty)return;
        if (this._rows.length == 0)return;
        var endIndex = Math.floor((this._gridSize.height - this._columnSize.height) / this._columnSize.height);
        if (this._rows.length < endIndex)return;
        var top = ((this._rows[0].y + this._columnSize.height) + this._row.y);
        var bottom = ((this._rows[this._rows.length - 1].y - this._columnSize.height) + this._row.y);
        var startIndex = Math.floor(Math.abs(((top - this._gridSize.height) / this._columnSize.height) + 1));
        endIndex += startIndex;
        if (this._hideItemEndIndex == 0)this._hideItemEndIndex = endIndex;
        cc.Log("[0] start:" + Math.floor(startIndex) + " ,end:" + Math.floor(endIndex) + " ,length:" + this._rows.length);
        var deviation = this._hideItemStartIndex - startIndex;
        var begin = startIndex - 2 < 0 ? 0 : startIndex - 2;
        var end = startIndex + 1;
        for (var i = begin; i < end; i++) {
            this._IsItemOverflow(this._rows[i]);
        }
        cc.Log("[1] start:" + begin + " ,end:" + end + " ,length:" + this._rows.length);

        var deviation = this._hideItemEndIndex - endIndex;
        end = endIndex + 3 > this._rows.length ? this._rows.length : endIndex + 3;
        begin = endIndex - 1;
        for (var i = begin; i < end; i++) {
            this._IsItemOverflow(this._rows[i]);
        }
        cc.Log("[2] start:" + begin + " ,end:" + end + " ,length:" + this._rows.length);
        this._hideItemStartIndex = startIndex;
        this._hideItemEndIndex = endIndex;
    },
    visit:function (ctx) {
        this._checkOverflow();
        this._super(ctx);
    },
    update:function () {

        if (this._update && this._updateRate == 0) {
            this._update_row();
            this._updateRate = 0;
            this._update = false;
        }
        this._updateRate = (this._updateRate + 1) % 5;
    }
});
Graphic.Component.DataGrid.DataGridView.prototype.__defineSetter__("columns", function (value) {
    var size = [];
    var min = 0, max = 0, deviation = 0;
    for (var i = 0; i < value.length; i++) {
        if (typeof value[i] != "string") {
            size.push(value[i].width);
        } else {
            min = 100 / value.length;
            value[i] = {label:value[i], width:min};
        }
        max += value[i].width;
    }
    min = (this._column._maxSize(value.length) / value.length) / this._column._maxSize(value.length) * 100;
    max = 0;
    for (var i = 0; i < value.length; i++) {
        size[i] = Math.floor(value[i].width / 100 * this._column._maxSize(value.length));
        max += size[i];
    }
    min = ((this._column._maxSize(value.length) - max) / this._column._maxSize(value.length) ) / value.length * 100;
    min = Math.floor(min * 1000) / 1000;

    for (var i = 0; i < value.length; i++) {
        var column;
        if (typeof value[i] == "string") {
            column = this._column.addColumn(value[i]);
        } else {
            column = this._column.addColumn(value[i].label, value[i].width + min, (i == value.length - 1));
        }
    }
    if (this._column.parent == null) {
        this._column.y = this._gridSize.height - this._columnSize.height;
        this.addChild(this._column);
    }
});
Graphic.Component.DataGrid.DataGroup = cc.Class.extend({
    _member:null,
    _name:null,
    ctor:function (groupName) {
        this._member = [];
        this._name = groupName;
    },
    addMember:function (member) {
        if (!member)return;
        member.indexInGroup = this._member.length;
        this._member.push(member);
    },
    removeMember:function (member) {
        cc.ArrayRemoveObject(this._member, member);
    },
    getMembers:function () {
        return this._member;
    }
});
Graphic.Component.DataGrid.Columns = Graphic.Sprite.extend({
    _minWidth:0,
    _maxWidth:0,
    _def_height:0,
    _columns:null,
    __column:null,
    _deviation:0,
    ctor:function (minWidth, maxWidth, height) {
        this._super();
        this._def_height = height;
        if (!height) {
            height = this._def_height = Graphic.Component.DataGrid.defaultColumnHeight;
        }
        this._columns = [];
        this.__column = [];
        this._maxWidth = maxWidth;
        this._minWidth = minWidth;
        this.addEventListener(Graphic.MouseEvent.MOUSE_MOVE, function (evt) {
        });
    },
    addColumn:function (label, width, isLast) {
        if (!width)width = this._minWidth;
        this.__column.push({label:label, width:width});
        if (!isLast) {
            return;
        } else {
            this.initColumns();
            //this.__column = [];
        }
    },
    initColumns:function () {
        this._deviation = this.__column.length * 2;

        for (var i = 0; i < this.__column.length; i++) {
            width = this.__column[i].width;
            label = this.__column[i].label;
            var column = new Graphic.Component.DataGrid.Column(label, this._widthCalc(width), this._def_height);
            column.inColumnWidth = width;
            column.id = label;
            column.x = (this._columns.length == 0) ? 0 : (this._columns[this._columns.length - 1].x + this._columns[this._columns.length - 1].width) - 2;
            column.addEventListener(Graphic.ButtonEvent.BUTTON_CLICK, Graphic.Component.DataGrid.BEGIN_SORT);
            this._columns.push(column);
            this.addChild(column, 0);
        }
    },
    getColumns:function () {
        return this._columns;
    },
    getColumnsID:function () {
        return this.__column;
    },
    _widthCalc:function (value) {
        return Math.floor(value / 100 * (this._maxWidth + this._deviation - 2));
    },
    _maxSize:function (length) {
        return (this._maxWidth + (length * 2) - 2);
    }
});
Graphic.Component.DataGrid.Column = Graphic.Component.SimpleButton.extend({
    inColumnWidth:0,
    label:null,
    ctor:function (label, width, height) {
        this._super(width, height, Graphic.Component.SimpleButton.Default);
        if (!label)label = "";
        this.setText(label);
    },
    setText:function (label) {
        this._super(label);
        this.label = label;
    }
});
Graphic.Component.DataGrid.RowManager = Graphic.Sprite.extend({
    _group:null,
    _index:null,
    _member:null,
    _columnSize:null,
    /*
     *@param {cc.Size} ColumnSize
     */
    ctor:function (ColumnSize) {
        if (!ColumnSize) throw "Initialize is FAIL!";
        this._super();
        this._group = {};
        this._index = [];
        this._columnSize = ColumnSize;
    },
    setParent:function (parent) {
        this._super(parent);
    },
    /*
     *@param {function} func
     */
    sort:function (func) {
        var temp = [];
        this._index = [];
        for (var i = 0; i < this._member.length; i++) {
            this.removeChild(this._member[i]);
            temp.push(this._member[i]);
        }
        for (var i = 0; i < this._member.length; i++) {
            var len = i + 1;
            temp[i].y = ((-this._columnSize.height * (len)) + (2 * len));
            this._index.push(temp[i].index);
            if (func)
                func(this._member[i]);
            this.addChild(temp[i], 0);
        }
    },
    /*
     *@param {Graphic.Component.DataGrid.RowData} defineObject
     */
    addRow:function (defineObject) {
        var row = new Graphic.Component.DataGrid.Rows(Graphic.Component.DataGrid.defaultColumnMinWidth, this._columnSize.width, this._columnSize.height);
        row.__row = defineObject;
        row.initRows();
        row.index = this._member.length;
        this._member.push(row);
        this.addMembers(row, defineObject);
    },
    addGroup:function (GroupName) {
        if (this._group[name])return;
        this._group[name] = new Graphic.Component.DataGroup(GroupName);
    },
    addMembers:function (target, members) {
        for (var i = 0; i < members.length; i++) {
            var group = members[i].type;
            var member = target[group];
            this.addMemberToGroup(group, member);
        }
    },
    addMemberToGroup:function (group, member) {
        if (!this._group[group])this.addGroup(group);
        this._group[group].addMember(member);
    }, getRows:function () {
        return this._member;
    }
});
Graphic.Component.DataGrid.RowData = cc.Class.extend({
    type:null,
    label:null,
    width:null,
    ctor:function (Type, Label, Width) {
        this.type = Type;
        this.label = Label;
        this.width = Width;
    }
});
Graphic.Component.DataGrid.Rows = Graphic.Sprite.extend({
    _minWidth:0,
    _maxWidth:0,
    _def_height:0,
    __row:null,
    _deviation:0,
    index:null,
    ctor:function (minWidth, maxWidth, height) {
        this._super();
        this._def_height = height;
        if (!height) {
            height = this._def_height = Graphic.Component.DataGrid.defaultColumnHeight;
        }
        this.__row = [];
        this._maxWidth = maxWidth;
        this._minWidth = minWidth;
        this.addEventListener(Graphic.MouseEvent.MOUSE_MOVE, function (evt) {
        });
    },
    addRow:function (label, width, isLast) {
        if (!width)width = this._minWidth;
        this.__row.push({label:label, width:width});
        if (!isLast) {
            return;
        } else {
            this.initRows();
            //this.__row = [];
        }
    },
    initRows:function () {
        this._deviation = this.__row.length * 2;
        var preRow;
        for (var i = 0; i < this.__row.length; i++) {
            width = this.__row[i].width;
            label = this.__row[i].label;
            var row = new Graphic.Component.DataGrid.Row(label, this._widthCalc(width), this._def_height);
            row.inColumnWidth = width;
            row.x = (!preRow) ? 0 : (preRow.x + preRow.width) - 2;
            this[this.__row[i].type] = row;
            this.addChild(row, 0);
            preRow = row;
        }

    },
    getRows:function () {
        return this._rows;
    },
    _widthCalc:function (value) {
        return Math.floor(value / 100 * (this._maxWidth + this._deviation - 2));
    }
});
Graphic.Component.DataGrid.Row = Graphic.Component.SimpleButton.extend({
    inColumnWidth:0,
    label:null,
    index:null,
    indexInGroup:null,
    ctor:function (label, width, height) {
        this._super(width, height, Graphic.Component.SimpleButton.General);
        if (!label)label = "";
        this.setText(label);
    },
    setText:function (label) {
        this._super(label);
        this.label = label;
    }
});
Graphic.Component.DataGrid.defaultWidth = 314;
Graphic.Component.DataGrid.defaultHeight = 314;
Graphic.Component.DataGrid.defaultColumnMinWidth = 20;
Graphic.Component.DataGrid.defaultColumnMaxWidth = 50;
Graphic.Component.DataGrid.defaultColumnWidth = Graphic.Component.DataGrid.defaultWidth;
Graphic.Component.DataGrid.defaultColumnHeight = 32;