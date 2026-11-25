import { CulinaryCarousel } from '../features/culinary-carousel/CulinaryCarousel'
import { MotionProvider } from './MotionProvider'

export function App() {
  return (
    <MotionProvider>
      <CulinaryCarousel />
    </MotionProvider>
  )
}
