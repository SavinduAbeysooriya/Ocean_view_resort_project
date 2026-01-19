package com.example.backend.controller;

import com.example.backend.model.Guest;
import com.example.backend.security.UserDetailsServiceImpl;
import com.example.backend.service.GuestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/guests")
public class GuestController {

    @Autowired
    private GuestService guestService;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentGuestProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetailsServiceImpl.UserDetailsImpl)) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        UserDetailsServiceImpl.UserDetailsImpl userDetails = (UserDetailsServiceImpl.UserDetailsImpl) authentication.getPrincipal();
        Optional<Guest> guest = guestService.getGuestByUserId(userDetails.getId());
        
        return guest.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.ok(new Guest()));
    }

    @PostMapping("/me")
    public ResponseEntity<?> updateCurrentGuestProfile(@RequestBody Guest guestRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetailsServiceImpl.UserDetailsImpl)) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        UserDetailsServiceImpl.UserDetailsImpl userDetails = (UserDetailsServiceImpl.UserDetailsImpl) authentication.getPrincipal();
        guestRequest.setUserId(userDetails.getId());
        
        Guest updatedGuest = guestService.saveOrUpdateGuest(guestRequest);
        return ResponseEntity.ok(updatedGuest);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Guest> getGuestById(@PathVariable String id) {
        return guestService.getGuestById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
