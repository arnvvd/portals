import { colorManager } from '../utils/colorManager'
import { gameManager } from '../utils/gameManager'
import Scene from '../scene/scene'

import vertShader from '../shaders/vertShader.vert'
import fragShader from '../shaders/fragShader.frag'

class Portal {

    /**
     * @constructor
     */
    constructor(boost) {
        this.radius = .8;
        this.particlesLength = 1000;
        this.isVisible = true;
        this.isTouched = false;
        this.particleArr = [];
        this.currentTime = 0;
        this.boost = boost;

        if (boost) {
            this.color = new THREE.Color( 0xc70f5f)
        } else {
            this.color = new THREE.Color( 0x00efe9)
        }

        this.render();
    }


    render() {

        // SPHERE
        let sphereGeometry = new THREE.SphereGeometry( this.radius, 4, 4 );
        let sphereMaterial = new THREE.MeshBasicMaterial( {
            transparent: true,
            opacity: 0
        } );
        this.sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );

        // SPHERE POSITION
        let positionX = Math.floor(Math.random() * 2) + 1;
        let positionY = Math.floor(Math.random() * 2) + 1;
        let multiplicateurX = Math.floor(Math.random() * 2) === 0 ? -.8 : .8;
        let multiplicateurY = Math.floor(Math.random() * 2) === 0 ? -.8 : .8;

        this.sphere.position.x = positionX * multiplicateurX;
        this.sphere.position.y = positionY * multiplicateurY;
        this.sphere.position.z = 250;


        // PARTICLE TORI
        this.toriGeometry = new THREE.Geometry();

        for ( let i = 0; i < this.particlesLength; i ++ )   {

            let particle = new THREE.Vector3();

            this.alpha = Math.random()*(Math.PI*2);
            this.theta = Math.random()*(Math.PI*2);

            particle.x = (5 / 5 + 1 * Math.cos(this.alpha) / 5) * Math.cos(this.theta);
            particle.y = (5 / 5 + 1 * Math.cos(this.alpha) / 5) * Math.sin(this.theta);
            particle.z = 1 * Math.sin(this.alpha) / 5;

            this.toriGeometry.vertices.push( particle );
            this.particleArr.push( particle );
        }

        // TORI MATERIAL
        this.toriMaterial = new THREE.ShaderMaterial( {
            uniforms: THREE.UniformsUtils.merge( [
                THREE.UniformsLib.common,
                THREE.UniformsLib.specularmap,
                THREE.UniformsLib.envmap,
                THREE.UniformsLib.aomap,
                THREE.UniformsLib.lightmap,
                THREE.UniformsLib.fog,
                {
                    u_time: { type: "f", value: 1.0 },
                    u_amplitude: {type: "f", value: 1.0},
                    diffuse: { value: this.color}
                }
            ] ),
            vertexShader: vertShader,
            fragmentShader: fragShader,
            fog: true
        } );

        // SET TORI POINTS
        this.tori = new THREE.Points( this.toriGeometry, this.toriMaterial );
        this.tori.position.copy(this.sphere.position);


        // BOX
        this.portalBBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());


        // ADD TO SCENE
        Scene.add(this.sphere);
        Scene.add(this.tori);
    }


    update(time, intersectBox, scale) {

        // TIME
        this.currentTime += time / 1000;
        this.toriMaterial.uniforms.u_time.value = this.currentTime;

        // UPDATE SPHERE POSITION
        this.sphere.position.z += .5;
        this.tori.position.copy(this.sphere.position);

        // UPDATE BOX
        this.portalBBox.setFromObject(this.sphere);

        // UPDATE SCALE
        this.sphere.scale.x = scale;
        this.sphere.scale.y = scale;
        this.sphere.scale.z = scale;
        this.toriMaterial.uniforms.u_amplitude.value = scale;

        // IF INTERSECTED
        if (this.portalBBox.intersectsBox(intersectBox) && !this.isTouched) {

            // UPDATE STATUS
            this.isTouched = true;
            this.toriMaterial.uniforms.u_amplitude.value = 1.2 * scale;
            this.toriMaterial.uniforms.diffuse.value = new THREE.Color(0xa3fffc);

            // ADD POINT
            gameManager.touchPortal(this.boost);

            // UPDATE COLOR
            colorManager.changeCurrentColor();
        }

        // REMOVE PORTAL
        if (this.sphere.position.z > 300){
            this.isVisible = false;

            // IF NOT INTERSECTED
            if (!this.isTouched) {
                gameManager.missPortal();
            }
        }

    }
}

export default Portal
