var canvas = document.getElementById("cas");
canvas.height = window.innerHeight;
var ctx = canvas.getContext('2d');

var img = new Image(),
    boomDom = document.getElementById("booms"),
    missleDom = document.getElementById("missle"),
    gS = document.getElementById("gameStart"),
    gss = document.getElementById("gs-start");

window.RAF = (function(){
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {window.setTimeout(callback, 1000 / 60); };
})();

Array.prototype.foreach = function(callback){
    for(var i=0;i<this.length;i++){
        callback.apply(this[i] , [i]);
    }
}

var sprites = [],
    missles = [],
    booms = [],
    badPlanNum = 30,
    point = 0,
    myplan = null,
    eatfood = null,
    foodDate = null,
    dieNum = 0;

window.onkeydown = function(event){
    switch(event.keyCode){
//                   case 88:myplan.fire = true;
//                    break;
        case 90:myplan.rotateLeft=true;//Z键，左旋转
            break;
        case 67:myplan.rotateRight=true;//C键，有旋转
            break;
        case 37:myplan.toLeft = true;//左移动
            break;
        case 38:myplan.toTop = true;//上移动
            break;
        case 39:myplan.toRight = true;//右移动
            break;
        case 40:myplan.toBottom = true;//下移动
            break;
    }
}

window.onkeyup = function(event){
    switch(event.keyCode){
        //case 88:myplan.fire = false;
        //break;
        case 90:myplan.rotateLeft=false;//Z键，左旋转
            break;
        case 67:myplan.rotateRight=false;//C键，有旋转
            break;
        case 37:myplan.toLeft = false;//左移动
            break;
        case 38:myplan.toTop = false;//上移动
            break;
        case 39:myplan.toRight = false;//右移动
            break;
        case 40:myplan.toBottom = false;//下移动
            break;
    }
}
/*用于无敌状态*/
document.getElementById("god").onclick = function(){
    if(myplan){
        myplan.god = true;
        myplan.fireLevel = 4;
        myplan.firePerFrame = 10;
    }
}
document.getElementById("verygod").onclick = function(){
    if(myplan){
        myplan.god = true;
        myplan.fireLevel = 10;
        myplan.firePerFrame = 10;
    }
}
document.getElementById("pretygod").onclick = function(){
    if(myplan){
        myplan.god = true;
        myplan.fireLevel = 40;
        myplan.firePerFrame = 50;
    }
}
document.getElementById("nogod").onclick = function(){
    if(myplan){
        myplan.god = true;
        myplan.fireLevel = 40;
        myplan.firePerFrame = 5;
    }
}
document.getElementById("zidang1").onclick = function(){
    if(myplan){
        myplan.fireUp = 2;
    }
}
document.getElementById("zidang2").onclick = function(){
    if(myplan){
        myplan.fireUp = 3;
    }
}
function boom(plan){
    for(var j=0;j<booms.length;j++){
        if(!booms[j].visible){
            booms[j].left = plan.left;//爆炸的坐标点就是飞机的坐标点
            booms[j].top = plan.top;
            booms[j].visible = true;

            var audio = document.getElementsByTagName("audio");
            for(var i=0;i<audio.length;i++){
                if(audio[i].src.indexOf("boom")>=0&&(audio[i].paused||audio[i].ended)){
                    audio[i].play();
                    break;
                }
            }
            break;
        }
    }
}

var stage = {
    init:function(){
        var _this = this;
        this.loading = new Loading(datas , canvas , function(){
            gS.style.display = "block";
            canvas.className = "showBg"
            document.getElementById("bgm").play();
            gss.addEventListener("click" , function(){
                gS.style.display = "none";
                _this.addElement();
            },false)
        });
    },

    addElement:function(){
        //游戏背景的发光的小点
        for(var i=0;i<50;i++){
            var x = Math.random()*canvas.width;
            var y = Math.random()*2*canvas.height - canvas.height;
            var star = new Sprite("star" , starPainter , starBehavior);
            star.top = y;
            star.left = x;
            sprites.push(star);
        }
        //敌机
        for(var i=0;i<badPlanNum;i++){
            var x = Math.random()*(canvas.width-2*planSize().w)+planSize().w;
            var y = Math.random()*canvas.height - canvas.height;
            var badPlan = new Sprite("badPlan" , badPlanPainter , badPlanBehavior);
            badPlan.left = x;
            badPlan.top = y;
            sprites.push(badPlan);
        }
        //子弹，包括我方的激光和敌方子弹
        for(var i=0;i<400;i++){
            var missle = new Sprite("missle" , misslePainter , missleBehavior);
            missle.visible = false;
            missles.push(missle);
        }
        //敌机爆炸
        for(var i=0;i<badPlanNum;i++){
            var img = new Image();
            img.src = "image/explosion.png";
            var boom = new Sprite("boom" , new SpriteSheetPainter(explosionCells , false , function(){
                this.visible = false;
            } , img));
            boom.visible = false;
            booms.push(boom);
        }
        //吃道具
        eatfood = new Sprite("food" , foodPainter , foodBehavior);
        eatfood.left = Math.random()*canvas.width-60+30;
        eatfood.top = -30;
        eatfood.visible = false;
        sprites.push(eatfood)
        //我方战机
        img.src = "image/ship.png"
        myplan = new Sprite("plan" , new controllSpriteSheetPainter(planCells , img) , planBehavior);
        myplan.left = canvas.width/2;
        myplan.top = canvas.height-(planSize().h/2+10);
        sprites.push(myplan);
    },
    //战机重生
    myplanReborn:function(myplan){
        setTimeout(function(){
            myplan.visible = true;
            myplan.left = canvas.width/2;
            myplan.top = canvas.height-(planSize().h/2+10);
            myplan.fireLevel = 1;//重生后属性注销
            myplan.firePerFrame = 40;
            myplan.fireUP = 1;
            myplan.rotateAngle=0;
            myplan.god = true;//重生后一段时间无敌
            setTimeout(function(){
                myplan.god = false;
            } , 5000)//五秒无敌消失
        } , 1000)
    },

    update:function(){
        var stage = this;
        var boomnum = 0,misslenum = 0;

        this.loading.loop();
        if(this.loading.getComplete()){
            ctx.clearRect(0,0,canvas.width,canvas.height);
        }
        //碰撞检测，敌方与我方战机碰撞检测
        // 碰撞检测算法，两个圆心的距离 L 和两个圆半径相加 R = r1 + r2 比较
        // L < R ,表示碰撞了
        // l > = R ,两个圆相离或相切，没有碰撞
        missles.foreach(function(){
            var missle = this;
            sprites.foreach(function(){
                var bp = this;
                if(bp.name==="badPlan"&&bp.visible&&missle.visible){
                    var juli = Math.sqrt(Math.pow(missle.left-bp.left , 2)+Math.pow(missle.top-bp.top , 2));
                    if(juli<(planSize().w/2+missle.width/2) && missle.isgood){//这里用isgood判断是哪方子弹，true表示我方激光炮
                        missle.visible = false;
                        if(missle.fireUp === 1){
                            bp.blood-=25;
                        }else if(missle.fireUp === 2){
                            bp.blood-=50;
                        }else if(missle.fireUp === 3){
                            bp.blood-=75;
                        }

                        if(bp.blood<=0){//血量小于等于0,敌机阵亡
                            bp.visible = false;
                            point += bp.badKind;//得分加1
                            boom(bp);
                        }
                    }
                }
            });
            //碰撞检测，敌方子弹跟战机碰撞检测，planSize().w/2+3， 3表示敌方红色圆心子弹半径
            if(missle.visible){
                if(!missle.isgood&&myplan.visible&&!myplan.god){
                    var juli = Math.sqrt(Math.pow(missle.left-myplan.left , 2)+Math.pow(missle.top-myplan.top , 2));
                    if(juli<(planSize().w/2+3)){
                        myplan.visible = false;
                        dieNum++;
                        missle.visible = false;
                        boom(myplan);
                        stage.myplanReborn(myplan)//战机重生
                    }
                }
                misslenum++;
                this.paint();
            }
        });

        booms.foreach(function(){
            if(this.visible){
                boomnum++;
                this.paint();
            }
        })
        //碰撞检测，吃道具
        sprites.foreach(function(){
            if(this.name==="food"&&this.visible){
                var tjuli = Math.sqrt(Math.pow(this.left-myplan.left , 2)+Math.pow(this.top-myplan.top , 2));
                if(tjuli<=(planSize().w/2+this.width/2)){
                    this.visible = false;
                    switch(this.kind){
                        case "LevelUP":myplan.fireLevel = myplan.fireLevel>=5?myplan.fireLevel:myplan.fireLevel+1;
                            break;
                        case "SpeedUP":myplan.firePerFrame = myplan.firePerFrame<=10?10:myplan.firePerFrame-10;
                            break;
                        case "God":myplan.god = true;setTimeout(function(){myplan.god = false} , 5000);
                            break;
                        case "fireUP": myplan.fireUp = myplan.fireUp>=3? myplan.fireUp:  myplan.fireUp+1;
                        default:break;
                    }
                }
            }
            //碰撞检测，敌机跟战机碰撞
            if(this.name==="badPlan"&&myplan.visible&&!myplan.god){
                var juli = Math.sqrt(Math.pow(this.left-myplan.left , 2)+Math.pow(this.top-myplan.top , 2));
                if(juli<planSize().w){
                    myplan.visible = false;
                    dieNum++;
                    this.visible = false;
                    boom(this);
                    boom(myplan);
                    stage.myplanReborn(myplan);
                }
            }

            this.paint();//遍历sprites并且在canvas绘制sprite，sprites属性有start，badplan,food,mypaln,这个是按顺序的
        });

        if(myplan){
            ctx.fillStyle="#FFF"
            ctx.font="18px 微软雅黑";
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.fillText("Level:"+(myplan.fireLevel===4?"Max":myplan.fireLevel)+"        Speed:"+((80-myplan.firePerFrame) >=70?"Max":(80-myplan.firePerFrame)) , 0 , canvas.height-18);
            ctx.fillText("Points:"+point+"     死亡次数:"+dieNum, 0 , 18);
            ctx.textAlign = "right";
            ctx.fillText("Tips:按方向键:移动 ，按“Z”“C”键旋转飞机" , canvas.width-10 , 18);

            //道具掉落
            if(foodDate===null){
                foodDate = new Date();
            }else {
                var nowFoodDate = new Date();
                if(nowFoodDate-foodDate>1000){
                    var createFood = Math.random()<0.5?true:false;
                    if(createFood&&!eatfood.visible){
                        eatfood.left = Math.random()*canvas.width + 40;
                        if(eatfood.left > canvas.width){
                            eatfood.left = canvas.left - 80
                        }
                        eatfood.top = -30;
                        if(Math.random() > 0.5){
                            eatfood.kind = Math.random()>0.6?"LevelUP":"SpeedUP";
                        }else{
                            eatfood.kind = Math.random()>0.4?"fireUP":"God";
                        }
                        if(eatfood.kind === 'LevelUP'){
                            img.src = "../planGame/images/levelUp.png";
                        }else if(eatfood.kind === 'SpeedUP'){
                            img.src = "../planGame/images/speedUp.png";
                        }else if(eatfood.kind === 'fireUP'){
                            img.src = "../planGame/images/fireUp.png";
                        }else if(eatfood.kind === 'God'){
                            img.src = "../planGame/images/hudun.png";
                        }
                        eatfood.img = img;
                        eatfood.visible = true;
                    }
                    foodDate = nowFoodDate;
                }
            }
        }

        boomDom.innerHTML = "爆炸使用率(已使用/存储总量):"+boomnum+"/"+booms.length;
        missleDom.innerHTML = "子弹使用率(已使用/存储总量):"+misslenum+"/"+missles.length;
    },

    loop:function(){
        var _this = this;
        this.update();
        RAF(function(){
            _this.loop();
        });
    },

    start:function(){
        this.init();
        this.loop();
    }
}

stage.start();