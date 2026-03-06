import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendPublishRequestNotification(data: {
  name: string;
  email: string;
  phone?: string;
  province?: string;
  hectares?: number;
  activity?: string;
  description?: string;
}) {
  const to = process.env.NOTIFICATION_EMAIL;
  if (!to) return;

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: `Nueva solicitud de publicacion - ${data.name}`,
    html: `
      <h2>Nueva solicitud de publicacion</h2>
      <p><strong>Nombre:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Telefono:</strong> ${data.phone || '-'}</p>
      <p><strong>Provincia:</strong> ${data.province || '-'}</p>
      <p><strong>Hectareas:</strong> ${data.hectares || '-'}</p>
      <p><strong>Actividad:</strong> ${data.activity || '-'}</p>
      <p><strong>Descripcion:</strong> ${data.description || '-'}</p>
    `,
  });
}
