(Phaser => {
  console.log(Phaser);
  const GAME_WIDTH = window.innerWidth;
  const GAME_HEIGHT = window.innerHeight;
  const GAME_CONTAINER_ID = 'game';
  const GFX = 'gfx';
  const INITIAL_MOVESPEED = 4;
  const PLAYER_BULLET_SPEED = 6;
  const ENEMY_SPAWN_FREQ = 600;
  const ENEMY_SPEED = 4.5;
  const ENEMY_FIRE_FREQ = 30;
  const ENEMY_MOVE_ACCEL = 20;
  const SQRT_TWO = Math.sqrt(2);
  const randomGenerator = new Phaser.RandomDataGenerator();
  
  const game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, GAME_CONTAINER_ID, {preload, create, update});

  let player;
  let cursors;
  let playerBullets;
  let enemies;

  function preload(){
    game.load.spritesheet(GFX, '../assets/shmup-spritesheet-140x56-28x28-tile.png', 28, 28);
  };

  function create(){
    game.physics.startSystem(Phaser.Physics.ARCADE);
    cursors = game.input.keyboard.createCursorKeys();
    cursors.fire = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    cursors.fire.onUp.add( handlePlayerFire );
    player = game.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, GFX,8);
    player.moveSpeed = INITIAL_MOVESPEED;
    player.anchor.setTo(0.5,0.5);
    playerBullets = game.add.group();
    enemies = game.add.group();
<<<<<<< HEAD
=======
    enemies.enableBody = true;
    enemyBullets = game.add.group();
    enemyBullets.enableBody = true;

>>>>>>> 4adb439e1960b03edf42c64b178e0d3313fbf303
  };

  function update(){
    handlePlayerMovement();
    handleBulletAnimations();
    cleanup();
    randomlySpawnEnemy();
    handleEnemyActions();
    handleCollisions();
  };

  //handler functions


  function handlePlayerMovement() {
    let movingH = SQRT_TWO;
    let movingV = SQRT_TWO;
    if( cursors.up.isDown || cursors.down.isDown){
      movingH = 1; // slow down diagonal movement
    }
    if( cursors.left.isDown || cursors.right.isDown){
      movingV = 1; // slow down diagonal movement
    }
    switch( true ){
      case cursors.left.isDown:
        player.angle += -4;
        break;
      case cursors.right.isDown:
        player.angle += 4;
        break;
    }
  };

  function radians(degrees){
    return degrees * Math.PI /180;
  }

  function handlePlayerFire() {
    if(playerBullets.children.length <6){
      playerBullets.add(game.add.sprite(player.x, player.y, GFX, 7));
    }
    
   };

  function handleBulletAnimations(){
    playerBullets.children.forEach( (bullet, index, array) => {
        bullet.x -= Math.cos(radians(player.angle+90))*PLAYER_BULLET_SPEED;
        bullet.y -= Math.sin(radians(player.angle+90))*PLAYER_BULLET_SPEED;
    } );
  }

  function handlePlayerHit() {
    gameOver();
  };

  function handleCollisions() {
    // check if any bullets touch any enemies
    let enemiesHit = enemies.children
      .filter( enemy => enemy.alive )
      .filter( enemy => 
        playerBullets.children.some( 
          bullet => enemy.overlap(bullet) 
        ) 
      );

    if( enemiesHit.length ){
      // clean up bullets that land
      playerBullets.children
        .filter( bullet => bullet.overlap(enemies) )
        .forEach( removeBullet );

      enemiesHit.forEach( destroyEnemy );
    }
      // check if enemies hit the player
      enemiesHit = enemies.children
      .filter( enemy => enemy.overlap(player) );
  
    if( enemiesHit.length){
      handlePlayerHit();

      enemiesHit.forEach( destroyEnemy );
    }
  };

  //behavior functions
  function randomlySpawnEnemy() {
    if(randomGenerator.between(0, ENEMY_SPAWN_FREQ) === 0) {
      let randomX = randomGenerator.between(0, GAME_WIDTH);
      enemies.add( game.add.sprite(randomX, -24, GFX, 0));
    }
    if(randomGenerator.between(0, ENEMY_SPAWN_FREQ) === 0) {
      let randomX = randomGenerator.between(0, GAME_WIDTH);
      enemies.add( game.add.sprite(randomX, GAME_HEIGHT +24, GFX, 0));
    }
    if(randomGenerator.between(0, ENEMY_SPAWN_FREQ) === 0) {
      let randomY = randomGenerator.between(0, GAME_HEIGHT);
      enemies.add( game.add.sprite(-24, randomY, GFX, 0));
    }
    if(randomGenerator.between(0, ENEMY_SPAWN_FREQ) === 0) {
      let randomY = randomGenerator.between(0, GAME_HEIGHT);
      enemies.add( game.add.sprite(GAME_WIDTH+24, randomY, GFX, 0));
    }
  }

  function handleEnemyActions() {
    enemies.children.forEach( zombie => {
      game.physics.arcade.accelerateToObject(zombie, player, ENEMY_MOVE_ACCEL);
    });
  }

  //utility functions
  function cleanup() {
    playerBullets.children
      .filter( bullet => bullet.y < 0 )
      .forEach( bullet => bullet.destroy() );
    playerBullets.children
      .filter( bullet => bullet.x < 0 )
      .forEach( bullet => bullet.destroy() );
    playerBullets.children
      .filter( bullet => bullet.x > GAME_WIDTH )
      .forEach( bullet => bullet.destroy() );
    playerBullets.children
      .filter( bullet => bullet.y > GAME_HEIGHT )
      .forEach( bullet => bullet.destroy() );
  };

  function removeBullet(bullet) {
    bullet.destroy();
  }

  function destroyEnemy(enemy) {
    enemy.kill();
  }

  function gameOver() {
    game.state.destroy();
    game.add.text(GAME_WIDTH/2 , 200, 'YOUR HEAD ASPLODE', { fill: '#FFFFFF' });
    let playAgain = game.add.text(GAME_WIDTH/2, 300, `Play Again`, { fill: `#FFFFFF` });
    playAgain.inputEnabled = true;
    playAgain.events.onInputUp.add(() => window.location.reload());
  }

})(window.Phaser);