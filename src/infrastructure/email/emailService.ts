import { Resend } from 'resend';
import { config } from '../../config';

const resend = new Resend(config.resendApiKey);

export const sendSignInEmail = async (email: string, token: string) => {
  const signInLink = `${config.apiBaseUrl}/api/v1/sigin/post?token=${token}`;

    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Sign In to you App',
            html: `<p>Click <a href="${signInLink}">here</a> to sign in.</p>`,
        });
        console.log(`sing-in email sent to ${email}`);
    } catch (error) {
      console.error('Failed to send email:',error);
      throw new Error('Email sending failed.');
    }

};
