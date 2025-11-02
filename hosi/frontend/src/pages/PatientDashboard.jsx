// pages/PatientDashboard.js
import React, { useState } from 'react';

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState('appointments');

  // Mock data
  const upcomingAppointments = [
    { id: 1, doctor: 'Dr. Sarah Chen', date: '2024-01-20', time: '10:00', status: 'Confirmed' },
    { id: 2, doctor: 'Dr. James Wilson', date: '2024-01-22', time: '14:00', status: 'Confirmed' }
  ];

  const medicalHistory = [
    { id: 1, date: '2024-01-15', doctor: 'Dr. Sarah Chen', diagnosis: 'Regular Checkup', prescription: 'Multivitamins' },
    { id: 2, date: '2023-12-10', doctor: 'Dr. Michael Rodriguez', diagnosis: 'Headache', prescription: 'Pain relievers' }
  ];

  const bills = [
    { id: 1, date: '2024-01-15', amount: '$150', status: 'Paid' },
    { id: 2, date: '2024-01-20', amount: '$200', status: 'Pending' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Patient Dashboard</h1>
              <p className="text-gray-600">Welcome back, John Smith</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                🔔 Notifications
              </button>
              <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
                👤 Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            {['appointments', 'medical', 'bills', 'profile'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
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
              <h2 className="text-2xl font-bold text-gray-800">Upcoming Appointments</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Book New Appointment
              </button>
            </div>
            <div className="grid gap-4">
              {upcomingAppointments.map(appointment => (
                <div key={appointment.id} className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-lg">{appointment.doctor}</h3>
                      <p className="text-gray-600">{appointment.date} at {appointment.time}</p>
                    </div>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'medical' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Medical History</h2>
            <div className="grid gap-4">
              {medicalHistory.map(record => (
                <div key={record.id} className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{record.doctor}</h3>
                      <p className="text-gray-600">Date: {record.date}</p>
                      <p className="text-gray-600">Diagnosis: {record.diagnosis}</p>
                      <p className="text-gray-600">Prescription: {record.prescription}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'bills' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Bills & Payments</h2>
            <div className="grid gap-4">
              {bills.map(bill => (
                <div key={bill.id} className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-lg">Bill #{bill.id}</h3>
                      <p className="text-gray-600">Date: {bill.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">{bill.amount}</p>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        bill.status === 'Paid' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {bill.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input type="text" className="w-full p-2 border rounded" defaultValue="John" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input type="text" className="w-full p-2 border rounded" defaultValue="Smith" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input type="email" className="w-full p-2 border rounded" defaultValue="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input type="tel" className="w-full p-2 border rounded" defaultValue="+1 234 567 8900" />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Update Profile
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;