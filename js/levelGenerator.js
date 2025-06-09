/**
 * 关卡生成器
 * 负责生成游戏关卡和方块布局
 */

/**
 * 生成一个新的游戏关卡
 * @param {number} level - 当前关卡数
 * @returns {Object} - 包含方块数组和挡板对象
 */
function generateLevel(level) {
    const blocks = [];
    
    // 根据关卡调整难度
    const hardBlockProbability = 0.1 + (level * 0.05); // 随着关卡增加硬方块概率
    const bonusBlockProbability = 0.1; // 奖励方块概率
    
    // 创建网格布局
    const rows = LEVEL_CONFIG.ROWS;
    const cols = LEVEL_CONFIG.COLS;
    const blockWidth = BLOCK_WIDTH;
    const blockHeight = BLOCK_HEIGHT;
    const startY = 50; // 从顶部一定距离开始放置方块
    
    // 计算水平间距，使方块均匀分布
    const totalBlockWidth = cols * blockWidth;
    const horizontalSpacing = (CANVAS_WIDTH - totalBlockWidth) / (cols + 1);
    const verticalSpacing = 10;
    
    // 生成方块
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = horizontalSpacing + col * (blockWidth + horizontalSpacing / cols);
            const y = startY + row * (blockHeight + verticalSpacing);
            
            // 随机决定方块类型
            let type;
            let hitPoints = 1;
            
            if (Math.random() < bonusBlockProbability) {
                type = BLOCK_TYPES.BONUS;
            } else if (Math.random() < hardBlockProbability) {
                type = BLOCK_TYPES.HARD;
                hitPoints = Math.min(3, 1 + Math.floor(level / 3)); // 随关卡增加硬度
            } else {
                type = BLOCK_TYPES.NORMAL;
            }
            
            blocks.push(new Block(x, y, blockWidth, blockHeight, type, hitPoints));
        }
    }
    
    // 创建挡板
    const paddleWidth = PADDLE_WIDTH;
    const paddleHeight = PADDLE_HEIGHT;
    const paddle = new Paddle(
        (CANVAS_WIDTH - paddleWidth) / 2,
        CANVAS_HEIGHT - 50,
        paddleWidth,
        paddleHeight
    );
    
    return {
        blocks,
        paddle
    };
}

/**
 * 检查关卡是否完成
 * @param {Array} blocks - 方块对象数组
 * @returns {boolean} - 关卡是否完成
 */
function isLevelComplete(blocks) {
    // 检查是否所有普通方块和奖励方块都被击中
    return !blocks.some(block => 
        (block.type === BLOCK_TYPES.NORMAL || block.type === BLOCK_TYPES.BONUS) && block.isActive
    );
}

/**
 * 创建一个新的球
 * @param {Paddle} paddle - 挡板对象
 * @returns {Ball} - 新创建的球对象
 */
function createBall(paddle) {
    return new Ball(
        paddle.x + paddle.width / 2,
        paddle.y - BALL_RADIUS,
        BALL_RADIUS
    );
}