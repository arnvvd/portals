import { colorManager } from '../utils/colorManager'
import Scene from '../scene/scene'

import vertShader from '../shaders/tori/tori.vert'
import fragShader from '../shaders/tori/tori.frag'

class Portal {

    /**
     * @constructor
     */
    constructor() {
        this.radius = .8;
        this.particlesLength = 1000;
        this.isVisible = true;
        this.isTouched = false;
        this.particleArr = [];
        this.particleAmplitudeArr = [];
        this.currentTime = 0;
        this.render();

    }


    render() {

        // SPHERE
        let sphereGeometry = new THREE.SphereGeometry( this.radius, 32, 32 );
        let sphereMaterial = new THREE.MeshBasicMaterial( {
            //color: "#FFFFFF",
            transparent: true,
            opacity: 0
        } );
        this.sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );

        let positionX = Math.floor(Math.random() * 2) + 1;
        let positionY = Math.floor(Math.random() * 2) + 1;
        let multiplicateurX = Math.floor(Math.random() * 2) === 0 ? -1 : 1;
        let multiplicateurY = Math.floor(Math.random() * 2) === 0 ? -1 : 1;

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

            let particleAmplitude = new THREE.Vector3();
            particleAmplitude.copy(particle);
            particleAmplitude.multiplyScalar(2);

            this.toriGeometry.vertices.push( particle );
            this.particleArr.push( particle );
            this.particleAmplitudeArr.push(particleAmplitude);
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
                    u_amplitude: {type: "f", value: 1.0}
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


    update(time, intersectBox) {

        // TIME
        this.currentTime += time / 1000;
        this.toriMaterial.uniforms.u_time.value = this.currentTime;

        // UPDATE SPHERE POSITION
        this.sphere.position.z += .5;
        this.tori.position.copy(this.sphere.position);

        // UPDATE BOX
        this.portalBBox.setFromObject(this.sphere);

        // IF INTERSECTED
        if (this.portalBBox.intersectsBox(intersectBox) && !this.isTouched) {
            this.isTouched = true;
            //this.toriMaterial.uniforms.u_amplitude.value = 1.2;
            console.log('done');
            colorManager.changeCurrentColor();
            this.toriGeometry.verticesNeedUpdate = true;
            for(var i=0; i< this.particlesLength; i++){

                this.particleArr[i].x += (this.particleAmplitudeArr[i].x - this.particleArr[i].x) * 0.2;
                this.particleArr[i].y += (this.particleAmplitudeArr[i].y - this.particleArr[i].y) * 0.2;
                this.particleArr[i].z += (this.particleAmplitudeArr[i].z - this.particleArr[i].z) * 0.2;
            }
        }

        // CHANGE STATUS
        if (this.sphere.position.z > 300){
            this.isVisible = false;
        }

    }
}

export default Portal
