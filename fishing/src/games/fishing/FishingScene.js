class FishingScene extends Phaser.Scene {
  constructor() {
    super('FishingScene');
    this.logic = new FishingLogic(FISHING_DATA);
    this.meterObjs = [];
    this.indicator = null;
    this.greenZone = null;
  }

  create() {
    const d = FISHING_DATA;
    this.cameras.main.setBackgroundColor(0x0a2b52);

    this.add.text(400, 50, '🎣 DEEP SEA FISHING 🎣', {
      fontSize: '28px', fontFamily: 'monospace', color: '#00ccff'
    }).setOrigin(0.5);

    this.add.text(400, 90, 'กด SPACE เมื่อแท่งอยู่ใน GREEN zone เพื่อจับปลา', {
      fontSize: '14px', fontFamily: 'monospace', color: '#cccccc'
    }).setOrigin(0.5);

    this.scoreText = this.add.text(30, 30, 'Score: 0', {
      fontSize: '16px', fontFamily: 'monospace', color: '#ffffff'
    });
    this.tokensText = this.add.text(650, 30, 'Tokens: ' + Inventory.tokens, {
      fontSize: '16px', fontFamily: 'monospace', color: '#ffd700'
    });

    this.fishInfo = this.add.text(400, 480, 'กด SPACE เพื่อเริ่ม!', {
      fontSize: '20px', fontFamily: 'monospace', color: '#ffd700'
    }).setOrigin(0.5);

    this.add.text(400, 520, 'Press ESC to quit', {
      fontSize: '13px', fontFamily: 'monospace', color: '#888888'
    }).setOrigin(0.5);

    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    this.logic.reset();
    this.startWave();
  }

  drawMeter() {
    const d = FISHING_DATA;
    this.meterObjs.forEach(o => o.destroy());
    this.meterObjs = [];

    this.meterObjs.push(
      this.add.rectangle(d.meterX, d.meterY, d.meterWidth + 10, 60, 0x1a1a2e)
        .setStrokeStyle(2, 0xffffff)
    );

    this.greenZone = this.add.rectangle(this.logic.zoneX, d.meterY, d.zoneWidth, 50, 0x00ff88, 0.6);
    this.meterObjs.push(this.greenZone);

    this.indicator = this.add.rectangle(d.meterX - d.meterWidth / 2, d.meterY, 8, 55, 0xff4444);
    this.meterObjs.push(this.indicator);
  }

  startWave() {
    this.logic.newWave();
    this.drawMeter();
    this.fishInfo.setText(`Wave ${this.logic.wave} - SPACE เมื่อจับจังหวะ`);
  }

  update(time) {
    if (this.logic.meterStopped) return;

    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.cast();
      return;
    }
    if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
      this.scene.start('MenuScene');
      return;
    }

    this.indicator.x = this.logic.indicatorX(time);
  }

  cast() {
    const result = this.logic.judgeCast(this.indicator.x);
    const d = FISHING_DATA;

    if (result.success) {
      const color = d.rarities[result.rarity].color;
      this.scoreText.setText('Score: ' + this.logic.score);
      this.fishInfo.setText(`🐟 CAUGHT ${result.rarity}! +${result.points} pts`).setColor(color);
      this.showFloatText('+ ' + result.points, color);

      this.time.delayedCall(1500, () => {
        if (this.logic.isRoundDone()) {
          this.finishFishing();
        } else {
          this.startWave();
        }
      });
    } else {
      this.fishInfo.setText('💔 MISS! ลองใหม่').setColor('#ff4444');
      this.time.delayedCall(1000, () => this.startWave());
    }
  }

  showFloatText(text, color) {
    const t = this.add.text(this.indicator.x, FISHING_DATA.meterY - 40, text, {
      fontSize: '18px', fontFamily: 'monospace', color, fontStyle: 'bold'
    }).setOrigin(0.5);
    this.tweens.add({
      targets: t,
      y: FISHING_DATA.meterY - 80,
      alpha: 0,
      duration: 800,
      onComplete: () => t.destroy()
    });
  }

  finishFishing() {
    const score = this.logic.score;
    const tokens = RewardSystem.calculateTokens(score, 500);
    Inventory.addTokens(tokens);

    this.fishInfo.setText(`🏁 DONE! Score: ${score} -> +${tokens} Token(s) 🎟️`)
      .setColor('#ffd700');

    this.time.delayedCall(1500, () => {
      this.scene.start('GachaScene', { tokens, score });
    });
  }
}