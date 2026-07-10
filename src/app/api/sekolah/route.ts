import { NextResponse } from "next/server";

const BASE_URL = process.env.SCHOOL_API_BASE_URL;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json(
      {
        success: false,
        message: "Parameter pencarian (q) dibutuhkan",
      },
      { status: 400 }
    );
  }

  if (!BASE_URL) {
    return NextResponse.json(
      {
        success: false,
        message: "SCHOOL_API_BASE_URL belum dikonfigurasi.",
      },
      { status: 500 }
    );
  }

  const isNpsn = /^\d+$/.test(q);

  const url = isNpsn
    ? `${BASE_URL}/sekolah?npsn=${encodeURIComponent(q)}`
    : `${BASE_URL}/sekolah?nama=${encodeURIComponent(
        q
      )}&bentuk_pendidikan=SMA&limit=10`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`API mengembalikan status ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data sekolah.",
      },
      { status: 500 }
    );
  }
}
