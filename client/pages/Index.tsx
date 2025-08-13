import SlidingHero from '../components/SlidingHero';
import FeaturesSection from '../components/FeaturesSection';
import SlidingTestimonials from '../components/SlidingTestimonials';
import DeliveryPartners from '../components/DeliveryPartners';

export default function Index() {
  return (
    <div className="min-h-screen">
      <SlidingHero />
      <FeaturesSection />
      <SlidingTestimonials />
      <DeliveryPartners />
    </div>
  );
}
