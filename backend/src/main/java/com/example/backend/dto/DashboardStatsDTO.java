package com.example.backend.dto;

import java.math.BigDecimal;
import java.util.Map;

public class DashboardStatsDTO {
    private BigDecimal totalRevenue;
    private long totalBookings;
    private long totalUsers;
    private long totalRooms;
    private Map<String, Long> bookingsByStatus;
    private Map<String, BigDecimal> revenueByMonth;

    // Getters and Setters
    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

    public long getTotalBookings() { return totalBookings; }
    public void setTotalBookings(long totalBookings) { this.totalBookings = totalBookings; }

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getTotalRooms() { return totalRooms; }
    public void setTotalRooms(long totalRooms) { this.totalRooms = totalRooms; }

    public Map<String, Long> getBookingsByStatus() { return bookingsByStatus; }
    public void setBookingsByStatus(Map<String, Long> bookingsByStatus) { this.bookingsByStatus = bookingsByStatus; }

    public Map<String, BigDecimal> getRevenueByMonth() { return revenueByMonth; }
    public void setRevenueByMonth(Map<String, BigDecimal> revenueByMonth) { this.revenueByMonth = revenueByMonth; }
}
