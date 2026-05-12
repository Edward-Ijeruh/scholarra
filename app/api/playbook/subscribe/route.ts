import { Resend } from "resend";
import fs from "fs";
import path from "path";
import { adminDb } from "@/lib/firebase/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, phone } = await req.json();

    if (!name || !email || !phone) {
      return new Response("Missing fields", { status: 400 });
    }

    await adminDb.collection("playbook_leads").add({
      name,
      email,
      phone,
      source: "playbook",
      createdAt: Timestamp.now(),
    });

    const filePath = path.join(process.cwd(), "public/playbook.pdf");
    const fileBuffer = fs.readFileSync(filePath);
    const base64File = fileBuffer.toString("base64");

    await resend.emails.send({
      from: "Scholarra <onboarding@resend.dev>",
      to: email,
      subject: "Your Scholarship Playbook",
      html: `
  <div style="font-family: Arial, sans-serif; background:#f6f2ff; padding:24px;">
    
    <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:16px; padding:28px; border:1px solid #eee;">

      <h2 style="color:#111827; margin-bottom:10px;">
        Hi ${name},
      </h2>

      <p style="color:#374151; font-size:15px; line-height:1.6;">
        Your Scholarship Playbook is now ready.
      </p>

      <p style="color:#374151; font-size:15px; line-height:1.6;">
        This isn’t just a guide, it’s a structured system designed to help you stop guessing and start applying with clarity.
      </p>

      <div style="margin:20px 0; padding:16px; background:#f6f2ff; border-left:4px solid #8f6cd0; border-radius:10px;">
        <p style="margin:0; color:#111827; font-size:14px; line-height:1.6;">
          Most students don’t lose scholarships because they are unqualified, they lose because they don’t have a clear process.
        </p>
      </div>

      <h3 style="color:#111827; font-size:16px; margin-bottom:10px;">
        Inside the Playbook, you’ll learn:
      </h3>

      <ul style="padding-left:18px; color:#374151; font-size:14px; line-height:1.8;">
        <li>How to identify scholarships worth your time</li>
        <li>A simple system to stay organised and consistent</li>
        <li>How to position yourself even without “perfect” grades</li>
        <li>CV and essay frameworks that improve your chances</li>
      </ul>

      <p style="margin-top:18px; color:#374151; font-size:15px; line-height:1.6;">
        Don’t rush through it. Follow it step by step, that’s where the results come from.
      </p>

      <p style="margin-top:18px; font-weight:600; color:#111827;">
        You’ve already done the hard part by starting.
      </p>

      <p style="margin-top:6px; color:#374151;">
        Now it’s about execution.
      </p>

      <p style="margin-top:22px; font-size:14px; color:#6b7280;">
        - Scholarra Team
      </p>

    </div>

    <p style="text-align:center; font-size:12px; color:#9ca3af; margin-top:16px;">
      If you didn’t request this, you can ignore this email.
    </p>

  </div>
`,
      attachments: [
        {
          filename: "Scholarship-Playbook.pdf",
          content: base64File,
        },
      ],
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Subscribe error:", error);

    return new Response("Error processing request", { status: 500 });
  }
}
