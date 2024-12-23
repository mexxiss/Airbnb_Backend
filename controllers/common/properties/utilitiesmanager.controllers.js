import mongoose from 'mongoose';
import { PropertyUtilitiesManagerModel } from '../../../models/PropertyUtilitiesManager.js';

// Create a new property utility
export const createPropertyUtility = async (req, res) => {
    // #swagger.tags = ['Users']
    // #swagger.summary = "AUTHENTICATED Owner OR Admin can create Property Utility for a Property by providing Property ID"
    // #swagger.description = "Created document may contain unnecessary fields."
    /* #swagger.requestBody = {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: "#/components/schema/UtilityManagementRequest" }
          }
        }
      }
    */
    const { internet, electricity_water, gas, chiller, other, property, user: reqUser } = req.body;

    const role = req?.user?.role;
    let user = reqUser;

    if (!property || !mongoose.isValidObjectId(property)) {
        return res.status(400).send({ error: 'Invalid Property Id: A valid property ID is required.' });
    }

    if (role === 'owner' && !user) {
        user = req?.user?.id;
    }

    if (role === 'admin' && !user) {
        return res.status(400).send({ error: 'User Id is required: Admins must provide a user ID.' });
    }

    try {
        const propertyUtility = await PropertyUtilitiesManagerModel.create({
            internet,
            electricity_water,
            gas,
            chiller,
            other,
            property,
            user
        });
        res.status(201).send(propertyUtility);
    } catch (error) {
        console.error('Error creating property utility:', error);
        res.status(500).send({ error: 'Internal Server Error: Unable to create property utility.' });
    }
};

// Get all property utilities
// export const getAllPropertyUtilities = async (req, res) => {
//     // #swagger.tags = ['Admin']
//     // #swagger.summary = "AUTHENTICATED Admin can get all Property Utilities"
//     // #swagger.description = "Created document may contain unnecessary fields."

//     try {
//         const propertyUtilities = await PropertyUtilitiesManagerModel.find();
//         res.status(200).send(propertyUtilities);
//     } catch (error) {
//         res.status(500).send(error);
//     }
// };

// Get a single property utility by ID
export const getPropertyUtilityById = async (req, res) => {
    const { id } = req.query; // Property ID
    const role = req?.user?.role;
    let user = req.query.user;

    if (!id || !mongoose.isValidObjectId(id)) {
        return res.status(400).send({ error: 'Invalid Property Id: A valid property ID is required.' });
    }

    if (role === 'owner') {
        user = req?.user?.id;
    }

    if (role === 'admin' && !user) {
        return res.status(400).send({ error: 'User Id is required: Admins must provide a user ID.' });
    }

    try {
        let query = { property: id };
        if (user) {
            query.user = user;
        }

        const propertyUtility = await PropertyUtilitiesManagerModel.findOne(query);
        if (!propertyUtility) {
            return res.status(404).send({ error: 'Property utility not found.' });
        }
        res.status(200).send(propertyUtility);
    } catch (error) {
        console.error('Error fetching property utility:', error);
        res.status(500).send({ error: 'Internal Server Error: Unable to fetch property utility.' });
    }
};

// Update a property utility by ID
export const UpdatePropertyUtilityById = async (req, res) => {
    const {id} = req.params;
    const { updates } = req.body;
    try {
        const propertyUtility = await PropertyUtilitiesManagerModel.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        if (!propertyUtility) {
            return res.status(404).send();
        }
        res.status(200).send(propertyUtility);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Delete a property utility by ID
export const deletePropertyUtilityById = async (req, res) => {
    try {
        const propertyUtility = await PropertyUtilitiesManagerModel.findByIdAndDelete(req.params.id);
        if (!propertyUtility) {
            return res.status(404).send();
        }
        res.status(200).send(propertyUtility);
    } catch (error) {
        res.status(500).send(error);
    }
};