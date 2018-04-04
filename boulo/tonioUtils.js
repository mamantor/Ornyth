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
    console.log(seekId);

    const foundMaterial = findMaterial(seekId);

    console.log(foundMaterial);
    return foundMaterial;
}

function findMaterial (material) {
    const foundMaterial = materialMap.find(el => {
        if (!el.recipe && el.id === material) {
            return true;
        }
        if (el.recipe.toString() === material) {
            return true;
        }
    });

    return foundMaterial;
}

// DRAAGIN, DRAAAGGING AAND DROPPING

function freeTileFromLayer (tile) {
    tile.isFilled = false;
    tile.material = null;
}

function getActiveDNDScene() {
    for (el of game.scene.scenes) {
        if (el.sys.isActive && DND_SCENES.includes(el.scene.key)) {
            return game.scene.getScene(el.scene.key);
        }
    }
}