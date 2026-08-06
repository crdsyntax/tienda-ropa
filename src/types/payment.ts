export type PaymentMethodId = 'cash' | 'transferencia' | 'zelle' | 'pagoMovil' | 'binance' | 'paypal';

export interface PaymentFieldDef {
  key: string;
  label: string;
  placeholder?: string;
  required: boolean;
}

export interface PaymentMethodDef {
  id: PaymentMethodId;
  label: string;
  description: string;
  merchantFields: PaymentFieldDef[];
  userFields: PaymentFieldDef[];
}

export const PAYMENT_METHODS: PaymentMethodDef[] = [
  {
    id: 'cash',
    label: 'Pago contra entrega',
    description: 'Pagas en efectivo al recibir tu pedido o al recogerlo en tienda.',
    merchantFields: [],
    userFields: [],
  },
  {
    id: 'transferencia',
    label: 'Transferencia bancaria',
    description: 'Realizas una transferencia a la cuenta del comerciante.',
    merchantFields: [
      { key: 'bank', label: 'Banco', required: true },
      { key: 'account', label: 'Cuenta / CLABE', required: true },
      { key: 'holder', label: 'Titular', required: true },
      { key: 'referenceLabel', label: 'Referencia sugerida', placeholder: 'Ej: Coloca tu número de pedido', required: false },
    ],
    userFields: [
      { key: 'reference', label: 'Número de referencia / comprobante', placeholder: 'Ej: 500012345', required: true },
    ],
  },
  {
    id: 'zelle',
    label: 'Zelle',
    description: 'Envías el pago por Zelle al correo del comerciante.',
    merchantFields: [
      { key: 'email', label: 'Correo Zelle', required: true },
      { key: 'holder', label: 'Titular', required: true },
    ],
    userFields: [
      { key: 'transactionId', label: 'ID de transacción', placeholder: 'Ej: ZLL-99887766', required: true },
    ],
  },
  {
    id: 'pagoMovil',
    label: 'Pago Móvil',
    description: 'Pagas desde tu banca móvil al número registrado.',
    merchantFields: [
      { key: 'phone', label: 'Teléfono / banco', required: true },
      { key: 'holder', label: 'Titular', required: true },
      { key: 'referenceLabel', label: 'Referencia sugerida', required: false },
    ],
    userFields: [
      { key: 'reference', label: 'Número de referencia', placeholder: 'Ej: 12345678', required: true },
      { key: 'originBank', label: 'Banco de origen', required: true },
    ],
  },
  {
    id: 'binance',
    label: 'Binance',
    description: 'Pagas con tu wallet (USDT/BTC) a la dirección del comerciante.',
    merchantFields: [
      { key: 'wallet', label: 'Dirección / Wallet', required: true },
      { key: 'network', label: 'Red (BEP-20, TRC-20...)', required: false },
    ],
    userFields: [
      { key: 'transactionId', label: 'TxID / ID de la transferencia', required: true },
    ],
  },
  {
    id: 'paypal',
    label: 'PayPal',
    description: 'Pagas con PayPal al correo del comerciante.',
    merchantFields: [
      { key: 'email', label: 'Correo PayPal', required: true },
      { key: 'holder', label: 'Titular', required: true },
    ],
    userFields: [
      { key: 'email', label: 'Correo usado en PayPal', required: true },
      { key: 'transactionId', label: 'ID de transacción', required: true },
    ],
  },
];

export type MethodFields = Record<string, string>;
export type MethodsData = Record<PaymentMethodId, MethodFields>;

export interface MerchantPaymentSettings {
  enabledMethods: Record<PaymentMethodId, boolean>;
  data: MethodsData;
}

export const DEFAULT_MERCHANT_PAYMENT: MerchantPaymentSettings = {
  enabledMethods: {
    cash: true,
    transferencia: true,
    zelle: true,
    pagoMovil: true,
    binance: true,
    paypal: true,
  },
  data: {
    cash: {},
    transferencia: {},
    zelle: {},
    pagoMovil: {},
    binance: {},
    paypal: {},
  },
};

export function getMethodDef(id: PaymentMethodId): PaymentMethodDef {
  return PAYMENT_METHODS.find((m) => m.id === id) ?? PAYMENT_METHODS[0];
}