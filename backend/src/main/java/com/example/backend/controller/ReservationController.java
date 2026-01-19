package com.example.backend.controller;

import com.example.backend.model.Reservation;
import com.example.backend.model.enums.ReservationStatus;
import com.example.backend.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping
    public Reservation createReservation(@RequestBody Reservation reservation) {
        return reservationService.createReservation(reservation);
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

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable String id) {
        reservationService.deleteReservation(id);
        return ResponseEntity.noContent().build();
    }
}
