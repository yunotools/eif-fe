"use client";

import { useCallback, useReducer } from "react";
import { currentMonthDateRange } from "@global/utils/date";
import {
  EMPTY_FILTER_FORM,
  type InvoiceFilterFormState,
} from "@modules/hoadondientu.gdt.gov.vn/lib/mappers";

type FilterAction =
  | { type: "CHANGE"; field: keyof InvoiceFilterFormState; value: string }
  | { type: "RESET"; from: string; to: string };

function createInitialState(): InvoiceFilterFormState {
  const range = currentMonthDateRange();
  return {
    ...EMPTY_FILTER_FORM,
    from_date: range.from,
    to_date: range.to,
  };
}

function reducer(state: InvoiceFilterFormState, action: FilterAction): InvoiceFilterFormState {
  switch (action.type) {
    case "CHANGE":
      return { ...state, [action.field]: action.value };
    case "RESET":
      return {
        ...EMPTY_FILTER_FORM,
        from_date: action.from,
        to_date: action.to,
      };
  }
}

export function useInvoiceFilterForm() {
  const [form, dispatch] = useReducer(reducer, undefined, createInitialState);

  const change = useCallback((field: keyof InvoiceFilterFormState, value: string) => {
    dispatch({ type: "CHANGE", field, value });
  }, []);

  const reset = useCallback(() => {
    const range = currentMonthDateRange();
    dispatch({ type: "RESET", from: range.from, to: range.to });
  }, []);

  return { form, change, reset };
}
