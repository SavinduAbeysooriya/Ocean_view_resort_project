package com.example.backend.service;

import com.example.backend.model.RoomCategory;
import com.example.backend.repository.RoomCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoomCategoryService {

    @Autowired
    private RoomCategoryRepository roomCategoryRepository;

    public List<RoomCategory> getAllCategories() {
        return roomCategoryRepository.findAll();
    }

    public Optional<RoomCategory> getCategoryById(String id) {
        return roomCategoryRepository.findById(id);
    }

    public RoomCategory createCategory(RoomCategory category) {
        return roomCategoryRepository.save(category);
    }

    public RoomCategory updateCategory(String id, RoomCategory categoryDetails) {
        RoomCategory category = roomCategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room category not found with id: " + id));
        
        category.setCategory(categoryDetails.getCategory());
        category.setDescription(categoryDetails.getDescription());
        category.setCategoryImage(categoryDetails.getCategoryImage());
        
        return roomCategoryRepository.save(category);
    }

    public void deleteCategory(String id) {
        roomCategoryRepository.deleteById(id);
    }
}
