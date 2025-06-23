import express from 'express';
import {
  getUserAddresses,
  createAddress,
  updateAddress,
  deleteAddress
} from '../controllers/addressController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// All address routes require authentication
router.use(authMiddleware);

router.get('/', getUserAddresses);
router.post('/', createAddress);
router.put('/:id', updateAddress);
router.delete('/:id', deleteAddress);

export default router;
