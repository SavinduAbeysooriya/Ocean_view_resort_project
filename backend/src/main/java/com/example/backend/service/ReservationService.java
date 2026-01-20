package com.example.backend.service;

import com.example.backend.model.Reservation;
import com.example.backend.model.enums.PaymentStatus;
import com.example.backend.model.enums.ReservationStatus;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ReservationService {
    List<Reservation> getAllReservations();
    Optional<Reservation> getReservationById(String id);
    Reservation createReservation(Reservation reservation);
    Reservation updateReservationStatus(String id, ReservationStatus status);
    Reservation updatePaymentStatus(String id, PaymentStatus status);
    void deleteReservation(String id);
    boolean checkAvailability(String roomId, LocalDate checkIn, LocalDate checkOut);
    List<Reservation> getReservationsByUserId(String userId);
}
