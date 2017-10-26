import { colorManager } from '../utils/colorManager'
import Scene from '../scene/scene'

class Stars {

    /**
     * @constructor
     */
    constructor() {
        this.number = 120;
        this.color = new THREE.Color(`rgb(${colorManager.currentColor.color[0][0]}, ${colorManager.currentColor.color[0][1]}, ${colorManager.currentColor.color[0][2]})`);
        this.lines = [];
        this.render();
    }

    render() {
        let geometry = new THREE.BoxGeometry( 0.05, 0.05, 5 );
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

    setPosition(line) {
        let positionZ = Math.floor(Math.random() * 200) + 1;
        let multiplicateur = Math.floor(Math.random() * 2) === 0 ? -1 : 1;
        positionZ = positionZ * multiplicateur;
        line.position.x = Math.cos(((Math.PI * 2) / this.number) * line.id ) * 5 * multiplicateur;
        line.position.y = Math.sin(((Math.PI * 2) / this.number) * line.id ) * 5 * multiplicateur;
        line.position.z = positionZ;
    }


    update() {
        this.color.set(`rgb(${colorManager.currentColor.color[0][0]}, ${colorManager.currentColor.color[0][1]}, ${colorManager.currentColor.color[0][2]})`);

        for(let i = 0 ; i < this.lines.length; i++){
            this.lines[i].position.z += 1;
            this.lines[i].material.color = this.color;
            this.lines[i].material.emissive = this.color;

            if (this.lines[i].position.z > 300){
                this.setPosition(this.lines[i]);
                this.lines[i].position.z = 200
            }
        }
    }
}

export default Stars
