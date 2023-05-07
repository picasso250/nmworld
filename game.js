var gameWidth= 800;
var gameHeight= 600;

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

var role;

function preload() {
    // 加载图片资源
    this.load.image('role', 'assets/role@4.png');
}

var angle;
var fpsText;
function create() {
    // 添加图片到场景中
    role = this.add.image(400, 300, 'role');

    angle = role.angle;

    // 创建文本对象
    fpsText = this.add.text(10, 10, 'FPS: 0', { font: '16px Arial', fill: '#ffffff' });
}

// 定义全局变量
var last_change_direction_time = 0;
var change_time_interval = 1000; // ms

// 更新角色位置和方向
function updateRolePositionAndDirection(role, angle, delta) {
    var speed = 0.2;
    var distance = Phaser.Math.Between(1, 5);
    var vector = new Phaser.Math.Vector2(distance * speed * delta / 16.6667, 0); // 16.6667 是 1000 / 60，即每帧的时间
    Phaser.Math.Rotate(vector, angle);
    role.x += vector.x;
    role.y += vector.y;

    // 判断角色是否超出屏幕边界
    if (role.x < 0) {
        role.x = 0;
    } else if (role.x > gameWidth) {
        role.x = gameWidth;
    }
    if (role.y < 0) {
        role.y = 0;
    } else if (role.y > gameHeight) {
        role.y = gameHeight;
    }
}

// 改变角色方向
function changeRoleDirection(time) {
    if (time > last_change_direction_time + change_time_interval) {
        angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
        last_change_direction_time = time;
        change_time_interval = Phaser.Math.Between(1, 6) * 1000; // ms
    }
}

function update(time, delta) {
    // 更新实时帧数
    fpsText.setText('FPS: ' + Math.round(game.loop.actualFps));

    // 改变角色方向
    changeRoleDirection(time);

    // 更新角色位置和方向
    updateRolePositionAndDirection(role, angle, delta);
}