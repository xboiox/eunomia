import { NextResponse } from "next/server";

export function ok<T>(data: T, status = 200, meta?: { total: number }) {
  return NextResponse.json(
    { success: true, data, ...(meta && { meta }) },
    { status },
  );
}

export function err(message: string, status: number) {
  return NextResponse.json({ success: false, error: message }, { status });
}
