class Wall extends Entity{
	constructor(ctx, canvas, world, x, y, color){
		super(ctx, canvas, world, x, y, MapContext.getTileSize(), MapContext.getTileSize(), color, 0, 0);
		this.tile = this.map.occupyTileWith(this);
	}

	update(){

	}

	render(){
		ctx.save();
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.w, this.h);
		ctx.restore();
	}

	getTile(){return this.tile;}
}