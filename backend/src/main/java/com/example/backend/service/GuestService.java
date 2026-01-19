package com.example.backend.service;

import com.example.backend.model.Guest;
import com.example.backend.repository.GuestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class GuestService {

    @Autowired
    private GuestRepository guestRepository;

    public Optional<Guest> getGuestByUserId(String userId) {
        return guestRepository.findByUserId(userId);
    }

    public Guest saveOrUpdateGuest(Guest guest) {
        Optional<Guest> existingGuest = guestRepository.findByUserId(guest.getUserId());
        if (existingGuest.isPresent()) {
            Guest g = existingGuest.get();
            g.setName(guest.getName());
            g.setAddress(guest.getAddress());
            g.setContactNumber(guest.getContactNumber());
            g.setNicNumber(guest.getNicNumber());
            return guestRepository.save(g);
        } else {
            return guestRepository.save(guest);
        }
    }
    public Optional<Guest> getGuestById(String id) {
        return guestRepository.findById(id);
    }
}
