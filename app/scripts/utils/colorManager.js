class ColorManager {

    constructor(){
        this.currentColor = {};

        // AssociatedColor
        this.colors = [
            {
                isActive: false,
                color: [ ['199', '15', '95'], ['255', '239', '239'] ] // Pink
            },
            {
                isActive: false,
                color: [ ['6', '51', '255'], ['255', '255', '255'] ] // Blue
            }
        ];

        // Set Init Color
        this.changeCurrentColor();
    }


    changeCurrentColor() {
        let nextColors = this.colors.filter((color) => {
            return color.isActive != true;
        });

        let currentColor = nextColors[Math.floor(Math.random() * nextColors.length)];

        // Remove isActive
        this.colors.forEach((color) => {
            color.isActive = false;
        });

        currentColor.isActive = true;

        this.currentColor = currentColor;
    }
}

export let colorManager = new ColorManager();
