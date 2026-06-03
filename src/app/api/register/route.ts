import bcrypt from "bcrypt";
import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

// 5 registration attempts per hour per IP
const REGISTER_RATE_LIMIT = { maxRequests: 5, windowMs: 60 * 60 * 1000 };

const MIN_PASSWORD_LENGTH = 8;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rl = checkRateLimit("register", ip, REGISTER_RATE_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }
  let body: Partial<RegisterBody>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { name, email, password } = body;

  if (!name?.trim() || !email?.trim() || !password) {
    return NextResponse.json(
      { error: "Name, email and password are required" },
      { status: 400 },
    );
  }

  if (!isValidEmail(email.trim())) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json(
      { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` },
      { status: 400 },
    );
  }

  // Use a transaction so that the userCount check and user creation are atomic.
  // This prevents a race condition where two concurrent requests both read
  // userCount === 0 and both set isSuperAdmin = true.
  try {
    await prisma.$transaction(async (tx) => {
      const userCount = await tx.user.count();

      // After the first Super Admin exists, registration is closed.
      // New users must be invited by a Tenant Admin via /api/users.
      if (userCount > 0) {
        throw Object.assign(new Error("Registration is closed"), { code: "CLOSED" });
      }

      const existing = await tx.user.findUnique({
        where: { email: email.toLowerCase() },
      });
      if (existing) {
        throw Object.assign(
          new Error("An account with this email already exists"),
          { code: "DUPLICATE" },
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await tx.user.create({
        data: {
          name: name.trim(),
          email: email.toLowerCase(),
          password: hashedPassword,
          isSuperAdmin: true, // first (and only self-registered) user = Super Admin
        },
      });
    });
  } catch (err: unknown) {
    const code = (err as { code?: string }).code;
    if (code === "CLOSED") {
      return NextResponse.json(
        { error: "Registration is closed. Contact your administrator to be invited." },
        { status: 403 },
      );
    }
    if (code === "DUPLICATE") {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 },
      );
    }
    throw err;
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
