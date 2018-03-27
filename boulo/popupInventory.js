var popupInventoryMap;
var popupInventoryLayer;

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

function initPopupInventory() {
        


    let textureIndex;
    const ctx = game.scene.getScene("PopupInventory");
    const blocs = ctx.add.staticGroup();
    const titi = blocs.create(107, 136, 'bloc');
    console.log(titi);

    popupInventoryLayer.forEachTile((tile) => {
                        if (tile.isFilled) {
                            tile.isFilled = false;
                            tile.index = 1;
                        }

    }, this);
    for (matos in inventory.objects){
        textureIndex = materialMap[matos];
        console.log(textureIndex);
        var tileToFill = popupInventoryLayer.findTile((tile) => {
            if (tile.isFilled !== true && tile.index != -1) {
                return true;
            }
        }, this);
        tileToFill.material = matos;
        console.log(tileToFill)
        const newSprite = ctx.add.sprite(tileToFill.pixelX + tileToFill.width/2,tileToFill.pixelY +tileToFill.height/2,'material',textureIndex).setInteractive();
        
        ctx.input.setDraggable(newSprite);
        console.log(game.scene);
        console.log(this);
        tileToFill.isFilled = true;
        tileToFill.index = 1;
    }
}

var PopupInventory = new Phaser.Class({
        Extends: Phaser.Scene,

        preload: function () {
            this.load.image('inventoryCase', 'assets/tilemaps/inventoryCase.png');
            this.load.tilemapTiledJSON('popupInventoryMap', 'tilemaps/popupInventory.json');
            this.load.spritesheet('material', 'assets/tilesets/material.png', { frameWidth: 40, frameHeight: 40 });

        },
        initialize: function PopupInventory (){
                Phaser.Scene.call(this, { key: 'PopupInventory'});
            },

        create: function () {

            inventoryMap = this.make.tilemap({key: 'popupInventoryMap'});
            var tileset56 = inventoryMap.addTilesetImage('inventoryCase');
            popupInventoryLayer = inventoryMap.createDynamicLayer('popupInventory', tileset56 , 0 , 0);
            // initPopupInventory();
            initPopupInventory();

            // initInventory();
            // this.events.on('wake', initInventory, this);

            var _this = this;

            this.events.on('updateInventory', initPopupInventory, this);
            this.input.on('dragstart', function (pointer, gameObject) {
                const leftTile = popupInventoryLayer.getTileAtWorldXY(pointer.x, pointer.y);
                if (leftTile) {
                    leftTile.isFilled = false;
                }

            });

            this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
                gameObject.x = dragX;
                gameObject.y = dragY;

            });

            this.input.on('dragend', function (pointer, gameObject) {

                const dropTile = crafterLayer.getTileAtWorldXY(pointer.x - 5, pointer.y, true);
                if (dropTile.index !== -1) {
                    gameObject.x = dropTile.pixelX + dropTile.width/2;
                    gameObject.y = dropTile.pixelY +dropTile.height/2;
                    /*const crafter = this.scene.manager.getScene('Crafter');
                    crafter.events.emit('toto', this);*/
                } else {
                    var rollbackTile = popupInventoryLayer.findTile((tile) => {
                        if (tile.material !== true && tile.index != -1) {
                            return true;
                        }
                        if (tile.isFilled !== true && tile.index != -1) {
                            return true;
                        }
                    }, this);
                    gameObject.x = rollbackTile.pixelX + rollbackTile.width/2;
                    gameObject.y = rollbackTile.pixelY +rollbackTile.height/2;
                    dropTile.isFilled = true;

                }
            });

            this.input.keyboard.on('keydown_M', function (event) {
                // console.log(_this.scene);
                _this.input.stopPropagation();

                

                var sceneB = _this.scene.manager.getScene('sceneB');
                // sceneB.sys.setActive(true);
                // sceneB.sys.setVisible(true);
                sceneB.scene.bringToTop();

                // _this.scene.bringToTop();


            });

        
        },

    });