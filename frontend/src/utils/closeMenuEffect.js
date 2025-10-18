import { useEffect } from "react";

/**
 * Hook to close a menu or dropdown when clicking outside or pressing the Escape key
 * @param {Object} ref - React ref object pointing to the menu element
 * @param {Function} onClose - Callback function to execute when the menu should close
 *  */ 
export function useMenuClose(ref, onClose) {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      onClose();
    };

    const handleEscKey = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [ref, onClose]);
}