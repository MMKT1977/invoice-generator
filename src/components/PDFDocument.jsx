import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica'
  },
  header: { 
    marginBottom: 20,
    textAlign: 'center'
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15
  },
  logo: { 
    width: 150,
    height: 150,
    maxHeight: 80,
    marginBottom: 10
  },
  section: { marginBottom: 10 },
  row: {
    flexDirection: 'row',
    borderBottom: '1 solid #ccc',
    paddingVertical: 4
  },
  column: { flex: 1, paddingHorizontal: 4 },
  tableHeader: {
    fontWeight: 'bold',
    backgroundColor: '#eee'
  },
  totalRight: {
    textAlign: 'right',
    marginTop: 10,
    fontWeight: 'bold'
  },
  invoiceInfo: {
    marginTop: 10,
    textAlign: 'center'
  }
});

export const PDFDocument = ({ supplierInfo, clientInfo, invoiceDetails, items, columns, logo, currency, grandTotal }) => {
  const calculateRowTotal = (item) => {
    const quantity = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.price) || 0;
    return (quantity * price).toFixed(2);
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {logo && (
            <View style={styles.logoContainer}>
              <Image src={logo} style={styles.logo} />
            </View>
          )}
          <View style={styles.invoiceInfo}>
            <Text>Invoice #{invoiceDetails.invoiceNumber}</Text>
            <Text>Date: {invoiceDetails.date}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={{ fontWeight: 'bold' }}>Supplier:</Text>
          <Text>{supplierInfo}</Text>
        </View>

        <View style={styles.section}>
          <Text style={{ fontWeight: 'bold' }}>Client:</Text>
          <Text>{clientInfo}</Text>
        </View>

        {/* Table Header */}
        <View style={[styles.row, styles.tableHeader]}>
          {columns.map((col, idx) => (
            <Text key={idx} style={styles.column}>
              {col.label}
            </Text>
          ))}
          <Text style={styles.column}>Total</Text>
        </View>

        {/* Table Rows */}
        {items.map((item, idx) => (
          <View style={styles.row} key={idx}>
            {columns.map((col, idx2) => (
              <Text key={idx2} style={styles.column}>
                {item[col.key] || ''}
              </Text>
            ))}
            <Text style={styles.column}>
              {currency}{calculateRowTotal(item)}
            </Text>
          </View>
        ))}

        {/* Grand Total */}
        <View style={styles.totalRight}>
          <Text>Grand Total: {currency}{grandTotal}</Text>
        </View>
      </Page>
    </Document>
  );
};
