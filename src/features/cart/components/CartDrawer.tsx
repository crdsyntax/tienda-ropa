import { useState, useEffect, useCallback } from 'react';
import { useCart } from '../../../context/CartContext';
import { useOrders } from '../../../context/OrdersContext';
import { useMerchantPayment } from '../../../context/MerchantPaymentContext';
import { STORE_ADDRESS } from '../../../types';
import type { PaymentMethodId, PaymentFieldDef } from '../../../types/payment';
import { PAYMENT_METHODS, getMethodDef } from '../../../types/payment';
import { ProductImage } from '../../../components/ui/ProductImage';

export function CartDrawer() {
  const {
    items, removeItem, updateQuantity, totalItems, totalPrice,
    orderInfo, setOrderInfo, getDeliveryAddress,
    isCartOpen, closeCart, clearCart,
  } = useCart();
  const { registerOrder } = useOrders();
  const { settings } = useMerchantPayment();

  const [showCheckout, setShowCheckout] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');

  const availableMethods = PAYMENT_METHODS.filter((m) => settings.enabledMethods[m.id]);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodId>(() => availableMethods[0]?.id ?? 'cash');
  const [paymentUserData, setPaymentUserData] = useState<Record<string, string>>({});
  const selectedDef = getMethodDef(selectedMethod);

  useEffect(() => {
    if (availableMethods.length > 0 && !availableMethods.some((m) => m.id === selectedMethod)) {
      setSelectedMethod(availableMethods[0].id);
      setPaymentUserData({});
    }
  }, [availableMethods, selectedMethod]);

  const isPaymentValid = availableMethods.length > 0
    && selectedDef.userFields.every((f) => (paymentUserData[f.key] ?? '').trim() !== '');

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isCartOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    if (isCartOpen) window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isCartOpen, closeCart]);

  const isFormValid = orderInfo.name.trim() !== ''
    && orderInfo.phone.trim() !== ''
    && orderInfo.email.trim() !== ''
    && (orderInfo.deliveryMode === 'pickup' || orderInfo.address.trim() !== '')
    && isPaymentValid;

  const handlePlaceOrder = useCallback(() => {
    if (!isFormValid) return;
    const order = registerOrder({
      customer: orderInfo.name,
      customerEmail: orderInfo.email,
      customerPhone: orderInfo.phone,
      total: totalPrice,
      items: items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.images[0] || '',
        size: item.size,
        quantity: item.quantity,
        price: item.product.price,
      })),
      paymentMethod: selectedDef.label,
      payment: {
        methodId: selectedMethod,
        methodLabel: selectedDef.label,
        userData: paymentUserData,
      },
      address: getDeliveryAddress(),
    });
    setPlacedOrderId(order.id);
    setOrderPlaced(true);
  }, [isFormValid, registerOrder, orderInfo, totalPrice, items, selectedDef, selectedMethod, paymentUserData, getDeliveryAddress]);

  const handleSelectMethod = useCallback((id: PaymentMethodId) => {
    setSelectedMethod(id);
    setPaymentUserData({});
  }, []);

  const handlePayField = useCallback((field: PaymentFieldDef, value: string) => {
    setPaymentUserData((prev) => ({ ...prev, [field.key]: value }));
  }, []);

  const handleClose = useCallback(() => {
    closeCart();
    setTimeout(() => {
      setShowCheckout(false);
      setOrderPlaced(false);
    }, 300);
  }, [closeCart]);

  const handleNewOrder = useCallback(() => {
    clearCart();
    setShowCheckout(false);
    setOrderPlaced(false);
    handleClose();
  }, [clearCart, handleClose]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end lg:justify-center lg:items-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      <div className="relative z-10 w-full max-w-md lg:max-w-2xl bg-white h-full lg:h-auto lg:max-h-[90vh] flex flex-col shadow-2xl animate-slide-in lg:rounded-2xl">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">
            {showCheckout ? 'Finalizar pedido' : `Carrito (${totalItems})`}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Cerrar carrito"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {orderPlaced ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Pedido realizado</h3>
            <p className="text-sm font-semibold text-emerald-600 mb-1">ID: {placedOrderId}</p>
            <p className="text-slate-500 mb-1">Gracias, {orderInfo.name}.</p>
            <p className="text-sm text-slate-400 mb-6">
              {orderInfo.deliveryMode === 'delivery'
                ? `Tu pedido será enviado a: ${orderInfo.address}`
                : `Retira en: ${STORE_ADDRESS}`
              }
            </p>
            <p className="text-sm text-slate-400 mb-6">
              Total: <span className="font-bold text-slate-900">${totalPrice.toFixed(2)}</span>
            </p>
            <button
              onClick={handleNewOrder}
              className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Continuar comprando
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="text-slate-400 text-lg mb-1">Tu carrito está vacío</p>
            <p className="text-slate-300 text-sm">Agrega productos para comenzar</p>
          </div>
        ) : !showCheckout ? (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.size}`} className="flex gap-3 bg-slate-50 rounded-xl p-3">
                  <ProductImage
                    src={item.product.images[0] || ''}
                    alt={item.product.name}
                    className="w-16 h-20 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-slate-900 truncate">{item.product.name}</h4>
                    <p className="text-xs text-slate-400">Talla: {item.size}</p>
                    <p className="text-sm font-bold text-slate-900 mt-1">${item.product.price.toFixed(2)}</p>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer text-sm font-bold"
                      >
                        -
                      </button>
                      <span className="text-sm font-medium text-slate-700 w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer text-sm font-bold"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.product.id, item.size)}
                        className="ml-auto p-1.5 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                        aria-label="Eliminar"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-slate-500">Subtotal ({totalItems} items)</span>
                <span className="text-lg font-bold text-slate-900">${totalPrice.toFixed(2)}</span>
              </div>
              <button
                onClick={() => setShowCheckout(true)}
                className="w-full py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 active:bg-slate-700 transition-colors cursor-pointer"
              >
                Continuar al pedido
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-5">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Nombre completo *</label>
                <input
                  type="text"
                  value={orderInfo.name}
                  onChange={(e) => setOrderInfo({ name: e.target.value })}
                  placeholder="Juan Pérez"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Teléfono *</label>
                <input
                  type="tel"
                  value={orderInfo.phone}
                  onChange={(e) => setOrderInfo({ phone: e.target.value })}
                  placeholder="+52 55 1234 5678"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Correo electrónico *</label>
                <input
                  type="email"
                  value={orderInfo.email}
                  onChange={(e) => setOrderInfo({ email: e.target.value })}
                  placeholder="correo@ejemplo.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Método de entrega *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setOrderInfo({ deliveryMode: 'delivery' })}
                    className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      orderInfo.deliveryMode === 'delivery'
                        ? 'border-slate-900 bg-slate-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mb-1 ${orderInfo.deliveryMode === 'delivery' ? 'text-slate-900' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                    </svg>
                    <span className="text-sm font-semibold text-slate-900">Delivery</span>
                    <p className="text-xs text-slate-400 mt-0.5">A tu dirección</p>
                  </button>

                  <button
                    onClick={() => setOrderInfo({ deliveryMode: 'pickup' })}
                    className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      orderInfo.deliveryMode === 'pickup'
                        ? 'border-slate-900 bg-slate-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mb-1 ${orderInfo.deliveryMode === 'pickup' ? 'text-slate-900' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm font-semibold text-slate-900">Pick Up</span>
                    <p className="text-xs text-slate-400 mt-0.5">En tienda</p>
                  </button>
                </div>
              </div>

              {orderInfo.deliveryMode === 'delivery' ? (
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Dirección de entrega *</label>
                  <textarea
                    value={orderInfo.address}
                    onChange={(e) => setOrderInfo({ address: e.target.value })}
                    placeholder="Calle, número, colonia, código postal..."
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all resize-none"
                  />
                </div>
              ) : (
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-200 rounded-lg flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">CottonShop - Sede Principal</p>
                      <p className="text-sm text-slate-500 mt-0.5">{STORE_ADDRESS}</p>
                      <p className="text-xs text-slate-400 mt-1">Horario: Lun-Sáb 10:00 - 20:00</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Método de pago *</label>
                {availableMethods.length === 0 ? (
                  <p className="text-xs text-slate-400 bg-slate-50 rounded-xl p-3 border border-slate-200">
                    No hay métodos de pago habilitados por el momento.
                  </p>
                ) : (
                  <select
                    value={selectedMethod}
                    onChange={(e) => handleSelectMethod(e.target.value as PaymentMethodId)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all cursor-pointer"
                  >
                    {availableMethods.map((method) => (
                      <option key={method.id} value={method.id}>
                        {method.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {availableMethods.length > 0 && selectedDef.merchantFields.length > 0 && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Datos de pago del comerciante</h4>
                  <dl className="space-y-1.5 text-sm">
                    {selectedDef.merchantFields
                      .filter((f) => (settings.data[selectedMethod]?.[f.key] ?? '').trim() !== '')
                      .map((f) => (
                        <div key={f.key} className="flex justify-between gap-2">
                          <dt className="text-slate-500">{f.label}</dt>
                          <dd className="font-medium text-slate-900 text-right">{settings.data[selectedMethod]?.[f.key]}</dd>
                        </div>
                      ))}
                  </dl>
                  {!selectedDef.merchantFields.some((f) => (settings.data[selectedMethod]?.[f.key] ?? '').trim() !== '') && (
                    <p className="text-xs text-slate-400">El comerciante no ha registrado los datos de este método aún.</p>
                  )}
                </div>
              )}

              {availableMethods.length > 0 && selectedDef.userFields.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Registro de pago *</label>
                  <div className="space-y-4">
                    {selectedDef.userFields.map((field) => (
                      <div key={field.key}>
                        <label className="text-sm font-medium text-slate-700 mb-1 block">
                          {field.label} *
                        </label>
                        <input
                          type="text"
                          value={paymentUserData[field.key] ?? ''}
                          onChange={(e) => handlePayField(field, e.target.value)}
                          placeholder={field.placeholder}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-slate-200 p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-medium text-slate-900">${totalPrice.toFixed(2)}</span>
              </div>
              {orderInfo.deliveryMode === 'delivery' && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Envío</span>
                  <span className="font-medium text-emerald-600">Gratis</span>
                </div>
              )}
              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="font-semibold text-slate-900">Total</span>
                <span className="text-lg font-bold text-slate-900">${totalPrice.toFixed(2)}</span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={!isFormValid}
                className={`w-full py-3 rounded-xl font-semibold transition-all cursor-pointer ${
                  isFormValid
                    ? 'bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-700'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Realizar pedido
              </button>

              <button
                onClick={() => setShowCheckout(false)}
                className="w-full py-2.5 text-sm text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
              >
                Volver al carrito
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
