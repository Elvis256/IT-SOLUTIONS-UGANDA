const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// In-memory storage (replace with MongoDB in production)
const appointments = [];

// POST /api/appointments - Book new appointment
router.post('/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('phone').trim().notEmpty().withMessage('Phone is required'),
    body('date').isISO8601().withMessage('Valid date required'),
    body('time').trim().notEmpty().withMessage('Time is required'),
    body('service').isIn([
      'consultation', 
      'repair', 
      'network', 
      'software', 
      'training', 
      'support'
    ]).withMessage('Valid service required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { date, time } = req.body;
      
      // Check if slot is already booked
      const existingBooking = appointments.find(
        apt => apt.date === date && apt.time === time && apt.status !== 'cancelled'
      );

      if (existingBooking) {
        return res.status(400).json({
          success: false,
          message: 'This time slot is already booked. Please choose another time.'
        });
      }

      const appointment = {
        appointmentId: `APT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...req.body,
        status: 'confirmed',
        createdAt: new Date()
      };

      appointments.push(appointment);

      // TODO: Send SMS confirmation
      // TODO: Send email confirmation
      // TODO: Add to calendar
      // TODO: Save to MongoDB

      console.log('New appointment booked:', appointment.appointmentId);

      res.status(201).json({
        success: true,
        message: 'Appointment booked successfully',
        appointmentId: appointment.appointmentId,
        appointment
      });

    } catch (error) {
      console.error('Appointment error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to book appointment' 
      });
    }
  }
);

// GET /api/appointments - Get all appointments (admin only)
router.get('/', async (req, res) => {
  try {
    res.json({ appointments });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch appointments' });
  }
});

// GET /api/appointments/:appointmentId - Get specific appointment
router.get('/:appointmentId', async (req, res) => {
  try {
    const appointment = appointments.find(a => a.appointmentId === req.params.appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json({ appointment });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch appointment' });
  }
});

// PUT /api/appointments/:appointmentId - Update appointment (cancel/reschedule)
router.put('/:appointmentId', async (req, res) => {
  try {
    const appointmentIndex = appointments.findIndex(a => a.appointmentId === req.params.appointmentId);
    if (appointmentIndex === -1) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointments[appointmentIndex] = {
      ...appointments[appointmentIndex],
      ...req.body,
      updatedAt: new Date()
    };

    res.json({
      success: true,
      message: 'Appointment updated',
      appointment: appointments[appointmentIndex]
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update appointment' });
  }
});

// GET /api/appointments/available/:date - Get available slots for a date
router.get('/available/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const allSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];
    
    const bookedSlots = appointments
      .filter(apt => apt.date === date && apt.status !== 'cancelled')
      .map(apt => apt.time);
    
    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));
    
    res.json({ date, availableSlots, bookedSlots });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch available slots' });
  }
});

module.exports = router;
