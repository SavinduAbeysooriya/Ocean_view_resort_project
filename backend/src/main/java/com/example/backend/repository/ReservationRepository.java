package com.example.backend.repository;

import com.example.backend.model.Reservation;
import com.example.backend.model.enums.ReservationStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservationRepository extends MongoRepository<Reservation, String> {
    List<Reservation> findByGuestId(String guestId);

    @Query("{ 'roomId': ?0, 'status': { $ne: 'cancelled' }, $or: [ " +
           "{ 'checkInDate': { $lt: ?2 }, 'checkOutDate': { $gt: ?1 } } ] }")
    List<Reservation> findOverlappingReservations(String roomId, LocalDate checkIn, LocalDate checkOut);
}

