const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
require('./setupDB');

chai.use(chaiHttp);
const { expect } = chai;

// Registers + logs in a user and returns { token, userId }
const createUser = async (overrides = {}) => {
  const payload = {
    name: 'Test User',
    email: 'test@test.com',
    password: 'Password123!',
    role: 'CUSTOMER',
    ...overrides
  };

  await chai.request(app).post('/api/auth/register').send(payload);

  const res = await chai
    .request(app)
    .post('/api/auth/login')
    .send({ email: payload.email, password: payload.password });

  return {
    token: res.body.token,
    email: payload.email
  };
};

// Creates a shipment and returns it
const createShipment = async (token) => {
  const res = await chai
    .request(app)
    .post('/api/shipments')
    .set('Authorization', `Bearer ${token}`)
    .send({
      recipient: {
        name: 'John Receiver',
        phone: '+61400000000',
        address: { street: '123 Test St', city: 'Brisbane' }
      },
      sender: {
        name: 'Test Sender',
        address: { city: 'Sydney' }
      },
      parcel: {
        weight: 2.5,
        dimensions: '20x15x10 cm',
        description: 'Test package',
        type: 'STANDARD'
      }
    });

  return res.body.data;
};

// TC-01  POST /api/auth/register — successful registration
describe('TC-01 | POST /api/auth/register — successful registration', () => {
  it('should register a new user and return token + user object', async () => {
    const res = await chai.request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'test@test.com',
      password: 'Password123!'
    });

    expect(res).to.have.status(201);
    expect(res.body.success).to.be.true;
    expect(res.body).to.have.property('token');
    expect(res.body).to.include({ email: 'test@test.com', role: 'CUSTOMER' });
    expect(res.body).to.not.have.property('password');
  });
});

// TC-02  POST /api/auth/login — Invalid email or password
describe('TC-02 | POST /api/auth/login — Invalid email or password', () => {
  it('should return 401 when password is wrong', async () => {
    await createUser({ email: 'test1@test.com' });

    const res = await chai
      .request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: 'WrongPassword!' });

    expect(res).to.have.status(401);
    expect(res.body.success).to.be.false;
    expect(res.body.message).to.equal('Invalid email or password');
  });
});

// TC-03  POST /api/auth/logout — token invalidation
describe('TC-03 | POST /api/auth/logout — token invalidation via tokenVersion', () => {
  it('should logout and reject the old token on next request', async () => {
    const { token } = await createUser({ email: 'logout@test.com' });

    // Logout — increments tokenVersion
    const res = await chai.request(app).post('/api/auth/logout').set('Authorization', `Bearer ${token}`);

    expect(res).to.have.status(200);
    expect(res.body.success).to.be.true;

    // Old token should now be rejected
    const protectedRes = await chai.request(app).get('/api/shipments').set('Authorization', `Bearer ${token}`);

    expect(protectedRes).to.have.status(401);
    expect(protectedRes.body.message).to.match(/invalidated|session/i);
  });
});

// TC-04  GET /api/shipments — unauthenticated request
describe('TC-04 | GET /api/shipments — blocked without token', () => {
  it('should return 401 when no Authorization header is sent', async () => {
    const res = await chai.request(app).get('/api/shipments');

    expect(res).to.have.status(401);
    expect(res.body.success).to.be.false;
    expect(res.body.message).to.match(/no token/i);
  });
});

// TC-05  POST /api/shipments — customer creates a shipment
describe('TC-05 | POST /api/shipments — successful shipment creation', () => {
  it('should create a shipment and return a trackingId', async () => {
    const { token } = await createUser({ email: 'customer@test.com' });

    const res = await chai
      .request(app)
      .post('/api/shipments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        recipient: {
          name: 'Test Receiver',
          phone: '+61411111111',
          address: { street: '123 Test City', city: 'Brisbane' }
        },
        sender: {
          name: 'Test Sender',
          address: { city: 'Brisbane' }
        },
        parcel: {
          weight: 1.5,
          dimensions: '10x10x10 cm',
          description: 'Books',
          type: 'EXPRESS'
        }
      });

    expect(res).to.have.status(201);
    expect(res.body.success).to.be.true;
    expect(res.body.data).to.have.property('trackingId');
    expect(res.body.data.status).to.equal('PENDING');
  });
});

// TC-06  GET /api/tracking/:trackingId — public tracking
describe('TC-06 | GET /api/tracking/:trackingId — public access', () => {
  it('should return limited shipment info without authentication', async () => {
    const { token } = await createUser({ email: 'test@test.com' });
    const shipment = await createShipment(token);

    // No token — public endpoint
    const res = await chai.request(app).get(`/api/tracking/${shipment.trackingId}`);

    expect(res).to.have.status(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data).to.have.property('trackingId');
    expect(res.body.data).to.have.property('status');

    // Full sender address should NOT be exposed publicly
    expect(res.body.data).to.not.have.nested.property('sender.address.street');
  });
});

// TC-07  GET /api/tracking/:trackingId — invalid tracking ID
describe('TC-07 | GET /api/tracking/:trackingId — not found', () => {
  it('should return 404 for a non-existent tracking ID', async () => {
    const res = await chai.request(app).get('/api/tracking/AWS-0000-INVALID');

    expect(res).to.have.status(404);
    expect(res.body.success).to.be.false;
  });
});

// TC-08  PUT /api/shipments/:id/status — admin updates status
describe('TC-08 | PUT /api/shipments/:id/status — admin status update', () => {
  it('should allow admin to update shipment status to IN_TRANSIT', async () => {
    const customer = await createUser({ email: 'customer@test.com', role: 'CUSTOMER' });
    const admin = await createUser({ email: 'admin@test.com', role: 'ADMIN' });
    const shipment = await createShipment(customer.token);

    const res = await chai
      .request(app)
      .put(`/api/shipments/${shipment._id}/status`)
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ status: 'IN_TRANSIT' });

    expect(res).to.have.status(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data.status).to.equal('IN_TRANSIT');
  });
});

// TC-09  DELETE /api/shipments/:id — admin hard delete
describe('TC-09 | DELETE /api/shipments/:id — admin hard delete', () => {
  it('should permanently delete a shipment and return deleted trackingId', async () => {
    const customer = await createUser({ email: 'customer@test.com', role: 'CUSTOMER' });
    const admin = await createUser({ email: 'admin@test.com', role: 'ADMIN' });
    const shipment = await createShipment(customer.token);

    const res = await chai
      .request(app)
      .delete(`/api/shipments/${shipment._id}`)
      .set('Authorization', `Bearer ${admin.token}`);

    expect(res).to.have.status(200);
    expect(res.body.success).to.be.true;
    expect(res.body.deleted.shipment).to.equal(shipment.trackingId);

    // Confirm it no longer exists
    const trackRes = await chai.request(app).get(`/api/tracking/${shipment.trackingId}`);

    expect(trackRes).to.have.status(404);
  });
});
