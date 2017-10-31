import {TweenMax} from 'gsap'
import Stats from 'stats-js'
import MobileDetect from 'mobile-detect'

/* IMPORT ASSETS */
import audio from '../assets/sound/kav.mp3'

/* IMPORT CLASSES */
import Scene from './scene/scene'
import { Ui } from './ui/ui'
import { gameManager } from './utils/gameManager';

import AudioController from './controllers/audioController'
import PortalsController from './controllers/portalsController';
import TunnelController from './controllers/tunnelController';

import Cursor from './shapes/cursor';


class App {

    constructor() {

        // TIME
        this.DELTA_TIME = 0;
        this.LAST_TIME = Date.now();

        // SIZE
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        // ROOT
        this.root = document.body.querySelector( '.experiment' );
        this.root.appendChild( Scene.renderer.domElement );

        // MOUSE & CAMERA
        this.mouse = new THREE.Vector2(0, 0);
        this.direction_mouse = new THREE.Vector3(0, 0, 0);
        this.cameraPosition_mouse = new THREE.Vector3(0, 0, 0);
        this.cameraAmplitude = 2;
        this.cameraVelocity = 0.02;
        this.cameraDirection = -1; // -1 = follow mouse, 1 = reverse mouse

        // STATS
        this.stats = new Stats();
        this.stats.setMode(0); // 0: fps, 1: ms
        // Align top-left
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.left = '0px';
        this.stats.domElement.style.top = '0px';
        document.body.appendChild( this.stats.domElement );

        // IS MOBILE
        let md = new MobileDetect(window.navigator.userAgent);
        if (md.mobile()) {
            this.isMobile = true;
        } else {
            this.isMobile = false;
        }

        // EXEC
        this.init();
        this.bindUI();
        // IF is mobile show UI and particles but dont load audio
        if (!this.isMobile) {
            this.initAudio();
        }

        this.bindEvents();
    }


    /**
     * init
     */
    init() {
        this.cursor = new Cursor(this.mouse);
        this.tunnelController = new TunnelController();
        this.portalsController = new PortalsController();

        if (this.isMobile) {
            Ui.showWarning();
        } else {
            Ui.showLoader();
        }
    }


    /**
     * UI
     */
    bindUI() {
        this.ui = {};
        this.ui.startBtn = document.querySelector('.btn--start');
    }


    /**
     * initAudio
     */
    initAudio() {
        this.audioManager = new AudioController({
            audioSrc: audio,
            kickParams: {
                timestamp: 0,
                averageThresold: 252,
                timeThresold: 250,
                isPlaying: false
            }
        })
    }


    /**
     * bindEvents
     */
    bindEvents() {
        // RESIZE
        window.addEventListener( 'resize', this.onResize.bind(this) );

        //MOUSEMOVE
        window.addEventListener( 'mousemove', (e) => {
            e.preventDefault();
            this.mouse.x = (e.clientX / this.width) * 2 - 1;
            this.mouse.y = -(e.clientY / this.height) * 2 + 1;
        });

        // MOUSE CLICK
        this.ui.startBtn.addEventListener('click', () => {
            this.audioManager.play();
            gameManager.gameIsStarted = true;
            Ui.hideIntroduction();
        });

        // RAF
        TweenMax.ticker.addEventListener( 'tick', this.update.bind(this) )
    }


    /**
     * update
     * - Triggered on every TweenMax tick
     */
    update() {

        if (this.stats) {
            // START STATS
            this.stats.begin();
        }

        // TIME
        this.DELTA_TIME = Date.now() - this.LAST_TIME;
        this.LAST_TIME = Date.now();


        // AUDIO MANAGER
        let defaultAverage = 0;

        if (this.audioManager && this.audioManager.canUpdate) {

            // Update
            this.audioManager.update();

            // On Kick
            this.getAudioEvent(
                this.audioManager.kickAverage,
                this.audioManager.kickParams,
                () => {
                    this.portalsController.addPortal();
                }
            );

            // Default average
            defaultAverage = this.audioManager.defaultAverage;
        }


        // CURSOR
        this.cursor.update(this.mouse, this.DELTA_TIME);
        let cursorBox = this.cursor.cursorBBox;


        // TUNNEL CONTROLLER
        this.tunnelController.update(defaultAverage);


        // PORTALS CONTROLLER
        if (gameManager.gameIsStarted) {
            this.portalsController.update(this.DELTA_TIME, cursorBox);
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


        if (this.stats) {
            // END STATS
            this.stats.end();
        }

    }


    /**
    * GetAudioEvent
    **/

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
        Scene.camera.aspect = window.innerWidth / window.innerHeight;
        Scene.camera.updateProjectionMatrix();
        Scene.renderer.setSize( window.innerWidth, window.innerHeight );
    }

}

export default App
