import { NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb.js";
import User from "../../models/User.js";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, name, role } = body;

    console.log("📩 Incoming registration data:", body);

    // Validation
    if (!email || !password || !name || !role) {
      console.log("❌ Missing fields:", { email, password, name, role });
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (!["student", "admin"].includes(role)) {
      console.log("❌ Invalid role:", role);
      return NextResponse.json(
        { error: "Invalid role selected" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("❌ Invalid email format:", email);
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      console.log("❌ Password too short:", password);
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Log attempt
    console.log("📝 Registration attempt:", {
      email,
      name,
      role,
      timestamp: new Date().toISOString(),
      ip:
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        "unknown",
    });

    // Connect to DB
    console.log("🔌 Connecting to MongoDB...");
    const db = await connectToDatabase();
    console.log("✅ Connected to MongoDB:", db.connection?.name);

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("❌ Registration failed: Email already exists -", email);
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    console.log("🔑 Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
      role,
    });

    console.log("✅ User created successfully:", {
      id: newUser._id.toString(),
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        message: `User registered successfully. Redirecting to /${
          role === "admin" ? "admin-dashboard" : "student-dashboard"
        }`,
        user: {
          id: newUser._id.toString(),
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("💥 Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
