import { colorManager } from '../utils/colorManager'
import Easing from '../utils/easing'
import Scene from '../scene/scene'

import vertShader from '../shaders/vertShader.vert'
import fragShader from '../shaders/fragShader.frag'


class Cursor {

    /**
     * @constructor
     */
    constructor(mousePosition) {
        this.mouse = mousePosition;
        this.radius = .2;
        this.sphereParticleradius2 = .2;
        this.sphereCursorRadius = .08;
        this.positionZ = 290;
        this.particlesLength = 500;
        this.particleArr = [];
        this.currentTime = 0;
        this.color = new THREE.Color(`rgb(${colorManager.currentColor.color[0][0]}, ${colorManager.currentColor.color[0][1]}, ${colorManager.currentColor.color[0][2]})`);
        this.render();
    }



    render() {

        // CURSOR
        let geometry = new THREE.SphereGeometry( this.radius, 4, 4 );
        let material = new THREE.MeshBasicMaterial( {
            transparent: true,
            opacity: 0
        } );
        this.cursor = new THREE.Mesh( geometry, material );


        // BOX
        this.cursorBBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());


        // PARTICULE CURSOR
        let particleCursorGeometry = new THREE.SphereGeometry( this.sphereCursorRadius, 6, 6 );
        let particleCursorMaterial = new THREE.MeshLambertMaterial({
            color: 0x222222,
            emissive: 0xFFFFFF
        });
        this.particleCursor = new THREE.Mesh( particleCursorGeometry, particleCursorMaterial );
        this.particleCursor.position.copy(this.cursor.position);


        // PARTICLE SPHERE
        this.sphereGeometry = new THREE.Geometry();

        for ( let i = 0; i < this.particlesLength; i ++ )   {

            let particle = new THREE.Vector3();


            this.alpha = Math.random() * (Math.PI);
            this.theta = Math.random() * (Math.PI * 2);

            particle.x = this.sphereParticleradius2 * Math.cos(this.alpha) * Math.sin(this.theta);
            particle.y = this.sphereParticleradius2 * Math.sin(this.alpha) * Math.sin(this.theta);
            particle.z = this.sphereParticleradius2 * Math.cos(this.theta);

            this.sphereGeometry.vertices.push( particle );
            this.particleArr.push( particle );
        }

        // SPHERE MATERIAL
        this.sphereMaterial = new THREE.ShaderMaterial( {
            uniforms: THREE.UniformsUtils.merge( [
                THREE.UniformsLib.common,
                THREE.UniformsLib.specularmap,
                THREE.UniformsLib.envmap,
                THREE.UniformsLib.aomap,
                THREE.UniformsLib.lightmap,
                THREE.UniformsLib.fog,
                THREE.UniformsLib[ "lights" ],
                {
                    u_time: { type: "f", value: 1.0 },
                    u_amplitude: {type: "f", value: 1.0}
                }
            ] ),
            vertexShader: vertShader,
            fragmentShader: fragShader,
            fog: true,
            lights: true
        } );


        // SET TORI POINTS
        this.sphere = new THREE.Points( this.sphereGeometry, this.sphereMaterial );
        this.sphere.position.copy(this.cursor.position);


        // LIGHT
        this.light = new THREE.PointLight("#FFFFFF", 3, 100); // soft white light
        let pointLightHelper = new THREE.PointLightHelper(this.light, .3);



        // BOX HELPER
        /*var object = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( 0xff0000 ) );
        this.box = new THREE.BoxHelper( object, 0xffff00 );
        this.box.setFromObject(this.cursor);
        Scene.add( this.box );*/


        Scene.add(this.cursor);
        Scene.add(this.sphere);
        Scene.add(this.light);
        Scene.add(this.particleCursor);
    }


    updateCursorPosition(mouse, currentTime) {

        // FOLLOW MOUSE
        let vector = new THREE.Vector3(mouse.x, mouse.y, 0);
        vector.unproject( Scene.camera );
        let dir = vector.sub( Scene.camera.position ).normalize();
        let distance = - (Scene.camera.position.z - this.positionZ) / dir.z;
        let pos = Scene.camera.position.clone().add( dir.multiplyScalar( distance ) );


        // EASING FOLLOW MOUSE
        this.cursor.position.z = this.positionZ;
        this.cursor.position.x = Easing['easeOutCubic']( currentTime, this.cursor.position.x, pos.x - this.cursor.position.x, 300 );
        this.cursor.position.y = Easing['easeOutCubic']( currentTime, this.cursor.position.y, pos.y - this.cursor.position.y, 300 );

        // MOUSE LIGHT
        this.light.position.x = -1 * this.cursor.position.x;
        this.light.position.y = -1 * this.cursor.position.y;
        this.light.position.z = this.cursor.position.z;

        // MOUSE BOX
        this.cursorBBox.setFromObject(this.cursor);
    }


    update(mouse, currentTime) {

        // TIME
        this.currentTime += currentTime / 500;
        this.sphereMaterial.uniforms.u_time.value = this.currentTime;

        // UPDATE BOX
        //this.box.update();

        // UPDATE SPHERE CURSOR
        this.particleCursor.position.copy(this.cursor.position);

        // UPDATE SPHERE SHADER
        this.sphere.position.copy(this.cursor.position);

        // UPDATE CURSOR
        this.updateCursorPosition(mouse, currentTime);

        // UPDATE COLOR
        this.color.setRGB(`rgb(${colorManager.currentColor.color[0][0]}, ${colorManager.currentColor.color[0][1]}, ${colorManager.currentColor.color[0][2]})`);
    }
}

export default Cursor
