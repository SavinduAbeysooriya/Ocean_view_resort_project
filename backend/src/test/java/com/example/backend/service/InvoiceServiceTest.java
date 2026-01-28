package com.example.backend.service;

import com.example.backend.model.Guest;
import com.example.backend.model.Invoice;
import com.example.backend.model.Reservation;
import com.example.backend.model.User;
import com.example.backend.repository.GuestRepository;
import com.example.backend.repository.InvoiceRepository;
import com.example.backend.repository.ReservationRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.EmailService;
import com.example.backend.service.impl.InvoiceServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class InvoiceServiceTest {
    @Mock
    private InvoiceRepository invoiceRepository;
    @Mock
    private ReservationRepository reservationRepository;
    @Mock
    private GuestRepository guestRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private EmailService emailService;
    @InjectMocks
    private InvoiceServiceImpl invoiceService;
    @Test
    void createInvoice_ShouldReturnSavedInvoice() {
        Invoice invoice = new Invoice();
        invoice.setInvoiceNumber("INV-001");
        
        when(invoiceRepository.save(any(Invoice.class))).thenReturn(invoice);

        Invoice savedInvoice = invoiceService.createInvoice(new Invoice());

        assertThat(savedInvoice.getInvoiceNumber()).isEqualTo("INV-001");
        verify(invoiceRepository, times(1)).save(any(Invoice.class));
    }
    @Test
    void getInvoiceByReservationId_ShouldReturnInvoice_WhenExists() {
        Invoice invoice = new Invoice();
        invoice.setReservationId("res123");
        
        when(invoiceRepository.findByReservationId("res123")).thenReturn(Optional.of(invoice));

        Optional<Invoice> found = invoiceService.getInvoiceByReservationId("res123");

        assertThat(found).isPresent();
        assertThat(found.get().getReservationId()).isEqualTo("res123");
    }
    @Test
    void sendInvoice_ShouldCallEmailService_WhenInvoiceExists() {
        Invoice invoice = new Invoice();
        invoice.setInvoiceNumber("INV-001");
        invoice.setReservationId("res123");
        Reservation reservation = new Reservation();
        reservation.setGuestId("guest123");
        reservation.setReservationNumber("RES-123");
        Guest guest = new Guest();
        guest.setUserId("user123");
        guest.setName("John Doe");
        User user = new User();
        user.setEmail("john@example.com");
        when(invoiceRepository.findById("inv123")).thenReturn(Optional.of(invoice));
        when(reservationRepository.findById("res123")).thenReturn(Optional.of(reservation));
        when(guestRepository.findById("guest123")).thenReturn(Optional.of(guest));
        when(userRepository.findById("user123")).thenReturn(Optional.of(user));
        invoiceService.sendInvoice("inv123");
        verify(emailService, times(1)).sendHtmlEmail(eq("john@example.com"), anyString(), anyString());
    }
}
