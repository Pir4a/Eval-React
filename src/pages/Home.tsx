import LaserBg from '@/shared/organisms/laserBg'
import UserList from '../features/users/components/UserList'
import { useEffect, useRef } from 'react'
import toast from 'react-hot-toast'

export default function Home() {
  const hasShownWelcomeRef = useRef(false)

  useEffect(() => {
    if (!hasShownWelcomeRef.current) {
      hasShownWelcomeRef.current = true
      toast('Bienvenue 👋', { icon: '👋' })
    }
  }, [])

  return (
    <div className="relative">
      <LaserBg><UserList /></LaserBg>
    </div>
  )
}


