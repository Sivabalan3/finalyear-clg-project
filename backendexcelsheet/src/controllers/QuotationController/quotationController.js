const DmartQutation = require("../../Models/Qutations/DmartQuotationData");
const SparQutation = require("../../Models/Qutations/SparQutation");
const XLSX = require("xlsx");
const fs = require('fs');


exports.QutationUpload = async (req, res) => {
  try {
    const { QutationType } = req.params;
    const file = req.file;

    // Check if a file was uploaded
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Read the uploaded Excel file
    const workbook = XLSX.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

    // Clean and format headers
    const headers = worksheet[0].map(header =>
      header
        .trim() // Remove leading and trailing spaces
        .replace(/[^a-zA-Z0-9]/g, "") // Remove non-alphanumeric characters like `%`
        .replace(/\s+(\w)/g, (_, char) => char.toUpperCase()) // Convert to camelCase
    );

    // Convert rows to objects with formatted headers
    const data = worksheet.slice(1).map(row => {
      const rowData = {};
      headers.forEach((header, index) => {
        rowData[header] = row[index];
      });
      return rowData;
    });

    // Process the data based on QutationType
    if (QutationType === "D-martqutation") {
      await DmartQutation.insertMany(data);
      res.status(200).json({ message: "D-MART Qutation uploaded successfully!" });
    } else if (QutationType === "SPAR-qutation") {
      // Add logic for SPAR Qutation if necessary
      res.status(200).json({ message: "SPAR Qutation processing complete!" });
    } else {
      return res.status(400).json({ message: "Invalid QutationType provided" });
    }

    // Delete the uploaded file
    fs.unlink(file.path, (err) => {
      if (err) {
        console.error("Error removing file:", err);
      }
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: "Error uploading Qutation", error });
  }
};
exports.getQutationsByType = async (req, res) => {
  try {
    const { QutationType } = req.params;
    // console.log("qutationtype",QutationType)
    const DmartData = await DmartQutation.find({});
    const SparData = await SparQutation.find({});
    if (QutationType === "D-martqutation") {
      res.status(200).json(DmartData);
    } else if (QutationType === "SPAR-qutation") {  // Fixed the comparison
      res.status(200).json(SparData);
      // res.status(200).json(SparData);
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error });
  }
};



exports.deleteAllQutations = async (req, res) => {
  try {
    // Delete all documents from both collections
    const dMartResult = await DmartQutation.deleteMany({});
    const sparResult = await SparQutation.deleteMany({});

    res.status(200).json({ 
      message: "All quotations deleted successfully", 
      dMartResult, 
      sparResult 
    });
  } catch (error) {
    // console.error("Error deleting quotations:", error);
    res.status(500).json({ message: "Failed to delete all quotations", error });
  }
};