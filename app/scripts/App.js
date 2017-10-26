import NumberUtils from './utils/number-utils'
import {TweenMax} from 'gsap'
import Stats from 'stats-js'

import Scene from './scene/scene'

import PortalsController from './controllers/portalsController';
import TunnelController from './controllers/tunnelController';

import Cursor from './shapes/cursor';


class App {

    constructor() {
        this.DELTA_TIME = 0;
        this.LAST_TIME = Date.now();

        this.width = window.innerWidth;
        this.height = window.innerHeight;

        let root = document.body.querySelector( '#main' );
        root.appendChild( Scene.renderer.domElement );

        this.mouse = new THREE.Vector2(0, 0);
        this.direction_mouse = new THREE.Vector3(0, 0, 0);
        this.cameraPosition_mouse = new THREE.Vector3(0, 0, 0);
        this.cameraAmplitude = 2;
        this.cameraVelocity = 0.02;
        this.cameraDirection = -1; // -1 = follow mouse, 1 = reverse mouse

        this.stats = new Stats();
        this.stats.setMode(0); // 0: fps, 1: ms

        // Align top-left
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.left = '0px';
        this.stats.domElement.style.top = '0px';

        document.body.appendChild( this.stats.domElement );

        this.init();
        this.addListeners();
    }

    /**
     * init
     */
    init() {
        this.cursor = new Cursor(this.mouse);
        this.tunnelController = new TunnelController();
        this.portalsController = new PortalsController();
    }


    /**
     * addListeners
     */
    addListeners() {

        window.addEventListener( 'resize', this.onResize.bind(this) );
        window.addEventListener( 'mousemove', () => {
            this.mouse.x = (event.clientX / this.width - .5) * 2;
            this.mouse.y = -(event.clientY / this.height - .5) * 2;
        });
        window.addEventListener('click', () => {
            this.portalsController.addPortal();
        });
        TweenMax.ticker.addEventListener( 'tick', this.update.bind(this) )

    }


    /**
     * update
     * - Triggered on every TweenMax tick
     */
    update() {
        this.DELTA_TIME = Date.now() - this.LAST_TIME;
        this.LAST_TIME = Date.now();

        // START STATS
        this.stats.begin();

        // CURSOR
        this.cursor.update(this.DELTA_TIME);
        let cursorBox = this.cursor.cursorBBox;

        // TUNNEL CONTROLLER
        this.tunnelController.update(this.DELTA_TIME);

        // PORTALS CONTROLLER
        this.portalsController.update(this.DELTA_TIME, cursorBox);


        // CAMERA
        this.direction_mouse.subVectors(this.mouse, this.cameraPosition_mouse);
        this.direction_mouse.multiplyScalar(this.cameraVelocity);
        this.cameraPosition_mouse.addVectors(this.cameraPosition_mouse, this.direction_mouse);
        Scene.camera.position.x = - this.cameraPosition_mouse.x * this.cameraDirection * this.cameraAmplitude;
        Scene.camera.position.y = - this.cameraPosition_mouse.y * this.cameraDirection * this.cameraAmplitude;
        Scene.camera.lookAt(new THREE.Vector3(0,0,0));

        // RENDER
        Scene.render();

        // END STATS
        this.stats.end();
    }



    /**
     * onResize
     * - Triggered when window is resized
     * @param  {obj} evt
     */
    onResize( evt ) {

        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.scene.resize( this.width, this.height );
    }


}

export default App
