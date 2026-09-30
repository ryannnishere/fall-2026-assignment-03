import { Router } from 'express';
import { getAllUsers, getUserById, createUser } from '../dal/users.js';

const router = Router();

// TODO: Student implementation - Part 1: User Routes

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

export default router;
