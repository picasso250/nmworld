
class Role extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, hunger) {
        super(scene, x, y, texture);
        scene.add.existing(this);

        this.direction = 0;
        this.hunger = hunger;
        this.hungerText = scene.add.text(x, y - 50, ``, { fontSize: '16px', fill: '#fff' });

        this.last_change_direction_time = 0;
        this.change_time_interval = 1000; // ms

        this.hungerSpeed = 55 / 1000; // 每毫秒递减

        this.maxSpeed = 0.9
    }

    update(time, delta) {
        // 如果饥饿度小于等于0，则将目标设为最近的一个食物
        if (this.hunger <= 0) {
            var minDistance = Number.MAX_VALUE;
            var targetFood = null;
            this.scene.foodGroup.children.iterate(function (food) {
                var distance = Phaser.Math.Distance.Between(this.x, this.y, food.x, food.y);
                if (distance < minDistance) {
                    minDistance = distance;
                    targetFood = food;
                }
            }, this);
            if (targetFood) {
                this.target = targetFood;
            }
        }

        // 如果有目标，则朝目标移动
        if (this.target) {
            var distance = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);
            if (distance > 10) {
                var angle = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y);
                this.direction = angle;
                this.updatePosition(this.maxSpeed, delta)
            } else {
                // 如果到达目标，则将目标设为 null
                this.target = null;
            }
        } else {
            // 如果没有目标，则随机移动
            // 改变角色方向
            this.changeRoleDirection(time);
            this.updateRolePositionSlowly(delta);
        }

        // 更新饥饿度文本
        this.updateHungerText();

        // 递减饥饿度
        this.hunger -= this.hungerSpeed * delta;
        if (this.hunger <= 0) {
            this.hunger = 0;
        }
    }

    // 随机漫步
    updateRolePositionSlowly(delta) {
        var slowly = Phaser.Math.Between(1, 5);
        var distance = this.maxSpeed / slowly;

        this.updatePosition(distance, delta);
    }
    updatePosition(speed, delta) {
        var vector = new Phaser.Math.Vector2(speed * delta / 16.6667, 0); // 16.6667 是 1000 / 60，即每帧的时间
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
