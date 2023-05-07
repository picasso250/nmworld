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

var logo;

function preload ()
{
    // 加载图片资源
    this.load.image('logo', 'assets/logo.png');
}

function create ()
{
    // 添加图片到场景中
    logo = this.add.image(400, 300, 'logo');
}

function update ()
{
    // 随机移动图片
    logo.x += Phaser.Math.Between(-5, 5);
    logo.y += Phaser.Math.Between(-5, 5);
}