import { Resend } from "resend";
import fs from "fs";
import path from "path";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const filePath = path.join(process.cwd(), "public/playbook.pdf");
    const fileBuffer = fs.readFileSync(filePath);
    const base64File = fileBuffer.toString("base64");

    await resend.emails.send({
      from: "Playbook <onboarding@resend.dev>",
      to: email,
      subject: "Your Scholarship Playbook",
      html: `<p>Here’s your playbook attached</p>`,
      attachments: [
        {
          filename: "Scholarship-Playbook.pdf",
          content: base64File,
        },
      ],
    });

    return Response.json({ success: true });
  } catch (error) {
    return new Response("Error sending email", { status: 500 });
  }
}
