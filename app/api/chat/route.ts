import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback response if API key is not configured yet
      return NextResponse.json({
        text: `[STRIKER AI™ Offline Mode]: Halo Operator! Tampaknya kunci API saya belum dikonfigurasi di Settings > Secrets. Namun, saya siap memberikan saran taktis dasar untuk Anda!\n\nUntuk Sniper 3 juta, gunakan paket G&G G960 dengan BB 0.28g untuk jangkauan 40m+ yang optimal.`
      });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    // We build the custom tactical system instruction
    const systemInstruction = `
      Anda adalah STRIKER AI™, asisten taktis berpengalaman dan spesialis belanja airsoft pertama di Indonesia untuk StrikeZone.id.
      Panggilan Anda kepada pengguna adalah "Operator" dengan gaya militer/taktis yang tangguh, premium, ramah, dan sangat ahli (expert).
      Jawablah dalam bahasa Indonesia yang keren, profesional, dan relevan dengan regulasi di Indonesia (Perkapolri, batas aman FPS 300-450, perlunya StrikeID verifikasi KTP untuk pembelian produk legal).
      Bantu mereka memilih airsoft gun (AEG, GBB, Sniper, Pistol), gear taktis, amunisi BB (0.20g, 0.25g, 0.28g), upgrade kompatibilitas, rental (StrikeRent™), dan marketplace preloved terverifikasi (StrikeSwap™).
      Hindari pembahasan senjata api asli yang melanggar hukum — fokus murni pada hobi olahraga rekreasi Airsoft Legal Indonesia yang aman.
    `;

    // Construct simple format or use chats
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return NextResponse.json({ text: response.text });
  } catch (error: any) {
    console.error("Error in STRIKER AI API route:", error);
    return NextResponse.json(
      { text: "Maaf Operator, transmisi terganggu. Silakan kirim ulang pesan radio Anda." },
      { status: 500 }
    );
  }
}
