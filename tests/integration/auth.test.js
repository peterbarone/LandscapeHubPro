const request = require('supertest');
const bcrypt = require('bcryptjs');
const { User } = require('../../src/db/models');
const { sequelize } = require('../../src/db');
const app = require('../../src/app'); // We'll create this next

describe('Auth API', () => {
  // Test user credentials
  const testUser = {
    email: 'test.user@example.com',
    password: 'Password123!',
    firstName: 'Test',
    lastName: 'User',
    role: 'admin'
  };
  
  let userId;
  
  beforeAll(async () => {
    // Create a test user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(testUser.password, salt);
    
    const user = await User.create({
      email: testUser.email,
      passwordHash: hashedPassword,
      firstName: testUser.firstName,
      lastName: testUser.lastName,
      role: testUser.role
    });
    
    userId = user.id;
  });
  
  afterAll(async () => {
    // Clean up the test user
    await User.destroy({ where: { id: userId }, force: true });
  });
  
  describe('POST /api/v1/auth/login', () => {
    it('should login and return JWT token with correct credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });
      
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', testUser.email);
    });
    
    it('should return 401 with incorrect password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword123!'
        });
      
      expect(response.statusCode).toBe(401);
    });
    
    it('should return 404 with non-existent email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Password123!'
        });
      
      expect(response.statusCode).toBe(404);
    });
  });
  
  describe('GET /api/v1/auth/profile', () => {
    let authToken;
    
    beforeEach(async () => {
      // Login to get a token
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });
      
      authToken = response.body.token;
    });
    
    it('should return user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('email', testUser.email);
      expect(response.body).toHaveProperty('firstName', testUser.firstName);
      expect(response.body).toHaveProperty('lastName', testUser.lastName);
      expect(response.body).toHaveProperty('role', testUser.role);
      expect(response.body).not.toHaveProperty('passwordHash');
    });
    
    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/profile')
        .set('Authorization', 'Bearer invalid-token');
      
      expect(response.statusCode).toBe(401);
    });
    
    it('should return 401 with no token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/profile');
      
      expect(response.statusCode).toBe(401);
    });
  });
});
