const Dmart = require("../../Models/Article/DmartArticle");
const XLSX = require("xlsx");
const SparModel = require("../../Models/Article/SparArticle");
const fs = require("fs");

exports.ArticleUploadController = async (req, res) => {
  try {
    const { articleType } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    // Read the uploaded Excel file
    const workBook = XLSX.readFile(file.path);
    const sheetName = workBook.SheetNames[0];
    const worksheet = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName], { header: 1 });

    // Clean and format headers
    const headers = worksheet[0].map(header =>
      header
        .trim() // Remove leading and trailing spaces
        .replace(/[^a-zA-Z0-9]/g, "") // Remove non-alphanumeric characters like `%`
        .replace(/\s+(\w)/g, (_, char) => char.toUpperCase()) // Convert to camelCase
    );

    // Convert rows to objects with cleaned headers
    const data = worksheet.slice(1).map(row => {
      const rowData = {};
      headers.forEach((header, index) => {
        rowData[header] = row[index];
      });
      return rowData;
    });

    // Process data based on the article type
    if (articleType === "D-mart") {
      await Dmart.insertMany(data);
    } else if (articleType === "Spaar") {
      await SparModel.insertMany(data);
    } else {
      return res.status(400).json({ message: "Invalid article type." });
    }

    // Delete the file after processing
    fs.unlinkSync(file.path);

    return res.status(200).json({
      message: "File uploaded and data inserted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while processing the file.",
      error,
    });
  }
};

exports.getArticleFile = async (req, res) => {
  try {
    const { articleType } = req.params;
    const DmartData = await Dmart.find({});
    const SparData = await SparModel.find({});
    if (articleType === "D-mart") {
      res.status(200).json(DmartData);
    } else if (articleType === "Spaar") {
      res.status(200).json(SparData);
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error });
  }
};


exports.deleteArticles = async (req, res) => {
  try {
    const { articleType } = req.params;

    if (articleType === "D-mart") {
      await Dmart.deleteMany({}); 
    } else if (articleType === "Spaar") {
      await SparModel.deleteMany({}); 
    } else {
      return res.status(400).json({ message: "Invalid article type." });
    }

    return res.status(200).json({ message: `${articleType} articles deleted successfully.` });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting articles", error });
  }
};