import Contact from '../models/contactModel.js';

// Create new contact
const createContact = async (req, res) => {
    try {
        const { name, email, phone, description } = req.body;

        // Validate required fields
        if (!name || !email || !phone || !description) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        // Validate phone format (basic validation)
        const phoneRegex = /^\+?[\d\s-]{10,}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid phone number'
            });
        }

        const contact = await Contact.create({
            name,
            email,
            phone,
            description
        });

        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: contact
        });
    } catch (error) {
        console.error('Contact creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending message. Please try again later.'
        });
    }
};

// Get all contacts (for admin)
const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find()
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json({
            success: true,
            data: contacts
        });
    } catch (error) {
        console.error('Error in getAllContacts:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching contacts'
        });
    }
};

// Delete contact (admin only)
const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        await contact.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Contact deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting contact'
        });
    }
};

export { createContact, getAllContacts, deleteContact };
