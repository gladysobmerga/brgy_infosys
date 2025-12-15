import { useState } from 'react';
import { useMedicineStore } from '../../store/medicineStore';
import { useOrderStore } from '../../store/orderStore';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { Search, ShoppingCart, Plus, Minus, CheckCircle } from 'lucide-react';

export function AvailableMedicines() {
  const { medicines } = useMedicineStore();
  const { addOrder } = useOrderStore();
  const { currentUser } = useAuthStore();
  const { items, notes, addItem, removeItem, clearCart, getQuantity, setNotes } = useCartStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const availableMedicines = medicines.filter((m) => m.quantity > 0);
  const filteredMedicines = availableMedicines.filter(
    (med) =>
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.genericName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    if (!currentUser) return;

    // Check if all items have sufficient stock
    const insufficientStock = items.some((item) => {
      const medicine = medicines.find((m) => m.id === item.medicineId);
      return !medicine || medicine.quantity < item.quantity;
    });

    if (insufficientStock) {
      alert('Some items in your cart are out of stock or have insufficient quantity. Please adjust your cart.');
      return;
    }

    addOrder({
      userId: currentUser.id,
      items: items,
      notes,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });

    clearCart();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search medicines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMedicines.map((medicine) => {
            const cartQty = getQuantity(medicine.id);
            return (
              <div key={medicine.id} className="bg-white rounded-lg shadow-sm p-4">
                <div className="mb-3">
                  <h3 className="text-lg">{medicine.name}</h3>
                  <p className="text-sm text-gray-600">{medicine.genericName}</p>
                  <p className="text-sm text-gray-500">{medicine.dosage}</p>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">
                    Available: {medicine.quantity} {medicine.unit}
                  </span>
                  {medicine.expiryDate && (
                    <span className="text-xs text-gray-500">
                      Exp: {new Date(medicine.expiryDate).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {cartQty > 0 ? (
                  <div className="flex items-center justify-between bg-green-50 rounded-lg p-2">
                    <button
                      onClick={() => removeItem(medicine.id)}
                      className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4">{cartQty}</span>
                    <button
                      onClick={() => addItem(medicine.id)}
                      disabled={cartQty >= medicine.quantity}
                      className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => addItem(medicine.id)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {filteredMedicines.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center text-gray-500">
            No medicines available
          </div>
        )}
      </div>

      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
          <h3 className="text-lg mb-4 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Your Cart ({items.length})
          </h3>

          {showSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-sm text-green-800">Order placed successfully!</p>
            </div>
          )}

          {items.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">Your cart is empty</p>
          ) : (
            <div className="space-y-4">
              <div className="space-y-3">
                {items.map((item) => {
                  const medicine = medicines.find((m) => m.id === item.medicineId);
                  if (!medicine) return null;
                  return (
                    <div key={item.medicineId} className="flex items-start justify-between text-sm">
                      <div className="flex-1">
                        <p>{medicine.name}</p>
                        <p className="text-xs text-gray-500">{medicine.dosage}</p>
                      </div>
                      <div className="text-right">
                        <p>x {item.quantity}</p>
                        <button
                          onClick={() => {
                            const currentQty = getQuantity(item.medicineId);
                            for (let i = 0; i < currentQty; i++) {
                              removeItem(item.medicineId);
                            }
                          }}
                          className="text-xs text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t">
                <label className="block text-sm text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  placeholder="Any special instructions or medical conditions..."
                />
              </div>

              <button
                onClick={handlePlaceOrder}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Place Order
              </button>

              <button
                onClick={clearCart}
                className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
              >
                Clear Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
