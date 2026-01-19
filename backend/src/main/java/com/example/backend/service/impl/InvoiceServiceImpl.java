package com.example.backend.service.impl;

import com.example.backend.model.Invoice;
import com.example.backend.repository.InvoiceRepository;
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
}
