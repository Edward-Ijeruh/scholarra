import { Resend } from "resend";
import { render } from "@react-email/render";
import { ReactElement } from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string;
  subject: string;
  react: ReactElement;
}) {
  const html = await render(react);

  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to,
    subject,
    html,
  });

  if (error) {
    console.error("Resend error:", error);
    throw new Error(error.message);
  }

  console.log("Email sent:", data);
  return data;
}
