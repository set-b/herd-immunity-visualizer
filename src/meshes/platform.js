import { MeshBuilder, StandardMaterial, Color3, PhysicsAggregate, PhysicsShapeType, PhysicsMotionType, Quaternion } from "@babylonjs/core";

export class Platform {
    constructor(name, width, depth, scene, rotationLimitAlpha, rotationLimitBeta){
        this.name = name;
        this.width = width;
        this.depth = depth;
        this.scene = scene;
        this.rotationLimitAlpha = rotationLimitAlpha;
        this.rotationLimitBeta = rotationLimitBeta;
        this.platform = this.createPlatform(
            name, 
            width, 
            depth, 
            scene
        );
        this.aggregate = new PhysicsAggregate(
            this.platform,
            PhysicsShapeType.BOX,
            { mass: 0, friction: 0 },
            scene        
        );
        this.aggregate.body.setMotionType(PhysicsMotionType.ANIMATED);
        this.aggregate.body.disablePreStep = false;
        this.platform.rotationQuaternion = 
        this.platform.rotationQuaternion = this.platform.rotationQuaternion || Quaternion.Identity();
    }

    createPlatform(name, width, depth, scene) {

        const platform = new MeshBuilder.CreateBox(
             name,
            { width: width, depth: depth, height: 0.5 },
            scene
        );

        const platformMaterial = new StandardMaterial("platformMaterial");
        platformMaterial.backFaceCulling = false;
        platformMaterial.diffuseColor = new Color3(1, 0.5, 0.3);
    
        platform.material = platformMaterial;

        return platform;
    }

    update(inputManager, deltaTime) {
        const tiltX = inputManager.getTiltX();
        const tiltZ = inputManager.getTiltZ();

        // tilt will never be less than -1 or more than 1, thus never exceeds limit
        const targetRotationX = tiltX * this.rotationLimitAlpha;
        const targetRotationZ = tiltZ * this.rotationLimitBeta;

        const euler = this.platform.rotationQuaternion.toEulerAngles();
        euler.x = targetRotationX;
        euler.z = -1 * targetRotationZ;

        this.platform.rotationQuaternion = Quaternion.FromEulerAngles(euler.x, euler.y, euler.z);
    }
}