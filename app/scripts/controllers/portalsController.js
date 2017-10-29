import { gameManager } from '../utils/gameManager';
import Scene from '../scene/scene'
import Portal from '../shapes/portal';


class PortalsController {

    /**
     * @constructor
     */
    constructor() {
        this.portals = [];
    }


    addPortal() {
        let portal = new Portal(gameManager.boostReady);
        if (gameManager.boostReady) {
            gameManager.boostReady = false;
        }
        this.portals.push(portal);
    }


    removePortal() {
        this.portals = this.portals.slice(1, this.portals.length);
    }


    update(time, intersectBox) {

        // Calc Scale with GameManager
        let scale = 1 - gameManager.level / 10;

        // Update each portals
        this.portals.forEach((portal) => {
            portal.update(time, intersectBox, scale);

            if (!portal.isVisible) {
                Scene.remove(portal.sphere);
                Scene.remove(portal.tori);
                this.removePortal();
            }
        })
    }
}

export default PortalsController
