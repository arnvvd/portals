import { colorManager } from '../utils/colorManager'
import Easing from '../utils/easing'
import Scene from '../scene/scene'

class Cursor {

    /**
     * @constructor
     */
    constructor(mousePosition) {
        this.mouse = mousePosition;
        this.radius = .2;
        this.positionZ = 290;
        this.color = new THREE.Color(`rgb(${colorManager.currentColor.color[0][0]}, ${colorManager.currentColor.color[0][1]}, ${colorManager.currentColor.color[0][2]})`);
        this.render();
    }


    render() {
        let geometry = new THREE.SphereGeometry( this.radius, 32, 32 );
        let material = new THREE.MeshBasicMaterial( {color: 0x00ffff} );
        this.cursor = new THREE.Mesh( geometry, material );


        // BOX
        this.cursorBBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());

        this.light = new THREE.PointLight(this.color, 3, 50); // soft white light
        let pointLightHelper = new THREE.PointLightHelper(this.light, .3);


        Scene.add(this.cursor);
        Scene.add(this.light);
    }


    updateCursorPosition(currentTime) {
        let vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 0);
        vector.unproject( Scene.camera );
        let dir = vector.sub( Scene.camera.position ).normalize();
        let distance = - (Scene.camera.position.z - this.positionZ) / dir.z;
        let pos = Scene.camera.position.clone().add( dir.multiplyScalar( distance ) );

        this.cursor.position.z = this.positionZ;
        this.cursor.position.x = Easing['easeOutCubic']( currentTime, this.cursor.position.x, pos.x - this.cursor.position.x, 300 );
        this.cursor.position.y = Easing['easeOutCubic']( currentTime, this.cursor.position.y, pos.y - this.cursor.position.y, 300 );

        this.light.position.x = -1 * this.cursor.position.x;
        this.light.position.y = -1 * this.cursor.position.y;
        this.light.position.z = this.cursor.position.z;

        this.cursorBBox.setFromObject(this.cursor);
    }


    update(currentTime) {
        this.updateCursorPosition(currentTime);
        this.color.setRGB(`rgb(${colorManager.currentColor.color[0][0]}, ${colorManager.currentColor.color[0][1]}, ${colorManager.currentColor.color[0][2]})`);
    }
}

export default Cursor
