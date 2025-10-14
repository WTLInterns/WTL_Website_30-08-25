"use client";

import React, { useState, useEffect } from "react";
import InquiryForm from "./InquiryForm";

interface InquiryPopupProps {
  serviceName: string;
  serviceSlug: string;
  isOpen?: boolean;
  onClose?: () => void;
}

const InquiryPopup: React.FC<InquiryPopupProps> = ({ serviceName, serviceSlug, isOpen, onClose }) => {
  // If isOpen/onClose are provided, use them; otherwise, fallback to internal state and auto-open after 2s
  const [internalOpen, setInternalOpen] = useState(false);

  useEffect(() => {
    if (isOpen === undefined) {
      const timer = setTimeout(() => {
        setInternalOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setInternalOpen(false);
    }
  };

  return (
    <InquiryForm
      isOpen={isOpen !== undefined ? isOpen : internalOpen}
      onClose={handleClose}
      serviceName={serviceName}
      serviceSlug={serviceSlug}
    />
  );
};

export default InquiryPopup;
