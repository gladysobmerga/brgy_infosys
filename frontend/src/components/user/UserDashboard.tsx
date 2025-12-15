import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { AvailableMedicines } from './AvailableMedicines';
import { MyOrders } from './MyOrders';
import { Pill, ShoppingCart, LogOut, User } from 'lucide-react';

type TabType = 'medicines' | 'orders';

export function UserDashboard() {
  const { currentUser, logout } = useAuthStore();
  const { items } = useCartStore();
  const [activeTab, setActiveTab] = useState<TabType>('medicines');

  const tabs = [
    { id: 'medicines' as TabType, label: 'Available Medicines', icon: Pill },
    { id: 'orders' as TabType, label: 'My Orders', icon: ShoppingCart },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl">Barangay Medicine Portal</h1>
              <p className="text-green-100 mt-1">Order medicines online</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-sm opacity-90">{currentUser?.name}</p>
                <p className="text-xs opacity-75">{currentUser?.email}</p>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-800 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <User className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg">Welcome, {currentUser?.name}!</h2>
              <p className="text-sm text-gray-600">
                {currentUser?.address} • {currentUser?.contactNumber}
              </p>
            </div>
          </div>
        </div>

        <nav className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const itemCount = tab.id === 'medicines' && items.length > 0 ? items.length : null;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors relative ${
                    activeTab === tab.id
                      ? 'border-green-600 text-green-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                  {itemCount && (
                    <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        <main>
          {activeTab === 'medicines' && <AvailableMedicines />}
          {activeTab === 'orders' && <MyOrders />}
        </main>
      </div>
    </div>
  );
}