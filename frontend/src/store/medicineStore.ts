import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  dosage: string;
  quantity: number;
  unit: string;
  reorderLevel: number;
  expiryDate: string;
  batchNumber: string;
  supplier: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  address: string;
  contactNumber: string;
  medicalConditions: string;
}

export interface DispensingRecord {
  id: string;
  patientId: string;
  medicineId: string;
  quantity: number;
  date: string;
  notes: string;
}

interface MedicineStore {
  medicines: Medicine[];
  patients: Patient[];
  dispensingRecords: DispensingRecord[];
  
  addMedicine: (medicine: Omit<Medicine, 'id'>) => void;
  updateMedicine: (id: string, medicine: Partial<Medicine>) => void;
  deleteMedicine: (id: string) => void;
  
  addPatient: (patient: Omit<Patient, 'id'>) => void;
  updatePatient: (id: string, patient: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  
  addDispensingRecord: (record: Omit<DispensingRecord, 'id'>) => void;
}

// Sample data
const sampleMedicines: Medicine[] = [
  {
    id: '1',
    name: 'Paracetamol',
    genericName: 'Acetaminophen',
    dosage: '500mg',
    quantity: 150,
    unit: 'tablets',
    reorderLevel: 50,
    expiryDate: '2025-12-31',
    batchNumber: 'PARA2024001',
    supplier: 'ABC Pharmaceuticals',
  },
  {
    id: '2',
    name: 'Amoxicillin',
    genericName: 'Amoxicillin',
    dosage: '500mg',
    quantity: 45,
    unit: 'capsules',
    reorderLevel: 50,
    expiryDate: '2025-06-30',
    batchNumber: 'AMOX2024002',
    supplier: 'XYZ Medical Supply',
  },
  {
    id: '3',
    name: 'Ibuprofen',
    genericName: 'Ibuprofen',
    dosage: '400mg',
    quantity: 200,
    unit: 'tablets',
    reorderLevel: 75,
    expiryDate: '2026-03-15',
    batchNumber: 'IBU2024003',
    supplier: 'ABC Pharmaceuticals',
  },
];

const samplePatients: Patient[] = [
  {
    id: '1',
    name: 'Juan Dela Cruz',
    age: 45,
    gender: 'Male',
    address: 'Purok 1, Barangay Health Center Area',
    contactNumber: '0912-345-6789',
    medicalConditions: 'Hypertension',
  },
  {
    id: '2',
    name: 'Maria Santos',
    age: 32,
    gender: 'Female',
    address: 'Purok 2, Barangay Health Center Area',
    contactNumber: '0923-456-7890',
    medicalConditions: '',
  },
];

const sampleDispensingRecords: DispensingRecord[] = [
  {
    id: '1',
    patientId: '1',
    medicineId: '1',
    quantity: 10,
    date: new Date().toISOString(),
    notes: 'For fever and headache',
  },
];

export const useMedicineStore = create<MedicineStore>()(
  persist(
    (set) => ({
      medicines: sampleMedicines,
      patients: samplePatients,
      dispensingRecords: sampleDispensingRecords,
      
      addMedicine: (medicine) =>
        set((state) => ({
          medicines: [...state.medicines, { ...medicine, id: Date.now().toString() }],
        })),
      
      updateMedicine: (id, medicine) =>
        set((state) => ({
          medicines: state.medicines.map((m) =>
            m.id === id ? { ...m, ...medicine } : m
          ),
        })),
      
      deleteMedicine: (id) =>
        set((state) => ({
          medicines: state.medicines.filter((m) => m.id !== id),
        })),
      
      addPatient: (patient) =>
        set((state) => ({
          patients: [...state.patients, { ...patient, id: Date.now().toString() }],
        })),
      
      updatePatient: (id, patient) =>
        set((state) => ({
          patients: state.patients.map((p) =>
            p.id === id ? { ...p, ...patient } : p
          ),
        })),
      
      deletePatient: (id) =>
        set((state) => ({
          patients: state.patients.filter((p) => p.id !== id),
        })),
      
      addDispensingRecord: (record) =>
        set((state) => ({
          dispensingRecords: [
            ...state.dispensingRecords,
            { ...record, id: Date.now().toString() },
          ],
        })),
    }),
    {
      name: 'medicine-storage',
    }
  )
);