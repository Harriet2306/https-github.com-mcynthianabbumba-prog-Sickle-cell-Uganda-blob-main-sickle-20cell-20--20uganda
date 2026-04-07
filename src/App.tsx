import React, { useState } from 'react';
import { useAuth, AuthButton } from './components/Auth';
import { HealthLogs } from './components/HealthLogs';
import { Community } from './components/Community';
import { Education } from './components/Education';
import { PatientProfile } from './components/PatientProfile';
import { 
  Heart, 
  LayoutDashboard, 
  MessageSquare, 
  BookOpen, 
  User as UserIcon,
  Menu,
  X,
  Droplets
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Tab = 'dashboard' | 'community' | 'education' | 'profile';

export default function App() {
  const { user, profile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-gray-500">Loading Sickle Cell Uganda...</p>
        </div>
      </div>
    );
  }

  const NavItem = ({ tab, icon: Icon, label }: { tab: Tab; icon: any; label: string }) => (
    <button
      onClick={() => {
        setActiveTab(tab);
        setIsMenuOpen(false);
      }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        activeTab === tab 
          ? 'bg-red-600 text-white shadow-lg shadow-red-100' 
          : 'text-gray-500 hover:bg-red-50 hover:text-red-600'
      }`}
    >
      <Icon size={20} />
      <span className="font-semibold text-sm">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-red-600 rounded-lg text-white">
            <Droplets size={20} />
          </div>
          <h1 className="font-bold text-gray-900 tracking-tight">Sickle Cell Uganda</h1>
        </div>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 text-gray-600"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar / Navigation */}
      <AnimatePresence>
        {(isMenuOpen || window.innerWidth >= 768) && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-white border-r border-gray-100 p-6 flex flex-col z-40 ${
              isMenuOpen ? 'block' : 'hidden md:flex'
            }`}
          >
            <div className="hidden md:flex items-center gap-3 mb-10">
              <div className="p-2 bg-red-600 rounded-xl text-white shadow-lg shadow-red-100">
                <Droplets size={24} />
              </div>
              <h1 className="font-bold text-xl text-gray-900 tracking-tight leading-tight">
                Sickle Cell<br />Uganda
              </h1>
            </div>

            <nav className="flex-1 space-y-2">
              <NavItem tab="dashboard" icon={LayoutDashboard} label="Dashboard" />
              <NavItem tab="community" icon={MessageSquare} label="Community" />
              <NavItem tab="education" icon={BookOpen} label="Education" />
              <NavItem tab="profile" icon={UserIcon} label="My Profile" />
            </nav>

            <div className="mt-auto pt-6 border-t border-gray-100">
              <AuthButton />
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">
        {!user ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto py-20">
            <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-red-600 mb-6">
              <Heart size={40} fill="currentColor" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Sickle Cell Uganda</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Join our community to manage your health, connect with others, and stay informed about sickle cell care in Uganda.
            </p>
            <AuthButton />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && (
                <div className="space-y-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Hello, {user.displayName?.split(' ')[0]}!</h2>
                      <p className="text-gray-500 text-sm">Here's your health overview for today.</p>
                    </div>
                    <div className="bg-red-50 px-4 py-2 rounded-xl flex items-center gap-3">
                      <div className="p-1.5 bg-red-100 rounded-lg text-red-600">
                        <Heart size={18} />
                      </div>
                      <span className="text-xs font-bold text-red-900 uppercase tracking-wider">Stay Strong</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                      <HealthLogs patientId={user.uid} userId={user.uid} />
                    </div>
                    <div className="space-y-8">
                      <PatientProfile userId={user.uid} />
                      <div className="bg-gradient-to-br from-red-600 to-red-700 p-6 rounded-2xl text-white shadow-xl shadow-red-100">
                        <h3 className="font-bold mb-2">Quick Tip</h3>
                        <p className="text-sm text-red-50 opacity-90 leading-relaxed">
                          Remember to drink at least 8 glasses of water today to keep your blood flowing smoothly.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'community' && (
                <Community userId={user.uid} userName={user.displayName || 'Anonymous'} />
              )}

              {activeTab === 'education' && (
                <Education />
              )}

              {activeTab === 'profile' && (
                <div className="max-w-2xl mx-auto">
                  <PatientProfile userId={user.uid} />
                  <div className="mt-8 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4">Account Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-gray-50">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Email Address</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <span className="text-[10px] bg-green-50 text-green-600 px-2 py-1 rounded-full font-bold uppercase">Verified</span>
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">User ID</p>
                          <p className="text-xs text-gray-500 font-mono">{user.uid}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}
