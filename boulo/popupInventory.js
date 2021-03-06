var popupInventoryMap;
var popupInventoryLayer;

function initPopupInventory() {
        
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

function updatePopupInventory (materialID){
    const material = findMaterial(materialID);
    const udpateTile = tileForMaterial(material);
    const ctx = game.scene.getScene("PopupInventory");
    
    if (udpateTile.material && udpateTile.material.id === material.id) {
        updateTileText(udpateTile, ctx);
        // modifier gameobject.text de la case => le mieux lier la tile avec son sprite pour afficher le nombre dans l'inventaire
    } else {
        fillTileFromMaterialID(udpateTile, material.id, this);
        inventory.material = 1;
    }
}

var PopupInventory = new Phaser.Class({
        Extends: Phaser.Scene,


        preload: function () {
            // this.load.image('inventoryCase', 'assets/tilemaps/inventoryCase.png');
            this.load.tilemapTiledJSON('popupInventoryMap', 'tilemaps/popupInventory.json');
            // this.load.spritesheet('material', 'assets/tilesets/material.png', { frameWidth: 40, frameHeight: 40 }); 
            // console.log(this.tilesetName, this.tileset);
            // this.load.image(this.tilesetName, this.tileset);
            // this.load.tilemapTiledJSON(this.tileMapName, this.thileMap);

        },

        // ('PopupInventory', 'inventoryCase',  'assets/tilemaps/inventoryCase.png', 'popupInventoryMap', 'tilemaps/popupInventory.json')
        PopupInventory : function (name, tilesetName, tileset,  tileMapName, thileMap){

            this.name = name;
            this.tileset = tileset;
            this.tilesetName = tilesetName;
            this.tileMapName = tileMapName;
            this.thileMap = thileMap;
            this.load.image(this.tilesetName, this.tileset);
            this.load.tilemapTiledJSON(this.tileMapName, this.thileMap);
            Phaser.Scene.call(this, { key: this.name, active : true});
        },

        initPopupInventory: function() {
        
            const ctx = game.scene.getScene("PopupInventory");
            this.inventoryLayer.forEachTile((tile) => {
                if (tile.isFilled) {
                    tile.isFilled = false;
                    tile.index = 1;
                }
            }, this);
        
            for (matos in inventory.objects){
                const newTile = tileForMaterial(matos);
                fillTileFromMaterialID(newTile, matos, ctx);
                
            }
        },
        updatePopupInventory: function (materialID){
            const material = findMaterial(materialID);
            const udpateTile = tileForMaterial(material);
            const ctx = game.scene.getScene("PopupInventory");
            
            if (udpateTile.material && udpateTile.material.id === material.id) {
                updateTileText(udpateTile, ctx);
                // modifier gameobject.text de la case => le mieux lier la tile avec son sprite pour afficher le nombre dans l'inventaire
            } else {
                fillTileFromMaterialID(udpateTile, material.id, this);
                inventory.material = 1;
            }
        },

        create: function () {
            ShiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

            inventoryMap = this.make.tilemap({key: 'popupInventoryMap'});
            var tileset56 = inventoryMap.addTilesetImage('inventoryCase');
            // popupInventoryLayer = inventoryMap.createDynamicLayer('popupInventory', tileset56 , 300 , 100);
            this.inventoryLayer = inventoryMap.createDynamicLayer('popupInventory', tileset56 , 300 , 100);
            this.initPopupInventory();

            var _this = this;

            this.events.on('updateInventory', updatePopupInventory, this);

            this.input.on('dragstart', function (pointer, gameObject) {
                let leftTile = tileUnderPointer(pointer);
                const craftScene = getActiveDNDScene();
                const ctx = game.scene.getScene("PopupInventory");

                if (leftTile.layer.name !== "popupInventory") {
                    const craftTile = craftTileForMaterial(craftScene.scene.key);
                    if (leftTile === craftTile) {
                        craftScene.events.emit('clearIngredients',gameObject.material, craftTile, this);
                    } else {
                        console.log('cleartile');
                        craftScene.events.emit('clearCraftTile', this);
                    }
                }

                if (ShiftKey.isDown) {
                    const initialCount = parseInt(gameObject.countText.text);
                    const newCount = Math.floor(parseInt(gameObject.countText.text)/2);
                    gameObject.countText.setText(newCount);
                    fillTileFromMaterialID(leftTile,gameObject.material.id,ctx);
                    updateTileTextCount(leftTile, (initialCount - newCount));

                } else {
                    freeTileFromLayer(leftTile);
                }
                
                

            });

            this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
                gameObject.x = dragX;
                gameObject.y = dragY;
                gameObject.countText.x = dragX;
                gameObject.countText.y = dragY;

            });

            this.input.on('dragend', function (pointer, gameObject) {

                let dropTile;

                dropTile = tileUnderPointer(pointer);
                const craftScene = getActiveDNDScene();
                const craftTile = craftTileForMaterial(craftScene.scene.key);


                if (dropTile && dropTile.index !== -1 && !dropTile.isFilled && dropTile !== craftTile) {
                    fillTileFromLayer(dropTile, gameObject);
                    if (dropTile.layer.name !== "popupInventory") {
                        craftScene.events.emit('checkRecipe', this);
                    }
                } else {
                    const rollbacktile = tileForMaterial(gameObject.material);
                    if (rollbacktile.material === gameObject.material) {
                        
                        
                        const updateCount = parseInt(rollbacktile.materialSprite.countText.text) + parseInt(gameObject.countText.text)
                        updateTileTextCount(rollbacktile, updateCount);
                        destroyMaterialSprite(gameObject);
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