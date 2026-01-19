package com.example.backend.config;

import com.example.backend.model.Reservation;
import com.example.backend.model.Room;
import com.example.backend.model.enums.ReservationStatus;
import com.example.backend.model.enums.RoomStatus;
import com.example.backend.repository.ReservationRepository;
import com.example.backend.repository.RoomRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(RoomRepository roomRepository, ReservationRepository reservationRepository) {
        return args -> {
            Room room = null;
            if (roomRepository.count() == 0) {
                room = new Room();
                room.setRoomNumber("101");
                room.setRatePerNight(new BigDecimal("500.00"));
                room.setCapacity(2);
                room.setNotes("Deluxe Ocean View (Auto-Generated)");
                room.setStatus(RoomStatus.available);
                room.setAc(true);
                room.setBedType("King");
                roomRepository.save(room);
                System.out.println("Auto-generated Test Room 101");
            } else {
                room = roomRepository.findAll().get(0);
            }

            if (reservationRepository.count() == 0 && room != null) {
                Reservation res = new Reservation();
                res.setReservationNumber("RES-DEMO-001");
                res.setGuestId("guest-001"); // Placeholder
                res.setRoomId(room.getId());
                res.setCheckInDate(LocalDate.now());
                res.setCheckOutDate(LocalDate.now().plusDays(3));
                res.setTotalNights(3);
                res.setTotalCost(room.getRatePerNight().multiply(new BigDecimal(3)));
                res.setStatus(ReservationStatus.pending);
                res.setCreatedAt(LocalDateTime.now());
                res.setUpdatedAt(LocalDateTime.now());
                
                reservationRepository.save(res);
                System.out.println("Auto-generated Test Reservation RES-DEMO-001");
            }
        };
    }
}
