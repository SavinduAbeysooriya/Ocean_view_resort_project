package com.example.backend.controller;

import com.example.backend.model.Reservation;
import com.example.backend.model.enums.PaymentStatus;
import com.example.backend.model.enums.ReservationStatus;
import com.example.backend.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:5173")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @GetMapping
    public List<Reservation> getAllReservations() {
        return reservationService.getAllReservations();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reservation> getReservationById(@PathVariable String id) {
        return reservationService.getReservationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public List<Reservation> getReservationsByUserId(@PathVariable String userId) {
        return reservationService.getReservationsByUserId(userId);
    }

    @PostMapping
    public Reservation createReservation(@RequestBody Reservation reservation) {
        return reservationService.createReservation(reservation);
    }

    @PostMapping("/check-availability")
    public ResponseEntity<Map<String, Boolean>> checkAvailability(
            @RequestBody Map<String, Object> payload) {
        String roomId = (String) payload.get("roomId");
        LocalDate checkIn = LocalDate.parse((String) payload.get("checkInDate"));
        LocalDate checkOut = LocalDate.parse((String) payload.get("checkOutDate"));
        
        boolean available = reservationService.checkAvailability(roomId, checkIn, checkOut);
        return ResponseEntity.ok(Map.of("available", available));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Reservation> updateReservationStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> payload) {
        try {
            ReservationStatus status = ReservationStatus.valueOf(payload.get("status"));
            return ResponseEntity.ok(reservationService.updateReservationStatus(id, status));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/payment")
    public ResponseEntity<Reservation> updatePaymentStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> payload) {
        try {
            PaymentStatus status = PaymentStatus.valueOf(payload.get("status"));
            return ResponseEntity.ok(reservationService.updatePaymentStatus(id, status));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable String id) {
        reservationService.deleteReservation(id);
        return ResponseEntity.noContent().build();
    }
}
