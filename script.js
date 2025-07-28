// 饮料数据库
const drinks = [
    "旺仔", "冰红茶", "可乐", "雪碧", "芬达", "美年达", "七喜", "脉动", "红牛",
    "王老吉", "加多宝", "茉莉清茶", "AD钙", "果粒橙", "雀巢", "维他", "乌龙茶", "茉莉蜜茶", "尖叫",
    "元气森林", "东方树叶", "三得利", "农夫山泉", "茶π", "娃哈哈", "养乐多", "真果粒", "阿萨姆", "绿茶",
];

// 王者荣耀英雄数据库
const heroes = [
    "廉颇", "小乔", "赵云", "墨子", "妲己", "嬴政", "孙尚香", "鲁班七号", "庄周", "刘禅",
    "高渐离", "阿轲", "钟无艳", "孙膑", "扁鹊", "白起", "芈月", "吕布", "周瑜", "夏侯惇",
    "甄姬", "曹操", "典韦", "宫本武藏", "李白", "马可波罗", "狄仁杰", "达摩", "项羽", "武则天",
    "老夫子", "关羽", "貂蝉", "安琪拉", "程咬金", "露娜", "姜子牙", "刘邦", "韩信", "王昭君",
    "兰陵王", "花木兰", "张良", "不知火舞", "娜可露露", "橘右京", "亚瑟", "孙悟空", "牛魔", "后羿",
    "刘备", "张飞", "李元芳", "虞姬", "钟馗", "杨戬", "雅典娜", "蔡文姬", "太乙真人", "哪吒",
    "诸葛亮", "黄忠", "大乔", "东皇太一", "干将莫邪", "鬼谷子", "铠", "百里守约", "百里玄策", "苏烈",
    "梦奇", "女娲", "明世隐", "公孙离", "杨玉环", "裴擒虎", "弈星", "狂铁", "米莱狄", "元歌",
    "孙策", "司马懿", "盾山", "伽罗", "沈梦溪", "李信", "上官婉儿", "嫦娥", "猪八戒", "盘古",
    "瑶", "云中君", "曜", "马超", "西施", "鲁班大师", "蒙犽", "镜", "蒙恬", "阿古朵",
    "夏洛特", "澜", "司空震", "艾琳", "云缨", "金蝉", "暃", "桑启", "戈娅", "海月",
    "赵怀真", "莱西奥", "姬小满", "亚连", "朵莉亚", "海诺", "敖隐", "大司命", "元流之子", "少司缘",
    "影", "苍", "空空儿", "孙权", "老大", "牢大"
];

// 名字描述模板
const descriptions = [
    "这个名字听起来很有个性！",
    "饮料和英雄的完美结合！",
    "既可爱又有力量的名字！",
    "让人印象深刻的组合！",
    "既有甜味又有霸气！",
    "这个名字太有创意了！",
    "饮料的清新配上英雄的威武！",
    "听起来就很特别！",
    "既有营养又有战斗力！",
    "这个名字让人过目不忘！"
];

// 获取DOM元素
const generateBtn = document.getElementById('generate-btn');
const copyBtn = document.getElementById('copy-btn');
const shareBtn = document.getElementById('share-btn');
const clearHistoryBtn = document.getElementById('clear-history-btn');
const generatedName = document.getElementById('generated-name');
const nameDescription = document.getElementById('name-description');
const historyList = document.getElementById('history-list');
const shareImageContainer = document.getElementById('share-image-container');
const shareCanvas = document.getElementById('share-canvas');
const downloadImageBtn = document.getElementById('download-image-btn');
const copyImageBtn = document.getElementById('copy-image-btn');

// 历史记录数组
let nameHistory = [];

// 最近生成的组合记录（用于避免短期重复）
let recentCombinations = [];
const MAX_RECENT = 10;

// 随机性统计
let generationCount = 0;
let uniqueCombinations = new Set();

// 改进的随机数生成函数
function getRandomInt(min, max) {
    // 使用更高质量的随机数生成
    if (window.crypto && window.crypto.getRandomValues) {
        const array = new Uint32Array(1);
        crypto.getRandomValues(array);
        return min + (array[0] % (max - min + 1));
    } else {
        // 备用方案：使用多个随机源
        const random1 = Math.random();
        const random2 = Math.random();
        const random3 = Math.random();
        const combined = (random1 + random2 + random3) / 3;
        return min + Math.floor(combined * (max - min + 1));
    }
}

// 生成随机名字
function generateName() {
    let attempts = 0;
    const maxAttempts = 50;
    let randomDrink, randomHero, fullName;
    
    do {
        // 添加时间戳和鼠标位置作为随机种子
        const timestamp = Date.now();
        const mouseX = Math.random() * window.innerWidth;
        const mouseY = Math.random() * window.innerHeight;
        
        // 组合多个随机源，增加随机性
        const seed = timestamp + mouseX + mouseY + Math.random() + attempts;
        const randomOffset = Math.sin(seed) * 1000;
        
        // 使用改进的随机算法选择饮料
        const drinkIndex = getRandomInt(0, drinks.length - 1);
        randomDrink = drinks[drinkIndex];
        
        // 使用不同的随机源选择英雄
        const heroSeed = seed + randomOffset;
        const heroIndex = Math.floor((Math.abs(Math.sin(heroSeed)) * heroes.length) % heroes.length);
        randomHero = heroes[heroIndex];
        
        fullName = randomDrink + randomHero;
        attempts++;
        
        // 如果尝试次数过多，强制生成
        if (attempts >= maxAttempts) {
            break;
        }
    } while (recentCombinations.includes(fullName));
    
    // 添加到最近组合记录
    recentCombinations.push(fullName);
    if (recentCombinations.length > MAX_RECENT) {
        recentCombinations.shift();
    }
    
    // 更新统计
    generationCount++;
    uniqueCombinations.add(fullName);
    
    // 使用第三个随机源选择描述
    const descSeed = Date.now() + Math.random();
    const descIndex = Math.floor((Math.abs(Math.cos(descSeed)) * descriptions.length) % descriptions.length);
    const randomDescription = descriptions[descIndex];
    
    // 更新显示
    generatedName.textContent = fullName;
    nameDescription.textContent = randomDescription;
    
    // 显示复制和分享按钮
    copyBtn.style.display = 'inline-block';
    shareBtn.style.display = 'inline-block';
    
    // 添加到历史记录
    addToHistory(fullName);
    
    // 简单的更新效果
    generatedName.style.opacity = '0.7';
    setTimeout(() => {
        generatedName.style.opacity = '1';
    }, 100);
}

// 添加到历史记录
function addToHistory(name) {
    const now = new Date();
    const timeString = now.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const historyItem = {
        name: name,
        time: timeString
    };
    
    nameHistory.unshift(historyItem);
    
    // 限制历史记录数量
    if (nameHistory.length > 3) {
        nameHistory = nameHistory.slice(0, 3);
    }
    
    updateHistoryDisplay();
}

// 更新历史记录显示
function updateHistoryDisplay() {
    historyList.innerHTML = '';
    
    // 显示或隐藏清除按钮
    clearHistoryBtn.style.display = nameHistory.length > 0 ? 'inline-block' : 'none';
    
    nameHistory.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="name">${item.name}</div>
            <div class="time">${item.time}</div>
        `;
        
        // 添加点击复制功能
        historyItem.addEventListener('click', () => {
            copyToClipboard(item.name);
            showCopyFeedback(historyItem);
        });
        
        historyList.appendChild(historyItem);
    });
}

// 复制到剪贴板
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showCopyFeedback();
        }).catch(err => {
            console.error('复制失败:', err);
            fallbackCopyToClipboard(text);
        });
    } else {
        fallbackCopyToClipboard(text);
    }
}

// 备用复制方法
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
        showCopyFeedback();
    } catch (err) {
        console.error('复制失败:', err);
    }
    document.body.removeChild(textArea);
}

// 清除历史记录
function clearHistory() {
    if (confirm('确定要清除所有历史记录吗？')) {
        nameHistory = [];
        updateHistoryDisplay();
        saveHistory();
        showCopyFeedback(null, '历史记录已清除');
    }
}

// 分享名字
function shareName() {
    const currentName = generatedName.textContent;
    if (!currentName || currentName === '点击生成按钮开始') {
        return;
    }
    
    // 生成图片并显示在页面上
    generateShareImage(currentName);
    
    // 显示分享图片容器
    shareImageContainer.style.display = 'block';
    
    // 滚动到分享图片区域
    shareImageContainer.scrollIntoView({ behavior: 'smooth' });
}

// 生成分享图片
function generateShareImage(name) {
    const ctx = shareCanvas.getContext('2d');
    
    // 设置画布尺寸
    shareCanvas.width = 800;
    shareCanvas.height = 400;
    
    // 创建卡通风格的渐变背景
    const gradient = ctx.createLinearGradient(0, 0, shareCanvas.width, shareCanvas.height);
    gradient.addColorStop(0, '#FFB6C1'); // 浅粉色
    gradient.addColorStop(0.3, '#FFC0CB'); // 粉红色
    gradient.addColorStop(0.7, '#DDA0DD'); // 梅红色
    gradient.addColorStop(1, '#E6E6FA'); // 淡紫色
    
    // 绘制背景
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, shareCanvas.width, shareCanvas.height);
    
    // 绘制卡通云朵
    function drawCloud(x, y, size) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.arc(x + size * 0.8, y, size * 0.6, 0, Math.PI * 2);
        ctx.arc(x - size * 0.8, y, size * 0.6, 0, Math.PI * 2);
        ctx.arc(x, y - size * 0.5, size * 0.7, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // 绘制多个卡通云朵
    drawCloud(100, 80, 25);
    drawCloud(700, 60, 20);
    drawCloud(650, 120, 18);
    drawCloud(150, 320, 22);
    drawCloud(750, 350, 15);
    
    // 绘制卡通星星
    function drawStar(x, y, size) {
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
            const x1 = x + Math.cos(angle) * size;
            const y1 = y + Math.sin(angle) * size;
            if (i === 0) {
                ctx.moveTo(x1, y1);
            } else {
                ctx.lineTo(x1, y1);
            }
        }
        ctx.closePath();
        ctx.fill();
    }
    
    // 绘制多个卡通星星
    drawStar(200, 100, 8);
    drawStar(600, 80, 6);
    drawStar(300, 300, 7);
    drawStar(500, 280, 5);
    
    // 绘制卡通气泡
    function drawBubble(x, y, size) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    
    // 绘制多个卡通气泡
    drawBubble(400, 150, 12);
    drawBubble(350, 200, 8);
    drawBubble(450, 180, 10);
    drawBubble(380, 250, 6);
    
    // 设置文字样式
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // 绘制主标题
    ctx.fillStyle = '#4A4A4A'; // 深灰色
    ctx.font = 'bold 48px "Microsoft YaHei", "PingFang SC", sans-serif';
    ctx.fillText('旺仔小乔同款起名器', shareCanvas.width / 2, 80);
    
    // 绘制生成的名字
    ctx.font = 'bold 72px "Microsoft YaHei", "PingFang SC", sans-serif';
    ctx.fillStyle = '#E74C3C'; // 鲜艳红色
    ctx.fillText(name, shareCanvas.width / 2, 200);
    
    // 绘制副标题
    ctx.font = '24px "Microsoft YaHei", "PingFang SC", sans-serif';
    ctx.fillStyle = '#4A4A4A'; // 深灰色
    ctx.fillText('生成你的旺仔小乔同款名字', shareCanvas.width / 2, 280);
    
    // 绘制底部信息
    ctx.font = '16px "Microsoft YaHei", "PingFang SC", sans-serif';
    ctx.fillStyle = '#7F8C8D'; // 中灰色
    ctx.fillText('© 2025 饮料英雄起名器', shareCanvas.width / 2, 360);
}

// 下载图片
function downloadImage() {
    shareCanvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${generatedName.textContent}_名字图片.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showCopyFeedback(null, '图片已下载！');
    }, 'image/png');
}

// 复制图片到剪贴板
function copyImage() {
    shareCanvas.toBlob((blob) => {
        if (navigator.clipboard && navigator.clipboard.write) {
            // 现代浏览器支持
            navigator.clipboard.write([
                new ClipboardItem({
                    'image/png': blob
                })
            ]).then(() => {
                showCopyFeedback(null, '图片已复制到剪贴板！');
            }).catch(() => {
                showCopyFeedback(null, '复制失败，请使用下载功能');
            });
        } else {
            // 备用方案
            showCopyFeedback(null, '浏览器不支持复制图片，请使用下载功能');
        }
    }, 'image/png');
}

// 显示复制反馈
function showCopyFeedback(element = null, customMessage = '已复制！') {
    const feedback = document.createElement('div');
    feedback.textContent = customMessage;
    feedback.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 1000;
        font-size: 14px;
    `;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        document.body.removeChild(feedback);
    }, 1500);
}

// 事件监听器
generateBtn.addEventListener('click', generateName);

copyBtn.addEventListener('click', () => {
    const currentName = generatedName.textContent;
    if (currentName && currentName !== '点击生成按钮开始') {
        copyToClipboard(currentName);
    }
});

clearHistoryBtn.addEventListener('click', clearHistory);

shareBtn.addEventListener('click', shareName);
downloadImageBtn.addEventListener('click', downloadImage);
copyImageBtn.addEventListener('click', copyImage);

// 键盘快捷键
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        generateName();
    }
});

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', () => {
    // 从本地存储加载历史记录
    const savedHistory = localStorage.getItem('nameHistory');
    if (savedHistory) {
        try {
            nameHistory = JSON.parse(savedHistory);
            updateHistoryDisplay();
        } catch (err) {
            console.error('加载历史记录失败:', err);
        }
    }
    
    // 添加页面说明
    const instructions = document.createElement('div');
    instructions.style.cssText = `
        text-align: center;
        color: #999;
        margin-bottom: 20px;
        font-size: 0.9rem;
    `;
    instructions.innerHTML = '💡 提示：按空格键可以快速生成名字';
    
    const header = document.querySelector('header');
    header.appendChild(instructions);
});

// 保存历史记录到本地存储
function saveHistory() {
    try {
        localStorage.setItem('nameHistory', JSON.stringify(nameHistory));
    } catch (err) {
        console.error('保存历史记录失败:', err);
    }
}

// 页面卸载前保存历史记录
window.addEventListener('beforeunload', saveHistory);

// 定期保存历史记录
setInterval(saveHistory, 30000); // 每30秒保存一次 