package com.example.backend.controller;

import com.example.backend.model.Room;
import com.example.backend.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "http://localhost:5173")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @Autowired
    private com.example.backend.service.FileService fileService;

    @GetMapping
    public List<Room> getAllRooms() {
        return roomService.getAllRooms();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Room> getRoomById(@PathVariable String id) {
        return roomService.getRoomById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<Room> createRoom(
            @RequestParam("roomNumber") String roomNumber,
            @RequestParam("roomCategoryId") String roomCategoryId,
            @RequestParam(value = "notes", required = false) String notes,
            @RequestParam(value = "amenities", required = false) String amenities,
            @RequestParam("ac") boolean ac,
            @RequestParam(value = "bedType", required = false) String bedType,
            @RequestParam("ratePerNight") java.math.BigDecimal ratePerNight,
            @RequestParam("capacity") Integer capacity,
            @RequestParam("status") com.example.backend.model.enums.RoomStatus status,
            @RequestParam(value = "image1", required = false) org.springframework.web.multipart.MultipartFile image1,
            @RequestParam(value = "image2", required = false) org.springframework.web.multipart.MultipartFile image2,
            @RequestParam(value = "image3", required = false) org.springframework.web.multipart.MultipartFile image3) {
        
        try {
            Room room = new Room();
            room.setRoomNumber(roomNumber);
            room.setRoomCategoryId(roomCategoryId);
            room.setNotes(notes);
            room.setAmenities(amenities);
            room.setAc(ac);
            room.setBedType(bedType);
            room.setRatePerNight(ratePerNight);
            room.setCapacity(capacity);
            room.setStatus(status);

            if (image1 != null && !image1.isEmpty()) room.setImage1(fileService.saveFile(image1));
            if (image2 != null && !image2.isEmpty()) room.setImage2(fileService.saveFile(image2));
            if (image3 != null && !image3.isEmpty()) room.setImage3(fileService.saveFile(image3));

            return ResponseEntity.ok(roomService.createRoom(room));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<Room> updateRoom(
            @PathVariable String id,
            @RequestParam("roomNumber") String roomNumber,
            @RequestParam("roomCategoryId") String roomCategoryId,
            @RequestParam(value = "notes", required = false) String notes,
            @RequestParam(value = "amenities", required = false) String amenities,
            @RequestParam("ac") boolean ac,
            @RequestParam(value = "bedType", required = false) String bedType,
            @RequestParam("ratePerNight") java.math.BigDecimal ratePerNight,
            @RequestParam("capacity") Integer capacity,
            @RequestParam("status") com.example.backend.model.enums.RoomStatus status,
            @RequestParam(value = "image1", required = false) org.springframework.web.multipart.MultipartFile image1,
            @RequestParam(value = "image2", required = false) org.springframework.web.multipart.MultipartFile image2,
            @RequestParam(value = "image3", required = false) org.springframework.web.multipart.MultipartFile image3) {
        
        try {
            Room roomDetails = new Room();
            roomDetails.setRoomNumber(roomNumber);
            roomDetails.setRoomCategoryId(roomCategoryId);
            roomDetails.setNotes(notes);
            roomDetails.setAmenities(amenities);
            roomDetails.setAc(ac);
            roomDetails.setBedType(bedType);
            roomDetails.setRatePerNight(ratePerNight);
            roomDetails.setCapacity(capacity);
            roomDetails.setStatus(status);

            Room existing = roomService.getRoomById(id).orElseThrow();
            
            if (image1 != null && !image1.isEmpty()) roomDetails.setImage1(fileService.saveFile(image1));
            else roomDetails.setImage1(existing.getImage1());
            
            if (image2 != null && !image2.isEmpty()) roomDetails.setImage2(fileService.saveFile(image2));
            else roomDetails.setImage2(existing.getImage2());
            
            if (image3 != null && !image3.isEmpty()) roomDetails.setImage3(fileService.saveFile(image3));
            else roomDetails.setImage3(existing.getImage3());

            return ResponseEntity.ok(roomService.updateRoom(id, roomDetails));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable String id) {
        roomService.deleteRoom(id);
        return ResponseEntity.ok().build();
    }
}
