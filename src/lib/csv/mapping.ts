type CsvCustomerRow = {
  CUST_ID: string;
  BALANCE: string;
  PURCHASES: string;
  CREDIT_LIMIT: string;
};

export function mapCsvRowToCustomer(row: CsvCustomerRow) {
  return {
    custId: row.CUST_ID,
    balance: Number.parseFloat(row.BALANCE || "0"),
    purchases: Number.parseFloat(row.PURCHASES || "0"),
    creditLimit: row.CREDIT_LIMIT ? Number.parseFloat(row.CREDIT_LIMIT) : null,
  };
}
