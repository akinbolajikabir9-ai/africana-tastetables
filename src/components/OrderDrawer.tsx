import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { X, Plus, Minus, Trash2, CheckCircle2, MessageCircle } from 'lucide-react';
import {
  MenuItem,
  RESTAURANT_INFO,
  ServiceMode,
  formatNaira,
} from '../data/restaurantData';

export interface CartEntry {
  item: MenuItem;
  quantity: number;
}

interface OrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartEntry[];
  serviceMode: ServiceMode;
  onServiceModeChange: (mode: ServiceMode) => void;
  onUpdateQty: (id: string, delta: number) => void;
  onClearCart: () => void;
}

interface ConfirmedOrder {
  orderCode: string;
  customerName: string;
  phone: string;
  serviceMode: ServiceMode;
  locationNote: string;
  total: number;
  itemsSummary: string;
}

export function OrderDrawer({
  isOpen,
  onClose,
  cart,
  serviceMode,
  onServiceModeChange,
  onUpdateQty,
  onClearCart,
}: OrderDrawerProps) {
  const prefersReduced = useReducedMotion();
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [locationNote, setLocationNote] = useState('');
  const [formError, setFormError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(null);

  const subtotal = cart.reduce(
    (sum, entry) => sum + entry.item.priceNaira * entry.quantity,
    0
  );
  const deliveryFee = serviceMode === 'Delivery' && subtotal > 0 ? 1000 : 0;
  const total = subtotal + deliveryFee;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!customerName.trim()) {
      setFormError('Please enter your name for the kitchen ticket.');
      return;
    }

    const cleanedPhone = phone.replace(/\s+/g, '');
    if (cleanedPhone.length < 10) {
      setFormError('Please enter a valid Nigerian mobile number (e.g. 0803 000 0000).');
      return;
    }

    if (serviceMode === 'Delivery' && !locationNote.trim()) {
      setFormError('Please provide your Akure delivery landmark or hostel/street address.');
      return;
    }

    const orderCode = `AFR-${Math.floor(1000 + Math.random() * 9000)}`;
    const itemsSummary = cart
      .map((c) => `${c.quantity}x ${c.item.name} (${formatNaira(c.item.priceNaira * c.quantity)})`)
      .join(', ');

    setConfirmedOrder({
      orderCode,
      customerName: customerName.trim(),
      phone: phone.trim(),
      serviceMode,
      locationNote: locationNote.trim(),
      total,
      itemsSummary,
    });

    onClearCart();
  };

  const resetAndClose = () => {
    setConfirmedOrder(null);
    setFormError('');
    onClose();
  };

  const buildWhatsAppLink = (order: ConfirmedOrder) => {
    const lines = [
      `Hello Africana (Tastetables_Africana),`,
      `Order Ref: ${order.orderCode}`,
      `Mode: ${order.serviceMode}`,
      `Name: ${order.customerName}`,
      `Phone: ${order.phone}`,
      order.locationNote ? `Note/Address: ${order.locationNote}` : '',
      `Items: ${order.itemsSummary}`,
      `Total: ${formatNaira(order.total)}`,
    ]
      .filter(Boolean)
      .join('\n');

    return `https://wa.me/${RESTAURANT_INFO.whatsappNumber}?text=${encodeURIComponent(lines)}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-labelledby="order-drawer-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReduced ? 0 : 0.2 }}
            onClick={resetAndClose}
            className="fixed inset-0 bg-[#171513]/50 backdrop-blur-[2px]"
          />

          {/* Slide-over panel */}
          <motion.aside
            initial={prefersReduced ? { opacity: 1 } : { x: '100%' }}
            animate={prefersReduced ? { opacity: 1 } : { x: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { x: '100%' }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-md bg-[#F7F6F2] text-[#171513] h-full flex flex-col border-l border-[#171513]/12 shadow-2xl"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-[#171513]/10 flex items-center justify-between gap-4">
              <div>
                <h2 id="order-drawer-title" className="font-display text-xl font-semibold">
                  Your Kitchen Order
                </h2>
                <p className="text-xs text-[#615B53] mt-0.5">
                  Shammall Mall, FUTA South Gate · Akure
                </p>
              </div>
              <button
                type="button"
                onClick={resetAndClose}
                aria-label="Close order drawer"
                className="w-10 h-10 rounded-md inline-flex items-center justify-center text-[#524D46] hover:bg-[#EAE7DF] hover:text-[#171513] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              {confirmedOrder ? (
                <div className="py-6 space-y-5">
                  <div className="p-5 rounded-lg bg-[#EAE7DF]/70 border border-[#171513]/10 space-y-3">
                    <div className="flex items-center gap-2.5 text-[#1A4D33]">
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                      <span className="text-sm font-semibold">
                        Order Received · {confirmedOrder.orderCode}
                      </span>
                    </div>
                    <p className="text-sm text-[#3B3732] leading-relaxed">
                      Thank you, {confirmedOrder.customerName}. Your{' '}
                      <span className="font-medium text-[#171513]">
                        {confirmedOrder.serviceMode}
                      </span>{' '}
                      request for{' '}
                      <span className="font-semibold tabular-nums text-[#171513]">
                        {formatNaira(confirmedOrder.total)}
                      </span>{' '}
                      is queued for our Akure kitchen.
                    </p>
                    <div className="pt-2 border-t border-[#171513]/10 text-xs text-[#524D46] space-y-1">
                      <p>Items: {confirmedOrder.itemsSummary}</p>
                      <p>Contact: {confirmedOrder.phone}</p>
                      {confirmedOrder.locationNote && (
                        <p>Details: {confirmedOrder.locationNote}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <a
                      href={buildWhatsAppLink(confirmedOrder)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-md bg-[#1A4D33] hover:bg-[#143D28] text-[#F7F6F2] text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Confirm via WhatsApp Kitchen Line
                    </a>
                    <button
                      type="button"
                      onClick={resetAndClose}
                      className="w-full py-2.5 px-4 rounded-md border border-[#171513]/15 hover:bg-[#EAE7DF] text-sm font-medium text-[#171513] transition-colors cursor-pointer"
                    >
                      Back to Menu
                    </button>
                  </div>
                </div>
              ) : cart.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <p className="font-display text-lg font-medium text-[#171513]">
                    Your order tray is empty
                  </p>
                  <p className="text-sm text-[#615B53] max-w-xs mx-auto">
                    Select smoky Jollof, Ondo pounded yam, or grilled suya platters from the menu to start.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-2 inline-flex items-center justify-center px-5 py-2.5 rounded-md bg-[#1A4D33] text-[#F7F6F2] text-sm font-medium hover:bg-[#143D28] transition-colors cursor-pointer"
                  >
                    Browse Menu
                  </button>
                </div>
              ) : (
                <>
                  {/* Service Mode Selector */}
                  <div>
                    <span className="block text-xs font-medium text-[#615B53] mb-2">
                      Fulfillment method
                    </span>
                    <div className="grid grid-cols-3 gap-1 p-1 bg-[#EAE7DF] rounded-lg">
                      {RESTAURANT_INFO.serviceOptions.map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => onServiceModeChange(mode)}
                          className={`py-2 px-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                            serviceMode === mode
                              ? 'bg-[#F7F6F2] text-[#171513] shadow-sm'
                              : 'text-[#524D46] hover:text-[#171513]'
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Line items */}
                  <ul className="divide-y divide-[#171513]/10">
                    {cart.map(({ item, quantity }) => (
                      <li key={item.id} className="py-4 flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-[#171513] leading-snug">
                            {item.name}
                          </h3>
                          <p className="text-xs text-[#615B53] mt-0.5 tabular-nums">
                            {formatNaira(item.priceNaira)} each
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <div className="inline-flex items-center border border-[#171513]/15 rounded-md bg-[#F7F6F2]">
                            <button
                              type="button"
                              aria-label={`Decrease quantity of ${item.name}`}
                              onClick={() => onUpdateQty(item.id, -1)}
                              className="w-8 h-8 inline-flex items-center justify-center text-[#524D46] hover:text-[#171513] cursor-pointer"
                            >
                              {quantity === 1 ? (
                                <Trash2 className="w-3.5 h-3.5" />
                              ) : (
                                <Minus className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <span className="w-7 text-center text-xs font-semibold tabular-nums">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              aria-label={`Increase quantity of ${item.name}`}
                              onClick={() => onUpdateQty(item.id, 1)}
                              className="w-8 h-8 inline-flex items-center justify-center text-[#524D46] hover:text-[#171513] cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* Totals */}
                  <div className="pt-4 border-t border-[#171513]/10 space-y-2 text-sm">
                    <div className="flex justify-between text-[#524D46]">
                      <span>Subtotal</span>
                      <span className="tabular-nums font-medium">{formatNaira(subtotal)}</span>
                    </div>
                    {serviceMode === 'Delivery' && (
                      <div className="flex justify-between text-[#524D46]">
                        <span>Akure Dispatch Rider</span>
                        <span className="tabular-nums font-medium">{formatNaira(deliveryFee)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-base font-semibold text-[#171513] pt-2 border-t border-[#171513]/10">
                      <span>Total</span>
                      <span className="tabular-nums">{formatNaira(total)}</span>
                    </div>
                  </div>

                  {/* Guest Checkout Form */}
                  <form onSubmit={handleSubmitOrder} className="space-y-4 pt-2">
                    <div>
                      <label htmlFor="order-name" className="block text-xs font-medium text-[#524D46] mb-1.5">
                        Full Name
                      </label>
                      <input
                        id="order-name"
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Adebayo Kunle"
                        className="w-full px-3.5 py-2.5 text-sm rounded-md bg-white border border-[#171513]/15 text-[#171513] placeholder:text-[#8E867B] focus:outline-none focus:ring-2 focus:ring-[#1A4D33]"
                      />
                    </div>

                    <div>
                      <label htmlFor="order-phone" className="block text-xs font-medium text-[#524D46] mb-1.5">
                        Phone Number
                      </label>
                      <input
                        id="order-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 0803 123 4567"
                        className="w-full px-3.5 py-2.5 text-sm rounded-md bg-white border border-[#171513]/15 text-[#171513] placeholder:text-[#8E867B] focus:outline-none focus:ring-2 focus:ring-[#1A4D33]"
                      />
                    </div>

                    <div>
                      <label htmlFor="order-note" className="block text-xs font-medium text-[#524D46] mb-1.5">
                        {serviceMode === 'Delivery'
                          ? 'Akure Delivery Address / Landmark'
                          : serviceMode === 'Drive-through'
                            ? 'Vehicle Color / Arrival Time (optional)'
                            : 'Dining Arrival Time / Spice Note (optional)'}
                      </label>
                      <input
                        id="order-note"
                        type="text"
                        value={locationNote}
                        onChange={(e) => setLocationNote(e.target.value)}
                        placeholder={
                          serviceMode === 'Delivery'
                            ? 'e.g. FUTA South Gate, beside Apex Lodge'
                            : serviceMode === 'Drive-through'
                              ? 'e.g. Silver Toyota, arriving in 15 mins'
                              : 'e.g. Arriving 1:30 PM, extra pepper sauce'
                        }
                        className="w-full px-3.5 py-2.5 text-sm rounded-md bg-white border border-[#171513]/15 text-[#171513] placeholder:text-[#8E867B] focus:outline-none focus:ring-2 focus:ring-[#1A4D33]"
                      />
                    </div>

                    {formError && (
                      <p role="alert" className="text-xs font-medium text-[#9B2C2C]">
                        {formError}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="w-full py-3 px-4 rounded-md bg-[#1A4D33] hover:bg-[#143D28] text-[#F7F6F2] text-sm font-medium transition-colors cursor-pointer"
                    >
                      Place {serviceMode} Order · {formatNaira(total)}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
