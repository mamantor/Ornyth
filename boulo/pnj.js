var uno=0;

function textCallback2(data){
    if (uno===0) {
        console.log(data, this);
        uno =1;
    }
    
    data.scale = this.pizzatween.getValue() > data.index/ this.dialog.length ? this.dialogScale : 0;
    return data
}

var Pnj = new Phaser.Class({

    // Extends: Phaser.Physics.Arcade.Sprite,
    Extends: Phaser.GameObjects.Sprite,

    initialize:

    function Pnj (scene, x, y, sprite, dialog, dialogScale)
    {
        Phaser.GameObjects.Sprite.call(this, scene, x, y, sprite);
        // Phaser.Physics.Arcade.Sprite.call(this, scene, x, y, sprite);
 
        scene.sys.displayList.add(this);
        scene.sys.updateList.add(this);
 
        scene.physics.world.enableBody(this, 0);
        
        this.ctx = scene;
        this.dialog=dialog;
        this.speech;
        this.dialogScale = dialogScale;

        this.pizzatween = scene.tweens.addCounter({
            from: 0,
            to: 1,
            duration: 1000,
            paused: true
        });
        
    },

    place: function (posX, posY, sprite, dialog)
    {
        Phaser.GameObjects.Sprite.call(this, this.ctx, posX, posY, sprite);

    },
    
    speak: function(x,y) {
        this.speech = this.ctx.add.dynamicBitmapText(x, y, 'computerFont', this.dialog, 1);
        this.speech.setDisplayCallback(textCallback2.bind(this));
        this.pizzatween.play();
    },
    showbubble: function() {
        if (!this.speaking){
            this.speechBubble = this.ctx.add.sprite(this.x, this.y-60, 'speechBubble');
            this.speechBubble.setScale(0.3);
            this.speaking = true
            this.speak(this.x-38, this.y-60)
        }

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