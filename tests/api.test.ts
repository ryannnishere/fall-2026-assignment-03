import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/index.js';

describe('Part 1: API Integration Tests', () => {
  describe('Users', () => {
    // Test user creation (POST /users)
    it('creates a user and returns 201', async () => {
      const response = await request(app)
        .post('/users')
        .send({ name: 'Test User', email: `test-${Date.now()}@example.com` });

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('Test User');
      expect(response.body.id).toBeDefined();
    });

    it('returns 404 for a non-existent user', async () => {
      const response = await request(app).get('/users/999999');
      expect(response.status).toBe(404);
    });
  });

  describe('Tickets', () => {
    // Test ticket creation (POST /tickets)
    it('creates a ticket and returns 201', async () => {
      const userRes = await request(app)
        .post('/users')
        .send({
          name: 'Ticket Creator',
          email: `creator-${Date.now()}@example.com`,
        });

      const response = await request(app)
        .post('/tickets')
        .set('X-User-Id', String(userRes.body.id))
        .send({ title: 'Test Ticket', description: 'Testing creation' });

      expect(response.status).toBe(201);
      expect(response.body.title).toBe('Test Ticket');
      expect(response.body.creator_id).toBe(userRes.body.id);
    });

    // Test auth middleware rejection (401 when X-User-Id is missing or invalid)
    it('rejects ticket creation with no X-User-Id header (401)', async () => {
      const response = await request(app)
        .post('/tickets')
        .send({ title: 'Should Fail', description: 'No auth header' });

      expect(response.status).toBe(401);
    });

    // Test 404 responses for non-existent users and tickets
    it('returns 404 for a non-existent ticket', async () => {
      const response = await request(app).get('/tickets/999999');
      expect(response.status).toBe(404);
    });

    // Test pagination and filtering on GET /tickets
    it('supports pagination via limit', async () => {
      const response = await request(app).get('/tickets?limit=2');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(2);
    });

    it('supports filtering by status', async () => {
      const response = await request(app).get('/tickets?status=TODO');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      for (const ticket of response.body) {
        expect(ticket.status).toBe('TODO');
      }
    });

    it('updates a ticket status via PATCH', async () => {
      const userRes = await request(app)
        .post('/users')
        .send({
          name: 'Patch Tester',
          email: `patch-${Date.now()}@example.com`,
        });

      const ticketRes = await request(app)
        .post('/tickets')
        .set('X-User-Id', String(userRes.body.id))
        .send({ title: 'Patch Me', description: 'Will be updated' });

      const response = await request(app)
        .patch(`/tickets/${ticketRes.body.id}/status`)
        .set('X-User-Id', String(userRes.body.id))
        .send({ status: 'IN_PROGRESS' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('IN_PROGRESS');
    });
  });
});
