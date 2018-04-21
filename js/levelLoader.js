var jsons = [];

var LevelLoadingContext = {
    loadLevel : function(ctx, canvas, levelFilePath, width, height){
        println("Loading level...");
        let levelTexture = new Texture(ctx, canvas, levelFilePath, width, height);
        levelTexture.loadDataPixels();
        let levelTexturePixels = levelTexture.getDataPixels();
        println(levelTexturePixels);
        println("Level loaded.");
    },

    loadRawTextLevelFromFileV1 : function(ctx, canvas, world, filePath){
        let xml = new XMLHttpRequest();
        xml.open("GET", filePath, false);
        xml.send();
        
        //document.write("0");

        // retrieve the map size
        let numTiles = xml.responseText.split("##numberOfTiles")[1].split(/\n/);
        let mapRows = numTiles[1];
        let mapCols = numTiles[2];

        println("Rows: " + mapRows);
        println("Cols: " + mapCols);

        // retrieve the map information
        let levelDataText = filterTextBy(xml.responseText.split("##levelData")[1], /#.*/g).replace(/\n/g, " ").trim();
        println("Level data content text:\n" + levelDataText);

        let levelData = levelDataText.split(" ");
        println("levelData: " + levelData);

        var map = new Map(ctx, canvas, world);
        var tiles = [];
        let id = 0;
        let row = 0;
        let col = 0;
        let px = 0;
        let py = 0;
        var walls = [];
        var enemies = [];
        var powers = [];
        let basePowerValue = 1;
        var texture = TextureContext.getGrayTileTexture();

        for(let i = 0; i < levelData.length; ++i){
            let fileValue = castToInt(levelData[i]);
            let x = MapContext.getNormX(col);
            let y = MapContext.getNormY(row);

            switch(fileValue){
                // case x
                //  texture == ...
                // or tile = new XTile...

                case 0:
                    // player position
                    py = y;
                    px = x;
                    // stil has to tile under player
                    LevelLoadingContext.loadTile(map, tiles, id++, mapCols, row, col, texture);
                    break;
                case 1:
                    LevelLoadingContext.loadTile(map, tiles, id++, mapCols, row, col, texture);
                    break;
                case 2:
                    var wall = new Wall(ctx, canvas, world, x, y);
                    walls.push(wall);
                    LevelLoadingContext.loadTile(map, tiles, id++, mapCols, row, col, texture);
                    break;
                case 3:
                    var enemy = new Enemy(ctx, canvas, world, x, y);
                    enemies.push(enemy);
                    LevelLoadingContext.loadTile(map, tiles, id++, mapCols, row, col, texture);
                    break;
                case 4:
                    var power = new Power(ctx, canvas, world, x, y, basePowerValue);
                    powers.push(power);
                    LevelLoadingContext.loadTile(map, tiles, id++, mapCols, row, col, texture);
                    break;
                case 5:
                    // portal loading TODO
                    LevelLoadingContext.loadTile(map, tiles, id++, mapCols, row, col, texture);
                    break;
                default:
                    throw "Unknown token found while loading level.\n";
            }

            ++col;
            if(col >= mapCols){
                col = 0;
                ++row;
            }
        }

        map.rows = mapRows;
        map.cols = mapCols;
        map.tiles = tiles;

        var loadedLevel = new Level(world.getCurrentLevelId(), ctx, canvas, world, map, walls, enemies, powers, 10);

        world.getPlayer().setX(px);
        world.getPlayer().setY(py);

        return loadedLevel;
    },

    loadTile : function(map, tiles, id, cols, row, col, texture){
        tiles[cols * row + col] = new Tile(id, map.getContext(), map.getCanvas(), map.getWorld(), map, row, col, texture);
    },

};