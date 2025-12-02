interface TechBadgeProps {
  name: string
}

export function TechBadge({ name }: TechBadgeProps) {
  return (
    <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
      {name}
    </span>
  )
}
