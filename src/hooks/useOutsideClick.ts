import { useEffect } from 'react';

export const useOutsideClick = ({
  element,
  handleOutsideClick,
}: {
  element: HTMLDivElement | HTMLElement | null;
  handleOutsideClick: () => void;
}) => {
  useEffect(() => {
    if (!element) return;

    const onDocumentClick = (e: MouseEvent) => {
      const target = e.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (element.contains(target)) {
        return;
      }

      handleOutsideClick();
    };

    document.addEventListener('click', onDocumentClick);

    return () => {
      document.removeEventListener('click', onDocumentClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleOutsideClick]);
};
