import { useMedicineStore } from '../store/medicineStore';
import { Pill, Users, AlertTriangle, TrendingUp } from 'lucide-react';

export function Dashboard() {
  const { medicines, patients, dispensingRecords } = useMedicineStore();

  const totalMedicines = medicines.length;
  const totalPatients = patients.length;
  const lowStockMedicines = medicines.filter((m) => m.quantity <= m.reorderLevel).length;
  const todayDispensed = dispensingRecords.filter(
    (r) => new Date(r.date).toDateString() === new Date().toDateString()
  ).length;

  const stats = [
    {
      label: 'Total Medicines',
      value: totalMedicines,
      icon: Pill,
      color: 'bg-blue-500',
    },
    {
      label: 'Registered Patients',
      value: totalPatients,
      icon: Users,
      color: 'bg-green-500',
    },
    {
      label: 'Low Stock Items',
      value: lowStockMedicines,
      icon: AlertTriangle,
      color: 'bg-orange-500',
    },
    {
      label: 'Dispensed Today',
      value: todayDispensed,
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
  ];

  const recentDispensing = dispensingRecords
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                  <p className="text-3xl mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl mb-4">Low Stock Alert</h2>
          <div className="space-y-3">
            {lowStockMedicines === 0 ? (
              <p className="text-gray-500">All medicines are well-stocked</p>
            ) : (
              medicines
                .filter((m) => m.quantity <= m.reorderLevel)
                .map((medicine) => (
                  <div
                    key={medicine.id}
                    className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200"
                  >
                    <div>
                      <p>{medicine.name}</p>
                      <p className="text-sm text-gray-600">{medicine.dosage}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-orange-600">{medicine.quantity} left</p>
                      <p className="text-xs text-gray-500">
                        Reorder at: {medicine.reorderLevel}
                      </p>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl mb-4">Recent Dispensing</h2>
          <div className="space-y-3">
            {recentDispensing.length === 0 ? (
              <p className="text-gray-500">No dispensing records yet</p>
            ) : (
              recentDispensing.map((record) => {
                const patient = patients.find((p) => p.id === record.patientId);
                const medicine = medicines.find((m) => m.id === record.medicineId);
                return (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p>{patient?.name || 'Unknown Patient'}</p>
                      <p className="text-sm text-gray-600">
                        {medicine?.name || 'Unknown Medicine'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">Qty: {record.quantity}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(record.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
