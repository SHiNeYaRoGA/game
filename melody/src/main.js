window.STANDALONE_GAME = {
  key: 'MelodyScene',
  title: 'PIXEL MELODY',
  emoji: '🎵',
  controlHint: 'กดปุ่ม D / F / J / K ตามโน้ตที่ตกถึงเส้น'
};

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 700,
  backgroundColor: '#16213e',
  parent: 'game-container',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  pixelArt: true,
  scene: [MenuScene, MelodyScene, GachaScene]
};

window.addEventListener('load', () => {
  new Phaser.Game(config);
});