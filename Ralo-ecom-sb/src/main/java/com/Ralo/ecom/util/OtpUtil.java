package com.Ralo.ecom.util;

import java.util.Random;

public class OtpUtil {
    public static String generateOtp() {
        int otpLength = 6;

        Random random = new Random();
        StringBuilder otp = new StringBuilder(otpLength);

        for (int i = 0; i < otpLength; i++) {
            int digit = random.nextInt(10);
            otp.append(digit);
        }

        return otp.toString();
    }
}