package com.example.backend.controller;

import com.example.backend.dto.ContactRequest;
import com.example.backend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "http://localhost:5173")
public class ContactController {

    @Autowired
    private EmailService emailService;

    @PostMapping
    public ResponseEntity<String> submitContactForm(@RequestBody ContactRequest request) {
        try {
            // Generate Admin HTML
            String adminHtml = "<html><body style='font-family: Arial, sans-serif; background-color: #f9f8f4; padding: 40px;'>" +
                    "<div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #d4af37; border-radius: 4px; overflow: hidden;'>" +
                    "  <div style='background-color: #0a0a0a; padding: 30px; text-align: center; border-bottom: 2px solid #d4af37;'>" +
                    "    <h1 style='color: #d4af37; margin: 0; font-family: serif; letter-spacing: 2px; text-transform: uppercase;'>Ocean View Resort</h1>" +
                    "    <p style='color: #ffffff; margin-top: 5px; font-size: 10px; text-transform: uppercase; letter-spacing: 3px;'>Luxury Contact Desk</p>" +
                    "  </div>" +
                    "  <div style='padding: 40px;'>" +
                    "    <h2 style='color: #1a1a1a; font-family: serif; border-bottom: 1px solid #eeeeee; padding-bottom: 10px;'>New Enquiry Received</h2>" +
                    "    <table style='width: 100%; border-collapse: collapse; margin-top: 20px;'>" +
                    "      <tr><td style='padding: 10px 0; color: #888888; width: 100px;'>Name:</td><td style='padding: 10px 0; color: #1a1a1a; font-weight: bold;'>" + request.getName() + "</td></tr>" +
                    "      <tr><td style='padding: 10px 0; color: #888888;'>Email:</td><td style='padding: 10px 0; color: #1a1a1a;'>" + request.getEmail() + "</td></tr>" +
                    "      <tr><td style='padding: 10px 0; color: #888888;'>Subject:</td><td style='padding: 10px 0; color: #1a1a1a;'>" + request.getSubject() + "</td></tr>" +
                    "    </table>" +
                    "    <div style='margin-top: 30px; padding: 20px; background-color: #fcfcfc; border-left: 4px solid #d4af37; font-style: italic; color: #444444;'>" +
                    "      \"" + request.getMessage() + "\"" +
                    "    </div>" +
                    "  </div>" +
                    "</div></body></html>";

            // Generate User HTML
            String userHtml = "<html><body style='font-family: Arial, sans-serif; background-color: #f9f8f4; padding: 40px;'>" +
                    "<div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 4px; overflow: hidden;'>" +
                    "  <div style='background-color: #0a0a0a; padding: 40px; text-align: center;'>" +
                    "    <h1 style='color: #d4af37; margin: 0; font-family: serif; text-transform: uppercase;'>Ocean View</h1>" +
                    "    <p style='color: #ffffff; margin-top: 10px;'>Your enquiry has been received</p>" +
                    "  </div>" +
                    "  <div style='padding: 40px; text-align: center;'>" +
                    "    <p style='font-size: 16px; color: #333;'>Dear " + request.getName() + ",</p>" +
                    "    <p style='color: #666; line-height: 1.6;'>Thank you for reaching out to us. We have received your message regarding <strong>\"" + request.getSubject() + "\"</strong> and our concierge team will get back to you within the next 24 hours.</p>" +
                    "  </div>" +
                    "</div></body></html>";

            // Process in background
            emailService.processContactEnquiry(
                request.getName(), 
                request.getEmail(), 
                request.getSubject(), 
                request.getMessage(),
                adminHtml,
                userHtml
            );

            // Return success immediately to the frontend
            return ResponseEntity.ok("Message sent successfully!");
        } catch (Exception e) {
            System.err.println("Controller Error: " + e.getMessage());
            return ResponseEntity.status(500).body("An error occurred while preparing your message. Please try again.");
        }
    }
}
