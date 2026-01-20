package com.example.backend.service.impl;

import com.example.backend.model.Guest;
import com.example.backend.model.Reservation;
import com.example.backend.model.enums.PaymentStatus;
import com.example.backend.model.enums.ReservationStatus;
import com.example.backend.repository.ReservationRepository;
import com.example.backend.repository.GuestRepository;
import com.example.backend.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ReservationServiceImpl implements ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private GuestRepository guestRepository;

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
        if (reservation.getStatus() == null) {
            reservation.setStatus(ReservationStatus.pending);
        }
        if (reservation.getPaymentStatus() == null) {
            reservation.setPaymentStatus(PaymentStatus.unpaid);
        }
        
        // Generate Reservation Number if missing
        if (reservation.getReservationNumber() == null || reservation.getReservationNumber().isEmpty()) {
            reservation.setReservationNumber("RES-" + (System.currentTimeMillis() % 1000000));
        }
        Reservation saved = reservationRepository.save(reservation);
        
        return saved;
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
    public Reservation updatePaymentStatus(String id, PaymentStatus status) {
        return reservationRepository.findById(id)
                .map(res -> {
                    res.setPaymentStatus(status);
                    res.setUpdatedAt(LocalDateTime.now());
                    return reservationRepository.save(res);
                }).orElseThrow(() -> new RuntimeException("Reservation not found"));
    }

    @Override
    public void deleteReservation(String id) {
        reservationRepository.deleteById(id);
    }

    @Override
    public boolean checkAvailability(String roomId, LocalDate checkIn, LocalDate checkOut) {
        List<Reservation> overlapping = reservationRepository.findOverlappingReservations(roomId, checkIn, checkOut);
        return overlapping.isEmpty();
    }

    @Override
    public List<Reservation> getReservationsByUserId(String userId) {
        Optional<Guest> guest = guestRepository.findByUserId(userId);
        if (guest.isPresent()) {
            return reservationRepository.findByGuestId(guest.get().getId());
        }
        return new ArrayList<>();
    }
}
