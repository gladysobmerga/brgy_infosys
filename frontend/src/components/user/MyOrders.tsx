import { useOrderStore } from '../../store/orderStore';
import { useMedicineStore } from '../../store/medicineStore';
import { useAuthStore } from '../../store/authStore';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';

export function MyOrders() {
  const { orders } = useOrderStore();
  const { medicines } = useMedicineStore();
  const { currentUser } = useAuthStore();

  const myOrders = orders
    .filter((order) => order.userId === currentUser?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'approved':
        return <Package className="w-5 h-5 text-blue-600" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Your order is being reviewed';
      case 'approved':
        return 'Your order has been approved. Ready for pickup.';
      case 'completed':
        return 'Order completed';
      case 'rejected':
        return 'Your order was rejected. Please contact the health center.';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {myOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl text-gray-600 mb-2">No orders yet</h3>
          <p className="text-gray-500">Start ordering medicines to see your order history</p>
        </div>
      ) : (
        myOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg">Order #{order.id.slice(0, 8)}</h3>
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs border ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusIcon(order.status)}
                    <span className="capitalize">{order.status}</span>
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Placed on {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm mb-3">Order Items:</p>
              <div className="space-y-2">
                {order.items.map((item, idx) => {
                  const medicine = medicines.find((m) => m.id === item.medicineId);
                  return (
                    <div key={idx} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm">{medicine?.name || 'Unknown Medicine'}</p>
                        <p className="text-xs text-gray-500">
                          {medicine?.genericName} - {medicine?.dosage}
                        </p>
                      </div>
                      <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {order.notes && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-1">Your Notes:</p>
                <p className="text-sm bg-blue-50 p-3 rounded-lg">{order.notes}</p>
              </div>
            )}

            <div className={`p-3 rounded-lg border flex items-start gap-2 ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
              <div>
                <p className="text-sm">{getStatusMessage(order.status)}</p>
                {order.status === 'approved' && (
                  <p className="text-xs mt-1">Please visit the Barangay Health Center to collect your medicine.</p>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
