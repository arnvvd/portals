class GameManager {

    constructor(){
        // Main Infos
        this.score = 0;
        this.lastScore = null;
        this.level = 0;

        // Portals
        this.portalsCreated = 0;
        this.portalsTouched = 0;
        this.portalsSequence = 0;
        this.portalsSequenceMax = 0;
        this.portalsMissed = 0;

        // Boost
        this.boostReady = false;
        this.boost = false;

        // UI
        this.scoreUI = document.querySelector('.score--value');
        this.scoreSequenceUI = document.querySelector('.score--serie');

        // Debug
        this.debugActive = true;
    }



    createPortal() {
        this.portalsCreated++;

        if (this.portalsSequence % 20 === 0 && this.portalsSequence > 0) {
            this.boostReady = true;
        } else {
            this.boostReady = false;
        }

    }



    touchPortal() {
        this.portalsTouched++;
        this.portalsSequence++;

        if (this.boostReady) {
            this.score += 200;
            this.lastScore = "+200";
            this.playBoost();
            this.boostReady = false;
        } else {
            this.score += 10;
            this.lastScore = "+10";
        }

        if (this.debugActive) {
            this.debug();
        }

        this.updateUIScore();
    }



    missPortal() {
        this.portalsMissed++;

        if (this.portalsSequence > this.portalsSequenceMax) {
            this.portalsSequenceMax = this.portalsSequence
        }

        this.portalsSequence = 0;

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
        this.boost = true;
        setTimeout(() => {
            this.boost = false;
        }, 3000)
    }



    levelUp() {
        this.level++;
    }


    updateUIScore() {
        this.scoreUI.innerHTML = this.score;
        this.scoreSequenceUI.innerHTML = this.portalsSequenceMax;
    }



    debug() {
        console.log(" ----------------------------- ");
        console.log("Score: " + this.score);
        console.log("Last Score: " + this.lastScore);
        console.log("portalsCreated: " + this.portalsCreated);
        console.log("portalsTouched: " + this.portalsTouched);
        console.log("portalsSequence: " + this.portalsSequence);
        console.log("portalsMissed: " + this.portalsMissed);
        console.log("boostReady: " + this.boostReady);
        console.log("boost: " + this.boost);
        console.log(" ----------------------------- ");

    }

}

export let gameManager = new GameManager();
