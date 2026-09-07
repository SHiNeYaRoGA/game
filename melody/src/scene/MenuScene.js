class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    const g = window.STANDALONE_GAME;
    this.cameras.main.setBackgroundColor(0x16213e);

    this.add.text(400, 190, g.emoji, { fontSize: '64px' }).setOrigin(0.5);
    this.add.text(400, 270, g.title, {
      fontSize: '36px', fontFamily: 'monospace', color: '#ffd700'
    }).setOrigin(0.5);
    this.add.text(400, 320, 'STANDALONE MODE', {
      fontSize: '15px', fontFamily: 'monospace', color: '#00ccff'
    }).setOrigin(0.5);
    this.add.text(400, 380, 'Tokens: ' + Inventory.tokens, {
      fontSize: '18px', fontFamily: 'monospace', color: '#ffffff'
    }).setOrigin(0.5);

    this.add.rectangle(400, 460, 240, 55, 0xe94560).setInteractive()
      .on('pointerdown', () => this.scene.start(g.key));
    this.add.text(400, 460, '▶ START GAME', {
      fontSize: '18px', fontFamily: 'monospace', color: '#ffffff', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(400, 560, g.controlHint, {
      fontSize: '13px', fontFamily: 'monospace', color: '#888888'
    }).setOrigin(0.5);
  }
}