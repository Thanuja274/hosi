// pages/Dashboard.js
import React, { useState, useEffect } from "react";
import { FiBell, FiDownload, FiCheck, FiX, FiPlus, FiTrash2 } from "react-icons/fi";

/**
 * Standalone Dashboard page with interactive functionality (no backend)
 * - Patient / Doctor / Admin tabs
 * - Working handlers: accept/reject, add/remove, schedule/cancel, download record, notifications
 */

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("patient");

  // -----------------------
  // Sample interactive state
  // -----------------------
  const [appointments, setAppointments] = useState([
    // appointments used by patient (upcoming) and doctor (today)
    { id: 101, date: "2025-02-02", time: "10:00 AM", doctor: "Dr. Sarah Chen", department: "Cardiology", status: "Upcoming", link: "https://meet.telehealth.com/alpha101" },
    { id: 102, date: "2025-02-05", time: "03:00 PM", doctor: "Dr. Michael Rodriguez", department: "Neurology", status: "Upcoming", link: "https://meet.telehealth.com/alpha102" }
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, text: "Your test results will be ready tomorrow", read: false },
    { id: 2, text: "Upcoming appointment reminder: Feb 5th", read: false }
  ]);

  const [pharmacyOrders, setPharmacyOrders] = useState([
    { id: 201, item: "Paracetamol", qty: 2, status: "Delivered" },
    { id: 202, item: "Amoxicillin", qty: 1, status: "Pending" }
  ]);

  const [patientRecords, setPatientRecords] = useState([
    { id: 301, file: "Blood_Test_Report.pdf", date: "2025-01-22" },
    { id: 302, file: "MRI_Scan_Report.pdf", date: "2025-01-16" }
  ]);

  const [doctors, setDoctors] = useState([
    { id: 1, name: "Dr. Sarah Chen", specialization: "Cardiology", availability: "Available" },
    { id: 2, name: "Dr. Michael Rodriguez", specialization: "Neurology", availability: "Busy" },
    { id: 3, name: "Dr. Lisa Thompson", specialization: "Pediatrics", availability: "Available" }
  ]);

  const [patients, setPatients] = useState([
    { id: 11, name: "John Smith", diagnosis: "Hypertension", status: "Stable" },
    { id: 12, name: "Sarah Johnson", diagnosis: "Diabetes Type 2", status: "Improving" }
  ]);

  const [doctorQueue, setDoctorQueue] = useState([
    { id: 401, patient: "John Smith", time: "10:00 AM", status: "Pending" },
    { id: 402, patient: "Emily Brown", time: "11:00 AM", status: "Pending" }
  ]);

  // -------------------------------------
  // Utility / Action Handlers (all work)
  // -------------------------------------

  // Mark notification as read / remove
  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };
  const removeNotification = (id) => setNotifications(prev => prev.filter(n => n.id !== id));

  // Patient: Cancel appointment
  const cancelAppointment = (id) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
    setNotifications(prev => [{ id: Date.now(), text: `Appointment ${id} cancelled`, read: false }, ...prev]);
  };

  // Patient: Join meeting (just opens link in new tab)
  const joinMeeting = (link) => {
    if (!link) return alert("No meeting link available.");
    window.open(link, "_blank");
  };

  // Download record simulation
  const downloadRecord = (record) => {
    // create a simple text PDF-like blob (or you can use jsPDF/html2canvas)
    const content = `Report: ${record.file}\nDate: ${record.date}\n\nThis is a simulated download.`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${record.file.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // Doctor: Accept / Reject appointment from doctor queue
  const handleAcceptAppointment = (id) => {
    setDoctorQueue(prev => prev.map(it => it.id === id ? { ...it, status: "Accepted" } : it));
    setNotifications(prev => [{ id: Date.now(), text: `You accepted appointment ${id}`, read: false }, ...prev]);
  };
  const handleRejectAppointment = (id) => {
    setDoctorQueue(prev => prev.map(it => it.id === id ? { ...it, status: "Rejected" } : it));
    setNotifications(prev => [{ id: Date.now(), text: `You rejected appointment ${id}`, read: false }, ...prev]);
  };

  // Admin: Add / Remove doctor & patient
  const addDoctor = () => {
    const newDoc = { id: Date.now(), name: `Dr. New ${doctors.length + 1}`, specialization: "General", availability: "Available" };
    setDoctors(prev => [newDoc, ...prev]);
    setNotifications(prev => [{ id: Date.now()+1, text: `Doctor added: ${newDoc.name}`, read: false }, ...prev]);
  };
  const removeDoctor = (id) => {
    setDoctors(prev => prev.filter(d => d.id !== id));
    setNotifications(prev => [{ id: Date.now()+2, text: `Doctor removed: ${id}`, read: false }, ...prev]);
  };

  const addPatient = () => {
    const newPat = { id: Date.now(), name: `Patient ${patients.length + 1}`, diagnosis: "General", status: "New" };
    setPatients(prev => [newPat, ...prev]);
    setNotifications(prev => [{ id: Date.now()+3, text: `Patient added: ${newPat.name}`, read: false }, ...prev]);
  };
  const removePatient = (id) => {
    setPatients(prev => prev.filter(p => p.id !== id));
    setNotifications(prev => [{ id: Date.now()+4, text: `Patient removed: ${id}`, read: false }, ...prev]);
  };

  // Pharmacy: update order status
  const toggleOrderStatus = (id) => {
    setPharmacyOrders(prev => prev.map(o => o.id === id ? { ...o, status: o.status === "Pending" ? "Delivered" : "Pending" } : o));
  };

  // Book quick appointment (patient quick action)
  const quickBook = () => {
    const example = { id: Date.now(), date: "2025-02-20", time: "09:30 AM", doctor: "Dr. New", department: "General", status: "Upcoming", link: "https://meet.telehealth.com/quick" };
    setAppointments(prev => [example, ...prev]);
    setNotifications(prev => [{ id: Date.now()+5, text: "Quick appointment booked", read: false }, ...prev]);
  };

  // Small derived values
  const upcomingCount = appointments.length;
  const pendingDoctorCount = doctorQueue.filter(q => q.status === "Pending").length;

  // -------------------------
  // Small UI helpers
  // -------------------------
  const statCard = (title, value, color = "blue") => {
    // map color -> border class safely (tailwind requires fixed classes)
    const colorMap = {
      blue: "border-l-4 border-blue-500",
      green: "border-l-4 border-green-500",
      purple: "border-l-4 border-purple-500",
      orange: "border-l-4 border-orange-500"
    };
    return (
      <div className={`bg-white p-5 rounded-xl shadow ${colorMap[color] || colorMap.blue}`}>
        <div className="text-sm text-gray-600">{title}</div>
        <div className="text-2xl font-bold text-gray-800 mt-2">{value}</div>
      </div>
    );
  };

  // -------------------------
  // Renderers for each tab
  // -------------------------
  const renderPatientView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCard("Upcoming Appointments", upcomingCount, "blue")}
        {statCard("Active Prescriptions", 3, "green")}
        {statCard("Medical Records", patientRecords.length, "purple")}
      </div>

      {/* Notifications */}
      <div className="bg-white p-4 rounded-xl shadow">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Notifications</h3>
          <small className="text-sm text-gray-500">{notifications.filter(n => !n.read).length} new</small>
        </div>
        <ul>
          {notifications.map(n => (
            <li key={n.id} className="flex justify-between items-center p-2 border-b">
              <div>
                <div className={`text-sm ${n.read ? "text-gray-500" : "text-gray-800 font-medium"}`}>{n.text}</div>
                <div className="text-xs text-gray-400">id: {n.id}</div>
              </div>
              <div className="flex items-center gap-2">
                {!n.read && <button onClick={() => markNotificationRead(n.id)} className="text-sm text-blue-600">Mark read</button>}
                <button onClick={() => removeNotification(n.id)} className="text-red-600"><FiTrash2 /></button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Appointments */}
      <div className="bg-white p-4 rounded-xl shadow">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Appointments</h3>
          <button onClick={quickBook} className="bg-blue-600 text-white px-3 py-1 rounded">Quick Book</button>
        </div>

        {appointments.length === 0 ? <p className="text-gray-500">No appointments scheduled.</p> : appointments.map(a => (
          <div key={a.id} className="flex justify-between items-center border p-3 rounded mb-2">
            <div>
              <div className="font-semibold">{a.date} • {a.time}</div>
              <div className="text-sm text-gray-500">{a.doctor} • {a.department}</div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-1 rounded-full text-sm ${a.status === "Upcoming" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}>{a.status}</span>
              <button onClick={() => joinMeeting(a.link)} className="text-blue-600 underline">Join</button>
              <button onClick={() => cancelAppointment(a.id)} className="text-red-600">Cancel</button>
            </div>
          </div>
        ))}
      </div>

      {/* Medical records */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-3">Medical Records</h3>
        {patientRecords.map(rec => (
          <div key={rec.id} className="flex justify-between items-center border p-2 rounded mb-2">
            <div>
              <div className="font-medium">{rec.file}</div>
              <div className="text-xs text-gray-400">{rec.date}</div>
            </div>
            <button onClick={() => downloadRecord(rec)} className="flex items-center gap-2 text-blue-600"><FiDownload /> Download</button>
          </div>
        ))}
      </div>

      {/* Pharmacy */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-3">Pharmacy Orders</h3>
        {pharmacyOrders.map(o => (
          <div key={o.id} className="flex justify-between items-center border p-2 rounded mb-2">
            <div>{o.item} x{o.qty}</div>
            <div className="flex items-center gap-3">
              <div className={`text-sm font-semibold ${o.status === "Delivered" ? "text-green-600" : "text-yellow-600"}`}>{o.status}</div>
              <button onClick={() => toggleOrderStatus(o.id)} className="text-sm px-2 py-1 border rounded">{o.status === "Pending" ? "Mark Delivered" : "Mark Pending"}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDoctorView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCard("Appointments Today", doctorQueue.length, "blue")}
        {statCard("Patients Waiting", doctorQueue.filter(q => q.status === "Pending").length, "orange")}
        {statCard("Pending Prescriptions", 4, "purple")}
      </div>

      {/* Today's schedule / Queue */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-3">Today's Queue</h3>
        {doctorQueue.map(q => (
          <div key={q.id} className="flex justify-between items-center border p-3 rounded mb-2">
            <div>
              <div className="font-semibold">{q.patient}</div>
              <div className="text-sm text-gray-500">{q.time}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-sm ${q.status === "Pending" ? "bg-yellow-100 text-yellow-800" : q.status === "Accepted" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{q.status}</span>
              <button onClick={() => handleAcceptAppointment(q.id)} className="text-green-600 flex items-center gap-1"><FiCheck /> Accept</button>
              <button onClick={() => handleRejectAppointment(q.id)} className="text-red-600 flex items-center gap-1"><FiX /> Reject</button>
            </div>
          </div>
        ))}
      </div>

      {/* Patient reports quick view */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-3">Patient Reports</h3>
        {patientRecords.map(rec => (
          <div key={rec.id} className="flex justify-between items-center border p-2 rounded mb-2">
            <div>{rec.file}</div>
            <button onClick={() => downloadRecord(rec)} className="text-blue-600 flex items-center gap-2"><FiDownload /> View</button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAdminView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCard("Total Patients", patients.length, "blue")}
        {statCard("Total Doctors", doctors.length, "green")}
        {statCard("Appointments Today", appointments.length, "orange")}
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-3">Admin Controls</h3>
        <div className="flex gap-3 mb-4">
          <button onClick={addDoctor} className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-2"><FiPlus /> Add Doctor</button>
          <button onClick={addPatient} className="bg-green-600 text-white px-3 py-1 rounded flex items-center gap-2"><FiPlus /> Add Patient</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Doctors</h4>
            {doctors.map(d => (
              <div key={d.id} className="flex justify-between items-center border p-2 rounded mb-2">
                <div>
                  <div className="font-medium">{d.name}</div>
                  <div className="text-xs text-gray-500">{d.specialization}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm px-2 py-1 rounded bg-gray-100">{d.availability}</div>
                  <button onClick={() => removeDoctor(d.id)} className="text-red-600"><FiTrash2 /></button>
                </div>
              </div>
            ))}
          </div>

          <div>
            <h4 className="font-semibold mb-2">Patients</h4>
            {patients.map(p => (
              <div key={p.id} className="flex justify-between items-center border p-2 rounded mb-2">
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-gray-500">{p.diagnosis}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`text-sm px-2 py-1 rounded ${p.status === "Stable" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>{p.status}</div>
                  <button onClick={() => removePatient(p.id)} className="text-red-600"><FiTrash2 /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent feedback (static) */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-3">Recent Feedback</h3>
        <div>
          <div className="border p-2 rounded mb-2">
            <div className="font-medium">Ravi Teja</div>
            <div className="text-sm text-gray-500">Doctor was very friendly. ⭐⭐⭐⭐⭐</div>
          </div>
          <div className="border p-2 rounded mb-2">
            <div className="font-medium">Sneha</div>
            <div className="text-sm text-gray-500">Quick consultation & clear guidance ⭐⭐⭐⭐</div>
          </div>
        </div>
      </div>
    </div>
  );

  // -------------------------
  // Main render
  // -------------------------
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Overview & quick actions</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow mb-6">
          <div className="flex">
            {["patient", "doctor", "admin"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 text-center font-semibold ${activeTab === tab ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600 hover:text-blue-500"}`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* content */}
        <div className="transition-all duration-200">
          {activeTab === "patient" && renderPatientView()}
          {activeTab === "doctor" && renderDoctorView()}
          {activeTab === "admin" && renderAdminView()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
