var bg;
var platforms;
var player;
var cursors;
var layer;
var layer2;
var map;
var landed = false;
var flames = [];
var flamming = false;
var inventory;
var bullets= null;
var enemies= null;
var lastFired= 0;
var lastSummoned= 0;
var text;


function hitMe(sprite, tile) {

    layer.setTileIndexCallback(20, null, this);
    //console.log(tile);
    // console.log(tile.index);
    tile.index = 21;

    // layer.removeTileAt(tile.x, tile.y);
    player.anims.stop();
    player.anims.play('idle', true);
    player = playerOutOfSprite(player, 'dude', this);

    // this.scene.start('sceneA');
        
    };

function mine(sprite, tile, ctx) {
    // tile.index = 21;
    // console.log(tile);
    if (tile.miningPercentage){
        tile.miningPercentage += 1;
    } else {
        tile.miningPercentage = 1;
    }
    if (tile.miningPercentage > 50 && !tile.halfMined) {
        tile.index += 1;
        tile.halfMined = true;
    }
    if (tile.miningPercentage > 100) {
        const material = tile.material ? tile.material : "dirt";
        if (material in inventory.objects) {
            inventory.objects[material] += 1;
        } else {
            inventory.objects[material] = 1;
        }
        // console.log(inventory);
        tile.visible = false;
        tile.destroy();
        tile.resetCollision();
        game.scene.getScene('PopupInventory').events.emit('updateInventory',material, this);

    }

};

function textCallback(data){
    // console.log(data)
    return data
}

var SceneB = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function SceneB (){
        Phaser.Scene.call(this, { key: 'sceneB', active : true});
        
    },

    

    preload: function ()
    {
        // this.load.setBaseURL('http://labs.phaser.io');

        this.load.image('sky', 'assets/sprites/haze.png');
        this.load.image('grass', 'assets/sprites/grass.png');
        this.load.image('grass4-4', 'assets/sprites/grass4-4.png');
        this.load.image('backstars', 'assets/sprites/starslessbright2.png');
        this.load.image('platformer_tiles', 'assets/tilemaps/grass.png');
        this.load.image('miningTiles', 'assets/tilemaps/miningTiles.png');
        this.load.spritesheet('dude', 'assets/sprites/astronaut.png', { frameWidth: 4, frameHeight: 8 });
        this.load.spritesheet('spaceship', 'assets/sprites/spaceship.png', { frameWidth: 84, frameHeight: 31 });
        this.load.spritesheet('flames', 'assets/sprites/flames.png', { frameWidth: 4, frameHeight: 20 });
        this.load.spritesheet('bullet', 'assets/sprites/bullet.png', { frameWidth: 12, frameHeight: 12 });
        this.load.spritesheet('alienworm', 'assets/sprites/alienworm.png', { frameWidth: 24, frameHeight: 12 });
        this.load.spritesheet('alienwormEmmiter', 'assets/emmiters/alienworm.png', { frameWidth: 1, frameHeight: 1 });
        this.load.spritesheet('thePix', 'assets/emmiters/thePix.png', { frameWidth: 1, frameHeight: 1 });
        this.load.tilemapTiledJSON('map', 'tilemaps/grass3.json');
        this.load.bitmapFont('computerFont', 'assets/fonts/carrier_command.png', 'assets/fonts/carrier_command.xml');


    },

    create: function ()
    {
        
        text = this.add.dynamicBitmapText(32, 100, 'computerFont', 'It\'s cold outside,\nthere\'s no kind of atmosphere', 64);
        text.setDisplayCallback(textCallback);

        this.bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
        this.enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });

        bg = this.add.tileSprite(966, 138, 1932, 276, 'backstars');
        bg.fixedToCamera = true;

        player = new Player(this, 500, 0, 'spaceship');
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
        inventory = new Inventory({'dirt':5, 'metal': 9});

        // platforms = this.physics.add.staticGroup();
        // platforms.create(916, 310, 'grass').setScale(2).refreshBody();
        // platforms.enableBody = true;

        map = this.make.tilemap({key: 'map'});
        var tileset = map.addTilesetImage('platformer_tiles');
        var tileset2 = map.addTilesetImage('miningTiles');
        layer = map.createDynamicLayer('world1', tileset, 0, 0);
        layer2 = map.createDynamicLayer('mining', tileset2, 0, 0);


        layer.setCollisionBetween(0,25);
        layer.setTileIndexCallback(20, hitMe, this);

        layer2.setCollisionBetween(25,100);
        // layer2.setTileIndexCallback(26, mine, this);

        // filterTiles sur un layer pour permettre de mettre le materiau

        var toto = function (tile) {
            if (tile.index === 28) {
                tile.material = 'metal';
            }
        }
        
        var totoi = function (sprite1, sprite2) {
            console.log('toto');
            sprite2.destroy();
        }

        layer2.forEachTile(toto, this)

        this.physics.add.collider(player, layer);
        this.physics.add.collider(player, layer2);
        this.physics.add.collider(player, this.enemies, (_, sprite2) => {
            player.hit(sprite2);
        });
        this.physics.add.collider(this.enemies, layer);
        this.physics.add.collider(this.enemies, layer2);
        // this.physics.add.collider(this.bullets, layer2);
        this.physics.add.collider(this.bullets, layer2, function (sprite1, sprite2) {
            sprite1.destroy();
        });

        this.physics.add.collider(this.bullets, this.enemies, function (sprite1, sprite2) {
            sprite1.destroy();
            sprite2.hit(sprite1);
        });


        this.input.keyboard.on('keydown_I', function () {
            
            // this.input.stopPropagation();
            // this.input.keyboard.stopListeners();
            this.input.stopPropagation();
            // initInventory();
            if (this.scene.isActive()) {
                this.scene.bringToTop('sceneA');
                this.scene.switch('sceneA');
            }
            this.input.stopPropagation();

            // this.input.keyboard.stopListeners();
        
        }, this);

        this.input.keyboard.on('keydown_P', function () {

            // this.input.stopPropagation();
            // this.input.keyboard.stopListeners();
            // this.input.stopPropagation();
            // initInventory();
            if (this.scene.isActive()) {

                var crafter = this.scene.manager.getScene('Crafter');

                /*console.log(crafter.sys);
                console.log(crafter);
                console.log(this.scene.manager);*/
                /*crafter.sys.setActive(true);
                crafter.sys.setVisible(true);;
                crafter.sys.bringToTop();*/
                // console.log(crafter.scene.isActive());
                if (crafter.scene.isActive()) {
                    crafter.scene.bringToTop();
                } else {
                    crafter.scene.start();
                }

                // this.scene.bringToTop('PopupInventory');
                var popupInventry = this.scene.manager.getScene('PopupInventory');
                /*popupInventry.sys.setActive(true);
                popupInventry.sys.setVisible(true);*/
                //popupInventry.sys.bringToTop();
                // this.scene.bringToTop('PopupInventory');
                if (popupInventry.scene.isActive()) {
                    popupInventry.scene.bringToTop();
                    // popupInventry.events.emit('updateInventory', this);

                } else {
                    popupInventry.scene.start();
                }

                

                // this.scene.manager.scenes[2].scene.setVisible();
                // Phaser.Scenes.SceneManager().getScene('PopupInventory');
                // console.log(this.scene.manager.getScene('PopupInventory'));
            }
            this.input.stopPropagation();

            // this.input.keyboard.stopListeners();
        
        }, this);


        cursors = this.input.keyboard.createCursorKeys();
       
    },

    update: function (time, delta) {
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
            player.flipX = true;
            // console.log(player.body.onWall());
            // console.log('left ', player.body.blocked.left);
            // console.log('right ', player.body.blocked.right);
            // console.log(player);
            if (player.body.blocked.left){
                // console.log(layer2.getTileAt(player.x-5, player.y, true));
                mine(player, layer2.getTileAtWorldXY(player.x - 5, player.y, true), this);

            }
            // checkCollision + GetTileAt + offset + appeler mine() avec la tile
            // ou choper la tile d'a coté, lui mettre une callback et l'enlever hors des if input
            // ou choper la tile d'a coté, appeler mine dessus et gerer le cas undefined => du style if player.collideLeft == true

        } else if (cursors.right.isDown) {   
            player.setVelocityX(160);
            player.flipX = false;
            // console.log('left ', player.body.blocked.left);
            // console.log('right ', player.body.blocked.right);
             if (player.body.blocked.right){
                // console.log(layer2.getTileAt(14, 6, true));
                // console.log('yoop', layer2.getTileAtWorldXY(player.x + 5, player.y, true));
                mine(player, layer2.getTileAtWorldXY(player.x + 5, player.y, true), this);
            }

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

        // if (cursors.down.isDown && player.body.touching.down)
        // {
        //     this.scene.start('sceneA');
        // }


        if (cursors.space.isDown && time > lastFired) {
            var bullet = this.bullets.get();
            bullet.setActive(true);
            bullet.setVisible(true);
            // var text2 = this.add.dynamicBitmapText(32, 100, 'computerFont', 'tata', 64);
            // text2.setDisplayCallback(textCallback);

            text.setText("toto");
            text.setDepth(1);
            console.log(text);
            console.log(text.depth);
            // console.log(text2);

            if (bullet) {
                bullet.fire(player);
               lastFired = time + 200;
             }
        }

        if (cursors.down.isDown && time > lastSummoned) {
            var enemy = this.enemies.get();
            enemy.setActive(true);
            enemy.setVisible(true);

            // remove the if and make it rainbow rain !!
            if (enemy) {
                enemy.summon(player);
                lastSummoned = time + 200;
             }
        }

            }
});