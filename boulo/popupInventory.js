var popupInventoryMap;
var popupInventory;

// function initInventory() {
//     for (matos in inventory.objects){
//         var tileToFill = inventoryLayer.findTile((tile) => {
//             if (tile.isFilled !== true && tile.index != -1) {
//                 return true;
//             }
//         }, this);
//         tileToFill.isFilled = true;
//         tileToFill.index = -1;
//     }
// }

var PopupInventory = new Phaser.Class({
        Extends: Phaser.Scene,

        preload: function () {
            this.load.image('inventoryCase', 'assets/tilemaps/inventoryCase.png');
            this.load.tilemapTiledJSON('popupInventoryMap', 'tilemaps/popupInventory.json');

        },
        initialize: function PopupInventory (){
                Phaser.Scene.call(this, { key: 'PopupInventory', active : true});
            },

        create: function () {
            console.log(this);
            inventoryMap = this.make.tilemap({key: 'popupInventoryMap'});
            var tileset56 = inventoryMap.addTilesetImage('inventoryCase');
            inventoryLayer = inventoryMap.createDynamicLayer('popupInventory', tileset56 , 0 , 0);

            // initInventory();
            // this.events.on('wake', initInventory, this);

            var _this = this;
            console.log(this.scene);

            this.input.on('pointerdown', function (event) {
                // console.log(_this.scene);
                // _this.input.stopPropagation();

                _this.scene.setActive(true);
                _this.scene.setVisible(true);

                // _this.scene.bringToTop();
                console.log(_this.scene);


            });

            this.input.keyboard.on('keydown_ESC', function () {
            
                this.input.stopPropagation();

                if (this.scene.isActive()) {
                    // inventoryLayer.forEachTile((tile) => {
                    //     if (tile.isFilled) {
                    //         tile.isFilled = false;
                    //         tile.index = 1;
                    //     }

                    // }, this)
                    this.scene.switch('sceneB');
                }
                this.input.stopPropagation();

            
            }, this);
        },

    });