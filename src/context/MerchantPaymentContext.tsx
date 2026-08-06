import { createContext, useContext, useCallback, type ReactNode } from "react";
import type { MerchantPaymentSettings } from "../types/payment";
import { DEFAULT_MERCHANT_PAYMENT } from "../types/payment";
import { useLocalStorage } from "../hooks/useLocalStorage";

const PAYMENT_KEY = "cottonshop_payment_v2";

interface MerchantPaymentContextType {
  settings: MerchantPaymentSettings;
  setSettings: (settings: MerchantPaymentSettings) => void;
}
const MerchantPaymentContext = createContext<MerchantPaymentContextType | null>(
  null,
);
export function MerchantPaymentProvider({ children }: { children: ReactNode }) {
  const { value: settings, setValue } =
    useLocalStorage<MerchantPaymentSettings>(
      PAYMENT_KEY,
      DEFAULT_MERCHANT_PAYMENT,
    );
  const setSettings = useCallback(
    (next: MerchantPaymentSettings) => {
      setValue(next);
    },
    [setValue],
  );
  return (
    <MerchantPaymentContext.Provider value={{ settings, setSettings }}>
      {children}
    </MerchantPaymentContext.Provider>
  );
}

export function useMerchantPayment(): MerchantPaymentContextType {
  const context = useContext(MerchantPaymentContext);
  if (!context) {
    throw new Error(
      "useMerchantPayment debe usarse dentro de un MerchantPaymentProvider",
    );
  }
  return context;
}
