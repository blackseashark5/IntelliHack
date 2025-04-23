import emailjs from '@emailjs/browser';

const SERVICE_ID = 'YOUR_SERVICE_ID';
const TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

export const sendEmail = async (to: string, subject: string, message: string) => {
  try {
    const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
      to_email: to,
      subject: subject,
      message: message,
    }, PUBLIC_KEY);
    
    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};