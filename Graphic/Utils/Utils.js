/**
 * Created with JetBrains WebStorm.
 * User: Locke
 * Date: 2012/6/20
 * Time: 上午 9:17
 * To change this template use File | Settings | File Templates.
 */
var Graphic = Graphic = Graphic || {};
Graphic.Utils = {};
Graphic.Utils.SpriteToImageData = function (sprite) {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    var w = sprite._contentSize.width;
    var h = sprite._contentSize.height;
    canvas.width = w;
    canvas.height = h;
    sprite.draw(ctx);
    return ctx.getImageData(0, 0, w, h);
};
Graphic.Utils.CreateCanvas = function (width, height) {
    var w = width;
    var h = height;
    var textureCache = [];
    var canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext("2d");
    return ctx;
};
Graphic.Utils.CreateTextureDraw = function (texture) {
    var w = texture.width;
    var h = texture.height;
    var textureCache = [];

    var canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(texture, 0, 0);
    return ctx;
};
Graphic.Utils.CreateImageData = function (texture) {
    var w = texture.canvas.width;
    var h = texture.canvas.height;
    return texture.getImageData(0, 0, w, h);
};
Graphic.Utils.TextureToImageData = function (texture) {
    var w = texture.width;
    var h = texture.height;
    var textureCache = [];

    var canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(texture, 0, 0);

    return ctx.getImageData(0, 0, w, h);
};
Graphic.Utils.CutTexture = function (texture, x, y, w, h) {
    var _w = texture.width;
    var _h = texture.height;
    var textureCache = [];

    var canvas = document.createElement("canvas");
    canvas.width = _w;
    canvas.height = _h;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(texture, 0, 0);

    return ctx.getImageData(x, y, w, h);
};
Graphic.Utils.SetTextureBackgroundSize = function (texture, w, h) {
    var _w = texture.width;
    var _h = texture.height;
    var x = w / 2 - _w / 2;
    var y = h / 2 - _h / 2;
    var textureCache = [];

    var canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;

    var ctx = canvas.getContext("2d");
    Graphic.Utils.FillRect(ctx, cc.RectMake(0, 0, w, h), cc.ccc4(0, 0, 0, 0));
    ctx.drawImage(texture, x, y);

    return canvas;//Graphic.Utils.ImageDatasToTexture(ctx.getImageData(0, 0, w, h));
}
Graphic.Utils.ImageDatasToTexture = function (image, rect) {
    if (!rect) {
        rect = new cc.Rect();
        rect.size = new cc.Size(image.width, image.height);
    }
    var buff = document.createElement("canvas");
    buff.width = rect.size.width;
    buff.height = rect.size.height;
    var ctx = buff.getContext("2d");

    //ctx.drawImage(image.data, rect.origin.x, rect.origin.y, rect.size.width, rect.size.height, 0, 0, rect.size.width, rect.size.height);
    ctx.putImageData(image, 0, 0, 0, 0, image.width, image.height);
    return buff;
};
Graphic.Utils.FillRect = function (ctx, rect, color, Gradient, color_array) {
    var tGradient = Graphic.Utils.Gradient.MakeGradient(Gradient, ctx, rect);
    tGradient.addColorStop(0, "rgba(" + color.r + "," + color.g + ","
        + color.b + "," + color.a / 255 + ")");
    if (color_array) {
        var numColor = 1 / color_array.length;
        for (var i = 0; i < color_array.length; i++) {
            color = color_array[i];
            tGradient.addColorStop((i + 1) * numColor, "rgba(" + color.r + "," + color.g + ","
                + color.b + "," + color.a / 255 + ")");
        }
    }
    ctx.fillStyle = tGradient;
    ctx.fillRect(rect.origin.x, rect.origin.y, rect.size.width, rect.size.height);
};
Graphic.Utils.GradientTexture = function (size, color, Gradient, color_array) {
    var canvas = document.createElement("canvas");
    canvas.width = size.width;
    canvas.height = size.height;
    var ctx = canvas.getContext("2d");
    Graphic.Utils.FillRect(ctx, cc.RectMake(0, 0, size.width, size.height), color, Gradient, color_array);
    return canvas;
};
Graphic.Utils.DrawTexture = function (ctx, texture, x, y) {
    ctx.drawImage(texture, 0, 0);
};
Graphic.Utils.DrawPoly = function (ctx, vertices, line, color, numOfVertices, closePolygon, fill) {
    if (fill == 'undefined') {
        fill = false;
    }

    if (vertices == null) {
        return;
    }
    if (vertices.length < 3) {
        throw new Error("Polygon's point must greater than 2");
    }
    ctx.strokeStyle = "rgba(" + color.r + "," + color.g + ","
        + color.b + "," + color.a / 255 + ")";
    ctx.lineWidth = line;
    var firstPoint = vertices[0];
    ctx.beginPath();
    ctx.moveTo(firstPoint.x * cc.CONTENT_SCALE_FACTOR(), -firstPoint.y * cc.CONTENT_SCALE_FACTOR());
    for (var i = 1; i < vertices.length; i++) {
        ctx.lineTo(vertices[i].x * cc.CONTENT_SCALE_FACTOR(), -vertices[i].y * cc.CONTENT_SCALE_FACTOR());
    }
    if (closePolygon) {
        ctx.closePath();
    }

    if (fill) {
        ctx.fill();
    } else {
        ctx.stroke();
    }
};
Graphic.Utils.Gradient = Graphic.Utils.Gradient || {};
Graphic.Utils.Gradient.MakeGradient = function (gradient, ctx, rect) {
    return gradient != undefined ? gradient.MAKE(ctx, rect) : Graphic.Utils.Gradient.RectTo.MAKE(ctx, rect);
};
Graphic.Utils.Gradient.RectTo =
{
    TYPE:0,
    MAKE:function (ctx, rect) {
        return ctx.createLinearGradient(rect.origin.x, rect.size.height, rect.origin.x + rect.size.width, (rect.origin.y + rect.size.height));
    }
};
Graphic.Utils.Gradient.RectFrom =
{
    TYPE:0,
    MAKE:function (ctx, rect) {
        return ctx.createLinearGradient(rect.origin.x + rect.size.width, (rect.origin.y + rect.size.height), rect.origin.x, rect.size.height);
    }
};

Graphic.Utils.Gradient.RectVTo =
{
    TYPE:0,
    MAKE:function (ctx, rect) {
        return ctx.createLinearGradient(rect.origin.x, rect.origin.y, rect.origin.x, (rect.origin.y + rect.size.height));
    }
};
Graphic.Utils.Gradient.RectVFrom =
{
    TYPE:0,
    MAKE:function (ctx, rect) {
        return ctx.createLinearGradient(rect.origin.x, rect.origin.y + rect.size.height, rect.origin.x, (rect.origin.y));
    }
};
Graphic.Utils.Gradient.RectLU =
{
    TYPE:0,
    MAKE:function (ctx, rect) {
        return ctx.createLinearGradient(rect.origin.x, rect.origin.y, rect.origin.x + rect.size.width, (rect.origin.y + rect.size.height));
    }
};
Graphic.Utils.Gradient.RectLD =
{
    TYPE:0,
    MAKE:function (ctx, rect) {
        return ctx.createLinearGradient(rect.origin.x, rect.origin.y + rect.size.height, rect.origin.x + rect.size.width, (rect.origin.y ));
    }
};
Graphic.Utils.Gradient.RectRU =
{
    TYPE:0,
    MAKE:function (ctx, rect) {
        return ctx.createLinearGradient(rect.origin.x + rect.size.width, rect.origin.y, rect.origin.x, (rect.origin.y + rect.size.height));
    }
};
Graphic.Utils.Gradient.RectRD =
{
    TYPE:0,
    MAKE:function (ctx, rect) {
        return ctx.createLinearGradient(-rect.origin.x + rect.size.width, (rect.origin.y + rect.size.height), rect.origin.x, -rect.size.height);
    }
};
Graphic.Utils.Gradient.RadialCenter =
{
    TYPE:1,
    MAKE:function (ctx, rect) {
        return ctx.createRadialGradient(rect.size.width / 2, rect.size.height / 2, 0, (rect.size.width + rect.size.height) / 2, (rect.size.width + rect.size.height) / 2, (rect.size.width + rect.size.height) / 2);
    }
};