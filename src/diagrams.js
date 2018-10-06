const path = require('path');
const proc = require('child_process');
const electron = require('electron');
const root = path.dirname(__dirname), render = path.join(root, 'src/render');
const diagram_types = ['flowchart', 'sequence', 'mathjax', 'mermaid'];

/**
 * 绘制图形
 * @param text
 * @param imgtype
 * @param png
 */
var drawnDiagram = function(text, options){
    var default_options = {
        png: false,
        timeout: 5000,
        type: 'flowchart',
        debug: false,
        default: null
    };
    if(typeof options == 'undefined'){
        options = {};
    }else if(typeof options == 'string'){
        options = {type: options};
    }else if(typeof options == 'number'){
        options = {timeout: options};
    }else if(typeof options == 'boolean'){
        options = {'png': options};
    }
    options = Object.assign(default_options, options);
    if(diagram_types.indexOf(options['type']) == -1){
        return options['default'];
    }
    let child = proc.spawnSync(electron, [
        path.resolve(render, 'electron-web.js'),
        JSON.stringify(options),
        JSON.stringify(text)
    ]);
    let out = child.stdout.toString('utf8'), data = null;
    if(options.debug) {
        console.log('[out]', out);
    }
    try {
        out = JSON.parse(out);
    }catch (e) {
        out = {'code': 0};
    }
    if(out.code != 1){
        return options['default'];
    }
    if(typeof text == 'string' || text.hasOwnProperty('text')){
        data = out.data[0];
    }else{
        data = out.data;
    }
    return data ? data : options['default'];
};
module.exports.drawn = drawnDiagram;


/**
 * 绘制流程图
 * @param text
 * @param options
 * @returns {*}
 */
module.exports.drawnFlowchart = function (text, options) {
    options = options || {};
    options['type'] = 'flowchart';
    return drawnDiagram(text, options);
};


/**
 * 绘制序列图
 * @param text
 * @param options
 * @returns {*}
 */
module.exports.drawnSequence = function (text, options) {
    options = options || {};
    options['type'] = 'sequence';
    return drawnDiagram(text, options);
};


/**
 * 绘制数学符号公式
 * @param text
 * @param options
 * @returns {*}
 */
module.exports.drawnMathjax = function (text, options) {
    options = options || {};
    options['type'] = 'mathjax';
    return drawnDiagram(text, options);
};

/**
 * mernaid库相关图形绘制
 * @param text
 * @param options
 * @returns {*}
 */
module.exports.drawnMermaid = function (text, options) {
    options = options || {};
    options['type'] = 'mermaid';
    return drawnDiagram(text, options);
};