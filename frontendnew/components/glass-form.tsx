"use client"

import { forwardRef } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
  label?: string
  error?: string
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, icon, label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    
    return (
      <div className="space-y-2">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-300"
          >
            {label}
          </label>
        )}
        <div className="relative group">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-400 transition-colors duration-300">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full px-4 py-4 rounded-xl",
              "bg-slate-900/60 border border-slate-700/50",
              "text-slate-100 placeholder:text-slate-500",
              "focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20",
              "transition-all duration-300",
              "backdrop-blur-xl",
              "shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]",
              icon && "pl-12",
              error && "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20",
              className
            )}
            {...props}
          />
          {/* Animated glow on focus */}
          <div className="absolute inset-0 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none -z-10">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-cyan-500/20 blur-xl" />
          </div>
          {/* Top highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-t-xl pointer-events-none" />
        </div>
        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-400"
          >
            {error}
          </motion.p>
        )}
      </div>
    )
  }
)

GlassInput.displayName = "GlassInput"

interface GlassSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

export const GlassSelect = forwardRef<HTMLSelectElement, GlassSelectProps>(
  ({ className, label, error, options, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')
    
    return (
      <div className="space-y-2">
        {label && (
          <label 
            htmlFor={selectId}
            className="block text-sm font-medium text-slate-300"
          >
            {label}
          </label>
        )}
        <div className="relative group">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              "w-full px-4 py-4 rounded-xl appearance-none",
              "bg-slate-900/60 border border-slate-700/50",
              "text-slate-100",
              "focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20",
              "transition-all duration-300",
              "backdrop-blur-xl",
              "cursor-pointer",
              "shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]",
              "[&>option]:bg-slate-900 [&>option]:text-slate-100",
              error && "border-red-500/50",
              className
            )}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {/* Custom dropdown arrow */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-cyan-400 transition-colors duration-300">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}
      </div>
    )
  }
)

GlassSelect.displayName = "GlassSelect"

interface GlassTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const GlassTextarea = forwardRef<HTMLTextAreaElement, GlassTextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-')
    
    return (
      <div className="space-y-2">
        {label && (
          <label 
            htmlFor={textareaId}
            className="block text-sm font-medium text-slate-300"
          >
            {label}
          </label>
        )}
        <div className="relative group">
          <textarea
            ref={ref}
            id={textareaId}
            className={cn(
              "w-full px-4 py-4 rounded-xl",
              "bg-slate-900/60 border border-slate-700/50",
              "text-slate-100 placeholder:text-slate-500",
              "focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20",
              "transition-all duration-300",
              "backdrop-blur-xl resize-none",
              "shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]",
              error && "border-red-500/50",
              className
            )}
            {...props}
          />
          <div className="absolute inset-0 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none -z-10">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-cyan-500/20 blur-xl" />
          </div>
        </div>
        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}
      </div>
    )
  }
)

GlassTextarea.displayName = "GlassTextarea"

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "glow"
  size?: "sm" | "md" | "lg"
  loading?: boolean
  icon?: React.ReactNode
}

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant = "primary", size = "md", loading, icon, children, disabled, ...props }, ref) => {
    const variants = {
      primary: "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40",
      secondary: "bg-slate-800/80 border border-slate-700/50 text-slate-200 hover:bg-slate-700/80 hover:border-cyan-500/30",
      ghost: "bg-transparent text-slate-300 hover:bg-slate-800/50 hover:text-cyan-300",
      danger: "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 text-white shadow-lg shadow-red-500/25",
      glow: "bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 text-white relative overflow-hidden",
    }
    
    const sizes = {
      sm: "px-4 py-2.5 text-sm",
      md: "px-6 py-3.5 text-sm",
      lg: "px-8 py-4 text-base",
    }
    
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled ? 1 : 1.03, y: disabled ? 0 : -2 }}
        whileTap={{ scale: disabled ? 1 : 0.97 }}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 rounded-xl font-semibold",
          "transition-all duration-300",
          "focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:ring-offset-2 focus:ring-offset-slate-900",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {variant === "glow" && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ backgroundSize: "200% 200%" }}
          />
        )}
        {variant === "glow" && (
          <div className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/50 to-blue-400/50 blur-xl" />
          </div>
        )}
        <span className="relative flex items-center gap-2">
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {!loading && icon}
          {children}
        </span>
      </motion.button>
    )
  }
)

GlassButton.displayName = "GlassButton"
