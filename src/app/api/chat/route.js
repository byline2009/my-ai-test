import { NextResponse } from "next/server";

export async function POST(req) {
    return NextResponse.json({ message: "Bạn chờ chút nhé" }, { status: 200 })

} 