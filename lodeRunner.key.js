var keyAction = ACT_STOP; //// keyLastLeftRight = ACT_RIGHT;
var shiftLevelNum = 0;
var runnerDebug = 0;

function pressShiftKey(code)
{
    /*
    // cheat key code disable 5/16/2015
    switch(code) {
        case "Period": // SHIFT + . = '>', next level
            shiftLevelNum = 1;
            gameState = GAME_NEXT_LEVEL;
            break;
        case "Comma": // SHIFT + , = '<', previous level
            shiftLevelNum = 1;
            gameState = GAME_PREV_LEVEL;
            break;
        case "ArrowUp": // SHIFT + UP, increase runner life
            if (playMode == PLAY_CLASSIC && runnerLife < 10) {
                runnerLife++;
                drawLife();
            }
            break;
        case "KeyX": // SHIFT + X
            toggleTrapTile();
            break;
        case "KeyG": // SHIFT + G, toggle god mode
            toggleGodMode();
            break;
        default:
            if (runnerDebug) debugKeyPress(code);
            break;
    }
    */
}

function pressCtrlKey(code)
{
    switch (code) {
        case "KeyA": // CTRL-A : abort level
        case "KeyQ":
            gameState = GAME_RUNNER_DEAD;
            break;
        case "KeyC": // CTRL-C : copy current level
            copyLevelMap = levelData[curLevel - 1];
            copyLevelPassed = 1;
            showTipsText("COPY MAP", 1500);
            break;
        case "KeyJ": // CTRL-J : gamepad toggle
            toggleGamepadMode(1);
            //if(gamepadIconObj) gamepadIconObj.updateGamepadImage();	
            break;
        case "KeyK": // CTRL-K : repeat actions On/Off
            toggleRepeatAction();
            repeatActionIconObj.updateRepeatActionImage();
            break;
        case "KeyR": // CTRL-R : abort game
            runnerLife = 1;
            gameState = GAME_RUNNER_DEAD;
            break;
        case "KeyX": // CTRL-X
            toggleTrapTile();
            break;
        //	case "KeyZ": //CTRL-Z, toggle god mode
        //		toggleGodMode();
        //		break;	
        case "KeyS": // CTRL-S, toggle sound
            if ((soundOff ^= 1) == 1) {
                soundStop(soundDig);
                soundStop(soundFall);
                showTipsText("SOUND OFF", 1500);
            } else {
                showTipsText("SOUND ON", 1500);
            }
            soundIconObj.updateSoundImage();
            break;
        case "ArrowLeft": // CTRL + ← : speed down
            setSpeed(-1);
            break;
        case "ArrowRight": // CTRL + → : speed up
            setSpeed(1);
            break;
        case "KeyH": // CTRL-H : redHat mode on/off
            toggleRedhatMode();
            break;
        case "Digit1":
        case "Digit2":
        case "Digit3":
        case "Digit4":
        case "Digit5":
            themeColorChange(parseInt(code.slice(-1)) - 1);
            break;
    }
}

function debugKeyPress(code)
{
    switch (code) {
        case "Digit1":
            shiftLevelNum = 5;
            gameState = GAME_NEXT_LEVEL;
            break;
        case "Digit2":
            shiftLevelNum = 10;
            gameState = GAME_NEXT_LEVEL;
            break;
        case "Digit3":
            shiftLevelNum = 20;
            gameState = GAME_NEXT_LEVEL;
            break;
        case "Digit4":
            shiftLevelNum = 50;
            gameState = GAME_NEXT_LEVEL;
            break;
        case "Digit6":
            shiftLevelNum = 5;
            gameState = GAME_PREV_LEVEL;
            break;
        case "Digit7":
            shiftLevelNum = 10;
            gameState = GAME_PREV_LEVEL;
            break;
        case "Digit8":
            shiftLevelNum = 20;
            gameState = GAME_PREV_LEVEL;
            break;
        case "Digit9":
            shiftLevelNum = 50;
            gameState = GAME_PREV_LEVEL;
            break;
    }
}

var repeatAction = 0; //1: keyboard repeat on, 0: keyboard repeat Off
var repeatActionPressed = 0;
var gamepadMode = 1; //0: disable, 1: enable
var redhatMode = 1;
var godMode = 0, godModeKeyPressed = 0;

function initHotKeyVariable()
{
    godMode = 0;
    godModeKeyPressed = 0;
    repeatActionPressed = 0;
}

function toggleRepeatAction()
{
    if ((repeatAction ^= 1) == 1) {
        showTipsText("REPEAT ACTIONS ON", 2500);
    } else {
        showTipsText("REPEAT ACTIONS OFF", 2500);
    }
    if (gameState != GAME_START) repeatActionPressed = 1;
    setRepeatAction();
}

function toggleGamepadMode(textMsg)
{
    if (!gamepadSupport()) {
        if (textMsg) showTipsText("GAMEPAD NOT SUPPORTED", 2500);
        gamepadMode = 0;
    } else {
        if ((gamepadMode ^= 1) == 1) {
            gamepadEnable();
            if (textMsg) showTipsText("GAMEPAD ON", 2500);
        } else {
            gamepadDisable();
            if (textMsg) showTipsText("GAMEPAD OFF", 2500);
        }
    }
    setGamepadMode();
}

function toggleRedhatMode()
{
    if ((redhatMode ^= 1) == 1) {
        for (var i = 0; i < guardCount; i++) {
            guard[i].sprite.spriteSheet = guard[i].hasGold > 0 ? redhatData : guardData;
        }
        showTipsText("REDHAT MODE ON", 1500);
    } else {
        for (var i = 0; i < guardCount; i++) {
            guard[i].sprite.spriteSheet = guardData;
        }
        showTipsText("REDHAT MODE OFF", 1500);
    }
}

function toggleGodMode()
{
    godModeKeyPressed = 1;
    sometimePlayInGodMode = 1;
    godMode ^= 1;
    showTipsText(godMode ? "GOD MODE ON" : "GOD MODE OFF", 1500);
}

function setSpeed(v)
{
    speed += v;
    if (speed < 0) speed = 0;
    if (speed >= speedMode.length) speed = speedMode.length - 1;
    createjs.Ticker.setFPS(speedMode[speed]);
    showTipsText(speedText[speed], 1500);
}

function helpCallBack()
{
    pressKey("Escape");
}

function pressKey(code)
{
    switch (code) {
        case "KeyA":
        case "ArrowLeft":
        case "KeyJ":
            keyAction = ACT_LEFT;
            break;
        case "ArrowRight":
        case "KeyL":
        case "KeyD":
            keyAction = ACT_RIGHT;
            break;
        case "KeyW":
        case "ArrowUp":
        case "KeyI":
            keyAction = ACT_UP;
            break;
        case "ArrowDown":
        case "KeyK":
        case "KeyS":
            keyAction = ACT_DOWN;
            break;
        case "KeyZ":
        case "KeyQ":
        case "KeyU":
        case "KeyY": //Y key to dig left, for German keyboards
        case "Comma":
            keyAction = ACT_DIG_LEFT;
            break;
        case "KeyX":
        case "KeyO":
        case "KeyE":
        case "Period":
            keyAction = ACT_DIG_RIGHT;
            break;
        case "Escape": //help & pause
            if (gameState == GAME_PAUSE) {
                gameResume();
                showTipsText("", 1000); //clear text
            } else {
                gamePause();
                showTipsText("PAUSE", 0); //display "PAUSE"
            }
            break;
        case "Enter": //display hi-score
            if (playMode == PLAY_CLASSIC) {
                menuIconDisable(1);
                gamePause();
                showScoreTable(playData, null, function () {
                    menuIconEnable();
                    gameResume();
                });
                return;  //don't record this key code !
            } else {
                keyAction = ACT_UNKNOWN;
                //debug("keycode = " + code);	
            }
            break;
        default:
            keyAction = ACT_UNKNOWN;
            break;
    }
    if (recordMode && code !== "Escape") saveKeyCode(code, keyAction);
}

function gameResume()
{
    gameState = lastGameState;
    soundResume(soundFall);
    soundResume(soundDig);
}

function gamePause()
{
    lastGameState = gameState;
    gameState = GAME_PAUSE;
    soundPause(soundFall);
    soundPause(soundDig);
}

function handleKeyDown(event)
{
    if (!event) event = window.event;
    const key = event.key;
    const code = event.code;

    if (event.shiftKey) {
        if (gameState == GAME_START || gameState == GAME_RUNNING) {
            pressShiftKey(code);
        }
    } else if (event.ctrlKey && key != "Control" && // if CTRL with another key
        (gameState == GAME_START || gameState == GAME_RUNNING) ) {    
        pressCtrlKey(code);
    }else if ((gameState == GAME_PAUSE && code === "Escape") ||
            gameState == GAME_START || gameState == GAME_RUNNING) {
            if (recordMode != RECORD_PLAY && playMode != PLAY_AUTO) {
                pressKey(code);
            }
    }

    if (key.startsWith("F") && key !== "F") return true; // allow F1... F12
    return false;
}

function handleKeyUp(event)
{
    if (repeatAction) return true;
    if (!event) event = window.event;
    const key = event.key;
    if (recordKeyCode === event.code && keyPressed != -1) keyPressed = 0;
    return true;
}
