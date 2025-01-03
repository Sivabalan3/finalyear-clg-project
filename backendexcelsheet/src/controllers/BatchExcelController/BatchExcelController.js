const XLSX = require("xlsx");
const BatchExcelData = require("../../Models/BatchExcelData");
const ExcelData = require("../../Models/MasterExcelData");
const pendingOrder = require("../../Models/pendingOrderData");
exports.uploadBatchExcel = async (req, res) => {
  try {
    const file = req.file;

    // Check if a batch file already exists
    const existingBatchFile = await BatchExcelData.findOne();
    if (existingBatchFile) {
      return res.status(400).json({
        message:
          "A batch file has already been uploaded. Please delete the existing file before uploading a new one.",
      });
    }

    const workbook = XLSX.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const rawWorksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 }); // Get raw data with headers as first row

    if (!rawWorksheet.length) {
      return res.status(400).json({ message: "The uploaded file is empty." });
    }

    // Clean and format headers
    const headers = rawWorksheet[0].map(header =>
      header
        .trim() // Remove leading and trailing spaces
        .replace(/[^a-zA-Z0-9\s_]/g, "") // Remove non-alphanumeric characters except spaces and underscores
        .replace(/[_\s]+(\w)/g, (_, char) => char.toUpperCase()) // Convert to camelCase and remove underscores
        .replace(/^\w/, char => char.toUpperCase()) // Capitalize the first character of the header
    );

    // Map the headers to the worksheet data
    const worksheet = rawWorksheet.slice(1).map(row => {
      const formattedRow = {};
      headers.forEach((header, index) => {
        formattedRow[header] = row[index];
      });
      return formattedRow;
    });

    const masterData = await ExcelData.find().lean();

    // Map the batch data and add MKSU field from master data if ItemCode matches, otherwise set MKSU to "INVALID"
    const batchDataWithMKSU = worksheet.map((batchRow) => {
      const batchItemCode = String(batchRow.ItemCode).trim();
      const masterRow = masterData.find(
        (masterRow) => String(masterRow.ItemCode).trim() === batchItemCode
      );

      const calculatedUom2_Piece_Qty = masterData
        .filter((master) => String(master.ItemCode).trim() === batchItemCode)
        .map((master) => {
          const preciseQty = batchRow.SaleableStock /  master.UOM2Conversion ;
          return Math.round(preciseQty * 10) / 10; // Round to 1 decimal place
        });
      if (masterRow) {
        return {
          ...batchRow,
          MKSU: masterRow.MKSU, // Add the MKSU field from master data
          UOM2_Piece_Qty: calculatedUom2_Piece_Qty,
        };
      } else {
        return {
          ...batchRow,
          MKSU: "INVALID", // Set MKSU to "INVALID" if no match is found
          UOM2_Piece_Qty: 0, // Set Qty to 0 if no match is found
        };
      }
    });

    // Insert the updated batch data into MongoDB
    const insertedData = await BatchExcelData.insertMany(batchDataWithMKSU);

    res.status(200).json(insertedData);
  } catch (error) {
    res.status(500).json({ message: "Error uploading file", error });
  }
};

exports.updateBatchExcel = async (req, res) => {
  try {
    const { updates } = req.body; // Extract updates array from the request

    if (!updates || !Array.isArray(updates)) {
      return res.status(400).json({ message: "Invalid request parameters" });
    }

    // Iterate through each update and update MongoDB
    const updatePromises = updates.map(({ id, column, value }) => {
      if (id && column && value !== undefined) {
        return BatchExcelData.updateOne(
          { _id: id },
          { $set: { [column]: value } },
          { upsert: true }
        );
      }
    });

    await Promise.all(updatePromises);

    res.status(200).json({ message: "Data updated successfully" });
  } catch (error) {
    // console.error("Error updating data", error);
    res.status(500).json({ message: "Error updating data", error });
  }
};

exports.getBatchExcelData = async (req, res) => {
  try {
    const data = await BatchExcelData.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error });
  }
};
exports.deleteBatchExcel = async (req, res) => {
  try {
    // Find and delete the existing file
    const deletedData = await BatchExcelData.deleteMany({});

    if (deletedData.deletedCount === 0) {
      return res.status(404).json({ message: "No existing file to delete" });
    }

    // Respond with a success message
    res.status(200).json({
      message: "Existing Batch file deleted successfully!",
    });
  } catch (error) {
    // console.error("Error deleting file:", error); // Log the error for debugging
    res
      .status(500)
      .json({ message: "Error deleting file", error: error.message });
  }
};
