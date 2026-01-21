package com.example.backend.service;

import com.example.backend.model.Invoice;
import java.util.List;
import java.util.Optional;

public interface InvoiceService {
    List<Invoice> getAllInvoices();
    Optional<Invoice> getInvoiceById(String id);
    Invoice createInvoice(Invoice invoice);
    Optional<Invoice> getInvoiceByReservationId(String reservationId);
    void sendInvoice(String invoiceId);
}
