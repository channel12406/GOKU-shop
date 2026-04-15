import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, push, get, remove, update, onValue, type DatabaseReference } from "firebase/database";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, type User } from "firebase/auth";
import { getStorage, ref as storageRef, getDownloadURL, uploadBytes, deleteObject, type UploadResult } from "firebase/storage";

// Validate required environment variables
// Temporarily commented for testing
/*
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_DATABASE_URL',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_APP_ID'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !import.meta.env[envVar]);
if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}. Please check your .env.local file.`);
}
*/

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDgiUHoXX0KUb__H466Gv6zd5ZflunODf8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "shop-garena-bd558.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://shop-garena-bd558-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "shop-garena-bd558",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "shop-garena-bd558.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1021960273575",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1021960273575:web:2085fbeca66c2caea8e582",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-XT7508TNX9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getDatabase(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// ── Validation Functions ──

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

function validateOrder(order: Omit<Order, "id">): ValidationResult {
  const errors: string[] = [];

  // Required fields validation
  if (!order.productName || order.productName.trim().length < 2) {
    errors.push('Product name must be at least 2 characters');
  }

  if (!order.price || !/^\d+$/.test(order.price)) {
    errors.push('Price must be a valid number string');
  }

  if (!order.quantity || order.quantity <= 0) {
    errors.push('Quantity must be greater than 0');
  }

  if (!order.status || !['pending', 'confirmed', 'completed', 'cancelled'].includes(order.status)) {
    errors.push('Status must be one of: pending, confirmed, completed, cancelled');
  }

  if (!order.createdAt) {
    errors.push('Created date is required');
  }

  // Email validation for customer
  if (order.customerMessage && order.customerMessage.length > 1000) {
    errors.push('Customer message must be less than 1000 characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

function validateContactMessage(msg: Omit<ContactMessage, "id">): ValidationResult {
  const errors: string[] = [];

  if (!msg.name || msg.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }

  if (!msg.email || !/^[^@]+@[^@]+\.[^@]+$/.test(msg.email)) {
    errors.push('Valid email is required');
  }

  if (!msg.service || msg.service.trim().length < 2) {
    errors.push('Service must be at least 2 characters');
  }

  if (!msg.message || msg.message.trim().length < 10) {
    errors.push('Message must be at least 10 characters');
  }

  if (!msg.createdAt) {
    errors.push('Created date is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

function validateTournament(tournament: Omit<Tournament, "id" | "createdAt">): ValidationResult {
  const errors: string[] = [];

  if (!tournament.name || tournament.name.trim().length < 2) {
    errors.push('Tournament name must be at least 2 characters');
  }

  if (!tournament.game || tournament.game.trim().length < 2) {
    errors.push('Game must be specified');
  }

  if (!tournament.description || tournament.description.trim().length < 10) {
    errors.push('Description must be at least 10 characters');
  }

  if (!tournament.startDate) {
    errors.push('Start date is required');
  }

  if (!tournament.endDate) {
    errors.push('End date is required');
  }

  if (!tournament.maxParticipants || tournament.maxParticipants <= 0) {
    errors.push('Max participants must be greater than 0');
  }

  if (!tournament.entryFee || !/^\d+$/.test(tournament.entryFee)) {
    errors.push('Entry fee must be a valid number');
  }

  if (!tournament.prizePool || !/^\d+$/.test(tournament.prizePool)) {
    errors.push('Prize pool must be a valid number');
  }

  if (!tournament.status || !['upcoming', 'ongoing', 'completed', 'cancelled'].includes(tournament.status)) {
    errors.push('Status must be one of: upcoming, ongoing, completed, cancelled');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// ── Database helpers ──

export interface Product {
  id?: string;
  name: string;
  desc: string;
  price: string;
  category: string;
  images?: string[];
  isSourceCode?: boolean;
  createdAt: string;
}

export interface DownloadCode {
  id?: string;
  code: string;
  fileName: string;
  filePath: string;
  isUsed: boolean;
  createdAt: string;
  expiresAt?: string;
}

export interface Order {
  id?: string;
  productName: string;
  price: string;
  quantity: number;
  customerMessage?: string;
  createdAt: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  // New fields for detailed orders
  gameId?: string;
  username?: string;
  country?: string;
  phone?: string;
  originalPrice?: number;
  finalPrice?: number;
  discount?: number;
  paymentMethod?: string;
}

export interface GuildPartnership {
  id?: string;
  userId: string;
  username: string;
  phone: string;
  totalRecharges: number;
  totalSpent: number;
  partnershipCode: string;
  discountPercentage: number;
  isActive: boolean;
  joinedAt: string;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  service: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface PortfolioProject {
  id?: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  createdAt: string;
}

export interface NewsletterSubscriber {
  id?: string;
  email: string;
  subscribedAt: string;
}

export interface Testimonial {
  id?: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string;
  createdAt: string;
  approved: boolean;
}

export interface Tournament {
  id?: string;
  name: string;
  game: string;
  description: string;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  entryFee: string;
  prizePool: string;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  image?: string;
  createdAt: string;
}

export interface TournamentApplication {
  id?: string;
  tournamentId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  country?: string;
  teamName?: string;
  message?: string;
  status: "pending" | "approved" | "rejected";
  appliedAt: string;
}

export interface PromoCode {
  id?: string;
  code: string;
  title: string;
  subtitle: string;
  discount: number; // Percentage
  endDate: string;
  isActive: boolean;
  createdAt: string;
  usageCount?: number;
  maxUsage?: number;
}

export interface AffiliateCode {
  id?: string;
  code: string;
  userId: string;
  username: string;
  discountPercentage: number;
  isActive: boolean;
  createdAt: string;
  expiresAt?: string;
  usageCount?: number;
  description?: string;
}

export interface UserProfile {
  id?: string;
  uid: string;
  email: string;
  username: string;
  displayName?: string;
  avatar?: string;
  phone?: string;
  country?: string;
  bio?: string;
  preferredGames?: string[];
  totalOrders: number;
  totalSpent: number;
  tournamentParticipations: number;
  tournamentWins: number;
  level: number;
  experience: number;
  isVerified: boolean;
  isPremium: boolean;
  joinDate: string;
  lastActive: string;
  achievements?: string[];
  socialLinks?: {
    discord?: string;
    twitter?: string;
    youtube?: string;
    twitch?: string;
  };
  stats?: {
    gamesPlayed: number;
    winRate: number;
    favoriteGame: string;
    totalPlayTime: number;
  };
}

export async function addOrder(order: Omit<Order, "id">) {
  // Server-side validation
  const orderValidation = validateOrder(order);
  if (!orderValidation.isValid) {
    throw new Error(`Invalid order data: ${orderValidation.errors.join(', ')}`);
  }

  const ordersRef = ref(db, "orders");
  return push(ordersRef, order);
}

export async function addContactMessage(msg: Omit<ContactMessage, "id">) {
  // Server-side validation
  const messageValidation = validateContactMessage(msg);
  if (!messageValidation.isValid) {
    throw new Error(`Invalid contact message: ${messageValidation.errors.join(', ')}`);
  }

  const msgsRef = ref(db, "contacts");
  return push(msgsRef, msg);
}

export async function addPortfolioProject(project: Omit<PortfolioProject, "id">) {
  const projectsRef = ref(db, "portfolio");
  return push(projectsRef, project);
}

export async function addNewsletterSubscriber(email: string) {
  const subscribersRef = ref(db, "newsletter");
  return push(subscribersRef, {
    email: email,
    subscribedAt: new Date().toISOString()
  });
}

export async function addTestimonial(testimonial: Omit<Testimonial, "id" | "approved" | "createdAt">) {
  const testimonialsRef = ref(db, "testimonials");
  return push(testimonialsRef, {
    ...testimonial,
    approved: false, // By default, testimonials need approval
    createdAt: new Date().toISOString()
  });
}

export async function addTournament(tournament: Omit<Tournament, "id" | "createdAt">) {
  // Server-side validation
  const tournamentValidation = validateTournament(tournament);
  if (!tournamentValidation.isValid) {
    throw new Error(`Invalid tournament data: ${tournamentValidation.errors.join(', ')}`);
  }

  const tournamentsRef = ref(db, "tournaments");
  return push(tournamentsRef, {
    ...tournament,
    createdAt: new Date().toISOString()
  });
}

export async function addTournamentApplication(application: Omit<TournamentApplication, "id">) {
  const applicationsRef = ref(db, "tournamentApplications");
  return push(applicationsRef, {
    ...application,
    appliedAt: new Date().toISOString()
  });
}

export async function updateTournamentApplicationStatus(id: string, status: "pending" | "approved" | "rejected") {
  const applicationRef = ref(db, `tournamentApplications/${id}`);
  return update(applicationRef, { status });
}

export async function addProduct(product: Omit<Product, "id" | "createdAt">) {
  const productsRef = ref(db, "products");
  return push(productsRef, {
    ...product,
    isSourceCode: product.isSourceCode || false,
    createdAt: new Date().toISOString()
  });
}

export async function addDownloadCode(codeInfo: Omit<DownloadCode, "id" | "isUsed" | "createdAt">) {
  const codesRef = ref(db, "downloadCodes");
  return push(codesRef, {
    ...codeInfo,
    isUsed: false,
    createdAt: new Date().toISOString()
  });
}

export async function getDownloadCodeByCode(code: string): Promise<(DownloadCode & { id: string }) | null> {
  const snapshot = await get(ref(db, "downloadCodes"));
  if (!snapshot.exists()) return null;
  
  const data = snapshot.val();
  for (const [id, val] of Object.entries(data)) {
    const codeEntry = { id, ...(val as DownloadCode) };
    if (codeEntry.code === code && !codeEntry.isUsed) {
      // Check if code has expired
      if (codeEntry.expiresAt && new Date() > new Date(codeEntry.expiresAt)) {
        continue; // Skip expired codes
      }
      return codeEntry as DownloadCode & { id: string };
    }
  }
  return null;
}

export async function markDownloadCodeAsUsed(id: string) {
  const recordRef = ref(db, `downloadCodes/${id}`);
  return update(recordRef, { isUsed: true });
}

export async function uploadFile(file: File, folder: string = 'downloads'): Promise<string> {
  const fileRef = storageRef(storage, `${folder}/${Date.now()}_${file.name}`);
  const snapshot = await uploadBytes(fileRef, file);
  return getDownloadURL(snapshot.ref);
}

export async function getFileDownloadUrl(filePath: string): Promise<string> {
  const fileRef = storageRef(storage, filePath);
  return getDownloadURL(fileRef);
}

export async function updateRecord(path: string, data: Record<string, unknown>) {
  const recordRef = ref(db, path);
  return update(recordRef, data);
}

export async function deleteRecord(path: string) {
  const recordRef = ref(db, path);
  return remove(recordRef);
}

export async function getRecords<T>(path: string): Promise<(T & { id: string })[]> {
  const snapshot = await get(ref(db, path));
  if (!snapshot.exists()) return [];
  const data = snapshot.val();
  return Object.entries(data).map(([id, val]) => ({ id, ...(val as T) }));
}

export function subscribeToRecords<T>(
  path: string,
  callback: (records: (T & { id: string })[]) => void
): () => void {
  const recordRef = ref(db, path);
  const unsubscribe = onValue(recordRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback([]);
      return;
    }
    const data = snapshot.val();
    const records = Object.entries(data).map(([id, val]) => ({ id, ...(val as T) }));
    callback(records);
  });
  return unsubscribe;
}

// ── Auth helpers ──

export async function adminLogin(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function adminLogout() {
  return signOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// ── Promo Code helpers ──

export async function addPromoCode(promo: Omit<PromoCode, "id" | "createdAt" | "usageCount">) {
  const promoRef = ref(db, "promoCodes");
  return push(promoRef, {
    ...promo,
    usageCount: 0,
    createdAt: new Date().toISOString()
  });
}

export async function getValidPromoCode(code: string): Promise<(PromoCode & { id: string }) | null> {
  const snapshot = await get(ref(db, "promoCodes"));
  if (!snapshot.exists()) return null;
  
  const data = snapshot.val();
  for (const [id, val] of Object.entries(data)) {
    const promo = { id, ...(val as PromoCode) };
    if (
      promo.code.toUpperCase() === code.toUpperCase() &&
      promo.isActive &&
      new Date() <= new Date(promo.endDate)
    ) {
      // Check max usage
      if (promo.maxUsage && (promo.usageCount || 0) >= promo.maxUsage) {
        continue; // Skip if max usage reached
      }
      return promo as PromoCode & { id: string };
    }
  }
  return null;
}

export async function incrementPromoCodeUsage(id: string) {
  const promoRef = ref(db, `promoCodes/${id}`);
  const snapshot = await get(promoRef);
  if (!snapshot.exists()) return;
  
  const currentUsage = (snapshot.val() as any).usageCount || 0;
  return update(promoRef, { usageCount: currentUsage + 1 });
}

export async function getAllPromoCodes(): Promise<(PromoCode & { id: string })[]> {
  return getRecords<PromoCode>("promoCodes");
}

// ── Affiliate Code helpers ──

export async function addAffiliateCode(affiliate: Omit<AffiliateCode, "id" | "createdAt" | "usageCount">) {
  const affiliateRef = ref(db, "affiliateCodes");
  return push(affiliateRef, {
    ...affiliate,
    usageCount: 0,
    createdAt: new Date().toISOString()
  });
}

export async function getAffiliateCodeByCode(code: string): Promise<(AffiliateCode & { id: string }) | null> {
  const snapshot = await get(ref(db, "affiliateCodes"));
  if (!snapshot.exists()) return null;
  
  const data = snapshot.val();
  for (const [id, val] of Object.entries(data)) {
    const affiliate = { id, ...(val as AffiliateCode) };
    if (
      affiliate.code.toUpperCase() === code.toUpperCase() &&
      affiliate.isActive
    ) {
      // Check if expired
      if (affiliate.expiresAt && new Date() > new Date(affiliate.expiresAt)) {
        continue; // Skip expired codes
      }
      return affiliate as AffiliateCode & { id: string };
    }
  }
  return null;
}

export async function incrementAffiliateCodeUsage(id: string) {
  const affiliateRef = ref(db, `affiliateCodes/${id}`);
  const snapshot = await get(affiliateRef);
  if (!snapshot.exists()) return;
  
  const currentUsage = snapshot.val().usageCount || 0;
  return update(affiliateRef, { usageCount: currentUsage + 1 });
}

export async function getAllAffiliateCodes(): Promise<(AffiliateCode & { id: string })[]> {
  return getRecords<AffiliateCode>("affiliateCodes");
}

// ---- User Profile Management ----

export async function createOrUpdateUserProfile(profile: Omit<UserProfile, "id">): Promise<void> {
  const profileRef = ref(db, `users/${profile.uid}`);
  return update(profileRef, {
    ...profile,
    lastActive: new Date().toISOString()
  });
}

export async function getUserProfile(uid: string): Promise<(UserProfile & { id: string }) | null> {
  const snapshot = await get(ref(db, `users/${uid}`));
  if (!snapshot.exists()) return null;
  
  const profile = snapshot.val() as UserProfile;
  return { id: uid, ...profile };
}

export function subscribeToUserProfile(uid: string, callback: (profile: (UserProfile & { id: string }) | null) => void): () => void {
  const profileRef = ref(db, `users/${uid}`);
  const unsubscribe = onValue(profileRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback(null);
      return;
    }
    const profile = { id: uid, ...(snapshot.val() as UserProfile) };
    callback(profile);
  });
  return unsubscribe;
}

export async function updateUserStats(uid: string, stats: Partial<UserProfile['stats']>): Promise<void> {
  const profileRef = ref(db, `users/${uid}/stats`);
  return update(profileRef, stats);
}

export async function addUserAchievement(uid: string, achievement: string): Promise<void> {
  const profileRef = ref(db, `users/${uid}`);
  const snapshot = await get(profileRef);
  if (!snapshot.exists()) return;
  
  const profile = snapshot.val() as UserProfile;
  const achievements = profile.achievements || [];
  if (!achievements.includes(achievement)) {
    achievements.push(achievement);
    return update(profileRef, { 
      achievements,
      experience: (profile.experience || 0) + 50,
      lastActive: new Date().toISOString()
    });
  }
}

export async function updateUserLevel(uid: string): Promise<void> {
  const profileRef = ref(db, `users/${uid}`);
  const snapshot = await get(profileRef);
  if (!snapshot.exists()) return;
  
  const profile = snapshot.val() as UserProfile;
  const newLevel = Math.floor((profile.experience || 0) / 100) + 1;
  
  if (newLevel > profile.level) {
    return update(profileRef, { 
      level: newLevel,
      lastActive: new Date().toISOString()
    });
  }
}

// ---- Tournament Auto-Cleanup ----

export async function cleanupExpiredTournaments(): Promise<number> {
  const snapshot = await get(ref(db, "tournaments"));
  if (!snapshot.exists()) return 0;
  
  const tournaments = snapshot.val() as Record<string, Tournament>;
  const now = new Date();
  let deletedCount = 0;
  
  const deletePromises = Object.entries(tournaments).map(async ([id, tournament]) => {
    const endDate = new Date(tournament.endDate);
    if (endDate < now && (tournament.status === 'completed' || tournament.status === 'cancelled')) {
      // Delete tournaments that ended more than 7 days ago
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      if (endDate < sevenDaysAgo) {
        await deleteRecord(`tournaments/${id}`);
        deletedCount++;
      }
    }
  });
  
  await Promise.all(deletePromises);
  return deletedCount;
}

export async function updateExpiredTournaments(): Promise<number> {
  const snapshot = await get(ref(db, "tournaments"));
  if (!snapshot.exists()) return 0;
  
  const tournaments = snapshot.val() as Record<string, Tournament>;
  const now = new Date();
  let updatedCount = 0;
  
  const updatePromises = Object.entries(tournaments).map(async ([id, tournament]) => {
    const endDate = new Date(tournament.endDate);
    const startDate = new Date(tournament.startDate);
    
    // Auto-update tournament status based on dates
    let newStatus = tournament.status;
    
    if (now < startDate && tournament.status === 'upcoming') {
      // Tournament hasn't started yet - keep as upcoming
      newStatus = 'upcoming';
    } else if (now >= startDate && now <= endDate && tournament.status === 'upcoming') {
      // Tournament is currently ongoing
      newStatus = 'ongoing';
      updatedCount++;
    } else if (now > endDate && tournament.status === 'ongoing') {
      // Tournament has ended
      newStatus = 'completed';
      updatedCount++;
    }
    
    if (newStatus !== tournament.status) {
      await updateRecord(`tournaments/${id}`, { 
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
    }
  });
  
  await Promise.all(updatePromises);
  return updatedCount;
}

// Setup automatic cleanup (run every hour)
export function setupTournamentCleanup(): () => void {
  const cleanupInterval = setInterval(async () => {
    try {
      const updated = await updateExpiredTournaments();
      const deleted = await cleanupExpiredTournaments();
      
      if (updated > 0 || deleted > 0) {
        console.log(`Tournament cleanup: ${updated} updated, ${deleted} deleted`);
      }
    } catch (error) {
      console.error('Tournament cleanup error:', error);
    }
  }, 60 * 60 * 1000); // Run every hour
  
  return () => clearInterval(cleanupInterval);
}
