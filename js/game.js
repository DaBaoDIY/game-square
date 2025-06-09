/**
 * 游戏核心类
 * 管理游戏状态、逻辑和流程
 */
class Game {
    /**
     * 创建游戏实例
     * @param {HTMLCanvasElement} canvas - 游戏画布元素
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // 设置画布尺寸
        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = CANVAS_HEIGHT;
        
        // 游戏状态
        this.state = GAME_STATES.MENU;
        this.score = 0;
        this.level = 1;
        this.ballsRemaining = LEVEL_CONFIG.INITIAL_BALLS;
        this.aimAngle = Math.PI / 2; // 默认瞄准角度（向上）
        
        // 游戏对象
        this.ball = null;
        this.blocks = [];
        this.paddle = null;
        
        // 输入状态
        this.input = {
            left: false,
            right: false,
            mouseX: 0,
            mouseY: 0,
            mouseDown: false
        };
        
        // 绑定事件处理器
        this.bindEvents();
    }
    
    /**
     * 绑定游戏事件
     */
    bindEvents() {
        // 键盘控制
        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.input.left = true;
            if (e.key === 'ArrowRight') this.input.right = true;
            if (e.key === ' ' && this.state === GAME_STATES.READY) this.launchBall();
        });
        
        window.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowLeft') this.input.left = false;
            if (e.key === 'ArrowRight') this.input.right = false;
        });
        
        // 鼠标移动
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.input.mouseX = e.clientX - rect.left;
            this.input.mouseY = e.clientY - rect.top;
            
            // 更新瞄准角度
            if (this.state === GAME_STATES.READY) {
                this.updateAimAngle();
            }
        });
        
        // 鼠标按下
        this.canvas.addEventListener('mousedown', (e) => {
            this.input.mouseDown = true;
            this.handleMouseDown(e);
        });
        
        // 鼠标释放
        this.canvas.addEventListener('mouseup', () => {
            this.input.mouseDown = false;
        });
        
        // 触摸控制
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            this.input.mouseX = touch.clientX - rect.left;
            this.input.mouseY = touch.clientY - rect.top;
            this.input.mouseDown = true;
            this.handleMouseDown(touch);
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            this.input.mouseX = touch.clientX - rect.left;
            this.input.mouseY = touch.clientY - rect.top;
            
            // 更新瞄准角度
            if (this.state === GAME_STATES.READY) {
                this.updateAimAngle();
            }
        });
        
        this.canvas.addEventListener('touchend', () => {
            this.input.mouseDown = false;
        });
        
        // 重新开始按钮
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.resetGame();
        });
    }
    
    /**
     * 更新瞄准角度
     */
    updateAimAngle() {
        if (!this.ball) return;
        
        // 计算鼠标相对于球的位置
        const dx = this.input.mouseX - this.ball.x;
        const dy = this.ball.y - this.input.mouseY; // 反转Y轴，因为canvas的Y轴向下
        
        // 计算角度
        this.aimAngle = Math.atan2(dy, dx);
        
        // 限制角度范围（0到π，即只能向上发射）
        this.aimAngle = Math.max(0, Math.min(Math.PI, this.aimAngle));
    }
    
    /**
     * 处理鼠标按下事件
     * @param {Event} e - 事件对象
     */
    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        switch (this.state) {
            case GAME_STATES.MENU:
                this.startGame();
                break;
                
            case GAME_STATES.LEVEL_COMPLETE:
                this.startNextLevel();
                break;
                
            case GAME_STATES.GAME_OVER:
                this.resetGame();
                this.startGame();
                break;
                
            case GAME_STATES.READY:
                this.launchBall();
                break;
        }
    }
    
    /**
     * 发射球
     */
    launchBall() {
        if (this.state !== GAME_STATES.READY || !this.ball) return;
        
        this.ball.launch(this.aimAngle);
        this.state = GAME_STATES.PLAYING;
    }
    
    /**
     * 初始化游戏
     */
    init() {
        showStartScreen(this.ctx);
        // 启动游戏循环
        this.gameLoop();
    }
    
    /**
     * 开始游戏
     */
    startGame() {
        this.state = GAME_STATES.READY;
        this.loadLevel(this.level);
    }
    
    /**
     * 开始下一关
     */
    startNextLevel() {
        this.level++;
        // 每过一关增加一些分数作为奖励
        this.score += 50;
        // 实时更新UI显示
        updateUI(this.score, this.level, this.ballsRemaining);
        this.state = GAME_STATES.READY;
        this.loadLevel(this.level);
    }
    
    /**
     * 重置游戏
     */
    resetGame() {
        this.score = 0;
        this.level = 1;
        this.ballsRemaining = LEVEL_CONFIG.INITIAL_BALLS;
        this.state = GAME_STATES.MENU;
        this.blocks = [];
        this.ball = null;
        this.paddle = null;
        updateUI(this.score, this.level, this.ballsRemaining);
        this.init();
    }
    
    /**
     * 加载指定关卡
     * @param {number} level - 关卡编号
     */
    loadLevel(level) {
        const levelData = generateLevel(level);
        this.blocks = levelData.blocks;
        this.paddle = levelData.paddle;
        
        // 创建球并放在挡板上方
        this.ball = createBall(this.paddle);
        
        updateUI(this.score, this.level, this.ballsRemaining);
    }
    
    /**
     * 游戏主循环
     */
    gameLoop() {
        // 根据游戏状态更新和渲染
        if (this.state === GAME_STATES.PLAYING || this.state === GAME_STATES.READY) {
            // 更新游戏状态
            this.update();
            
            // 渲染游戏
            renderGame(this.ctx, this);
        } else if (this.state === GAME_STATES.MENU) {
            // 在菜单状态下显示开始界面
            showStartScreen(this.ctx);
        } else if (this.state === GAME_STATES.GAME_OVER) {
            // 游戏结束状态下保持显示结束界面
            showGameOverScreen(this.ctx, this.score);
        } else if (this.state === GAME_STATES.LEVEL_COMPLETE) {
            // 关卡完成状态下保持显示完成界面
            showLevelCompleteScreen(this.ctx, this.level, this.score);
        }
        
        // 无论什么状态，都继续循环
        requestAnimationFrame(() => this.gameLoop());
    }
    
    /**
     * 更新游戏状态
     */
    update() {
        // 更新挡板位置
        this.paddle.update();
        handlePaddleControl(this.paddle, this.input);
        
        if (this.state === GAME_STATES.PLAYING) {
            // 更新球的位置
            this.ball.update();
            
            // 检测球与挡板的碰撞
            handleBallPaddleCollision(this.ball, this.paddle);
            
            // 检测球与方块的碰撞
            this.checkBlockCollisions();
            
            // 检查球是否掉出屏幕底部
            if (this.ball.y - this.ball.radius > CANVAS_HEIGHT) {
                this.ballLost();
            }
            
            // 检查关卡是否完成
            if (isLevelComplete(this.blocks)) {
                this.completeLevel();
            }
        } else if (this.state === GAME_STATES.READY) {
            // 球跟随挡板
            this.ball.x = this.paddle.x + this.paddle.width / 2;
            this.ball.y = this.paddle.y - this.ball.radius;
        }
        
        // 更新方块状态
        this.blocks.forEach(block => block.update());
    }
    
    /**
     * 检测球与方块的碰撞
     */
    checkBlockCollisions() {
        for (let i = 0; i < this.blocks.length; i++) {
            const block = this.blocks[i];
            
            handleBallBlockCollision(this.ball, block, (block) => {
                // 方块被击毁的回调
                this.score += block.scoreValue;
                
                // 实时更新UI显示
                updateUI(this.score, this.level, this.ballsRemaining);
                
                // 如果是奖励方块，应用奖励效果
                if (block.type === BLOCK_TYPES.BONUS && block.bonusType) {
                    applyBonus(block.bonusType, this);
                }
            });
        }
    }
    
    /**
     * 球丢失处理
     */
    ballLost() {
        this.ballsRemaining--;
        
        // 更新UI显示
        updateUI(this.score, this.level, this.ballsRemaining);
        
        if (this.ballsRemaining <= 0) {
            // 没有球了，游戏结束
            this.gameOver();
        } else {
            // 还有球，重置球到挡板上
            this.state = GAME_STATES.READY;
            this.ball = createBall(this.paddle);
        }
    }
    
    /**
     * 完成当前关卡
     */
    completeLevel() {
        if (this.level >= LEVEL_CONFIG.MAX_LEVELS) {
            // 通关
            this.gameOver();
        } else {
            // 显示关卡完成界面
            this.state = GAME_STATES.LEVEL_COMPLETE;
            showLevelCompleteScreen(this.ctx, this.level, this.score);
            
            // 播放关卡完成音效
            playSound(SOUNDS.LEVEL_COMPLETE);
        }
    }
    
    /**
     * 游戏结束
     */
    gameOver() {
        this.state = GAME_STATES.GAME_OVER;
        showGameOverScreen(this.ctx, this.score);
        
        // 播放游戏结束音效
        playSound(SOUNDS.GAME_OVER);
    }
}