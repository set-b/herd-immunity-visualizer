import { DeviceSourceManager, DeviceType, PointerInput } from "@babylonjs/core";

export class InputManager {
    constructor(engine, canvas) {
        this.canvas = canvas;
        this.tiltX = 0;
        this.tiltY = 0;

        this.mouseX = 0;
        this.mouseY = 0;

        this.gamepadX = 0;
        this.gamepadY = 0;

        this.accelX = 0;
        this.accelY = 0;

        this.deviceSourceManager = new DeviceSourceManager(engine);

        this._setupMouseInput();
        this._setupGamepadInput();
        this._setupAccelerometer();
    }

    _setupMouseInput() {
        this.deviceSourceManager.onDeviceConnectedObservable.add((device) => {
            if (device.deviceType === DeviceType.Mouse) {
                device.onInputChangedObservable.add((eventData) => {
                    const rect = this.canvas.getBoundingClientRect(); // what does this mean? is this a limit of some sort?
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;

                    const x = device.getInput(PointerInput.Horizontal);
                    const y = device.getInput(PointerInput.Vertical);

                    this.mouseX = (x - centerX) / centerX;
                    this.mouseY = (y - centerY) / centerY;

                    this.mouseX = Math.max(-1, Math.min(1, this.mouseX));
                    this.mouseY = Math.max(-1, Math.min(1, this.mouseY));
                });
            }
        });
    }

    _setupGamepadInput() {
        this.deviceSourceManager.onDeviceConnectedObservable.add((device) => {
            if (device.deviceType === DeviceType.Xbox) {
                device.onInputChangedObservable.add((eventData) => {
                    // 0 represents horizontal movement with left stick; 1 means vertical 
                    this.gamepadX = device.getInput(0) || 0;
                    this.gamepadY = device.getInput(1) || 1;
                })
            }
        })
    }

    _setupAccelerometer() { // this one makes the least sense
        if (typeof DeviceOrientationEvent !== 'undefined'){
            window.addEventListener('deviceorientation', (event) => {
                // gamma is left-to-right tilt (-90 to 90)
                // beta is front-to-back tilt (-180 to 180)
                if (event.gamma !== null && event.beta !== null){
                    this.accelX = Math.max(-1, Math.min(1, event.gamma / 30));
                    this.accelY = Math.max(-1, Math.min(1, event.beta / 30));
                }
            })
        }
    }

    getTiltY() {
        if (Math.abs(this.gamepadY > 0.1)) return this.gamepadY;
        if (Math.abs(this.accelY) > 0.1) return this.accelY;
        return this.mouseY;
    }

    getTiltX() {
        if (Math.abs(this.gamepadX > 0.1)) return this.gamepadY;
        if (Math.abs(this.accelX > 0.1)) return this.gamepadY;
        return this.mouseX;
    }

    dispose() {
        this.deviceSourceManager.dispose();
    }
}