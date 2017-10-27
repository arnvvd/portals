import { gameManager } from '../utils/gameManager';
import Scene from '../scene/scene'
import Portal from '../shapes/portal';


class UI {

    /**
     * @constructor
     */
    constructor() {
        this.bindUI();
        this.bindEvents();
    }

    bindUI() {
        this.ui = {};
        this.ui.introduction = document.querySelector('.introduction');
    }

    bindEvents() {

    }

    hideIntroduction() {
        this.ui.introduction.classList.remove('is-active');
    }

}

export default UI
