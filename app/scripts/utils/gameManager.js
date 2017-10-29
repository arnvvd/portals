class GameManager {

    constructor(){
        // Main Infos
        this.score = 0;
        this.lastScore = null;
        this.level = 0;

        // Portals
        this.portalsTouched = 0;
        this.portalsSequence = 0;
        this.portalsMissed = 0;

        // Boost
        this.boostReady = false;
        this.boost = false;

        // Debug
        this.debugActive = false;

        this.bindUI();
    }

    bindUI() {
        this.ui = {};
        this.ui.score = document.querySelector('.score-data');
        this.ui.boost = document.querySelector('.boost-data');
        this.ui.level = document.querySelector('.level-data');
        this.ui.crossed = document.querySelector('.crossed-data');
    }

    touchPortal(boost) {
        this.portalsTouched++;

        // Incremente
        if (!this.boostReady && !this.boost) {
            this.portalsSequence++;
        }

        // If portal is a boost portal
        if (boost) {
            this.score += 200;
            this.lastScore = "+200";
            this.playBoost();
        } else {
            this.score += 10;
            this.lastScore = "+10";
        }

        // if sequence = 20
        if (this.portalsSequence === 20) {
            this.boostReady = true;
        } else {
            this.boostReady = false;
        }

        if (this.debugActive) {
            this.debug();
        }

        this.updateUIScore();
        this.updateLevel();
    }



    missPortal() {
        this.portalsMissed++;

        this.portalsSequence = 0;
        this.boostReady = false;

        if (this.score > 0) {
            this.score -= 10;
            this.lastScore = "-10";
        }

        if (this.debugActive) {
            this.debug();
        }

        this.updateUIScore();
    }



    playBoost() {
        this.boostReady = false;
        this.boost = true;
        setTimeout(() => {
            this.boost = false;
            this.portalsSequence = 0;
        }, 3000)
    }



    updateLevel() {
        if (this.portalsTouched > 350) {
            this.level = 5;
        } else if (this.portalsTouched > 250) {
            this.level = 4;
        } else if (this.portalsTouched > 175) {
            this.level = 3;
        } else if (this.portalsTouched > 100) {
            this.level = 2;
        } else if (this.portalsTouched > 50) {
            this.level = 1;
        }
    }


    updateUIScore() {
        this.ui.score.innerHTML = this.score;
        this.ui.boost.innerHTML = 20 - this.portalsSequence >= 0 ? 20 - this.portalsSequence : 0;
        this.ui.crossed.innerHTML = this.portalsTouched;
        this.ui.level.innerHTML = this.level;
    }



    debug() {
        console.log(" ----------------------------- ");
        console.log("Score: " + this.score);
        console.log("Last Score: " + this.lastScore);
        console.log("portalsTouched: " + this.portalsTouched);
        console.log("portalsMissed: " + this.portalsMissed);
        console.log("boostReady: " + this.boostReady);
        console.log("boost: " + this.boost);
        console.log(" ----------------------------- ");
    }

}

export let gameManager = new GameManager();
