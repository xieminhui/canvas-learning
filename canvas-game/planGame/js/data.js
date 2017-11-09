var datas = [
	"../planGame/image/explosion.png",
	"../planGame/image/plasma.png",
	"../planGame/image/ship.png",
    "../planGame/image/bg_1_1.jpg",
    "../planGame/mp3/bgm.mp3",
	"../planGame/mp3/boom.mp3",
	"../planGame/mp3/boom.mp3",
	"../planGame/mp3/boom.mp3",
	"../planGame/mp3/boom.mp3",
	"../planGame/mp3/boom.mp3",
	"../planGame/mp3/shot.mp3",
	"../planGame/mp3/shot.mp3",
	"../planGame/mp3/shot.mp3",
	"../planGame/mp3/shot.mp3",
	"../planGame/mp3/shot.mp3"
];

var explosionCells = [
	{x:0 , y:0 , w:66 , h:64},
	{x:64 , y:0 , w:68 , h:64},
	{x:128 , y:0 , w:67 , h:64},
	{x:194 , y:0 , w:61 , h:64},
	{x:254 , y:0 , w:60 , h:64},
	{x:317 , y:0 , w:67 , h:64},
	{x:380 , y:0 , w:59 , h:64},
	{x:445 , y:0 , w:61 , h:64},
	{x:510 , y:0 , w:67 , h:64},
	{x:574 , y:0 , w:69 , h:64},
	{x:640 , y:0 , w:67 , h:64},
	{x:705 , y:0 , w:65 , h:64},
	{x:765 , y:0 , w:67 , h:64},
	{x:830 , y:0 , w:67 , h:64}
];

//飞机射击的动画效果，通过切换图片完成
var planCells = [
	{x:0 , y:0 , w:24 , h:24},
	{x:24 , y:0 , w:24 , h:24},
	{x:48 , y:0 , w:24 , h:24},
	{x:72 , y:0 , w:24 , h:24},
	{x:48 , y:0 , w:24 , h:24},
	{x:24 , y:0 , w:24 , h:24}
];
//道具雪碧图
var hundunCells = [
    {x:0 , y:0 , w:74 , h:70},
    {x:0 , y:0 , w:74 , h:70},
    {x:0 , y:0 , w:74 , h:70},
    {x:0 , y:0 , w:74 , h:70},
    {x:74 , y:0 , w:74 , h:70},
    {x:74 , y:0 , w:74 , h:70},
    {x:74 , y:0 , w:74 , h:70},
    {x:74 , y:0 , w:74 , h:70},
    {x:148 , y:0 , w:74 , h:70},
    {x:148 , y:0 , w:74 , h:70},
    {x:148 , y:0 , w:74 , h:70},
    {x:148 , y:0 , w:74 , h:70}
];
var shesuCells = [
    {x:0 , y:0 , w:60 , h:62},
    {x:0 , y:0 , w:60 , h:62},
    {x:0 , y:0 , w:60 , h:62},
    {x:0 , y:0 , w:60 , h:62},
    {x:60 , y:0 , w:60 , h:62},
    {x:60 , y:0 , w:60 , h:62},
    {x:60 , y:0 , w:60 , h:62},
    {x:60 , y:0 , w:60 , h:62},
    {x:120 , y:0 , w:60 , h:62},
    {x:120 , y:0 , w:60 , h:62},
    {x:120 , y:0 , w:60 , h:62},
    {x:120 , y:0 , w:60 , h:62}
];
var shengjiCells = [
    {x:0 , y:0 , w:70 , h:80},
    {x:0 , y:0 , w:70 , h:80},
    {x:0 , y:0 , w:70 , h:80},
    {x:0 , y:0 , w:70 , h:80},
    {x:70 , y:0 , w:70 , h:80},
    {x:70 , y:0 , w:70 , h:80},
    {x:70 , y:0 , w:70 , h:80},
    {x:70 , y:0 , w:70 , h:80},
    {x:140 , y:0 , w:70 , h:80},
    {x:140 , y:0 , w:70 , h:80},
    {x:140 , y:0 , w:70 , h:80},
    {x:140 , y:0 , w:70 , h:80}
];
var huoliCells = [
    {x:0 , y:0 , w:60 , h:60},
    {x:0 , y:0 , w:60 , h:60},
    {x:0 , y:0 , w:60 , h:60},
    {x:0 , y:0 , w:60 , h:60},
    {x:60 , y:0 , w:60 , h:60},
    {x:60 , y:0 , w:60 , h:60},
    {x:60 , y:0 , w:60 , h:60},
    {x:60 , y:0 , w:60 , h:60},
    {x:120 , y:0 , w:60 , h:60},
    {x:120 , y:0 , w:60 , h:60},
    {x:120 , y:0 , w:60 , h:60},
    {x:120 , y:0 , w:60 , h:60}
]