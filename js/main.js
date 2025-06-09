/**
 * 游戏入口文件
 * 初始化游戏并启动
 */

// 等待页面加载完成
window.addEventListener('load', () => {
    // 获取画布元素
    const canvas = document.getElementById('gameCanvas');
    
    // 创建游戏实例
    const game = new Game(canvas);
    
    // 初始化游戏
    game.init();
    
    console.log('超级弹力球游戏已初始化');
});