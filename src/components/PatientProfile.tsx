import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { User, Save, Heart, Calendar, Droplet, Users } from 'lucide-react';
import { motion } from 'motion/react';

interface PatientProfileData {
  uid: string;
  fullName: string;
  dateOfBirth: string;
  bloodGroup: string;
  genotype: string;
  caregiverId: string;
}

export const PatientProfile = ({ userId }: { userId: string }) => {
  const [profile, setProfile] = useState<PatientProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<PatientProfileData>({
    uid: userId,
    fullName: '',
    dateOfBirth: '',
    bloodGroup: 'O+',
    genotype: 'SS',
    caregiverId: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const docRef = doc(db, 'patients', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as PatientProfileData;
        setProfile(data);
        setFormData(data);
      } else {
        setIsEditing(true);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'patients', userId), formData);
      setProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  if (!isEditing && profile) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <User className="text-red-600" />
            Patient Profile
          </h2>
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm font-medium text-red-600 hover:underline"
          >
            Edit Profile
          </button>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Full Name</p>
            <p className="text-sm font-semibold text-gray-900">{profile.fullName}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Genotype</p>
            <p className="text-sm font-semibold text-red-600">{profile.genotype}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Blood Group</p>
            <p className="text-sm font-semibold text-gray-900">{profile.bloodGroup}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Date of Birth</p>
            <p className="text-sm font-semibold text-gray-900">{profile.dateOfBirth}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm space-y-4">
      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
        <User className="text-red-600" />
        {profile ? 'Edit Profile' : 'Complete Your Profile'}
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Full Name</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full p-2 border border-gray-200 rounded-lg text-sm"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Genotype</label>
            <select
              value={formData.genotype}
              onChange={(e) => setFormData({ ...formData, genotype: e.target.value })}
              className="w-full p-2 border border-gray-200 rounded-lg text-sm"
            >
              <option value="SS">SS</option>
              <option value="SC">SC</option>
              <option value="Sβ0">Sβ0</option>
              <option value="Sβ+">Sβ+</option>
              <option value="AS">AS (Carrier)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Blood Group</label>
            <select
              value={formData.bloodGroup}
              onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
              className="w-full p-2 border border-gray-200 rounded-lg text-sm"
            >
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Date of Birth</label>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            className="w-full p-2 border border-gray-200 rounded-lg text-sm"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm flex items-center justify-center gap-2"
      >
        <Save size={16} />
        Save Profile
      </button>
    </form>
  );
};
