var crafterMap;
var crafterLayer;
var craftingMaterialArray = [];

function craft () {
    const ctx = game.scene.getScene("Crafter");
    const craftingMaterialArrayIDs = [];
    const ingredients = [];
    const newTile = craftTileForMaterial("Crafter");
    craftingMaterialArray = [];
    
    crafterLayer.forEachTile((tile) => {
        
        if (tile.isFilled && tile.index !== -1) {
            craftingMaterialArrayIDs.push(tile.material.id);
            let materialCraftCount = parseInt(tile.materialSprite.countText.text)
            craftingMaterialArray.push({id : tile.material.id, count: materialCraftCount});
            ingredients.push(tile.material.materialSprite);
        }
    }, this);
    if (craftingMaterialArray.length === 2) {
        const newMaterial = readCraftMap(craftingMaterialArrayIDs);

        // const newTile = tileForMaterial(newMaterial);
        console.log(craftingMaterialArray);
        const craftCount = computeCraftCount(newMaterial.id, craftingMaterialArray);
        fillTileFromMaterialID(newTile, newMaterial.id, game.scene.getScene("PopupInventory"), craftCount);

    }
}

function clearCraftTile() {
    const craftTile = craftTileForMaterial("Crafter");
    if (craftTile.materialSprite) {
        clearTile(craftTile);
    }
}

function clearIngredients (material) {

    const leftIngredientsAray = computeIngredientsPostcraft("Crafter", craftingMaterialArray);

    crafterLayer.forEachTile((tile) => {
        
        if (tile.isFilled && tile.index === 3) {
            destroyMaterialSprite(tile.materialSprite);
            inventory.objects[tile.material.id] -= 1;
            if (inventory.objects[tile.material.id] === 0) {
                delete inventory.objects[tile.material.id];
            }
            freeTileFromLayer(tile);
        }
    }, this);
    inventory.objects[material.id] = inventory.objects[material.id] ? inventory.objects[material.id]+1 : 1;
}

var Crafter = new Phaser.Class({
        Extends: Phaser.Scene,

        preload: function () {
            this.load.image('inventoryCase', 'assets/tilemaps/inventoryCase.png');
            this.load.tilemapTiledJSON('crafterMap', 'tilemaps/crafter.json');

        },
        initialize: function PopupInventory (){
                Phaser.Scene.call(this, { key: 'Crafter'});
            },

        create: function () {

            crafterMap = this.make.tilemap({key: 'crafterMap'});
            var tileset56 = crafterMap.addTilesetImage('inventoryCase');
            crafterLayer = crafterMap.createDynamicLayer('crafterLayer', tileset56 , 500 , 50);

            crafterLayer.forEachTile((tile) => {
                if (tile.index !== -1){
                    // console.log(tile);
                }
            }, this);

            this.events.on('checkRecipe', craft, this);
            this.events.on('clearCraftTile', clearCraftTile, this);
            this.events.on('clearIngredients', clearIngredients, this);

            this.events.on('cleanYourTile', function (pointerX, pointerY) {
                console.log(pointerX, pointerY);
                // let leftTile = crafterLayer.getTileAtWorldXY(pointer.x, pointer.y);
                // leftTile.isFilled = false;
                // leftTile.material = null;
                
            }, this);

            // initInventory();
            // this.events.on('wake', initInventory, this);

            /*var _this = this;

            this.input.on('pointerdown', function (event) {
                // console.log(_this.scene);
                _this.input.stopPropagation();

                var sceneB = _this.scene.manager.getScene('sceneB');
                // sceneB.sys.setActive(true);
                // sceneB.sys.setVisible(true);
                sceneB.scene.bringToTop();

                // _this.scene.bringToTop();


            });*/

        
        },

    });