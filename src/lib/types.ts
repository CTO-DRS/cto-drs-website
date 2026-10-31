/** Shared types used across screens and API routes. */

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatar?: string | null;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  /** lucide icon name, e.g. "ShieldCheck" */
  icon: string;
  price: number;
  duration: string;
  features: string[];
  category: string;
  featured: boolean;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  tags: string[];
  category: string;
  demoUrl?: string | null;
  githubUrl?: string | null;
  year: number;
  featured: boolean;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  instructor: string;
  level: string;
  durationHours: number;
  lessons: number;
  price: number;
  oldPrice?: number | null;
  rating: number;
  students: number;
  category: string;
  featured: boolean;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover: string;
  author: string;
  tags: string[];
  views: number;
  publishedAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  oldPrice?: number | null;
  image: string;
  category: string;
  rating: number;
  sales: number;
  featured: boolean;
}

export interface CartLine {
  id: string;
  name: string;
  price: number;
  image: string;
  qty: number;
}

export interface OrderItem {
  id?: string;
  name: string;
  price: number;
  qty: number;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  createdAt: string;
}

export interface Booking {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  serviceType: string;
  date: string;
  timeSlot: string;
  notes?: string | null;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  createdAt: string;
}

export interface CommentItem {
  id: string;
  postId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface ContactMessageItem {
  id: string;
  name: string;
  email: string;
  subject?: string | null;
  purpose?: string | null;
  phone?: string | null;
  country?: string | null;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatar?: string | null;
  createdAt: string;
  orders: number;
  bookings: number;
  comments: number;
}

export interface SubscriberItem {
  id: string;
  email: string;
  createdAt: string;
}

export interface AdminCommentItem {
  id: string;
  postId: string;
  postTitle: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface MonthlyPoint {
  label: string;
  orders: number;
  revenue: number;
}

export interface AdminStats {
  users: number;
  bookings: number;
  messages: number;
  orders: number;
  revenue: number;
  subscribers: number;
  courses: number;
  products: number;
  posts: number;
  monthly: MonthlyPoint[];
  recentBookings: Booking[];
  recentOrders: Order[];
  recentMessages: ContactMessageItem[];
}
