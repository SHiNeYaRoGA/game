class RewardSystem {
  static RARITY = {
    COMMON: { name: 'Common', color: 0xaaaaaa, dropRate: 0.65, glow: 0x666666 },
    RARE: { name: 'Rare', color: 0x00ccff, dropRate: 0.30, glow: 0x0088cc },
    LEGENDARY: { name: 'Legendary', color: 0xffd700, dropRate: 0.05, glow: 0xff8800 }
  };

  static IMAGE_SETS = {
    ocean: {
      name: 'Ocean Creatures',
      images: {
        COMMON: [
          { id: 'ocean_c1', name: 'Common Fish', emoji: '🐟' },
          { id: 'ocean_c2', name: 'Clownfish', emoji: '🐠' },
          { id: 'ocean_c3', name: 'Shrimp', emoji: '🦐' },
          { id: 'ocean_c4', name: 'Small Octopus', emoji: '🐙' }
        ],
        RARE: [
          { id: 'ocean_r1', name: 'Dolphin', emoji: '🐬' },
          { id: 'ocean_r2', name: 'Squid', emoji: '🦑' },
          { id: 'ocean_r3', name: 'Sea Turtle', emoji: '🐢' },
          { id: 'ocean_r4', name: 'Pufferfish', emoji: '🐡' }
        ],
        LEGENDARY: [
          { id: 'ocean_l1', name: 'Blue Whale', emoji: '🐋' },
          { id: 'ocean_l2', name: 'Golden Shark', emoji: '🦈' },
          { id: 'ocean_l3', name: 'Sea Dragon', emoji: '🐉' },
          { id: 'ocean_l4', name: 'Ancient Chest', emoji: '⚓' }
        ]
      }
    },
    music: {
      name: 'Musical Notes',
      images: {
        COMMON: [
          { id: 'music_c1', name: 'Single Note', emoji: '🎵' },
          { id: 'music_c2', name: 'Double Note', emoji: '🎶' },
          { id: 'music_c3', name: 'Guitar Pick', emoji: '🎸' },
          { id: 'music_c4', name: 'Drum', emoji: '🥁' }
        ],
        RARE: [
          { id: 'music_r1', name: 'Golden Piano', emoji: '🎹' },
          { id: 'music_r2', name: 'Trumpet', emoji: '🎺' },
          { id: 'music_r3', name: 'Violin', emoji: '🎻' },
          { id: 'music_r4', name: 'Saxophone', emoji: '🎷' }
        ],
        LEGENDARY: [
          { id: 'music_l1', name: 'Crystal Mic', emoji: '🎤' },
          { id: 'music_l2', name: 'Legendary Guitar', emoji: '🎸' },
          { id: 'music_l3', name: 'Cosmic Drum', emoji: '🥁' },
          { id: 'music_l4', name: 'Eternal Symphony', emoji: '🎼' }
        ]
      }
    },
    space: {
      name: 'Space Hazards',
      images: {
        COMMON: [
          { id: 'space_c1', name: 'Star Fragment', emoji: '⭐' },
          { id: 'space_c2', name: 'Energy Orb', emoji: '🔵' },
          { id: 'space_c3', name: 'Shield Bit', emoji: '💠' },
          { id: 'space_c4', name: 'Block', emoji: '⬛' }
        ],
        RARE: [
          { id: 'space_r1', name: 'Rocket Ship', emoji: '🚀' },
          { id: 'space_r2', name: 'Laser Beam', emoji: '🔴' },
          { id: 'space_r3', name: 'Plasma Ball', emoji: '🟢' },
          { id: 'space_r4', name: 'Gravity Well', emoji: '🟡' }
        ],
        LEGENDARY: [
          { id: 'space_l1', name: 'Supernova', emoji: '🌟' },
          { id: 'space_l2', name: 'Diamond Core', emoji: '💎' },
          { id: 'space_l3', name: 'Void Crystal', emoji: '🔮' },
          { id: 'space_l4', name: 'Boss Ship', emoji: '👾' }
        ]
      }
    },
    hidden: {
      name: 'Hidden Collection',
      images: {
        COMMON: [
          { id: 'hidden_c1', name: 'Pixel Controller', emoji: '🎮' },
          { id: 'hidden_c2', name: 'Coffee Cup', emoji: '☕' },
          { id: 'hidden_c3', name: 'Moon', emoji: '🌙' },
          { id: 'hidden_c4', name: 'Lucky Clover', emoji: '🍀' }
        ],
        RARE: [
          { id: 'hidden_r1', name: 'Circus Tent', emoji: '🎪' },
          { id: 'hidden_r2', name: 'Castle', emoji: '🏰' },
          { id: 'hidden_r3', name: 'Volcano', emoji: '🌋' },
          { id: 'hidden_r4', name: 'Unicorn', emoji: '🦄' }
        ],
        LEGENDARY: [
          { id: 'hidden_l1', name: 'Dragon Egg', emoji: '🐲' },
          { id: 'hidden_l2', name: 'Crown', emoji: '👑' },
          { id: 'hidden_l3', name: 'Rainbow', emoji: '🌈' },
          { id: 'hidden_l4', name: 'Shooting Star', emoji: '💫' }
        ]
      }
    }
  };

  static rollRarity(scoreMultiplier = 1.0) {
    const roll = Math.random();
    const adjusted = roll / scoreMultiplier;

    if (adjusted < this.RARITY.LEGENDARY.dropRate) return 'LEGENDARY';
    if (adjusted < this.RARITY.LEGENDARY.dropRate + this.RARITY.RARE.dropRate) return 'RARE';
    return 'COMMON';
  }

  static getRandomImage(rarity, excludeIds = []) {
    const allImages = [];
    Object.values(this.IMAGE_SETS).forEach(set => {
      set.images[rarity].forEach(img => {
        if (!excludeIds.includes(img.id)) {
          allImages.push({ ...img, setName: set.name });
        }
      });
    });
    if (allImages.length === 0) return null;
    return allImages[Math.floor(Math.random() * allImages.length)];
  }

  static calculateTokens(score, maxScore) {
    const ratio = score / maxScore;
    let tokens = 1;
    if (ratio >= 0.9) tokens = 3;
    else if (ratio >= 0.7) tokens = 2;
    return tokens;
  }

  static getAllImages() {
    const all = [];
    Object.entries(this.IMAGE_SETS).forEach(([setId, set]) => {
      ['COMMON', 'RARE', 'LEGENDARY'].forEach(rarity => {
        set.images[rarity].forEach(img => {
          all.push({ ...img, setId, setName: set.name, rarity });
        });
      });
    });
    return all;
  }
}
