var SceneA = new Phaser.Class({
        Extends: Phaser.Scene,

        preload: function () {
                this.load.image('sky', 'assets/sprites/haze.png');

        },
        initialize: function SceneA (){
                Phaser.Scene.call(this, { key: 'sceneA' });
            },

        create: function () {
            this.add.sprite(400, 300, 'sky').setAlpha(0.2);

            this.input.once('pointerdown', function () {

                console.log('From SceneA to SceneB');

                this.scene.start('sceneB');

            }, this);
        }

    });