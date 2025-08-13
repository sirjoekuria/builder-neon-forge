import OrderForm from '../components/OrderForm';

export default function BookDelivery() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <OrderForm />
        </div>
      </div>
    </div>
  );
}
