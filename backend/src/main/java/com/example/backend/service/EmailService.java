package com.example.backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Async
    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom("no-reply@oceanviewresort.com");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true); 
            
            mailSender.send(message);
        } catch (MessagingException e) {
            System.err.println("Failed to send email to " + to + ": " + e.getMessage());
        }
    }

    @Async
    public void processContactEnquiry
    (String name, String email, String subject, String message, String adminHtml, String userHtml) {
        try {
            // 1. Send Admin Notification
            sendHtmlEmailInternal("admin@oceanviewresort.com", "New Contact: " + subject, adminHtml);
            
            // 2. Wait to respect Mailtrap rate limits (1 email per second)
            Thread.sleep(2000);
            
            // 3. Send User Confirmation
            sendHtmlEmailInternal(email, "Thank you for contacting Ocean View Resort", userHtml);
            
        } catch (Exception e) {
            System.err.println("Background Email Error: " + e.getMessage());
        }
    }

    private void sendHtmlEmailInternal(String to, String subject, String htmlContent) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom("no-reply@oceanviewresort.com");
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);
        mailSender.send(message);
    }
}
