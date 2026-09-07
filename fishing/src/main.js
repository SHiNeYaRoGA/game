window.STANDALONE_GAME = {
  key: 'FishingScene',
  title: 'DEEP SEA FISHING',
  emoji: '🎣',
  controlHint: 'กด SPACE เมื่อแท่งอยู่ใน GREEN zone เพื่อจับปลา'
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
  scene: [MenuScene, FishingScene, GachaScene]
};

window.addEventListener('load', () => {
  new Phaser.Game(config);
});