import { colorManager } from '../utils/colorManager'
import OrbitControls from 'imports-loader?THREE=three!exports-loader?THREE.OrbitControls!three/examples/js/controls/OrbitControls' // eslint-disable-line
import EffectComposer from 'imports-loader?THREE=three!exports-loader?THREE.EffectComposer!three/examples/js/postprocessing/EffectComposer' // eslint-disable-line
import RenderPass from 'imports-loader?THREE=three!exports-loader?THREE.RenderPass!three/examples/js/postprocessing/RenderPass' // eslint-disable-line
import MaskPass from 'imports-loader?THREE=three!exports-loader?THREE.MaskPass!three/examples/js/postprocessing/MaskPass' // eslint-disable-line
import ShaderPass from 'imports-loader?THREE=three!exports-loader?THREE.ShaderPass!three/examples/js/postprocessing/ShaderPass' // eslint-disable-line
import CopyShader from 'imports-loader?THREE=three!exports-loader?THREE.CopyShader!three/examples/js/shaders/CopyShader' // eslint-disable-line
import FXAAShader from 'imports-loader?THREE=three!exports-loader?THREE.FXAAShader!three/examples/js/shaders/FXAAShader' // eslint-disable-line
import ConvolutionShader from 'imports-loader?THREE=three!exports-loader?THREE.ConvolutionShader!three/examples/js/shaders/ConvolutionShader' // eslint-disable-line
import LuminosityHighPassShader from 'imports-loader?THREE=three!exports-loader?THREE.LuminosityHighPassShader!three/examples/js/shaders/LuminosityHighPassShader' // eslint-disable-line
import UnrealBloomPass from 'imports-loader?THREE=three!exports-loader?THREE.UnrealBloomPass!three/examples/js/postprocessing/UnrealBloomPass' // eslint-disable-line


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

        this.initPostProcessing();
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


    initPostProcessing() {
        //POST PROCESSING
        //Create Effects Composer
        this.composer = new THREE.EffectComposer( this.renderer);
        this.composer.setSize(this.width, window.innerHeight);
        //Create Shader Passes
        this.renderScene = new RenderPass(this.scene, this.camera);
        this.effectFXAA = new ShaderPass(THREE.FXAAShader);
        this.effectFXAA.uniforms['resolution'].value.set(1 / this.width, 1 / this.height);
        this.copyShader = new ShaderPass(THREE.CopyShader);
        this.bloomPass = new UnrealBloomPass(new THREE.Vector2(this.width, this.height), 1, 0.4, 0.6);
        //Add Shader Passes to Composer - order is important
        this.composer.addPass(this.renderScene);
        this.composer.addPass(this.effectFXAA);
        this.composer.addPass(this.bloomPass);
        this.composer.addPass(this.copyShader);
        //set last pass in composer chain to renderToScreen
        this.copyShader.renderToScreen = true;
    }


    /**
     * Renders/Draw the scene
     */
    render() {
        //let color = new THREE.Color(`rgb(${colorManager.currentColor.color[0][0]}, ${colorManager.currentColor.color[0][1]}, ${colorManager.currentColor.color[0][2]})`);
        let color = new THREE.Color('#35192a');
        this.renderer.render( this.scene, this.camera );
        this.renderer.setClearColor(color, 1);


        this.composer.render();
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
