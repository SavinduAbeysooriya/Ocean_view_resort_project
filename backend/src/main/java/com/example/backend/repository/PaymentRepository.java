package com.example.backend.repository;

import com.example.backend.model.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends MongoRepository<Payment, String> {
    java.util.List<Payment> findByReservationId(String reservationId);
}
