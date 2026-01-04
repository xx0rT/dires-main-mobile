import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface MagicBentoProps {
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  enableTilt?: boolean;
  enableMagnetism?: boolean;
  clickEffect?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  glowColor?: string;
  className?: string;
}

const MagicBento = ({
  textAutoHide = true,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  enableTilt = true,
  enableMagnetism = true,
  clickEffect = true,
  spotlightRadius = 300,
  particleCount = 12,
  glowColor = '132, 0, 255',
  className
}: MagicBentoProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Array<{ x: number; y: number; id: number }>>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    if (enableSpotlight || enableMagnetism) {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [enableSpotlight, enableMagnetism]);

  const handleClick = (e: React.MouseEvent) => {
    if (!clickEffect) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      x,
      y,
      id: Date.now() + i
    }));

    setParticles(prev => [...prev, ...newParticles]);

    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1000);
  };

  const bentoItems = [
    {
      title: 'Real-Time Analytics',
      description: 'Monitor your data with live updates and comprehensive dashboards',
      icon: '📊',
      span: 'md:col-span-2 md:row-span-2'
    },
    {
      title: 'Team Collaboration',
      description: 'Work together seamlessly with your team',
      icon: '👥',
      span: 'md:col-span-1 md:row-span-1'
    },
    {
      title: 'Secure Cloud Storage',
      description: 'Enterprise-grade security for your data',
      icon: '🔒',
      span: 'md:col-span-1 md:row-span-1'
    },
    {
      title: 'AI-Powered Insights',
      description: 'Get intelligent recommendations and predictions',
      icon: '🤖',
      span: 'md:col-span-1 md:row-span-2'
    },
    {
      title: 'Custom Integrations',
      description: 'Connect with your favorite tools',
      icon: '🔌',
      span: 'md:col-span-2 md:row-span-1'
    }
  ];

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full max-w-6xl mx-auto p-4', className)}
      onClick={handleClick}
    >
      {enableSpotlight && (
        <div
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(${spotlightRadius}px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(${glowColor}, 0.15), transparent 80%)`
          }}
        />
      )}

      {enableStars && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                opacity: Math.random() * 0.5 + 0.2
              }}
            />
          ))}
        </div>
      )}

      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full pointer-events-none animate-ping"
          style={{
            left: particle.x,
            top: particle.y,
            background: `rgb(${glowColor})`
          }}
        />
      ))}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
        {bentoItems.map((item, index) => (
          <div
            key={index}
            className={cn(
              'group relative rounded-2xl p-6 transition-all duration-300',
              'bg-gradient-to-br from-background to-muted/50',
              'border border-border/50',
              enableBorderGlow && 'hover:border-primary/50',
              enableTilt && 'hover:scale-[1.02]',
              item.span
            )}
            style={
              enableMagnetism
                ? {
                    transform: `translate(${(mousePosition.x - 400) * 0.01}px, ${(mousePosition.y - 300) * 0.01}px)`
                  }
                : undefined
            }
          >
            {enableBorderGlow && (
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"
                style={{
                  background: `linear-gradient(135deg, rgba(${glowColor}, 0.3), transparent)`
                }}
              />
            )}

            <div className="flex flex-col h-full">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2 transition-opacity duration-300 group-hover:opacity-100">
                {item.title}
              </h3>
              <p
                className={cn(
                  'text-muted-foreground transition-opacity duration-300',
                  textAutoHide && 'opacity-70 group-hover:opacity-100'
                )}
              >
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MagicBento;
