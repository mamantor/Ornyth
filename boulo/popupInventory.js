var popupInventoryMap;
var popupInventoryLayer;

function initPopupInventory() {
        
    let tileToFill;

    let material;
    const ctx = game.scene.getScene("PopupInventory");
    popupInventoryLayer.forEachTile((tile) => {
        if (tile.isFilled) {
            tile.isFilled = false;
            tile.index = 1;
        }
    }, this);

    for (matos in inventory.objects){

        material = findMaterial(matos);

        tileToFill = popupInventoryLayer.findTile((tile) => {
            if (tile.material === matos) {
                tile.isFilled = true;
                return true;
            }
        }, this);

        if (!tileToFill) {
            var newtileToFill = popupInventoryLayer.findTile((tile) => {
                if (tile.isFilled !== true && tile.index != -1) {
                    return true;
                }
            }, this);
            newtileToFill.material = matos;
            const newSprite = ctx.add.sprite(popupInventoryLayer.tileToWorldX(newtileToFill.pixelX) + newtileToFill.width/2,popupInventoryLayer.tileToWorldY(newtileToFill.pixelY) +newtileToFill.height/2,'material',material.materialSI).setInteractive();
            newSprite.material = matos;
            ctx.input.setDraggable(newSprite);
            newtileToFill.isFilled = true;
            newtileToFill.index = 1;
        }
        
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
            popupInventoryLayer = inventoryMap.createDynamicLayer('popupInventory', tileset56 , 300 , 100);
            initPopupInventory();

            var _this = this;

            this.events.on('updateInventory', initPopupInventory, this);
            this.input.on('dragstart', function (pointer, gameObject) {
                let leftTile = popupInventoryLayer.getTileAtWorldXY(pointer.x, pointer.y);

                if (leftTile) {
                    freeTileFromLayer(leftTile);
                } else {
                    activeCrafterScene = getActiveDNDScene();
                    console.log(pointer.x, pointer.y);
                    activeCrafterScene.events.emit('cleanYourTile',pointer.x, pointer.y);
                }
            });

            this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
                gameObject.x = dragX;
                gameObject.y = dragY;

            });

            this.input.on('dragend', function (pointer, gameObject) {

                let tileAlreadySameMaterial = false;

                const dropTile = crafterLayer.getTileAtWorldXY(pointer.x - 5, pointer.y, true);
                if (dropTile.index === 3 && !dropTile.isFilled) {
                    dropTile.isFilled = true;
                    dropTile.material = gameObject.material;
                    gameObject.x = dropTile.pixelX + dropTile.width/2;
                    gameObject.y = dropTile.pixelY +dropTile.height/2;
                    game.scene.getScene('Crafter').events.emit('toto', this);
                } else {
                    
                    var rollbackTile = popupInventoryLayer.findTile((tile) => {
                        if (tile.material === gameObject.material) {
                            tileAlreadySameMaterial = true;
                            return true;
                        }
                        if (tile.isFilled !== true && tile.index != -1) {
                            return true;
                        }
                    }, this);
                    if (!tileAlreadySameMaterial) {
                        gameObject.x = rollbackTile.pixelX + rollbackTile.width/2;
                        gameObject.y = rollbackTile.pixelY +rollbackTile.height/2;
                        dropTile.isFilled = true;
                    } else {
                        gameObject.destroy();
                    }

                    tileAlreadySameMaterial = false;
                    

                }
            });

            this.input.keyboard.on('keydown_M', function (event) {
                _this.input.stopPropagation();
                var sceneB = _this.scene.manager.getScene('sceneB');
                sceneB.scene.bringToTop();

            });
        },
    });