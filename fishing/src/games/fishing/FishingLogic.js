class FishingLogic {
  constructor(data) {
    this.data = data;
    this.score = 0;
    this.caught = 0;
    this.wave = 0;
    this.meterStopped = false;
    this.zoneX = 0;
    this.wobbleSpeed = data.wobbleMin;
  }

  randint(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  newWave() {
    const d = this.data;
    this.wave++;
    this.meterStopped = false;
    this.zoneX = this.randint(
      d.meterX - d.meterWidth / 2 + 60,
      d.meterX + d.meterWidth / 2 - 60
    );
    this.wobbleSpeed = this.randint(d.wobbleMin, d.wobbleMax);
  }

  indicatorX(timeMs) {
    const d = this.data;
    return d.meterX + Math.sin(timeMs / 1000 * (this.wobbleSpeed / 57.3)) * (d.meterWidth / 2 - 30);
  }

  pickRarity() {
    const roll = Math.random();
    let cumulative = 0;
    for (const r of ['COMMON', 'RARE', 'LEGENDARY']) {
      cumulative += this.data.rarities[r].chance;
      if (roll < cumulative) return r;
    }
    return 'COMMON';
  }

  judgeCast(indicatorX) {
    const d = this.data;
    if (Math.abs(indicatorX - this.zoneX) < (d.zoneWidth / 2 + 4)) {
      const rarity = this.pickRarity();
      const points = d.rarities[rarity].points;
      this.caught++;
      this.score += points;
      this.meterStopped = true;
      return { success: true, rarity, points };
    }
    this.meterStopped = true;
    return { success: false, rarity: null, points: 0 };
  }

  isRoundDone() {
    return this.caught >= this.data.targetWaves;
  }

  reset() {
    this.score = 0;
    this.caught = 0;
    this.wave = 0;
    this.meterStopped = false;
  }
}