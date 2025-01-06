import { PropertyQueryModel } from "../../../models/PropertyQueries.js";
import { apiError } from "../../../utils/apiError.js";

export const AddPropertyQuery = async (req, res, next) => {
    // #swagger.tags = ['General']
    // #swagger.summary = "Add property query"
    // #swagger.description = "Endpoint to add property query"
    /* #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Property query object',
        required: true,
        schema: { $ref: "#/components/schemas/PropertyQuery" }
    } */
    const { full_name, email, phone, message } = req.body;

    if (!full_name || !email || !phone || !message) {
        return next(new apiError(400, "Missing required parameters: name, email, phone, message, or property_id."));
    }

    const formattedPhone = '+'+phone;

    const replacements = {
        title: "Received new Property Query!",
        text: `Congratulations, you have received a new query from ${full_name}. Here is the contact information provided.`,
        moreDetails: `<p><strong>Name:</strong> ${full_name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${formattedPhone}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>`,
    };

    const acknowledgeReplacements = {
        title: "Mexxiss has received your Query",
        text: `Dear ${full_name}, thank you for reaching out to us. We have received your query and will respond shortly.`,
        moreDetails: `<p>If you have any urgent concerns, feel free to reply to this email.</p>`,
    };

    try {
        const query = await PropertyQueryModel.create({ full_name, email, phone, message });

        await Promise.all([
            mailSender(process.env.MAIL_FROM, "New Property Management Request", replacements),
            mailSender(email, "Your Property Management Request Received", acknowledgeReplacements),
        ]);
        
        return res.status(200).json("Query Added Successfully");
    } catch (err) {
        return next(new apiError(500, `Server Error: ${err}`));
    }
}