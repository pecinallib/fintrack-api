import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendPasswordResetEmail(to, token) {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  const info = await transporter.sendMail({
    from: `"FinTrack" <${process.env.SMTP_EMAIL}>`,
    to,
    subject: 'Recuperação de senha — FinTrack',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #7c3aed; margin-bottom: 16px;">Recuperação de Senha</h2>
        <p style="color: #334155; line-height: 1.6;">
          Você solicitou a recuperação de senha da sua conta FinTrack.
          Clique no botão abaixo para definir uma nova senha:
        </p>
        <a href="${resetUrl}" 
           style="display: inline-block; margin: 24px 0; padding: 12px 32px; background: #7c3aed; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
          Redefinir Senha
        </a>
        <p style="color: #64748b; font-size: 14px; line-height: 1.6;">
          Este link expira em <strong>15 minutos</strong>. Se você não solicitou a recuperação, ignore este email.
        </p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="color: #94a3b8; font-size: 12px;">FinTrack — Controle Financeiro Pessoal</p>
      </div>
    `,
  });

  console.log('Email enviado:', info.messageId);
  return info;
}
