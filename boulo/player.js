
var Player = new Phaser.Class({
   
    Extends: Phaser.Physics.Arcade.Sprite,
 
    initialize:
 
    function Player (scene, x, y, spritekey)
    {
        Phaser.Physics.Arcade.Sprite.call(this, scene, x, y, spritekey);
 
        scene.sys.displayList.add(this);
        scene.sys.updateList.add(this);
 
        scene.physics.world.enableBody(this, 0);
        this.statsManager = new statsManager(2, 100);
        
        this.born = 0;
        this.invulnerable = false;
        this.colliders = []; // for player out of sprites
        
    },
    hit: function(collideObject) {
        if (!this.invulnerable) {
            this.statsManager.life -= collideObject.hitpoints;
            console.log('benne hit ! Life :', this.statsManager.life);
            if (this.statsManager.life <= 0) {
                this.die();
            }
            this.invulnerable = true;
            this.blinkit;
            setTimeout(() =>{
                this.invulnerable = false;
            } , 3000);
        }
        
    },
    die: function(){
        this.setActive(false);
        var circle = new Phaser.Geom.Circle(0, 0, 50);
        this.deathEmmiter = this.scene.add.particles('thePix').createEmitter({
            frame: { frames: [0], cycle: true },
            x: this.x,
            y: this.y,
            quantity: 20,
            speed: {min: 500, max: 600},
            angle: {min: 180, max: 360},
            scale: { start: 4, end: 1 },
            tint: { start: 0x00000000, end: 0xffffff00 },
            moveToX: this.x+50,
            moveToY: this.y-300,
            blendMode: 'SCREEN',
            active: false,
            bounce: 10,
            lifespan: 1000,
            emitZone: { source: circle }
        });
        //this.deathEmmiter.moveToX = this.x;
        // this.deathEmmiter.moveToY = (this.y-50);
        this.deathEmmiter.active = true;
        
        this.deathEmmiter.setPosition(this.x, this.y);
        this.deathEmmiter.explode();
        // this.destroy();
        GAMEOVERYOUBITCH();
        
    },
    update: function () {
        // console.log('totototot');
    },
    blinkit: function (timeInvulnerability) {
        for (i=0; i <= (timeVulenrability/500); i++) {
            setTimeout(()=> this.setVisible(!!(i%2)), i*500)
        }
    }
 });