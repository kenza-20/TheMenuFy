const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Dish = require('../models/dishModel');
const {
  markTopSeller,
  getTopSellers,
  getSimilarDishes,
  addSimilarDish,
  incrementSalesCount,
} = require('../controlleurs/dishController');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({
    binary: {
      version: '4.4.10', // compatible sans AVX
    },
  });
  await mongoose.connect(mongoServer.getUri(), { dbName: 'test' });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Dish.deleteMany();
});

describe('Dish Controller', () => {
  test('markTopSeller should mark only one dish as top seller', async () => {
    const dish1 = await Dish.create({
      name: 'Dish1',
      description: 'desc1',
      price: 10,
      category: 'main',
      image: 'dish1.jpg',
      isTopSeller: false,
      salesCount: 0
    });

    const dish2 = await Dish.create({
      name: 'Dish2',
      description: 'desc2',
      price: 12,
      category: 'main',
      image: 'dish2.jpg',
      isTopSeller: false,
      salesCount: 0
    });

    await markTopSeller(dish2._id);

    const updated1 = await Dish.findById(dish1._id);
    const updated2 = await Dish.findById(dish2._id);

    expect(updated1.isTopSeller).toBe(false);
    expect(updated2.isTopSeller).toBe(true);
  });

  test('getTopSellers should return dish with highest salesCount', async () => {
    await Dish.create({
      name: 'Low',
      description: 'desc low',
      price: 5,
      category: 'main',
      image: 'low.jpg',
      isTopSeller: false,
      salesCount: 2
    });

    const top = await Dish.create({
      name: 'Top',
      description: 'desc top',
      price: 15,
      category: 'main',
      image: 'top.jpg',
      isTopSeller: true,
      salesCount: 99
    });

    const result = await getTopSellers();
    expect(result.name).toBe('Top');
    expect(result.salesCount).toBe(99);
  });

  test('getSimilarDishes should exclude top seller', async () => {
    const topSeller = await Dish.create({
      name: 'TopSeller',
      description: 'top dish',
      price: 20,
      category: 'main',
      image: 'top.jpg',
      isTopSeller: true,
      salesCount: 50
    });

    const other1 = await Dish.create({
      name: 'Dish A',
      description: 'desc A',
      price: 8,
      category: 'main',
      image: 'a.jpg',
      isTopSeller: false,
      salesCount: 5
    });

    const other2 = await Dish.create({
      name: 'Dish B',
      description: 'desc B',
      price: 9,
      category: 'main',
      image: 'b.jpg',
      isTopSeller: false,
      salesCount: 3
    });

    const result = await getSimilarDishes('main');
    const names = result.map(d => d.name);

    expect(names).not.toContain('TopSeller');
    expect(names).toEqual(expect.arrayContaining(['Dish A', 'Dish B']));
  });

  test('addSimilarDish should add a dish to similarDishes list', async () => {
    const baseDish = await Dish.create({
      name: 'Main Dish',
      description: 'desc',
      price: 10,
      category: 'main',
      image: 'main.jpg',
      isTopSeller: false,
      salesCount: 0,
      similarDishes: []
    });

    const similar = await Dish.create({
      name: 'Similar Dish',
      description: 'desc similar',
      price: 9,
      category: 'main',
      image: 'similar.jpg',
      isTopSeller: false,
      salesCount: 0
    });

    await addSimilarDish(baseDish._id, similar._id);

    const updated = await Dish.findById(baseDish._id);
    expect(updated.similarDishes).toContainEqual(similar._id);
  });

  test('incrementSalesCount should increase sales count by 1', async () => {
    const dish = await Dish.create({
      name: 'Sales Dish',
      description: 'desc',
      price: 11,
      category: 'main',
      image: 'sales.jpg',
      isTopSeller: false,
      salesCount: 5
    });

    await incrementSalesCount(dish._id);
    const updated = await Dish.findById(dish._id);

    expect(updated.salesCount).toBe(6);
  });
});
