// pages/AdminDashboard.js
import React, { useState } from 'react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data
  const stats = {
    totalAppointments: 156,
    totalPatients: 89,
    totalDoctors: 12,
    revenue: '$45,670'
  };

  const recentAppointments = [
    { id: 1, patient: 'John Smith', doctor: 'Dr. Sarah Chen', date: '2024-01-20', status: 'Completed' },
    { id: 2, patient: 'Sarah Johnson', doctor: 'Dr. Michael Rodriguez', date: '2024-01-20', status: 'Pending' }
  ];

  const users = [
    { id: 1, name: 'Dr. Sarah Chen', type: 'Doctor', email: 'sarah@medicare.com', status: 'Active' },
    { id: 2, name: 'John Smith', type: 'Patient', email: 'john@example.com', status: 'Active' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="text-gray-600">System Administration Panel</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                📊 Reports
              </button>
              <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
                👤 Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            {['overview', 'users', 'reports', 'system'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-purple-500 text-purple-600'
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
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-800">Total Appointments</h3>
                <p className="text-3xl font-bold text-blue-600">{stats.totalAppointments}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-800">Total Patients</h3>
                <p className="text-3xl font-bold text-green-600">{stats.totalPatients}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-800">Total Doctors</h3>
                <p className="text-3xl font-bold text-purple-600">{stats.totalDoctors}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-800">Revenue</h3>
                <p className="text-3xl font-bold text-orange-600">{stats.revenue}</p>
              </div>
            </div>

            {/* Recent Appointments */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-semibold mb-4">Recent Appointments</h3>
              <div className="space-y-4">
                {recentAppointments.map(appointment => (
                  <div key={appointment.id} className="flex justify-between items-center p-4 border rounded">
                    <div>
                      <h4 className="font-semibold">{appointment.patient}</h4>
                      <p className="text-sm text-gray-600">With {appointment.doctor}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{appointment.date}</p>
                      <span className={`px-2 py-1 rounded text-xs ${
                        appointment.status === 'Completed' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
              <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                Add New User
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Name</th>
                    <th className="text-left p-4">Type</th>
                    <th className="text-left p-4">Email</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="border-b">
                      <td className="p-4">{user.name}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          user.type === 'Doctor' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.type}
                        </span>
                      </td>
                      <td className="p-4">{user.email}</td>
                      <td className="p-4">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                          {user.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <button className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                        <button className="text-red-600 hover:text-red-800">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Reports & Analytics</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="font-semibold text-lg mb-4">Appointment Reports</h3>
                <div className="space-y-2">
                  <button className="w-full text-left p-3 border rounded hover:bg-gray-50">
                    Monthly Appointment Summary
                  </button>
                  <button className="w-full text-left p-3 border rounded hover:bg-gray-50">
                    Doctor Performance Report
                  </button>
                  <button className="w-full text-left p-3 border rounded hover:bg-gray-50">
                    Patient Visit Trends
                  </button>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="font-semibold text-lg mb-4">Financial Reports</h3>
                <div className="space-y-2">
                  <button className="w-full text-left p-3 border rounded hover:bg-gray-50">
                    Revenue Analysis
                  </button>
                  <button className="w-full text-left p-3 border rounded hover:bg-gray-50">
                    Billing Reports
                  </button>
                  <button className="w-full text-left p-3 border rounded hover:bg-gray-50">
                    Pharmacy Sales
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">System Settings</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="font-semibold text-lg mb-4">Access Control</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">User Roles</label>
                    <select className="w-full p-2 border rounded">
                      <option>Manage Doctor Permissions</option>
                      <option>Manage Staff Permissions</option>
                    </select>
                  </div>
                  <button className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700">
                    Update Permissions
                  </button>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="font-semibold text-lg mb-4">System Statistics</h3>
                <div className="space-y-2">
                  <p><strong>System Uptime:</strong> 99.8%</p>
                  <p><strong>Active Users:</strong> 45</p>
                  <p><strong>Storage Used:</strong> 2.3GB/10GB</p>
                  <p><strong>Last Backup:</strong> 2024-01-19 23:00</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;