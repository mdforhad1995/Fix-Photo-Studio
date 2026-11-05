import { Timestamp } from 'firebase/firestore';

export type ServiceCategory =
  | 'clipping_path'
  | 'ghost_mannequin'
  | 'jewelry_retouch'
  | 'beauty_high_end'
  | 'ecommerce_shadow'
  | 'color_variants';

export type OutputFormat =
  | 'PSD_LAYERED'
  | 'PNG_TRANSPARENT'
  | 'TIFF_16BIT'
  | 'JPG_SRGB';

export type BackgroundSpec =
  | 'PURE_WHITE_FFFFFF'
  | 'TRANSPARENT'
  | 'NATURAL_SHADOW'
  | 'ORIGINAL_KEEP_PATH';

export type OrderStatus =
  | 'queued'
  | 'ingesting'
  | 'clipping'
  | 'retouching'
  | 'qa_review'
  | 'completed';

export type PlanTier = 'starter' | 'studio_pro' | 'enterprise';
export type BillingCycle = 'monthly' | 'annual';
export type MfaMethod = 'none' | 'totp_authenticator' | 'sms_backup';

export interface UserProfileDoc {
  uid: string;
  displayName: string;
  companyName: string;
  role: 'client' | 'admin';
  planTier: PlanTier;
  billingCycle: BillingCycle;
  monthlyQuota: number;
  usedCredits: number;
  mfaEnabled: boolean;
  mfaMethod: MfaMethod;
  mfaSecretHint: string;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export interface UserPrivateInfoDoc {
  uid: string;
  email: string;
  phone: string;
  billingAddress: string;
  mfaRecoveryCodeHash: string;
  updatedAt: Timestamp | Date;
}

export interface OrderDoc {
  id: string;
  orderNumber: string;
  clientId: string;
  clientName: string;
  projectTitle: string;
  serviceCategory: ServiceCategory;
  imageCount: number;
  turnaroundHours: number;
  outputFormat: OutputFormat;
  backgroundSpec: BackgroundSpec;
  instructions: string;
  totalPrice: number;
  status: OrderStatus;
  progressPercent: number;
  uploadedBatchNames: string[];
  deliveryReady: boolean;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export interface OrderMessageDoc {
  id: string;
  orderId: string;
  clientId: string;
  senderId: string;
  senderName: string;
  senderRole: 'client' | 'specialist';
  body: string;
  attachmentName: string;
  createdAt: Timestamp | Date;
}

export interface NotificationAlertDoc {
  id: string;
  userId: string;
  type: 'order_status' | 'payment_receipt' | 'security_mfa' | 'delivery_ready';
  title: string;
  message: string;
  amountFormatted: string;
  invoiceRef: string;
  read: boolean;
  createdAt: Timestamp | Date;
}

export interface PortfolioItem {
  id: string;
  title: string;
  clientBrand: string;
  category: ServiceCategory;
  categoryLabel: string;
  artworkType: 'watch' | 'mannequin' | 'jewelry' | 'footwear' | 'beauty' | 'variant' | 'real_estate';
  turnaround: string;
  pricePerImage: string;
  anchorNodes: number;
  colorProfile: string;
  beforeNotes: string;
  afterNotes: string;
  metricsOutcome: string;
  aspectClass: string;
  colSpanClass: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
}

export type QueryStatus = 'new' | 'contacted' | 'resolved';

export type InvoicePaymentStatus = 'pending' | 'paid';

export interface InvoicePaymentInfo {
  companyName?: string;
  companyTagline?: string;
  companyAddress?: string;
  companyPhone?: string;
  taxRatePercent?: number;
  invoiceNotesAndTerms?: string;
  bankName: string;
  accountHolderName: string;
  accountNumberOrIban: string;
  routingOrSwiftCode: string;
  paypalEmail: string;
  payoneerOrWiseEmail: string;
  mobileWalletOrCardInfo: string;
  paymentInstructions: string;
  billingSupportEmail: string;
}

export interface ClientQueryItem {
  id: string;
  queryNumber: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  companyName?: string;
  serviceTitle: string;
  serviceSlug: string;
  instructions: string;
  sampleFiles: string[];
  source: 'home_trial_form' | 'free_trial_popup' | 'custom_quote_popup';
  isLoggedInClient: boolean;
  routedToPortal: boolean;
  portalOrderNumber?: string;
  status: QueryStatus;
  clientConfirmationEmailSent: boolean;
  clientConfirmationSubject: string;
  clientConfirmationBody: string;
  adminNotificationEmailSent: boolean;
  adminEmailRecipient: string;
  adminNotificationSubject: string;
  adminNotificationBody: string;
  createdAt: string;
}

