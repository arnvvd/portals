import Scene from '../scene/scene'
import texture from '../../assets/textures/texture2.jpg'

class Tunnel {
    constructor() {
        this.init();
        this.test = 0
        this.fasting = false
    }

    init() {
        this.texture = new THREE.TextureLoader().load( texture );
        this.texture.wrapS = THREE.RepeatWrapping;

        this.geometry = new THREE.CylinderBufferGeometry( 15, 0, 600, 128, 128, true);
        this.material = new THREE.MeshBasicMaterial( {
            map: this.texture,
            side: THREE.DoubleSide,
        } );

        this.tunnel = new THREE.Mesh( this.geometry, this.material );
        Scene.scene.add(this.tunnel);
        this.tunnel.rotation.x = Math.PI / 2;
    }

    update() {
        this.texture.offset.y -= 0.0005;
        this.texture.offset.y %= 1;
    }
}

export default Tunnel
