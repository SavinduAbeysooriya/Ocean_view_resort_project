package com.example.backend.repository;

import com.example.backend.model.Guest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GuestRepository extends MongoRepository<Guest, String> {
}
