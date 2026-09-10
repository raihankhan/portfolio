"use client"

import { motion } from "framer-motion"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"
import { skills } from "@/lib/data"

const categoryColors = {
  kubernetes: "var(--primary)",
  cloud: "var(--secondary)",
  gitops: "var(--accent)",
  golang: "#f97316",
  observability: "#22c55e",
  security: "#ef4444",
  ai: "#a855f7",
}

export function SkillsRadar() {
  const data = skills.map((skill) => ({
    skill: skill.name,
    level: skill.level,
    years: skill.years * 10,
    fill: categoryColors[skill.category],
  }))

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full min-h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%" minHeight={300}>
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid
            stroke="oklch(0.25 0.01 260 / 0.3)"
            strokeDasharray="3 3"
          />
          <PolarAngleAxis
            dataKey="skill"
            tick={{ fill: "oklch(0.55 0.02 260)", fontSize: 11 }}
            tickLine={false}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: "oklch(0.55 0.02 260)", fontSize: 10 }}
            tickCount={5}
            axisLine={false}
          />
          <Radar
            name="Skill Level"
            dataKey="level"
            stroke="url(#skillGradient)"
            strokeWidth={2}
            fill="url(#skillGradient)"
            fillOpacity={0.3}
          />
          <defs>
            <linearGradient id="skillGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--primary)" />
              <stop offset="100%" stopColor="var(--secondary)" />
            </linearGradient>
          </defs>
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

export function SkillsLegend() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {skills.map((skill, index) => (
        <motion.div
          key={skill.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2"
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: categoryColors[skill.category] }}
          />
          <span className="text-xs text-muted-foreground truncate">{skill.name}</span>
          <span className="ml-auto text-xs font-medium text-foreground">{skill.level}%</span>
        </motion.div>
      ))}
    </div>
  )
}

export function ExpertiseLevel({ level, label }: { level: number; label: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{level}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, var(--primary), var(--secondary))`,
          }}
        />
      </div>
    </div>
  )
}