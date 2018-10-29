var uno='0';

function textCallback2(data){
    console.log(uno);
    data.scale = this.pizzatween.getValue() > data.index/this.dialog[this.dialogIndex].length ? this.dialogScale : 0;
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
        this.dialogIndex=0;

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
        this.speech = this.ctx.add.dynamicBitmapText(x, y, 'computerFont', this.dialog[this.dialogIndex], 1);
        this.speech.setDisplayCallback(textCallback2.bind(this));
        this.pizzatween.play();
    },
    nextDialog: function() {
        this.dialogIndex++;
        this.speech.setText(this.dialog[this.dialogIndex]);
        uno='1'
        this.pizzatween.restart();
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

    }

});