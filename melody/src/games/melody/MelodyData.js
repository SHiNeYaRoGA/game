const MELODY_DATA = {
  lanes: [
    { x: 150, key: 'D', color: 0x00ccff },
    { x: 300, key: 'F', color: 0x00ff88 },
    { x: 450, key: 'J', color: 0xffd700 },
    { x: 600, key: 'K', color: 0xff6b6b }
  ],
  laneY: 350,
  spawnY: 150,
  fallEndY: 430,
  fallDurationMs: 1200,
  noteCount: 12,
  noteIntervalMs: 400,
  startDelayMs: 1500,
  perfectTolerance: 20,
  goodTolerance: 60,
  hitLooks: {
    PERFECT: { points: 100, color: '#ffd700' },
    GOOD: { points: 50, color: '#00ff88' }
  }
};