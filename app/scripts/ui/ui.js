class UI {

    /**
     * @constructor
     */
    constructor() {
        this.bindUI();
        this.showIntroduction();
    }

    bindUI() {
        this.ui = {};
        /* Introduction*/
        this.ui.introduction = document.querySelector('.introduction');
        this.ui.warning = document.querySelector('.warning');
        this.ui.loading = document.querySelector('.loading');
        this.ui.startBtn = document.querySelector('.btn--start');

        /* Score */
        this.ui.score = document.querySelector('.score');

        /* Recap */
        this.ui.recap = document.querySelector('.recap');

        /*Footer*/
        this.ui.footer = document.querySelector('.footer');
    }

    showIntroduction() {
        this.ui.introduction.classList.add('is-active');
        this.ui.footer.classList.add('is-active');
    }

    showLoader() {
        window.setTimeout(() => {
            this.ui.loading.classList.add('is-active')
        }, 600)
    }

    showWarning() {
        console.log('mobile');
        this.ui.warning.classList.add('is-active');
    }

    hideIntroduction() {
        this.ui.introduction.classList.remove('is-active');
        this.ui.startBtn.classList.remove('is-active');
        this.ui.footer.classList.remove('is-active');
        /* Show Score*/
        this.showScore();
    }

    removeLoading() {
        this.ui.loading.classList.remove('is-active');
        this.ui.startBtn.classList.add('is-active');
    }

    showScore() {
        this.ui.score.classList.add('is-active');
    }

    hideScore() {
        this.ui.score.classList.remove('is-active');
        this.showRecap();
    }

    showRecap() {
        this.ui.recap.classList.add('is-active');
        this.ui.footer.classList.add('is-active');
    }
}

export let Ui = new UI();
