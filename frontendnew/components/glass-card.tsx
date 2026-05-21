"use client"

import { forwardRef } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "bordered" | "glow"
  glow?: boolean
  glowColor?: "cyan" | "orange" | "blue" | "teal"
  hover3d?: boolean
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", glow = false, glowColor = "cyan", hover3d = true, children, ...props }, ref) => {
    const glowStyles = {
      cyan: "shadow-[0_0_40px_rgba(34,211,238,0.15)]",
      orange: "shadow-[0_0_40px_rgba(251,146,60,0.15)]",
      blue: "shadow-[0_0_40px_rgba(59,130,246,0.15)]",
      teal: "shadow-[0_0_40px_rgba(20,184,166,0.15)]",
    }
    
    const glowBorder = {
      cyan: "border-cyan-500/20",
      orange: "border-orange-500/20",
      blue: "border-blue-500/20",
      teal: "border-teal-500/20",
    }
    
    const variants = {
      default: "bg-slate-900/70 border-slate-700/40",
      elevated: "bg-slate-800/80 border-slate-600/40",
      bordered: "bg-slate-900/50 border-cyan-500/20",
      glow: "bg-slate-900/60 border-cyan-500/30",
    }
    
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl border backdrop-blur-xl",
          "transition-all duration-500 ease-out",
          "shadow-[0_20px_50px_-12px_rgba(0,0,0,0.4)]",
          hover3d && "hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]",
          variants[variant],
          glow && glowStyles[glowColor],
          glow && glowBorder[glowColor],
          className
        )}
        style={{
          background: variant === "glow" 
            ? "linear-gradient(135deg, rgba(15, 30, 50, 0.9) 0%, rgba(8, 15, 30, 0.95) 100%)"
            : undefined,
        }}
        {...props}
      >
        {/* Inner highlight */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
        <div className="relative">{children}</div>
      </div>
    )
  }
)

GlassCard.displayName = "GlassCard"

interface MotionGlassCardProps extends GlassCardProps {
  delay?: number
}

export function MotionGlassCard({ delay = 0, children, ...props }: MotionGlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: -10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ 
        duration: 0.6, 
        delay, 
        ease: [0.4, 0, 0.2, 1],
      }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <GlassCard {...props}>{children}</GlassCard>
    </motion.div>
  )
}

// 3D Tilt Card with mouse tracking
interface Tilt3DCardProps extends GlassCardProps {
  tiltIntensity?: number
}

export function Tilt3DCard({ 
  children, 
  className,
  tiltIntensity = 10,
  ...props 
}: Tilt3DCardProps) {
  return (
    <motion.div
      className={cn("relative", className)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
    >
      <motion.div
        className="w-full h-full"
        whileHover={{
          rotateX: tiltIntensity * 0.5,
          rotateY: tiltIntensity * 0.5,
          z: 50,
        }}
        transition={{ duration: 0.3 }}
      >
        <GlassCard {...props} hover3d={false}>
          {children}
        </GlassCard>
      </motion.div>
      
      {/* 3D Shadow */}
      <motion.div 
        className="absolute inset-0 -z-10 rounded-2xl bg-cyan-500/10 blur-2xl"
        whileHover={{ scale: 1.1, opacity: 0.8 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}
