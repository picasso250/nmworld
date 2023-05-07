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
    this.load.image('food', 'assets/food@8.png');
}

var angle;
var fpsText;
function create() {
    console.log(this)
    
    // 添加图片到场景中
    role = this.add.image(400, 300, 'role');
    // food = this.add.image(400, 300, 'food');

    // 添加点击事件监听器
    this.input.on('pointerdown', function (pointer) {
        // 在点击位置生成一个新的 food 图片
        var newFood = this.add.image(pointer.x, pointer.y, 'food');
    }, this);

     // 添加图片到场景中
     role1 = this.add.image(400, 300, 'role');
     role2 = this.add.image(500, 400, 'role');
 
     // 为每个 role 添加 text 对象，用于显示饥饿值
     role1.hungerText = this.add.text(role1.x, role1.y - 50, 'Hunger: 100', { fontSize: '16px', fill: '#fff' });
     role2.hungerText = this.add.text(role2.x, role2.y - 50, 'Hunger: 100', { fontSize: '16px', fill: '#fff' });

    angle = role.angle;

    // 创建文本对象
    fpsText = this.add.text(10, 10, 'FPS: 0', { font: '16px Arial', fill: '#ffffff' });
}

// 定义全局变量
var last_change_direction_time = 0;
var change_time_interval = 1000; // ms

// 更新角色位置和方向
function updateRolePositionAndDirection(role, angle, delta) {

    // 判断鼠标是否在 role 上方，如果是，则更新对应 role 的饥饿值显示
    if (role1.getBounds().contains(this.game.input.mousePointer.x, this.game.input.mousePointer.y)) {
        role1.hungerText.setText('Hunger: ' + role1.hunger);
    }
    if (role2.getBounds().contains(this.game.input.mousePointer.x, this.game.input.mousePointer.y)) {
        role2.hungerText.setText('Hunger: ' + role2.hunger);
    }

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