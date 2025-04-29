const superAdminController = require('../controlleurs/superAdminController');
const User = require('../models/userModel');

jest.mock('../models/userModel'); // Mock Mongoose model

describe('SuperAdminController', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addAdmin', () => {
    it('should create a new admin when email is not used', async () => {
      const req = {
        body: {
          email: 'admin@example.com',
          password: 'password123',
          name: 'Admin',
          surname: 'Test'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      User.findOne.mockResolvedValue(null);
      User.prototype.save = jest.fn().mockResolvedValue(req.body);

      await superAdminController.addAdmin(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Admin ajouté avec succès',
      }));
    });

    it('should return 400 if email already exists', async () => {
      const req = {
        body: {
          email: 'admin@example.com',
          password: 'password123',
          name: 'Admin',
          surname: 'Test'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      User.findOne.mockResolvedValue({ email: req.body.email });

      await superAdminController.addAdmin(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Email déjà utilisé' });
    });
  });

  describe('getAllAdmins', () => {
    it('should return all admins', async () => {
      const admins = [{ name: 'Admin1', role: 'admin' }, { name: 'Admin2', role: 'admin' }];
      User.find.mockResolvedValue(admins);

      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await superAdminController.getAllAdmins(req, res);
      expect(User.find).toHaveBeenCalledWith({ role: 'admin' });
      expect(res.json).toHaveBeenCalledWith({ admins });
    });
  });

  describe('deleteAdmin', () => {
    it('should delete an admin (not superadmin)', async () => {
      const req = { params: { id: '123' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      const fakeAdmin = { _id: '123', role: 'admin' };
      User.findById.mockResolvedValue(fakeAdmin);
      User.findByIdAndDelete.mockResolvedValue();

      await superAdminController.deleteAdmin(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: 'Admin supprimé' });
    });

    it('should not delete a superadmin', async () => {
      const req = { params: { id: '123' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      const superadmin = { _id: '123', role: 'superadmin' };
      User.findById.mockResolvedValue(superadmin);

      await superAdminController.deleteAdmin(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Impossible de supprimer un superadmin' });
    });
  });

});
