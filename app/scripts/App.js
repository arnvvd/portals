import {TweenMax} from 'gsap'
import Stats from 'stats-js'

/* IMPORT ASSETS */
import audio from '../assets/sound/kav.mp3'

/* IMPORT CLASSES */
import Scene from './scene/scene'

import AudioController from './controllers/audioController'
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
        this.initAudio();
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
     * initAudio
     */
    initAudio() {
        this.audioManager = new AudioController({
            audioSrc: audio,
            kickParams: {
                timestamp: 0,
                averageThresold: 250,
                timeThresold: 250,
                isPlaying: false
            },
            snareParams: {
                timestamp: 0,
                averageThresold: 115,
                timeThresold: 100,
                isPlaying: false
            }
        })
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

        // AUDIO MANAGER
        if (this.audioManager.canUpdate) {

            // Update
            this.audioManager.update();

            // On Kick
            this.getAudioEvent(
                this.audioManager.kickAverage,
                this.audioManager.kickParams,
                () => {
                    this.portalsController.addPortal();
                    console.log("boom");
                }
            );

            // On Snare
            this.getAudioEvent(
                this.audioManager.snareAverage,
                this.audioManager.snareParams,
                () => {

                }
            );
        }

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


    getAudioEvent(average, params, callback) {

        if (average > params.averageThresold){

            if (params.isPlaying) {
                params.timestamp += this.DELTA_TIME;

                if(params.timestamp > params.timeThresold) {
                    params.timestamp = 0;
                    params.isPlaying = false;
                }
            }

            if (!params.isPlaying) {
                callback();
                params.isPlaying = true;
            }
        }
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
