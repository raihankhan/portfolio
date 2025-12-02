"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required"
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setStatus("loading")

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setStatus("success")
    setFormData({ name: "", email: "", subject: "", message: "" })

    // Reset status after 3 seconds
    setTimeout(() => setStatus("idle"), 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full rounded-lg glass border-0 bg-transparent px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${
              errors.name ? "ring-2 ring-destructive" : "focus:ring-primary/50"
            }`}
            placeholder="John Doe"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full rounded-lg glass border-0 bg-transparent px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${
              errors.email ? "ring-2 ring-destructive" : "focus:ring-primary/50"
            }`}
            placeholder="john@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.email}
            </p>
          )}
        </div>
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
          Subject
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className={`w-full rounded-lg glass border-0 bg-transparent px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${
            errors.subject ? "ring-2 ring-destructive" : "focus:ring-primary/50"
          }`}
          placeholder="Project collaboration"
        />
        {errors.subject && (
          <p className="mt-1 text-sm text-destructive flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errors.subject}
          </p>
        )}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          className={`w-full rounded-lg glass border-0 bg-transparent px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 resize-none ${
            errors.message ? "ring-2 ring-destructive" : "focus:ring-primary/50"
          }`}
          placeholder="Tell me about your project..."
        />
        {errors.message && (
          <p className="mt-1 text-sm text-destructive flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errors.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={status === "loading" || status === "success"}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full rounded-lg px-6 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
          status === "success" ? "bg-accent text-white" : "bg-primary text-primary-foreground hover:bg-primary/90"
        } disabled:opacity-70`}
      >
        {status === "loading" && (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending...
          </>
        )}
        {status === "success" && (
          <>
            <CheckCircle2 className="h-4 w-4" />
            Message Sent!
          </>
        )}
        {status === "idle" && (
          <>
            <Send className="h-4 w-4" />
            Send Message
          </>
        )}
        {status === "error" && (
          <>
            <AlertCircle className="h-4 w-4" />
            Try Again
          </>
        )}
      </motion.button>
    </form>
  )
}
