package com.example.backend.controller;

import com.example.backend.model.Payment;
import com.example.backend.model.Reservation;
import com.example.backend.model.enums.PaymentStatus;
import com.example.backend.repository.PaymentRepository;
import com.example.backend.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private com.example.backend.repository.InvoiceRepository invoiceRepository;

    @Autowired
    private com.example.backend.service.ReservationService reservationService;

    @PostMapping("/success")
    public ResponseEntity<?> recordSuccess(@RequestBody Map<String, Object> payload) {
        String reservationId = (String) payload.get("reservationId");
        String payhereId = (String) payload.get("payhereId");
        BigDecimal amount = new BigDecimal(payload.get("amount").toString());
        String currency = (String) payload.get("currency");

        return processPayment(reservationId, payhereId, amount, currency, "payhere");
    }

    @PostMapping
    public ResponseEntity<?> recordPayment(@RequestBody Map<String, Object> payload) {
        String reservationId = (String) payload.get("reservationId");
        String payhereId = (String) payload.get("payhereId");
        BigDecimal amount = new BigDecimal(payload.get("amount").toString());
        String method = (String) payload.get("paymentMethod");

        return processPayment(reservationId, payhereId, amount, "LKR", method);
    }

    private ResponseEntity<?> processPayment(String reservationId, String payhereId, BigDecimal amount, String currency, String method) {
        // 1. Create Payment Record
        Payment payment = new Payment();
        payment.setReservationId(reservationId);
        payment.setPayhereId(payhereId);
        payment.setAmount(amount);
        payment.setCurrency(currency != null ? currency : "LKR");
        payment.setMethod(method != null ? method : "manual");
        payment.setStatus(com.example.backend.model.enums.PaymentStatus.paid);
        payment.setCreatedAt(LocalDateTime.now());
        paymentRepository.save(payment);

        // 2. Update Reservation Status
        try {
            reservationService.updatePaymentStatus(reservationId, PaymentStatus.paid);
            
            // 3. Create/Update Invoice Record
            com.example.backend.model.Invoice invoice = invoiceRepository.findByReservationId(reservationId)
                    .orElse(new com.example.backend.model.Invoice());
            
            invoice.setReservationId(reservationId);
            invoice.setAmount(amount);
            invoice.setSubtotal(amount);
            invoice.setCurrency(currency != null ? currency : "LKR");
            invoice.setStatus(com.example.backend.model.enums.InvoiceStatus.paid);
            invoice.setIssueDate(LocalDateTime.now());
            if (invoice.getInvoiceNumber() == null) {
                invoice.setInvoiceNumber("INV-" + System.currentTimeMillis() % 1000000);
            }
            invoiceRepository.save(invoice);
        } catch (Exception e) {
            // Log error but payment record is already saved
            System.err.println("Failed to update reservation/invoice after payment: " + e.getMessage());
        }

        return ResponseEntity.ok(Map.of("message", "Payment recorded successfully", "payment", payment));
    }
}
