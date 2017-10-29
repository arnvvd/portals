import { colorManager } from '../utils/colorManager'
import Scene from '../scene/scene'

class Stars {

    /**
     * @constructor
     */
    constructor() {
        this.number = 100;
        this.radius = 5;
        this.color = new THREE.Color(`rgb(${colorManager.currentColor.color[0][0]}, ${colorManager.currentColor.color[0][1]}, ${colorManager.currentColor.color[0][2]})`);
        this.lines = [];
        this.render();
    }

    render() {
        let geometry = new THREE.BoxGeometry( 0.05, 0.05, 5 );
        let material = new THREE.MeshLambertMaterial({
            transparent: true,
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
        line.position.x = Math.cos(((Math.PI * 2) / this.number) * line.id ) * this.radius * multiplicateur;
        line.position.y = Math.sin(((Math.PI * 2) / this.number) * line.id ) * this.radius * multiplicateur;
        line.position.z = positionZ;
    }


    updateLight(opacity) {
        let opacityValue = opacity/ 120;
        this.lines.forEach((line) => {
            line.material.opacity = opacityValue;
            //console.log(neon.material.opacity);

        })
    }


    update(boost, audioAverage) {
        this.color.set(`rgb(${colorManager.currentColor.color[0][0]}, ${colorManager.currentColor.color[0][1]}, ${colorManager.currentColor.color[0][2]})`);

        let velocity = 1;

        if (boost) {
            velocity = velocity * 1.5;
        }

        for(let i = 0 ; i < this.lines.length; i++){
            this.lines[i].position.z += velocity;
            this.lines[i].material.color = this.color;
            this.lines[i].material.emissive = this.color;

            if (this.lines[i].position.z > 300){
                this.lines[i].position.z = 200
            }
        }

        this.updateLight(audioAverage)
    }
}

export default Stars
