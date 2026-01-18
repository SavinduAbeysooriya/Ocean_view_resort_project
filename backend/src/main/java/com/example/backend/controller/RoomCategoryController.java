package com.example.backend.controller;

import com.example.backend.model.RoomCategory;
import com.example.backend.service.RoomCategoryService;
import com.example.backend.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/room-categories")
@CrossOrigin(origins = "http://localhost:5173")
public class RoomCategoryController {

    @Autowired
    private RoomCategoryService roomCategoryService;

    @Autowired
    private FileService fileService;

    @GetMapping
    public List<RoomCategory> getAllCategories() {
        return roomCategoryService.getAllCategories();
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomCategory> getCategoryById(@PathVariable String id) {
        return roomCategoryService.getCategoryById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<RoomCategory> createCategory(
            @RequestParam("category") String category,
            @RequestParam("description") String description,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        
        try {
            RoomCategory roomCategory = new RoomCategory();
            roomCategory.setCategory(category);
            roomCategory.setDescription(description);
            
            if (image != null && !image.isEmpty()) {
                String imagePath = fileService.saveFile(image);
                roomCategory.setCategoryImage(imagePath);
            }
            
            return ResponseEntity.ok(roomCategoryService.createCategory(roomCategory));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<RoomCategory> updateCategory(
            @PathVariable String id,
            @RequestParam("category") String category,
            @RequestParam("description") String description,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        
        try {
            RoomCategory categoryDetails = new RoomCategory();
            categoryDetails.setCategory(category);
            categoryDetails.setDescription(description);
            
            if (image != null && !image.isEmpty()) {
                String imagePath = fileService.saveFile(image);
                categoryDetails.setCategoryImage(imagePath);
            } else {
                // If no new image, keep the existing one
                roomCategoryService.getCategoryById(id).ifPresent(existing -> {
                    categoryDetails.setCategoryImage(existing.getCategoryImage());
                });
            }
            
            return ResponseEntity.ok(roomCategoryService.updateCategory(id, categoryDetails));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable String id) {
        roomCategoryService.deleteCategory(id);
        return ResponseEntity.ok().build();
    }
}
