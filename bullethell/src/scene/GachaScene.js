class GachaScene extends Phaser.Scene {
  constructor() {
    super('GachaScene');
  }

  init(data) {
    this.score = (data && data.score) || 0;
    this.tokens = (data && data.tokens) || 0;
  }

  create() {
    const g = window.STANDALONE_GAME;
    this.cameras.main.setBackgroundColor(0x1a1a2e);

    this.add.text(400, 120, '🏁 GAME COMPLETE 🏁', {
      fontSize: '30px', fontFamily: 'monospace', color: '#ffd700'
    }).setOrigin(0.5);
    this.add.text(400, 180, `Score: ${this.score}`, {
      fontSize: '18px', fontFamily: 'monospace', color: '#00ccff'
    }).setOrigin(0.5);
    this.add.text(400, 220, `+${this.tokens} Token(s) 🎟️`, {
      fontSize: '24px', fontFamily: 'monospace', color: '#ffd700', fontStyle: 'bold'
    }).setOrigin(0.5);
    this.add.text(400, 260, `Total Tokens: ${Inventory.tokens}`, {
      fontSize: '15px', fontFamily: 'monospace', color: '#dddddd'
    }).setOrigin(0.5);

    this.add.text(400, 360, g.emoji, { fontSize: '48px' }).setOrigin(0.5);

    this.add.rectangle(400, 440, 240, 55, 0x00ccff).setInteractive()
      .on('pointerdown', () => this.scene.start(g.key));
    this.add.text(400, 440, '🔄 PLAY AGAIN', {
      fontSize: '16px', fontFamily: 'monospace', color: '#000000', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.rectangle(400, 520, 240, 45, 0x333333).setInteractive()
      .on('pointerdown', () => this.scene.start('MenuScene'));
    this.add.text(400, 520, '⬅ MENU', {
      fontSize: '14px', fontFamily: 'monospace', color: '#ffffff'
    }).setOrigin(0.5);
  }
}