/**
 * Created with JetBrains WebStorm.
 * User: Locke
 * Date: 2012/6/20
 * Time: 上午 9:17
 * To change this template use File | Settings | File Templates.
 */
var Graphic = Graphic = Graphic || {};
Graphic.Utils = {};
/**
 * Given the parameter object passed to this special property, return an array listing the properties that should be modified, and their parameters
 *
 * @param        p_obj                Object        Parameter passed to this property
 * @return                            Array        Array listing name and parameter of each property
 */
Graphic.Utils.bezier_modifier = function (p_obj) {
    var mList = []; // List of properties to be modified
    var pList; // List of parameters passed, normalized as an array
    if (typeof p_obj == Array) {
        // Complex
        pList = p_obj;
    } else {
        pList = [p_obj];
    }

    var i;
    var istr;
    var mListObj = {}; // Object describing each property name and parameter

    for (i = 0; i < pList.length; i++) {
        for (istr in pList[i]) {
            if (mListObj[istr] == undefined) mListObj[istr] = [];
            mListObj[istr].push(pList[i][istr]);
        }
    }
    for (istr in mListObj) {
        mList.push({name:istr, parameters:mListObj[istr]});
    }
    return mList;
}
/**
 * Given tweening specifications (beging, end, t), applies the property parameter to it, returning new t
 *
 * @param        {cc.Point}               b                    Beginning value of the property
 * @param        {cc.Point}               e                    Ending (desired) value of the property
 * @param        {Array}                   p                    Array of parameters passed to this specific property
 * @return        {Array}                                      New t, with the p parameters applied to it
 */
Graphic.Utils.bezier_Make = function (b, e, p) {
    var startX = b.x;
    var startY = b.y;
    var endX, endY;
    var thisPoint;
    var nextPoint;
    var Points = [];
    for (i = 0; i < p.length - 1; i++) {
        thisPoint = p[i];
        nextPoint = p[i + 1];
        endX = (thisPoint.x + nextPoint.x) / 2;
        endY = (thisPoint.y + nextPoint.y) / 2;
        // Draw curve points for reference
        Points = Graphic.Utils.BezierCurvePoints(startX, startY, thisPoint.x, thisPoint.y, endX, endY, Points);
        startX = endX;
        startY = endY;
    }
    if (p.length > 0) {
        // Normal curve
        var lastPoint = p[p.length - 1];
        Points = Graphic.Utils.BezierCurvePoints(startX, startY, lastPoint.x, lastPoint.y, e.x, e.y, Points);
    }
    return Points;
};
/**
 * Given tweening specifications (beging, end, t), applies the property parameter to it, returning new t
 *
 * @param        {cc.Point}               b                    Beginning value of the property
 * @param        {cc.Point}               e                    Ending (desired) value of the property
 * @param        {Number}           t                    Current t of this tweening (0-1), after applying the easing equation
 * @param        {Array}               p                    Array of parameters passed to this specific property
 * @return        {cc.Point}                                      New t, with the p parameters applied to it
 */
Graphic.Utils.bezier_get_point = function (b, e, t, p) {
    // This is based on Robert Penner's code
    if (p.length == 1) {
        // Simple curve with just one bezier control point
        var x = b.x + t * (2 * (1 - t) * (p[0].x - b.x) + t * (e.x - b.x));
        var y = b.y + t * (2 * (1 - t) * (p[0].y - b.y) + t * (e.y - b.y));
        return cc.ccp(x, y);
    } else {
        // Array of bezier control points, must find the point between each pair of bezier points
        var ip = Math.floor(t * p.length); // Position on the bezier list
        var it = (t - (ip * (1 / p.length))) * p.length; // t inside this ip
        var p1, p2;
        var par = ["x", "y"];
        var point = [];
        for (var i = 0; i < par.length; i++) {
            if (ip == 0) {
                // First part: belongs to the first control point, find second midpoint
                p1 = b[par[i]];
                p2 = (p[0][par[i]] + p[1][par[i]]) / 2;
            } else if (ip == p.length - 1) {
                // Last part: belongs to the last control point, find first midpoint
                p1 = (p[ip - 1][par[i]] + p[ip][par[i]]) / 2;
                p2 = e[par[i]];
            } else {
                // Any middle part: find both midpoints
                p1 = (p[ip - 1][par[i]] + p[ip][par[i]]) / 2;
                p2 = (p[ip][par[i]] + p[ip + 1][par[i]]) / 2;
            }
            point[i] = p1[par[i]] + it * (2 * (1 - it) * (p[ip][par[i]] - p1[par[i]]) + it * (p2[par[i]] - p1[par[i]]));
        }
        return cc.ccp(point[0], point[1]);
    }
};
/**
 * Given tweening specifications (beging, end, t), applies the property parameter to it, returning new t
 *
 * @param        {Number}        b                    Beginning value of the property
 * @param        {Number}        e                    Ending (desired) value of the property
 * @param        {Number}        t                    Current t of this tweening (0-1), after applying the easing equation
 * @param        {Array}               p                    Array of parameters passed to this specific property
 * @return        {Number}                            New t, with the p parameters applied to it
 */
Graphic.Utils.bezier_get = function (b, e, t, p) {
    // This is based on Robert Penner's code
    if (p.length == 1) {
        // Simple curve with just one bezier control point
        return b + t * (2 * (1 - t) * (p[0] - b) + t * (e - b));
    } else {
        // Array of bezier control points, must find the point between each pair of bezier points
        var ip = Math.floor(t * p.length); // Position on the bezier list
        var it = (t - (ip * (1 / p.length))) * p.length; // t inside this ip
        var p1, p2;
        if (ip == 0) {
            // First part: belongs to the first control point, find second midpoint
            p1 = b;
            p2 = (p[0] + p[1]) / 2;
        } else if (ip == p.length - 1) {
            // Last part: belongs to the last control point, find first midpoint
            p1 = (p[ip - 1] + p[ip]) / 2;
            p2 = e;
        } else {
            // Any middle part: find both midpoints
            p1 = (p[ip - 1] + p[ip]) / 2;
            p2 = (p[ip] + p[ip + 1]) / 2;
        }
        return p1 + it * (2 * (1 - it) * (p[ip] - p1) + it * (p2 - p1));
    }
};
Graphic.Utils.BezierCurvePoints = function (px1, py1, cx, cy, px2, py2, Points) {
    // Draws points on curves
    var i;
    Points = Points || [];
    for (i = 0; i < 1; i += 1 / 10) {
        var pt = Graphic.Utils.Bezier(px1, py1, cx, cy, px2, py2, i);
        Points.push(pt);
    }
    return Points;
}
// http://ibiblio.org/e-notes/Splines/Bezier.htm
Graphic.Utils.Bezier = function (p1x, p1y, cx, cy, p2x, p2y, t) {
    // Returns the points on a bezier curve for a given time (t is 0-1);
    // This is based on Robert Penner's Math.pointOnCurve() function
    // More information: http://actionscript-toolbox.com/samplemx_pathguide.php
    return {x:p1x + t * (2 * (1 - t) * (cx - p1x) + t * (p2x - p1x)),
        y:p1y + t * (2 * (1 - t) * (cy - p1y) + t * (p2y - p1y))};
    // Quadratic Bezier spline
};
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