import { z } from "zod";

// Newsletter subscription schema
export const newsletterSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;

// Contact form validation schema
export const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

// Event registration schema
export const eventRegistrationSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().regex(/^[6-9]\d{9}$/, { message: "Please enter a valid 10-digit Indian phone number." }),
  participants: z.number().min(1).max(10, { message: "You can book between 1 and 10 tickets." }),
  emergencyContact: z.string().min(2, { message: "Emergency contact name is required." }),
});

export type EventRegistrationInput = z.infer<typeof eventRegistrationSchema>;

// Campsite booking schema
export const campsiteBookingSchema = z.object({
  checkIn: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid check-in date" }),
  checkOut: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid check-out date" }),
  guests: z.number().min(1).max(8, { message: "Guests count must be between 1 and 8." }),
  campsiteId: z.string(),
});

export type CampsiteBookingInput = z.infer<typeof campsiteBookingSchema>;

// Login validation schema
export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Registration & profile fields validation schema
export const registerSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  avatarUrl: z.string().url({ message: "Please enter a valid URL." }).or(z.literal("")),
  city: z.string().min(2, { message: "City must be at least 2 characters." }),
  state: z.string().min(2, { message: "State must be at least 2 characters." }),
  phone: z.string().regex(/^[6-9]\d{9}$/, { message: "Please enter a valid 10-digit Indian phone number." }),
  instagram: z.string().regex(/^@?[\w\.\-]+$/, { message: "Invalid Instagram handle format." }).or(z.literal("")),
  campingExperience: z.enum(["Beginner", "Intermediate", "Expert"]),
  vehicle: z.enum(["None", "Two-Wheeler", "Four-Wheeler", "RV/Camper"]),
  bio: z.string().min(5, { message: "Bio must be at least 5 characters." }).max(500, { message: "Bio must be under 500 characters." }),
});

export type RegisterInput = z.infer<typeof registerSchema>;

// Profile update schema (excludes credentials, includes rich customization fields)
export const profileUpdateSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  avatarUrl: z.string().url({ message: "Please enter a valid URL." }).or(z.literal("")),
  coverPhotoUrl: z.string().url({ message: "Please enter a valid URL." }).or(z.literal("")),
  city: z.string().min(2, { message: "City must be at least 2 characters." }),
  state: z.string().min(2, { message: "State must be at least 2 characters." }),
  phone: z.string().regex(/^[6-9]\d{9}$/, { message: "Please enter a valid 10-digit Indian phone number." }),
  instagram: z.string().or(z.literal("")),
  twitter: z.string().or(z.literal("")),
  github: z.string().or(z.literal("")),
  website: z.string().or(z.literal("")),
  campingExperience: z.enum(["Beginner", "Intermediate", "Expert"]),
  vehicle: z.enum(["None", "Two-Wheeler", "Four-Wheeler", "RV/Camper"]),
  bio: z.string().min(5, { message: "Bio must be at least 5 characters." }).max(500, { message: "Bio must be under 500 characters." }),
  gallery: z.array(z.string()),
  achievements: z.array(z.string()),
  tripsJoined: z.number(),
  eventsOrganized: z.number(),
});
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

// Event creation & modification schema
export const eventCreateSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  location: z.string().min(3, { message: "Location is required." }),
  googleMapUrl: z.string().url({ message: "Please enter a valid Google Maps URL." }).or(z.literal("")),
  price: z.number().min(0, { message: "Price must be non-negative." }),
  capacity: z.number().min(1, { message: "Capacity must be at least 1." }),
  difficulty: z.enum(["Easy", "Moderate", "Challenging"]),
  campingType: z.string().min(2, { message: "Camping type is required." }),
  date: z.string().min(1, { message: "Date is required." }),
  bannerUrl: z.string().url({ message: "Please upload a valid banner." }).or(z.literal("")),
  photos: z.array(z.string()),
  checklist: z.array(z.string()),
  status: z.enum(["Draft", "Published", "Cancelled"]),
});
export type EventCreateInput = z.infer<typeof eventCreateSchema>;

