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
        const newTile = tileForMaterial(matos);
        fillTileFromMaterialID(newTile, matos, ctx);
    }
}

function updatePopupInventory (material){
    udpateTile = tileForMaterial(material);
    if (udpateTile.material && udpateTile.material.id === material) {
        // modifier gameobject.text de la case => le mieux lier la tile avec son sprite pour afficher le nombre dans l'inventaire
    } else {
        fillTileFromMaterialID(udpateTile, material, this);
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

            this.events.on('updateInventory', updatePopupInventory, this);
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

                console.log('droptile1', dropTile);

                if (dropTile && dropTile.index !== -1 && !dropTile.isFilled) {
                    console.log('dropTile', dropTile);
                    fillTileFromLayer(dropTile, gameObject);
                    const craftScene = getActiveDNDScene();
                    console.log(dropTile.layer.name === "popupInventory");
                    if (dropTile.layer.name !== "popupInventory") {
                        craftScene.events.emit('checkRecipe', this);
                        
                    }
                } else {
                    
                   const rollbacktile = tileForMaterial(gameObject.material);
                   if (rollbacktile.material === gameObject.material) {
                       gameObject.destroy();
                       // modifier gameobject.text de la case => le mieux lier la tile avec son sprite pour afficher le nombre dans l'inventaire
                   } else {
                       console.log('rollbacktile', rollbacktile);
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