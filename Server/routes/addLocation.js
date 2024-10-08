const express = require('express');
const multer = require('multer');
const Location = require('../models/addLocation');
const { handleAllLocation } = require('../controllers/addLocation');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Adjust path as necessary
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Keep original file name
    }
});
const upload = multer({ storage: storage });

// Basic validation function
const validateLocation = (data) => {
    const errors = [];
    if (!data.name) errors.push("Name is required");
    if (!data.locationType || !['Organizations', 'NGOs', ' Government agencies'].includes(data.locationType)) errors.push("Select what type of Agencies");
    if (!data.station) errors.push("Station is required");
    if (!data.description) errors.push("Description is About Organizations");
    if (data.rating === undefined || data.rating < 1 || data.rating > 5) errors.push("Rating must be between 1 and 5");
    return errors.length > 0 ? errors : null;
};



router.get('/', handleAllLocation);


// Route to add location
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const validationErrors = validateLocation(req.body);
        if (validationErrors) return res.status(400).send({ message: validationErrors.join(', ') });

        const locationData = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            DrName:  req.body.DrName,
            SrName:  req.body.SrName,
            JrName:  req.body.JrName,
            locationType: req.body.locationType,
            station: req.body.station,
            image: req.file ? req.file.path : null,
            description: req.body.description,
            additionalDetails: req.body.additionalDetails,
            rating: req.body.rating
        };

        const newLocation = new Location(locationData);
        const result = await newLocation.save();
        res.status(201).send(result); // Send status 201 for created resource
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error', error });
    }
});

module.exports = router;
