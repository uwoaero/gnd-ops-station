import { Router } from 'express';
const router = Router();

// Define a route
router.get('/start', (req, res) => {
    res.send('staring recording');
});

router.get('/stop', (req, res) => {
    res.send('stopping recording');
});

export default router;