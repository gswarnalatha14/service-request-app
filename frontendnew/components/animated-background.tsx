"use client"

import { motion } from "framer-motion"

interface FloatingOrbProps {
  className?: string
  color?: "cyan" | "orange" | "blue" | "teal"
  size?: "sm" | "md" | "lg" | "xl"
  delay?: number
  variant?: "float" | "pulse" | "orbit"
}

export function FloatingOrb({ 
  className = "", 
  color = "cyan", 
  size = "md",
  delay = 0,
  variant = "float"
}: FloatingOrbProps) {
  const colors = {
    cyan: "from-cyan-400/40 via-cyan-500/30 to-sky-500/40",
    orange: "from-orange-400/40 via-amber-500/30 to-yellow-500/40",
    blue: "from-blue-400/40 via-blue-500/30 to-indigo-500/40",
    teal: "from-teal-400/40 via-emerald-500/30 to-green-500/40",
  }
  
  const sizes = {
    sm: "w-40 h-40",
    md: "w-72 h-72",
    lg: "w-96 h-96",
    xl: "w-[500px] h-[500px]",
  }
  
  const blurs = {
    sm: "blur-[60px]",
    md: "blur-[80px]",
    lg: "blur-[100px]",
    xl: "blur-[120px]",
  }
  
  const animations = {
    float: {
      y: [0, -50, 0],
      x: [0, 30, 0],
      scale: [1, 1.15, 1],
      rotate: [0, 5, 0],
    },
    pulse: {
      scale: [1, 1.3, 1],
      opacity: [0.4, 0.7, 0.4],
    },
    orbit: {
      x: [0, 100, 0, -100, 0],
      y: [0, -50, 0, 50, 0],
      scale: [1, 1.1, 1, 0.9, 1],
    },
  }
  
  return (
    <motion.div
      className={`absolute rounded-full bg-gradient-to-br ${colors[color]} ${sizes[size]} ${blurs[size]} ${className}`}
      style={{ transformStyle: "preserve-3d" }}
      animate={animations[variant]}
      transition={{
        duration: variant === "orbit" ? 20 : variant === "pulse" ? 6 : 10,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  )
}

interface Floating3DShapeProps {
  className?: string
  type?: "cube" | "ring" | "pyramid"
  color?: "cyan" | "orange" | "blue"
  delay?: number
}

export function Floating3DShape({
  className = "",
  type = "cube",
  color = "cyan",
  delay = 0,
}: Floating3DShapeProps) {
  const colors = {
    cyan: "border-cyan-400/30 shadow-cyan-400/20",
    orange: "border-orange-400/30 shadow-orange-400/20",
    blue: "border-blue-400/30 shadow-blue-400/20",
  }
  
  const bgColors = {
    cyan: "bg-cyan-400/5",
    orange: "bg-orange-400/5",
    blue: "bg-blue-400/5",
  }

  if (type === "ring") {
    return (
      <motion.div
        className={`absolute ${className}`}
        style={{ transformStyle: "preserve-3d" }}
        animate={{
          rotateX: [0, 360],
          rotateY: [0, 180],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
          delay,
        }}
      >
        <div className={`w-32 h-32 rounded-full border-2 ${colors[color]} ${bgColors[color]} shadow-lg`} 
          style={{ transform: "rotateX(70deg)" }} 
        />
      </motion.div>
    )
  }

  if (type === "pyramid") {
    return (
      <motion.div
        className={`absolute ${className}`}
        style={{ transformStyle: "preserve-3d" }}
        animate={{
          rotateY: [0, 360],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay,
        }}
      >
        <div 
          className={`w-0 h-0 border-l-[30px] border-r-[30px] border-b-[50px] border-l-transparent border-r-transparent ${
            color === "cyan" ? "border-b-cyan-400/30" : color === "orange" ? "border-b-orange-400/30" : "border-b-blue-400/30"
          }`}
          style={{ filter: "drop-shadow(0 0 20px rgba(34, 211, 238, 0.3))" }}
        />
      </motion.div>
    )
  }

  return (
    <motion.div
      className={`absolute w-16 h-16 ${className}`}
      style={{ transformStyle: "preserve-3d" }}
      animate={{
        rotateX: [0, 360],
        rotateY: [0, 360],
        y: [0, -30, 0],
      }}
      transition={{
        duration: 12,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      <div className={`w-full h-full border-2 ${colors[color]} ${bgColors[color]} rounded-lg shadow-lg`} 
        style={{ transform: "translateZ(8px)" }} 
      />
    </motion.div>
  )
}

interface AnimatedBackgroundProps {
  variant?: "auth" | "dashboard"
}

export function AnimatedBackground({ variant = "auth" }: AnimatedBackgroundProps) {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ perspective: "1500px" }}>
      {/* Deep space base */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#050a15] to-slate-950" />
      
      {/* 3D Mesh gradient overlay */}
      <div className="absolute inset-0 bg-mesh-3d opacity-80" />
      
      {/* Animated grid floor */}
      <motion.div 
        className="absolute inset-x-0 bottom-0 h-[60vh] opacity-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 2 }}
      >
        <div className="w-full h-full grid-3d" />
      </motion.div>
      
      {/* Large floating orbs with parallax */}
      <FloatingOrb color="cyan" size="xl" variant="pulse" className="top-[-20%] left-[-10%]" delay={0} />
      <FloatingOrb color="orange" size="lg" variant="float" className="top-[10%] right-[-15%]" delay={1.5} />
      <FloatingOrb color="blue" size="lg" variant="orbit" className="bottom-[-15%] left-[20%]" delay={3} />
      <FloatingOrb color="teal" size="md" variant="pulse" className="bottom-[20%] right-[5%]" delay={2} />
      
      {variant === "auth" && (
        <>
          <FloatingOrb color="cyan" size="md" variant="float" className="top-[35%] left-[5%]" delay={1} />
          <FloatingOrb color="orange" size="sm" variant="orbit" className="top-[15%] right-[25%]" delay={2.5} />
          <Floating3DShape type="ring" color="cyan" className="top-[25%] right-[15%]" delay={0.5} />
          <Floating3DShape type="cube" color="orange" className="bottom-[30%] left-[8%]" delay={1.5} />
          <Floating3DShape type="pyramid" color="blue" className="top-[60%] right-[10%]" delay={2} />
        </>
      )}
      
      {variant === "dashboard" && (
        <>
          <FloatingOrb color="teal" size="sm" variant="float" className="top-[50%] left-[2%]" delay={1} />
          <Floating3DShape type="ring" color="cyan" className="top-[15%] left-[60%]" delay={0} />
          <Floating3DShape type="cube" color="orange" className="bottom-[20%] right-[15%]" delay={1} />
        </>
      )}
      
      {/* Animated lines */}
      <motion.div 
        className="absolute top-[30%] left-0 w-full h-px"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(34, 211, 238, 0.3) 50%, transparent 100%)",
        }}
        animate={{ 
          x: ["-100%", "100%"],
          opacity: [0, 1, 0],
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut",
          repeatDelay: 2,
        }}
      />
      
      <motion.div 
        className="absolute top-[70%] left-0 w-full h-px"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(251, 146, 60, 0.3) 50%, transparent 100%)",
        }}
        animate={{ 
          x: ["100%", "-100%"],
          opacity: [0, 1, 0],
        }}
        transition={{ 
          duration: 5, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 1.5,
          repeatDelay: 2,
        }}
      />
      
      {/* Particle dots */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-cyan-400/60"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
            y: [0, -100],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeOut",
          }}
        />
      ))}
      
      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
      }} />
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/50 via-transparent to-slate-950/50" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-transparent to-slate-950/60" />
    </div>
  )
}
