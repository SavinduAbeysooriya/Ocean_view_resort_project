# Room Booking System Implementation Plan

## Overview
Complete customer-facing room booking system with filters, availability checking, detail pages, and PayHere payment integration.

## Phase 1: Database-Driven Rooms Page ✅
**File:** `frontend/src/pages/Rooms.jsx`
- Fetch rooms from database API
- Display room cards with images
- Category filter with images (sidebar)
- Date-based availability filter (check-in/check-out)
- Attribute filters (AC, capacity, bed type, etc.)  
- Search functionality
- View & Book buttons

## Phase 2: Room Detail Page ✅
**File:** `frontend/src/pages/RoomDetail.jsx`
- Full room information display
- Image gallery
- All amenities and features
- Booking form with:
  - Check-in/Check-out dates
  - Number of guests
  - Special requests
- Real-time availability checking
- Price calculation
- Book Now button

## Phase 3: Booking Process ✅
**Backend:** Reservation controller endpoints
**Frontend:** Booking form submission
- Validate availability against reservations table
- Check for date conflicts
- Calculate total cost
- Create reservation record
- Redirect to profile/my-reservations

## Phase 4: Customer Profile - My Reservations ✅
**File:** `frontend/src/pages/customer/Profile.jsx`
- Display user's reservations
- Show reservation details
- Status indicators (pending/confirmed/completed)
- Pay Now button for unpaid reservations

## Phase 5: PayHere Payment Integration ✅
**File:** `frontend/src/components/PayHereButton.jsx`
- PayHere SDK integration
- Payment form
- Handle payment success/failure
- Update reservation payment status
- Redirect to confirmation page

## API Endpoints Needed
1. GET `/api/rooms` - Fetch all rooms
2. GET `/api/rooms/:id` - Get room details
3. GET `/api/room-categories` - Get categories with images
4. POST `/api/reservations/check-availability` - Check date availability
5. POST `/api/reservations` - Create reservation
6. GET `/api/reservations/user/:userId` - Get user reservations
7. PUT `/api/reservations/:id/payment` - Update payment status

## Database Schema Review
- **rooms** table: id, roomNumber, roomCategoryId, ac, bedType, capacity, ratePerNight, status, amenities, images
- **reservations** table: id, guestId, roomId, checkInDate, checkOutDate, totalCost, status, paymentStatus
- **room_categories** table: id, category, description, categoryImage

## Technologies
- React for UI
- Axios for API calls
- React Router for navigation
- Framer Motion for animations
- PayHere payment gateway
- Date-fns or moment for date handling
