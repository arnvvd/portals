import Scene from '../scene/scene'
import Stars from '../shapes/stars';
import Tunnel from '../shapes/tunnel';
import Neon from '../shapes/neon';

class TunnelController {

    /**
     * @constructor
     */
    constructor() {
        this.tunnelElements = [];

        this.init();
    }

    /**
     * init
     */
    init() {
        this.tunnel = new Tunnel();
        this.neon = new Neon();
        this.stars = new Stars();
    }

    update(time) {
        // LINES
        this.stars.update();
        this.tunnel.update();
        this.neon.update();
    }
}

export default TunnelController
