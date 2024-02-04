import { Tree } from "../models/tree.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const plantTree = async (req, res) => {
    try {
        // Destructure data from request body
        const { location, date, plantSpecies, plantedBy, latitude, longitude } = req.body;
        console.log(location, date, plantSpecies, plantedBy, req.files);

        const loggedInUser = await User.findOne({ _id: plantedBy }); // Wait for the user to be found
        if (!loggedInUser) {
            return res.json({ message: "Unauthenticated user trying to access services!!!" })
        }

        // Get file path from multer
        const localFilePath = req.files['plantImage'][0].path;
        console.log(localFilePath);

        // Upload file to Cloudinary
        const cloudinaryResponse = await uploadOnCloudinary(localFilePath);

        // If file upload to Cloudinary was successful
        if (cloudinaryResponse && cloudinaryResponse.url) {
            // Create a new tree object with coordinates
            const newTree = new Tree({
                location,
                coordinates: { latitude, longitude }, // Add coordinates field
                date,
                plantSpecies,
                plantedBy,
                treeImages: cloudinaryResponse.url // Store Cloudinary URL
            });

            console.log("Cloudinary Url:", cloudinaryResponse.url)

            // Save tree object to MongoDB without triggering validation
            await newTree.save({ validateBeforeSave: false });

            // Push the new tree ID into the loggedInUser's treesPlanted array
            loggedInUser.treesPlanted.push(newTree._id);
            await loggedInUser.save({ validateBeforeSave: false });

            // Return success response
            return res.status(200).json({ message: 'Tree saved successfully', tree: newTree });
        } else {
            // If file upload to Cloudinary failed
            return res.status(500).json({ message: 'Failed to upload file to Cloudinary' });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export {plantTree};
