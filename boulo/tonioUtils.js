function playerOutOfSprite(sprite, newSpriteKey, ctx) {

    const newSpriteX = sprite.x + 5; 
    const newSpriteY = sprite.y + sprite.height/2; 

    // reset the sprite
    sprite.setActive(false);
	sprite.setVelocityX(0);
	sprite.setVelocityY(0);
	
    var newPlayer = ctx.physics.add.sprite(newSpriteX, newSpriteY, newSpriteKey);

    ctx.physics.add.collider(newPlayer, layer);
    ctx.physics.add.overlap(newPlayer, pizzaman, (player, pizzaman) => {
        pizzaman.showbubble();
    });
    ctx.physics.add.overlap(newPlayer, pizzaman2, (player, pizzaman2) => {
        pizzaman2.showbubble();
    });
    ctx.physics.add.collider(newPlayer, layer2);
    ctx.physics.add.collider(newPlayer, layer);
    ctx.physics.add.collider(newPlayer, ctx.enemies, function (sprite1, sprite2) {
        sprite1.hit(sprite2);
    });
    newPlayer.setCollideWorldBounds(true);
    newPlayer.setBounce(0.2);
    newPlayer.body.setGravityY(300);

    for (flame of flames) {
        flame.destroy();
    }
    sprite.disableBody();
    
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

function findMaterial (materialRaw) {
    const material = materialRaw.replace(/,/g, '');
    const foundMaterial = materialMap.find(el => {
        const craftMaterialArray = Object.keys(el.recipe).sort();
        if (craftMaterialArray.length === 1) {

        }
        
        if (el.id === material) {
            return true;
        }
        if (craftMaterialArray.toString() === material) {
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

function getTileWorldCoords (tile) {
    const droppingLayer = tile.layer;
    const newX = droppingLayer.tilemapLayer.tileToWorldX(tile.x) + tile.width/2;
    const newY = droppingLayer.tilemapLayer.tileToWorldY(tile.y) +tile.height/2;

    return {'x': newX, 'y': newY};
}

function fillTileWithMaterialText(tile, material, ctx, newMaterialCount) {
    const newCoords = getTileWorldCoords(tile);
    const count = newMaterialCount ? newMaterialCount : inventory.objects[material];
    
    return ctx.add.text(newCoords.x, newCoords.y, count, { color: '#00ff00', align: 'left' });
}

function updateTileText(tile, ctx) {
    updateTileTextCount(tile, inventory.objects[tile.material.id]);
} 

function updateTileTextCount(tile, count) {
    tile.materialSprite.countText.setText(count);
}

function computeCraftCount(newMaterialID, craftingMaterialArray) {
    console.log(craftingMaterialArray);
    const craftedMaterial = findMaterial(newMaterialID);
    console.log(craftedMaterial.recipe);
    let tmpRes;
    let result = 999;
    
    if (Object.keys(craftedMaterial.recipe).length === 1){

        tmpRes = craftingMaterialArray.reduce((accumulator, currentValue) => {
           return (accumulator.count + currentValue.count);
        } );
        result = Math.floor(tmpRes/craftedMaterial.recipe[craftingMaterialArray[0].id]);


    } else {
        for (availableMaterial of craftingMaterialArray) {
        
            tmpRes = Math.floor(availableMaterial.count/craftedMaterial.recipe[availableMaterial.id])
            if (tmpRes < result) {
                result = tmpRes;
            }
        };
    }
    

    return result;
}

function computeIngredientsPostcraft (sceneKey, craftingMaterialArray) {
    
    const craftTile = craftTileForMaterial(sceneKey);
    const craftedMaterialID = craftTile.materialSprite.material.id;
    let quantityCrafted = parseInt(craftTile.materialSprite.countText.text);


    const craftedMaterial = findMaterial(craftedMaterialID);

    if (Object.keys(craftedMaterial.recipe).length === 1) {
        let leftNeededCount = craftedMaterial.recipe[craftingMaterialArray[0].id]*quantityCrafted;
        
        for(availableMaterial of craftingMaterialArray) {
            
            if (leftNeededCount !== 0) {
                const toSubstract = (availableMaterial.count < leftNeededCount) ? availableMaterial.count :  leftNeededCount;
                availableMaterial.count -= toSubstract;
                inventory.objects[availableMaterial] -= toSubstract;
                if (inventory.objects[availableMaterial] === 0) {
                    delete inventory.objects[availableMaterial];
                }
                leftNeededCount -= toSubstract;
            }
        }
    } else {
        for (availableMaterial of craftingMaterialArray) {
            availableMaterial.count -= craftedMaterial.recipe[availableMaterial.id]*quantityCrafted;
            inventory.objects[availableMaterial] -= craftedMaterial.recipe[availableMaterial.id]*quantityCrafted;
            if (inventory.objects[availableMaterial] === 0) {
                delete inventory.objects[availableMaterial];
            }
            
        }
    }

    inventory.objects[craftedMaterialID] = inventory.objects[craftedMaterialID] ? inventory.objects[craftedMaterialID]+quantityCrafted : quantityCrafted;

    console.log(craftingMaterialArray);
    
    return craftingMaterialArray;
}

// DRAAGIN, DRAAAGGING AAND DROPPING

function addSplitCountMaterial (gameObject, tile) {
    const material = findMaterial(gameObject.material.id);
    const newCoords = getTileWorldCoords

    const newSprite = ctx.add.sprite(newCoords.x, 0,'material',material.materialSI).setInteractive();

    newSprite.material = material;
    ctx.input.setDraggable(newSprite);
    const countText =  fillTileWithMaterialText(tile, matos, ctx);
    newSprite.countText = countText;

    fillTileFromLayer(tile, newSprite);
}

function destroyMaterialSprite(materialSprite) {
    materialSprite.countText.destroy();
    materialSprite.destroy();
}

function freeTileFromLayer (tile) {
    tile.isFilled = false;
    tile.material = null;
    tile.materialSprite = null;
}

function materialSpritePosition(gameObject,  newX, newY) {
    gameObject.x = newX;
    gameObject.y = newY;
    if (gameObject.countText) {
        gameObject.countText.x = newX;
        gameObject.countText.y = newY;
    }
    
}

function fillTileFromLayer (tile, gameObject) {
    const droppingLayer = tile.layer;
    
    tile.isFilled = true;
    tile.material = gameObject.material;
    tile.materialSprite = gameObject;

    const newX = droppingLayer.tilemapLayer.tileToWorldX(tile.x) + tile.width/2;
    const newY = droppingLayer.tilemapLayer.tileToWorldY(tile.y) +tile.height/2;

    materialSpritePosition(gameObject, newX, newY);
}

function fillTileFromMaterialID (tile, materialName, ctx, newMaterialCount) {
    const material = findMaterial(materialName);
    const newSprite = ctx.add.sprite(0,0,'material',material.materialSI).setInteractive();

    newSprite.material = material;
    ctx.input.setDraggable(newSprite);
    const countText =  fillTileWithMaterialText(tile, material.id, ctx, newMaterialCount);
    newSprite.countText = countText;

    fillTileFromLayer(tile, newSprite);
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
    destroyMaterialSprite(tile.materialSprite);
}

function tileForMaterial(material) {

    let resultTile = popupInventoryLayer.findTile((tile) => {
        if (tile.material && tile.material.id === material.id) {
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

// FIGHT an DEFEND

function playerHit(collideObj) {
    player.life -= collideObj.hitpoints;
    if (player.life <= 0) {
        player.gameOver();
    }
}

// THE ULTIMATE PURPOSE OF VIDEO GAME

function GAMEOVERYOUBITCH() {
    console.log('you lost you bitch'); // cheap version 0.1
}