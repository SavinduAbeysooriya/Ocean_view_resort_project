package com.example.backend.repository;

import com.example.backend.model.RoomCategory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomCategoryRepository extends MongoRepository<RoomCategory, String> {
}
