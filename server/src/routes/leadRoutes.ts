import { Router } from 'express';
import {
  createLead,
  deleteLead,
  getLeadById,
  getLeads,
  updateLead
} from '../controllers/leadController';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';

const leadRoutes = Router();

leadRoutes.use(authMiddleware);
leadRoutes.get('/', getLeads);
leadRoutes.post('/', createLead);
leadRoutes.get('/:id', getLeadById);
leadRoutes.put('/:id', updateLead);
leadRoutes.delete('/:id', roleMiddleware(['admin']), deleteLead);

export { leadRoutes };
export default leadRoutes;
