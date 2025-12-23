import { DeviceSourceManager, DeviceType, PointerInput, XboxInput } from "@babylonjs/core";

export class InputManager { // analyze this code
    constructor(engine, canvas) {
        this.canvas = canvas;
        this.tiltX = 0;
        this.tiltZ = 0;

        this.mouseX = 0;
        this.mouseZ = 0;

        this.gamepadX = 0;
        this.gamepadZ = 0;

        this.accelX = 0;
        this.accelZ = 0;

        this.deviceSourceManager = new DeviceSourceManager(engine);

        this._setupMouseInput();
        this._setupGamepadInput();
        this._setupAccelerometer();
    }

    _setupMouseInput() {
        this.deviceSourceManager.onDeviceConnectedObservable.add((device) => {
            if (device.deviceType === DeviceType.Mouse) {
                device.onInputChangedObservable.add((eventData) => {
                    const rect = this.canvas.getBoundingClientRect(); // the canvas dimensions
                    const centerX = rect.width / 2; // half the canvas width
                    const centerZ = rect.height / 2; // half the canvas height
                    
                    // x and y are the horizontal and vertical mouse position in pixels
                    const x = device.getInput(PointerInput.Horizontal);
                    const z = device.getInput(PointerInput.Vertical);
                    
                    /*  x - centerx represents the distance from the center,
                        where the output 0 means center of the center,
                        negative output means left of the center,
                        and positive output means to the right of the center
                    */
                    this.mouseX = (x - centerX) / centerX; // dividing normalizes to -1 or 1
                    this.mouseZ = (z - centerZ) / centerZ;

                    this.mouseX = Math.max(-1, Math.min(1, this.mouseX));
                    this.mouseZ = Math.max(-1, Math.min(1, this.mouseZ));
                });
            }
        });
    }

    _setupGamepadInput() {
        this.deviceSourceManager.onDeviceConnectedObservable.add((device) => {

            if (device.deviceType === DeviceType.Xbox) {
                console.log("Device connected:", device.deviceType);
                console.log("xbox controller stored");

                device.onInputChangedObservable.add((eventData) => {
                    // 0 represents horizontal movement with left stick; 1 means vertical 
                    console.log(eventData);
                    this.gamepadX = device.getInput(XboxInput.LStickXAxis); // use 0 or 1 to prevent null assignment
                    this.gamepadZ = device.getInput(XboxInput.LStickYAxis); // might need to add scene.registerbeforerender
                    console.log(this.gamepadX);
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
                    this.accelZ = Math.max(-1, Math.min(1, event.beta / 30));
                }
            })
        }
    }

    getTiltZ() {
        if (Math.abs(this.gamepadZ) > 0.1) return this.gamepadZ;
        if (Math.abs(this.accelZ) > 0.1) return this.accelZ;
        return this.mouseZ;
    }

    getTiltX() {
        if (Math.abs(this.gamepadX) > 0.1) return this.gamepadX;
        if (Math.abs(this.accelX) > 0.1) return this.accelX;
        return this.mouseX;
    }

    dispose() { // dispose of the devicesourcemanager when the scene is finished
        this.deviceSourceManager.dispose();
    }
}