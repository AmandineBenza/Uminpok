var ProjectileContext = {
	computeSpeedX : function(direction){
		switch(direction){
			case AnimationContext.getLeftDirValue():
				return -4;
			case AnimationContext.getRightDirValue():
				return 4;
			default:
				return 0;
		}
		return 0;
	},

	computeSpeedY : function(direction) {
		switch(direction){
			case AnimationContext.getUpDirValue():
				return -4;
			case AnimationContext.getDownDirValue():
				return 4;
			default:
				return 0;
		}
		return 0;
	}
};

class Projectile extends Entity{
	constructor(ctx, canvas, world, x, y, w, h, direction, color){
		super(ctx, canvas, world, x, y, w, h, ProjectileContext.computeSpeedX(direction), ProjectileContext.computeSpeedY(direction));
		this.radius = computeRadius(1, 10);
		this.dead = false;
		this.color = color;
	}

	update(){
		if(!this.dead){
			this.addX(this.speedX);
			this.addY(this.speedY);
			this.checkPosition();
			this.updateBox();
			this.checkWallsCollision();
		}
	}

	render(){
		if(this.dead)
			return;

		ctx.save();
		ctx.beginPath();
    	ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    	ctx.fillStyle = this.color;
    	ctx.fill();
    	ctx.stroke();
    	ctx.restore();
	}

	checkPosition(){
		if(this.x < 0 || this.x > RenderingContext.getCanvasWidth(this.canvas) || this.y < 0 || this.y > RenderingContext.getCanvasHeight(this.canvas)) {
			this.die();
		}
	}

	checkWallsCollision(){
		let walls = this.level.getWalls();

		for(let i = 0; i < walls.length; i++){
			let wall = walls[i];
			let x = wall.getX();
			let y = wall.getY();
			let h = wall.getH();
			let w = wall.getW();

			if(this.collides(x, y, w, h)){
				this.dead = true;
				this.level.removeEnemy(wall);
				this.level.getMap().getNormTileAt(x,y).forgetEnemy();
				return;
			}
		}
	}

	die(){
		this.dead = true;
	}

	isDead(){return this.dead;}
	getColor(){return this.color;}
	setColor(color){this.color = color;}
}