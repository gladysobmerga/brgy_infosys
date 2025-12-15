import { useState } from 'react';
import { useMedicineStore } from '../../store/medicineStore';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { useSettingsStore } from '../../store/settingsStore';
import { Search, ShoppingCart, Plus, Minus, Heart, Lock, Phone, MapPin, Mail, Users, HelpCircle } from 'lucide-react';

export function PublicLanding() {
  const { medicines } = useMedicineStore();
  const { items, addItem, removeItem, clearCart, getQuantity } = useCartStore();
  const { setAuthView } = useAuthStore();
  const { settings } = useSettingsStore();
  const [searchTerm, setSearchTerm] = useState('');

  const availableMedicines = medicines.filter((m) => m.quantity > 0);
  const filteredMedicines = availableMedicines.filter(
    (med) =>
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.genericName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheckout = () => {
    if (items.length === 0) {
      alert('Your cart is empty');
      return;
    }
    setAuthView('user-auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Barangay Logo */}
              <div className="bg-gradient-to-br from-green-600 to-blue-600 p-3 rounded-lg flex items-center justify-center w-16 h-16">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl text-gray-900">{settings.barangayName}</h1>
                <p className="text-sm text-gray-600">Health Center - Medicine Portal</p>
              </div>
            </div>
            <button
              onClick={() => setAuthView('admin-login')}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300"
            >
              <Lock className="w-4 h-4" />
              Admin Login
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with Barangay Image */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl mb-3">Welcome to {settings.barangayName} Health Center</h2>
              <p className="text-gray-600 mb-4">
                Browse our available medicines and place your order online. Our health center is committed to providing quality healthcare services to all residents.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{settings.addressLine2}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{settings.contactPhone}</span>
                </div>
              </div>
            </div>
            {/* Barangay Image */}
            {settings.barangayImage ? (
              <img
                src={settings.barangayImage}
                alt={`${settings.barangayName} Health Center`}
                className="rounded-lg h-64 w-full object-cover shadow-md"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                  if (placeholder) placeholder.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              className="bg-gradient-to-br from-green-100 to-blue-100 rounded-lg h-64 flex items-center justify-center border-2 border-dashed border-gray-300"
              style={{ display: settings.barangayImage ? 'none' : 'flex' }}
            >
              <div className="text-center">
                <Heart className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Barangay Health Center Image</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search medicines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMedicines.map((medicine) => {
                const cartQty = getQuantity(medicine.id);
                return (
                  <div key={medicine.id} className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="mb-3">
                      <h3 className="text-lg">{medicine.name}</h3>
                      <p className="text-sm text-gray-600">{medicine.genericName}</p>
                      <p className="text-sm text-gray-500">{medicine.dosage}</p>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-green-600">
                        ✓ Available: {medicine.quantity} {medicine.unit}
                      </span>
                      {medicine.expiryDate && (
                        <span className="text-xs text-gray-500">
                          Exp: {new Date(medicine.expiryDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    {cartQty > 0 ? (
                      <div className="flex items-center justify-between bg-green-50 rounded-lg p-2 border border-green-200">
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
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6 border border-gray-200">
              <h3 className="text-lg mb-4 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-green-600" />
                Your Cart ({items.length})
              </h3>

              {items.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">Your cart is empty</p>
                  <p className="text-xs text-gray-400 mt-1">Add medicines to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {items.map((item) => {
                      const medicine = medicines.find((m) => m.id === item.medicineId);
                      if (!medicine) return null;
                      return (
                        <div key={item.medicineId} className="flex items-start justify-between text-sm bg-gray-50 p-3 rounded-lg">
                          <div className="flex-1">
                            <p>{medicine.name}</p>
                            <p className="text-xs text-gray-500">{medicine.dosage}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-green-600">x {item.quantity}</p>
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
                    <button
                      onClick={handleCheckout}
                      className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                    >
                      Login to Complete Order
                    </button>
                    <p className="text-xs text-gray-500 text-center mt-2">
                      You'll need to login or create an account
                    </p>
                  </div>

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
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Contact Information */}
            <div>
              <h3 className="text-white text-lg mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Contact Us
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm">Barangay San Jose Health Center</p>
                    <p className="text-sm text-gray-400">Main Street, San Jose</p>
                    <p className="text-sm text-gray-400">Municipality, Province 1234</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-sm">(123) 456-7890</p>
                    <p className="text-sm text-gray-400">Mon-Fri, 8:00 AM - 5:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-green-400" />
                  <p className="text-sm">healthcenter@brgy-sanjose.gov.ph</p>
                </div>
              </div>
            </div>

            {/* About Us - Barangay Officials */}
            <div>
              <h3 className="text-white text-lg mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Barangay Officials
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-white">Hon. Juan Dela Cruz</p>
                  <p className="text-gray-400">Barangay Captain</p>
                </div>
                <div>
                  <p className="text-white">Maria Santos</p>
                  <p className="text-gray-400">Barangay Health Worker</p>
                </div>
                <div>
                  <p className="text-white">Dr. Pedro Reyes</p>
                  <p className="text-gray-400">Health Center Physician</p>
                </div>
                <div className="pt-2">
                  <p className="text-xs text-gray-400">Serving the community since 1995</p>
                </div>
              </div>
            </div>

            {/* Frequently Asked Questions */}
            <div>
              <h3 className="text-white text-lg mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                Frequently Asked Questions
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-white mb-1">How do I order medicines?</p>
                  <p className="text-gray-400">Browse available medicines, add to cart, then login or register to complete your order.</p>
                </div>
                <div>
                  <p className="text-white mb-1">When can I pick up my order?</p>
                  <p className="text-gray-400">Once approved, you can pick up your order during health center hours ({settings.pickupSchedule}).</p>
                </div>
                <div>
                  <p className="text-white mb-1">Is this service free?</p>
                  <p className="text-gray-400">Yes, medicines are provided free of charge to registered barangay residents.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Google Maps Location */}
          <div className="mb-8">
            <h3 className="text-white text-lg mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Our Location
            </h3>
            <div className="rounded-lg overflow-hidden border-2 border-gray-700 h-64">
              <iframe
                src={settings.googleMapsEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${settings.barangayName} Health Center Location`}
              ></iframe>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 {settings.barangayName} Health Center. All rights reserved.</p>
            <p className="mt-2">Medicine Information System</p>
          </div>
        </div>
      </footer>
    </div>
  );
}