"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"
import {
  LayoutDashboard,
  ClipboardList,
  Plus,
  LogOut,
  Menu,
  X,
  Clock,
  Wrench,
  CheckCircle,
  XCircle,
  Tag,
  MapPin,
  Edit2,
  Trash2,
  Sparkles,
  TrendingUp,
  ChevronRight,
} from "lucide-react"
import { GlassCard, MotionGlassCard } from "@/components/glass-card"
import { GlassButton, GlassSelect } from "@/components/glass-form"
import { Modal, CreateRequestForm, EditRequestForm } from "@/components/request-forms"

// Types
interface ServiceRequest {
  id: number
  title: string
  description?: string
  category?: string
  address?: string
  preferred_time?: string
  status: string
}

interface Toast {
  type: "success" | "error"
  title: string
  message?: string
}

// Status configuration
const STATUS_META = {
  pending: { label: "Pending", icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  inprogress: { label: "In Progress", icon: Wrench, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  completed: { label: "Completed", icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
}

const statusKey = (s = "") => s.toLowerCase().replace(/[\s_-]/g, "")

const NAV_ITEMS = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "requests", icon: ClipboardList, label: "My Requests" },
  { id: "new", icon: Plus, label: "New Request" },
]

// Skeleton component
function SkeletonCard() {
  return (
    <GlassCard className="p-6">
      <div className="space-y-4">
        <div className="skeleton h-6 w-3/4 rounded-lg" />
        <div className="skeleton h-4 w-full rounded-lg" />
        <div className="skeleton h-4 w-2/3 rounded-lg" />
        <div className="flex gap-2">
          <div className="skeleton h-8 w-20 rounded-lg" />
          <div className="skeleton h-8 w-24 rounded-lg" />
        </div>
      </div>
    </GlassCard>
  )
}

// Request Card component
function RequestCard({
  req,
  onDelete,
  onStatusChange,
  onEdit,
  index = 0,
}: {
  req: ServiceRequest
  onDelete: (id: number) => void
  onStatusChange: (id: number, status: string) => Promise<void>
  onEdit: (req: ServiceRequest) => void
  index?: number
}) {
  const meta = STATUS_META[statusKey(req.status) as keyof typeof STATUS_META] || STATUS_META.pending
  const StatusIcon = meta.icon
  const [updatingStatus, setUpdatingStatus] = useState(false)

  const handleStatusChange = async (newStatus: string) => {
    setUpdatingStatus(true)
    await onStatusChange(req.id, newStatus)
    setUpdatingStatus(false)
  }

  const statusOptions = Object.entries(STATUS_META).map(([k, v]) => ({
    value: k,
    label: v.label,
  }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <GlassCard className="p-6 hover:border-indigo-500/30 transition-all duration-300 group">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <h3 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
            {req.title}
          </h3>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${meta.bg} ${meta.border} border ${meta.color}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            {meta.label}
          </span>
        </div>

        {/* Description */}
        {req.description && (
          <p className="text-slate-400 text-sm mb-4 line-clamp-2">{req.description}</p>
        )}

        {/* Meta info */}
        <div className="space-y-2 mb-5">
          {req.category && (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Tag className="w-4 h-4 text-indigo-400" />
              <span>{req.category}</span>
            </div>
          )}
          {req.address && (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span className="line-clamp-1">{req.address}</span>
            </div>
          )}
          {req.preferred_time && (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Clock className="w-4 h-4 text-purple-400" />
              <span>{req.preferred_time}</span>
            </div>
          )}
        </div>

        {/* Status update */}
        <div className="mb-4">
          <GlassSelect
            label="Update Status"
            value={statusKey(req.status)}
            onChange={(e) => handleStatusChange(e.target.value)}
            options={statusOptions}
            disabled={updatingStatus}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <GlassButton
            variant="ghost"
            size="sm"
            onClick={() => onEdit(req)}
            icon={<Edit2 className="w-4 h-4" />}
            className="flex-1"
          >
            Edit
          </GlassButton>
          <GlassButton
            variant="danger"
            size="sm"
            onClick={() => onDelete(req.id)}
            icon={<Trash2 className="w-4 h-4" />}
            className="flex-1"
          >
            Delete
          </GlassButton>
        </div>
      </GlassCard>
    </motion.div>
  )
}

// Stat Card component
function StatCard({
  icon: Icon,
  value,
  label,
  color,
  delay = 0,
}: {
  icon: React.ElementType
  value: number
  label: string
  color: "indigo" | "amber" | "blue" | "emerald"
  delay?: number
}) {
  const colors = {
    indigo: { bg: "from-indigo-500/20 to-purple-500/20", icon: "text-indigo-400", glow: "shadow-indigo-500/20" },
    amber: { bg: "from-amber-500/20 to-orange-500/20", icon: "text-amber-400", glow: "shadow-amber-500/20" },
    blue: { bg: "from-blue-500/20 to-cyan-500/20", icon: "text-blue-400", glow: "shadow-blue-500/20" },
    emerald: { bg: "from-emerald-500/20 to-teal-500/20", icon: "text-emerald-400", glow: "shadow-emerald-500/20" },
  }

  const c = colors[color]

  return (
    <MotionGlassCard delay={delay} className={`p-6 relative overflow-hidden`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${c.bg} opacity-50`} />
      <div className="relative flex items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${c.bg} flex items-center justify-center shadow-lg ${c.glow}`}>
          <Icon className={`w-7 h-7 ${c.icon}`} />
        </div>
        <div>
          <p className="text-3xl font-bold text-white">{value}</p>
          <p className="text-slate-400 text-sm">{label}</p>
        </div>
      </div>
    </MotionGlassCard>
  )
}

// Toast component
function ToastNotification({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, x: 20 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: -20, x: 20 }}
      className="fixed top-4 right-4 z-[100]"
    >
      <GlassCard className={`p-4 min-w-[300px] ${toast.type === "success" ? "border-emerald-500/30" : "border-red-500/30"}`}>
        <div className="flex items-start gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${toast.type === "success" ? "bg-emerald-500/20" : "bg-red-500/20"}`}>
            {toast.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400" />
            )}
          </div>
          <div className="flex-1">
            <p className="font-medium text-white">{toast.title}</p>
            {toast.message && <p className="text-sm text-slate-400 mt-0.5">{toast.message}</p>}
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      </GlassCard>
    </motion.div>
  )
}

// Main Dashboard component
export default function DashboardPage() {
  const router = useRouter()
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [activeNav, setActiveNav] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [editReq, setEditReq] = useState<ServiceRequest | null>(null)
  const [filter, setFilter] = useState("all")
  const [toast, setToast] = useState<Toast | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState("")

  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const id = localStorage.getItem("user_id")
    if (!id) {
      router.push("/")
      return
    }
    setUserId(id)
  }, [router])

  const showToast = (type: "success" | "error", title: string, message?: string) => {
    setToast({ type, title, message })
  }

  const fetchRequests = useCallback(async () => {
    if (!userId) return
    try {
      const res = await axios.get(`https://service-request-app.onrender.com/requests/${userId}`)
      setRequests(res.data)
    } catch {
      showToast("error", "Error", "Could not load requests.")
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    if (userId) {
      fetchRequests()
    }
  }, [userId, fetchRequests])

  const createRequest = async (data: FormData) => {
    setFormLoading(true)
    setFormError("")
    try {
      data.append("user_id", userId || "")
      await axios.post("https://service-request-app.onrender.com/create-request", data)
      showToast("success", "Created!", "Service request submitted.")
      fetchRequests()
      setShowCreate(false)
    } catch {
      setFormError("Failed to create request. Please try again.")
    } finally {
      setFormLoading(false)
    }
  }

  const updateRequest = async (data: Record<string, string>) => {
    if (!editReq) return
    setFormLoading(true)
    setFormError("")
    try {
      await axios.put(`https://service-request-app.onrender.com/update-request/${editReq.id}`, data)
      showToast("success", "Saved", "Request updated successfully.")
      fetchRequests()
      setEditReq(null)
    } catch {
      setFormError("Could not save changes. Please try again.")
    } finally {
      setFormLoading(false)
    }
  }

  const deleteRequest = async (id: number) => {
    try {
      await axios.delete(`https://service-request-app.onrender.com/delete-request/${id}`)
      showToast("success", "Deleted", "Request removed successfully.")
      fetchRequests()
    } catch {
      showToast("error", "Error", "Could not delete request.")
    }
  }

  const updateStatus = async (id: number, status: string) => {
    try {
      await axios.put(`https://service-request-app.onrender.com/update-status/${id}`, { status })
      showToast("success", "Updated", "Status changed successfully.")
      fetchRequests()
    } catch {
      showToast("error", "Error", "Could not update status.")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user_id")
    router.push("/")
  }

  // Stats
  const stats = {
    total: requests.length,
    pending: requests.filter((r) => statusKey(r.status) === "pending").length,
    inprogress: requests.filter((r) => statusKey(r.status) === "inprogress").length,
    completed: requests.filter((r) => statusKey(r.status) === "completed").length,
  }

  const filtered = filter === "all" ? requests : requests.filter((r) => statusKey(r.status) === filter)

  const navClick = (id: string) => {
    setActiveNav(id)
    setSidebarOpen(false)
    if (id === "new") {
      setShowCreate(true)
      setActiveNav("requests")
    }
  }

  const FILTERS = [
    { key: "all", label: `All (${requests.length})` },
    { key: "pending", label: `Pending (${stats.pending})` },
    { key: "inprogress", label: `In Progress (${stats.inprogress})` },
    { key: "completed", label: `Completed (${stats.completed})` },
  ]

  if (!userId) return null

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      <div className="fixed inset-0 bg-mesh opacity-50" />

      {/* Toast */}
      <AnimatePresence>
        {toast && <ToastNotification toast={toast} onClose={() => setToast(null)} />}
      </AnimatePresence>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 z-50 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full bg-slate-900/80 backdrop-blur-xl border-r border-slate-800/50 flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">ServeEase</h1>
                <p className="text-xs text-slate-500">Premium Services</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider px-3 mb-3">Menu</p>
            {NAV_ITEMS.map((item) => {
              const isActive = activeNav === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => navClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border border-indigo-500/30"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? "text-indigo-400" : ""}`} />
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400"
                    />
                  )}
                </button>
              )
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-slate-800/50">
            <div className="p-4 rounded-xl bg-slate-800/50 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                  U
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">My Account</p>
                  <p className="text-xs text-slate-500 truncate">ID: {userId}</p>
                </div>
              </div>
            </div>
            <GlassButton
              variant="ghost"
              className="w-full"
              onClick={handleLogout}
              icon={<LogOut className="w-4 h-4" />}
            >
              Sign Out
            </GlassButton>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:pl-72 relative z-10">
        {/* Top bar */}
        <header className="sticky top-0 z-30 px-4 lg:px-8 py-4 bg-slate-950/50 backdrop-blur-xl border-b border-slate-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden w-10 h-10 rounded-xl bg-slate-800/80 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-white">
                  {activeNav === "dashboard" ? "Dashboard" : "My Requests"}
                </h1>
                <p className="text-sm text-slate-500">
                  {activeNav === "dashboard" ? "Overview of your service requests" : `${filtered.length} requests found`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 text-slate-400 text-sm">
                <ClipboardList className="w-4 h-4" />
                {requests.length} requests
              </span>
              <GlassButton onClick={() => setShowCreate(true)} icon={<Sparkles className="w-4 h-4" />}>
                New Request
              </GlassButton>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-4 lg:p-8">
          {/* Dashboard view */}
          {activeNav === "dashboard" && (
            <div className="space-y-8">
              {/* Stats */}
              <div>
                <h2 className="text-lg font-semibold text-white mb-1">Overview</h2>
                <p className="text-slate-500 text-sm mb-6">Your service request summary</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard icon={ClipboardList} value={stats.total} label="Total Requests" color="indigo" delay={0} />
                  <StatCard icon={Clock} value={stats.pending} label="Pending" color="amber" delay={0.1} />
                  <StatCard icon={Wrench} value={stats.inprogress} label="In Progress" color="blue" delay={0.2} />
                  <StatCard icon={CheckCircle} value={stats.completed} label="Completed" color="emerald" delay={0.3} />
                </div>
              </div>

              {/* Recent requests */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-white mb-1">Recent Requests</h2>
                    <p className="text-slate-500 text-sm">Your latest service requests</p>
                  </div>
                  <GlassButton variant="ghost" size="sm" onClick={() => setActiveNav("requests")}>
                    View all
                    <ChevronRight className="w-4 h-4" />
                  </GlassButton>
                </div>

                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <SkeletonCard key={i} />
                    ))}
                  </div>
                ) : requests.length === 0 ? (
                  <MotionGlassCard delay={0.2} className="p-12 text-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-6">
                      <TrendingUp className="w-10 h-10 text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No service requests yet</h3>
                    <p className="text-slate-400 mb-6">Create your first service request to get started with ServeEase</p>
                    <GlassButton onClick={() => setShowCreate(true)} icon={<Sparkles className="w-4 h-4" />}>
                      Create First Request
                    </GlassButton>
                  </MotionGlassCard>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {requests.slice(0, 3).map((req, i) => (
                      <RequestCard
                        key={req.id}
                        req={req}
                        index={i}
                        onDelete={deleteRequest}
                        onStatusChange={updateStatus}
                        onEdit={setEditReq}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Requests view */}
          {activeNav === "requests" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-white mb-1">My Service Requests</h2>
                  <p className="text-slate-500 text-sm">{filtered.length} request{filtered.length !== 1 ? "s" : ""} found</p>
                </div>
                <GlassButton onClick={() => setShowCreate(true)} icon={<Sparkles className="w-4 h-4" />}>
                  New Request
                </GlassButton>
              </div>

              {/* Filter chips */}
              <div className="flex flex-wrap gap-2">
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      filter === f.key
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25"
                        : "bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700/80"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <MotionGlassCard delay={0.1} className="p-12 text-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-700/50 to-slate-800/50 flex items-center justify-center mx-auto mb-6">
                    <ClipboardList className="w-10 h-10 text-slate-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {filter === "all" ? "No requests yet" : `No ${STATUS_META[filter as keyof typeof STATUS_META]?.label || filter} requests`}
                  </h3>
                  <p className="text-slate-400 mb-6">
                    {filter === "all" ? "Create your first service request to get help at home." : "Try a different filter or create a new request."}
                  </p>
                  {filter === "all" && (
                    <GlassButton onClick={() => setShowCreate(true)} icon={<Sparkles className="w-4 h-4" />}>
                      Create Request
                    </GlassButton>
                  )}
                </MotionGlassCard>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filtered.map((req, i) => (
                    <RequestCard
                      key={req.id}
                      req={req}
                      index={i}
                      onDelete={deleteRequest}
                      onStatusChange={updateStatus}
                      onEdit={setEditReq}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Create Modal */}
      <Modal
        open={showCreate}
        onClose={() => {
          setShowCreate(false)
          setFormError("")
        }}
        title="New Service Request"
        subtitle="Tell us what you need help with"
      >
        <CreateRequestForm
          onSubmit={createRequest}
          onClose={() => setShowCreate(false)}
          loading={formLoading}
          error={formError}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={!!editReq}
        onClose={() => {
          setEditReq(null)
          setFormError("")
        }}
        title="Edit Request"
        subtitle="Update service request details"
      >
        {editReq && (
          <EditRequestForm
            request={editReq}
            onSubmit={updateRequest}
            onClose={() => setEditReq(null)}
            loading={formLoading}
            error={formError}
          />
        )}
      </Modal>
    </div>
  )
}
