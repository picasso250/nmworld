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

function preload ()
{
    // 加载图片资源
    this.load.image('logo', 'assets/logo.png');
}

function create ()
{
    // 添加图片到场景中
    this.add.image(400, 300, 'logo');
}

function update ()
{
    // 游戏循环更新
}