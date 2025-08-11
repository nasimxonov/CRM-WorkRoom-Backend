import { generate } from 'otp-generator';

const generateOtp = () => {
  const otp = generate(4, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  return otp;
};

export default generateOtp;
