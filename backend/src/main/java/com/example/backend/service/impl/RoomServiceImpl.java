package com.example.backend.service.impl;

import com.example.backend.model.Room;
import com.example.backend.repository.RoomRepository;
import com.example.backend.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoomServiceImpl implements RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Override
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    @Override
    public Optional<Room> getRoomById(String id) {
        return roomRepository.findById(id);
    }

    @Override
    public Room createRoom(Room room) {
        return roomRepository.save(room);
    }

    @Override
    public Room updateRoom(String id, Room roomDetails) {
        return roomRepository.findById(id).map(room -> {
            room.setRoomNumber(roomDetails.getRoomNumber());
            room.setRoomCategoryId(roomDetails.getRoomCategoryId());
            room.setNotes(roomDetails.getNotes());
            room.setAmenities(roomDetails.getAmenities());
            room.setAc(roomDetails.isAc());
            room.setBedType(roomDetails.getBedType());
            room.setRatePerNight(roomDetails.getRatePerNight());
            room.setCapacity(roomDetails.getCapacity());
            room.setStatus(roomDetails.getStatus());
            room.setImage1(roomDetails.getImage1());
            room.setImage2(roomDetails.getImage2());
            room.setImage3(roomDetails.getImage3());
            return roomRepository.save(room);
        }).orElseThrow(() -> new RuntimeException("Room not found with id " + id));
    }

    @Override
    public void deleteRoom(String id) {
        roomRepository.deleteById(id);
    }
}
