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
        this.stars = [];
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
            this.stars[i] = new THREE.Mesh( geometry, material );
            this.setPosition(this.stars[i], i);
            Scene.scene.add(this.stars[i])
        }
    }

    setPosition(star) {
        let positionZ = Math.floor(Math.random() * 200) + 1;
        let multiplicateur = Math.floor(Math.random() * 2) === 0 ? -1 : 1;
        positionZ = positionZ * multiplicateur;
        star.position.x = Math.cos(((Math.PI * 2) / this.number) * star.id ) * this.radius * multiplicateur;
        star.position.y = Math.sin(((Math.PI * 2) / this.number) * star.id ) * this.radius * multiplicateur;
        star.position.z = positionZ;
    }


    updateLight(opacity) {
        let opacityValue = opacity/ 120;
        this.stars.forEach((star) => {
            star.material.opacity = opacityValue;
        })
    }


    update(boost, audioAverage) {
        this.color.set(`rgb(${colorManager.currentColor.color[0][0]}, ${colorManager.currentColor.color[0][1]}, ${colorManager.currentColor.color[0][2]})`);

        let velocity = 1;

        if (boost) {
            velocity = velocity * 1.5;
        }

        for(let i = 0 ; i < this.stars.length; i++){
            this.stars[i].position.z += velocity;
            this.stars[i].material.color = this.color;
            this.stars[i].material.emissive = this.color;

            if (this.stars[i].position.z > 300){
                this.stars[i].position.z = 200
            }
        }

        this.updateLight(audioAverage)
    }
}

export default Stars
