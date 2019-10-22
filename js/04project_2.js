var game={
	CELL_SIZE:26,//每个格子的宽和高
	RN:20,//总行数
	CN:10,//总列数
	OFFSET:15,//左侧和上方边框修正的宽度
	pg:null,//保存游戏主界面容器对象
	shape:null,//保存正在下落的图形
	interval:500,//每次下落的时间间隔
	timer:null,//保存当前正在执行的定时器
	wall:null,//保存所有停止下落的方块对象
	score:0,//游戏得分
	SCROES:[0,10,50,80,200],//定义删除行数对应的得分
	lines:0,//保存已经删除的总行数
	level:1,//保存游戏的等级
	nextShape:null,//保存下一次将要登场的图形
	state:1,//游戏状态，默认为启动
	GAMEOVER:0,//游戏结束
	RUNNING:1,//游戏进行中
	PAUSE:2,//游戏暂停
	IMG_OVER:"../picture/game-over.png",
	IMG_PAUSE:"../picture/pause.png",
	paint:function(){//专门负责重绘一切
		this.pg.innerHTML=this.pg.innerHTML.replace(/<img(.*?)>/g,"");//不清空会留下移动的痕迹
		this.paintShape();//重绘主角图形
		this.paintNextShape();//重绘下一个图形
		this.paintWall();//重绘wall
		this.paintScore();//重绘分数
		this.paintState();//重绘状态
	},
	paintState:function(){
		var img=new Image();
		switch(this.state){
			case this.GAMEOVER:
				img.src=this.IMG_OVER;break;
			case this.PAUSE:
				img.src=this.IMG_PAUSE;break;
		}
		this.pg.appendChild(img);//大小刚好覆盖pg
	},
	isGameOver:function(){
		for(var i=0;i<this.nextShape.cells.length;i++){
			var cell=this.nextShape.cells[i];
			if(this.wall[cell.r][cell.c]!=null){
				return true;
			}
		}
		return false;
	},
	randomShape:function(){//随机生成一个图形对象
		//在1~图形种类之间生成随机数
		switch(Math.floor(Math.random()*(6-0+1)+0)){//检查随机数
			case 0:return new O();//如果是0，就返回O类型的对象
			case 1:return new I();
			case 2:return new T();
			case 3:return new J();
			case 4:return new L();
			case 5:return new Z();
			case 6:return new S();
		}
	},
	paintNextShape:function(){//专门负责绘制nextShape图形
		var frag=document.createDocumentFragment();
		for(var i=0;i<this.nextShape.cells.length;i++){
			var cell=this.nextShape.cells[i];//将当前cell对象临时保存在变量cell中
			var img=new Image();//new一个Iamge元素(类似于option可以new)，保存在变量img中
			img.src=cell.img;
			img.style.top=(cell.r+1)*this.CELL_SIZE+this.OFFSET+"px";
			img.style.left=(cell.c+10)*this.CELL_SIZE+this.OFFSET+"px";
			frag.appendChild(img);
		}
		this.pg.appendChild(frag);
	},
	start:function(){//游戏启动
		var self=this;
		self.state=self.RUNNING;//重置游戏状态为运行
		self.score=0;
		self.lines=0;
		self.level=1;
		self.pg=document.querySelector(".playground");
		self.shape=self.randomShape();//创建一个图形对象
		self.nextShape=self.randomShape();
		//初始化wall数组为10*20的空二维数组
		self.wall=[];
		for(var r=0;r<self.RN;r++){
			self.wall.push(new Array(self.CN));
		}
		self.timer=setInterval(function(){
			self.moveDown();
		},self.interval);
		document.onkeydown=function(){
			var e=window.event||arguments[0];
			switch(e.keyCode){//返回number类型
				case 37:self.state==self.RUNNING&&self.moveLeft();break;//这里this指e
				case 39:self.state==self.RUNNING&&self.moveRight();break;
				case 40:self.state==self.RUNNING&&self.moveDown();break;
				case 38:self.state==self.RUNNING&&self.rotateR();break;
				case 90:self.state==self.RUNNING&&self.rotateL();break;//Z
				case 83:
					if(self.state==self.GAMEOVER){
						self.start();
					}
					break;
				case 80:
					if(self.state==self.RUNNING){
						self.state=self.PAUSE;
						clearInterval(self.timer);
						self.paint();//定时器停了，要自己手动绘制一下界面
					}
					break;
				case 67:
					if(self.state==self.PAUSE){
						self.state=self.RUNNING;
						self.timer=setInterval(function(){
							self.moveDown();
						},self.interval);
					}
					break;
				case 81:
					if(self.state!=self.GAMEOVER){
						self.state=self.GAMEOVER;
						if(self.timer!=null){
							clearInterval(self.timer);
							self.timer=null;
						}
						self.paint();
					}
			}
		}
		self.paint();
	},
	rotateR:function(){
		this.shape.rotateR();
		if(!this.canRotate()){
			this.shape.rotateL();//如果冲突，就再转回来
		}
		
		this.paint();
	},
	rotateL:function(){
		this.shape.rotateL();
		if(!this.canRotate()){
			this.shape.rotateR();//如果冲突，就再转回来
		}
		this.paint();
	},
	canRotate:function(){
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
			if(cell.c<0||cell.c>this.CN-1||cell.r<0||cell.r>this.RN-1||this.wall[cell.r][cell.c]!=null){
				return false;
			}
		}
		return true;
	},
	canLeft:function(){
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
			if(cell.c==0||this.wall[cell.r][cell.c-1]!=null){
				return false;
			}
		}
		return true;
	},
	moveLeft:function(){
		if(this.canLeft()){
			this.shape.moveLeft();
		}
		this.paint();
	},
	canRight:function(){
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
			if(cell.c==this.CN-1||this.wall[cell.r][cell.c+1]!=null){
				return false;
			}
		}
		return true;
	},
	moveRight:function(){
		if(this.canRight()){
			this.shape.moveRight();
		}
		this.paint();
	},
	canDown:function(){//专门检查是否可以下落
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
			//如果当前cell的r等于RN-1，或在wall数组中和当前cell位置对应的下一行的元素不等于null
			if(cell.r==this.RN-1||this.wall[cell.r+1][cell.c]){
				return false;
			}
		}
		return true;
	},
	moveDown:function(){//负责主角图形shape下落一步
		if(this.canDown()){
			this.shape.moveDown();//此行moveDown里面的this指this.shape(即game.shape)
		}else{//将shape中每个cell放入wall的相同位置
			for(var i=0;i<this.shape.cells.length;i++){
				var cell=this.shape.cells[i];
				this.wall[cell.r][cell.c]=cell;//数组里存的只是信息，要靠paintWall提取出来
				var lines=this.deleteRows();
				this.score+=this.SCROES[lines];
				this.lines+=lines;
			}
			if(!this.isGameOver()){
				this.shape=this.nextShape;//将等待的图形，放入shape中
				this.nextShape=this.randomShape();//再生成下一个要等待的图形
			}else{
				clearInterval(this.timer);
				this.timer=null;
				this.state=this.GAMEOVER;
			}
		}
		this.paint();
	},
	deleteRows:function(){//删除所有满格行
		for(var r=this.RN-1,lines=0;r>=0;r--){//自低向上遍历wall中的每一行
			if(this.isFullRow(r)){
				this.deleteRow(r);
				r++;//刚被删除的行还要再检查一次，(可删除，待解)
				lines++;
			}
		}
		return lines;//返回本次消除的行数 
	},
	paintScore:function(){
		var spans=document.querySelectorAll(".playground>p>span");
		spans[0].innerHTML=this.score;
		spans[1].innerHTML=this.lines;
		spans[2].innerHTML=this.level;
	},
	deleteRow:function(row){//删除第row行
		for(var r=row;r>=0;r--){//r从row开始向上遍历wall中上方所有行
			this.wall[r]=this.wall[r-1];//将wall的r-1行替换到wall的r行
			this.wall[r-1]=[];//将r-1行设置为[],不能省，防止最顶部出问题
			for(var c=0;c<this.CN;c++){//遍历当前r行中的每个元素
				if(this.wall[r][c]!=null){//如果当前元素不等于null
					this.wall[r][c].r++//将当前元素的r++,注意是数组里数据中的r,为了能让下移数据刷到界面上，而不只是数组下移
				}
			}
			if(this.wall[r-2].join("")==""){//如果r-2行无缝拼接后等于""，就break
				break;
			}
		}
	},
	isFullRow:function(row){//判断第row行是否满格
		for(var c=0;c<this.CN;c++){
			if(this.wall[row][c]==null){
				return false;
			}
		}
		return true;
	},
	paintWall:function(){//把wall里停住的图形刷出来
		var frag=document.createDocumentFragment();
		for(var r=0;r<this.RN;r++){
			for(var c=0;c<this.CN;c++){
				var cell=this.wall[r][c];
				if(cell){//当cell不为空时
					var img=new Image();
					img.src=cell.img;
					img.style.top=cell.r*this.CELL_SIZE+this.OFFSET+"px";
					img.style.left=cell.c*this.CELL_SIZE+this.OFFSET+"px";
					frag.appendChild(img);
				}
			}
		}
		this.pg.appendChild(frag);
	},
	paintShape:function(){//专门负责绘制当前shape图形
		var frag=document.createDocumentFragment();
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];//将当前cell对象临时保存在变量cell中
			var img=new Image();//new一个Iamge元素(类似于option可以new)，保存在变量img中
			img.src=cell.img;
			img.style.top=cell.r*this.CELL_SIZE+this.OFFSET+"px";
			img.style.left=cell.c*this.CELL_SIZE+this.OFFSET+"px";
			frag.appendChild(img);
		}
		this.pg.appendChild(frag);
	}
}
window.onload=function(){
	game.start();
}