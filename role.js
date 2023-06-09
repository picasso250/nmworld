class Role extends Phaser.GameObjects.Container {
    constructor(scene, x, y, texture, hunger) {
        super(scene, x, y);
        scene.add.existing(this);

        this.sprite = scene.add.sprite(0, 0, texture);
        this.add(this.sprite);

        this.direction = 0;
        this.hunger = hunger;
        this.hungerText = scene.add.text(-15, -80, ``, { fontSize: '16px', fill: '#fff' });
        this.add(this.hungerText);

        this.statusText = scene.add.text(-25, -25, ``, { fontSize: '16px', fill: '#fff' });
        this.add(this.statusText);

        this.last_change_direction_time = 0;
        this.change_time_interval = 1000; // ms

        this.hungerSpeed = 7 / 1000; // 每毫秒递减

        this.maxSpeed = 1.9;

    }

    update(time, delta) {
        // 如果饥饿度小于等于0，则将目标设为最近的一个食物
        if (this.hunger <= 0 && !this.target) {
            var minDistance = Number.MAX_VALUE;
            var targetFood = null;
            this.scene.foodGroup.children.iterate(function (food) {
                if (!food.locked) { // 如果食物没有被锁住，则进行判断
                    var distance = Phaser.Math.Distance.Between(this.x, this.y, food.x, food.y);
                    if (distance < minDistance) {
                        minDistance = distance;
                        targetFood = food;
                    }
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
                if (!this.target.locked) {
                    this.eat()
                    this.clearAllTargets();
                }
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
    clearAllTargets() {
        // 遍历所有的 Role 对象，将它们的目标设为 null
        this.scene.roleGroup.getChildren().forEach((role) => {
            if (!role.isEating) { // 如果角色没有在吃东西，则清除其目标
                role.target = null;
            }
        });
    }
    eat() {
        if (this.target) {
            this.updateHunger(); // 更新饥饿值和解锁食物
            this.playEatAnimation(); // 播放吃东西的Tween动画
        }
    }

    /**
     * 更新角色的饥饿值和解锁食物
     */
    updateHunger() {
        this.isEating = true; // 标记正在吃东西
        this.target.locked = true; // 锁定食物
    }

    /**
     * 播放吃东西的动画
     */
    playEatAnimation() {
        this.statusText.setText('吃');
        this.statusText.alpha = 1;
        var dotTween = this.scene.tweens.add({
            targets: this.statusText,
            duration: 500,
            alpha: 0,
            yoyo: true,
            repeat: -1
        });
        this.scene.time.delayedCall(3000, () => {
            dotTween.stop(); // 停止动画
            this.statusText.alpha = 0;
            this.isEating = false; // 标记吃东西结束
            this.hunger += this.target.nutrition;
            if (this.target) {
                this.target.destroy(); // 销毁食物
                this.target=null;
            }
        });
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

    }

    // 改变角色方向
    changeRoleDirection(time) {
        if (time > this.last_change_direction_time + this.change_time_interval) {
            this.direction = Phaser.Math.FloatBetween(0, Math.PI * 2);
            this.last_change_direction_time = time;
            this.change_time_interval = Phaser.Math.Between(1, 6) * 1000; // ms
        }
    }

    updateHungerText() {
        this.hungerText.setText(`饱:${Math.floor(this.hunger)}`);
    }
}
