const fs = require('fs');
const electron = require('electron');
const path = require('path');


const app = electron.app, BrowserWindow = electron.BrowserWindow, ipc = electron.ipcMain;
var mainWindow = null;

var process_send = function(data, code){
    if(typeof code == 'undefined'){
        code = 0;
    }
    if(typeof data == 'undefined'){
        data = null;
    }
    console.log(JSON.stringify({'code': code, 'data': data}))
};

app.on('window-all-closed', function() {
    app.quit();
});

app.on('ready', function () {
    let args = JSON.parse(process.argv[3]);
    if(!args){
        process_send();
        app.quit();
    }
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 1080,
        show: false
    });

    let suc_cnt = 0, resp = {}, data = null, inputContent = null, outImage = false, dlist = [], tpl = 'flowchart';
    let options = JSON.parse(process.argv[2]);
    if(options['timeout'] > 0) {
        setTimeout(function () {
            app.quit();
        }, options['timeout']);
    }
    if(typeof args == 'string') {
        dlist = [args];
    }else if(typeof args.text == 'string'){
        dlist = [args.text];
    }else{
        dlist = args;
    }
    if(options.debug){
        console.log('[options]', options, dlist);
    }
    for(var k in dlist) {
        data = dlist[k];
        if(typeof data != 'string' && data.hasOwnProperty('text')){
            inputContent = data['text'];
            outImage = data.png ? data.png : (options.png ? options.png : false);
            tpl = data.type ? data.type : (options.type ? options.type : 'flowchart');
        }else{
            inputContent = data;
            outImage = options.png ? options.png : false;
            tpl = options.type ? options.type : 'flowchart';
        }
        if(options.debug){
            console.log('[content]', k, tpl, inputContent, outImage);
        }
        mainWindow.loadURL('file://' + path.join(__dirname, 'diagram-' + tpl) + '.html')    //主窗口
        mainWindow.webContents.on('did-finish-load', function () {
            mainWindow.webContents.send('render-start', {
                inputContent: inputContent,
                outImage: outImage
            });
            ipc.on('render-finished', function (sys, data) {
                suc_cnt += 1;
                resp[k] = data;
                if(suc_cnt >= dlist.length) {
                    process_send(resp, 1);
                    app.quit();
                }
            });
        });
    }
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
});

