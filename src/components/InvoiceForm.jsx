import React, { useState } from 'react';
import { Form, Button, Row, Col, Table } from 'react-bootstrap';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { PDFDocument } from './PDFDocument';
import { PDFErrorBoundary } from './PDFErrorBoundary';
import './InvoiceForm.css';

const InvoiceForm = () => {
  const [supplierInfo, setSupplierInfo] = useState('');
  const [clientInfo, setClientInfo] = useState('');
  const [invoiceDetails, setInvoiceDetails] = useState({
    invoiceNumber: '',
    date: ''
  });

  const [logo, setLogo] = useState(null);
  const [currency, setCurrency] = useState('USD');

  const [columns, setColumns] = useState([
    { key: 'description', label: 'Item' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'price', label: 'Unit Price' }
  ]);

  const [items, setItems] = useState([
    { description: '', quantity: '', price: '' }
  ]);

  const currencySymbols = {
    USD: '$',
    EUR: '€',
    KES: 'ksh',
    GBP: '£',
    INR: '₹',
    JPY: '¥'
  };

  const handleInputChange = (index, key, value) => {
    const updatedItems = [...items];
    updatedItems[index][key] = value;
    setItems(updatedItems);
  };

  const handleAddRow = () => {
    const newItem = {};
    columns.forEach(col => {
      newItem[col.key] = '';
    });
    setItems([...items, newItem]);
  };

  const handleAddColumn = () => {
    const key = prompt('Enter column key (e.g., material):');
    const label = prompt('Enter column label (e.g., Material):');
    if (!key || !label) return;

    const newColumn = { key, label };
    const updatedColumns = [newColumn, ...columns];
    const updatedItems = items.map(item => ({
      [key]: '',
      ...item
    }));

    setColumns(updatedColumns);
    setItems(updatedItems);
  };

  const handleRemoveColumn = (columnKey) => {
    if (columns.length <= 1) {
      alert("You must keep at least one column");
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to remove this column?`);
    if (!confirmed) return;

    const updatedColumns = columns.filter(col => col.key !== columnKey);
    const updatedItems = items.map(item => {
      const newItem = {};
      updatedColumns.forEach(col => {
        newItem[col.key] = item[col.key] || '';
      });
      return newItem;
    });

    setColumns(updatedColumns);
    setItems(updatedItems);
  };

  const handleRemoveRow = (index) => {
    if (items.length <= 1) {
      alert("You must keep at least one row");
      return;
    }

    const confirmed = window.confirm('Are you sure you want to remove this row?');
    if (!confirmed) return;

    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogo(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      const quantity = parseFloat(item.quantity || 0);
      const price = parseFloat(item.price || 0);
      return sum + (quantity * price);
    }, 0).toFixed(2);
  };

  return (
    <div className="invoice-form">
      <div className="invoice-preview p-4 mb-4">
        <h2 className="text-center mb-4">Invoice Generator</h2>

        {/* Logo and Currency */}
        <Row className="mb-4">
          <Col md={6}>
            <Form.Group controlId="logoUpload" className="mb-3">
              <Form.Label className="fw-bold">Upload Company Logo</Form.Label>
              <Form.Control 
                type="file" 
                accept="image/*" 
                onChange={handleLogoUpload}
                className="border-secondary"
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Currency</Form.Label>
              <Form.Select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)}
                className="border-secondary"
              >
                <option value="USD">USD - $</option>
                <option value="EUR">EUR - €</option>
                <option value="KES">KES - ksh</option>
                <option value="GBP">GBP - £</option>
                <option value="INR">INR - ₹</option>
                <option value="JPY">JPY - ¥</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* Supplier and Client Info */}
        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">Supplier Information</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={supplierInfo}
            onChange={(e) => setSupplierInfo(e.target.value)}
            placeholder="Enter supplier name, address, contact info..."
            className="border-secondary"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">Client Information</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={clientInfo}
            onChange={(e) => setClientInfo(e.target.value)}
            placeholder="Enter client name, address, contact info..."
            className="border-secondary"
          />
        </Form.Group>

        {/* Invoice Details */}
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-bold">Invoice Number</Form.Label>
              <Form.Control
                type="text"
                value={invoiceDetails.invoiceNumber}
                onChange={(e) =>
                  setInvoiceDetails({ ...invoiceDetails, invoiceNumber: e.target.value })
                }
                placeholder="INV-001"
                className="border-secondary"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-bold">Date</Form.Label>
              <Form.Control
                type="date"
                value={invoiceDetails.date}
                onChange={(e) =>
                  setInvoiceDetails({ ...invoiceDetails, date: e.target.value })
                }
                className="border-secondary"
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Table Controls */}
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <Button variant="primary" onClick={handleAddRow} className="me-2">
            Add Item
          </Button>
          <Button variant="secondary" onClick={handleAddColumn}>
            Add Column
          </Button>
        </div>

        {/* Items Table */}
        <div className="table-responsive">
          <Table bordered className="mb-4">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key}>
                    {col.label}
                    {columns.length > 1 && (
                      <Button 
                        variant="link" 
                        size="sm" 
                        onClick={() => handleRemoveColumn(col.key)}
                        className="text-danger p-0 ms-2"
                        title={`Remove ${col.label} column`}
                      >
                        ×
                      </Button>
                    )}
                  </th>
                ))}
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, rowIdx) => (
                <tr key={rowIdx}>
                  {columns.map((col) => (
                    <td key={`${rowIdx}-${col.key}`}>
                      <Form.Control
                        type={col.key === 'quantity' || col.key === 'price' ? 'number' : 'text'}
                        value={item[col.key] || ''}
                        onChange={(e) => handleInputChange(rowIdx, col.key, e.target.value)}
                        placeholder={`Enter ${col.label.toLowerCase()}`}
                        className="border-secondary"
                      />
                    </td>
                  ))}
                  <td className="text-end">
                    {currencySymbols[currency]}
                    {(
                      (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0)
                    ).toFixed(2)}
                  </td>
                  <td>
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => handleRemoveRow(rowIdx)}
                      disabled={items.length <= 1}
                      title="Remove this item"
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Grand Total and PDF Download */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0">
            Grand Total: {currencySymbols[currency]} {calculateTotal()}
          </h5>
          <PDFErrorBoundary>
            <PDFDownloadLink
              document={
                <PDFDocument
                  supplierInfo={supplierInfo}
                  clientInfo={clientInfo}
                  invoiceDetails={invoiceDetails}
                  items={items}
                  columns={columns}
                  logo={logo}
                  currency={currencySymbols[currency]}
                  grandTotal={calculateTotal()}
                />
              }
              fileName={`invoice_${invoiceDetails.invoiceNumber || 'unnamed'}.pdf`}
            >
              {({ loading }) => (
                <Button variant="success" disabled={loading} className="px-4">
                  {loading ? 'Generating PDF...' : 'Download PDF'}
                </Button>
              )}
            </PDFDownloadLink>
          </PDFErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
