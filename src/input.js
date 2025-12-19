import { KeyboardEventTypes } from "@babylonjs/core";

export function keyboardInput(scene) {
    const keysDown = {};

    // adds event listener to scene, checking keys
    scene.onKeyboardObservable.add((keyboardInfo) => {
    const key = keyboardInfo.event.key.toLowerCase(); // the key
    const type = keyboardInfo.type; // 1 or 2, keydown or up
    
    if (type === KeyboardEventTypes.KEYDOWN) { // if keydown
        keysDown[key] = true; // add value to object
    } else if (type === KeyboardEventTypes.KEYUP) { // if not
        delete keysDown[key]; // remove it from object
    }
});
    return { // returns function that verifies if key is pressed
        isKeyDown: (key) => keysDown[key.toLowerCase()] === true
    };
}

// add mouse input function to export?