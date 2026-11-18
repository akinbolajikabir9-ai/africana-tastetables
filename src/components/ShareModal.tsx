import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { X, Copy, Check, Smartphone, Share2 } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'send' | 'share';
}

export function ShareModal({ isOpen, onClose, initialMode }: ShareModalProps) {
  const prefersReduced = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const [recipientPhone, setRecipientPhone] = useState('');
  const [sentNotice, setSentNotice] = useState('');

  const shareText = `${RESTAURANT_INFO.fullTitle}\n${RESTAURANT_INFO.address}\nPlus Code: ${RESTAURANT_INFO.plusCode}\nPhone: ${RESTAURANT_INFO.phoneDisplay}\nDirections: ${RESTAURANT_INFO.directionsUrl}`;

  const handleCopyDetails = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: RESTAURANT_INFO.fullTitle,
          text: `${RESTAURANT_INFO.address} (${RESTAURANT_INFO.plusCode}) · Call ${RESTAURANT_INFO.phoneDisplay}`,
          url: RESTAURANT_INFO.directionsUrl,
        });
      } catch {
        // User cancelled native share
      }
    } else {
      handleCopyDetails();
    }
  };

  const handleSendSms = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = recipientPhone.replace(/[^0-9+]/g, '');
    if (cleaned.length < 10) {
      setSentNotice('Enter a valid 10+ digit phone number to compose an SMS.');
      return;
    }
    const smsHref = `sms:${cleaned}?body=${encodeURIComponent(shareText)}`;
    window.location.href = smsHref;
    setSentNotice(`SMS draft opened for ${recipientPhone}.`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-modal-title"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReduced ? 0 : 0.18 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#171513]/50 backdrop-blur-[2px]"
          />

          <motion.div
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-md rounded-xl bg-[#F7F6F2] border border-[#171513]/12 p-6 shadow-xl space-y-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="share-modal-title" className="font-display text-xl font-semibold text-[#171513]">
                  {initialMode === 'send' ? 'Send Location to Phone' : 'Share Africana'}
                </h2>
                <p className="text-xs text-[#615B53] mt-1">
                  {RESTAURANT_INFO.shortAddress} · {RESTAURANT_INFO.plusCode}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="w-9 h-9 rounded-md inline-flex items-center justify-center text-[#524D46] hover:bg-[#EAE7DF] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-lg bg-[#EAE7DF]/70 border border-[#171513]/10 text-xs text-[#3B3732] space-y-1.5">
              <p className="font-semibold text-[#171513]">{RESTAURANT_INFO.fullTitle}</p>
              <p>{RESTAURANT_INFO.address}</p>
              <p className="tabular-nums">
                Plus Code: {RESTAURANT_INFO.plusCode} · Tel: {RESTAURANT_INFO.phoneDisplay}
              </p>
            </div>

            <form onSubmit={handleSendSms} className="space-y-2.5">
              <label htmlFor="send-phone-input" className="block text-xs font-medium text-[#524D46]">
                Send directions via SMS
              </label>
              <div className="flex gap-2">
                <input
                  id="send-phone-input"
                  type="tel"
                  value={recipientPhone}
                  onChange={(e) => {
                    setRecipientPhone(e.target.value);
                    setSentNotice('');
                  }}
                  placeholder="0703 116 8708"
                  className="flex-1 px-3.5 py-2 text-sm rounded-md bg-white border border-[#171513]/15 text-[#171513] placeholder:text-[#8E867B] focus:outline-none focus:ring-2 focus:ring-[#1A4D33]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-[#1A4D33] hover:bg-[#143D28] text-[#F7F6F2] text-sm font-medium inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  <Smartphone className="w-4 h-4" />
                  Send SMS
                </button>
              </div>
              {sentNotice && <p className="text-xs text-[#1A4D33] font-medium">{sentNotice}</p>}
            </form>

            <div className="pt-2 border-t border-[#171513]/10 flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={handleCopyDetails}
                className="flex-1 py-2.5 px-4 rounded-md border border-[#171513]/15 hover:bg-[#EAE7DF] text-sm font-medium text-[#171513] inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-[#1A4D33]" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied Details' : 'Copy Address & Code'}
              </button>
              <button
                type="button"
                onClick={handleNativeShare}
                className="py-2.5 px-4 rounded-md border border-[#171513]/15 hover:bg-[#EAE7DF] text-sm font-medium text-[#171513] inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
