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
            
            const newSprite = ctx.add.sprite(popupInventoryLayer.tileToWorldX(newtileToFill.pixelX) + newtileToFill.width/2,popupInventoryLayer.tileToWorldY(newtileToFill.pixelY) +newtileToFill.height/2,'material',material.materialSI).setInteractive();
            newSprite.material = matos;
            newtileToFill.material = matos;
            newtileToFill.materialSprite = newSprite;
            ctx.input.setDraggable(newSprite);
            newtileToFill.isFilled = true;
            newtileToFill.index = 1;
        }
        
    }
}

function updatePopupInventory (material){
    console.log(material);
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

            this.events.on('updateInventory', function () {
                console.log('toto');
            }, this);
            this.input.on('dragstart', function (pointer, gameObject) {
                let leftTile = tileUnderPointer(pointer);
                clearTile(leftTile);
            });

            this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
                gameObject.x = dragX;
                gameObject.y = dragY;

            });

            this.input.on('dragend', function (pointer, gameObject) {

                let dropTile;

                dropTile = tileUnderPointer(pointer);

                if (dropTile && dropTile.index !== -1 && !dropTile.isFilled) {
                    fillTileFromLayer(dropTile, gameObject);
                    const craftScene = getActiveDNDScene();
                    craftScene.events.emit('checkRecipe', this);
                } else {
                    
                   const rollbacktile = rollbackTileForMaterial(gameObject.material);
                   if (rollbacktile.material === gameObject.material) {
                       gameObject.destroy();
                       // modifier gameobject.text de la case => le mieux lier la tile avec son sprite pour afficher le nombre dans l'inventaire
                   } else {
                        fillTileFromLayer(rollbacktile, gameObject);
                   }
                    
                }
            });

            this.input.keyboard.on('keydown_M', function (event) {
                _this.input.stopPropagation();
                var sceneB = _this.scene.manager.getScene('sceneB');
                sceneB.scene.bringToTop();

            });
        },
    });