export type Month = {
  month: string;
  templeDue: number;
  loanDue: number;
  templePayment: number;
  loanPayment: number;
  available: number;
  paidTotal: number;
  supportFund?: number;
};

export type Data = {
  months: Month[];
  updatedAt: string;
};
