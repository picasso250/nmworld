class Food extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, nutrition) {
        super(scene, x, y, texture);
        this.nutrition = nutrition;
        scene.add.existing(this);
    }

}