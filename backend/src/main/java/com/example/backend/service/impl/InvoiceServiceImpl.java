package com.example.backend.service.impl;

import com.example.backend.model.Guest;
import com.example.backend.model.Invoice;
import com.example.backend.model.Reservation;
import com.example.backend.model.User;
import com.example.backend.repository.GuestRepository;
import com.example.backend.repository.InvoiceRepository;
import com.example.backend.repository.ReservationRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.EmailService;
import com.example.backend.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class InvoiceServiceImpl implements InvoiceService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private GuestRepository guestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Override
    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    @Override
    public Optional<Invoice> getInvoiceById(String id) {
        return invoiceRepository.findById(id);
    }

    @Override
    public Invoice createInvoice(Invoice invoice) {
        invoice.setCreatedAt(LocalDateTime.now());
        invoice.setUpdatedAt(LocalDateTime.now());
        return invoiceRepository.save(invoice);
    }

    @Override
    public Optional<Invoice> getInvoiceByReservationId(String reservationId) {
        return invoiceRepository.findByReservationId(reservationId);
    }

    @Override
    public void sendInvoice(String invoiceId) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        Reservation reservation = reservationRepository.findById(invoice.getReservationId())
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        Guest guest = guestRepository.findById(reservation.getGuestId())
                .orElseThrow(() -> new RuntimeException("Guest not found"));

        User user = userRepository.findById(guest.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String guestEmail = user.getEmail();
        if (guestEmail == null || guestEmail.isEmpty()) {
            throw new RuntimeException("Guest email is missing");
        }

        String subject = "Official Invoice - Ocean View Resort (" + invoice.getInvoiceNumber() + ")";
        String htmlContent = String.format(
            "<div style='font-family: serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 40px; color: #333;'>" +
            "<div style='text-align: center; border-bottom: 2px solid #D4AF37; padding-bottom: 20px; margin-bottom: 30px;'>" +
            "<h1 style='color: #1a1a1a; letter-spacing: 5px; text-transform: uppercase;'>Ocean View Resort</h1>" +
            "<p style='color: #D4AF37; letter-spacing: 2px; font-size: 12px;'>Official Tax Invoice</p>" +
            "</div>" +
            "<p>Dear %s,</p>" +
            "<p>Please find the details of your official invoice for your stay at Ocean View Resort.</p>" +
            "<div style='background: #fdfaf0; padding: 20px; border-radius: 4px; margin: 20px 0;'>" +
            "<table style='width: 100%%; font-size: 14px;'>" +
            "<tr><td style='color: #888;'>Invoice No:</td><td style='text-align: right; font-weight: bold;'>%s</td></tr>" +
            "<tr><td style='color: #888;'>Reservation No:</td><td style='text-align: right;'>%s</td></tr>" +
            "<tr><td style='color: #888;'>Issue Date:</td><td style='text-align: right;'>%s</td></tr>" +
            "<tr><td colspan='2' style='border-top: 1px solid #eee; padding-top: 10px; margin-top: 10px;'></td></tr>" +
            "<tr><td style='font-size: 18px; font-weight: bold; padding-top: 10px;'>Total Paid:</td>" +
            "<td style='text-align: right; font-size: 18px; font-weight: bold; color: #D4AF37; padding-top: 10px;'>LKR %s</td></tr>" +
            "</table>" +
            "</div>" +
            "<p>We hope you enjoyed your stay with us. If you have any questions regarding this invoice, please contact our financial department.</p>" +
            "<div style='margin-top: 40px; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #eee; padding-top: 20px;'>" +
            "<p>Ocean View Resort | Pannegamuwa, Weerawila</p>" +
            "<p>+94 112 345 678 | info@oceanviewresort.com</p>" +
            "</div>" +
            "</div>",
            guest.getName(),
            invoice.getInvoiceNumber(),
            reservation.getReservationNumber(),
            invoice.getIssueDate() != null ? invoice.getIssueDate().toLocalDate().toString() : "N/A",
            invoice.getAmount() != null ? invoice.getAmount().toString() : invoice.getSubtotal().toString()
        );

        emailService.sendHtmlEmail(guestEmail, subject, htmlContent);
    }
}
