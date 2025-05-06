import dotenv from 'dotenv';

dotenv.config();

const SMS_CONFIG = {
  SERVER: "https://app.sms8.io",
  API_KEY: "4c2f4abe7f4ac377813528e1fbc93d43697c9047",
  DEVICE_ID: "2017",
  DEVICE_SLOT: "1",  // Updated to 1 from 0
  TYPE: "sms",
  PRIORITIZE: "0"
};

export const sendSMS = async (phoneNumber: string, message: string): Promise<any> => {
  try {
    // Format the URL exactly as provided
    const url = `${SMS_CONFIG.SERVER}/services/send.php?key=${SMS_CONFIG.API_KEY}&number=${encodeURIComponent(phoneNumber)}&message=${encodeURIComponent(message)}&devices=${SMS_CONFIG.DEVICE_ID}%7C${SMS_CONFIG.DEVICE_SLOT}&type=${SMS_CONFIG.TYPE}&prioritize=${SMS_CONFIG.PRIORITIZE}`;
    
    const response = await fetch(url);
    const responseText = await response.text();
    
    console.log('SMS Response:', responseText);
    
    try {
      return JSON.parse(responseText);
    } catch (e) {
      return { raw: responseText };
    }
  } catch (error) {
    console.error('SMS sending failed:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Usage example:
// await sendSMS('+243813333962', 'Hello from API');