// backend/routes/labs.js
const express = require('express');
const {
  getLabs,
  getLab,
  createLab,
  updateLab,
  deleteLab,
  getAvailableLabs,
  updateLabStatus,
  getLabStats,
  addLabEquipment,
  updateLabEquipment,
  removeLabEquipment
} = require('../controllers/labController');

const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

/**
 * @swagger
 * /api/v1/labs:
 *   get:
 *     summary: Get all laboratories
 *     tags: [Laboratories]
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *         description: Search by lab name or code
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: [available, maintenance, occupied, closed]
 *         description: Filter by lab status
 *       - name: capacity
 *         in: query
 *         schema:
 *           type: integer
 *         description: Filter by minimum capacity
 *     responses:
 *       200:
 *         description: List of laboratories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 10
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Lab'
 *       500:
 *         $ref: '#/components/responses/Error'
 */
router.get('/', getLabs);

/**
 * @swagger
 * /api/v1/labs/available:
 *   get:
 *     summary: Get available laboratories for booking
 *     tags: [Laboratories]
 *     parameters:
 *       - $ref: '#/components/parameters/dateParam'
 *       - name: timeSlot
 *         in: query
 *         schema:
 *           type: string
 *           example: "09:00-11:00"
 *         description: Time slot for booking (format: HH:MM-HH:MM)
 *       - name: capacity
 *         in: query
 *         schema:
 *           type: integer
 *         description: Minimum capacity required
 *       - name: equipment
 *         in: query
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         style: form
 *         explode: false
 *         example: "microscope,bunsen_burner"
 *         description: Required equipment
 *     responses:
 *       200:
 *         description: List of available labs
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Success'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
router.get('/available', getAvailableLabs);

/**
 * @swagger
 * /api/v1/labs/stats:
 *   get:
 *     summary: Get laboratory usage statistics
 *     tags: [Laboratories]
 *     responses:
 *       200:
 *         description: Laboratory statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalLabs:
 *                       type: integer
 *                       example: 15
 *                     availableLabs:
 *                       type: integer
 *                       example: 12
 *                     totalCapacity:
 *                       type: integer
 *                       example: 450
 *                     usageRate:
 *                       type: number
 *                       format: float
 *                       example: 75.5
 *                     popularLabs:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           labName:
 *                             type: string
 *                           bookingCount:
 *                             type: integer
 */
router.get('/stats', getLabStats);

// Apply authentication middleware to all following routes
router.use(protect);

/**
 * @swagger
 * /api/v1/labs:
 *   post:
 *     summary: Create a new laboratory
 *     tags: [Laboratories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateLab'
 *     responses:
 *       201:
 *         description: Laboratory created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: "Laboratory created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Lab'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Admin access required
 */
router.post('/', authorize('admin'), createLab);

/**
 * @swagger
 * /api/v1/labs/{id}:
 *   get:
 *     summary: Get laboratory by ID
 *     tags: [Laboratories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     responses:
 *       200:
 *         description: Laboratory details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Success'
 *       404:
 *         description: Laboratory not found
 *       500:
 *         $ref: '#/components/responses/Error'
 */
router.get('/:id', getLab);

/**
 * @swagger
 * /api/v1/labs/{id}:
 *   put:
 *     summary: Update laboratory information
 *     tags: [Laboratories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               location:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [available, maintenance, occupied, closed]
 *               availability:
 *                 type: object
 *     responses:
 *       200:
 *         description: Laboratory updated successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Laboratory not found
 */
router.put('/:id', authorize('admin'), updateLab);

/**
 * @swagger
 * /api/v1/labs/{id}:
 *   delete:
 *     summary: Delete a laboratory
 *     tags: [Laboratories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     responses:
 *       200:
 *         description: Laboratory deleted successfully
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Laboratory not found
 *       409:
 *         description: Cannot delete lab with active bookings
 */
router.delete('/:id', authorize('admin'), deleteLab);

/**
 * @swagger
 * /api/v1/labs/{id}/status:
 *   put:
 *     summary: Update laboratory status
 *     tags: [Laboratories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [available, maintenance, occupied, closed]
 *                 example: "maintenance"
 *               reason:
 *                 type: string
 *                 example: "Annual maintenance"
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Invalid status value
 *       403:
 *         description: Admin access required
 */
router.put('/:id/status', authorize('admin'), updateLabStatus);

/**
 * @swagger
 * /api/v1/labs/{id}/equipment:
 *   post:
 *     summary: Add equipment to laboratory
 *     tags: [Laboratories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - quantity
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Microscope"
 *               quantity:
 *                 type: integer
 *                 example: 5
 *               condition:
 *                 type: string
 *                 enum: [good, needs_maintenance, broken]
 *                 example: "good"
 *     responses:
 *       200:
 *         description: Equipment added successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       403:
 *         description: Admin access required
 */
router.post('/:id/equipment', authorize('admin'), addLabEquipment);

module.exports = router;