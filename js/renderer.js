/**
 * 游戏渲染器
 * 负责绘制游戏场景和UI
 */

/**
 * 清除画布
 * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
 */
function clearCanvas(ctx) {
    ctx.fillStyle = COLORS.BACKGROUND;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

/**
 * 绘制游戏场景
 * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
 * @param {Object} gameState - 游戏状态对象
 */
function renderGame(ctx, gameState) {
    // 清除画布
    clearCanvas(ctx);
    
    // 绘制背景网格
    drawBackgroundGrid(ctx);
    
    // 绘制方块
    gameState.blocks.forEach(block => block.draw(ctx));
    
    // 绘制挡板
    gameState.paddle.draw(ctx);
    
    // 绘制球
    gameState.ball.draw(ctx);
    
    // 绘制准备发射的瞄准线
    if (gameState.state === GAME_STATES.READY && gameState.aimAngle !== undefined) {
        drawAimLine(ctx, gameState.ball, gameState.aimAngle);
    }
    
    // 绘制游戏边界
    drawGameBorder(ctx);
    
    // 绘制游戏信息
    drawGameInfo(ctx, gameState);
}

/**
 * 绘制瞄准线
 * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
 * @param {Ball} ball - 球对象
 * @param {number} angle - 瞄准角度（弧度）
 */
function drawAimLine(ctx, ball, angle) {
    const lineLength = 100;
    
    ctx.beginPath();
    ctx.moveTo(ball.x, ball.y);
    ctx.lineTo(
        ball.x + Math.cos(angle) * lineLength,
        ball.y - Math.sin(angle) * lineLength
    );
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
}

/**
 * 绘制游戏信息
 * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
 * @param {Object} gameState - 游戏状态对象
 */
function drawGameInfo(ctx, gameState) {
    // 创建半透明背景
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, 40);
    
    // 绘制分数
    ctx.fillStyle = 'white';
    ctx.font = '18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`分数: ${gameState.score}`, 10, 25);
    
    // 绘制关卡
    ctx.textAlign = 'center';
    ctx.fillText(`关卡: ${gameState.level}`, CANVAS_WIDTH / 2, 25);
    
    // 绘制剩余球数
    ctx.textAlign = 'right';
    ctx.fillText(`剩余球: ${gameState.ballsRemaining}`, CANVAS_WIDTH - 10, 25);
}

/**
 * 绘制背景网格
 * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
 */
function drawBackgroundGrid(ctx) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    
    // 绘制垂直线
    for (let x = 0; x <= CANVAS_WIDTH; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CANVAS_HEIGHT);
        ctx.stroke();
    }
    
    // 绘制水平线
    for (let y = 0; y <= CANVAS_HEIGHT; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(CANVAS_WIDTH, y);
        ctx.stroke();
    }
}

/**
 * 绘制游戏边界
 * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
 */
function drawGameBorder(ctx) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

/**
 * 更新UI显示
 * @param {number} score - 当前分数
 * @param {number} level - 当前关卡
 * @param {number} ballsRemaining - 剩余球数
 */
function updateUI(score, level, ballsRemaining) {
    // 不再更新HTML元素，所有UI都在Canvas上绘制
}

/**
 * 显示游戏开始界面
 * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
 */
function showStartScreen(ctx) {
    clearCanvas(ctx);
    drawBackgroundGrid(ctx);
    
    // 绘制标题背景
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(CANVAS_WIDTH/2 - 150, CANVAS_HEIGHT/2 - 120, 300, 240);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.strokeRect(CANVAS_WIDTH/2 - 150, CANVAS_HEIGHT/2 - 120, 300, 240);
    
    // 绘制标题
    ctx.fillStyle = COLORS.TEXT;
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('超级弹力球', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 70);
    
    // 绘制提示
    ctx.font = '20px Arial';
    ctx.fillText('点击屏幕开始游戏', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);
    ctx.font = '16px Arial';
    ctx.fillText('游戏规则:', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
    ctx.fillText('1. 用挡板接住球并反弹', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50);
    ctx.fillText('2. 击破所有方块来完成关卡', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 80);
    ctx.fillText('3. 收集黄色奖励方块获得能力', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 110);
}

/**
 * 显示游戏结束界面
 * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
 * @param {number} score - 最终分数
 */
function showGameOverScreen(ctx, score) {
    // 保留游戏场景，添加半透明覆盖
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // 绘制结束面板
    ctx.fillStyle = 'rgba(50, 50, 70, 0.9)';
    ctx.fillRect(CANVAS_WIDTH/2 - 150, CANVAS_HEIGHT/2 - 100, 300, 200);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.strokeRect(CANVAS_WIDTH/2 - 150, CANVAS_HEIGHT/2 - 100, 300, 200);
    
    // 绘制文本
    ctx.fillStyle = COLORS.TEXT;
    ctx.font = 'bold 30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('游戏结束', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 50);
    
    ctx.font = '24px Arial';
    ctx.fillText(`最终分数: ${score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    
    ctx.font = '18px Arial';
    ctx.fillText('点击屏幕重新开始', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50);
}

/**
 * 显示关卡完成界面
 * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
 * @param {number} level - 完成的关卡
 * @param {number} score - 当前分数
 */
function showLevelCompleteScreen(ctx, level, score) {
    // 保留游戏场景，添加半透明覆盖
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // 绘制完成面板
    ctx.fillStyle = 'rgba(50, 100, 50, 0.9)';
    ctx.fillRect(CANVAS_WIDTH/2 - 150, CANVAS_HEIGHT/2 - 100, 300, 200);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.strokeRect(CANVAS_WIDTH/2 - 150, CANVAS_HEIGHT/2 - 100, 300, 200);
    
    // 绘制文本
    ctx.fillStyle = COLORS.TEXT;
    ctx.font = 'bold 30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`关卡 ${level} 完成！`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 50);
    
    ctx.font = '24px Arial';
    ctx.fillText(`当前分数: ${score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    
    ctx.font = '18px Arial';
    ctx.fillText('点击屏幕进入下一关', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50);
}