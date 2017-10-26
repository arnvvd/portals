import NumberUtils from './utils/number-utils'
import {TweenMax} from 'gsap'
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

        // CURSOR
        this.cursor.update(this.DELTA_TIME);
        let cursorBox = this.cursor.cursorBBox;

        // TUNNEL CONTROLLER
        this.tunnelController.update(this.DELTA_TIME);

        // PORTALS CONTROLLER
        this.portalsController.update(this.DELTA_TIME, cursorBox);

        // RENDER
        Scene.render()
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
