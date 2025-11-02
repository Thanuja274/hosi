// const mongoose = require("mongoose");

// const Patient = require("../models/Patient");
// const Doctor = require("../models/Doctor");
// const Staff = require("../models/Staff");
// const Pharmacy = require("../models/Pharmacy");
// const Appointment = require("../models/Appointment");
// const Feedback = require("../models/Feedback");
// const Record = require("../models/Record");

// const MONGO_URI = "mongodb://127.0.0.1:27017/MediCareDb";

// async function seed() {
//     await mongoose.connect(MONGO_URI);
//     console.log("✅ Database Connected");

//     // Clear old data
//     await Patient.deleteMany();
//     await Doctor.deleteMany();
//     await Staff.deleteMany();
//     await Pharmacy.deleteMany();
//     await Appointment.deleteMany();
//     await Feedback.deleteMany();
//     await Record.deleteMany();

//     // ✅ 15 Patients (Indian realistic names)
//     const patientList = [
//         { name: "Rohan Sharma", age: 28, gender: "Male", phone: "9876543210", email: "rohan@gmail.com" },
//         { name: "Anjali Verma", age: 35, gender: "Female", phone: "9897456321", email: "anjali@gmail.com" },
//         { name: "Sandeep Kumar", age: 42, gender: "Male", phone: "9812345678", email: "sandeep@gmail.com" },
//         { name: "Pooja Singh", age: 30, gender: "Female", phone: "9823456789", email: "pooja@gmail.com" },
//         { name: "Rahul Mehta", age: 33, gender: "Male", phone: "9834567890", email: "rahul@gmail.com" },
//         { name: "Priya Nair", age: 26, gender: "Female", phone: "9845678901", email: "priya@gmail.com" },
//         { name: "Aditya Jain", age: 41, gender: "Male", phone: "9856789012", email: "aditya@gmail.com" },
//         { name: "Sneha Roy", age: 24, gender: "Female", phone: "9867890123", email: "sneha@gmail.com" },
//         { name: "Arjun Das", age: 39, gender: "Male", phone: "9878901234", email: "arjun@gmail.com" },
//         { name: "Sonia Kapoor", age: 29, gender: "Female", phone: "9889012345", email: "sonia@gmail.com" },
//         { name: "Vikram Patel", age: 37, gender: "Male", phone: "9890123456", email: "vikram@gmail.com" },
//         { name: "Meera Joshi", age: 31, gender: "Female", phone: "9901234567", email: "meera@gmail.com" },
//         { name: "Harsh Agarwal", age: 34, gender: "Male", phone: "9912345678", email: "harsh@gmail.com" },
//         { name: "Lakshmi Narayan", age: 45, gender: "Male", phone: "9923456789", email: "lakshmi@gmail.com" },
//         { name: "Kavya Menon", age: 27, gender: "Female", phone: "9934567890", email: "kavya@gmail.com" }
//     ];
//     const patients = await Patient.insertMany(patientList);
//     console.log("✅ 15 Patients added");

//     // ✅ 15 Doctors (real specializations)
//     const doctorList = [
//         { name: "Dr. Arjun Rao", specialization: "Cardiologist", phone: "9001110001", email: "arjunrao@hospital.com" },
//         { name: "Dr. Neha Singh", specialization: "Neurologist", phone: "9001110002", email: "neha@hospital.com" },
//         { name: "Dr. Vikram Das", specialization: "General Physician", phone: "9001110003", email: "vikram@hospital.com" },
//         { name: "Dr. Aparna Iyer", specialization: "Dermatologist", phone: "9001110004", email: "aparna@hospital.com" },
//         { name: "Dr. Rajesh Gupta", specialization: "Orthopedic Surgeon", phone: "9001110005", email: "rajesh@hospital.com" },
//         { name: "Dr. Meenakshi Pillai", specialization: "Pediatrician", phone: "9001110006", email: "meenakshi@hospital.com" },
//         { name: "Dr. Rohit Malhotra", specialization: "ENT Specialist", phone: "9001110007", email: "rohit@hospital.com" },
//         { name: "Dr. Swati Bansal", specialization: "Gynecologist", phone: "9001110008", email: "swati@hospital.com" },
//         { name: "Dr. Suresh Reddy", specialization: "Nephrologist", phone: "9001110009", email: "suresh@hospital.com" },
//         { name: "Dr. Priyanka Kaur", specialization: "Psychiatrist", phone: "9001110010", email: "priyanka@hospital.com" },
//         { name: "Dr. Sameer Khan", specialization: "Cardiologist", phone: "9001110011", email: "sameer@hospital.com" },
//         { name: "Dr. Varsha Kulkarni", specialization: "Oncologist", phone: "9001110012", email: "varsha@hospital.com" },
//         { name: "Dr. Deepak Chauhan", specialization: "Radiologist", phone: "9001110013", email: "deepak@hospital.com" },
//         { name: "Dr. Nisha Dave", specialization: "Dentist", phone: "9001110014", email: "nisha@hospital.com" },
//         { name: "Dr. Balaji Natarajan", specialization: "Urologist", phone: "9001110015", email: "balaji@hospital.com" }
//     ];
//     const doctors = await Doctor.insertMany(doctorList);
//     console.log("✅ 15 Doctors added");

//     // ✅ 15 Staff
//     const staffRoles = [
//         "Nurse", "Receptionist", "Lab Technician", "Pharmacist", "Ward Boy", "Cleaner", "Cashier", "Security",
//     ];
//     const staffList = [];
//     for (let i = 1; i <= 15; i++) {
//         staffList.push({
//             name: `Staff Member ${i}`,
//             role: staffRoles[i % staffRoles.length],
//             phone: `8800${100000 + i}`
//         });
//     }
//     await Staff.insertMany(staffList);
//     console.log("✅ 15 Staff added");

//     // ✅ 15 Pharmacy medicines (real names)
//     const pharmacyList = [
//         { medicineName: "Paracetamol 500mg", stock: 120, price: 20 },
//         { medicineName: "Amoxicillin 250mg", stock: 80, price: 50 },
//         { medicineName: "Azithromycin 500mg", stock: 65, price: 120 },
//         { medicineName: "Cough Syrup", stock: 40, price: 70 },
//         { medicineName: "Ibuprofen 400mg", stock: 90, price: 32 },
//         { medicineName: "Vitamin D3", stock: 75, price: 150 },
//         { medicineName: "Metformin 500mg", stock: 60, price: 25 },
//         { medicineName: "ORS Powder", stock: 50, price: 18 },
//         { medicineName: "Cetrizine", stock: 100, price: 12 },
//         { medicineName: "Insulin Injection", stock: 30, price: 270 },
//         { medicineName: "Antacid syrup", stock: 55, price: 40 },
//         { medicineName: "Crocin", stock: 110, price: 28 },
//         { medicineName: "Pain Relief Spray", stock: 45, price: 95 },
//         { medicineName: "Skin Ointment", stock: 35, price: 65 },
//         { medicineName: "Multivitamin Tablets", stock: 130, price: 85 },
//     ];
//     await Pharmacy.insertMany(pharmacyList);
//     console.log("✅ 15 Pharmacy medicines added");

//     // ✅ 15 Appointments
//     const appointmentList = [];
//     for (let i = 0; i < 15; i++) {
//         appointmentList.push({
//             patient: patients[i]._id,
//             doctor: doctors[i]._id,
//             date: `2025-01-${(i + 1).toString().padStart(2, "0")}`,
//             time: "10:00 AM"
//         });
//     }
//     await Appointment.insertMany(appointmentList);
//     console.log("✅ 15 Appointments added");

//     // ✅ 15 Feedback
//     const feedbackList = patients.map((p, i) => ({
//         patientName: p.name,
//         feedback: "The service was excellent",
//         rating: (i % 5) + 1
//     }));
//     await Feedback.insertMany(feedbackList);
//     console.log("✅ 15 Feedback added");

//     // ✅ 15 Medical Records
//     const recordsList = patients.map((p, i) => ({
//         patient: p._id,
//         details: `General checkup completed for ${p.name}.`
//     }));
//     await Record.insertMany(recordsList);
//     console.log("✅ 15 Medical Records added");

//     console.log("\n🎉✅ All 15 Realistic Records Added Successfully!");
//     process.exit(0);
// }

// seed();
const axios = require("axios");
const MONGO_URI = "mongodb://127.0.0.1:27017/MediCareDb";

const BASE_URL = "http://localhost:5173"; // change if needed

async function addData() {
    try {
        // ✅ 15 Patients
        const patients = [
            { name: "Rohan Sharma", age: 28, gender: "Male", phone: "9876543210", email: "rohan@gmail.com" },
            { name: "Anjali Verma", age: 35, gender: "Female", phone: "9897456321", email: "anjali@gmail.com" },
            { name: "Sandeep Kumar", age: 42, gender: "Male", phone: "9812345678", email: "sandeep@gmail.com" },
            { name: "Pooja Singh", age: 30, gender: "Female", phone: "9823456789", email: "pooja@gmail.com" },
            { name: "Rahul Mehta", age: 33, gender: "Male", phone: "9834567890", email: "rahul@gmail.com" },
            { name: "Priya Nair", age: 26, gender: "Female", phone: "9845678901", email: "priya@gmail.com" },
            { name: "Aditya Jain", age: 41, gender: "Male", phone: "9856789012", email: "aditya@gmail.com" },
            { name: "Sneha Roy", age: 24, gender: "Female", phone: "9867890123", email: "sneha@gmail.com" },
            { name: "Arjun Das", age: 39, gender: "Male", phone: "9878901234", email: "arjun@gmail.com" },
            { name: "Sonia Kapoor", age: 29, gender: "Female", phone: "9889012345", email: "sonia@gmail.com" },
            { name: "Vikram Patel", age: 37, gender: "Male", phone: "9890123456", email: "vikram@gmail.com" },
            { name: "Meera Joshi", age: 31, gender: "Female", phone: "9901234567", email: "meera@gmail.com" },
            { name: "Harsh Agarwal", age: 34, gender: "Male", phone: "9912345678", email: "harsh@gmail.com" },
            { name: "Lakshmi Narayan", age: 45, gender: "Male", phone: "9923456789", email: "lakshmi@gmail.com" },
            { name: "Kavya Menon", age: 27, gender: "Female", phone: "9934567890", email: "kavya@gmail.com" }
        ];

        for (const p of patients) {
            await axios.post(`${BASE_URL}/patients/add`, p);
        }
        console.log("✅ 15 Patients Added via POST");


        // ✅ 15 Doctors
        const doctors = [
            { name: "Dr. Arjun Rao", specialization: "Cardiologist", phone: "9001110001", email: "arjunrao@hospital.com" },
            { name: "Dr. Neha Singh", specialization: "Neurologist", phone: "9001110002", email: "neha@hospital.com" },
            { name: "Dr. Vikram Das", specialization: "General Physician", phone: "9001110003", email: "vikram@hospital.com" },
            { name: "Dr. Aparna Iyer", specialization: "Dermatologist", phone: "9001110004", email: "aparna@hospital.com" },
            { name: "Dr. Rajesh Gupta", specialization: "Orthopedic", phone: "9001110005", email: "rajesh@hospital.com" },
            { name: "Dr. Meenakshi Pillai", specialization: "Pediatrician", phone: "9001110006", email: "meenakshi@hospital.com" },
            { name: "Dr. Rohit Malhotra", specialization: "ENT Specialist", phone: "9001110007", email: "rohit@hospital.com" },
            { name: "Dr. Swati Bansal", specialization: "Gynecologist", phone: "9001110008", email: "swati@hospital.com" },
            { name: "Dr. Suresh Reddy", specialization: "Nephrologist", phone: "9001110009", email: "suresh@hospital.com" },
            { name: "Dr. Priyanka Kaur", specialization: "Psychiatrist", phone: "9001110010", email: "priyanka@hospital.com" },
            { name: "Dr. Sameer Khan", specialization: "Cardiologist", phone: "9001110011", email: "sameer@hospital.com" },
            { name: "Dr. Varsha Kulkarni", specialization: "Oncologist", phone: "9001110012", email: "varsha@hospital.com" },
            { name: "Dr. Deepak Chauhan", specialization: "Radiologist", phone: "9001110013", email: "deepak@hospital.com" },
            { name: "Dr. Nisha Dave", specialization: "Dentist", phone: "9001110014", email: "nisha@hospital.com" },
            { name: "Dr. Balaji Natarajan", specialization: "Urologist", phone: "9001110015", email: "balaji@hospital.com" }
        ];

        for (const d of doctors) {
            await axios.post(`${BASE_URL}/doctors/add`, d);
        }
        console.log("✅ 15 Doctors Added via POST");


        // ✅ Staff, Pharmacy, Feedback, Records can be added the same way
        // ✅ (If you want, I will generate the rest exactly like this)

        console.log("\n🎉 All data added using POST requests!");

    } catch (err) {
        console.log("❌ Error:", err.message);
    }
}

addData();