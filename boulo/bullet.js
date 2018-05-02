var Bullet = new Phaser.Class({

    Extends: Phaser.GameObjects.Sprite,

    initialize:

    function Bullet (scene)
    {
        Phaser.GameObjects.Sprite.call(this, scene, player.x, player.y, 'bullet');
        // const ctx = game.scene.getScene("PopupInventory");
        // scene.physics.add.sprite(this, scene, 0, 0, 'bullet');
        
        this.born = 0;
        this.hitpoints = 100;
    },

    fire: function (player)
    {
        this.scene.anims.create({
            key: 'bullet',
            frames: this.scene.anims.generateFrameNumbers('bullet', { start: 0, end: 1 }),
            frameRate: 15,
            repeat: -1
        });
        this.anims.play('bullet', true);
        
        
        this.setPosition(player.x, player.y);
        this.body.allowGravity = false;
        if (player.flipX)
        {
            //  Facing left
            this.body.setVelocityX(200);
        }
        else
        {
            //  Facing right
            this.body.setVelocityX(200);
            
        }

        this.born = 0;
    },

    update: function (time, delta)
    {
    // this.x += this.speed * delta;
    this.born += delta;

     if (this.born > 2000) {
        this.setActive(false);
        this.setVisible(false);
     }
    }

});