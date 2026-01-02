import { useEffect, useRef, useState } from "react"

interface ShinyTextProps {
  text: string
  speed?: number
  delay?: number
  color?: string
  shineColor?: string
  spread?: number
  direction?: "left" | "right"
  yoyo?: boolean
  pauseOnHover?: boolean
  className?: string
}

const ShinyText = ({
  text,
  speed = 2,
  delay = 0,
  color = "#b5b5b5",
  shineColor = "#ffffff",
  spread = 120,
  direction = "left",
  yoyo = false,
  pauseOnHover = false,
  className = "",
}: ShinyTextProps) => {
  const [isPaused, setIsPaused] = useState(false)
  const textRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!textRef.current) return

    const element = textRef.current
    const duration = speed * 1000
    const spreadPx = spread

    const animationName = `shine-${direction}-${Date.now()}`
    const keyframes = `
      @keyframes ${animationName} {
        0% {
          background-position: ${direction === "left" ? "-" : ""}${spreadPx}px 0;
        }
        100% {
          background-position: ${direction === "left" ? "" : "-"}${spreadPx}px 0;
        }
      }
    `

    const styleSheet = document.createElement("style")
    styleSheet.textContent = keyframes
    document.head.appendChild(styleSheet)

    element.style.background = `linear-gradient(90deg, ${color} 0%, ${shineColor} 50%, ${color} 100%)`
    element.style.backgroundSize = `${spreadPx}px 100%`
    element.style.backgroundClip = "text"
    element.style.webkitBackgroundClip = "text"
    element.style.color = "transparent"
    element.style.animation = `${animationName} ${duration}ms linear ${delay}ms infinite ${yoyo ? "alternate" : "normal"}`

    if (isPaused && pauseOnHover) {
      element.style.animationPlayState = "paused"
    }

    return () => {
      document.head.removeChild(styleSheet)
    }
  }, [text, speed, delay, color, shineColor, spread, direction, yoyo, isPaused, pauseOnHover])

  return (
    <span
      ref={textRef}
      className={className}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      {text}
    </span>
  )
}

export default ShinyText
