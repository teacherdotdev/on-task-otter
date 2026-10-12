// Percentages refer to the same 900 × 440 room at every screen size.
// Depth puts rugs behind furniture and tabletop objects above their supports.
const layouts = {
  living: {
    'story-lamp': [0.5, 22, 15, 1], 'sunny-sofa': [10, 21, 28, 2], 'cloud-pillows': [15.25, 38.66, 17.5, 3],
    'family-photo': [19, 65, 10], 'tea-table': [13, 3, 22, 4], 'rainbow-rug': [15, 3, 44, 0],
    'book-nook': [55.5, 23, 17], 'record-player': [57.5, 56, 13, 3], 'window-curtains': [72, 49, 25],
    'leafy-plant': [85.5, 21, 12],
  },
  bedroom: {
    'cozy-bed': [48, 18, 34, 2], 'star-rug': [19, 3, 47, 0], 'nightstand': [79.5, 21, 12],
    'moon-lamp': [82, 40, 7, 3], 'soft-blanket': [53.5, 26.8, 23, 3],
    'art-wall': [20.5, 50, 17.5], 'comfy-chair': [16.5, 21, 16, 2], 'toy-basket': [12, 7, 10, 3], 'closet': [2, 25, 17],
  },
  kitchen: {
    'fruit-bowl': [6.3, 47.2, 8, 3], 'tea-kettle': [30.9, 45.5, 7, 3], 'mixing-bowls': [7.4, 65.8, 8, 3],
    'cookie-jar': [16.7, 65.8, 7, 3], 'sunny-table': [5.2, 3, 24], 'wall-clock': [55.2, 63.6, 9],
    'herb-garden': [86.1, 47.2, 8, 3], 'recipe-board': [42.8, 58.2, 10], 'happy-toaster': [16.1, 47.2, 9, 3],
    'cake-stand': [11.1, 31, 9, 3], 'dining-table': [62.9, 3, 31], 'place-settings': [79, 27, 10, 4],
    'kitchen-utensils': [32.3, 58.6, 9], 'dinner-feast': [66.5, 27.3, 10, 3],
  },
  bathroom: {
    'bubble-bath': [61, 21, 29], 'soft-towels': [30, 54, 12], 'round-mirror': [12.7, 58.9, 11],
    'toothbrush-cup': [7.4, 46.4, 4.2, 3], 'bath-mat': [61.5, 5.8, 28, 2], 'soap-set': [24.7, 46.4, 5, 3],
    'wash-basket': [1.5, 6, 11, 2], 'shower-curtain': [64, 38.3, 31, 0], 'rubber-duck': [78, 42, 5, 3],
    'bathroom-plant': [88, 11, 11, 2], 'face-masks': [58.9, 60.5, 5, 3], 'skin-care': [51.8, 60.5, 5, 3],
  },
  office: {
    'office-desk': [49, 14, 30, 2], 'desk-chair': [56.7, 7, 8, 3], 'bookcase': [5, 22, 18],
    'desk-lamp': [51, 45, 12, 3], 'office-plant': [88, 6, 10, 3], 'wall-calendar': [45.5, 62, 7],
    'filing-cabinet': [81, 16, 14], 'work-rug': [29, 3, 46, 0], 'wall-art': [53.5, 66, 11.5],
    'coffee-maker': [84.5, 44, 7, 3],
  },
};

export const roomPosition = (room, id) => {
  const [x, y, w, z = 1] = layouts[room][id];
  return { x, y, w, z, anchor: 'bottom' };
};
