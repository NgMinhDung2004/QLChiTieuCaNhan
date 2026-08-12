import {
  UtensilsCrossed,
  ShoppingBag,
  Car,
  Gamepad2,
  Receipt,
  Heart,
  GraduationCap,
  MoreHorizontal,
  Briefcase,
  Gift,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  UtensilsCrossed,
  ShoppingBag,
  Car,
  Gamepad2,
  Receipt,
  Heart,
  GraduationCap,
  MoreHorizontal,
  Briefcase,
  Gift,
  TrendingUp,
}

interface CategoryIconProps {
  icon: string
  color: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
}

const iconSizes = {
  sm: 16,
  md: 20,
  lg: 24,
}

export default function CategoryIcon({ icon, color, size = 'md' }: CategoryIconProps) {
  const Icon = iconMap[icon] || MoreHorizontal

  return (
    <div
      className={`${sizeClasses[size]} rounded-xl flex items-center justify-center flex-shrink-0`}
      style={{ backgroundColor: `${color}20` }}
    >
      <Icon size={iconSizes[size]} style={{ color }} />
    </div>
  )
}
