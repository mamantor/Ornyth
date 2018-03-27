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
                Phaser.Scene.call(this, { key: 'PopupInventory', active : true, visible: false});
            },

        create: function () {
            inventoryMap = this.make.tilemap({key: 'popupInventoryMap'});
            var tileset56 = inventoryMap.addTilesetImage('inventoryCase');
            inventoryLayer = inventoryMap.createDynamicLayer('popupInventory', tileset56 , 0 , 0);

            // initInventory();
            // this.events.on('wake', initInventory, this);

            var _this = this;

            this.input.on('pointerdown', function (event) {
                // console.log(_this.scene);
                _this.input.stopPropagation();

                var sceneB = _this.scene.manager.getScene('sceneB');
                // sceneB.sys.setActive(true);
                // sceneB.sys.setVisible(true);
                sceneB.scene.bringToTop();

                // _this.scene.bringToTop();


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