import { DeviceInputEventType, DeviceSourceManager, DeviceType, FlowGraphBitwiseLeftShiftBlock, PointerInput, XboxInput } from "@babylonjs/core";

export class InputManager { // analyze this code
    constructor(engine, canvas) {
        this.canvas = canvas;
        this.activeDevice = 'none';

        this.deadZone = 0.2;

        this.mouseX = 0;
        this.mouseZ = 0;
        this.mouseActive = false;

        this.accelX = 0;
        this.accelZ = 0;
        this.accelActive = false;

        this.gamepadX = 0;
        this.gamepadZ = 0;
        this.gamepadActive = false;

        this.deviceSourceManager = new DeviceSourceManager(engine);

        this._setupMouseInput();
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

                    this.mouseActive = true;
                    this.gamepadActive = false;
                    this.accelActive = false;
                });
            }
        });
    }

        _setupAccelerometer() { // this one makes the least sense
            this.accelX = 0; // why is this here instead of the constructor?
            this.accelZ = 0;

        if (typeof DeviceOrientationEvent !== 'undefined'){
            window.addEventListener('deviceorientation', (event) => {
                // gamma is left-to-right tilt (-90 to 90)
                // beta is front-to-back tilt (-180 to 180)
                if (event.gamma !== null && event.beta !== null){
                    this.accelX = Math.max(-1, Math.min(1, event.gamma / 30));
                    this.accelZ = Math.max(-1, Math.min(1, event.beta / 30));

                    if (Math.abs(this.accelX) > 0.1 || Math.abs(this.accelZ) > 0.1){
                        this.accelActive = true;
                        this.mouseActive = false;
                        this.gamepadActive = false;
                    }
                }
            })
        }
    }

    _updateGamepad() {
        const xbox = this.deviceSourceManager.getDeviceSource(DeviceType.Xbox);
        if (xbox) {
            const x = xbox.getInput(XboxInput.LStickXAxis) || 0;
            const z = xbox.getInput(XboxInput.LStickYAxis) || 0;

            if (Math.abs(x) > this.deadZone || Math.abs(z) > this.deadZone) {
                this.gamepadX = x;
                this.gamepadZ = z;
                this.gamepadActive = true;
                this.mouseActive = false;
                this.accelActive = false;
            } else if (this.gamepadActive) { // prevents mouse from taking over when releasing the stick
                this.gamepadX = 0;
                this.gamepadZ = 0;
            }
        }
    }

    getTiltZ() {

        this._updateGamepad();

        if (this.gamepadActive) {
            return this.gamepadZ;
        }

        if (this.accelActive) {
            return this.accelZ;
        }

        if (this.mouseActive) {
            return this.mouseZ;
        }

        return 0;
    }

    getTiltX() {

        this._updateGamepad();

        if (this.gamepadActive) {
            return this.gamepadX;
        }

        if (this.accelActive) {
            return this.accelX;
        }

        if (this.mouseActive) {
            return this.mouseX;
        }

        return 0;
    }

    dispose() { // dispose of the devicesourcemanager when the scene is finished
        this.deviceSourceManager.dispose();
    }
}