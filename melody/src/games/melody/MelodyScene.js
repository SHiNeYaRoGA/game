class MelodyScene extends Phaser.Scene {
  constructor() {
    super('MelodyScene');
    this.logic = new MelodyLogic(MELODY_DATA);
    this.notes = [];
  }

  create() {
    const d = MELODY_DATA;
    this.cameras.main.setBackgroundColor(0x2d1b4e);
    this.add.text(400, 60, '🎵 PIXEL MELODY 🎵', {
      fontSize: '28px', fontFamily: 'monospace', color: '#ff6b6b'
    }).setOrigin(0.5);
    this.add.text(400, 100, 'กดปุ่มตามโน้ตที่ตกถึงเส้น (D/F/J/K)', {
      fontSize: '14px', fontFamily: 'monospace', color: '#cccccc'
    }).setOrigin(0.5);

    this.scoreText = this.add.text(30, 30, 'Score: 0', {
      fontSize: '16px', fontFamily: 'monospace', color: '#ffffff'
    });
    this.tokensText = this.add.text(670, 30, 'Tokens: ' + Inventory.tokens, {
      fontSize: '16px', fontFamily: 'monospace', color: '#ffd700'
    });

    // Draw lanes
    d.lanes.forEach(loc => {
      this.add.line(400, 350, loc.x, 150, loc.x, 550, loc.color, 0.4).setOrigin(0);
      this.add.text(loc.x, 570, loc.key, {
        fontSize: '20px', fontFamily: 'monospace', color: '#ffffff', fontStyle: 'bold'
      }).setOrigin(0.5);
    });

    // Hit line
    this.add.rectangle(400, d.laneY, 800, 4, 0xffffff, 0.8);

    this.comboText = this.add.text(400, 180, '', {
      fontSize: '32px', fontFamily: 'monospace', color: '#ffd700'
    }).setOrigin(0.5);

    // Keyboard
    const keyMap = { D: 0, F: 1, J: 2, K: 3 };
    Object.keys(keyMap).forEach(k => {
      const keyObj = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[k]);
      keyObj.on('down', () => this.pressLane(keyMap[k]));
    });
    this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.escKey.on('down', () => this.scene.start('MenuScene'));

    this.logic.reset();
    this.logic.generatePattern();
    this.startSong();
  }

  startSong() {
    const d = MELODY_DATA;
    this.logic.active = true;
    this.notes = [];

    this.logic.pattern.forEach((lane, i) => {
      this.time.delayedCall(this.logic.spawnTimeFor(i), () => this.spawnNote(lane));
    });
    this.time.delayedCall(this.logic.songDurationMs(), () => this.finishSong());

    this.add.text(400, 130, '▶ START!', {
      fontSize: '16px', fontFamily: 'monospace', color: '#00ff88'
    }).setOrigin(0.5);
  }

  spawnNote(lane) {
    if (!this.logic.active) return;
    const d = MELODY_DATA;
    const loc = d.lanes[lane];
    const note = this.add.rectangle(loc.x, d.spawnY, 30, 30, loc.color).setScale(1.2);
    note.setData({ lane, caught: false });

    this.tweens.add({
      targets: note,
      y: d.fallEndY,
      duration: d.fallDurationMs,
      onUpdate: () => {
        if (note.y > d.laneY + 40 && !note.getData('caught')) {
          note.setData('caught', true);
          this.logic.registerMiss();
          this.updateComboText();
          this.add.text(note.x, d.laneY + 60, 'MISS', {
            fontSize: '12px', fontFamily: 'monospace', color: '#ff4444'
          }).setOrigin(0.5).setDepth(10);
          note.destroy();
        }
      },
      onComplete: () => {
        if (note.getData('caught')) return;
        this.logic.registerMiss();
        this.updateComboText();
        note.destroy();
      }
    });
    this.notes.push(note);
  }

  pressLane(lane) {
    if (!this.logic.active) return;
    const d = MELODY_DATA;

    const candidates = this.notes.filter(n =>
      n.active &&
      !n.getData('caught') &&
      n.getData('lane') === lane &&
      Math.abs(n.y - d.laneY) < d.goodTolerance
    );

    if (candidates.length > 0) {
      const note = candidates[0];
      note.setData('caught', true);

      const code = this.logic.judge(note.y);
      const points = this.logic.registerHit(code);
      const color = d.hitLooks[code].color;

      this.scoreText.setText('Score: ' + this.logic.score);
      this.add.text(note.x, d.laneY - 20, code + '!', {
        fontSize: '14px', fontFamily: 'monospace', color, fontStyle: 'bold'
      }).setOrigin(0.5).setDepth(10);
      this.updateComboText();

      note.destroy();
    } else {
      this.logic.registerMiss();
      this.updateComboText();
      this.add.text(400, 200, '✖', {
        fontSize: '28px', fontFamily: 'monospace', color: '#ff4444'
      }).setOrigin(0.5).setDepth(10);
    }
  }

  updateComboText() {
    this.comboText.setText(this.logic.combo >= 2 ? `🔥 ${this.logic.combo} COMBO` : '');
  }

  finishSong() {
    this.logic.active = false;
    const score = this.logic.score;
    const tokens = RewardSystem.calculateTokens(score, this.logic.maxScore());
    Inventory.addTokens(tokens);

    this.add.text(400, 450, `🎵 SONG DONE!\nScore: ${score}\n+${tokens} Token(s) 🎟️`, {
      fontSize: '24px', fontFamily: 'monospace', color: '#ffd700', align: 'center'
    }).setOrigin(0.5);

    this.time.delayedCall(2000, () => {
      this.scene.start('GachaScene', { tokens, score });
    });
  }
}