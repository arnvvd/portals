import { colorManager } from '../utils/colorManager'
import Scene from '../scene/scene'

class Neon {

    /**
     * @constructor
     */
    constructor() {
        this.neonLength = 20;
        this.neonGroupArr = [];
        this.render();
    }

    createNeonGroup() {
        let geometry = new THREE.BoxBufferGeometry( .8, .02, .02 );
        let material = new THREE.MeshBasicMaterial({
            color: new THREE.Color('#efd233')
        });

        // Top Right
        let neonA = new THREE.Mesh( geometry, material );
        neonA.rotation.z = Math.PI / 4;
        neonA.position.x -= 3;
        neonA.position.y += .4;

        // Bottom Right
        let neonB = new THREE.Mesh( geometry, material );
        neonB.rotation.z = - Math.PI / 4;
        neonB.position.x -= 3;
        neonB.position.y -= .4;

        // Top Left
        let neonC = new THREE.Mesh( geometry, material );
        neonC.rotation.z = - Math.PI / 4;
        neonC.position.x += 3;
        neonC.position.y += .4;

        // Bottom Left
        let neonD = new THREE.Mesh( geometry, material );
        neonD.rotation.z = Math.PI / 4;
        neonD.position.x += 3;
        neonD.position.y -= .4;

        // Group
        let neonGroup = new THREE.Group();
        neonGroup.add( neonA );
        neonGroup.add( neonB );
        neonGroup.add( neonC );
        neonGroup.add( neonD );


        // Push to Array
        this.neonGroupArr.push(neonGroup);

        //console.log(this.neonGroupArr);

    }

    render() {
        let steps = 100 / this.neonLength;
        let currentPositionStep = 200;
        // Add Neon Groups
        for (let i = 0; i < this.neonLength; i++) {
            // Prepare Position
            let positionZ = currentPositionStep + steps;
            currentPositionStep = positionZ;
            console.log(currentPositionStep);

            // Create group
            this.createNeonGroup();

            // Position current Group
            this.neonGroupArr[i].position.z = positionZ;

            // Add to Scene
            Scene.add( this.neonGroupArr[i] );
        }
    }

    update() {
        for(let i = 0 ; i < this.neonGroupArr.length; i++){
            this.neonGroupArr[i].position.z += .4;

            if (this.neonGroupArr[i].position.z > 300){
                //this.setPosition(this.neonGroupArr[i]);
                this.neonGroupArr[i].position.z = 200
            }
        }
    }
}

export default Neon
