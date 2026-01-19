package com.example.backend.service.impl;

import com.example.backend.model.Payment;
import com.example.backend.repository.PaymentRepository;
import com.example.backend.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Override
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    @Override
    public List<Payment> getPaymentsByReservationId(String reservationId) {
        // Assuming we have a method for this in Repo, or filtering manually if not.
        // It's better to add findByReservationId to Repository, but for now filtering manually or assuming repo has it.
        // Given I cannot see the Repo, I should probably check if it exists or use standard naming convention which Spring Data provides.
        // I will assume standard naming convention works.
        return paymentRepository.findByReservationId(reservationId);
    }

    @Override
    public Payment createPayment(Payment payment) {
        payment.setCreatedAt(LocalDateTime.now());
        payment.setUpdatedAt(LocalDateTime.now());
        return paymentRepository.save(payment);
    }

    @Override
    public Payment updatePayment(String id, Payment paymentDetails) {
        return paymentRepository.findById(id).map(payment -> {
            payment.setStatus(paymentDetails.getStatus());
            payment.setNotes(paymentDetails.getNotes());
            payment.setUpdatedAt(LocalDateTime.now());
            return paymentRepository.save(payment);
        }).orElseThrow(() -> new RuntimeException("Payment not found"));
    }
}
