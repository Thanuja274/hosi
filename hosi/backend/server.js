// =============================
// 🏥 MediCare+ Backend Server - WORKING VERSION
// =============================

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

// =============================
// 🔧 Middleware
// =============================
app.use(express.json());
app.use(
    cors({
        origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// =============================
// 👤 User Schema & Model
// =============================
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: {
        type: String,
        enum: ["patient", "doctor", "staff"],
        default: "patient",
    },
    phone: { type: String, default: "" },
    specialization: { type: String, default: "" },
    experience: { type: Number, default: 0 },
    licenseNumber: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

// =============================
// 👨‍⚕️ Simple Doctor Schema
// =============================
const doctorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    specialization: { type: String, required: true },
    qualification: { type: String, default: "MD" },
    licenseNumber: { type: String, required: true },
    experience: { type: Number, required: true },
    department: { type: String, required: true },
    consultationFee: { type: Number, default: 100 },
    isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

const Doctor = mongoose.model("Doctor", doctorSchema);

// =============================
// 🧾 Registration Routes
// =============================

app.get("/api/register", (req, res) => {
    res.json({
        message: "Register endpoint - Use POST to create a new account",
        endpoint: "POST /api/register",
    });
});

app.post("/api/register", async(req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            userType,
            phone,
            specialization,
            experience,
            licenseNumber,
        } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "First name, last name, email, and password are required",
            });
        }

        // Additional validation for doctors
        if (userType === 'doctor') {
            if (!specialization || !experience || !licenseNumber) {
                return res.status(400).json({
                    success: false,
                    message: "Specialization, experience, and license number are required for doctor registration"
                });
            }
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists with this email",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            lastName,
            email: email.toLowerCase(),
            password: hashedPassword,
            userType: userType || "patient",
            phone,
            specialization,
            experience,
            licenseNumber,
        });

        await newUser.save();

        // Create doctor profile if user is doctor
        if (userType === 'doctor') {
            const doctorProfile = new Doctor({
                userId: newUser._id,
                specialization: specialization,
                qualification: "MD",
                licenseNumber: licenseNumber,
                experience: experience,
                department: specialization,
                consultationFee: 100
            });
            await doctorProfile.save();
            console.log("✅ Doctor profile created for:", newUser.email);
        }

        const token = jwt.sign({
                userId: newUser._id,
                email: newUser.email,
                userType: newUser.userType,
            },
            process.env.JWT_SECRET || "medicare_secret_key_2024", { expiresIn: "24h" }
        );

        res.status(201).json({
            success: true,
            message: userType === 'doctor' ? "Doctor registered successfully" : "User registered successfully",
            token,
            user: {
                id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                userType: newUser.userType,
                phone: newUser.phone,
                specialization: newUser.specialization,
                experience: newUser.experience,
                licenseNumber: newUser.licenseNumber,
            },
        });
    } catch (error) {
        console.error("❌ Registration error:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "User already exists with this email",
            });
        }

        res.status(500).json({
            success: false,
            message: "Server error during registration",
        });
    }
});

// =============================
// 🔥 Login Route
// =============================
app.post("/api/login", async(req, res) => {
    console.log("🔐 Login request received");

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Get doctor profile if user is doctor
        let doctorProfile = null;
        if (user.userType === 'doctor') {
            doctorProfile = await Doctor.findOne({ userId: user._id })
                .populate('userId', 'firstName lastName email phone');
        }

        const token = jwt.sign({
                userId: user._id,
                email: user.email,
                userType: user.userType,
            },
            process.env.JWT_SECRET || "medicare_secret_key_2024", { expiresIn: "24h" }
        );

        res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                userType: user.userType,
                phone: user.phone,
                specialization: user.specialization,
                experience: user.experience,
                licenseNumber: user.licenseNumber,
            },
            doctorProfile: doctorProfile
        });
    } catch (error) {
        console.error("❌ Login error:", error);
        res.status(500).json({
            success: false,
            message: "Server error during login",
        });
    }
});

// =============================
// 👨‍⚕️ Doctor Routes
// =============================

// GET doctor by user ID
app.get("/api/doctors/user/:userId", async(req, res) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.params.userId })
            .populate('userId', 'firstName lastName email phone');

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor profile not found'
            });
        }

        res.json({
            success: true,
            data: doctor
        });
    } catch (error) {
        console.error('Error fetching doctor:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching doctor'
        });
    }
});

// GET all doctors
app.get("/api/doctors", async(req, res) => {
    try {
        const doctors = await Doctor.find()
            .populate('userId', 'firstName lastName email phone');

        res.json({
            success: true,
            data: doctors,
            count: doctors.length
        });
    } catch (error) {
        console.error('Error fetching doctors:', error);
        // Fallback to sample data
        const doctors = [{
                id: 1,
                name: 'Dr. Sarah Wilson',
                specialty: 'Cardiology',
                availability: 'Available',
                experience: '10 years',
                rating: 4.8
            },
            {
                id: 2,
                name: 'Dr. Michael Chen',
                specialty: 'Neurology',
                availability: 'Available',
                experience: '8 years',
                rating: 4.7
            }
        ];
        res.json({
            success: true,
            data: doctors,
            count: doctors.length
        });
    }
});

// =============================
// 🌍 External Routes (Optional)
// =============================
try {
    app.use("/api/auth", require("./routes/auth"));
    console.log("✅ Auth routes loaded");
} catch {
    console.warn("⚠️ Auth routes missing");
}

try {
    app.use("/api/appointments", require("./routes/appointments"));
    console.log("✅ Appointment routes loaded");
} catch {
    console.warn("⚠️ Appointment routes missing");
}

try {
    app.use("/api/users", require("./routes/users"));
    console.log("✅ User routes loaded");
} catch {
    console.warn("⚠️ User routes missing");
}

// =============================
// 🧠 MongoDB Connection
// =============================
const MONGODB_URI =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/MediCareDb";

mongoose
    .connect(MONGODB_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

// =============================
// 🧩 Basic Info Routes
// =============================
app.get("/", (req, res) => {
    res.json({
        message: "🏥 MediCare+ API Server is running!",
        timestamp: new Date().toISOString(),
    });
});

app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
        timestamp: new Date().toISOString(),
    });
});

app.get("/api", (req, res) => {
    res.json({
        message: "Backend API is working!",
        version: "1.0.0",
        endpoints: {
            login: "POST /api/login",
            register: "POST /api/register",
            doctors: "GET /api/doctors",
            health: "GET /health"
        }
    });
});

// =============================
// 🚀 Start Server
// =============================
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🌐 API Base: http://localhost:${PORT}/api`);
    console.log(`🔑 Login: POST http://localhost:${PORT}/api/login`);
    console.log(`👤 Register: POST http://localhost:${PORT}/api/register`);
    console.log(`👨‍⚕️ Doctors: GET http://localhost:${PORT}/api/doctors`);
});