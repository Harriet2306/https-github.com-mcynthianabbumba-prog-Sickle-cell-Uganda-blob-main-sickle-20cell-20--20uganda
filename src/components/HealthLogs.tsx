import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { Activity, Plus, History, AlertCircle, Calendar, HeartPulse } from 'lucide-react';
import { motion } from 'motion/react';

interface HealthRecord {
  id: string;
  patientId: string;
  date: any;
  type: 'crisis' | 'checkup' | 'medication' | 'other';
  description: string;
  severity: number;
  recordedBy: string;
}

export const HealthLogs = ({ patientId, userId }: { patientId: string; userId: string }) => {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newRecord, setNewRecord] = useState({
    type: 'crisis' as HealthRecord['type'],
    description: '',
    severity: 5
  });

  useEffect(() => {
    if (!patientId) return;

    const q = query(
      collection(db, 'health_records'),
      where('patientId', '==', patientId),
      orderBy('date', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as HealthRecord[];
      setRecords(data);
    }, (error) => {
      console.error("Error fetching health records:", error);
    });

    return () => unsubscribe();
  }, [patientId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'health_records'), {
        patientId,
        ...newRecord,
        date: serverTimestamp(),
        recordedBy: userId
      });
      setIsAdding(false);
      setNewRecord({ type: 'crisis', description: '', severity: 5 });
    } catch (error) {
      console.error("Error adding record:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <HeartPulse className="text-red-600" />
          Health Logs
        </h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
        >
          <Plus size={16} />
          {isAdding ? 'Cancel' : 'Log Event'}
        </button>
      </div>

      {isAdding && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded-xl border border-red-100 shadow-sm space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Type</label>
              <select
                value={newRecord.type}
                onChange={(e) => setNewRecord({ ...newRecord, type: e.target.value as any })}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm"
              >
                <option value="crisis">Crisis</option>
                <option value="checkup">Checkup</option>
                <option value="medication">Medication</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Severity (1-10)</label>
              <input
                type="range"
                min="1"
                max="10"
                value={newRecord.severity}
                onChange={(e) => setNewRecord({ ...newRecord, severity: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>Mild</span>
                <span>Severe</span>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Description</label>
            <textarea
              value={newRecord.description}
              onChange={(e) => setNewRecord({ ...newRecord, description: e.target.value })}
              placeholder="Describe what happened..."
              className="w-full p-2 border border-gray-200 rounded-lg text-sm h-20"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
          >
            Save Record
          </button>
        </motion.form>
      )}

      <div className="space-y-3">
        {records.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <History size={40} className="mx-auto mb-2 opacity-20" />
            <p className="text-sm">No health records yet.</p>
          </div>
        ) : (
          records.map((record) => (
            <div key={record.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-4">
              <div className={`p-2 rounded-lg h-fit ${
                record.type === 'crisis' ? 'bg-red-50 text-red-600' : 
                record.type === 'checkup' ? 'bg-blue-50 text-blue-600' : 
                'bg-green-50 text-green-600'
              }`}>
                {record.type === 'crisis' ? <AlertCircle size={20} /> : <Calendar size={20} />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-gray-900 capitalize">{record.type}</span>
                  <span className="text-[10px] text-gray-400">
                    {record.date?.toDate().toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{record.description}</p>
                {record.severity > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${record.severity > 7 ? 'bg-red-500' : record.severity > 4 ? 'bg-orange-400' : 'bg-green-400'}`}
                        style={{ width: `${record.severity * 10}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-gray-500">{record.severity}/10</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
