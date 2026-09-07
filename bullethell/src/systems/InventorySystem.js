class InventorySystem {
  constructor() {
    this.load();
  }

  load() {
    const data = localStorage.getItem('pixel_gacha_inventory');
    if (data) {
      try {
        this.items = JSON.parse(data);
      } catch (e) {
        this.items = {};
      }
    } else {
      this.items = {};
    }
    this.tokens = parseInt(localStorage.getItem('pixel_gacha_tokens') || '0', 10);
    this.achievements = JSON.parse(localStorage.getItem('pixel_gacha_achievements') || '{}');
  }

  save() {
    localStorage.setItem('pixel_gacha_inventory', JSON.stringify(this.items));
    localStorage.setItem('pixel_gacha_tokens', String(this.tokens));
    localStorage.setItem('pixel_gacha_achievements', JSON.stringify(this.achievements));
  }

  addItem(item) {
    const key = item.id;
    if (!this.items[key]) {
      this.items[key] = {
        id: item.id,
        name: item.name,
        emoji: item.emoji,
        rarity: item.rarity,
        setId: item.setName,
        count: 1,
        obtainedAt: Date.now()
      };
    } else {
      this.items[key].count++;
    }
    this.save();
    return this.items[key];
  }

  addTokens(amount) {
    this.tokens += amount;
    this.save();
    return this.tokens;
  }

  spendToken() {
    if (this.tokens <= 0) return false;
    this.tokens--;
    this.save();
    return true;
  }

  totalOwned() {
    return Object.values(this.items).filter(i => i.count > 0).length;
  }

  getCompletion() {
    const total = RewardSystem.getAllImages().length;
    const owned = this.totalOwned();
    return { owned, total, percent: Math.round((owned / total) * 100) };
  }

  unlockAchievements() {
    const { owned } = this.getCompletion();
    const earned = [];

    if (owned >= 10 && !this.achievements['collector1']) {
      this.achievements['collector1'] = true;
      earned.push('Collector I');
    }
    if (owned >= 30 && !this.achievements['collector2']) {
      this.achievements['collector2'] = true;
      earned.push('Collector II');
    }
    if (owned === RewardSystem.getAllImages().length && !this.achievements['master']) {
      this.achievements['master'] = true;
      earned.push('Master Collector');
    }
    if (earned.length > 0) this.save();
    return earned;
  }
}

const Inventory = new InventorySystem();
