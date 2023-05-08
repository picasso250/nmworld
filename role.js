
class Role extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, hunger) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);

        this.direction = 0;
        this.hunger = hunger;
        this.hungerText = scene.add.text(x, y - 50, ``, { fontSize: '16px', fill: '#fff' });

        this.last_change_direction_time = 0;
        this.change_time_interval = 1000; // ms
    }

    update(time, delta) {
        // 改变角色方向
        this.changeRoleDirection(time);

        // 更新角色位置和方向
        this.updateRolePositionAndDirection(delta);

        // 更新饥饿度文本
        this.updateHungerText();
    }

    // 更新角色位置和方向
    updateRolePositionAndDirection(delta) {
        var speed = 0.2;
        var distance = Phaser.Math.Between(1, 5);
        var vector = new Phaser.Math.Vector2(distance * speed * delta / 16.6667, 0); // 16.6667 是 1000 / 60，即每帧的时间
        Phaser.Math.Rotate(vector, this.direction);
        this.x += vector.x;
        this.y += vector.y;

        // 判断角色是否超出屏幕边界
        if (this.x < 0) {
            this.x = 0;
        } else if (this.x > gameWidth) {
            this.x = gameWidth;
        }
        if (this.y < 0) {
            this.y = 0;
        } else if (this.y > gameHeight) {
            this.y = gameHeight;
        }

        this.hungerText.x = this.x;
        this.hungerText.y = this.y;
    }

    // 改变角色方向
    changeRoleDirection(time) {
        if (time > this.last_change_direction_time + this.change_time_interval) {
            console.log("change ", this.hunger)
            this.direction = Phaser.Math.FloatBetween(0, Math.PI * 2);
            this.last_change_direction_time = time;
            this.change_time_interval = Phaser.Math.Between(1, 6) * 1000; // ms
        }
    }

    updateHungerText() {
        if (this.getBounds().contains(this.scene.input.mousePointer.x, this.scene.input.mousePointer.y)) {
            this.hungerText.setText(`Hunger: ${this.hunger}`);
            this.scene.time.delayedCall(1000, () => {
                this.hungerText.setText('');
            });
        }
    }
}
