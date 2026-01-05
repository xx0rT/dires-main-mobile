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
          <>
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="fill-muted/30" />
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="fill-muted/50" />
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="fill-background" />
          </>
        );
      case 'curve':
        return (
          <path d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,106.7C960,117,1056,139,1152,133.3C1248,128,1344,96,1392,80L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" className="fill-background" />
        );
      case 'tilt':
        return (
          <path d="M0,96L1440,32L1440,320L0,320Z" className="fill-background" />
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
          variant === 'waves' && 'h-[80px] sm:h-[120px]',
          variant === 'curve' && 'h-[60px] sm:h-[100px]',
          variant === 'tilt' && 'h-[40px] sm:h-[60px]'
        )}
      >
        {getPath()}
      </svg>
    </div>
  );
};
