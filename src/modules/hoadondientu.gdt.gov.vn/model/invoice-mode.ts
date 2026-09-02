export type InvoiceDirection = "sold" | "purchase";
export type InvoiceChannel = "standard" | "sco";

export type InvoiceModeId =
  | "standard-sold"
  | "standard-purchase"
  | "sco-sold"
  | "sco-purchase";

export type InvoiceMode = {
  id: InvoiceModeId;
  label: string;
  shortLabel: string;
  description: string;
  direction: InvoiceDirection;
  channel: InvoiceChannel;
  sco: boolean;
};
