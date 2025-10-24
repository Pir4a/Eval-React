import LaserBg from '@/shared/organisms/laserBg'
import UserList from '../features/users/components/UserList'

export default function Home() {
  return (
    <div className="relative">
      
      <LaserBg><UserList /></LaserBg>
    </div>
  )
}


