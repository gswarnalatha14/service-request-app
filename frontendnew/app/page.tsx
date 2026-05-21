"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import axios from "axios"
import { Mail, Lock, Zap, Shield, MapPin, Star, ArrowRight, Sparkles } from "lucide-react"
import { AnimatedBackground } from "@/components/animated-background"
import { GlassCard } from "@/components/glass-card"
import { GlassInput, GlassButton } from "@/components/glass-form"

const FEATURES = [
  { icon: Zap, text: "Instant service booking", color: "text-cyan-400" },
  { icon: Shield, text: "Secure & trusted professionals", color: "text-orange-400" },
  { icon: MapPin, text: "Real-time request tracking", color: "text-blue-400" },
  { icon: Star, text: "50,000+ happy customers", color: "text-teal-400" },
]

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await axios.post("http://127.0.0.1:5000/login", form)
      localStorage.setItem("user_id", res.data.user_id)
      router.push("/dashboard")
    } catch {
      setError("Invalid email or password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      <AnimatedBackground variant="auth" />
      
      {/* Left Panel - Branding */}
      <motion.div 
        className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-center px-12 xl:px-20"
        initial={{ opacity: 0, x: -80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="max-w-lg">
          {/* Logo with 3D effect */}
          <motion.div 
            className="flex items-center gap-4 mb-10"
            initial={{ opacity: 0, y: 30, rotateX: -20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.div 
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-2xl relative"
              whileHover={{ rotateY: 15, rotateX: -10, scale: 1.05 }}
              transition={{ duration: 0.3 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 blur-xl opacity-60" />
              <svg className="w-9 h-9 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold text-gradient-cyan">ServeEase</h1>
              <p className="text-slate-400 text-sm mt-1">Premium Home Services</p>
            </div>
          </motion.div>

          {/* Tagline with 3D text effect */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <h2 className="text-5xl xl:text-6xl font-bold mb-6 leading-tight">
              <span className="text-white">Your trusted</span>
              <br />
              <motion.span 
                className="text-gradient-mixed inline-block"
                animate={{ 
                  textShadow: [
                    "0 0 20px rgba(34, 211, 238, 0.3)",
                    "0 0 40px rgba(34, 211, 238, 0.5)",
                    "0 0 20px rgba(34, 211, 238, 0.3)",
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                home service partner
              </motion.span>
            </h2>
            <p className="text-slate-400 text-lg mb-12 leading-relaxed max-w-md">
              Experience premium home services at your fingertips. From plumbing to cleaning, 
              we connect you with verified professionals.
            </p>
          </motion.div>

          {/* Features with staggered 3D animation */}
          <motion.div 
            className="space-y-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {FEATURES.map((feature, index) => (
              <motion.div
                key={feature.text}
                className="flex items-center gap-4 group cursor-pointer"
                initial={{ opacity: 0, x: -40, rotateY: -15 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                transition={{ delay: 0.5 + index * 0.12, duration: 0.5 }}
                whileHover={{ x: 10, scale: 1.02 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <motion.div 
                  className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center relative overflow-hidden"
                  whileHover={{ 
                    borderColor: "rgba(34, 211, 238, 0.5)",
                    boxShadow: "0 0 30px rgba(34, 211, 238, 0.2)",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <feature.icon className={`w-5 h-5 ${feature.color} relative z-10`} />
                </motion.div>
                <span className="text-slate-300 group-hover:text-white transition-colors duration-300 font-medium">
                  {feature.text}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 50, rotateX: -10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
        >
          {/* Floating glow behind card */}
          <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-cyan-500/20 rounded-3xl blur-3xl opacity-50" />
          
          <GlassCard className="p-8 lg:p-10 relative" glow glowColor="cyan">
            {/* Mobile Logo */}
            <motion.div 
              className="lg:hidden flex items-center justify-center gap-3 mb-8"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-gradient-cyan">ServeEase</span>
            </motion.div>

            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 flex items-center justify-center"
              >
                <Sparkles className="w-8 h-8 text-cyan-400" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
              <p className="text-slate-400">Sign in to manage your service requests</p>
            </div>

            {/* Error Alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 backdrop-blur-sm"
              >
                <p className="text-red-400 text-sm text-center">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <GlassInput
                  type="email"
                  label="Email address"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  icon={<Mail className="w-5 h-5" />}
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <GlassInput
                  type="password"
                  label="Password"
                  placeholder="Your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  icon={<Lock className="w-5 h-5" />}
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <GlassButton
                  type="submit"
                  variant="glow"
                  className="w-full"
                  size="lg"
                  loading={loading}
                  icon={!loading && <ArrowRight className="w-4 h-4" />}
                >
                  {loading ? "Signing in..." : "Sign in"}
                </GlassButton>
              </motion.div>
            </form>

            <motion.div 
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <p className="text-slate-400">
                {"Don't have an account?"}{" "}
                <Link 
                  href="/register" 
                  className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors relative group"
                >
                  Create one free
                  <span className="absolute inset-x-0 -bottom-0.5 h-px bg-gradient-to-r from-cyan-400 to-blue-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </Link>
              </p>
            </motion.div>
          </GlassCard>

          {/* Bottom decoration */}
          <motion.div 
            className="flex justify-center mt-8 gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div 
                key={i} 
                className={`w-2.5 h-2.5 rounded-full ${i === 0 ? 'bg-gradient-to-r from-cyan-400 to-blue-500' : 'bg-slate-700'}`}
                animate={i === 0 ? {
                  boxShadow: [
                    "0 0 0 0 rgba(34, 211, 238, 0.4)",
                    "0 0 0 8px rgba(34, 211, 238, 0)",
                  ]
                } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
