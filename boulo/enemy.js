var Enemy = new Phaser.Class({

    Extends: Phaser.GameObjects.Sprite,

    initialize:

    function Enemy (scene)
    {
        Phaser.GameObjects.Sprite.call(this, scene, player.x, player.y, 'alienworm');
        // const ctx = game.scene.getScene("PopupInventory");
        
        this.born = 0;
        this.hitpoints = 100;
        this.life = 300;
        this.lastMoved = 0;
        this.ctx = scene;

        this.deathEmmiter = scene.add.particles('alienwormEmmiter').createEmitter({
            frame: { frames: [0,1,0,1,0], cycle: true },
            x: 64,
            y: 0,
            quantity: 20,
            speed: {min: 50, max: 100},
            angle: {min: 180, max: 360},
            scale: { start: 4, end: 3 },
            blendMode: 'SCREEN',
            active: false,
            collideTop: false,
            collideBottom: true,
            bounce: 10,
            
            lifespan: 1000
        });
    },

    summon: function (player)
    {
        this.setPosition(player.x, player.y - 100);
        this.body.setVelocityX(200);

        this.born = 0;
        console.log(this)

        this.scene.anims.create({
            key: 'enemyMove',
            frames: this.ctx.anims.generateFrameNumbers('alienworm', { start: 0, end: 1 }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.play('enemyMove', true);
    },
    die: function( ) {
        
        console.log(this.y);
        console.log(this.deathEmmiter.bounds);
        this.deathEmmiter.active = true;
        this.deathEmmiter.bounds = { x: this.x},
        console.log(this.deathEmmiter.bounds);
        
        this.deathEmmiter.setPosition(this.x, this.y);
        this.deathEmmiter.explode();
        this.destroy();
    }, 
    hit: function(bullet) {
        this.life -= bullet.hitpoints;
        if (this.life <= 0) {
            this.die();
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