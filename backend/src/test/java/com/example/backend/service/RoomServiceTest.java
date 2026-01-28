package com.example.backend.service;

import com.example.backend.model.Room;
import com.example.backend.repository.RoomRepository;
import com.example.backend.service.impl.RoomServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class RoomServiceTest {

    @Mock
    private RoomRepository roomRepository;

    @InjectMocks
    private RoomServiceImpl roomService;

    private Room room;

    @BeforeEach
    void setUp() {
        room = new Room();
        room.setId("1");
        room.setRoomNumber("101");
        room.setRatePerNight(java.math.BigDecimal.valueOf(150.0));
    }

    @Test
    void createRoom_ShouldReturnSavedRoom() {
        when(roomRepository.save(any(Room.class))).thenReturn(room);

        Room savedRoom = roomService.createRoom(new Room());

        assertThat(savedRoom).isNotNull();
        assertThat(savedRoom.getRoomNumber()).isEqualTo("101");
        verify(roomRepository, times(1)).save(any(Room.class));
    }

    @Test
    void getRoomById_ShouldReturnRoom_WhenExists() {
        when(roomRepository.findById("1")).thenReturn(Optional.of(room));

        Optional<Room> foundRoom = roomService.getRoomById("1");

        assertThat(foundRoom).isPresent();
        assertThat(foundRoom.get().getRoomNumber()).isEqualTo("101");
    }

    @Test
    void updateRoom_ShouldReturnUpdatedRoom() {
        when(roomRepository.findById("1")).thenReturn(Optional.of(room));
        when(roomRepository.save(any(Room.class))).thenReturn(room);

        Room updatedDetails = new Room();
        updatedDetails.setRoomNumber("102");
        
        Room result = roomService.updateRoom("1", updatedDetails);

        assertThat(result.getRoomNumber()).isEqualTo("102");
    }
}
