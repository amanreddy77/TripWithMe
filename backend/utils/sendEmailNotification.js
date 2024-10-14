// utils/sendEmailNotification.js
import emailjs from 'emailjs-com';

const sendEmailNotification = async (existingBookings, newBooking) => {
  const emailParams = {
    to_email: 'amanreddyp08@gmail.com', // Replace with your admin or recipient email
    from_name: 'Trip-With-Me',
    message: `
      You have got a match from TripWithMe:
      - User 1: ${existingBookings[0].userId}, Tour: ${existingBookings[0].tourName}
      - User 2: ${newBooking.userId}, Tour: ${newBooking.tourName}
      Date: ${newBooking.date}
    `,
  };

  try {
    await emailjs.send(
      'service_dzwm4zr',  // EmailJS service ID
      'template_xkrbt2g', // EmailJS template ID
      emailParams,
      'YIfkQHSAOVoRq2aq2u'      // EmailJS user ID (public key)
    );
    console.log('Email notification sent successfully.');
  } catch (error) {
    console.error('Failed to send email notification:', error);
  }
};

export default sendEmailNotification;
