export type InvoiceDirection = "sold" | "purchase";

export type InvoiceModeId = InvoiceDirection;

export type InvoiceMode = {
  id: InvoiceModeId;
  label: string;
  shortLabel: string;
  description: string;
  direction: InvoiceDirection;
};
