function textCallback(data){
    data.scale = textTween.getValue() > data.index/ this.dialog.length ? 1 : 0;
    return data
}

var Pnj = new Phaser.Class({

    Extends: Phaser.GameObjects.Sprite,

    initialize:

    function Pnj (scene, posX, posY, sprite, dialog)
    {
        Phaser.GameObjects.Sprite.call(this, scene, posX, posY, sprite);
        
        this.ctx = scene;
        this.dialog=dialog;
        this.speech;

        this.textTween = this.tweens.addCounter({
            from: 0,
            to: 1,
            duration: 2000
        });
        
    },

    place: function (posX, posY, sprite, dialog)
    {
        Phaser.GameObjects.Sprite.call(this, this.ctx, posX, posY, sprite);

    },
    
    speak: function() {
        this.speech = ctx.add.dynamicBitmapText(32, 100, 'computerFont', dialog, 64);
        text.setDisplayCallback(textCallback);
    },

    update: function (time, delta)
    {
        let newVelocity = 0;
        this.born += delta;
        if (time - this.lastMoved > 1000) {
            direction = Math.floor(Math.random()*10%2);
            this.body.setVelocityX(-200 + (direction*400));
            this.lastMoved = time;
        }

    }

});