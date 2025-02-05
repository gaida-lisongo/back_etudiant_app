import e, { Router, Request, Response } from 'express';

const router = Router();

interface HelloResponse {
    message: string;
}

router.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Hello, world in Section!' } as HelloResponse);
});

export default router;