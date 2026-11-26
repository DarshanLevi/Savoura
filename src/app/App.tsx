import { DishDisplay } from '../features/dish-display/DishDisplay'
import { CulinaryCarousel } from '../features/culinary-carousel/CulinaryCarousel'
import { MotionProvider } from './MotionProvider'
import { ScrollHandle } from './ScrollHandle'

export function App() {
  return (
    <MotionProvider>
      <CulinaryCarousel />
      <DishDisplay />
      <ScrollHandle />
    </MotionProvider>
  )
}
