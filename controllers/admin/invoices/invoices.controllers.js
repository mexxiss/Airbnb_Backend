import path from 'path';
import fs from 'fs';
import * as pdf from "html-pdf-node";
import { fileURLToPath } from 'url';
import { options } from '../../../helpers/pdfOptions.js';
import { cloudinary } from '../../../uploads/cloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generatePdf = async (req, res) => {
    try {
        // Paths
        const htmlPath = path.join(__dirname, '../../../public/invoice_templates/statement.html');
        const html = fs.readFileSync(htmlPath, 'utf-8');

        // Generate data
        const data = req.body.data || [];
        const array = data.map(d => ({
            name: d.name,
            description: d.description,
            unit: d.unit,
            quantity: d.quantity,
            price: d.price,
            total: d.quantity * d.price,
            imgurl: d.imgurl,
        }));

        const subtotal = array.reduce((sum, i) => sum + i.total, 0);
        const tax = (subtotal * 20) / 100;
        const grandtotal = subtotal - tax;

        const obj = {
            prodlist: array,
            subtotal,
            tax,
            gtotal: grandtotal,
        };

        const filename = `${Date.now()}_invoice.pdf`;
        const tempPath = path.join(__dirname, `../../../temp/${filename}`);
        const document = {
            content: html,
            data: { products: obj },
        };

        // Generate PDF
        const pdfBuffer = await pdf.generatePdf(document, {
            format: 'A4', margin: {
                top: 20,
                bottom: 20,
                left: 20,
                right: 20,
            }
        });

        // Save the PDF temporarily
        fs.writeFileSync(tempPath, pdfBuffer);

        // Upload to Cloudinary
        cloudinary.uploader.upload_stream(
            {
                folder: 'invoices',
                resource_type: 'raw',
                public_id: filename,
                format: 'pdf',
            },
            (error, result) => {
                fs.unlink(tempPath, err => {
                    if (err) console.error('Error deleting temp file:', err);
                });

                if (error) {
                    console.error('Error uploading to Cloudinary:', error);
                    return res.status(500).json({ message: 'Error uploading PDF', error });
                }

                res.status(200).json({
                    message: 'PDF generated and uploaded successfully',
                    url: result.secure_url,
                });
            }
        ).end(pdfBuffer);

    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ message: 'Error generating PDF', error: error.message });
    }
};
