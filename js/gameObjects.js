/**
 * 游戏对象类
 * 包含游戏中的所有对象类定义
 */

/**
 * 弹力球类
 * 控制球的物理属性和行为
 */
class Ball {
    /**
     * 创建一个新的弹力球
     * @param {number} x - 球的初始 x 坐标
     * @param {number} y - 球的初始 y 坐标
     * @param {number} radius - 球的半径
     */
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.velocityX = 0;
        this.velocityY = 0;
        this.isActive = true;
        this.speed = 6; // 球的速度
        this.trail = []; // 轨迹点数组，用于视觉效果
        this.trailLength = 5; // 轨迹长度
        this.glowSize = 5; // 发光效果大小
        this.isLaunched = false; // 是否已发射
    }

    /**
     * 更新球的位置和速度
     */
    update() {
        if (!this.isLaunched) return;
        
        // 保存当前位置到轨迹
        this.updateTrail();
        
        // 更新位置
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // 边界检查
        this.checkBoundaries();
        
        // 保持球的速度恒定
        this.normalizeVelocity();
    }

    /**
     * 保持球的速度恒定
     */
    normalizeVelocity() {
        // 计算当前速度大小
        const currentSpeed = Math.sqrt(this.velocityX * this.velocityX + this.velocityY * this.velocityY);
        
        // 如果速度不为零，则归一化
        if (currentSpeed > 0) {
            this.velocityX = (this.velocityX / currentSpeed) * this.speed;
            this.velocityY = (this.velocityY / currentSpeed) * this.speed;
        }
    }

    /**
     * 更新球的轨迹
     */
    updateTrail() {
        // 添加当前位置到轨迹
        this.trail.push({x: this.x, y: this.y});
        
        // 限制轨迹长度
        if (this.trail.length > this.trailLength) {
            this.trail.shift();
        }
    }

    /**
     * 检查并处理球与画布边界的碰撞
     */
    checkBoundaries() {
        // 左右边界
        if (this.x - this.radius < 0) {
            this.x = this.radius;
            this.velocityX = -this.velocityX;
            this.playBounceSound();
        } else if (this.x + this.radius > CANVAS_WIDTH) {
            this.x = CANVAS_WIDTH - this.radius;
            this.velocityX = -this.velocityX;
            this.playBounceSound();
        }
        
        // 上边界
        if (this.y - this.radius < 0) {
            this.y = this.radius;
            this.velocityY = -this.velocityY;
            this.playBounceSound();
        }
        
        // 注意：下边界的处理由Game类负责
    }

    /**
     * 播放弹跳音效
     */
    playBounceSound() {
        // 这里可以添加音效播放逻辑
    }

    /**
     * 发射球
     * @param {number} angle - 发射角度（弧度）
     */
    launch(angle) {
        // 根据角度计算初始速度
        this.velocityX = Math.cos(angle) * this.speed;
        this.velocityY = -Math.sin(angle) * this.speed; // 负号使球向上发射
        this.isLaunched = true;
    }

    /**
     * 绘制球
     * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
     */
    draw(ctx) {
        // 绘制轨迹
        this.drawTrail(ctx);
        
        // 绘制发光效果
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + this.glowSize, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(
            this.x, this.y, this.radius,
            this.x, this.y, this.radius + this.glowSize
        );
        gradient.addColorStop(0, COLORS.BALL_GLOW);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // 绘制球体
        ctx.fillStyle = COLORS.BALL;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // 添加高光效果
        ctx.beginPath();
        ctx.arc(this.x - this.radius/3, this.y - this.radius/3, this.radius/4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fill();
    }
    
    /**
     * 绘制球的轨迹
     * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
     */
    drawTrail(ctx) {
        for (let i = 0; i < this.trail.length; i++) {
            const point = this.trail[i];
            const alpha = i / this.trail.length; // 透明度随着轨迹点的老化而降低
            const radius = this.radius * (0.5 + alpha * 0.5); // 半径随着轨迹点的老化而减小
            
            ctx.beginPath();
            ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.3})`;
            ctx.fill();
        }
    }
}

/**
 * 方块类
 * 表示游戏中的方块障碍物
 */
class Block {
    /**
     * 创建一个新的方块
     * @param {number} x - 方块的 x 坐标
     * @param {number} y - 方块的 y 坐标
     * @param {number} width - 方块的宽度
     * @param {number} height - 方块的高度
     * @param {string} type - 方块类型 ('normal', 'hard' 或 'bonus')
     * @param {number} hitPoints - 需要击中的次数
     */
    constructor(x, y, width, height, type, hitPoints = 1) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        this.hitPoints = hitPoints; // 需要击中的次数
        this.isActive = true;
        this.hitAnimation = 0; // 碰撞动画计数器
        this.particles = []; // 粒子效果
        this.scoreValue = type === BLOCK_TYPES.BONUS ? 30 : 10; // 奖励方块得分更高
        this.bonusType = null; // 奖励类型
        
        // 随机选择颜色
        let colorPool;
        switch (type) {
            case BLOCK_TYPES.NORMAL:
                colorPool = BLOCK_COLORS.NORMAL;
                break;
            case BLOCK_TYPES.HARD:
                colorPool = BLOCK_COLORS.HARD;
                break;
            case BLOCK_TYPES.BONUS:
                colorPool = BLOCK_COLORS.BONUS;
                break;
            default:
                colorPool = BLOCK_COLORS.NORMAL;
        }
        this.color = colorPool[Math.floor(Math.random() * colorPool.length)];
        
        // 如果是奖励方块，随机选择一种奖励类型
        if (type === BLOCK_TYPES.BONUS) {
            const bonusTypes = Object.values(BONUS_TYPES);
            this.bonusType = bonusTypes[Math.floor(Math.random() * bonusTypes.length)];
        }
    }

    /**
     * 更新方块状态
     */
    update() {
        // 更新碰撞动画
        if (this.hitAnimation > 0) {
            this.hitAnimation--;
        }
        
        // 更新粒子效果
        if (!this.isActive && this.particles.length > 0) {
            for (let i = this.particles.length - 1; i >= 0; i--) {
                const particle = this.particles[i];
                particle.life--;
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vy += 0.1; // 粒子重力
                
                if (particle.life <= 0) {
                    this.particles.splice(i, 1);
                }
            }
        }
    }

    /**
     * 创建破碎效果
     */
    createBreakEffect() {
        const particleCount = 15;
        // 使用方块自己的颜色
        const color = this.color;
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: this.x + this.width / 2,
                y: this.y + this.height / 2,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5,
                size: Math.random() * 5 + 2,
                life: Math.random() * 30 + 10,
                color: color
            });
        }
    }

    /**
     * 触发碰撞效果
     * @returns {boolean} - 是否被击毁
     */
    hit() {
        this.hitAnimation = 10;
        this.hitPoints--;
        
        if (this.hitPoints <= 0) {
            this.isActive = false;
            this.createBreakEffect();
            return true;
        }
        
        return false;
    }

    /**
     * 绘制方块
     * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
     */
    draw(ctx) {
        if (!this.isActive) {
            // 绘制粒子效果
            this.drawParticles(ctx);
            return;
        }
        
        // 使用方块自己的颜色
        const color = this.color;
        
        // 添加适度的发光效果
        ctx.shadowBlur = 8;
        ctx.shadowColor = color;
        
        // 碰撞动画效果
        if (this.hitAnimation > 0) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = 'white';
        }
        
        // 绘制方块
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // 添加高光效果
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, this.y, this.width, this.height / 2);
        
        // 如果是硬方块，显示剩余击中次数
        if (this.type === BLOCK_TYPES.HARD && this.hitPoints > 1) {
            ctx.fillStyle = 'white';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.hitPoints.toString(), this.x + this.width / 2, this.y + this.height / 2);
        }
        
        // 如果是奖励方块，显示奖励类型图标
        if (this.type === BLOCK_TYPES.BONUS) {
            ctx.fillStyle = 'white';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            let symbol = '';
            switch (this.bonusType) {
                case BONUS_TYPES.EXTRA_BALL:
                    symbol = '+';
                    break;
                case BONUS_TYPES.ENLARGE_PADDLE:
                    symbol = '↔';
                    break;
                case BONUS_TYPES.SHRINK_PADDLE:
                    symbol = '↕';
                    break;
                case BONUS_TYPES.SPEED_UP:
                    symbol = '↑';
                    break;
                case BONUS_TYPES.SPEED_DOWN:
                    symbol = '↓';
                    break;
            }
            
            ctx.fillText(symbol, this.x + this.width / 2, this.y + this.height / 2);
        }
        
        // 重置阴影
        ctx.shadowBlur = 0;
    }
    
    /**
     * 绘制粒子效果
     * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
     */
    drawParticles(ctx) {
        for (const particle of this.particles) {
            const alpha = particle.life / 40; // 随着生命值减少而变透明
            ctx.fillStyle = `rgba(${particle.color.slice(1).match(/../g).map(x => parseInt(x, 16)).join(', ')}, ${alpha})`;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

/**
 * 挡板类
 * 表示游戏中的挡板
 */
class Paddle {
    /**
     * 创建一个新的挡板
     * @param {number} x - 挡板的 x 坐标
     * @param {number} y - 挡板的 y 坐标
     * @param {number} width - 挡板的宽度
     * @param {number} height - 挡板的高度
     */
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = PADDLE_SPEED;
        this.targetX = x; // 目标位置
        this.normalWidth = width; // 正常宽度
    }
    
    /**
     * 更新挡板位置
     */
    update() {
        // 平滑移动到目标位置
        const dx = this.targetX - this.x;
        this.x += dx * 0.2;
        
        // 确保挡板不会超出屏幕边界
        this.x = Math.max(0, Math.min(CANVAS_WIDTH - this.width, this.x));
    }
    
    /**
     * 设置挡板的目标位置
     * @param {number} x - 目标 x 坐标
     */
    setTargetX(x) {
        this.targetX = x - this.width / 2;
    }
    
    /**
     * 移动挡板
     * @param {number} direction - 移动方向 (-1 左, 1 右)
     */
    move(direction) {
        this.targetX += direction * this.speed;
        
        // 确保挡板不会超出屏幕边界
        this.targetX = Math.max(0, Math.min(CANVAS_WIDTH - this.width, this.targetX));
    }
    
    /**
     * 调整挡板大小
     * @param {number} factor - 大小调整因子
     */
    resize(factor) {
        const newWidth = this.normalWidth * factor;
        
        // 调整位置，使挡板中心保持不变
        const centerX = this.x + this.width / 2;
        this.width = newWidth;
        this.x = centerX - this.width / 2;
        
        // 确保挡板不会超出屏幕边界
        this.x = Math.max(0, Math.min(CANVAS_WIDTH - this.width, this.x));
        this.targetX = this.x;
    }
    
    /**
     * 重置挡板大小
     */
    resetSize() {
        // 调整位置，使挡板中心保持不变
        const centerX = this.x + this.width / 2;
        this.width = this.normalWidth;
        this.x = centerX - this.width / 2;
        
        // 确保挡板不会超出屏幕边界
        this.x = Math.max(0, Math.min(CANVAS_WIDTH - this.width, this.x));
        this.targetX = this.x;
    }
    
    /**
     * 绘制挡板
     * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
     */
    draw(ctx) {
        // 绘制挡板阴影
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(this.x, this.y + this.height, this.width, 5);
        
        // 绘制挡板
        ctx.fillStyle = COLORS.PADDLE;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // 添加高光效果
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, this.y, this.width, this.height / 2);
    }
}