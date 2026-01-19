package com.example.backend.controller;

import com.example.backend.dto.DashboardStatsDTO;
import com.example.backend.model.Invoice;
import com.example.backend.model.Reservation;
import com.example.backend.model.User;
import com.example.backend.model.enums.InvoiceStatus;
import com.example.backend.service.InvoiceService;
import com.example.backend.service.ReservationService;
import com.example.backend.service.RoomService;
import com.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    @Autowired
    private InvoiceService invoiceService;

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private UserService userService;

    @Autowired
    private RoomService roomService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();

        // 1. Total Users
        List<User> users = userService.getAllUsers();
        stats.setTotalUsers(users.size());

        // 2. Total Rooms
        stats.setTotalRooms(roomService.getAllRooms().size());

        // 3. Bookings Stats
        List<Reservation> reservations = reservationService.getAllReservations();
        stats.setTotalBookings(reservations.size());

        Map<String, Long> bookingsByStatus = reservations.stream()
                .collect(Collectors.groupingBy(res -> res.getStatus().toString(), Collectors.counting()));
        stats.setBookingsByStatus(bookingsByStatus);

        // 4. Financials (Revenue)
        List<Invoice> invoices = invoiceService.getAllInvoices();
        BigDecimal totalRevenue = invoices.stream()
                .filter(inv -> inv.getStatus() == InvoiceStatus.paid)
                .map(inv -> inv.getSubtotal().add(inv.getTaxAmount())) 
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.setTotalRevenue(totalRevenue);

        // 5. Monthly Revenue (Dynamic for Chart)
        Map<String, BigDecimal> revenueByMonth = new HashMap<>();
        DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("MMM");

        invoices.stream()
                .filter(inv -> inv.getStatus() == InvoiceStatus.paid)
                .forEach(inv -> {
                    // issueDate is already LocalDate in Invoice model
                    try {
                        String month = inv.getIssueDate().format(monthFormatter);
                        
                        BigDecimal current = revenueByMonth.getOrDefault(month, BigDecimal.ZERO);
                        BigDecimal total = inv.getSubtotal().add(inv.getTaxAmount());
                        revenueByMonth.put(month, current.add(total));
                    } catch (Exception e) {
                        // ignore
                    }
                });
        stats.setRevenueByMonth(revenueByMonth);

        return ResponseEntity.ok(stats);
    }
}
