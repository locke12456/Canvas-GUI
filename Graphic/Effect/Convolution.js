/**
 * Created with JetBrains WebStorm.
 * User: Locke
 * Date: 2012/6/19
 * Time: 下午 3:30
 * To change this template use File | Settings | File Templates.
 */
var Graphic = Graphic = Graphic || {};
Graphic.Effect = cc.Class.extend({
    ctor:function () {

    }
});
Graphic.Effect.Bevel = {
    /* 斜角效果 */
    matrix:[0, 0, 0,
        0, 0, 0,
        0, 0 , 1],
    divisor:1,
    offset:0
};
Graphic.Effect.vBevel = {
    /* 斜角效果 */
    matrix:[1, 0, 0,
        0, 0, 0,
        0, 0, 0],
    divisor:1,
    offset:0
};
Graphic.Effect.embossing = {
    /* 浮雕效果 */
    matrix:[-2, -1, 0,
        -1, 1, 1,
        0, 1, 2],
    divisor:1,
    offset:0
};
Graphic.Effect.edge = {
    /* 邊緣檢測 */
    matrix:[
        0, -1, 0,
        -1, 4, -1,
        0, -1, 0],
    divisor:1,
    offset:0
},
    Graphic.Effect.sharpening = {
        /* 锐化 */
        matrix:[
            0, -1, 0,
            -1, 5, -1,
            0, -1, 0],
        divisor:1,
        offset:0
    };
Graphic.Effect.blur = {
    /* 基本模糊 */
    matrix:[0, 1, 0,
        1, 1, 1,
        0, 1, 0],
    divisor:5,
    offset:0
};
Graphic.Effect.Convolution = function (ctx, imgPixels, filter, minAlpha) {
    if (!minAlpha)minAlpha = 0;
    var matrix = filter.matrix, divisor = filter.divisor, offset = filter.offset;
    var w = imgPixels.width,
        h = imgPixels.height,
        d = imgPixels.data;
    var newImgPixels = ctx.createImageData(w, h);
    for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
            for (var c = 0; c < 3; c++) {//rgb

                var i = (y * w + x) * 4 + c;
                newImgPixels.data[i] = (matrix[0] * d[i - (w + 1) * 4] + matrix[1] * d[i - w * 4] + matrix[2] * d[i - (w - 1) * 4]
                    + matrix[3] * d[i - 4] + matrix[4] * d[i] + matrix[5] * d[i + 4]
                    + matrix[6] * d[i + (w - 1) * 4] + matrix[7] * d[i + w * 4] + matrix[8] * d[i + (w + 1) * 4])
                    / divisor + offset;
            }
            //alpha
            var alpha = d[(y * w + x) * 4 + 3];
            newImgPixels.data[(y * w + x) * 4 + 3] = alpha < minAlpha ? alpha : 255;
        }
    }
    return newImgPixels;
}
Graphic.Effect.BevelFilter = function (ctx, imgPixels, xoffset, yoffset, minAlpha) {
    if (!minAlpha)minAlpha = 0;
    var filter = Graphic.Effect.Bevel;
    var matrix = filter.matrix, divisor = filter.divisor, offset = filter.offset;
    var w = imgPixels.width,
        h = imgPixels.height,
        width = w - Math.floor(w * xoffset),
        height = h - Math.floor(h * yoffset),
        d = imgPixels.data;
    var newImgPixels = ctx.createImageData(w, h);
    for (var y = 1; y < h - 1; y++) {
        for (var x = 1; x < w - 1; x++) {
            for (var c = 0; c < 3; c++) {//rgb

                var i = (y * w + x) * 4 + c;
                if (x >= width && y >= height) {
                    newImgPixels.data[i] = (matrix[0] * d[i - (w + 1) * 4] + matrix[1] * d[i - w * 4] + matrix[2] * d[i - (w - 1) * 4]
                        + matrix[3] * d[i - 4] + matrix[4] * d[i] + matrix[5] * d[i + 4]
                        + matrix[6] * d[i + (w - 1) * 4] + matrix[7] * d[i + w * 4] + matrix[8] * d[i + (w + 1) * 4])
                        / divisor + offset;
                } else newImgPixels.data[i] = d[i];
            }
            //alpha
            var alpha = d[(y * w + x) * 4 + 3];
            newImgPixels.data[(y * w + x) * 4 + 3] = alpha < minAlpha ? alpha : 255;
        }
    }
    return newImgPixels;
}