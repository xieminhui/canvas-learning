(function (W) {
    "use strict"
    var planWidth = 24,
        planHeight = 24,
        missleWidth = 20,
        missleHeight = 50,
        boomWidth = 60,
        enemyWidth = 40,
        enemyHeight = 35,
        bossWidth = 280,
        bossHeight = 280;
    var bossObj = {
        bossCount :0,
        bossLock : false,
        bossOneMissle : {
            rotateAngle : Math.PI,
            shot : true
        }
    }

    //精灵类
    W.Sprite = function (name, painter, behaviors, args) {
        if (name !== undefined) this.name = name;
        if (painter !== undefined) this.painter = painter;
        this.top = 0;
        this.left = 0;
        this.width = 0;
        this.height = 0;
        this.velocityX = 3;
        this.velocityY = 2;
        this.visible = true;
        this.animating = false;
        this.behaviors = behaviors;
        this.rotateAngle = 0;
        this.blood = 50;
        this.fullBlood = 50;
        if (name === "plan") {
            this.rotateSpeed = 0.06;
            this.rotateLeft = false;
            this.rotateRight = false;
            this.fire = true;
            this.fireUp = 1;//火力最low为1
            this.isgood = true;
            this.firePerFrame = 40;//射速
            this.fireLevel = 1;//子弹列数，一排，多排，全屏。。
            this.god = false;
            this.hudunsrc = null;
        } else if (name === "star") {
            this.width = Math.random() * 2;
            this.speed = 1 * this.width / 2;
            this.lightLength = 5;
            this.cacheCanvas = document.createElement("canvas");
            this.cacheCtx = this.cacheCanvas.getContext('2d');
            this.cacheCanvas.width = this.width + this.lightLength * 2;
            this.cacheCanvas.height = this.width + this.lightLength * 2;
            this.painter.cache(this);
        } else if (name === "badPlan") {
            this.isgood = false;
            this.badKind = 1;
            this.planKind = null;
            this.speed = 2;
            this.rotateAngle = Math.PI;
            this.py = Math.PI / 2;
            this.xangle = Math.random() > 0.5 ? -Math.random() * 0.03 : Math.random() * 0.03;
        } else if (name === "missle") {
            this.width = missleWidth;
            this.isgood = true;
        } else if (name === "boom") {
            this.width = boomWidth;
        } else if (name === "food") {
            this.width = 80;
            this.speed = 2;
            this.kind = "LevelUP";
            this.cellIndex = 0;
        }
        this.toLeft = false;
        this.toTop = false;
        this.toRight = false;
        this.toBottom = false;

        this.outArcRadius = Math.sqrt((this.width / 2 * this.width / 2) * 2);

        if (args) {
            for (var arg in args) {
                this[arg] = args[arg];
            }
        }
    }
    Sprite.prototype = {
        constructor: Sprite,
        paint: function () {
            //增加boss
            if (point > 2) {
                if (this.name === "badPlan") {
                    this.levelKind = "boss";
                }
            }

            if (this.name === "badPlan") {
                this.update();//敌机的不同级别,
            }
            //missle初始visible为false,通过myplan,
            if (this.painter !== undefined && this.visible) {
                if (this.name !== "badPlan") {
                    this.update();//这里的条件导致update范围很广，可能是star,plan,missle...
                }
                if (this.name === "plan" || this.name === "missle" || this.name === "badPlan") {
                    ctx.save();
                    ctx.translate(this.left, this.top);//将坐标轴原点移动到自己的位置上,对于misssle,实现子弹在canvas移动
                    ctx.rotate(this.rotateAngle);//旋转角度，战机左右旋转，子弹同理
                    this.painter.paint(this);
                    ctx.restore();
                    if (this.fireUp >= 3) {
                        this.hudunsrc = "../planGame/images/bottomImg4copy.png";
                    }
                    if (this.painter.fullPlan) {
                        this.hudunsrc = "../planGame/images/bottomImg4.png";
                    }
                    if (this.god) {//无敌保护罩
                        if (this.hudunsrc === null) {
                            ctx.beginPath();
                            ctx.arc(this.left, this.top, (Math.random() * 0.2 + 1) * planWidth / 2, 0, 2 * Math.PI);
                            ctx.strokeStyle = "#FFF";
                            ctx.stroke();
                        } else {
                            var img = new Image();
                            img.src = this.hudunsrc;
                            //img.src = "../planGame/images/bottomImg4copy.png";
                            ctx.drawImage(img, this.left - 35, this.top - 35, 70, 70);
                        }

                    }
                } else {
                    this.painter.paint(this);
            }
            }
        },
        //update中execute用来更改不用name的属性值，而paint()用来将不用的东西花在canvas上
        update: function (time) {
            if (this.behaviors) {
                for (var i = 0; i < this.behaviors.length; i++) {
                    this.behaviors[i].execute(this, time);
                }
            }
        }
    }

    // 精灵表绘制器
    W.SpriteSheetPainter = function (cells, isloop, endCallback, spritesheet) {
        this.cells = cells || [];
        this.cellIndex = 0;
        this.dateCount = null;
        this.isloop = isloop;
        this.endCallback = endCallback;
        this.spritesheet = spritesheet;
    }
    SpriteSheetPainter.prototype = {
        advance: function () {
            this.cellIndex = this.isloop ? (this.cellIndex === this.cells.length - 1 ? 0 : this.cellIndex + 1) : (this.cellIndex + 1);
        },
        paint: function (sprite) {
            if (this.dateCount === null) {
                this.dateCount = new Date();
            } else {
                var newd = new Date();
                var tc = newd - this.dateCount;
                if (tc > 40) {
                    this.advance();
                    this.dateCount = newd;
                }
            }
            if (this.cellIndex < this.cells.length || this.isloop) {
                var cell = this.cells[this.cellIndex];
                ctx.drawImage(this.spritesheet, cell.x, cell.y, cell.w, cell.h, sprite.left - sprite.width / 2, sprite.top - sprite.width / 2, cell.w, cell.h);
            } else if (this.endCallback) {
                this.endCallback.call(sprite);
                this.cellIndex = 0;
            }
        }
    }

    //特制飞机精灵表绘制器
    W.controllSpriteSheetPainter = function (cells, spritesheet) {
        this.cells = cells || [];//cells在data.js里面，保存飞机的图片位置
        this.cellIndex = 0;
        this.dateCount = null;
        this.isActive = false;
        this.derection = true;
        this.spritesheet = spritesheet;
    }
    controllSpriteSheetPainter.prototype = {
        advance: function () {
            //飞机激活后，通过cellindex值的增加控制显示不同的飞机图片，达到射击动画效果
            if (this.isActive) {
                this.cellIndex++;
                if (this.cellIndex === this.cells.length) {
                    this.cellIndex = 0;
                    this.isActive = false;
                }
            }
        },
        paint: function (sprite) {
            if (this.dateCount === null) {
                this.dateCount = new Date();
            } else {
                var newd = new Date();
                var tc = newd - this.dateCount;
                if (tc > sprite.firePerFrame) {
                    this.advance();
                    this.dateCount = newd;
                }
            }
            if (this.fullPlan == true) {
                var img = new Image();
                img.src = "../planGame/images/myplan.png";
                planWidth = 50;
                planHeight = 45;
                ctx.drawImage(img, 0, 0, planWidth, planHeight, -planWidth/2, -planHeight/2, planWidth, planHeight);
            } else {
                var cell = this.cells[this.cellIndex];
                ctx.drawImage(this.spritesheet, cell.x, cell.y, cell.w, cell.h, -planWidth / 2, -planHeight / 2, cell.w, cell.h);
            }
        }
    }

    W.planBehavior = [
        {
            execute: function (sprite, time) {
                //往上移动，存在上边界限定，只要小于飞机高度一半，飞机不往上移动了，否则移动的时候每次减掉2
                if (sprite.toTop) {
                    sprite.top = sprite.top < planHeight / 2 ? sprite.top : sprite.top - sprite.velocityY;
                }
                //往左移动，存在左边界限定，只要小于飞机宽度一半，飞机不往左移动了，否则移动的时候每次减掉3
                if (sprite.toLeft) {
                    sprite.left = sprite.left < planWidth / 2 ? sprite.left : sprite.left - sprite.velocityX;
                }
                //往右移动，存在右边界限定，只要大于canvas宽度，飞机不往右移动了，否则移动的时候每次加上3
                if (sprite.toRight) {
                    sprite.left = sprite.left > canvas.width - planWidth / 2 ? sprite.left : sprite.left + sprite.velocityX;
                }
                //往下移动，存在下边界限定，只要大于canvas高度加去飞机一半高，飞机不往下移动了，否则移动的时候每次加上2
                if (sprite.toBottom) {
                    sprite.top = sprite.top > canvas.height - planHeight / 2 ? sprite.top : sprite.top + sprite.velocityY;
                }
                //飞机往左边旋转，每次减少0.06，大概52度。
                if (sprite.rotateLeft) {
                    sprite.rotateAngle -= sprite.rotateSpeed;
                }
                //飞机往右旋转，每次增加0.06，大概52度。
                if (sprite.rotateRight) {
                    sprite.rotateAngle += sprite.rotateSpeed;
                }
                //初始化isActive 为false
                if (sprite.fire && !sprite.painter.isActive) {
                    sprite.painter.isActive = true;
                    this.shot(sprite);
                }
            },
            //开火
            shot: function (sprite) {
                this.addMissle(sprite, sprite.rotateAngle);
                var missleAngle = 0.1
                //子弹按列数发射，左右同时旋转相同角度，角度为3.14/0.1，大概30度。
                for (var i = 1; i < sprite.fireLevel; i++) {
                    this.addMissle(sprite, sprite.rotateAngle - i * missleAngle);//左边子弹
                    this.addMissle(sprite, sprite.rotateAngle + i * missleAngle);//右边子弹
                }

                var audio = document.getElementsByTagName("audio");
                for (var i = 0; i < audio.length; i++) {
                    if (audio[i].src.indexOf("shot") >= 0 && (audio[i].paused || audio[i].ended)) {
                        audio[i].play();
                        break;
                    }
                }
            },
            addMissle: function (sprite, angle) {
                for (var j = 0; j < missles.length; j++) {
                    if (!missles[j].visible) {
                        missles[j].fireUp = sprite.fireUp;
                        missles[j].isgood = true;
                        missles[j].fireUp = sprite.fireUp;
                        missles[j].left = sprite.left;
                        missles[j].top = sprite.top;
                        missles[j].rotateAngle = angle;
                        var missleSpeed = 10;
                        //旋转后需要根据直角三角形的正余弦定理求得偏移量
                        missles[j].velocityX = missleSpeed * Math.sin(-missles[j].rotateAngle);
                        missles[j].velocityY = missleSpeed * Math.cos(-missles[j].rotateAngle);
                        missles[j].visible = true;
                        break;
                    }
                }
            }
        }
    ]

    W.starBehavior = [
        {
            execute: function (sprite, time) {
                if (sprite.top > canvas.height) {
                    sprite.left = Math.random() * canvas.width;
                    sprite.top = Math.random() * canvas.height - canvas.height;
                }
                sprite.top += sprite.speed;
            }
        }
    ]

    W.starPainter = {
        paint: function (sprite) {
            ctx.drawImage(sprite.cacheCanvas, sprite.left - sprite.width / 2 - sprite.lightLength, sprite.top - sprite.width / 2 - sprite.lightLength)
        },

        cache: function (sprite) {
            sprite.cacheCtx.save();
            var opacity = 0.5, addopa = 0.8 / sprite.lightLength;
            for (var i = 1; i <= sprite.lightLength; i += 2) {
                opacity -= addopa;
                sprite.cacheCtx.fillStyle = "rgba(52,181,246," + opacity + ")";
                sprite.cacheCtx.beginPath();
                sprite.cacheCtx.arc(sprite.width / 2 + sprite.lightLength, sprite.width / 2 + sprite.lightLength, sprite.width / 2 + i, 0, 2 * Math.PI);
                sprite.cacheCtx.fill();
            }
            sprite.cacheCtx.fillStyle = "rgba(255,255,255,0.8)";
            sprite.cacheCtx.beginPath();
            sprite.cacheCtx.arc(sprite.width / 2 + sprite.lightLength, sprite.width / 2 + sprite.lightLength, sprite.width / 2, 0, 2 * Math.PI);
            sprite.cacheCtx.fill();
        }
    }

    W.foodBehavior = [
        {
            execute: function (sprite, time) {
                sprite.top += sprite.speed;
                if (sprite.top > canvas.height + sprite.width) {
                    sprite.visible = false;
                }
                if (sss === 8) {
                    sss = 0;
                }
            }
        }
    ]
    var sss = 0;
    W.foodPainter = {
        paint: function (sprite) {
            if (eatfood.kind === 'planLeft' || eatfood.kind === 'planRight' || eatfood.kind === 'planMiddle') {
                ctx.drawImage(sprite.img, 0, 0, 55, 90, sprite.left, sprite.top, 55, 90);
            } else {
                if (eatfood.kind === 'LevelUP') {
                    var cell = shengjiCells[sss];
                } else if (eatfood.kind === 'SpeedUP') {
                    var cell = shesuCells[sss];
                } else if (eatfood.kind === 'fireUP') {
                    var cell = huoliCells[sss];
                } else if (eatfood.kind === 'God') {
                    var cell = hundunCells[sss];
                }
                ctx.drawImage(sprite.img, cell.x, cell.y, cell.w, cell.h, sprite.left, sprite.top, cell.w, cell.h);
                sss++;
            }

        }
    }


    W.missleBehavior = [{
        execute: function (sprite, time) {
            //子弹坐标改变，实现子弹飞行
            sprite.left -= sprite.velocityX;
            sprite.top -= sprite.velocityY;
            //超出canvas的子弹不显示
            if (sprite.left < -missleWidth / 2 || sprite.top < -missleHeight / 2 || sprite.left > canvas.width + missleWidth / 2 || sprite.top > canvas.height + missleHeight / 2) {
                sprite.visible = false;
            }
        }
    }];

    W.misslePainter = {
        paint: function (sprite) {
            var img = new Image();
            if (sprite.isgood) {
                if (sprite.fireUp === 1) {
                    img.src = "../planGame/image/plasma.png";
                } else if (sprite.fireUp === 2) {
                    img.src = "../planGame/images/zidang1.png";
                } else if (sprite.fireUp === 3) {
                    img.src = "../planGame/images/zidang2.png";
                } else if (sprite.fireUp === "newMissle") {
                    img.src = "../planGame/images/bomb19.png";
                }
                ctx.drawImage(img, -missleWidth / 2 + 1, -missleHeight / 2 + 1, missleWidth, missleHeight);
            } else {
                if(sprite.type ===6){
                    ctx.beginPath();
                    ctx.fillStyle = 'rgb('+51+','+204+',255)';
                    ctx.arc(0, 0, 3, 0, 2 * Math.PI);//前面的操作已经移动了坐标轴，移动到子丹
                    ctx.fill()
                    //ctx.strokeStyle = "#9CFF00";
                    ///drawSpirograph(ctx,5*(2+2)/(2+1),-8*(1+3)/(1+1),2);
                }else{
                    ctx.beginPath();
                    ctx.fillStyle = "#f00";
                    ctx.arc(0, 0, 3, 0, 2 * Math.PI);//前面的操作已经移动了坐标轴，移动到子丹
                    ctx.fill();
                }
            }
        }
    }

    W.badPlanBehavior = [{
        execute: function (sprite, time) {
            if (sprite.top > canvas.height && sprite.levelKind !== "boss" || !sprite.visible && sprite.levelKind !== "boss") {
                var random = Math.random();

                if (point >= 200 && point < 400) {
                    sprite.fullBlood = 150;
                    if (random < 0.1) {
                        sprite.badKind = 2;
                        sprite.fullBlood = 300;
                    }
                } else if (point >= 400 && point < 600) {
                    sprite.fullBlood = 300;
                    if (random < 0.2) {
                        sprite.badKind = 3;
                        sprite.fullBlood = 600;
                    }
                    if (random < 0.1) {
                        sprite.badKind = 4;
                        sprite.fullBlood = 800;
                    }
                } else if (point >= 600) {
                    sprite.fullBlood = 600;
                    if (random < 0.4) {
                        sprite.badKind = 4;
                        sprite.fullBlood = 800;
                    }
                    if (random < 0.3) {
                        sprite.badKind = 5;
                        sprite.fullBlood = 1200;
                    }
                }

                sprite.visible = true;
                sprite.blood = sprite.fullBlood;
                sprite.left = canvas.width / 2;
                sprite.top = Math.random() * canvas.height - canvas.height;
                sprite.planKind = null;
                sprite.xangle = Math.random() > 0.5 ? -Math.random() * 0.03 : Math.random() * 0.03;


            } else if (!sprite.visible && sprite.levelKind === "boss" &&!bossObj.bossLock) {
                if (bossObj.bossOne ) {
                    sprite.badKind = 7;
                    sprite.fullBlood = 1000;
                    bossObj.bossTwo = true;
                    bossObj.bossOne = false;
                } else if (bossObj.bossTwo) {
                    sprite.badKind = 8;
                    sprite.fullBlood = 1000;
                    bossObj.bossThree = true;
                    bossObj.bossTwo = false;
                } else if (bossObj.bossThree) {
                    sprite.badKind = 9;
                    sprite.fullBlood = 1000;
                    bossObj.bossfour = true;
                    bossObj.bossThree = false;
                } else if(!bossObj.bossOne){
                    sprite.badKind = 6;
                    sprite.fullBlood = 1000;
                    bossObj.bossOne = true;
                    // sprite.bossCount++;
                    // if(sprite.bossCount >= 2){
                    //     sprite.bossLock = true;
                    // }
                }
                bossObj.bossLock = true;
                sprite.visible = true;
                sprite.blood = sprite.fullBlood;
                sprite.left = canvas.width / 2;
                sprite.top = Math.random() * canvas.height - canvas.height;
            }


            //产生随机数，用于是否发射子弹
            if (sprite.top > 0 && sprite.levelKind !== "boss") {
                var num = sprite.badKind === 1 ? 0.002 : 0.01;
                var random = Math.random();
                if (random < num) {
                    this.shot(sprite);//传入sprite，将sprite的left，top赋给子弹，子弹是从某台敌机发射出来的
                }
            } else if (sprite.top >= 100  && sprite.levelKind === "boss") {
                if(sprite.badKind ===6){
                    if (sprite.dateCount == null) {
                        sprite.dateCount = new Date();
                    } else {
                        var nowdate = new Date();

                        if(nowdate - sprite.dateCount > 2000 &&bossObj.bossOneMissle.shot){
                            this.shot(sprite, bossObj.bossOneMissle.rotateAngle);
                            this.dateCount = nowdate;
                            bossObj.bossOneMissle.rotateAngle -= 0.2;
                        }
                    }

                }else if(sprite.badKind ===7){

                }else if(sprite.badKind ===8){

                }else if(sprite.badKind ===9){

                }
            }
            if (sprite.badKind===1||sprite.badKind===2||sprite.badKind===3||sprite.badKind===24||sprite.badKind===5||sprite.levelKind !== "boss") {
                sprite.top += sprite.speed;//初始化top负数来的，每次加2
                sprite.left += 3 * Math.sin(sprite.py);//left每次增加为随机数
                sprite.py += sprite.xangle;
            }else if(sprite.levelKind ==="boss"&&sprite.badKind!==1&&sprite.badKind!==2&&sprite.badKind!==3&&sprite.badKind!==4&&sprite.badKind!==5){
                if(sprite.top <= 100){
                    sprite.top += sprite.speed;
                }
            }
        },
        shot: function (sprite,rotateAngle) {
            this.addMissle(sprite, rotateAngle);
        },
        addMissle: function (sprite, angle) {
            for (var j = 0; j < missles.length; j++) {
                if (!missles[j].visible) {
                    missles[j].isgood = false;
                    missles[j].left = sprite.left;
                    missles[j].top = sprite.top;
                    missles[j].rotateAngle = angle;
                    var missleSpeed = 5;
                    missles[j].velocityX = missleSpeed * Math.sin(-missles[j].rotateAngle);
                    missles[j].velocityY = missleSpeed * Math.cos(-missles[j].rotateAngle);
                    missles[j].visible = true;
                    missles[j].type = sprite.badKind;
                    break;
                }
            }
        }
    }];

    W.badPlanPainter = {
        paint: function (sprite) {
            var img = new Image();

            img.src = "../planGame/images/enemyCopy.png";
            switch (sprite.badKind) {
                case 1:
                    img.src = "../planGame/image/ship.png"
                    ctx.drawImage(img, 96, 0, 24, 24, -24 / 2, -24 / 2, 24, 24);
                    sprite.planKind = 0;//机机型号
                    break;

                case 2:
                    if (sprite.planKind === 6) {
                        ctx.drawImage(img, 200, 0, enemyWidth, enemyHeight, -enemyWidth / 2, -enemyHeight / 2, enemyWidth, enemyHeight);
                        sprite.planKind = 6;
                    } else if (sprite.planKind === 7) {
                        ctx.drawImage(img, 240, 0, enemyWidth, enemyHeight, -enemyWidth / 2, -enemyHeight / 2, enemyWidth, enemyHeight);
                        sprite.planKind = 7;
                    } else if (Math.random() < 0.5) {
                        ctx.drawImage(img, 200, 0, enemyWidth, enemyHeight, -enemyWidth / 2, -enemyHeight / 2, enemyWidth, enemyHeight);
                        sprite.planKind = 6;
                    } else {
                        ctx.drawImage(img, 240, 0, enemyWidth, enemyHeight, -enemyWidth / 2, -enemyHeight / 2, enemyWidth, enemyHeight);
                        sprite.planKind = 7;
                    }
                    break;

                case 3:
                    if (sprite.planKind === 2) {
                        ctx.drawImage(img, 40, 0, enemyWidth, enemyHeight, -enemyWidth / 2, -enemyHeight / 2, enemyWidth, enemyHeight);
                        sprite.planKind = 2;
                    } else if (sprite.planKind === 4) {
                        ctx.drawImage(img, 120, 0, enemyWidth, enemyHeight, -enemyWidth / 2, -enemyHeight / 2, enemyWidth, enemyHeight);
                        sprite.planKind = 4;
                    } else if (Math.random() < 0.5) {
                        ctx.drawImage(img, 40, 0, enemyWidth, enemyHeight, -enemyWidth / 2, -enemyHeight / 2, enemyWidth, enemyHeight);
                        sprite.planKind = 2;
                    } else {
                        ctx.drawImage(img, 120, 0, enemyWidth, enemyHeight, -enemyWidth / 2, -enemyHeight / 2, enemyWidth, enemyHeight);
                        sprite.planKind = 4;
                    }
                    break;
                case 4:
                    if (sprite.planKind === 1) {
                        ctx.drawImage(img, 0, 0, enemyWidth, enemyHeight, -enemyWidth / 2, -enemyHeight / 2, enemyWidth, enemyHeight);
                        sprite.planKind = 1;
                    } else if (sprite.planKind === 3) {
                        ctx.drawImage(img, 80, 0, enemyWidth, enemyHeight, -enemyWidth / 2, -enemyHeight / 2, enemyWidth, enemyHeight);
                        sprite.planKind = 3;
                    } else if (Math.random() < 0.5) {
                        ctx.drawImage(img, 0, 0, enemyWidth, enemyHeight, -enemyWidth / 2, -enemyHeight / 2, enemyWidth, enemyHeight);
                        sprite.planKind = 1;
                    } else {
                        ctx.drawImage(img, 80, 0, enemyWidth, enemyHeight, -enemyWidth / 2, -enemyHeight / 2, enemyWidth, enemyHeight);
                        sprite.planKind = 3;
                    }
                    break;
                case 5:
                    ctx.drawImage(img, 160, 0, enemyWidth, enemyHeight, -enemyWidth / 2, -enemyHeight / 2, enemyWidth, enemyHeight);
                    sprite.planKind = 5;
                    break;
                case 6:
                    if(!bossObj.bossOne&&bossObj.hasOwnProperty('bossTwo')||bossObj.hasOwnProperty('bossThere')||bossObj.hasOwnProperty('bossFour')){
                        break;
                    }
                    img.src = "../planGame/images/boss1_0.png";
                    ctx.drawImage(img, 0, 0, bossWidth, bossHeight, -bossWidth / 2, -bossHeight / 2, bossWidth, bossHeight);
                    break;
                case 7:
                    if(!bossObj.bossTwo&&bossObj.hasOwnProperty('bossThere')||bossObj.hasOwnProperty('bossFour')){
                        break;
                    }
                    img.src = "../planGame/images/boss3_0.png";
                    ctx.drawImage(img, 0, 0, bossWidth, bossHeight, -bossWidth / 2, -bossHeight / 2, bossWidth, bossHeight);
                    break;
                case 8:
                    if(!bossObj.bossThree&&bossObj.hasOwnProperty('bossFour')){
                        break;
                    }
                    img.src = "../planGame/images/boss4c_0.png";
                    ctx.drawImage(img, 0, 0, bossWidth, bossHeight, -bossWidth / 2, -bossHeight / 2, bossWidth, bossHeight);
                    break;
                case 9:
                    if(!bossObj.bossfour){
                        break;
                    }
                    img.src = "../planGame/images/8.png";
                    ctx.drawImage(img, 0, 0, bossWidth, bossHeight, -bossWidth / 2, -bossHeight / 2, bossWidth, bossHeight);
                    break;
            }
            if(sprite.badKind===1||sprite.badKind===2||sprite.badKind===3||sprite.badKind===4||sprite.badKind===5){
                //敌机血条
                ctx.strokeStyle = "#FFF";
                ctx.fillStyle = "#F00";
                var bloodHeight = 1;
                ctx.strokeRect(-enemyWidth / 2 + 1, planHeight/2 + bloodHeight + 10, enemyWidth + 1, bloodHeight + 2);
                ctx.fillRect(-enemyWidth / 2 + 1, planHeight/2 + bloodHeight + 10, enemyWidth * sprite.blood / sprite.fullBlood, bloodHeight);
            }
        }
    }
    function drawSpirograph(ctx,R,r,O){
        var x1 = R-O;
        var y1 = 0;
        var i  = 1;
        ctx.beginPath();
        ctx.moveTo(x1,y1);
        do {
            if (i>20000) break;
            var x2 = (R+r)*Math.cos(i*Math.PI/72) - (r+O)*Math.cos(((R+r)/r)*(i*Math.PI/72))
            var y2 = (R+r)*Math.sin(i*Math.PI/72) - (r+O)*Math.sin(((R+r)/r)*(i*Math.PI/72))
            ctx.lineTo(x2,y2);
            x1 = x2;
            y1 = y2;
            i++;
        } while (x2 != R-O && y2 != 0 );
        ctx.stroke();
    }
    W.planSize = function () {
        return {
            w: planWidth,
            h: planHeight
        }
    }
    W.enemySize = function () {
        return {
            w: enemyWidth,
            h: enemyHeight
        }
    }
    W.bossSize = function () {
        return {
            w: bossWidth,
            h: bossHeight
        }
    }
    W.bossData= function () {
        return bossObj;
    }
})(window);
