import { cn } from '@/lib/utils';

interface ShapeDividerProps {
  position?: 'top' | 'bottom';
  variant?: 'waves' | 'curve' | 'tilt';
  className?: string;
  flip?: boolean;
}

export const ShapeDivider = ({
  position = 'bottom',
  variant = 'waves',
  className,
  flip = false
}: ShapeDividerProps) => {
  const getPath = () => {
    switch (variant) {
      case 'waves':
        return (
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-background" />
        );
      case 'curve':
        return (
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-background" />
        );
      case 'tilt':
        return (
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-background" />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        'absolute left-0 w-full overflow-hidden leading-[0]',
        position === 'top' ? 'top-0' : 'bottom-0',
        flip && 'rotate-180',
        className
      )}
    >
      <svg
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className={cn(
          'relative block w-[calc(100%+1.3px)]',
          'h-[60px] sm:h-[80px] md:h-[100px]'
        )}
      >
        {getPath()}
      </svg>
    </div>
  );
};
