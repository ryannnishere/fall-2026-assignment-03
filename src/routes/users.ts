import { Router } from 'express';
import { getAllUsers, getUserById, createUser } from '../dal/users.js';

const router = Router();

// GET /users
router.get('/', async (req, res) => {
  const users = await getAllUsers();
  res.json(users);
});

// GET /users/:id
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const user = await getUserById(id);

  if (user === undefined) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json(user);
});

// POST /users
router.post('/', async (req, res) => {
  const { name, email } = req.body;
  const newUser = { name, email };
  const created = await createUser(newUser);
  res.status(201).json(created);
});

export default router;
