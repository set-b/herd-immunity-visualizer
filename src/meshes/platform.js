import { MeshBuilder, StandardMaterial, Color3, PhysicsAggregate, PhysicsShapeType, PhysicsMotionType, Quaternion, Vector3 } from "@babylonjs/core";

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

        const euler = this.platform.rotationQuaternion.toEulerAngles();

        let targetRotationX;
        let targetRotationZ;

        // tilt will never be less than -1 or more than 1, thus never exceeds limit
        if (Math.abs(tiltX) < 0.1 && Math.abs(tiltZ) < 0.1) {
            targetRotationX = 0;
            targetRotationZ = 0;
        } else {
            targetRotationX = tiltX * this.rotationLimitAlpha;
            targetRotationZ = -tiltZ * this.rotationLimitBeta;
        }

        const clampedX = Math.max(-this.rotationLimitAlpha, Math.min(this.rotationLimitAlpha, euler.x));
        const clampedZ = Math.max(-this.rotationLimitBeta, Math.min(this.rotationLimitBeta, euler.z));

        const diffX = targetRotationX - clampedX;
        const diffZ = targetRotationZ - clampedZ;

        const angularSpeed = 50;
        const angularVelocity = new Vector3(
            diffX * angularSpeed,
            -euler.y * angularSpeed, 
            // applies a corrective, opposite force to euler.y by making it negative, locking the y position of the paltform in place
            diffZ * angularSpeed
        );

        this.aggregate.body.setAngularVelocity(angularVelocity);
    }
}