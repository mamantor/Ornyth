var bg;
var platforms;
var player;
var cursors;
var layer;
var map;
var landed = false;
var flames = [];
var flamming = false;

function hitMe(sprite, tile) {

    layer.setTileIndexCallback(20, null, this);

    // layer.removeTileAt(tile.x, tile.y);
    player.anims.stop();
    player.anims.play('idle', true);
    player = playerOutOfSprite(player, 'dude', this);

    this.scene.start('sceneA');
        
    };

var SceneB = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function SceneB (){
        Phaser.Scene.call(this, { key: 'sceneB' });
    },

    preload: function ()
    {
        // this.load.setBaseURL('http://labs.phaser.io');

        this.load.image('sky', 'assets/sprites/haze.png');
        this.load.image('grass', 'assets/sprites/grass.png');
        this.load.image('grass4-4', 'assets/sprites/grass4-4.png');
        this.load.image('backstars', 'assets/sprites/starslessbright2.png');
        this.load.image('platformer_tiles', 'assets/tilemaps/grass.png');
        this.load.spritesheet('dude', 'assets/sprites/astronaut.png', { frameWidth: 4, frameHeight: 8 });
        this.load.spritesheet('spaceship', 'assets/sprites/spaceship.png', { frameWidth: 84, frameHeight: 31 });
        this.load.spritesheet('flames', 'assets/sprites/flames.png', { frameWidth: 4, frameHeight: 20 });
        this.load.tilemapTiledJSON('map', 'tilemaps/grass2.json');

    },

    create: function ()
    {
        bg = this.add.tileSprite(966, 138, 1932, 276, 'backstars');
        bg.fixedToCamera = true;

        player = this.physics.add.sprite(500, 0, 'spaceship');
        player.setCollideWorldBounds(true);
        player.body.setGravityY(300);

        flames.push(this.add.sprite(player.x, player.y, 'flames'));
        flames.push(this.add.sprite(player.x, player.y, 'flames'));
        flames[0].setScale(2);
        flames[1].setScale(2);

        this.anims.create({
            key: 'burningFlame',
            frames: this.anims.generateFrameNumbers('flames', { start: 2, end: 5 }),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: 'idleFlame',
            frames: this.anims.generateFrameNumbers('flames', { start: 1, end: 2 }),
            frameRate: 15,
            yoyo: true,
            repeat: -1
        });

        this.anims.create({
            key: 'blink',
            frames: this.anims.generateFrameNumbers('spaceship', { start: 0, end: 1 }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('spaceship', { start: 2, end: 2 }),
            frameRate: 5,
            repeat: -1
        });

        player.anims.play('blink', true);

        // platforms = this.physics.add.staticGroup();
        // platforms.create(916, 310, 'grass').setScale(2).refreshBody();
        // platforms.enableBody = true;

        map = this.make.tilemap({key: 'map'});
        var tileset = map.addTilesetImage('platformer_tiles');
        layer = map.createDynamicLayer('world1', tileset, 0, 0);
        layer.setCollisionBetween(0,100);
        layer.setTileIndexCallback(20, hitMe, this);
        this.physics.add.collider(player, layer);

        cursors = this.input.keyboard.createCursorKeys();
    },

    update: function () {
        for (flame of flames) {
            if (flames.indexOf(flame) === 1) {
                flame.x = player.x + 22;
                flame.y = player.y + 22;
            } else {

                flame.x = player.x -22;
                flame.y = player.y + 22;
            }
            
        }
        
        if (cursors.left.isDown) {
            player.setVelocityX(-160);

        } else if (cursors.right.isDown) {   
            player.setVelocityX(160);

        } else {
            player.setVelocityX(0);
        }

        if (cursors.up.isDown)
        {
            if (!flamming) {
                flames[0].anims.play('burningFlame', false);
                flames[1].anims.play('burningFlame', false);
                flamming = true;
            }
            player.body.velocity.y -= 10;

        } else {
            flames[0].anims.play('idleFlame', true);
            flames[1].anims.play('idleFlame', true);
            flamming = false;
        }

        if (cursors.down.isDown && player.body.touching.down)
        {
            this.scene.start('sceneA');
        }

        // this.input.once('pointerdown', function () {
        //         console.log('From SceneA to SceneB');
        //  }, this);

    }
});