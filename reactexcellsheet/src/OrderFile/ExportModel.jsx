// ExportModal.js
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { PDFDocument, rgb } from 'pdf-lib';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const ExportModal = ({ isOpen, onClose, onExport }) => {
  const [fileName, setFileName] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [purchaseOrderNumber, setPurchaseOrderNumber] = useState('');
  const [purchaseOrderDate, setPurchaseOrderDate] = useState('');

  const handleExport = async () => {
    if (!fileName  || !purchaseOrderNumber || !purchaseOrderDate) {
      Swal.fire('Error', 'Please fill all fields.', 'error');
      return;
    }

    // Call the export function to create the PDF with the entered details
    await onExport(fileName, selectedType, purchaseOrderNumber, purchaseOrderDate);

    // Close the modal after export
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[99999] bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out scale-95 hover:scale-100 w-96 z-50">
        <h2 className="text-2xl font-semibold text-gray-800">Export Data</h2>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-600">Purchase Order Number:</label>
          <input
            type="text"
            className="mt-2 p-3 border border-gray-300 rounded-lg w-full transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={purchaseOrderNumber}
            onChange={(e) => setPurchaseOrderNumber(e.target.value)}
            placeholder="Enter PO Number"
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-600">Purchase Order Date:</label>
          <input
            type="date"
            className="mt-2 p-3 border border-gray-300 rounded-lg w-full transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={purchaseOrderDate}
            onChange={(e) => setPurchaseOrderDate(e.target.value)}
          />
        </div>
        {/* <div className="mt-4">
          <label className="block text-sm font-medium text-gray-600">Select Type:</label>
          <select
            className="mt-2 p-3 border border-gray-300 rounded-lg w-full transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">Select One Value</option>
            <option value="DMart">DMart</option>
            <option value="Spaar">Spaar</option>
            <option value="c">c</option>
            <option value="d">d</option>
          </select>
        </div> */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-600">File Name:</label>
          <input
            type="text"
            className="mt-2 p-3 border border-gray-300 rounded-lg w-full transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Enter file name"
          />
        </div>
        <div className="mt-6 flex justify-around">
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-lg transition duration-150 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleExport}
          >
            Export
          </button>
          <button
            className="px-6 py-2 bg-gray-300 text-black rounded-lg ml-4 transition duration-150 ease-in-out hover:bg-gray-400 focus:outline-none"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
