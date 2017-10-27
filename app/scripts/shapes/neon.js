import { colorManager } from '../utils/colorManager'
import Scene from '../scene/scene'

class Neon {

    /**
     * @constructor
     */
    constructor() {
        this.neonLength = 20;
        this.neonGapX = 2.5;
        this.neonGapY = .4;
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
        neonA.position.x -= this.neonGapX;
        neonA.position.y += this.neonGapY;

        // Bottom Right
        let neonB = new THREE.Mesh( geometry, material );
        neonB.rotation.z = - Math.PI / 4;
        neonB.position.x -= this.neonGapX;
        neonB.position.y -= this.neonGapY;

        // Top Left
        let neonC = new THREE.Mesh( geometry, material );
        neonC.rotation.z = - Math.PI / 4;
        neonC.position.x += this.neonGapX;
        neonC.position.y += this.neonGapY;

        // Bottom Left
        let neonD = new THREE.Mesh( geometry, material );
        neonD.rotation.z = Math.PI / 4;
        neonD.position.x += this.neonGapX;
        neonD.position.y -= this.neonGapY;

        // Group
        let neonGroup = new THREE.Group();
        neonGroup.add( neonA );
        neonGroup.add( neonB );
        neonGroup.add( neonC );
        neonGroup.add( neonD );


        // Push to Array
        this.neonGroupArr.push(neonGroup);
    }

    render() {
        let steps = 100 / this.neonLength;
        let currentPositionStep = 200;
        // Add Neon Groups
        for (let i = 0; i < this.neonLength; i++) {
            // Prepare Position
            let positionZ = currentPositionStep + steps;
            currentPositionStep = positionZ;

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
