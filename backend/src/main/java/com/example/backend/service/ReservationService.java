package com.example.backend.service;

import com.example.backend.model.Reservation;
import com.example.backend.model.enums.ReservationStatus;
import java.util.List;
import java.util.Optional;

public interface ReservationService {
    List<Reservation> getAllReservations();
    Optional<Reservation> getReservationById(String id);
    Reservation createReservation(Reservation reservation);
    Reservation updateReservationStatus(String id, ReservationStatus status);
    void deleteReservation(String id);
}
