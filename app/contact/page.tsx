"use client"

import { motion } from "framer-motion"
import { AnimatedBackground } from "@/components/animated-background"
import { Dock } from "@/components/dock/dock"
import { SectionHeader } from "@/components/section-header"
import { ContactForm } from "@/components/contact-form"
import { Mail, MapPin, Calendar, Github, Linkedin, Twitter } from "lucide-react"

const contactInfo = [
  {
    icon: <Mail className="h-5 w-5" />,
    label: "Email",
    value: "raihan@example.com",
    href: "mailto:raihan@example.com",
  },
  {
    icon: <MapPin className="h-5 w-5" />,
    label: "Location",
    value: "San Francisco, CA",
  },
  {
    icon: <Calendar className="h-5 w-5" />,
    label: "Availability",
    value: "Open to opportunities",
  },
]

const socialLinks = [
  { icon: <Github className="h-5 w-5" />, label: "GitHub", href: "https://github.com" },
  { icon: <Linkedin className="h-5 w-5" />, label: "LinkedIn", href: "https://linkedin.com" },
  { icon: <Twitter className="h-5 w-5" />, label: "Twitter", href: "https://twitter.com" },
]

export default function ContactPage() {
  return (
    <>
      <AnimatedBackground />
      <Dock />

      <main className="min-h-screen px-6 pb-32 pt-20 md:px-12 lg:px-24">
        <div className="mx-auto max-w-4xl">
          <SectionHeader
            title="Get in Touch"
            description="Have a project in mind or want to discuss DevOps best practices? I'd love to hear from you."
          />

          <div className="grid gap-12 lg:grid-cols-5">
            {/* Contact Form */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-3">
              <div className="rounded-xl glass p-6 md:p-8">
                <h2 className="text-xl font-semibold text-foreground mb-6">Send a Message</h2>
                <ContactForm />
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.aside
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Contact Details */}
              <div className="rounded-xl glass p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Contact Information</h2>
                <ul className="space-y-4">
                  {contactInfo.map((item) => (
                    <li key={item.label} className="flex items-start gap-3">
                      <div className="rounded-lg bg-primary/10 p-2 text-primary">{item.icon}</div>
                      <div>
                        <p className="text-sm text-muted-foreground">{item.label}</p>
                        {item.href ? (
                          <a href={item.href} className="text-foreground hover:text-primary transition-colors">
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-foreground">{item.value}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Social Links */}
              <div className="rounded-xl glass p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Connect With Me</h2>
                <div className="flex gap-3">
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg glass p-3 text-muted-foreground hover:text-primary transition-colors glass-hover"
                      aria-label={link.label}
                    >
                      {link.icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Note */}
              <div className="rounded-xl bg-primary/5 border border-primary/20 p-6">
                <h3 className="text-sm font-semibold text-primary mb-2">Looking for DevOps expertise?</h3>
                <p className="text-sm text-muted-foreground">
                  I'm available for consulting, contract work, and full-time opportunities. Let's discuss how I can help
                  with your infrastructure challenges.
                </p>
              </div>
            </motion.aside>
          </div>
        </div>
      </main>
    </>
  )
}
