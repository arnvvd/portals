import { gameManager } from '../utils/gameManager';
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
        // Check Boost
        this.boost = gameManager.boost;
        // Dust
        this.dust.update(this.boost);
        // Tunnel
        this.tunnel.update(this.boost);

        // Lines
        this.stars.update(this.boost, audioAverage);

        if (gameManager.gameIsStarted) {
            // Chevron
            this.neon.update(this.boost, audioAverage);
            // Doors
            this.door.update(this.boost, audioAverage);
        }
    }
}

export default TunnelController
