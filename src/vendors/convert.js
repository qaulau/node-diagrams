const async = require('async');
const WH_UNITS = ['pt','px','in','mm','cm', 'ex'];


/**
 * SVG 转换 PNG
 * @param source    SVGElement
 */
var svg_convert_png = function (svg, callback) {
    let source = null;
    if(svg instanceof SVGElement){
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        source = svg.outerHTML;
    }else{
        source = svg;
    }
    if(!source){
        callback(null);
        return null;
    }
    console.log('svg_convert_png');
    let data = null, image = new Image();
    image.src = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(source)));
    image.onload = function() {
        var canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        var context = canvas.getContext('2d');
        context.drawImage(image, 0, 0);
        data = canvas.toDataURL('image/png');
        callback(data, svg);
    };
    image.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
        console.log('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber
            + ' Column: ' + column + ' StackTrace: ' +  errorObj);
        callback(null);
    }
};


/**
 * SVG 转换
 * @param svglist   SvgElement对象
 * @returns {*}
 */
var svg_convert = function (svglist, png, callback) {
    var output = { svg: "", img: ""};
    if(svglist && (svglist instanceof HTMLElement)){
        svglist = [svglist];
    }else if(!svglist || !(svglist instanceof HTMLCollection)){
        return output;
    }
    if(typeof callback == 'undefined'){
        callback = png;
        png = false;
    }
    if(svglist.length > 1){
        let img = null, width = 0.0, height = 0.0, source = '';
        async.mapValues(svglist, function(val, key, taskcall){
            width += val.width.baseVal.value;
            if(png) {
                svg_convert_png(val, function (data) {
                    let svg_width = val.width.baseVal.valueAsString,
                        svg_height = val.height.baseVal.valueAsString;
                    img = '<image x="0" y="' + height + '" width="' + svg_width + '" height="' + svg_height + '" xlink:href="' + data + '" />';
                    source += img;
                    height += val.height.baseVal.value + 10;
                    taskcall(null);
                });
            }else{
                if(val instanceof SVGElement) {
                    val.setAttribute("xmlns", "http://www.w3.org/2000/svg");
                    source += val.outerHTML;
                }else{
                    source += val;
                }
                taskcall(null);
            }
        }, function (err, results) {
            if(png) {
                img = '<svg xmlns="http://www.w3.org/2000/svg" '
                    + 'xmlns:xlink="http://www.w3.org/1999/xlink" '
                    + 'width="' + width + '" height="' + height + '">';
                img += source + '</svg>';
            }else{
                img = source;
            }
            output.svg = img;
            if(err){
                return callback(output);
            }
            if(png) {
                svg_convert_png(output.svg, function (data) {
                    output.img = data;
                    callback(output);
                });
            }else{
                callback(output);
            }
        });
    }else{
        if(svglist[0] instanceof SVGElement) {
            svglist[0].setAttribute("xmlns", "http://www.w3.org/2000/svg");
            output.svg = svglist[0].outerHTML;
        }else{
            output.svg = svglist[0].innerHTML;
        }
        if(png) {
            svg_convert_png(svglist[0], function (data) {
                output.img = data;
                callback(output);
            });
        }else{
            callback(output);
        }
    }
};

module.exports.svg_convert = svg_convert;