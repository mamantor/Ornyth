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