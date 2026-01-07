import * as brevo from '@getbrevo/brevo';

const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey, 
  process.env.BREVO_API_KEY!
);

const getVerificationTemplate = (name: string, code: string) => {
  return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Verifikasi Akun LISAN</title>
    <style>
      body { margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333333; line-height: 1.6; }
      .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; padding: 40px; border: 1px solid #dddddd; border-radius: 8px; }
      .header { border-bottom: 1px solid #eeeeee; padding-bottom: 20px; margin-bottom: 30px; }
      .logo { font-size: 24px; font-weight: bold; color: #333333; text-decoration: none; }
      .content { margin-bottom: 30px; }
      .greeting { font-size: 18px; font-weight: bold; margin-bottom: 15px; }
      .text { font-size: 16px; color: #555555; margin-bottom: 20px; }
      .otp-container { background-color: #f8f9fa; border: 1px dashed #cccccc; border-radius: 6px; padding: 20px; text-align: center; margin: 25px 0; }
      .otp-code { font-family: monospace; font-size: 32px; font-weight: bold; color: #000000; letter-spacing: 5px; display: inline-block; }
      .footer { font-size: 12px; color: #999999; text-align: center; margin-top: 40px; border-top: 1px solid #eeeeee; padding-top: 20px; }
      @media (max-width: 600px) { .container { width: 100%; margin: 0; border: none; border-radius: 0; padding: 20px; } }
    </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><span class="logo">LISAN</span></div>
        <div class="content">
          <div class="greeting">Halo, ${name}</div>
          <div class="text">Terima kasih telah mendaftar. Untuk menyelesaikan proses verifikasi akun Anda, silakan gunakan kode di bawah ini:</div>
          <div class="otp-container"><span class="otp-code">${code}</span></div>
          <div class="text" style="font-size: 14px;">Kode ini hanya berlaku selama 24 jam. Jangan berikan kode ini kepada siapa pun.</div>
        </div>
        <div class="footer">&copy; ${new Date().getFullYear()} LISAN.</div>
      </div>
    </body>
    </html>
  `;
};

export const sendVerificationEmail = async (toEmail: string, toName: string, otpCode: string) => {
  const sendSmtpEmail = new brevo.SendSmtpEmail();

  sendSmtpEmail.sender = { 
    name: process.env.BREVO_SENDER_NAME || "LISAN Official", 
    email: process.env.BREVO_SENDER_EMAIL || "no-reply@lisan.com"
  };
  
  sendSmtpEmail.to = [{ email: toEmail, name: toName }];
  sendSmtpEmail.subject = "Kode Verifikasi Akun LISAN Anda";
  sendSmtpEmail.htmlContent = getVerificationTemplate(toName, otpCode);

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return { success: true, messageId: data.body.messageId };
  } catch (error) {
    return { success: false, error };
  }
};