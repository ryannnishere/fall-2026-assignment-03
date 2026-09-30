import { Router } from 'express';
import {
  GetAllTicketsOptions,
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicketStatus,
} from '../dal/tickets.js';
import { authMiddleware } from '../middleware/auth.js';
import { insertTimeLog, getTotalHoursForTicket } from '../dal/timeLogs.js';

const router = Router();

// GET /tickets
router.get('/', async (req, res) => {
  const options: GetAllTicketsOptions = {};

  if (req.query.status) {
    options.status = req.query.status as string;
  }
  if (req.query.limit) {
    options.limit = Number(req.query.limit);
  }
  if (req.query.offset) {
    options.offset = Number(req.query.offset);
  }

  const tickets = await getAllTickets(options);
  res.json(tickets);
});
// GET /tickets/:id
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const ticket = await getTicketById(id);

  if (ticket === undefined) {
    res.status(404).json({ error: 'Ticket not found' });
    return;
  }
  res.json(ticket);
});
// POST /tickets
router.post('/', authMiddleware, async (req, res) => {
  const creator_id = res.locals.userId;
  const { title, description } = req.body;
  const newTicket = { title, description, creator_id };
  const created = await createTicket(newTicket);
  res.status(201).json(created);
});

// PATCH /tickets/:id/status
router.patch('/:id/status', authMiddleware, async (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;

  const updated = await updateTicketStatus(id, status);

  if (updated === undefined) {
    res.status(404).json({ error: 'Ticket not found' });
    return;
  }

  res.status(200).json(updated);
});

// POST /tickets/:id/time
router.post('/:id/time', authMiddleware, async (req, res) => {
  const ticketId = Number(req.params.id);
  const userId = res.locals.userId;
  const { hours } = req.body;

  const log = await insertTimeLog(ticketId, userId, hours);
  res.status(201).json(log);
});

// GET /tickets/:id/time
router.get('/:id/time', async (req, res) => {
  const ticketId = Number(req.params.id);
  const totalHours = await getTotalHoursForTicket(ticketId);
  res.json({ ticket_id: ticketId, total_hours: totalHours });
});

export default router;
