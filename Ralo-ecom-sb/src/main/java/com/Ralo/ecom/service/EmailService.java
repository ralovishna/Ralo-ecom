package com.Ralo.ecom.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.MailException;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender javaMailSender;

    public void sendVerificationOtpEmail(String email, String subject, String message) throws MessagingException {
        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
            helper.setText(message);
            helper.setTo(email);
            helper.setSubject(subject);
            javaMailSender.send(mimeMessage);
        } catch (MailException e) {
            e.printStackTrace(); // or use a logger
            throw new MailSendException("Failed to send email: " + e.getMessage(), e);
        }
    }
}