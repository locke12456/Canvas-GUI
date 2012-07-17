/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011      Zynga Inc.

 http://www.cocos2d-x.org

 Created by JetBrains WebStorm.
 User: wuhao
 Date: 12-3-8

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var cc = cc = cc || {};
//Cocos2d directory
cc.Dir = './';//in relate to the html file or use absolute
cc.loadQue = [];//the load que which js files are loaded
cc.COCOS2D_DEBUG = 2;
cc._DEBUG = 1;
cc._IS_RETINA_DISPLAY_SUPPORTED = 0;
//html5 selector method
cc.$ = function (x) {
    return document.querySelector(x);
};
cc.$new = function (x) {
    return document.createElement(x);
};
//function to load files into html
/*
 cc.loadjs = function(filename)
 {
 //get a ref to header
 var head = cc.$('head');
 var insert = document.createElement('script');
 insert.setAttribute('src',cc.Dir+filename);
 head.appendChild(insert);
 };*/

cc.loadjs = function (filename) {
    //add the file to the que
    var script = cc.$new('script');
    script.src = cc.Dir + filename;
    script.order = cc.loadQue.length;
    cc.loadQue.push(script);


    script.onload = function () {
        //file have finished loading,
        //if there is more file to load, we should put the next file on the head
        if (this.order + 1 < cc.loadQue.length) {
            cc.$('head').appendChild(cc.loadQue[this.order + 1]);
            //console.log(this.order);
        }
        else {
            cc.setup("gameCanvas");
            //we are ready to run the game
            cc.Loader.shareLoader().onloading = function () {
                cc.LoaderScene.shareLoaderScene().draw();
            };
            cc.Loader.shareLoader().onload = function () {
                cc.AppController.shareAppController().didFinishLaunchingWithOptions();
            };
            //preload ressources
            cc.Loader.shareLoader().preload([
                {type:"image", src:"Resources/HelloWorld.png"},
                {type:"image", src:"Resources/grossini_dance_07.png"},
                {type:"image", src:"Resources/cocos64.png"},
                {type:"image", src:"Resources/CloseNormal.png"},
                {type:"image", src:"Resources/CloseSelected.png"},
                {type:"image", src:"Resources/Button00_1.png"},
                {type:"image", src:"Resources/Button01_1.png"},
                {type:"image", src:"Resources/Button02_1.png"},
                {type:"image", src:"Resources/Button03_1.png"},
                {type:"image", src:"Resources/Button04_1.png"},
                {type:"image", src:"Resources/Button05_1.png"},
                {type:"image", src:"Resources/Button06_1.png"},
                {type:"image", src:"Resources/Button07_1.png"},
                {type:"image", src:"Resources/Button08_1.png"},
                {type:"image", src:"Resources/Button09_1.png"}
            ]);
        }
    };
    if (script.order === 0)//if the first file to load, then we put it on the head
    {
        cc.$('head').appendChild(script);
    }
};

include = function (path) {
    cc.loadjs(path);
};
var isDebugMode = true;
if (!isDebugMode) {
    cc.loadjs('../lib/Cocos2d-html5-canvasmenu-min.js');
} else {
    cc.loadjs('lib/platform/CCClass.js');
    cc.loadjs('lib/platform/CCCommon.js');
    cc.loadjs('lib/platform/platform.js');
    cc.loadjs('lib/platform/miniFramework.js');
    cc.loadjs('lib/platform/ZipUtils.js');
    cc.loadjs('lib/platform/base64.js');
    cc.loadjs('lib/platform/gzip.js');
    cc.loadjs('lib/platform/CCMacro.js');
    cc.loadjs('lib/platform/CCFileUtils.js');
    cc.loadjs('lib/platform/CCTypes.js');
    cc.loadjs('lib/cocoa/CCGeometry.js');
    cc.loadjs('lib/platform/CCConfig.js');
    cc.loadjs('lib/cocoa/CCNS.js');
    cc.loadjs('lib/cocoa/CCSet.js');
    cc.loadjs('lib/cocoa/CCAffineTransform.js');
    cc.loadjs('lib/support/CCPointExtension.js');
    cc.loadjs('lib/base_nodes/CCNode.js');
    cc.loadjs('lib/base_nodes/CCAtlasNode.js');
    cc.loadjs('lib/textures/CCTexture2D.js');
    cc.loadjs('lib/textures/CCTextureCache.js');
    cc.loadjs('lib/textures/CCTextureAtlas.js');
    cc.loadjs('lib/misc_nodes/CCRenderTexture.js');
    cc.loadjs('lib/misc_nodes/CCProgressTimer.js');
    cc.loadjs('lib/effects/CCGrid.js');
    cc.loadjs('lib/effects/CCGrabber.js');
    cc.loadjs('lib/actions/CCAction.js');
    cc.loadjs('lib/actions/CCActionInterval.js');
    cc.loadjs('lib/actions/CCActionInstant.js');
    cc.loadjs('lib/actions/CCActionManager.js');
    cc.loadjs('lib/actions/CCActionProgressTimer.js');
    cc.loadjs('lib/actions/CCActionCamera.js');
    cc.loadjs('lib/actions/CCActionEase.js');
    cc.loadjs('lib/actions/CCActionGrid.js');
    cc.loadjs('lib/actions/CCActionTiledGrid.js');
    cc.loadjs('lib/actions/CCActionGrid.js');
    cc.loadjs('lib/layers_scenes_transitions_nodes/CCScene.js');
    cc.loadjs('lib/layers_scenes_transitions_nodes/CCLayer.js');
    cc.loadjs('lib/layers_scenes_transitions_nodes/CCTransition.js');
    cc.loadjs('lib/layers_scenes_transitions_nodes/CCTransitionProgress.js');
    cc.loadjs('lib/layers_scenes_transitions_nodes/CCTransitionPageTurn.js');
    cc.loadjs('lib/sprite_nodes/CCSprite.js');
    cc.loadjs('lib/sprite_nodes/CCAnimation.js');
    cc.loadjs('lib/sprite_nodes/CCAnimationCache.js');
    cc.loadjs('lib/sprite_nodes/CCSpriteFrame.js');
    cc.loadjs('lib/sprite_nodes/CCSpriteFrameCache.js');
    cc.loadjs('lib/sprite_nodes/CCSpriteBatchNode.js');
    cc.loadjs('lib/label_nodes/CCLabelAtlas.js');
    cc.loadjs('lib/label_nodes/CCLabelTTF.js');
    cc.loadjs('lib/label_nodes/CCLabelBMFont.js');
    cc.loadjs('lib/particle_nodes/CCParticleSystem.js');
    cc.loadjs('lib/particle_nodes/CCParticleSystemQuad.js');
    cc.loadjs('lib/particle_nodes/CCParticleExamples.js');
    cc.loadjs('lib/touch_dispatcher/CCTouchDelegateProtocol.js');
    cc.loadjs('lib/touch_dispatcher/CCTouchHandler.js');
    cc.loadjs('lib/touch_dispatcher/CCTouchDispatcher.js');
    cc.loadjs('lib/keypad_dispatcher/CCKeypadDelegate.js');
    cc.loadjs('lib/keypad_dispatcher/CCKeypadDispatcher.js');
    cc.loadjs('lib/text_input_node/CCIMEDispatcher.js');
    cc.loadjs('lib/text_input_node/CCTextFieldTTF.js');
    cc.loadjs('lib/CCDirector.js');
    cc.loadjs('lib/CCCamera.js');
    cc.loadjs('lib/CCScheduler.js');
    cc.loadjs('lib/CCLoader.js');
    cc.loadjs('lib/CCDrawingPrimitives.js');
    cc.loadjs('lib/platform/AppControl.js');
    cc.loadjs('lib/platform/CCApplication.js');
    cc.loadjs('lib/platform/CCSAXParser.js');


    cc.loadjs('lib/menu_nodes/CCMenuItem.js');
    cc.loadjs('lib/menu_nodes/CCMenu.js');

    cc.loadjs('lib/tileMap_parallax_nodes/CCTMXTiledMap.js');
    cc.loadjs('lib/tileMap_parallax_nodes/CCTMXXMLParser.js');
    cc.loadjs('lib/tileMap_parallax_nodes/CCTMXObjectGroup.js');
    cc.loadjs('lib/tileMap_parallax_nodes/CCTMXLayer.js');
    cc.loadjs('lib/tileMap_parallax_nodes/CCParallaxNode.js');

    cc.loadjs('lib/SimpleAudioEngine.js');
}
include('Main.js');//19
