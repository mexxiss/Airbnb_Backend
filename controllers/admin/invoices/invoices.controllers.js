import path from 'path';
import fs from 'fs';
import pkg from '@pdftron/pdfnet-node';
const { PDFNet } = pkg;
import { fileURLToPath } from 'url';
import { options } from '../../../helpers/pdfOptions.js';
import pdf from 'pdf-creator-node';
import { cloudinary } from '../../../uploads/cloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// console.log('================================', inputPath, '================================');

export const generatePdf = async (req, res) => {
    try {
        // Paths
        const htmlPath = path.join(__dirname, '../../../public/invoice_templates/furnishing2.html');
        const html = fs.readFileSync(htmlPath, 'utf-8');

        // Generate data
        const data = req.body.data || [];
        let array = [];
        data.forEach(d => {
            const prod = {
                name: d.name,
                description: d.description,
                unit: d.unit,
                quantity: d.quantity,
                price: d.price,
                total: d.quantity * d.price,
                imgurl: d.imgurl,
            };
            array.push(prod);
        });

        let subtotal = 0;
        array.forEach(i => {
            subtotal += i.total;
        });
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
            html,
            data: { products: obj },
            path: tempPath,
        };

        // Generate PDF
        await pdf.create(document, options);

        // Read the PDF file as a Buffer
        const fileBuffer = fs.readFileSync(tempPath);

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
        ).end(fileBuffer);
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ message: 'Error generating PDF', error: error.message });
    }
};
