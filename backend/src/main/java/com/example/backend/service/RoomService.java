package com.example.backend.service;

import com.example.backend.model.Room;
import java.util.List;
import java.util.Optional;

public interface RoomService {
    List<Room> getAllRooms();
    Optional<Room> getRoomById(String id);
    Room createRoom(Room room);
    Room updateRoom(String id, Room roomDetails);
    void deleteRoom(String id);
}
