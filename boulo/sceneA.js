var inventoryMap;
var inventoryLayer;

function initInventory() {
    for (matos in inventory.objects){
        var tileToFill = inventoryLayer.findTile((tile) => {
            if (tile.isFilled !== true && tile.index != -1) {
                return true;
            }
        }, this);
        tileToFill.isFilled = true;
        tileToFill.index = -1;
    }
}

var SceneA = new Phaser.Class({
        Extends: Phaser.Scene,

        preload: function () {
            this.load.image('inventoryCase', 'assets/tilemaps/inventoryCase.png');
            this.load.image('miningTiles', 'assets/tilemaps/miningTiles.png');
            this.load.tilemapTiledJSON('inventoryMap', 'tilemaps/inventory.json');

        },
        initialize: function SceneA (){
                Phaser.Scene.call(this, { key: 'sceneA' });
            },

        create: function () {
            console.log('create sceneA');

            inventoryMap = this.make.tilemap({key: 'inventoryMap'});
            var tileset55 = inventoryMap.addTilesetImage('miningTiles');

            inventoryLayer = inventoryMap.createDynamicLayer('inventoryLayer', tileset55, 0, 0);

            initInventory();
            this.events.on('wake', initInventory, this);

            this.input.keyboard.on('keydown_ESC', function () {
            
                this.input.stopPropagation();

                if (this.scene.isActive()) {
                    inventoryLayer.forEachTile((tile) => {
                        if (tile.isFilled) {
                            tile.isFilled = false;
                            tile.index = 1;
                        }

                    }, this)
                    this.scene.switch('sceneB');
                }
                this.input.stopPropagation();

            
            }, this);
        },

    });