import { NextResponse } from "next/server";

const ALLOWED = new Set(["about", "improve", "match", "tailor", "generate"]);

export async function POST(
  req: Request,
  { params }: { params: { mode: string } }
) {
  const mode = params.mode;

  if (!ALLOWED.has(mode)) {
    return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
  }

  const base = process.env.VITE_ATS_API_BASE_URL;
  if (!base) {
    return NextResponse.json(
      { error: "VITE_ATS_API_BASE_URL is not set" },
      { status: 500 }
    );
  }

  const formData = await req.formData();

  const res = await fetch(`${base}/ats/${mode}`, {
    method: "POST",
    body: formData,
  });

  const text = await res.text();

  return new NextResponse(text, {
    status: res.status,
    headers: { "content-type": "application/json" },
  });
}
