import { Router } from 'express';
import {
  GetAllTicketsOptions,
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicketStatus,
} from '../dal/tickets.js';
import { authMiddleware } from '../middleware/auth.js';
const router = Router();
/*
### 3. Ticket Routes (`src/routes/tickets.ts`)

Implement the ticket endpoints with strict payload validation:

- `GET /tickets`: Return all tickets. Must support query parameters for pagination (`?limit=10&offset=0`) and filtering (`?status=TODO`).
- `GET /tickets/:id`: Return a single ticket. Return `404 Not Found` if undefined.
- `POST /tickets`: Create a new ticket. Extract the `creator_id` from the `X-User-Id` header (via your middleware) and the `title`/`description` from the body. Return `201 Created`.
- `PATCH /tickets/:id/status`: Update a ticket's status. Return `200 OK`.
*/

// TODO: Student implementation - Part 1: Ticket Routes
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

// TODO: Student implementation - Part 2: Time Log Routes
// POST /tickets/:id/time
// GET /tickets/:id/time

export default router;
