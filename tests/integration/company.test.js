const request = require('supertest');
const bcrypt = require('bcryptjs');
const { User, Company } = require('../../src/db/models');
const { v4: uuidv4 } = require('uuid');
const app = require('../../src/app');

describe('Company API', () => {
  // Test company and user
  const testCompany = {
    name: 'Test Landscaping Co',
    address: '123 Test Street',
    city: 'Testville',
    state: 'TS',
    zipCode: '12345',
    phoneNumber: '555-123-4567',
    email: 'info@testlandscaping.com'
  };
  
  const testUser = {
    email: 'admin@testlandscaping.com',
    password: 'Password123!',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin'
  };
  
  let companyId;
  let userId;
  let authToken;
  
  beforeAll(async () => {
    // Create test company
    const company = await Company.create({
      ...testCompany,
      subscriptionTier: 'basic',
      subscriptionStatus: 'active'
    });
    companyId = company.id;
    
    // Create admin user for the company
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(testUser.password, salt);
    
    const user = await User.create({
      email: testUser.email,
      passwordHash: hashedPassword,
      firstName: testUser.firstName,
      lastName: testUser.lastName,
      role: testUser.role,
      companyId
    });
    
    userId = user.id;
    
    // Get auth token
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });
    
    authToken = response.body.token;
  });
  
  afterAll(async () => {
    // Clean up test data
    await User.destroy({ where: { id: userId }, force: true });
    await Company.destroy({ where: { id: companyId }, force: true });
  });
  
  describe('GET /api/v1/companies/:id', () => {
    it('should return company details with valid token and id', async () => {
      const response = await request(app)
        .get(`/api/v1/companies/${companyId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('name', testCompany.name);
      expect(response.body).toHaveProperty('address', testCompany.address);
      expect(response.body).toHaveProperty('city', testCompany.city);
      expect(response.body).toHaveProperty('state', testCompany.state);
    });
    
    it('should return 403 when accessing another company', async () => {
      const response = await request(app)
        .get(`/api/v1/companies/${uuidv4()}`) // Random invalid ID
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.statusCode).toBe(403);
    });
    
    it('should return 401 with no token', async () => {
      const response = await request(app)
        .get(`/api/v1/companies/${companyId}`);
      
      expect(response.statusCode).toBe(401);
    });
  });
  
  describe('PUT /api/v1/companies/:id', () => {
    it('should update company details with valid token and id', async () => {
      const updateData = {
        name: 'Updated Test Landscaping Co',
        phoneNumber: '555-999-8888'
      };
      
      const response = await request(app)
        .put(`/api/v1/companies/${companyId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);
      
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('name', updateData.name);
      expect(response.body).toHaveProperty('phoneNumber', updateData.phoneNumber);
      
      // Verify the changes are reflected in the database
      const company = await Company.findByPk(companyId);
      expect(company.name).toBe(updateData.name);
      expect(company.phoneNumber).toBe(updateData.phoneNumber);
    });
    
    it('should return 403 when updating another company', async () => {
      const response = await request(app)
        .put(`/api/v1/companies/${uuidv4()}`) // Random invalid ID
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Should Not Update' });
      
      expect(response.statusCode).toBe(403);
    });
    
    it('should return 401 with no token', async () => {
      const response = await request(app)
        .put(`/api/v1/companies/${companyId}`)
        .send({ name: 'Should Not Update' });
      
      expect(response.statusCode).toBe(401);
    });
  });
});
