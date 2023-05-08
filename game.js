var gameWidth = 800;
var gameHeight = 600;

var config = {
    type: Phaser.AUTO,
    width: gameWidth,
    height: gameHeight,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload() {
    // 加载图片资源
    this.load.image('role', 'assets/role@4.png');
    this.load.image('food', 'assets/food@8.png');
}


var fpsText;
function create() {

    // 添加图片到场景中
    role1 = new Role(this, 400, 300, 'role', 11, 50);
    role2 = new Role(this, 500, 400, 'role', 22, 50);

    this.roleGroup = this.add.group();
    this.roleGroup.add(role1);
    this.roleGroup.add(role2);

    this.foodGroup = this.add.group();
    this.input.on('pointerdown', function (pointer) {
        // 在点击位置生成一个新的 food 图片
        var newFood = new Food(this, pointer.x, pointer.y, 'food', 80);
        this.foodGroup.add(newFood);
    }, this);

    // 创建文本对象
    fpsText = this.add.text(10, 10, 'FPS: 0', { font: '16px Arial', fill: '#ffffff' });
}

function update(time, delta) {
    // 更新实时帧数
    fpsText.setText('FPS: ' + Math.round(game.loop.actualFps));

    this.roleGroup.children.iterate(function (role) {
        role.update(time, delta);
    });
}