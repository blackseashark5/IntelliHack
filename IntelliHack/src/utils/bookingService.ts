interface BookingSlot {
  id: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

interface BookingRequest {
  slotId: string;
  customerName: string;
  customerEmail: string;
  purpose: string;
}

// Simulate available time slots
const generateTimeSlots = (date: Date): BookingSlot[] => {
  const slots: BookingSlot[] = [];
  const startHour = 9; // 9 AM
  const endHour = 17; // 5 PM

  for (let hour = startHour; hour < endHour; hour++) {
    slots.push({
      id: `slot-${date.toISOString()}-${hour}`,
      startTime: `${hour}:00`,
      endTime: `${hour + 1}:00`,
      available: Math.random() > 0.3, // Randomly mark some slots as unavailable
    });
  }

  return slots;
};

export const getAvailableSlots = async (date: Date): Promise<BookingSlot[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return generateTimeSlots(date);
};

export const bookSlot = async (request: BookingRequest): Promise<boolean> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate success rate
  const success = Math.random() > 0.1;
  if (!success) {
    throw new Error('Booking failed. Please try again.');
  }
  
  return true;
};