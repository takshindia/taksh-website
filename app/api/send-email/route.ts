import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "mahamayamomaiarts@gmail.com",
      subject: "TAKSH Email Test",
      html: "<h2>✅ Email System Working!</h2><p>Congratulations! Your TAKSH email system is ready.</p>",
    });

    return Response.json(data);
  } catch (error) {
    return Response.json(error);
  }
}