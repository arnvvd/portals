import { colorManager } from '../utils/colorManager'
import OrbitControls from 'imports-loader?THREE=three!exports-loader?THREE.OrbitControls!three/examples/js/controls/OrbitControls' // eslint-disable-line

/*
 scene.js
 */

class Scene {

    /**
     * @constructor
     */
    constructor() {

        this.width = window.innerWidth;
        this.height = window.innerHeight;


        this.renderer = new THREE.WebGLRenderer( this.width, this.height, { antialias: true } );
        this.camera = new THREE.PerspectiveCamera( 50, this.width / this.height, 1, 300 );
        this.scene = new THREE.Scene();
        //this.scene.fog = new THREE.Fog(`rgb(${colorManager.currentColor.color[0][0]}, ${colorManager.currentColor.color[0][1]}, ${colorManager.currentColor.color[0][2]})`, 15, 100);
        this.scene.fog = new THREE.Fog('#35192a', 15, 50);

        this.renderer.setSize( this.width, this.height );

        //this.controls = new OrbitControls(this.camera, this.renderer.domElement);


        this.camera.position.z = 300;
    }

    /**
     * Add a child to the scene
     *
     * @param {Obj} child - a THREE object
     */
    add( child ) {

        this.scene.add( child )

    }

    /**
     * Remove a child from the scene
     *
     * @param {Obj} child - a THREE object
     */
    remove( child ) {

        this.scene.remove( child )

    }

    /**
     * Renders/Draw the scene
     */
    render() {
        //let color = new THREE.Color(`rgb(${colorManager.currentColor.color[0][0]}, ${colorManager.currentColor.color[0][1]}, ${colorManager.currentColor.color[0][2]})`);
        let color = new THREE.Color('#35192a');
        this.renderer.render( this.scene, this.camera );
        this.renderer.setClearColor(color, 1);
    }

    /**
     * Resize the scene according to screen size
     *
     * @param {Number} newWidth
     * @param {Number} newHeight
     */
    resize( newWidth, newHeight ) {

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize( newWidth, newHeight );
    }

}

export default (new Scene)
