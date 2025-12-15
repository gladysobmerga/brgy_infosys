import { useState } from 'react';
import { useOrderStore } from '../../store/orderStore';
import { useMedicineStore } from '../../store/medicineStore';
import { useAuthStore } from '../../store/authStore';
import { CheckCircle, XCircle, Clock, Package } from 'lucide-react';

export function OrderManagement() {
  const { orders, updateOrderStatus } = useOrderStore();
  const { medicines, updateMedicine } = useMedicineStore();
  const { users } = useAuthStore();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'completed'>('all');

  const filteredOrders = orders
    .filter((order) => filter === 'all' || order.status === filter)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleApprove = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    // Check if all medicines have sufficient stock
    const insufficientStock = order.items.some((item) => {
      const medicine = medicines.find((m) => m.id === item.medicineId);
      return !medicine || medicine.quantity < item.quantity;
    });

    if (insufficientStock) {
      alert('Insufficient stock for some items in this order');
      return;
    }

    updateOrderStatus(orderId, 'approved');
  };

  const handleComplete = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    // Deduct medicine quantities
    order.items.forEach((item) => {
      const medicine = medicines.find((m) => m.id === item.medicineId);
      if (medicine) {
        updateMedicine(item.medicineId, {
          quantity: medicine.quantity - item.quantity,
        });
      }
    });

    updateOrderStatus(orderId, 'completed');
  };

  const handleReject = (orderId: string) => {
    updateOrderStatus(orderId, 'rejected');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    approved: orders.filter((o) => o.status === 'approved').length,
    completed: orders.filter((o) => o.status === 'completed').length,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-600">Total Orders</p>
          <p className="text-2xl mt-1">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl mt-1 text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-600">Approved</p>
          <p className="text-2xl mt-1 text-blue-600">{stats.approved}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-600">Completed</p>
          <p className="text-2xl mt-1 text-green-600">{stats.completed}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex gap-2 mb-4">
          {(['all', 'pending', 'approved', 'rejected', 'completed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No orders found</p>
          ) : (
            filteredOrders.map((order) => {
              const user = users.find((u) => u.id === order.userId);
              return (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg">Order #{order.id.slice(0, 8)}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {user?.name} - {user?.contactNumber}
                      </p>
                      <p className="text-sm text-gray-500">{user?.address}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-sm mb-2">Order Items:</p>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => {
                        const medicine = medicines.find((m) => m.id === item.medicineId);
                        return (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <span>
                              {medicine?.name} ({medicine?.dosage})
                            </span>
                            <span className="text-gray-600">Qty: {item.quantity}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {order.notes && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500">Notes:</p>
                      <p className="text-sm">{order.notes}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {order.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(order.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(order.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </>
                    )}
                    {order.status === 'approved' && (
                      <button
                        onClick={() => handleComplete(order.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Package className="w-4 h-4" />
                        Mark as Completed
                      </button>
                    )}
                    {order.status === 'completed' && (
                      <div className="flex items-center gap-2 text-green-600 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        Order completed
                      </div>
                    )}
                    {order.status === 'rejected' && (
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <XCircle className="w-4 h-4" />
                        Order rejected
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
