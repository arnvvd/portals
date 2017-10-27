import { colorManager } from '../utils/colorManager'
import Scene from '../scene/scene'

class Dust {

    /**
     * @constructor
     */
    constructor() {
        this.number = 120;
        this.radius = 5;
        this.color = new THREE.Color('#FFFFFF');
        this.lines = [];
        this.render();
    }

    render() {
        let geometry = new THREE.BoxGeometry( 0.05, 0.05, 0.05 );
        let material = new THREE.MeshLambertMaterial({
            color: this.color,
            emissive: this.color
        });

        for (let i = 0 ; i < this.number; i++) {
            this.lines[i] = new THREE.Mesh( geometry, material );
            this.setPosition(this.lines[i], i);
            Scene.scene.add(this.lines[i])
        }
    }

    setPosition(particle) {
        let positionZ = Math.floor(Math.random() * 100) + 200;
        let multiplicateur = Math.floor(Math.random() * 2) === 0 ? -1 : 1;
        positionZ = positionZ * multiplicateur;
        particle.position.x = Math.cos(((Math.PI * 2) / this.number) * particle.id ) * this.radius * multiplicateur;
        particle.position.y = Math.sin(((Math.PI * 2) / this.number) * particle.id ) * this.radius * multiplicateur;
        particle.position.z = positionZ;
    }


    update() {

        for(let i = 0 ; i < this.lines.length; i++){
            this.lines[i].position.z += 0.2;

            if (this.lines[i].position.z > 300){
                this.lines[i].position.z = 200
            }
        }
    }
}

export default Dust
