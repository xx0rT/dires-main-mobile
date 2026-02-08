import { useEffect, type ReactNode } from 'react';

interface VerticalScrollLockProps {
  children: ReactNode;
  className?: string;
}

export function VerticalScrollLock({ children, className = '' }: VerticalScrollLockProps) {
  useEffect(() => {
    const preventHorizontalScroll = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
      }
    };

    const preventTouchHorizontal = (e: TouchEvent) => {
      if (e.touches.length > 1) return;

      const touch = e.touches[0];
      const startX = touch.clientX;

      const handleTouchMove = (moveEvent: TouchEvent) => {
        const moveTouch = moveEvent.touches[0];
        const deltaX = Math.abs(moveTouch.clientX - startX);
        const deltaY = Math.abs(moveTouch.clientY - touch.clientY);

        if (deltaX > deltaY && deltaX > 10) {
          moveEvent.preventDefault();
        }
      };

      document.addEventListener('touchmove', handleTouchMove, { passive: false });

      const cleanup = () => {
        document.removeEventListener('touchmove', handleTouchMove);
      };

      document.addEventListener('touchend', cleanup, { once: true });
    };

    document.body.style.overflowX = 'hidden';
    document.documentElement.style.overflowX = 'hidden';

    window.addEventListener('wheel', preventHorizontalScroll, { passive: false });
    document.addEventListener('touchstart', preventTouchHorizontal, { passive: false });

    return () => {
      document.body.style.overflowX = '';
      document.documentElement.style.overflowX = '';
      window.removeEventListener('wheel', preventHorizontalScroll);
      document.removeEventListener('touchstart', preventTouchHorizontal);
    };
  }, []);

  return (
    <div
      className={`overflow-x-hidden overflow-y-auto w-full ${className}`}
      style={{
        maxWidth: '100vw',
        overscrollBehaviorX: 'none',
      }}
    >
      {children}
    </div>
  );
}
