import { colorManager } from '../utils/colorManager'
import Scene from '../scene/scene'

class Door {

    /**
     * @constructor
     */
    constructor() {
        this.doorLength = 10;
        this.doorGapX = 8;
        this.doorGapY = 0;
        this.doorGroupArr = [];
        this.doorShapesArr = [];
        this.render();
    }

    createDoorGroup() {
        let geometry = new THREE.BoxBufferGeometry( 4, .02, 1 );
        let geometry2 = new THREE.BoxBufferGeometry( 6, .02, 1 );
        let material = new THREE.MeshLambertMaterial({
            transparent: true,
            color: new THREE.Color('#35192a'),
            emissive: new THREE.Color('#00efe9')
        });

        // Top Right
        let doorElementA = new THREE.Mesh( geometry, material );
        doorElementA.rotation.z = Math.PI / 2;
        doorElementA.position.x -= this.doorGapX;
        doorElementA.position.y += this.doorGapY;

        // Top Left
        let doorElementB = new THREE.Mesh( geometry, material );
        doorElementB.rotation.z = - Math.PI / 2;
        doorElementB.position.x += this.doorGapX;
        doorElementB.position.y += this.doorGapY;

        // Top Left
        let doorElementC = new THREE.Mesh( geometry2, material );
        doorElementC.position.z = 0;
        doorElementC.position.x = 0;
        doorElementC.position.y = 3;

        // Bottom Left
        let doorElementD = new THREE.Mesh( geometry2, material );
        doorElementD.position.z = 0;
        doorElementD.position.x = 0;
        doorElementD.position.y = -3;

        // Group
        let doorGroup = new THREE.Group();
        doorGroup.add( doorElementA );
        doorGroup.add( doorElementB );
        doorGroup.add( doorElementC );
        doorGroup.add( doorElementD );

        // Push all door shape
        this.doorShapesArr.push(doorElementA, doorElementB, doorElementC, doorElementD);

        // Push to Array
        this.doorGroupArr.push(doorGroup);

    }

    render() {
        let steps = 250 / this.doorLength;
        let currentPositionStep = 0;
        // Add door Groups
        for (let i = 0; i < this.doorLength; i++) {
            // Prepare Position
            let positionZ = currentPositionStep + steps;
            currentPositionStep = positionZ;

            // Create group
            this.createDoorGroup();

            // Position current Group
            this.doorGroupArr[i].position.z = positionZ;

            // Add to Scene
            Scene.add( this.doorGroupArr[i] );
        }
    }


    updateLight(opacity) {
        let opacityValue = opacity/ 120;
        this.doorShapesArr.forEach((door) => {
            door.material.opacity = opacityValue;
        })
    }



    update(boost, audioAverage) {
        let velocity = .8;

        if (boost) {
            velocity = velocity * 1.5;
        }

        for(let i = 0 ; i < this.doorGroupArr.length; i++){
            this.doorGroupArr[i].position.z += velocity;

            if (this.doorGroupArr[i].position.z > 300){
                this.doorGroupArr[i].position.z = 200
            }
        }

        this.updateLight(audioAverage)
    }
}

export default Door
