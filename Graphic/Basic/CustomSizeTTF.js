/**
 * Created with JetBrains WebStorm.
 * User: Locke
 * Date: 2012/8/6
 * Time: 上午 9:25
 * To change this template use File | Settings | File Templates.
 */
var Graphic = Graphic = Graphic || {};

Graphic.CustomSizeTTF = cc.LabelTTF.extend({
    _offsetX:0,
    _offsetY:0,
    _textIndex:0,
    _textTable:[],
    _textKey:{},
    /**
     * renders the label
     * @param {CanvasContext|Null} ctx
     */
    /**
     * Prints out a description of this class
     * @return {String}
     */
    description:function () {
        return "";// "<cc.LabelTTF | FontName =" + this._fontName + " FontSize = " + this._fontSize.toFixed(1) + ">";
    },
    addText:function (text, font, size, color) {
        var new_text = new Graphic.CustomSizeTTF.TTF_TYPE();
        new_text.initWithString(arguments);
        this._textKey[text] = this._textTable.length;
        this._textTable.push(new_text);

        this.setFontColor(color, text);
    },
    setText:function (old_text, text, font, size, color) {
        var index = this._textKey[old_text];
        var new_text = this._textTable[index];
        this._textKey[text] = index;
        new_text.update(new_text._dimensions, new_text._hAlignment, new_text._vAlignment, font, size, text, new_text._fontStyleStr);
        this.setFontColor(color, text);
    },
    setTextByIndex:function (index, text, font, size, color) {
        //var index = this._textKey[old_text];
        var new_text = this._textTable[index];
        this._textKey[text] = index;
        new_text.update(new_text._dimensions, new_text._hAlignment, new_text._vAlignment, font, size, text, new_text._fontStyleStr);
        this.setFontColor(color, text);
    },
    getTextIndex:function (text) {
        return this._textKey[text];
    },
    /**
     * changes the string to render
     * @warning Changing the string is as expensive as creating a new cc.LabelTTF. To obtain better performance use cc.LabelAtlas
     * @param {String} string text for the label
     */
    setString:function (string, text) {
        var index = this._textKey[text];
        text = this._textTable[index];
        if (text._string != string) {
            text._string = string;

            // Force update
            if (text._string.length > 0) {
                this._updateTTF(index);
            }
        }
    },

    /**
     * returns the text of the label
     * @return {String}
     */
    getString:function (text) {
        var index = this._textKey[text];
        text = this._textTable[index];
        return text._string;
    },
    getStringByIndex:function (index) {
        return this._textTable[index]._string;
    },
    getHorizontalAlignment:function (text) {
        var index = this._textKey[text];
        text = this._textTable[index];
        return text._hAlignment;
    },

    setHorizontalAlignment:function (alignment, text) {
        var index = this._textKey[text];
        text = this._textTable[index];
        if (text._hAlignment != alignment) {
            text._hAlignment = alignment;

            // Force update
            if (text._string.length > 0) {
                this._updateTTF(index);
            }
        }
    },

    getVerticalAlignment:function (text) {
        var index = this._textKey[text];
        text = this._textTable[index];
        return text._vAlignment;
    },

    setVerticalAlignment:function (verticalAlignment, text) {
        var index = this._textKey[text];
        text = this._textTable[index];
        if (text._vAlignment != verticalAlignment) {
            text._vAlignment = verticalAlignment;

            // Force update
            if (text._string.length > 0) {
                this._updateTTF(index);
            }
        }
    },

    getDimensions:function (text) {
        var index = this._textKey[text];
        text = this._textTable[index];
        return text._dimensions;
    },

    setDimensions:function (dim, text) {
        var index = this._textKey[text];
        text = this._textTable[index];
        if (dim.width != text._dimensions.width || dim.height != text._dimensions.height) {
            text._dimensions = dim;

            // Force udpate
            if (text._string.length > 0) {
                this._updateTTF(index);
            }
        }
    },

    getFontSize:function (text) {
        var index = this._textKey[text];
        text = this._textTable[index];
        return text._fontSize;
    },

    setFontSize:function (fontSize, text) {
        var index = this._textKey[text];
        text = this._textTable[index];
        if (text._fontSize != fontSize) {
            text._fontSize = fontSize;

            // Force update
            if (text._string.length > 0) {
                this._updateTTF(index);
            }
        }
    },
    setFontColor:function (fontColor, text) {
        var index = this._textKey[text];
        text = this._textTable[index];
        if (text._color != fontColor) {
            text._color = fontColor;

            // Force update
            if (text._string.length > 0) {
                this._updateTTF(index);
            }
        }
    },
    getFontName:function (text) {
        var index = this._textKey[text];
        text = this._textTable[index];
        return text._fontName;
    },

    setFontName:function (fontName, text) {
        var index = this._textKey[text];
        text = this._textTable[index];

        if (text._fontName != fontName) {
            text._fontName = new String(fontName);
            // Force update
            if (text._string.length > 0) {
                this._updateTTF(index);
            }
        }
    },
    draw:function (ctx) {
        var index = 0;
        var shift = this._offsetX;
        do {
            var text = this._textTable[index++];
            if (cc.renderContextType == cc.CANVAS) {
                var context = ctx || cc.renderContext;
                if (this._flipX) {
                    context.scale(-1, 1);
                }
                if (this._flipY) {
                    context.scale(1, -1);
                }
                //this is fillText for canvas
                context.fillStyle = "rgba(" + text._color.r + "," + text._color.g + "," + text._color.b + ", " + this._opacity / 255 + ")";

                if (context.font != text._fontStyleStr)
                    context.font = text._fontStyleStr;
                context.textBaseline = "bottom";

                var xOffset = 0, yOffset = 0;
                switch (text._hAlignment) {
                    case cc.TEXT_ALIGNMENT_LEFT:
                        context.textAlign = "left";
                        xOffset = 0;
                        break;
                    case cc.TEXT_ALIGNMENT_RIGHT:
                        context.textAlign = "right";
                        xOffset = text._dimensions.width;
                        break;
                    case cc.TEXT_ALIGNMENT_CENTER:
                        context.textAlign = "center";
                        xOffset = text._dimensions.width / 2;
                        break;
                    default:
                        break;
                }

                switch (text._vAlignment) {
                    case cc.VERTICAL_TEXT_ALIGNMENT_TOP:
                        context.textBaseline = "top";
                        yOffset = -text._dimensions.height;
                        break;
                    case cc.VERTICAL_TEXT_ALIGNMENT_CENTER:
                        context.textBaseline = "middle";
                        yOffset = -text._dimensions.height / 2;
                        break;
                    case cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM:
                        context.textBaseline = "bottom";
                        yOffset = 0;
                        break;
                    default:
                        break;
                }

                if (text._dimensions.width == 0) {
                    context.fillText(text._string, -text._contentSize.width * text._anchorPoint.x + shift, text._contentSize.height * text._anchorPoint.y + this._offsetY);
                    shift += text._contentSize.width;
                }
                else {
                    context.fillText(text._string,
                        -text._dimensions.width * text._anchorPoint.x + xOffset,
                        text._dimensions.height * text._anchorPoint.y + yOffset);
                }
            }
        } while (index < this._textTable.length);
    },
    _updateTTF:function (index) {
        var text = this._textTable[index];
        cc.renderContext.save();
        text._fontStyleStr = text._fontSize + "px '" + text._fontName + "'";
        cc.renderContext.font = text._fontStyleStr;
        var dim = cc.renderContext.measureText(text._string);
        text.setContentSize(new cc.Size(dim.width, text._fontSize));
        cc.renderContext.restore();
        this._updateOffset();
        this.setNodeDirty();
    },
    _updateOffset:function () {
        var index = 0;
        var shift = 0;
        var y = 0;
        do {
            var text = this._textTable[index++];
            shift += text._contentSize.width;
            if (y < text._contentSize.height)y = text._contentSize.height;
        } while (index < this._textTable.length);
        this._offsetX = -shift / 2;
        this._offsetY = y / 2;
    }
});
Graphic.CustomSizeTTF.TTF_TYPE = cc.Class.extend({
    _dimensions:cc.SizeZero(),
    _hAlignment:cc.TEXT_ALIGNMENT_CENTER,
    _vAlignment:cc.VERTICAL_TEXT_ALIGNMENT_TOP,
    _fontName:"Arial",
    _fontSize:0.0,
    _string:"",
    _fontStyleStr:null,
    _color:cc.ccc3(),
    _opacity:255,
    _contentSize:null,
    _anchorPointInPoints:cc.PointZero(),
    _anchorPoint:cc.PointZero(),
    ctor:function () {

    },
    /**
     * initializes the cc.LabelTTF with a font name, alignment, dimension and font size
     * @param {String} string
     * @param {cc.Size} dimensions
     * @param {cc.TEXT_ALIGNMENT_LEFT|cc.TEXT_ALIGNMENT_CENTER|cc.TEXT_ALIGNMENT_RIGHT} alignment
     * @param {String} fontName
     * @param {Number} fontSize
     * @return {Boolean} return false on error
     */
    initWithString:function (arg) {
        var string = arg[0], dimensions, hAlignment, vAlignment, fontName, fontSize;
        cc.Assert(string != null, "cc.LabelTTF.initWithString() label is null");
        if (arg.length == 6) {
            dimensions = arg[1];
            hAlignment = arg[2];
            vAlignment = arg[3];
            fontName = arg[4];
            fontSize = arg[5];
        }
        else if (arg.length == 5) {
            dimensions = arg[1];
            hAlignment = arg[2];
            vAlignment = cc.VERTICAL_TEXT_ALIGNMENT_TOP;
            fontName = arg[3];
            fontSize = arg[4];
        }
        else {
            dimensions = cc.SizeMake(0, arg[2]);
            hAlignment = cc.TEXT_ALIGNMENT_LEFT;
            vAlignment = cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM;
            fontName = arg[1];
            fontSize = arg[2];
        }
        // if (this.init(true)) {

        this._dimensions = cc.SizeMake(dimensions.width, dimensions.height);
        this._fontName = fontName;
        this._hAlignment = hAlignment;
        this._vAlignment = vAlignment;
        this._fontSize = fontSize * cc.CONTENT_SCALE_FACTOR();
        this._string = (string);
        this._fontStyleStr = this._fontSize + "px '" + this._fontName + "'";
        //return true;
        //}
        //return false;
    },
    setContentSize:function (size) {
        this._contentSize = size;

        this._anchorPointInPoints = new cc.Point(this._contentSize.width * this._anchorPoint.x,
            this._contentSize.height * this._anchorPoint.y);
    },
    update:function (dim, h, v, fontName, fontSize, sting, style) {
        this._dimensions = dim;
        this._hAlignment = h;
        this._vAlignment = v;
        this._fontName = fontName;
        this._fontSize = fontSize;
        this._string = sting;
        this._fontStyleStr = style;
    }
});