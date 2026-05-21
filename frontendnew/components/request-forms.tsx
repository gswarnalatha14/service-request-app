"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Tag, FileText, MapPin, Clock, Upload, Image as ImageIcon } from "lucide-react"
import { GlassCard } from "@/components/glass-card"
import { GlassInput, GlassTextarea, GlassSelect, GlassButton } from "@/components/glass-form"

const CATEGORIES = [
  { value: "", label: "Select category..." },
  { value: "Plumbing", label: "Plumbing" },
  { value: "Electrical", label: "Electrical" },
  { value: "Cleaning", label: "Cleaning" },
  { value: "Carpentry", label: "Carpentry" },
  { value: "Painting", label: "Painting" },
  { value: "Appliance Repair", label: "Appliance Repair" },
  { value: "Pest Control", label: "Pest Control" },
  { value: "Other", label: "Other" },
]

interface CreateRequestFormProps {
  onSubmit: (data: FormData) => Promise<void>
  onClose?: () => void
  loading?: boolean
  error?: string
}

export function CreateRequestForm({ onSubmit, onClose, loading, error }: CreateRequestFormProps) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    address: "",
    preferred_time: "",
  })
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }))

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const data = new FormData()
    Object.entries(form).forEach(([k, v]) => data.append(k, v))
    if (image) data.append("image", image)
    await onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-red-500/10 border border-red-500/20"
        >
          <p className="text-red-400 text-sm text-center">{error}</p>
        </motion.div>
      )}

      <GlassInput
        label="Service Title"
        placeholder="e.g. Fix kitchen tap leak"
        value={form.title}
        onChange={(e) => set("title", e.target.value)}
        icon={<Tag className="w-5 h-5" />}
        required
      />

      <GlassTextarea
        label="Description"
        placeholder="Describe the issue or what service you need..."
        value={form.description}
        onChange={(e) => set("description", e.target.value)}
        rows={3}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <GlassSelect
          label="Category"
          value={form.category}
          onChange={(e) => set("category", e.target.value)}
          options={CATEGORIES}
          required
        />

        <GlassInput
          label="Preferred Time"
          placeholder="e.g. Mon 10am-12pm"
          value={form.preferred_time}
          onChange={(e) => set("preferred_time", e.target.value)}
          icon={<Clock className="w-5 h-5" />}
        />
      </div>

      <GlassInput
        label="Service Address"
        placeholder="Your full address"
        value={form.address}
        onChange={(e) => set("address", e.target.value)}
        icon={<MapPin className="w-5 h-5" />}
        required
      />

      {/* Image Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300">Attach Image (optional)</label>
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="flex items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed border-slate-700/50 bg-slate-800/30 hover:border-indigo-500/50 hover:bg-slate-800/50 cursor-pointer transition-all"
          >
            {imagePreview ? (
              <div className="relative">
                <img src={imagePreview} alt="Preview" className="w-full max-h-32 object-contain rounded-lg" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    setImage(null)
                    setImagePreview(null)
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl bg-slate-700/50 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-slate-400" />
                </div>
                <div className="text-left">
                  <p className="text-slate-300 font-medium">Click to upload</p>
                  <p className="text-slate-500 text-sm">PNG, JPG up to 10MB</p>
                </div>
              </>
            )}
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        {onClose && (
          <GlassButton type="button" variant="ghost" onClick={onClose} className="flex-1">
            Cancel
          </GlassButton>
        )}
        <GlassButton type="submit" className="flex-1" loading={loading}>
          {loading ? "Creating..." : "Create Request"}
        </GlassButton>
      </div>
    </form>
  )
}

interface EditRequestFormProps {
  request: {
    id: number
    title: string
    description?: string
    category?: string
    address?: string
    preferred_time?: string
  }
  onSubmit: (data: Record<string, string>) => Promise<void>
  onClose: () => void
  loading?: boolean
  error?: string
}

export function EditRequestForm({ request, onSubmit, onClose, loading, error }: EditRequestFormProps) {
  const [form, setForm] = useState({
    title: request.title || "",
    description: request.description || "",
    category: request.category || "",
    address: request.address || "",
    preferred_time: request.preferred_time || "",
  })

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-red-500/10 border border-red-500/20"
        >
          <p className="text-red-400 text-sm text-center">{error}</p>
        </motion.div>
      )}

      <GlassInput
        label="Title"
        value={form.title}
        onChange={(e) => set("title", e.target.value)}
        icon={<FileText className="w-5 h-5" />}
        required
      />

      <GlassTextarea
        label="Description"
        value={form.description}
        onChange={(e) => set("description", e.target.value)}
        rows={3}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <GlassSelect
          label="Category"
          value={form.category}
          onChange={(e) => set("category", e.target.value)}
          options={CATEGORIES}
        />

        <GlassInput
          label="Preferred Time"
          value={form.preferred_time}
          onChange={(e) => set("preferred_time", e.target.value)}
          icon={<Clock className="w-5 h-5" />}
        />
      </div>

      <GlassInput
        label="Address"
        value={form.address}
        onChange={(e) => set("address", e.target.value)}
        icon={<MapPin className="w-5 h-5" />}
      />

      <div className="flex gap-3 pt-4">
        <GlassButton type="button" variant="ghost" onClick={onClose} className="flex-1">
          Cancel
        </GlassButton>
        <GlassButton type="submit" className="flex-1" loading={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </GlassButton>
      </div>
    </form>
  )
}

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: React.ReactNode
}

export function Modal({ open, onClose, title, subtitle, children }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <GlassCard className="w-full max-w-lg max-h-[90vh] overflow-hidden" glow>
              {/* Header */}
              <div className="flex items-start justify-between p-6 border-b border-slate-700/50">
                <div>
                  <h3 className="text-xl font-semibold text-white">{title}</h3>
                  {subtitle && <p className="text-slate-400 text-sm mt-1">{subtitle}</p>}
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {/* Body */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                {children}
              </div>
            </GlassCard>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
