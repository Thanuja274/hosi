// pages/DoctorDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const fetchDoctorData = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      setUser(userData);

      if (!userData) {
        navigate('/login');
        return;
      }

      // Fetch doctor profile
      const doctorResult = await api.getDoctorByUserId(userData.id);
      if (doctorResult.success) {
        setDoctorProfile(doctorResult.data);
      }

      // Fetch doctor's appointments (you'll need to create this endpoint)
      const appointmentsResult = await api.getAppointments();
      if (appointmentsResult.success) {
        setAppointments(appointmentsResult.data || []);
      }

      // Mock patients data for now
      setPatients([
        { id: 1, name: 'John Smith', lastVisit: '2024-01-15', condition: 'Hypertension' },
        { id: 2, name: 'Sarah Johnson', lastVisit: '2024-01-10', condition: 'Migraine' }
      ]);

    } catch (error) {
      console.error('Error fetching doctor data:', error);
      alert('Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      // You'll need to create this API endpoint
      const result = await api.updateAppointment(appointmentId, { status });
      if (result.success) {
        alert('Appointment status updated');
        fetchDoctorData(); // Refresh data
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert('Error updating appointment');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Doctor Dashboard</h1>
              <p className="text-gray-600">
                Welcome back, Dr. {user?.firstName} {user?.lastName}
                {doctorProfile && ` - ${doctorProfile.specialization}`}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setActiveTab('schedule')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                📅 Schedule
              </button>
              <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                👤 Profile
              </button>
              <button 
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                🚪 Logout
              </button>
            </div>
          </div>

          {/* Doctor Stats */}
          {doctorProfile && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-600">Specialization</p>
                <p className="text-lg font-semibold text-blue-800">{doctorProfile.specialization}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-green-600">Experience</p>
                <p className="text-lg font-semibold text-green-800">{doctorProfile.experience} years</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <p className="text-sm text-purple-600">Rating</p>
                <p className="text-lg font-semibold text-purple-800">⭐ {doctorProfile.rating || '4.8'}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <p className="text-sm text-orange-600">Consultation Fee</p>
                <p className="text-lg font-semibold text-orange-800">${doctorProfile.consultationFee}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { key: 'appointments', label: 'Appointments', icon: '📋' },
              { key: 'patients', label: 'Patients', icon: '👥' },
              { key: 'records', label: 'Records', icon: '📁' },
              { key: 'schedule', label: 'Schedule', icon: '📅' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Today's Appointments</h2>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {appointments.length} appointments
              </span>
            </div>
            
            {appointments.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
                <p className="text-gray-500 text-lg">No appointments scheduled for today</p>
                <p className="text-gray-400 mt-2">Check back later or update your availability</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {appointments.map(appointment => (
                  <div key={appointment.id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-800">{appointment.patientName || 'Patient'}</h3>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Time:</span> {appointment.time || '10:00 AM'}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Date:</span> {appointment.date || 'Today'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Condition:</span> {appointment.condition || 'Checkup'}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Type:</span> {appointment.type || 'Consultation'}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          appointment.status === 'Completed' 
                            ? 'bg-green-100 text-green-800'
                            : appointment.status === 'Cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {appointment.status || 'Scheduled'}
                        </span>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => updateAppointmentStatus(appointment.id, 'Completed')}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                          >
                            Complete
                          </button>
                          <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'patients' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Patient List</h2>
            <div className="grid gap-4">
              {patients.map(patient => (
                <div key={patient.id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-800">{patient.name}</h3>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Last Visit:</span> {patient.lastVisit}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Condition:</span> {patient.condition}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Age:</span> {patient.age || '45'}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Phone:</span> {patient.phone || '+1-234-567-8900'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
                      View Records
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'records' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Medical Records</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Patient</label>
                    <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>John Smith</option>
                      <option>Sarah Johnson</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Visit Date</label>
                    <input type="date" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis</label>
                  <textarea 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    rows="3"
                    placeholder="Enter diagnosis..."
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prescription</label>
                  <textarea 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    rows="3"
                    placeholder="Enter prescription details..."
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    rows="3"
                    placeholder="Additional notes..."
                  ></textarea>
                </div>
                
                <div className="flex space-x-4">
                  <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold">
                    Save Record
                  </button>
                  <button type="button" className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold">
                    Clear Form
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Schedule Management</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-lg mb-4">Set Availability</h3>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                      <input 
                        type="date" 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Available Time Slots</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map(time => (
                          <label key={time} className="flex items-center p-2 border border-gray-300 rounded hover:bg-gray-50 cursor-pointer">
                            <input type="checkbox" className="mr-2 h-4 w-4 text-blue-600" />
                            <span className="text-sm">{time}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold">
                      Update Schedule
                    </button>
                  </form>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-4">Current Schedule</h3>
                  <div className="space-y-4">
                    <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                      <p className="font-semibold text-green-800">Today's Schedule</p>
                      <p className="text-sm text-green-600 mt-1">Available: 09:00 AM - 12:00 PM, 02:00 PM - 06:00 PM</p>
                    </div>
                    
                    <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                      <p className="font-semibold text-blue-800">Next Leave</p>
                      <p className="text-sm text-blue-600 mt-1">January 25-26, 2024</p>
                      <p className="text-xs text-blue-500 mt-1">Status: Approved</p>
                    </div>
                    
                    <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                      Apply for Leave
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;