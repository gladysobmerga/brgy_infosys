import { useState } from 'react';
import { useMedicineStore } from '../store/medicineStore';
import { CheckCircle, AlertCircle } from 'lucide-react';

export function DispenseMedicine() {
  const { patients, medicines, dispensingRecords, addDispensingRecord, updateMedicine } =
    useMedicineStore();
  const [formData, setFormData] = useState({
    patientId: '',
    medicineId: '',
    quantity: 1,
    notes: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const selectedMedicine = medicines.find((m) => m.id === formData.medicineId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedMedicine) {
      setError('Please select a medicine');
      return;
    }

    if (formData.quantity > selectedMedicine.quantity) {
      setError(`Insufficient stock. Only ${selectedMedicine.quantity} ${selectedMedicine.unit} available.`);
      return;
    }

    // Add dispensing record
    addDispensingRecord({
      patientId: formData.patientId,
      medicineId: formData.medicineId,
      quantity: formData.quantity,
      notes: formData.notes,
      date: new Date().toISOString(),
    });

    // Update medicine quantity
    updateMedicine(formData.medicineId, {
      quantity: selectedMedicine.quantity - formData.quantity,
    });

    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);

    // Reset form
    setFormData({
      patientId: '',
      medicineId: '',
      quantity: 1,
      notes: '',
    });
  };

  const patientHistory = formData.patientId
    ? dispensingRecords
        .filter((r) => r.patientId === formData.patientId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)
    : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl mb-6">Dispense Medicine</h2>

          {showSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-800">Medicine dispensed successfully!</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Patient *</label>
              <select
                required
                value={formData.patientId}
                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} - {patient.age} yrs, {patient.address}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Medicine *</label>
              <select
                required
                value={formData.medicineId}
                onChange={(e) => setFormData({ ...formData, medicineId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a medicine</option>
                {medicines
                  .filter((m) => m.quantity > 0)
                  .map((medicine) => (
                    <option key={medicine.id} value={medicine.id}>
                      {medicine.name} ({medicine.genericName}) - {medicine.dosage} - Stock:{' '}
                      {medicine.quantity} {medicine.unit}
                    </option>
                  ))}
              </select>
            </div>

            {selectedMedicine && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Generic Name</p>
                    <p>{selectedMedicine.genericName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Dosage</p>
                    <p>{selectedMedicine.dosage}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Available Stock</p>
                    <p className={selectedMedicine.quantity <= selectedMedicine.reorderLevel ? 'text-orange-600' : ''}>
                      {selectedMedicine.quantity} {selectedMedicine.unit}
                    </p>
                  </div>
                  {selectedMedicine.expiryDate && (
                    <div>
                      <p className="text-gray-600">Expiry Date</p>
                      <p>{new Date(selectedMedicine.expiryDate).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-700 mb-1">Quantity *</label>
              <input
                type="number"
                required
                min="1"
                max={selectedMedicine?.quantity || 999}
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add any notes or instructions..."
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Dispense Medicine
            </button>
          </form>
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg mb-4">Patient History</h3>
          {formData.patientId ? (
            <div className="space-y-3">
              {patientHistory.length === 0 ? (
                <p className="text-sm text-gray-500">No dispensing history for this patient</p>
              ) : (
                patientHistory.map((record) => {
                  const medicine = medicines.find((m) => m.id === record.medicineId);
                  return (
                    <div key={record.id} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm">{medicine?.name || 'Unknown'}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        Qty: {record.quantity} - {new Date(record.date).toLocaleDateString()}
                      </p>
                      {record.notes && (
                        <p className="text-xs text-gray-500 mt-1">{record.notes}</p>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Select a patient to view history</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h3 className="text-lg mb-4">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Patients</span>
              <span>{patients.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Available Medicines</span>
              <span>{medicines.filter((m) => m.quantity > 0).length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Dispensed</span>
              <span>{dispensingRecords.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
