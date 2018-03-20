function playerOutOfSprite(sprite, newSpriteKey, ctx) {

    const newSpriteX = sprite.x + 5; 
    const newSpriteY = sprite.y + sprite.height/2; 

    var newPlayer = ctx.physics.add.sprite(newSpriteX, newSpriteY, newSpriteKey);

    ctx.physics.add.collider(newPlayer, layer);
    ctx.physics.add.collider(newPlayer, layer2);
    newPlayer.setBounce(0.2);
    newPlayer.setCollideWorldBounds(true);
    newPlayer.body.setGravityY(300);

    return newPlayer;
};