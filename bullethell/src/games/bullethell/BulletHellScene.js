class BulletHellScene extends Phaser.Scene {
  constructor() {
    super('BulletHellScene');
    this.logic = new BulletHellLogic(BULLET_HELL_DATA);
    this.bullets = null;
    this.coins = null;
  }

  create() {
    const d = BULLET_HELL_DATA;
    this.cameras.main.setBackgroundColor(0x0d0d1a);

    this.add.text(400, 50, '💥 BULLET HELL 💥', {
      fontSize: '28px', fontFamily: 'monospace', color: '#ffd700'
    }).setOrigin(0.5);
    this.add.text(400, 90, 'ใช้ WASD/ลูกศร เคลื่อนที่ หลบกระสุน เก็บ⭐ coins', {
      fontSize: '13px', fontFamily: 'monospace', color: '#cccccc'
    }).setOrigin(0.5);

    this.scoreText = this.add.text(30, 30, 'Time: 0s', {
      fontSize: '16px', fontFamily: 'monospace', color: '#ffffff'
    });
    this.coinText = this.add.text(30, 60, 'Coins: 0', {
      fontSize: '16px', fontFamily: 'monospace', color: '#00ccff'
    });
    this.tokensText = this.add.text(670, 30, 'Tokens: ' + Inventory.tokens, {
      fontSize: '16px', fontFamily: 'monospace', color: '#ffd700'
    });

    // Player
    this.player = this.add.rectangle(d.playerStart.x, d.playerStart.y, d.playerSize, d.playerSize, 0x00ff88)
      .setStrokeStyle(2, 0xffffff);

    // Movement keys
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys('W,A,S,D');
    this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.escKey.on('down', () => this.scene.start('MenuScene'));

    this.bullets = this.add.group();
    this.coins = this.add.group();

    this.healthText = this.add.text(30, 90, this.heartsText(d.health), {
      fontSize: '18px', fontFamily: 'monospace', color: '#ff4444'
    });

    this.add.text(400, 620, 'Press ESC to quit', {
      fontSize: '13px', fontFamily: 'monospace', color: '#888888'
    }).setOrigin(0.5);

    this.logic.start(this.time.now);
  }

  heartsText(health) {
    const max = BULLET_HELL_DATA.health;
    return '❤️'.repeat(Math.max(0, health)) + '🖤'.repeat(Math.max(0, max - health));
  }

  update(time, delta) {
    if (this.logic.gameOver) return;
    const d = BULLET_HELL_DATA;

    const elapsed = this.logic.update(time);
    this.scoreText.setText('Time: ' + elapsed.toFixed(1) + 's');

    // Player movement
    const dirX = (this.keys.A.isDown ? -1 : 0) + (this.keys.D.isDown ? 1 : 0)
      + (this.cursors.left.isDown ? -1 : 0) + (this.cursors.right.isDown ? 1 : 0);
    const dirY = (this.keys.W.isDown ? -1 : 0) + (this.keys.S.isDown ? 1 : 0)
      + (this.cursors.up.isDown ? -1 : 0) + (this.cursors.down.isDown ? 1 : 0);
    const pos = this.logic.movePlayer(dirX, dirY, delta);
    this.player.x = pos.x;
    this.player.y = pos.y;

    // Spawn bullets
    if (this.logic.shouldSpawnBullet(time)) {
      this.spawnBullet();
    }

    // Spawn coins
    if (this.logic.coinIntervalElapsed(time) < delta) {
      this.spawnCoin();
    }

    // Bullet collisions
    this.bullets.getChildren().forEach(bullet => {
      if (!bullet.active) return;
      if (this.overlaps(this.player, bullet)) {
        this.hitPlayer(bullet);
        return;
      }
      if (bullet.y > d.bulletEndY) bullet.destroy();
    });

    // Coin collisions
    this.coins.getChildren().forEach(coin => {
      if (!coin.active) return;
      if (this.overlaps(this.player, coin)) {
        this.logic.collectCoin();
        this.coinText.setText('Coins: ' + this.logic.collected);
        this.coins.remove(coin, true, true);
      }
    });
  }

  overlaps(a, b) {
    return Phaser.Geom.Intersects.RectangleToRectangle(a.getBounds(), b.getBounds());
  }

  spawnBullet() {
    const d = BULLET_HELL_DATA;
    const spec = this.logic.makeBullet();

    const dx = this.player.x - spec.x;
    const dist = Math.hypot(dx, this.player.y);
    const aimX = spec.speed * (dx / dist);

    const bullet = this.add.rectangle(spec.x, d.bulletStartY, d.bulletSize, d.bulletSize, spec.color);
    this.bullets.add(bullet);

    this.tweens.add({
      targets: bullet,
      x: spec.x + aimX * 5,
      y: d.bulletEndY,
      duration: d.bulletTravelMs,
      ease: 'Linear',
      onComplete: () => {
        if (bullet.active) bullet.destroy();
      }
    });
  }

  spawnCoin() {
    const d = BULLET_HELL_DATA;
    const pos = this.logic.makeCoinPosition();
    const coin = this.add.rectangle(pos.x, pos.y, d.coinSize, d.coinSize, d.coinColor)
      .setStrokeStyle(2, 0xffffff);
    this.coins.add(coin);

    this.tweens.add({
      targets: coin,
      alpha: 0.4,
      yoyo: true,
      repeat: -1,
      duration: 500
    });
    this.time.delayedCall(d.coinLifetimeMs, () => {
      if (coin.active) coin.destroy();
    });
  }

  hitPlayer(bullet) {
    const d = BULLET_HELL_DATA;
    bullet.destroy();
    this.healthText.setText(this.heartsText(this.logic.damage()));
    this.cameras.main.shake(200, 0.01);

    if (this.logic.gameOver) {
      this.endGame();
    }
  }

  endGame() {
    const score = this.logic.score();
    const tokens = RewardSystem.calculateTokens(score, this.logic.tokenBenchmark());
    Inventory.addTokens(tokens);

    this.player.destroy();
    this.add.text(400, 350, `💥 GAME OVER 💥\nSurvived: ${this.logic.elapsed.toFixed(1)}s\nCoins: ${this.logic.collected}\nScore: ${score}\n+${tokens} Token(s) 🎟️`, {
      fontSize: '26px', fontFamily: 'monospace', color: '#ffd700', align: 'center'
    }).setOrigin(0.5);

    this.time.delayedCall(2000, () => {
      this.scene.start('GachaScene', { tokens, score });
    });
  }
}