//============
// MISC
//============
var DEBUG = 0;
var demoSoundOff = 1;

function debug(string) 
{
	if(DEBUG) console.log(string);
}

function assert(expression, msg)
{
	console.assert(expression, msg);
}

function error(string) 
{
	console.log("Error In " + error.caller.name + "( ): " + string);
}

function getScreenSize() 
{
	var x, y;
	
	//----------------------------------------------------------------------
	// Window size and scrolling:
	// URL: http://www.howtocreate.co.uk/tutorials/javascript/browserwindow
	//----------------------------------------------------------------------
	if (typeof (window.innerWidth) == 'number') {
		//Non-IE
		x = window.innerWidth;
		y = window.innerHeight;
	} else if ((document.documentElement) &&
		(document.documentElement.clientWidth || document.documentElement.clientHeight)) {
		//IE 6+ in 'standards compliant mode'
		x = document.documentElement.clientWidth;
		y = document.documentElement.clientHeight;
	} else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
		//IE 4 compatible
		x = document.body.clientWidth;
		y = document.body.clientHeight;
	}
	return {x:x, y:y};
}

//================================
// show tips messgae
//===============================
function showTipsMsg(_tipsTxt, _stage, _scale, _tipsTxt1)
{
	var TEXT_SIZE = 72 * _scale;
	var TEXT1_SIZE = 66 * _scale;
	var TEXT_COLOR = "#FF2020";
	var TEXT1_COLOR = "#FF2020";

	var tipsText = new createjs.Text(_tipsTxt, "bold " +  TEXT_SIZE + "px Helvetica", TEXT_COLOR);
	var screenX1 = _stage.canvas.width;
	var screenY1 = _stage.canvas.height;

	tipsText.x = (screenX1) / 2 | 0;
	tipsText.y = screenY1/2 - tipsText.getBounds().height*5/4 | 0;
	tipsText.shadow = new createjs.Shadow("white", 3, 3, 2);
	tipsText.textAlign = "center";
	
	_stage.addChild(tipsText);
	
	createjs.Tween.get(tipsText).set({alpha:1}).wait(50).to({scaleX:1.2, scaleY:1.2, alpha:0}, 3500)
		.call(function(){_stage.removeChild(tipsText);});
		
	if(_tipsTxt1 != null) {
		// two tips 
		var tipsText1 = new createjs.Text(_tipsTxt1, "bold " +  TEXT1_SIZE + "px Helvetica", TEXT1_COLOR);
		
		tipsText1.x = (screenX1) / 2 | 0;
		tipsText1.y = screenY1/2 | 0;
		tipsText1.shadow = new createjs.Shadow("white", 3, 3, 2);
		tipsText1.textAlign = "center";

		_stage.addChild(tipsText1);
		
		createjs.Tween.get(tipsText1).set({alpha:1}).wait(50).to({scaleX:1.2, scaleY:1.2, alpha:0}, 3500)
			.call(function(){_stage.removeChild(tipsText1);});
		
	}
}

//==========================================
// move z-index to top for a child of stage
//==========================================
function moveChild2Top(stage, obj)
{
	stage.setChildIndex(obj, stage.getNumChildren() - 1);
}

//==========================
// BEGIN for Sound function
//==========================
var soundOff = 0;

function themeSoundPlay(name) 
{
	soundPlay(name + curTheme);
}

function soundDisable()
{
	if(playMode == PLAY_AUTO) return 1;
	if(playMode == PLAY_DEMO || playMode == PLAY_DEMO_ONCE) return demoSoundOff;
	else return soundOff;
}

function soundPlay(name)
{
	if(soundDisable()) return;
	
	if(typeof name == "string") {
		return createjs.Sound.play(name);
	} else {
		name.stop(); //12/21/2014 , for support soundJS 0.6.0
		name.play();
	}
}

function soundStop(name)
{
	if(typeof name == "string") {
		return createjs.Sound.stop(name);
	} else {
		name.stop();
	}
}

function soundPause(name)
{
	if(soundDisable()) return;
	
	if(typeof name == "string") {
		return createjs.Sound.pause(name);
	} else {
		name.paused=true; //SoundJS 0.6.2 API Changed, 8/28/2016 
	}
}

function soundResume(name)
{
	if(soundDisable()) return;
	
	if(typeof name == "string") {
		return createjs.Sound.resume(name);
	} else {
		name.paused=false; //SoundJS 0.6.2 API Changed, 8/28/2016
	}
}

//==============================
// get time zone for php format
//==============================
function phpTimeZone()
{
	var d = new Date()
	var n = d.getTimezoneOffset();
	var n1 = Math.abs(n);

	//------------------------------------------------------------------------------------
	// AJAX POST and Plus Sign ( + ) — How to Encode:
	// Use encodeURIComponent() in JS and in PHP you should receive the correct values.
	// http://stackoverflow.com/questions/1373414/ajax-post-and-plus-sign-how-to-encode
	//------------------------------------------------------------------------------------
	
	//+0:00, +1:00, +8:00, -8:00 ....
	return ((n <=0)?encodeURIComponent("+"):"-")+ (n1/60|0) + ":" + ("0"+n1%60).slice(-2);
}

//========================================
// get local time (YYYY-MM-DD HH:MM:SS)
//========================================
function getLocalTime(d)
{
	if (d == null) d = new Date();
	
	return (("000"+d.getFullYear()).slice(-4)+ "-" +("0"+(d.getMonth() + 1)).slice(-2)+ "-" +("0"+d.getDate()).slice(-2)+ " " +	
	       ("0"+d.getHours()).slice(-2) + ":" + ("0"+d.getMinutes()).slice(-2) + ":"  + ("0"+d.getSeconds()).slice(-2));
}

// ======================================================================
// return format : "2021-06-08 12:09:08 GMT+0800 (Taipei Standard Time)"
// ======================================================================
function getLocalTimeZone(d)
{
	if (d == null) d = new Date();
	
	var dString = d.toString(); // format: "Tue Jun 08 2021 12:09:08 GMT+0800 (台北標準時間)"
	var dGMTOffset = dString.indexOf('GMT');
	var dGMT = ""

	if(dGMTOffset >= 0) dGMT = ' ' + dString.substr(dGMTOffset);
	
	return getLocalTime(d) + dGMT;
}

//===============
// Random Object
//===============
function  rangeRandom(minValue, maxValue, seedValue)
{
	var rndList, idx, items;
	var min, max;
	var reset;
	var seed = 0;
	
	function rndStart()
	{
		var swapId, tmp;
	
		rndList = [];
		for(var i = 0; i < items; i++) rndList[i] = min + i;
		for(var i = 0; i < items; i++) {
			if(seedValue > 0) {
				seed = seedValue;	
				swapId = (seedRandom() * items) | 0;
			} else {
				swapId = (Math.random() * items) | 0;
			}
			tmp = rndList[i];
			rndList[i] = rndList[swapId];
			rndList[swapId] = tmp;
		}
		idx = 0;
		//debug(rndList);
	}
	
	function seedRandom() 
	{
    	var x = Math.sin(seed++) * 10000;
    	return x - Math.floor(x);
	}
	
	this.get = function ()
	{
		if( idx >= items) {
			rndStart();
			reset = 1;
		} else {
			reset = 0;
		}
		return rndList[idx++];
	}
	
	this.rndReset = function ()
	{
		return reset;
	}
	
	//---------
	// initial 
	//---------
	reset = 0;
	min = minValue;
	max = maxValue;
	if(min > max) { //swap
		var tmp;
		tmp = min;
		min = max;
		max = tmp;
	}
	items = max - min + 1;
	
	rndStart();
}

//======================================
// get demo data by playData (wData.js)
//======================================
function getDemoData(playData) 
{
	wDemoData = [];	
	switch(playData) {
	case 1:
		if(	typeof wfastDemoData1 !== "undefined" ) wDemoData = wfastDemoData1;
		break;
	case 2:
		if(	typeof wfastDemoData2 !== "undefined" ) wDemoData = wfastDemoData2;
		break;
	case 3:
		if(	typeof wfastDemoData3 !== "undefined" ) wDemoData = wfastDemoData3;
		break;
	case 4:
		if(	typeof wfastDemoData4 !== "undefined" ) wDemoData = wfastDemoData4;
		break;
	case 5:
		if(	typeof wfastDemoData5 !== "undefined" ) wDemoData = wfastDemoData5;
		break;
	}
	for(var i = 0; i < wDemoData.length; i++) { //temp
		playerDemoData[wDemoData[i].level-1] = wDemoData[i]; 
	}
}

//===========================================================================
// Chrome 66 policy changes default mute autoplay, need resume it 
// https://developers.google.com/web/updates/2017/09/autoplay-policy-changes 
//
// Reference: https://github.com/CreateJS/SoundJS/issues/297
//===========================================================================
function resumeAudioContext() 
{
	// handler for fixing suspended audio context in Chrome
	//------------------------------------------------------------------
	// Error Msgs:
	// "The AudioContext was not allowed to start. 
	//  It must be resume (or created) after a user gesture on the page.
	//  https://goo.gl/7K7WLu"
	//------------------------------------------------------------------
	try {
		if (createjs.WebAudioPlugin.context.state === "suspended") {
			createjs.WebAudioPlugin.context.resume();
			console.log("Resume Web Audio context...");
		}
	} catch (e) {
		// SoundJS context or web audio plugin may not exist
		console.error("There was an error while trying to resume the SoundJS Web Audio context...");
		console.error(e);
	}
}

function keyCodeToEventCode(keyCode) {
	const map = {
	  8: "Backspace",
	  9: "Tab",
	  13: "Enter",
	  16: "ShiftLeft",
	  17: "ControlLeft",
	  18: "AltLeft",
	  19: "Pause",
	  20: "CapsLock",
	  27: "Escape",
	  32: "Space",
	  33: "PageUp",
	  34: "PageDown",
	  35: "End",
	  36: "Home",
	  37: "ArrowLeft",
	  38: "ArrowUp",
	  39: "ArrowRight",
	  40: "ArrowDown",
	  45: "Insert",
	  46: "Delete",
	  48: "Digit0",
	  49: "Digit1",
	  50: "Digit2",
	  51: "Digit3",
	  52: "Digit4",
	  53: "Digit5",
	  54: "Digit6",
	  55: "Digit7",
	  56: "Digit8",
	  57: "Digit9",
	  65: "KeyA",
	  66: "KeyB",
	  67: "KeyC",
	  68: "KeyD",
	  69: "KeyE",
	  70: "KeyF",
	  71: "KeyG",
	  72: "KeyH",
	  73: "KeyI",
	  74: "KeyJ",
	  75: "KeyK",
	  76: "KeyL",
	  77: "KeyM",
	  78: "KeyN",
	  79: "KeyO",
	  80: "KeyP",
	  81: "KeyQ",
	  82: "KeyR",
	  83: "KeyS",
	  84: "KeyT",
	  85: "KeyU",
	  86: "KeyV",
	  87: "KeyW",
	  88: "KeyX",
	  89: "KeyY",
	  90: "KeyZ",
	  91: "MetaLeft",
	  93: "ContextMenu",
	  96: "Numpad0",
	  97: "Numpad1",
	  98: "Numpad2",
	  99: "Numpad3",
	  100: "Numpad4",
	  101: "Numpad5",
	  102: "Numpad6",
	  103: "Numpad7",
	  104: "Numpad8",
	  105: "Numpad9",
	  106: "NumpadMultiply",
	  107: "NumpadAdd",
	  109: "NumpadSubtract",
	  110: "NumpadDecimal",
	  111: "NumpadDivide",
	  112: "F1",
	  113: "F2",
	  114: "F3",
	  115: "F4",
	  116: "F5",
	  117: "F6",
	  118: "F7",
	  119: "F8",
	  120: "F9",
	  121: "F10",
	  122: "F11",
	  123: "F12",
	  186: "Semicolon",
	  187: "Equal",
	  188: "Comma",
	  189: "Minus",
	  190: "Period",
	  191: "Slash",
	  192: "Backquote",
	  219: "BracketLeft",
	  220: "Backslash",
	  221: "BracketRight",
	  222: "Quote"
	};
  
	return map[keyCode] || "";
  }