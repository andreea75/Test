
const { preloadImage, loadImages, getRandomBee, countBeesByType, updateBeeCounts, displayHitInfo } = require('../src/app'); 

describe('preloadImage function', () => {
  test('resolves with an image object', async () => {
    const imageUrl = 'sample-image.jpg';
    const result = await preloadImage(imageUrl);
    expect(result).toBeInstanceOf(Image);
  });

  test('rejects when the image URL is invalid', async () => {
    const invalidImageUrl = 'invalid-image-url.jpg';
    await expect(preloadImage(invalidImageUrl)).rejects.toThrow();
  });
});

describe('loadImages function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('loads images for all bees', async () => {
    const mockBee = { image: 'sample-image.jpg' };
    const mockBees = [mockBee, mockBee, mockBee];
    const originalBees = [...mockBees];
    const mockPreloadImage = jest.fn(() => new Image());
    const originalPreloadImage = preloadImage;
    preloadImage = mockPreloadImage;

    await loadImages(mockBees);

    expect(mockPreloadImage).toHaveBeenCalledTimes(mockBees.length);
    expect(mockBee.image).toBeInstanceOf(Image);

    preloadImage = originalPreloadImage;
    mockBees.splice(0, mockBees.length, ...originalBees);
  });
});

describe('getRandomBee function', () => {
  test('returns a random bee', () => {
    const mockBees = [{}, {}, {}];
    const originalBees = [...mockBees];
    const randomIndex = 1; // Assuming the random index is 1
    const mockMathRandom = jest.spyOn(Math, 'random').mockReturnValueOnce(randomIndex);
    const result = getRandomBee(mockBees);

    expect(result).toBe(mockBees[randomIndex]);

    mockMathRandom.mockRestore();
    mockBees.splice(0, mockBees.length, ...originalBees);
  });
});


const mockBeeCountsElement = {
  textContent: '',
};

document.getElementById = jest.fn((id) => {
  if (id === 'beeCounts') {
    return mockBeeCountsElement;
  }
  return null;
});

describe('countBeesByType function', () => {
  test('returns an object with bee counts by type', () => {
    const mockBees = [
      { type: 'queen' },
      { type: 'worker' },
      { type: 'worker' },
      { type: 'drone' },
    ];
    const beeCounts = countBeesByType(mockBees);

    expect(beeCounts).toEqual({
      queen: 1,
      worker: 2,
      drone: 1,
    });
  });
});

describe('updateBeeCounts function', () => {
  test('updates bee counts in the DOM', () => {
    const mockBeeCounts = {
      queen: 2,
      worker: 3,
      drone: 1,
    };
    countBeesByType = jest.fn(() => mockBeeCounts);

    updateBeeCounts();

    expect(mockBeeCountsElement.textContent).toBe('Bees Alive: queen: 2, worker: 3, drone: 1');
  });
});

describe('displayHitInfo function', () => {
  test('updates hitInfo element with hit information', () => {
    const mockHitInfoElement = {
      textContent: '',
    };
    document.getElementById = jest.fn((id) => {
      if (id === 'hitInfo') {
        return mockHitInfoElement;
      }
      return null;
    });

    const beeType = 'worker';
    const damage = 10;
    displayHitInfo(beeType, damage);

    expect(mockHitInfoElement.textContent).toBe(`Hit: ${beeType} (Damage: ${damage}HP)`);
  });
});


  