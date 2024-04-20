import { Router } from 'express'
import Bitacora from '../models/bitacora.js';

export const bitacoraRouter = Router()

bitacoraRouter.get('/bitacora',async  (req, res) => {
    try {
        const bitacora = await Bitacora.find();
        res.status(200).json(bitacora);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


