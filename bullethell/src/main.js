window.STANDALONE_GAME = {
  key: 'BulletHellScene',
  title: 'BULLET HELL',
  emoji: '💥',
  controlHint: 'ใช้ WASD / ลูกศร เคลื่อนที่ หลบกระสุน เก็บ coins'
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
  scene: [MenuScene, BulletHellScene, GachaScene]
};

window.addEventListener('load', () => {
  new Phaser.Game(config);
});