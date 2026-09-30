import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/index.js';

describe('Part 2: Time Logs Tests', () => {
  it('logs hours and returns the correct total', async () => {
    const userRes = await request(app)
      .post('/users')
      .send({ name: 'Time Tester', email: `time-${Date.now()}@example.com` });

    const ticketRes = await request(app)
      .post('/tickets')
      .set('X-User-Id', String(userRes.body.id))
      .send({ title: 'Timed Ticket', description: 'For time log test' });

    const ticketId = ticketRes.body.id;
    const userId = userRes.body.id;

    await request(app)
      .post(`/tickets/${ticketId}/time`)
      .set('X-User-Id', String(userId))
      .send({ hours: 3 });

    await request(app)
      .post(`/tickets/${ticketId}/time`)
      .set('X-User-Id', String(userId))
      .send({ hours: 5 });

    const response = await request(app).get(`/tickets/${ticketId}/time`);

    expect(response.status).toBe(200);
    expect(response.body.ticket_id).toBe(ticketId);
    expect(response.body.total_hours).toBe(8);
  });
});
