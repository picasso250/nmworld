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

function update (time, delta)
{
    // 随机移动图片
    var angle = Phaser.Math.Angle.Between(0, 0, Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100));
    var distance = Phaser.Math.Between(1, 5);
    var vector = new Phaser.Math.Vector2(distance * 0.5 * delta / 16.6667, 0); // 16.6667 是 1000 / 60，即每帧的时间
    Phaser.Math.Rotate(vector, angle);
    role.x += vector.x;
    role.y += vector.y;
}