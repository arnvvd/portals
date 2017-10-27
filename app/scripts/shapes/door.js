import { colorManager } from '../utils/colorManager'
import Scene from '../scene/scene'

class Door {

    /**
     * @constructor
     */
    constructor() {
        this.neonLength = 10;
        this.neonGapX = 8;
        this.neonGapY = 0;
        this.neonGroupArr = [];
        this.render();
    }

    createNeonGroup() {
        let geometry = new THREE.BoxBufferGeometry( 4, .02, 1 );
        let geometry2 = new THREE.BoxBufferGeometry( 6, .02, 1 );
        let material = new THREE.MeshLambertMaterial({
            color: new THREE.Color('#35192a'),
            emissive: new THREE.Color('#00efe9')
        });

        // Top Right
        let neonA = new THREE.Mesh( geometry, material );
        neonA.rotation.z = Math.PI / 2;
        neonA.position.x -= this.neonGapX;
        neonA.position.y += this.neonGapY;

        // Top Left
        let neonB = new THREE.Mesh( geometry, material );
        neonB.rotation.z = - Math.PI / 2;
        neonB.position.x += this.neonGapX;
        neonB.position.y += this.neonGapY;

        // Top Left
        let neonC = new THREE.Mesh( geometry2, material );
        neonC.position.z = 0;
        neonC.position.x = 0;
        neonC.position.y = 3;

        // Bottom Left
        let neonD = new THREE.Mesh( geometry2, material );
        neonD.position.z = 0;
        neonD.position.x = 0;
        neonD.position.y = -3;

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
        let steps = 250 / this.neonLength;
        let currentPositionStep = 0;
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
            this.neonGroupArr[i].position.z += .8;

            if (this.neonGroupArr[i].position.z > 300){
                //this.setPosition(this.neonGroupArr[i]);
                this.neonGroupArr[i].position.z = 200
            }
        }
    }
}

export default Door
