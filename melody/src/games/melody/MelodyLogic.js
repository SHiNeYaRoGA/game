class MelodyLogic {
  constructor(data) {
    this.data = data;
    this.pattern = [];
    this.score = 0;
    this.combo = 0;
    this.hits = 0;
    this.active = false;
  }

  generatePattern() {
    this.pattern = [];
    for (let i = 0; i < this.data.noteCount; i++) {
      this.pattern.push(Math.floor(Math.random() * this.data.lanes.length));
    }
    return this.pattern;
  }

  spawnTimeFor(index) {
    return index * this.data.noteIntervalMs + this.data.startDelayMs;
  }

  songDurationMs() {
    return this.pattern.length * this.data.noteIntervalMs + 3000;
  }

  judge(noteY) {
    const dist = Math.abs(noteY - this.data.laneY);
    if (dist < this.data.perfectTolerance) return 'PERFECT';
    if (dist < this.data.goodTolerance) return 'GOOD';
    return 'MISS';
  }

  registerHit(judgeCode) {
    if (judgeCode === 'MISS') {
      this.combo = 0;
      return 0;
    }
    const info = this.data.hitLooks[judgeCode];
    this.score += info.points;
    this.combo++;
    this.hits++;
    return info.points;
  }

  registerMiss() {
    this.combo = 0;
  }

  maxScore() {
    return this.data.noteCount * this.data.hitLooks.PERFECT.points;
  }

  reset() {
    this.score = 0;
    this.combo = 0;
    this.hits = 0;
    this.active = false;
  }
}