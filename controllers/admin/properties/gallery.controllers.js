import { GalleryModel } from "../../../models/Gallery.js";
import { apiError } from "../../../utils/apiError.js";
import { apiResponse } from "../../../utils/apiResponse.js";
import mongoose from "mongoose";

export const createGalleryContent = async (req, res) => {
  // #swagger.tags = ['Admin']
  // #swagger.summary = "AUTHORIZED Admin can add property images, while creating properties, in gallery collections."
  // #swagger.description = "> #TODO: Created document is being sent from reponse that may be unnecessary",
  /* #swagger.requestBody = {
      required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/GallaryRequest" }  
          }
        }
    } 
  */

  const { img_url, type, property } = req.body;

  try {
    const newGallery = new GalleryModel({ img_url, type, property });
    const savedGallery = await newGallery.save();

    res
      .status(201)
      .json({ msg: "gallery created successfully", data: savedGallery });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const UpdateGallary = async (req, res, next) => {
  // #swagger.tags = ['Admin']
  // #swagger.summary = "AUTHORIZED Admin can overwrite the gallary type by specifying the gallery document using id from path."
  // #swagger.description = "> #TODO: Updated document is being sent from reponse that may be unnecessary",
  /* #swagger.requestBody = {
      required: true,
        content: {
          "application/json": {
            schema: { "type": "objectid of gallery type" }  
          }
        }
    } 
  */
  const { type, property } = req.body;
  const { id } = req.params;

  if (!id) {
    return next(new apiError(400, "Please provide valid document ID"));
  }

  try {
    const gallaryDoc = await GalleryModel.findByIdAndUpdate(
      id,
      { $set: { type, property } },
      { new: true, runValidators: true }
    );
    return res.status(200).json(new apiResponse(200, gallaryDoc, "Done"));
  } catch (error) {
    return next(new apiError(500, `Server Error: ${error}`));
  }
};

export const DeleteGallery = async (req, res, next) => {
  // #swagger.tags = ['Admin']
  // #swagger.summary = "AUTHORIZED Admin can delete a gallery document using the ID from the path."
  // #swagger.description = "> Deletes a gallery document by ID and returns the deleted document for reference."
  /* #swagger.parameters['id'] = {
        description: "ObjectID of the gallery document to delete",
        required: true
    } 
  */

  const { id } = req.params;

  if (!id) {
    return next(new apiError(400, "Please provide a valid document ID"));
  }

  try {
    const deletedGallery = await GalleryModel.findByIdAndDelete(id);

    if (!deletedGallery) {
      return next(new apiError(404, "Gallery document not found"));
    }

    return res
      .status(200)
      .json(
        new apiResponse(
          200,
          deletedGallery,
          "Gallery document deleted successfully"
        )
      );
  } catch (error) {
    return next(new apiError(500, `Server Error: ${error}`));
  }
};
