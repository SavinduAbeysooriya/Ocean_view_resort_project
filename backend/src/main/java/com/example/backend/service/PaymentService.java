package com.example.backend.service;

import com.example.backend.model.Payment;
import java.util.List;
import java.util.Optional;

public interface PaymentService {
    List<Payment> getAllPayments();
    List<Payment> getPaymentsByReservationId(String reservationId);
    Payment createPayment(Payment payment);
    Payment updatePayment(String id, Payment payment);
}
