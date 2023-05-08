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

    // 添加点击事件监听器
    this.input.on('pointerdown', function (pointer) {
        // 在点击位置生成一个新的 food 图片
        var newFood = this.add.image(pointer.x, pointer.y, 'food');
    }, this);

    // 添加图片到场景中
    role1 = addRole.call(this, 400, 300, 'role', 11);
    role2 = addRole.call(this, 500, 400, 'role', 22);

    // 创建文本对象
    fpsText = this.add.text(10, 10, 'FPS: 0', { font: '16px Arial', fill: '#ffffff' });
}

const HUNGER_MAX = 100;
var role_list = [];
function addRole(x, y, texture, hunger) {
    const role = this.add.image(x, y, texture);
    role.direction = 0;
    role.hunger = hunger;
    role.hungerText = this.add.text(x, y - 50, ``, { fontSize: '16px', fill: '#fff' });

    role.last_change_direction_time = 0;
    role.change_time_interval = 1000; // ms

    role_list.push(role);
    return role;
}

// 更新角色位置和方向
function updateRolePositionAndDirection(role, delta) {
    var speed = 0.2;
    var distance = Phaser.Math.Between(1, 5);
    var vector = new Phaser.Math.Vector2(distance * speed * delta / 16.6667, 0); // 16.6667 是 1000 / 60，即每帧的时间
    Phaser.Math.Rotate(vector, role.direction);
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

    role.hungerText.x = role.x;
    role.hungerText.y = role.y;
}

// 改变角色方向
function changeRoleDirection(role, time) {
    if (time > role.last_change_direction_time + role.change_time_interval) {
        console.log("change ", role.hunger)
        role.direction = Phaser.Math.FloatBetween(0, Math.PI * 2);
        role.last_change_direction_time = time;
        role.change_time_interval = Phaser.Math.Between(1, 6) * 1000; // ms
    }
}

function update(time, delta) {
    // 更新实时帧数
    fpsText.setText('FPS: ' + Math.round(game.loop.actualFps));

    for (let role of role_list) {
        // 改变角色方向
        changeRoleDirection(role, time);

        // 更新角色位置和方向
        updateRolePositionAndDirection.call(this, role, delta);

        function updateHungerText(role) {
            if (role.getBounds().contains(this.game.input.mousePointer.x, this.game.input.mousePointer.y)) {
                role.hungerText.setText(`Hunger: ${role.hunger}`);
                this.time.delayedCall(1000, () => {
                    role.hungerText.setText('');
                });
            }
        }

        updateHungerText.call(this, role);
    }

}