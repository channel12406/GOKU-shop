import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, push, get, remove, update, onValue, type DatabaseReference } from "firebase/database";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, type User } from "firebase/auth";
import { getStorage, ref as storageRef, getDownloadURL, uploadBytes, deleteObject, type UploadResult } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDgiUHoXX0KUb__H466Gv6zd5ZflunODf8",
  authDomain: "shop-garena-bd558.firebaseapp.com",
  databaseURL: "https://shop-garena-bd558-default-rtdb.firebaseio.com",
  projectId: "shop-garena-bd558",
  storageBucket: "shop-garena-bd558.firebasestorage.app",
  messagingSenderId: "1021960273575",
  appId: "1:1021960273575:web:2085fbeca66c2caea8e582",
  measurementId: "G-XT7508TNX9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getDatabase(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

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

export async function addOrder(order: Omit<Order, "id">) {
  const ordersRef = ref(db, "orders");
  return push(ordersRef, order);
}

export async function addContactMessage(msg: Omit<ContactMessage, "id">) {
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
