package com.example.backend.service.impl;

import com.example.backend.model.Reservation;
import com.example.backend.model.enums.ReservationStatus;
import com.example.backend.repository.ReservationRepository;
import com.example.backend.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReservationServiceImpl implements ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Override
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    @Override
    public Optional<Reservation> getReservationById(String id) {
        return reservationRepository.findById(id);
    }

    @Override
    public Reservation createReservation(Reservation reservation) {
        reservation.setCreatedAt(LocalDateTime.now());
        reservation.setUpdatedAt(LocalDateTime.now());
        return reservationRepository.save(reservation);
    }

    @Override
    public Reservation updateReservationStatus(String id, ReservationStatus status) {
        return reservationRepository.findById(id)
                .map(res -> {
                    res.setStatus(status);
                    res.setUpdatedAt(LocalDateTime.now());
                    return reservationRepository.save(res);
                }).orElseThrow(() -> new RuntimeException("Reservation not found"));
    }

    @Override
    public void deleteReservation(String id) {
        reservationRepository.deleteById(id);
    }
}
