package com.example.backend.controller;

import com.example.backend.model.Guest;
import com.example.backend.model.Invoice;
import com.example.backend.model.Room;
import com.example.backend.model.User;
import com.example.backend.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "http://localhost:5173")
public class InvoiceController {

    @Autowired
    private InvoiceService invoiceService;
    @Autowired
    private ReservationService reservationService;
    @Autowired
    private GuestService guestService;
    @Autowired
    private UserService userService;
    @Autowired
    private RoomService roomService;
    @Autowired
    private EmailService emailService;

    @GetMapping
    public List<Invoice> getAllInvoices() {
        return invoiceService.getAllInvoices();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Invoice> getInvoiceById(@PathVariable String id) {
        return invoiceService.getInvoiceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/reservation/{reservationId}")
    public ResponseEntity<Invoice> getInvoiceByReservationId(@PathVariable String reservationId) {
        return invoiceService.getInvoiceByReservationId(reservationId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Invoice createInvoice(@RequestBody Invoice invoice) {
        return invoiceService.createInvoice(invoice);
    }

    @PostMapping("/{id}/send")
    public ResponseEntity<?> sendInvoiceEmail(@PathVariable String id) {
        Optional<Invoice> invoiceOpt = invoiceService.getInvoiceById(id);
        if (invoiceOpt.isEmpty()) return ResponseEntity.notFound().build();
        Invoice invoice = invoiceOpt.get();

        Optional<com.example.backend.model.Reservation> resOpt = reservationService.getReservationById(invoice.getReservationId());
        if (resOpt.isEmpty()) return ResponseEntity.badRequest().body("Reservation not found");
        com.example.backend.model.Reservation res = resOpt.get();

        Optional<Guest> guestOpt = guestService.getGuestById(invoice.getGuestId());
        if (guestOpt.isEmpty()) return ResponseEntity.badRequest().body("Guest not found");
        Guest guest = guestOpt.get();

        Optional<User> userOpt = userService.getUserById(guest.getUserId());
        if (userOpt.isEmpty()) return ResponseEntity.badRequest().body("User account not found");
        User user = userOpt.get();
        
        Optional<Room> roomOpt = roomService.getRoomById(invoice.getRoomId());
        Room room = roomOpt.orElse(new Room());

        String html = buildInvoiceHtml(invoice, res, guest, room);
        
        emailService.sendHtmlEmail(user.getEmail(), "Ocean View Resort - Invoice #" + invoice.getInvoiceNumber(), html);

        return ResponseEntity.ok().build();
    }

    private String buildInvoiceHtml(Invoice inv, com.example.backend.model.Reservation res, Guest guest, Room room) {
        BigDecimal totalCost = res.getTotalCost();
        BigDecimal tax = totalCost.multiply(new BigDecimal("0.10"));
        BigDecimal totalWithTax = totalCost.add(tax);

        return "<html><body style='font-family: serif; padding: 20px; text-align: center; color: #333;'>" +
               "<div style='border: 1px solid #ddd; padding: 40px; max-width: 600px; margin: 0 auto;'>" +
               "<h1 style='letter-spacing: 5px; text-transform: uppercase;'>Ocean View Resort</h1>" +
               "<p style='text-transform: uppercase; font-size: 10px; letter-spacing: 2px; color: #888; margin-bottom: 40px;'>Official Tax Invoice</p>" +
               "<div style='text-align: left; margin-bottom: 30px;'>" +
               "<p><strong>Billed To:</strong> " + guest.getName() + "<br>" +
               guest.getAddress() + "<br>" + guest.getContactNumber() + "</p>" +
               "</div>" + 
               "<table style='width: 100%; border-collapse: collapse; margin-bottom: 30px;'>" +
               "<tr style='border-bottom: 2px solid #000;'><th style='text-align: left; padding: 10px;'>Description</th><th style='text-align: right; padding: 10px;'>Amount</th></tr>" +
               "<tr style='border-bottom: 1px solid #eee;'><td style='padding: 10px;'>Accommodation (" + room.getRoomNumber() + ")<br><span style='font-size: 12px; color: #888;'>" + res.getCheckInDate() + " to " + res.getCheckOutDate() + "</span></td><td style='text-align: right; padding: 10px;'>$" + totalCost + "</td></tr>" +
               "<tr style='border-bottom: 1px solid #eee;'><td style='padding: 10px;'>Service Tax (10%)</td><td style='text-align: right; padding: 10px;'>$" + String.format("%.2f", tax) + "</td></tr>" +
               "<tr><td style='padding: 10px; font-weight: bold;'>TOTAL PAID</td><td style='text-align: right; padding: 10px; font-weight: bold; font-size: 18px;'>$" + String.format("%.2f", totalWithTax) + "</td></tr>" +
               "</table>" +
               "<p style='font-size: 12px; color: #aaa; margin-top: 50px;'>Thank you for staying with us.<br>Ocean View Resort Management</p>" +
               "</div></body></html>";
    }
}
