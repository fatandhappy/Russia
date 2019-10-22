//Cell类型:描述所有格子的属性和方法
function Cell(r,c,img){
	this.r=r;//行下表
	this.c=c;//列下标
	this.img=img;//图片路径
}
//Shape类型：描述所有图形的属性和方法
function Shape(orgi){
	this.orgi=orgi;//设置参照格的下标
	this.statei=0;//设置所有图形默认状态为0
}
Shape.prototype={
	IMGS:{
		O:"../picture/O.png",
		I:"../picture/I.png",
		J:"../picture/J.png",//参照点为1
		L:"../picture/L.png",
		S:"../picture/S.png",
		Z:"../picture/Z.png",
		T:"../picture/T.png",
	},
	moveDown:function(){
		for(var i=0;i<this.cells.length;i++){//遍历当前图形对象的cells数组
			this.cells[i].r++;//this-->当前shape
		}
	},
	moveLeft:function(){
		for(var i=0;i<this.cells.length;i++){
			this.cells[i].c--;
		}
	},
	moveRight:function(){
		for(var i=0;i<this.cells.length;i++){
			this.cells[i].c++;
		}
	},
	rotateR:function(){//向右转,切换到下一个state
		this.statei++;
		this.statei==this.states.length&&(this.statei=0);
		this.rotate();
	},
	rotateL:function(){//向左转,切换到上一个state
		this.statei--;
		this.statei==-1&&(this.statei=this.states.length-1);
		this.rotate();
	},
	rotate:function(){//根据当前state数据，计算图形中每个格的r和c(刷状态)
		//从当前图形的states数组中获得statei位置的状态，保存在变量state中
		var state=this.states[this.statei];//[{r:-1,c:0},{r:0,c:0},{r:1,c:0},{r:0,c:-1}]
		var r=this.cells[this.orgi].r;//获得shape中参照格的r和c
		var c=this.cells[this.orgi].c;
		for(var i=0;i<this.cells.length;i++){//i两层含义
			this.cells[i].r=r+state[i].r;
			this.cells[i].c=c+state[i].c;
		}
	}
}
//每种图形类型的对象
function O(){
	Shape.call(this,0);//借用父类型构造函数，同时向构造函数中传入参数orgi(基础状态)
	this.cells=[//this指正在new的对象
		new Cell(0,4,this.IMGS.O), new Cell(0,5,this.IMGS.O),
		new Cell(1,4,this.IMGS.O), new Cell(1,5,this.IMGS.O),
	];
	this.states=[
		State(0,0,  0,1,  1,0,  1,1)//因为return，省略new,传入与参考格的相对坐标
	];
}
Object.setPrototypeOf(O.prototype,Shape.prototype);//让子类型继承父类型原型
function T(){
	Shape.call(this,1);//借用父类型构造函数
	this.cells=[
		new Cell(0,3,this.IMGS.T), new Cell(0,4,this.IMGS.T),
		new Cell(0,5,this.IMGS.T), new Cell(1,4,this.IMGS.T),
	];
	this.states=[
		State(0,-1,  0,0,  0,1,  1,0),
		State(-1,0,  0,0,  1,0,  0,-1),
		State(0,1,  0,0,  0,-1,  -1,0),
		State(1,0,  0,0,  -1,0,  0,1)
	]
}
Object.setPrototypeOf(T.prototype,Shape.prototype);
function I(){
	Shape.call(this,1);//借用父类型构造函数
	this.cells=[
		new Cell(0,3,this.IMGS.I), new Cell(0,4,this.IMGS.I),
		new Cell(0,5,this.IMGS.I), new Cell(0,6,this.IMGS.I),
	];
	this.states=[
		State(0,-1,  0,0,  0,1,  0,2),
		State(-1,0,  0,0,  1,0,  2,0)
	];
}
Object.setPrototypeOf(I.prototype,Shape.prototype);
function J(){
	Shape.call(this,1);//借用父类型构造函数
	this.cells=[
		new Cell(1,6,this.IMGS.J), new Cell(1,5,this.IMGS.J),
		new Cell(1,4,this.IMGS.J), new Cell(0,4,this.IMGS.J),
	];
	this.states=[
		State(0,1,  0,0,  0,-1,  -1,-1),
		State(1,0,  0,0,  -1,0,  -1,1),
		State(0,-1,  0,0,  0,1,  1,1),
		State(-1,0,  0,0,  1,0,  1,-1)
	]
}
Object.setPrototypeOf(J.prototype,Shape.prototype);
function L(){
	Shape.call(this,1);//借用父类型构造函数
	this.cells=[
		new Cell(1,3,this.IMGS.L), new Cell(1,4,this.IMGS.L),
		new Cell(1,5,this.IMGS.L), new Cell(0,5,this.IMGS.L),
	];
	this.states=[
		State(0,-1,  0,0,  0,1,  -1,1),
		State(-1,0,  0,0,  1,0,  1,1),
		State(0,1,  0,0,  0,-1,  1,-1),
		State(1,0,  0,0,  -1,0,  -1,-1)
	]
}
Object.setPrototypeOf(L.prototype,Shape.prototype);
function Z(){
	Shape.call(this,1);//借用父类型构造函数
	this.cells=[
		new Cell(0,3,this.IMGS.Z), new Cell(0,4,this.IMGS.Z),
		new Cell(1,4,this.IMGS.Z), new Cell(1,5,this.IMGS.Z),
	];
	this.states=[
		State(0,-1,  0,0,  1,0,  1,1),
		State(-1,0,  0,0,  0,-1,  1,-1)
	]
}
Object.setPrototypeOf(Z.prototype,Shape.prototype);
function S(){
	Shape.call(this,0);//借用父类型构造函数
	this.cells=[
		new Cell(0,5,this.IMGS.S), new Cell(0,6,this.IMGS.S),
		new Cell(1,4,this.IMGS.S), new Cell(1,5,this.IMGS.S),
	];
	this.states=[
		State(0,0,  0,1,  1,-1,  1,0),
		State(0,0,  1,0,  -1,-1,  0,-1)
	]
}
Object.setPrototypeOf(S.prototype,Shape.prototype);
function State(r0,c0,r1,c1,r2,c2,r3,c3){
	return [
		{r:r0,c:c0},//第1个格相对于参照格的偏移量
		{r:r1,c:c1},//第2个格相对于参照格的偏移量
		{r:r2,c:c2},//第3个格相对于参照格的偏移量
		{r:r3,c:c3},//第4个格相对于参照格的偏移量
	];
}//构造函数结尾返回一个对象，则构造函数不再创建新对象