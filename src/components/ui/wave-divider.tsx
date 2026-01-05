interface WaveDividerProps {
  variant?: 1 | 2
  flip?: boolean
  className?: string
}

export function WaveDivider({ variant = 1, flip = false, className = '' }: WaveDividerProps) {
  const waveSrc = variant === 1 ? '/wave-layer-1.svg' : '/wave-layer-2.svg'

  return (
    <div
      className={`w-full ${flip ? 'rotate-180' : ''} ${className}`}
      style={{
        aspectRatio: '960/300',
        backgroundImage: `url('${waveSrc}')`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    />
  )
}
