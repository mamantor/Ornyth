
var Player = new Phaser.Class({
   
    Extends: Phaser.Physics.Arcade.Sprite,
 
    initialize:
 
    function Player (scene, x, y, spritekey)
    {
        Phaser.Physics.Arcade.Sprite.call(this, scene, x, y, spritekey);
 
        scene.sys.displayList.add(this);
        scene.sys.updateList.add(this);
 
        scene.physics.world.enableBody(this, 0);
        
        this.born = 0;
        this.hitpoints = 100;
    },
 
 });