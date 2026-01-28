package com.example.backend.service;

import com.example.backend.model.Reservation;
import com.example.backend.model.enums.ReservationStatus;
import com.example.backend.repository.ReservationRepository;
import com.example.backend.service.impl.ReservationServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ReservationServiceTest {

    @Mock
    private ReservationRepository reservationRepository;

    @InjectMocks
    private ReservationServiceImpl reservationService;

    @Test
    void checkAvailability_ShouldReturnTrue_WhenNoOverlappingFound() {
        when(reservationRepository.findOverlappingReservations(anyString(), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(Collections.emptyList());

        boolean isAvailable = reservationService.checkAvailability("room1", LocalDate.now(), LocalDate.now().plusDays(2));

        assertThat(isAvailable).isTrue();
    }

    @Test
    void checkAvailability_ShouldReturnFalse_WhenOverlappingFound() {
        when(reservationRepository.findOverlappingReservations(anyString(), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(List.of(new Reservation()));

        boolean isAvailable = reservationService.checkAvailability("room1", LocalDate.now(), LocalDate.now().plusDays(2));

        assertThat(isAvailable).isFalse();
    }

    @Test
    void createReservation_ShouldSetDefaultStatus() {
        Reservation res = new Reservation();
        when(reservationRepository.save(any(Reservation.class))).thenReturn(res);

        Reservation saved = reservationService.createReservation(res);

        assertThat(saved.getStatus()).isEqualTo(ReservationStatus.pending);
    }
}
