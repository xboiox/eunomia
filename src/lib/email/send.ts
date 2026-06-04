import nodemailer from "nodemailer";

function isSmtpConfigured(): boolean {
  return Boolean(
    process.env.EMAIL_SERVER_HOST &&
    process.env.EMAIL_SERVER_HOST !== "smtp.example.com" &&
    process.env.EMAIL_SERVER_USER &&
    process.env.EMAIL_SERVER_PASSWORD,
  );
}

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT ?? 587),
    secure: Number(process.env.EMAIL_SERVER_PORT) === 465,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });
}

export interface TenantAddedEmailOptions {
  to: string;
  userName: string;
  tenantName: string;
  role: string;
  appUrl: string;
}

export async function sendTenantAddedEmail(opts: TenantAddedEmailOptions): Promise<void> {
  if (!isSmtpConfigured()) return;

  const transport = createTransport();
  await transport.sendMail({
    from: process.env.EMAIL_FROM ?? "Eunomia <noreply@example.com>",
    to: opts.to,
    subject: `You have been added to ${opts.tenantName} on Eunomia`,
    text: [
      `Hi ${opts.userName},`,
      "",
      `You have been added to the organization "${opts.tenantName}" as ${opts.role} on the Eunomia IT Compliance Dashboard.`,
      "",
      `Sign in at: ${opts.appUrl}/signin`,
      "",
      "If you did not expect this, please contact your administrator.",
    ].join("\n"),
    html: `
      <p>Hi ${opts.userName},</p>
      <p>You have been added to the organization <strong>${opts.tenantName}</strong> as <strong>${opts.role}</strong> on the Eunomia IT Compliance Dashboard.</p>
      <p><a href="${opts.appUrl}/signin">Sign in to Eunomia</a></p>
      <p style="color:#6b7280;font-size:12px">If you did not expect this, please contact your administrator.</p>
    `,
  });
}
