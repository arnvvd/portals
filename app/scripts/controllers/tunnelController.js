import Scene from '../scene/scene'
import Stars from '../shapes/stars';
import Dust from '../shapes/dust';
import Tunnel from '../shapes/tunnel';
import Neon from '../shapes/neon';
import Door from '../shapes/door'

class TunnelController {

    /**
     * @constructor
     */
    constructor() {
        this.init();
    }

    /**
     * init
     */
    init() {
        this.tunnel = new Tunnel();
        this.neon = new Neon();
        this.stars = new Stars();
        this.dust = new Dust();
        this.door = new Door();
    }

    update(audioAverage) {
        // LINES
        this.stars.update(audioAverage);
        this.tunnel.update();
        this.neon.update(audioAverage);
        this.dust.update();
        this.door.update(audioAverage);
    }
}

export default TunnelController
