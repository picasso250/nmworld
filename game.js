var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var role;

function preload ()
{
    // 加载图片资源
    this.load.image('role', 'assets/role@4.png');
}

function create ()
{
    // 添加图片到场景中
    role = this.add.image(400, 300, 'role');
}

function update ()
{
    // 随机移动图片
    role.x += Phaser.Math.Between(-5, 5);
    role.y += Phaser.Math.Between(-5, 5);
}