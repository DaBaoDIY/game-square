/**
 * 游戏常量配置
 * 包含游戏中使用的所有常量值
 */

// 画布尺寸
const CANVAS_WIDTH = 480;
const CANVAS_HEIGHT = 640;

// 物理常量
const GRAVITY = 0.25;
const BOUNCE_FACTOR = 0.9;
const FRICTION = 0.99;

// 游戏对象尺寸
const BALL_RADIUS = 10;
const BLOCK_WIDTH = 50;
const BLOCK_HEIGHT = 20;
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 15;
const PADDLE_SPEED = 8;

// 方块类型
const BLOCK_TYPES = {
    NORMAL: 'normal',   // 普通方块，需要击中一次
    HARD: 'hard',       // 硬方块，需要击中多次
    BONUS: 'bonus'      // 奖励方块，提供特殊能力
};

// 游戏状态
const GAME_STATES = {
    MENU: 'menu',
    READY: 'ready',     // 准备发射球
    PLAYING: 'playing', // 球在移动中
    LEVEL_COMPLETE: 'levelComplete',
    GAME_OVER: 'gameOver'
};

// 颜色配置
const COLORS = {
    BALL: '#ffffff',
    BALL_GLOW: 'rgba(255, 255, 255, 0.5)',
    BACKGROUND: '#1a1a2e',
    TEXT: '#ffffff',
    PADDLE: '#2196f3'
};

// 方块颜色池
const BLOCK_COLORS = {
    NORMAL: [
        '#3498db', // 蓝色
        '#2ecc71', // 绿色
        '#9b59b6', // 紫色
        '#e74c3c', // 红色
        '#f1c40f', // 黄色
        '#1abc9c', // 青绿色
        '#d35400', // 橙色
        '#c0392b'  // 深红色
    ],
    HARD: [
        '#34495e', // 深蓝色
        '#8e44ad', // 深紫色
        '#c0392b', // 深红色
        '#16a085', // 深青色
        '#27ae60'  // 深绿色
    ],
    BONUS: [
        '#f39c12', // 金色
        '#f1c40f', // 黄色
        '#e67e22'  // 橙色
    ]
};

// 关卡配置
const LEVEL_CONFIG = {
    BLOCKS_PER_LEVEL: 30,
    ROWS: 6,
    COLS: 10,
    MAX_LEVELS: 10,
    INITIAL_BALLS: 1,   // 初始球数
    MAX_BALLS: 10       // 最大球数
};

// 音效配置
const SOUNDS = {
    BOUNCE: 'bounce',
    BREAK: 'break',
    LEVEL_COMPLETE: 'levelComplete',
    GAME_OVER: 'gameOver'
};

// 奖励类型
const BONUS_TYPES = {
    EXTRA_BALL: 'extraBall',  // 额外球
    ENLARGE_PADDLE: 'enlargePaddle', // 扩大挡板
    SHRINK_PADDLE: 'shrinkPaddle',   // 缩小挡板
    SPEED_UP: 'speedUp',      // 加速
    SPEED_DOWN: 'speedDown'   // 减速
};