/**
 * 工具函数
 * 包含游戏中使用的通用工具函数
 */

/**
 * 检测两个对象之间的碰撞
 * @param {Object} obj1 - 第一个对象，包含 x, y, width, height 属性
 * @param {Object} obj2 - 第二个对象，包含 x, y, width, height 属性
 * @returns {boolean} - 是否发生碰撞
 */
function checkCollision(obj1, obj2) {
    // 矩形碰撞检测
    return (
        obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y
    );
}

/**
 * 检测圆形与矩形之间的碰撞
 * @param {Object} circle - 圆形对象，包含 x, y, radius 属性
 * @param {Object} rect - 矩形对象，包含 x, y, width, height 属性
 * @returns {Object|null} - 碰撞信息，包含碰撞方向，如果没有碰撞则返回 null
 */
function checkCircleRectCollision(circle, rect) {
    // 找出矩形上最接近圆心的点
    let closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
    let closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
    
    // 计算圆心到最近点的距离
    let distanceX = circle.x - closestX;
    let distanceY = circle.y - closestY;
    let distanceSquared = distanceX * distanceX + distanceY * distanceY;
    
    // 如果距离小于半径，则发生碰撞
    if (distanceSquared <= (circle.radius * circle.radius)) {
        // 确定碰撞方向
        let direction = '';
        
        // 简化的方向检测
        if (Math.abs(distanceY) > Math.abs(distanceX)) {
            direction = distanceY < 0 ? 'top' : 'bottom';
        } else {
            direction = distanceX < 0 ? 'left' : 'right';
        }
        
        return { direction };
    }
    
    return null;
}

/**
 * 生成指定范围内的随机整数
 * @param {number} min - 最小值（包含）
 * @param {number} max - 最大值（包含）
 * @returns {number} - 随机整数
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 随机选择数组中的一个元素
 * @param {Array} array - 输入数组
 * @returns {*} - 随机选择的元素
 */
function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}