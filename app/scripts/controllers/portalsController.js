import { gameManager } from '../utils/gameManager';
import Scene from '../scene/scene'
import Portal from '../shapes/portal';


class PortalsController {

    /**
     * @constructor
     */
    constructor() {
        this.portals = [];
        this.addPortal();
    }


    addPortal() {
        let portal = new Portal();
        this.portals.push(portal);
        gameManager.createPortal();
    }


    removePortal() {
        this.portals = this.portals.slice(1, this.portals.length);
        //console.log(Scene.scene.children)
    }


    update(time, intersectBox) {
        this.portals.forEach((portal) => {
            portal.update(time, intersectBox);

            if (!portal.isVisible) {
                Scene.remove(portal.sphere);
                Scene.remove(portal.tori);
                this.removePortal();
            }
        })
    }
}

export default PortalsController
