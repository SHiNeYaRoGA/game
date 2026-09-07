class BulletHellLogic {
  constructor(data) {
    this.data = data;
    this.elapsed = 0;
    this.collected = 0;
    this.health = data.health;
    this.gameOver = false;
    this.difficulty = 1;
    this.playerPos = { x: data.playerStart.x, y: data.playerStart.y };
    this.startTimeMs = 0;
    this.lastBulletMs = 0;
  }

  randint(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  start(nowMs) {
    this.startTimeMs = nowMs;
    this.lastBulletMs = nowMs;
    this.gameOver = false;
  }

  update(nowMs) {
    if (this.gameOver) return this.elapsed;
    this.elapsed = (nowMs - this.startTimeMs) / 1000;
    this.difficulty = 1 + this.elapsed / 10;
    return this.elapsed;
  }

  movePlayer(dirX, dirY, deltaMs) {
    const d = this.data;
    const mag = Math.hypot(dirX, dirY);
    if (mag > 0) {
      this.playerPos.x += (dirX / mag) * d.playerSpeed * (deltaMs / 1000);
      this.playerPos.y += (dirY / mag) * d.playerSpeed * (deltaMs / 1000);
    }
    this.playerPos.x = this.clamp(this.playerPos.x, d.bounds.minX, d.bounds.maxX);
    this.playerPos.y = this.clamp(this.playerPos.y, d.bounds.minY, d.bounds.maxY);
    return this.playerPos;
  }

  bulletIntervalMs() {
    return 1000 / (this.difficulty * 0.5);
  }

  shouldSpawnBullet(nowMs) {
    if (nowMs - this.lastBulletMs < this.bulletIntervalMs()) return false;
    this.lastBulletMs = nowMs;
    return true;
  }

  makeBullet() {
    const d = this.data;
    return {
      x: this.randint(50, 750),
      speed: this.randint(d.bulletMinSpeed, 200 + this.elapsed * 5),
      color: d.bulletColors[this.randint(0, d.bulletColors.length - 1)]
    };
  }

  coinIntervalElapsed(nowMs) {
    return nowMs % this.data.coinIntervalMs;
  }

  makeCoinPosition() {
    const d = this.data;
    return {
      x: this.randint(50, 750),
      y: this.randint(150, 500)
    };
  }

  collectCoin() {
    this.collected++;
    return this.collected;
  }

  damage() {
    this.health--;
    if (this.health <= 0) this.gameOver = true;
    return this.health;
  }

  score() {
    return Math.floor(this.elapsed * this.data.timeBonus + this.collected * this.data.coinBonus);
  }

  tokenBenchmark() {
    return this.data.tokenBenchmark;
  }
}