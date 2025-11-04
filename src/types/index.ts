export type MonthProps = {
  month: string;
  templeDue: number;
  loanDue: number;
  templePayment: number;
  loanPayment: number;
  available: number;
  paidTotal: number;
  supportFund?: number;
};

export type PixProps = {
  key: string;
  qrcodeValue: string;
};

export type Props = {
  churchName: string;
  templeImage: string;
  pix: PixProps;
  entryValue: number;
  totalValue: number;
  updatedAt: string;
  months: MonthProps[];
};
