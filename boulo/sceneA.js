var inventoryMap;
var inventoryLayer;

function initInventory() {
    console.log(inventory);
    for (matos in inventory.objects){
        console.log(matos);
        var tileToFill = inventoryLayer.findTile((tile) => {
            if (!tile.isFilled && tile.index != -1) {
                return true;
            }
        }, this);

        console.log(tileToFill);

        tileToFill.isFilled = true;
        tileToFill.index = -1;
    }
}

var SceneA = new Phaser.Class({
        Extends: Phaser.Scene,

        preload: function () {
            this.load.image('inventoryCase', 'assets/tilemaps/inventoryCase.png');
            this.load.tilemapTiledJSON('inventoryMap', 'tilemaps/inventory.json');

        },
        initialize: function SceneA (){
                Phaser.Scene.call(this, { key: 'sceneA' });
            },

        create: function () {
            inventoryMap = this.make.tilemap({key: 'inventoryMap'});
            var tileset55 = inventoryMap.addTilesetImage('inventoryCase');
            inventoryLayer = inventoryMap.createDynamicLayer('inventoryLayer', tileset55, 0, 0);

            initInventory();

            this.input.keyboard.on('keydown_ESC', function () {
            
                this.input.stopPropagation();

                if (this.scene.isActive()) {
                    this.scene.switch('sceneB');
                }
                this.input.stopPropagation();

            
            }, this);
        }

    });