import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <p className="text-5xl font-bold text-[var(--color-text-primary)]">404</p>
      <p className="text-sm text-[var(--color-text-secondary)]">This page doesn't exist in the FolioOne prototype.</p>
      <Link to="/">
        <Button variant="primary">Back to Overview</Button>
      </Link>
    </div>
  )
}
