function playerOutOfSprite(sprite, newSpriteKey, ctx) {

    const newSpriteX = sprite.x + 5; 
    const newSpriteY = sprite.y + sprite.height/2; 

    // reset the sprite
    sprite.setActive(false);
	sprite.setVelocityX(0);
	sprite.setVelocityY(0);
	
    var newPlayer = ctx.physics.add.sprite(newSpriteX, newSpriteY, newSpriteKey);

    ctx.physics.add.collider(newPlayer, layer);
    ctx.physics.add.collider(newPlayer, layer2);
    newPlayer.setBounce(0.2);
    newPlayer.setCollideWorldBounds(true);
    newPlayer.body.setGravityY(300);

    for (flame of flames) {
           flame.destroy();
            
        }

    return newPlayer;
};

function getTopLayerOfScene(scene) {
    const layersOfScene = scene.sys.displayList.list.filter((el) => {
        return (el.type === "DynamicTilemapLayer" || el.type === "StaticTilemapLayer")
    });
    return scene.sys.displayList.getTopGameObject(layersOfScene);
}

// function renderCamera (playerX, game) {
//     if (playerX < 500) {
//         game.cameras.main.stopFollow(player);
//         // game.cameras.main.setBounds(0,0, 800, 340);
//     }

//     if (playerX > 500) {
//         game.cameras.main.startFollow(player);
//         renderBackgroundsForward();
//     }
// }

// function renderBackgroundsForward () {
//     var isForward = player.body.velocity.x > 0;
//     backstars.forEach((stars) => {
//         var deltaX = (backstars.indexOf(stars)+2)/10;
//         isForward ? stars.tilePositionX += deltaX : stars.tilePositionX -= deltaX;
//     });
//     hazestuff.forEach((haze) => {
//         var deltaX = (hazestuff.indexOf(haze)+2)/10;
//         isForward ? haze.tilePositionX += deltaX : haze.tilePositionX -= deltaX;
//     })
// }

// CRAFTING

function readCraftMap (recipeArray) {
    recipeArray.sort();
    const seekId = recipeArray.toString();

    const foundMaterial = findMaterial(seekId);

    return foundMaterial;
}

function findMaterial (material) {
    const foundMaterial = materialMap.find(el => {
        el.recipe.sort();
        if (el.id === material) {
            return true;
        }
        if (el.recipe.toString() === material) {
            return true;
        }
    });

    return foundMaterial;
}

function craftTileForMaterial(sceneKey) {
    const dropScene = game.scene.getScene(sceneKey);
    const dropLayer = getTopLayerOfScene(dropScene);
    let craftTile = dropLayer.findTile((tile) => {
        if (tile.index === CRAFT_TILES_INDEXES[sceneKey]) {
            return true;
        }
    }, this);

    return craftTile;
}

// DRAAGIN, DRAAAGGING AAND DROPPING

function freeTileFromLayer (tile) {
    tile.isFilled = false;
    tile.material = null;
}

function fillTileFromLayer (tile, gameObject) {
    console.log(tile);
    const droppingLayer = tile.layer;
    
    tile.isFilled = true;
    tile.material = gameObject.material;
    tile.materialSprite = gameObject;

    const newX = droppingLayer.tilemapLayer.tileToWorldX(tile.x) + tile.width/2;
    const newY = droppingLayer.tilemapLayer.tileToWorldY(tile.y) +tile.height/2;

    gameObject.x = newX;
    gameObject.y = newY;
}

function fillTileFromMaterialID (tile, materialName, ctx) {
    const material = findMaterial(materialName);
    const newSprite = ctx.add.sprite(0,0,'material',material.materialSI).setInteractive();

    newSprite.material = material;
    ctx.input.setDraggable(newSprite);

    fillTileFromLayer(tile, newSprite);
    
    tile.index = 1;
}

function getActiveDNDScene() {
    for (el of game.scene.scenes) {
        if (el.sys.isActive && DND_SCENES.includes(el.scene.key)) {
            return game.scene.getScene(el.scene.key);
        }
    }
}

function clearTile(tile) {
    tile.isFilled = false;
    tile.material = null;
}

function tileForMaterial(material) {

    let resultTile = popupInventoryLayer.findTile((tile) => {
        if (tile.material && tile.material.id === material) {
            return true;
        }
    }, this);

    if (!resultTile) {
        resultTile = popupInventoryLayer.findTile((tile) => {
            if (tile.isFilled !== true && tile.index != -1) {
                return true;
            }
        }, this);
    }

    return resultTile;
}

function tileUnderPointer (pointer) {

    let dropTile;

    if (inventoryMap.hasTileAtWorldXY(pointer.x, pointer.y)) {
        dropTile = popupInventoryLayer.getTileAtWorldXY(pointer.x, pointer.y, true);
    } else {
        const dropScene = getActiveDNDScene();
        const dropLayer = getTopLayerOfScene(dropScene);
        dropTile = dropLayer.getTileAtWorldXY(pointer.x, pointer.y, true);
    }
    return dropTile;
}