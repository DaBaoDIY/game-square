/**
 * 物理引擎
 * 处理游戏中的物理效果和碰撞检测
 */

/**
 * 处理球与方块之间的碰撞
 * @param {Ball} ball - 球对象
 * @param {Block} block - 方块对象
 * @param {Function} onBlockHit - 击中方块时的回调函数
 * @returns {boolean} - 是否发生碰撞
 */
function handleBallBlockCollision(ball, block, onBlockHit) {
    if (!block.isActive || !ball.isLaunched) return false;
    
    // 检测碰撞
    const collision = checkCircleRectCollision(ball, block);
    
    if (collision) {
        // 处理球的反弹
        handleBallRebound(ball, collision.direction);
        
        // 触发方块的碰撞效果
        const destroyed = block.hit();
        
        if (destroyed) {
            // 方块被击毁
            if (onBlockHit) onBlockHit(block);
            
            // 播放破碎音效
            playSound(SOUNDS.BREAK);
        } else {
            // 方块未被击毁，只是被击中
            playSound(SOUNDS.BOUNCE);
        }
        
        return true;
    }
    
    return false;
}

/**
 * 处理球与挡板之间的碰撞
 * @param {Ball} ball - 球对象
 * @param {Paddle} paddle - 挡板对象
 * @returns {boolean} - 是否发生碰撞
 */
function handleBallPaddleCollision(ball, paddle) {
    if (!ball.isLaunched) return false;
    
    // 检查球是否与挡板碰撞
    if (ball.y + ball.radius >= paddle.y && 
        ball.y - ball.radius <= paddle.y + paddle.height &&
        ball.x + ball.radius >= paddle.x && 
        ball.x - ball.radius <= paddle.x + paddle.width) {
        
        // 计算球击中挡板的位置（相对于挡板中心的偏移）
        const hitPosition = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
        
        // 根据击中位置调整反弹角度
        const angle = hitPosition * Math.PI / 3; // 最大±60度
        
        // 设置球的速度
        ball.velocityX = Math.sin(angle) * ball.speed;
        ball.velocityY = -Math.abs(Math.cos(angle) * ball.speed);
        
        // 确保球在挡板上方
        ball.y = paddle.y - ball.radius;
        
        // 播放弹跳音效
        playSound(SOUNDS.BOUNCE);
        
        return true;
    }
    
    return false;
}

/**
 * 处理球的反弹
 * @param {Ball} ball - 球对象
 * @param {string} direction - 碰撞方向 ('top', 'bottom', 'left', 'right')
 */
function handleBallRebound(ball, direction) {
    switch (direction) {
        case 'top':
        case 'bottom':
            ball.velocityY = -ball.velocityY;
            break;
        case 'left':
        case 'right':
            ball.velocityX = -ball.velocityX;
            break;
    }
}

/**
 * 应用奖励效果
 * @param {string} bonusType - 奖励类型
 * @param {Object} gameState - 游戏状态对象
 */
function applyBonus(bonusType, gameState) {
    switch (bonusType) {
        case BONUS_TYPES.EXTRA_BALL:
            // 增加一个球
            if (gameState.ballsRemaining < LEVEL_CONFIG.MAX_BALLS) {
                gameState.ballsRemaining++;
                // 实时更新UI显示
                updateUI(gameState.score, gameState.level, gameState.ballsRemaining);
            }
            break;
            
        case BONUS_TYPES.ENLARGE_PADDLE:
            // 扩大挡板
            gameState.paddle.resize(1.5);
            break;
            
        case BONUS_TYPES.SHRINK_PADDLE:
            // 缩小挡板
            gameState.paddle.resize(0.75);
            break;
            
        case BONUS_TYPES.SPEED_UP:
            // 加速球
            gameState.ball.speed *= 1.2;
            gameState.ball.normalizeVelocity();
            break;
            
        case BONUS_TYPES.SPEED_DOWN:
            // 减速球
            gameState.ball.speed *= 0.8;
            gameState.ball.normalizeVelocity();
            break;
    }
}

/**
 * 处理用户输入，控制挡板的移动
 * @param {Paddle} paddle - 挡板对象
 * @param {Object} input - 输入状态对象
 */
function handlePaddleControl(paddle, input) {
    if (input.left) {
        paddle.move(-1);
    }
    if (input.right) {
        paddle.move(1);
    }
    
    // 如果有鼠标/触摸输入，设置挡板目标位置
    if (input.mouseX !== undefined) {
        paddle.setTargetX(input.mouseX);
    }
}

/**
 * 播放音效
 * @param {string} soundType - 音效类型
 */
function playSound(soundType) {
    // 这里可以实现音效播放逻辑
    // 简单实现，实际项目中可以使用 Web Audio API
    // console.log(`播放音效: ${soundType}`);
}