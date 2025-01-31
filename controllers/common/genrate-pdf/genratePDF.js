import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Correct path to the invoice templates directory
const templatesDir = path.resolve(
  __dirname,
  "../../../public/invoice_templates"
);

// Function to get the correct template file
const getTemplate = (type) => {
  const templates = {
    maintenance: "furnishing2.html",
    statement: "statement.html",
    furnishing: "furnishing.html",
  };
  return templates[type] || templates.statement; // Default to statement template
};

export const generatePdf = async (req, res) => {
  try {
    const { type, data } = req.body; // Get type and data from request
    const templateFile = getTemplate(type);
    const templatePath = path.join(templatesDir, templateFile);

    // Check if the file exists before reading
    if (!fs.existsSync(templatePath)) {
      return res.status(404).json({
        error: `Template ${templateFile} not found at ${templatePath}`,
      });
    }

    // Read the HTML template
    const templateHtml = fs.readFileSync(templatePath, "utf8");

    // Compile Handlebars template with data
    const template = handlebars.compile(templateHtml);
    const compiledHtml = template(data);

    // Launch Puppeteer and generate PDF
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setContent(compiledHtml, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ format: "A4" });

    await browser.close();

    // Send the PDF as a response
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${type}.pdf`,
    });
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};
