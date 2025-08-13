import SlidingHero from '../components/SlidingHero';
import SlidingTestimonials from '../components/SlidingTestimonials';
import DeliveryPartners from '../components/DeliveryPartners';

export default function Index() {
  return (
    <div className="min-h-screen">
      <SlidingHero />
      <SlidingTestimonials />
      <DeliveryPartners />
    </div>
  );
}
