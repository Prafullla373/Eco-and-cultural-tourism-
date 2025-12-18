import { Parser } from "json2csv";
import PDFDocument from "pdfkit";
import Hotel from "../models/Hotel.js";
import { User } from "../models/User.js";
import { Package } from "../models/Package.js";
import { Event } from "../models/Event.js";
import { Location } from "../models/Location.js";

const getQuery = (req) => {
    const { startDate, endDate, status } = req.query;
    const query = {};
    if (startDate && endDate) {
        query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (status && status !== "all") {
        query.isApproved = status === "approved";
    }
    return query;
};

const generatePDF = (res, title, data, headers) => {
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${title.toLowerCase().replace(/\s/g, "_")}.pdf"`);

    doc.pipe(res);

    // Title
    doc.fontSize(20).font('Helvetica-Bold').text(title, { align: "center" });
    doc.moveDown();
    doc.fontSize(10).font('Helvetica').text(`Generated on: ${new Date().toLocaleDateString()}`, { align: "center" });
    doc.moveDown(2);

    if (data.length === 0) {
        doc.fontSize(14).text('No data available', { align: 'center' });
    } else {
        // Table header
        doc.fontSize(12).font('Helvetica-Bold');
        doc.text(headers.join(' | '), { underline: true });
        doc.moveDown(0.5);

        // Table rows
        doc.font('Helvetica').fontSize(10);
        data.forEach((item, i) => {
            const row = headers.map(h => {
                const val = item[h];
                return val !== undefined && val !== null ? String(val) : 'N/A';
            }).join(' | ');

            doc.text(`${i + 1}. ${row}`);
            doc.moveDown(0.3);

            // Add page break if needed
            if (doc.y > 700) {
                doc.addPage();
            }
        });
    }

    doc.end();
};

export const exportHotels = async (req, res) => {
    try {
        const query = getQuery(req);
        const hotels = await Hotel.find(query);
        const fields = ["name", "district", "location", "rating", "priceRange", "contactEmail", "isApproved"];

        if (req.query.format === "pdf") {
            return generatePDF(res, "Hotel Report", hotels, ["name", "district", "location", "rating"]);
        }

        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(hotels);
        res.header("Content-Type", "text/csv");
        res.attachment("hotels.csv");
        res.send(csv);
    } catch (error) {
        res.status(500).json({ message: "Error exporting hotels" });
    }
};

export const exportUsers = async (req, res) => {
    try {
        const query = getQuery(req);
        // User model might not have isApproved, so filter status only if applicable or ignore
        if (req.query.status) delete query.isApproved;

        const users = await User.find(query).select("-password");
        const fields = ["name", "email", "role", "mobile", "createdAt"];

        if (req.query.format === "pdf") {
            return generatePDF(res, "User Report", users, ["name", "email", "role", "mobile"]);
        }

        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(users);
        res.header("Content-Type", "text/csv");
        res.attachment("users.csv");
        res.send(csv);
    } catch (error) {
        res.status(500).json({ message: "Error exporting users" });
    }
};

export const exportPackages = async (req, res) => {
    try {
        const query = getQuery(req);
        const packages = await Package.find(query).populate("location", "name");
        const fields = ["title", "category", "durationDays", "pricePerPerson", "isApproved"];

        if (req.query.format === "pdf") {
            // Flatten location name for PDF
            const data = packages.map(p => ({ ...p.toObject(), locationName: p.location?.name }));
            return generatePDF(res, "Package Report", data, ["title", "category", "pricePerPerson", "locationName"]);
        }

        // Flatten for CSV
        const data = packages.map(p => ({ ...p.toObject(), "location.name": p.location?.name }));
        const json2csvParser = new Parser({ fields: [...fields, "location.name"] });
        const csv = json2csvParser.parse(data);
        res.header("Content-Type", "text/csv");
        res.attachment("packages.csv");
        res.send(csv);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error exporting packages" });
    }
};

export const exportEvents = async (req, res) => {
    try {
        const query = getQuery(req);
        const events = await Event.find(query);
        const fields = ["title", "date", "location", "price", "ticketsSold", "isApproved"];

        if (req.query.format === "pdf") {
            return generatePDF(res, "Event Report", events, ["title", "date", "location", "price"]);
        }

        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(events);
        res.header("Content-Type", "text/csv");
        res.attachment("events.csv");
        res.send(csv);
    } catch (error) {
        res.status(500).json({ message: "Error exporting events" });
    }
};

export const exportLocations = async (req, res) => {
    try {
        const query = getQuery(req);
        const locations = await Location.find(query);
        const fields = ["name", "type", "district", "rating", "isApproved"];

        if (req.query.format === "pdf") {
            return generatePDF(res, "Location Report", locations, ["name", "type", "district", "rating"]);
        }

        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(locations);
        res.header("Content-Type", "text/csv");
        res.attachment("locations.csv");
        res.send(csv);
    } catch (error) {
        res.status(500).json({ message: "Error exporting locations" });
    }
};
