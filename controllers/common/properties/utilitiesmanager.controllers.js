import mongoose from 'mongoose';
import { PropertyUtilitiesManagerModel } from '../../../models/PropertyUtilitiesManager.js';
import { apiError } from '../../../utils/apiError.js';

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

export const createEmptyPropertyUtility = async (req, res, next) => {
    const {id} = req.query // Property ID
    const user = req.user.id;

    if (!id ||!mongoose.isValidObjectId(id)) {
        return res.status(400).send({ error: 'Invalid Property Id: A valid property ID is required.' });
    }

    if (!user || !mongoose.isValidObjectId(user)) {
        return res.status(400).send({ error: 'Invalid User Id: A valid user ID is required.' });
    }

    const utility = {
        property: id,
        user: user,
        internet: {
            service_name: "Internet",
            paid_by: "Owner",
            field_name: "internet",
        },
        electricity_water: {
            service_name: "Electricity & Water",
            paid_by: "Owner",
            field_name: "electricity_water",
        },
        gas: {
            service_name: "Gas",
            paid_by: "Owner",
            field_name: "gas",
        },
        chiller: {
            service_name: "Chiller",
            paid_by: "Owner",
            field_name: "chiller",
        },
        other: [],
    }
    try {
        const newUtility = await PropertyUtilitiesManagerModel.create(utility);
        return res.status(200).send(newUtility);
    } catch (error) {
        console.log('Error creating empty property utility:', error);
        return next(new apiError(500, `Unable to create empty property utility: ${error.message}`));
    }
}

export const getPropertyUtilitiesById = async (req, res, next) => {
    const { id } = req.query; 
    const user = req.user.id;

    let query = { property: id }
    if (user) { query.user = user }
    
    try {
        const propertyUtility = await PropertyUtilitiesManagerModel.findOne(query);

        if (!propertyUtility) {
            return res.status(404).send({ error: 'Property utility not found' });
        }
        return res.status(200).send(propertyUtility);
    } catch (error) {
        return next(new apiError(500, `Failed to fetch property utility: ${error.message}`));
    }
}

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
        // Build the query
        let query = { property: id };
        if (user) {
            query.user = user;
        }

        // Check if the property utility document exists
        let propertyUtility = await PropertyUtilitiesManagerModel.findOne(query);

        if (!propertyUtility) {

            propertyUtility = new PropertyUtilitiesManagerModel({
                property: id,
                user,
                internet: {
                    service_name: "Internet",
                    paid_by: "Owner",
                    field_name: "internet",
                },
                electricity_water: {
                    service_name: "Electricity & Water",
                    paid_by: "Owner",
                    field_name: "electricity_water",
                },
                gas: {
                    service_name: "Gas",
                    paid_by: "Owner",
                    field_name: "gas",
                },
                chiller: {
                    service_name: "Chiller",
                    paid_by: "Owner",
                    field_name: "chiller",
                },
                other: [],
            });

            await propertyUtility.save();

            return res.status(201).send(propertyUtility);
        }

        return res.status(200).send(propertyUtility);
    } catch (error) {
        console.error('Error fetching property utility:', error);
        res.status(500).send({ error: 'Internal Server Error: Unable to fetch property utility.' });
    }
};

// Update a property utility by ID
export const UpdatePropertyUtilityById = async (req, res) => {
    const {id} = req.params; // Property ID
    const { updates } = req.body;
    try {
        const propertyUtility = await PropertyUtilitiesManagerModel.findByIdAndUpdate(id, updates, { new: true, runValidators: false });
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