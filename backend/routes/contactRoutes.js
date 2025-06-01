import express from 'express';
const router = express.Router();
import { createContact, getAllContacts, deleteContact } from '../controllers/contactController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// Public route for creating contact
router.post('/contact', createContact);

// Admin routes for managing contacts
router.get('/admin/contacts', protect, admin, getAllContacts);
router.delete('/admin/contacts/:id', protect, admin, deleteContact);

export default router;
