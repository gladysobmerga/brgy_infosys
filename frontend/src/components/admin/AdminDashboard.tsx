import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Dashboard } from '../Dashboard';
import { MedicineInventory } from '../MedicineInventory';
import { PatientRecords } from '../PatientRecords';
import { DispenseMedicine } from '../DispenseMedicine';
import { OrderManagement } from './OrderManagement';
import { BarangaySettings } from './BarangaySettings';
import { Pill, Users, FileText, LayoutDashboard, ShoppingCart, LogOut, Settings, Menu, X } from 'lucide-react';

type TabType = 'dashboard' | 'inventory' | 'patients' | 'dispense' | 'orders' | 'settings';

export function AdminDashboard() {
  const { currentUser, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory' as TabType, label: 'Medicine Inventory', icon: Pill },
    { id: 'patients' as TabType, label: 'Patient Records', icon: Users },
    { id: 'dispense' as TabType, label: 'Dispense Medicine', icon: FileText },
    { id: 'orders' as TabType, label: 'User Orders', icon: ShoppingCart },
    { id: 'settings' as TabType, label: 'Barangay Settings', icon: Settings },
  ];

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const handleMenuClick = (tabId: TabType) => {
    setActiveTab(tabId);
    setSidebarOpen(false); // Close sidebar on mobile after selecting
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-blue-900 text-white transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg">Admin Panel</h2>
                <p className="text-xs text-blue-300">{currentUser?.name}</p>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 hover:bg-blue-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-700 text-white'
                      : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-blue-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-blue-100 hover:bg-blue-800 hover:text-white rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </button>
              <div>
                <h1 className="text-xl md:text-2xl text-gray-900">
                  Barangay Medicine System
                </h1>
                <p className="text-sm text-gray-600">Health Center Management Portal</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-lg">
              <div className="text-right">
                <p className="text-sm text-gray-900">{currentUser?.name}</p>
                <p className="text-xs text-blue-600 uppercase">{currentUser?.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'inventory' && <MedicineInventory />}
          {activeTab === 'patients' && <PatientRecords />}
          {activeTab === 'dispense' && <DispenseMedicine />}
          {activeTab === 'orders' && <OrderManagement />}
          {activeTab === 'settings' && <BarangaySettings />}
        </main>
      </div>
    </div>
  );
}
