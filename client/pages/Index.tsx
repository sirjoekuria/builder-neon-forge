import Hero from '../components/Hero';
import PriceEstimator from '../components/PriceEstimator';
import Testimonials from '../components/Testimonials';

export default function Index() {
  return (
    <div className="min-h-screen">
      <Hero />
      <PriceEstimator />
      <Testimonials />
    </div>
  );
}
