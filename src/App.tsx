import React, { useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import {
  ArrowRight,
  CheckCircle2,
  Maximize2,
  ShieldCheck,
  Clock,
  Camera,
  Film,
  UploadCloud,
  Sparkles,
  ChevronDown,
  UserCircle,
  Lock,
  Plus,
  Trash2,
  FileCheck2,
  Loader2,
} from 'lucide-react';
import {
  auth,
  db,
  googleProvider,
  OperationType,
  handleFirestoreError,
  sanitizeString,
  sanitizeId,
  SCHEMA_LIMITS,
} from './firebase';
import {
  ServiceCategory,
  OutputFormat,
  BackgroundSpec,
  OrderDoc,
  OrderStatus,
  OrderMessageDoc,
  NotificationAlertDoc,
  UserProfileDoc,
  UserPrivateInfoDoc,
  PortfolioItem,
  PlanTier,
  BillingCycle,
  MfaMethod,
  ClientQueryItem,
  InvoicePaymentInfo,
  InvoicePaymentStatus,
  InvoicePaymentTerms,
  InvoicePaymentOption,
  UploadedClientFileItem,
} from './types';
import {
  INITIAL_CLIENT_QUERIES,
  createAndDispatchClientQuery,
} from './services/queryEmailService';
import {
  STUDIO_SERVICES,
  MAIN_MENU_PHOTO_SERVICES,
  MainMenuPhotoServiceItem,
  ServiceDefinition,
  StudioDivision,
  PORTFOLIO_ITEMS,
  SUBSCRIPTION_PLANS,
  SubscriptionPlanSpec,
  PIPELINE_STAGES,
  INITIAL_CUSTOMER_REVIEWS,
  CustomerReviewItem,
  VIDEO_SHOWREEL_PROJECTS,
  VideoShowreelProject,
  INITIAL_BLOG_POSTS,
  StudioBlogPost,
} from './data/studioCatalog';
import { FixPhotoBrandLogo } from './components/FixPhotoBrandLogo';
import { BeforeAfterStudioCanvas } from './components/StudioArtworks';
import { PortfolioLightbox } from './components/PortfolioLightbox';
import { NewOrderModal } from './components/NewOrderModal';
import { MfaSecurityModal } from './components/MfaSecurityModal';
import { ClientPortalView } from './components/ClientPortalView';
import { ServiceDetailPage } from './components/ServiceDetailPage';
import { AllServicesPage } from './components/AllServicesPage';
import { CustomerReviewsSection } from './components/CustomerReviewsSection';
import { RichContentRenderer } from './components/RichTextEditor';
import {
  StudioBlogSection,
  StudioBlogsPage,
} from './components/StudioBlogSection';
import { VideoEditingStudioPage } from './components/VideoEditingStudioPage';
import { FreeTrialPage } from './components/FreeTrialPage';
import { GetQuotePage } from './components/GetQuotePage';
import {
  AdminCmsPanel,
  DEFAULT_SITE_CONFIG,
  SiteGlobalConfig,
} from './components/AdminCmsPanel';

type ActivePageRoute =
  | 'home'
  | 'services_page'
  | 'service_detail'
  | 'video_editing_page'
  | 'portfolio_page'
  | 'free_trial_page'
  | 'get_quote_page'
  | 'reviews_page'
  | 'blogs_page'
  | 'blog_detail_page'
  | 'pricing_page'
  | 'portal'
  | 'admin_login';

function getClientIdFromEmail(email?: string | null): string {
  const clean = (email || '').trim().toLowerCase();
  if (!clean) return '';
  return `client_${clean.replace(/[^a-z0-9]/g, '_')}`;
}

const INITIAL_SANDBOX_PROFILE: UserProfileDoc = {
  uid: '',
  displayName: 'Studio Client',
  companyName: '',
  role: 'client',
  planTier: 'studio_pro',
  billingCycle: 'monthly',
  monthlyQuota: 1250,
  usedCredits: 0,
  mfaEnabled: true,
  mfaMethod: 'totp_authenticator',
  mfaSecretHint: 'TOTP-FPS9',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const INITIAL_SANDBOX_PRIVATE: UserPrivateInfoDoc = {
  uid: '',
  email: '',
  phone: '',
  billingAddress: '',
  mfaRecoveryCodeHash: 'SHA256_FPS-REC-9941-8820-SAFE',
  updatedAt: new Date(),
};

const INITIAL_SANDBOX_ORDERS: OrderDoc[] = [];

const INITIAL_SANDBOX_MESSAGES: Record<string, OrderMessageDoc[]> = {};

const INITIAL_SANDBOX_NOTIFICATIONS: NotificationAlertDoc[] = [];

const DEFAULT_INVOICE_PAYMENT_INFO: InvoicePaymentInfo = {
  companyName: 'Fix Photo Studio.',
  contactPerson: 'Eng. Md Forhad Hossen.',
  companyTagline: 'Get pixel-perfect photo & video editing services',
  companyAddress: 'House 5, Road 5, Block A, Mirpur 1, Dhaka, 1216.',
  companyCountry: 'Bangladesh.',
  companyPhone: '+8801911862115',
  taxRatePercent: 0,
  defaultPaymentTerms: 'Project',
  defaultPaymentOption: 'PayPal',
  invoiceNotesAndTerms: '',
  bankName: 'Dutch Bangla Bank PLC',
  accountHolderName: 'Md Forhad Hossen',
  accountNumberOrIban: '211.1510.213110',
  bankBranch: 'Mirpur 11, Pallabi Branch, Dhaka, Bangladesh.',
  branchCode: '211',
  swiftCode: 'DBBLBDDH',
  routingNumber: '090263581',
  routingOrSwiftCode: 'SWIFT: DBBLBDDH · Routing No: 090263581',
  paypalEmail: 'hello@clippasia.com',
  payoneerOrWiseEmail: 'hello@clippasia.com',
  mobileWalletOrCardInfo: 'PayPal / Bank Transfer',
  paymentInstructions:
    'Please include your Invoice Reference ID (INV-FPS-2026-XXXX) in the payment memo. Once payment is sent, our billing desk will verify and update your invoice status from PENDING to PAID in the Client Portal.',
  billingSupportEmail: 'asiaclipp@gmail.com',
};

function formatFxDateCode(dateInput?: unknown): string {
  let d = new Date();
  if (dateInput instanceof Date && !isNaN(dateInput.getTime())) {
    d = dateInput;
  } else if (typeof dateInput === 'string' || typeof dateInput === 'number') {
    const parsed = new Date(dateInput);
    if (!isNaN(parsed.getTime())) d = parsed;
  }
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = String(d.getFullYear());
  return `FX-${day}${month}${year}`;
}

function loadStoredJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [activeBlogSlug, setActiveBlogSlug] = useState<string>(() => {
    const hash = window.location.hash.toLowerCase();
    if (hash.startsWith('#blogs/') && hash.length > 7) {
      return hash.slice(7);
    }
    return INITIAL_BLOG_POSTS[0].slug;
  });

  const [activePage, setActivePage] = useState<ActivePageRoute>('home');
  const [photoMenuOpen, setPhotoMenuOpen] = useState<boolean>(false);
  const [videoMenuOpen, setVideoMenuOpen] = useState<boolean>(false);

  // Admin CMS Persisted States
  const [siteConfig, setSiteConfig] = useState<SiteGlobalConfig>(() =>
    loadStoredJson('fps_site_config_v2', DEFAULT_SITE_CONFIG)
  );
  const [mainMenuServices, setMainMenuServices] = useState<
    MainMenuPhotoServiceItem[]
  >(() =>
    loadStoredJson('fps_main_menu_v2', MAIN_MENU_PHOTO_SERVICES)
  );
  const [servicesList, setServicesList] = useState<ServiceDefinition[]>(() =>
    loadStoredJson('fps_services_list_v2', STUDIO_SERVICES)
  );
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(() =>
    loadStoredJson('fps_portfolio_items_v1', PORTFOLIO_ITEMS)
  );
  const [videoShowreelProjects, setVideoShowreelProjects] = useState<
    VideoShowreelProject[]
  >(() =>
    loadStoredJson('fps_video_showreel_v1', VIDEO_SHOWREEL_PROJECTS)
  );
  const [customerReviews, setCustomerReviews] = useState<CustomerReviewItem[]>(
    () => loadStoredJson('fps_customer_reviews_v2', INITIAL_CUSTOMER_REVIEWS)
  );
  const [blogPosts, setBlogPosts] = useState<StudioBlogPost[]>(() =>
    loadStoredJson('fps_blog_posts_v1', INITIAL_BLOG_POSTS)
  );
  const [subscriptionPlans, setSubscriptionPlans] = useState<
    SubscriptionPlanSpec[]
  >(() => loadStoredJson('fps_subscription_plans_v2', SUBSCRIPTION_PLANS));
  const [clientQueries, setClientQueries] = useState<ClientQueryItem[]>(() =>
    loadStoredJson('fps_client_queries_v1', INITIAL_CLIENT_QUERIES)
  );
  const [invoicePaymentInfo, setInvoicePaymentInfo] =
    useState<InvoicePaymentInfo>(() => {
      const loaded = loadStoredJson(
        'fps_invoice_payment_info_v2',
        DEFAULT_INVOICE_PAYMENT_INFO
      );
      const cleanedNotes = (loaded.invoiceNotesAndTerms || '')
        .replace(
          /All deliverables include dual-stage 400% QA verification and lifetime archive warranty\.?/gi,
          ''
        )
        .replace(/Official Commercial Invoice issued by Fix Photo Studio\.?/gi, '')
        .trim();
      return {
        ...loaded,
        invoiceNotesAndTerms: cleanedNotes,
      };
    });
  const [invoiceStatusMap, setInvoiceStatusMap] = useState<
    Record<string, InvoicePaymentStatus>
  >(() =>
    loadStoredJson('fps_invoice_status_map_v1', {
      'INV-FPS-2026-8839': 'paid',
    })
  );
  const [orderApprovalMap, setOrderApprovalMap] = useState<
    Record<string, 'pending' | 'approved'>
  >(() =>
    loadStoredJson('fps_order_approval_map_v1', {
      'FPS-2026-8841': 'approved',
      'FPS-2026-8839': 'approved',
    })
  );

  const [activeServiceSlug, setActiveServiceSlug] = useState<string>(
    STUDIO_SERVICES[0].slug
  );
  const [homeDivisionTab, setHomeDivisionTab] =
    useState<StudioDivision>('photo_editing');
  const [heroShowcaseSlug, setHeroShowcaseSlug] = useState<string>(
    'clipping-path-service'
  );

  const [portfolioDivisionTab, setPortfolioDivisionTab] =
    useState<StudioDivision>('photo_editing');
  const [portfolioFilter, setPortfolioFilter] = useState<
    ServiceCategory | 'all'
  >('all');
  const [videoPortfolioFilter, setVideoPortfolioFilter] = useState<
    VideoShowreelProject['category'] | 'all'
  >('all');
  const [lightboxItem, setLightboxItem] = useState<PortfolioItem | null>(null);
  const [newOrderModalOpen, setNewOrderModalOpen] = useState(false);
  const [freeTrialModalOpen, setFreeTrialModalOpen] = useState(false);
  const [getQuoteModalOpen, setGetQuoteModalOpen] = useState(false);
  const [preselectedService, setPreselectedService] =
    useState<ServiceCategory>('clipping_path');
  const [mfaModalOpen, setMfaModalOpen] = useState(false);
  const [mfaSessionVerified, setMfaSessionVerified] = useState(true);

  // Persist Admin CMS changes to localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(
        'fps_site_config_v2',
        JSON.stringify(siteConfig)
      );
    } catch {
      // Ignore quota errors
    }
  }, [siteConfig]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        'fps_main_menu_v2',
        JSON.stringify(mainMenuServices)
      );
    } catch {
      // Ignore quota errors
    }
  }, [mainMenuServices]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        'fps_services_list_v2',
        JSON.stringify(servicesList)
      );
    } catch {
      // Ignore quota errors
    }
  }, [servicesList]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        'fps_portfolio_items_v1',
        JSON.stringify(portfolioItems)
      );
    } catch {
      // Ignore quota errors
    }
  }, [portfolioItems]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        'fps_video_showreel_v1',
        JSON.stringify(videoShowreelProjects)
      );
    } catch {
      // Ignore quota errors
    }
  }, [videoShowreelProjects]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        'fps_customer_reviews_v2',
        JSON.stringify(customerReviews)
      );
    } catch {
      // Ignore quota errors
    }
  }, [customerReviews]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        'fps_blog_posts_v1',
        JSON.stringify(blogPosts)
      );
    } catch {
      // Ignore quota errors
    }
  }, [blogPosts]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        'fps_subscription_plans_v2',
        JSON.stringify(subscriptionPlans)
      );
    } catch {
      // Ignore quota errors
    }
  }, [subscriptionPlans]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        'fps_client_queries_v1',
        JSON.stringify(clientQueries)
      );
    } catch {
      // Ignore quota errors
    }
  }, [clientQueries]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        'fps_invoice_payment_info_v2',
        JSON.stringify(invoicePaymentInfo)
      );
    } catch {
      // Ignore quota errors
    }
  }, [invoicePaymentInfo]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        'fps_invoice_status_map_v1',
        JSON.stringify(invoiceStatusMap)
      );
    } catch {
      // Ignore quota errors
    }
  }, [invoiceStatusMap]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        'fps_order_approval_map_v1',
        JSON.stringify(orderApprovalMap)
      );
    } catch {
      // Ignore quota errors
    }
  }, [orderApprovalMap]);

  // Resolve URL Pathname / Slug into Multi-Page Route on Initial Load & Browser Back/Forward
  const getMainPageSlug = (
    key:
      | 'home'
      | 'services_page'
      | 'video_editing_page'
      | 'portfolio_page'
      | 'free_trial_page'
      | 'get_quote_page'
      | 'blogs_page'
      | 'portal'
      | 'reviews_page'
  ): string => {
    const defaults: Record<string, string> = {
      home: '',
      services_page: 'photo-editing-services',
      video_editing_page: 'video-editing-services',
      portfolio_page: 'portfolio',
      free_trial_page: 'free-trial',
      get_quote_page: 'get-quote',
      blogs_page: 'blogs',
      portal: 'client-portal',
      reviews_page: 'reviews',
    };
    const custom = siteConfig.pageSeo?.[key]?.slug;
    if (custom !== undefined && key !== 'home') {
      return custom.replace(/^\/+|\/+$/g, '').toLowerCase();
    }
    return defaults[key] || '';
  };

  useEffect(() => {
    const syncRouteFromLocation = () => {
      const rawPath = window.location.pathname
        .replace(/^\/+|\/+$/g, '')
        .toLowerCase();
      const rawHash = window.location.hash
        .replace(/^#+|\/+$/g, '')
        .toLowerCase();
      const search = window.location.search.toLowerCase();

      if (
        rawPath === 'admin' ||
        rawPath === 'admin-login' ||
        rawPath === 'admin-dashboard' ||
        rawHash.includes('admin') ||
        search.includes('admin')
      ) {
        setActivePage('admin_login');
        return;
      }

      const candidateSlug = rawPath || rawHash;
      if (!candidateSlug || candidateSlug === 'top') {
        setActivePage('home');
        return;
      }

      // Check Main Pages by custom or default slug
      if (
        candidateSlug === getMainPageSlug('free_trial_page') ||
        candidateSlug === 'free-trial'
      ) {
        setActivePage('free_trial_page');
        return;
      }
      if (
        candidateSlug === getMainPageSlug('get_quote_page') ||
        candidateSlug === 'get-quote'
      ) {
        setActivePage('get_quote_page');
        return;
      }
      if (
        candidateSlug === getMainPageSlug('portfolio_page') ||
        candidateSlug === 'portfolio'
      ) {
        setActivePage('portfolio_page');
        return;
      }
      if (
        candidateSlug === getMainPageSlug('services_page') ||
        candidateSlug === 'services' ||
        candidateSlug === 'photo-editing-services'
      ) {
        setActivePage('services_page');
        return;
      }
      if (
        candidateSlug === getMainPageSlug('video_editing_page') ||
        candidateSlug === 'video-editing' ||
        candidateSlug === 'video-editing-services'
      ) {
        setActivePage('video_editing_page');
        return;
      }
      if (
        candidateSlug === getMainPageSlug('portal') ||
        candidateSlug === 'client-portal' ||
        candidateSlug === 'portal'
      ) {
        setActivePage('portal');
        return;
      }
      if (
        candidateSlug === getMainPageSlug('blogs_page') ||
        candidateSlug === 'blogs' ||
        candidateSlug === 'blog'
      ) {
        setActivePage('blogs_page');
        return;
      }
      if (
        candidateSlug === getMainPageSlug('reviews_page') ||
        candidateSlug === 'reviews'
      ) {
        setActivePage('reviews_page');
        return;
      }

      // Check Service Pages (including /service/<slug> or direct /<slug>/)
      const cleanServiceCandidate = candidateSlug.startsWith('service/')
        ? candidateSlug.slice(8)
        : candidateSlug;
      const matchedService = servicesList.find(
        (s) => s.slug.toLowerCase() === cleanServiceCandidate
      );
      if (matchedService) {
        setActiveServiceSlug(matchedService.slug);
        setActivePage('service_detail');
        return;
      }

      // Check Blog Posts (including /blogs/<slug> or direct /<slug>/)
      const cleanBlogCandidate = candidateSlug.startsWith('blogs/')
        ? candidateSlug.slice(6)
        : candidateSlug;
      const matchedBlog = blogPosts.find(
        (b) => b.slug.toLowerCase() === cleanBlogCandidate
      );
      if (matchedBlog) {
        setActiveBlogSlug(matchedBlog.slug);
        setActivePage('blog_detail_page');
        return;
      }
    };

    syncRouteFromLocation();
    window.addEventListener('popstate', syncRouteFromLocation);
    window.addEventListener('hashchange', syncRouteFromLocation);
    return () => {
      window.removeEventListener('popstate', syncRouteFromLocation);
      window.removeEventListener('hashchange', syncRouteFromLocation);
    };
  }, [servicesList, blogPosts, siteConfig.pageSeo]);

  // Push Clean Multi-Page URL Pathname (domain/<slug>/) whenever activePage / slug changes
  useEffect(() => {
    let targetPath = '/';
    switch (activePage) {
      case 'home':
        targetPath = '/';
        break;
      case 'services_page':
        targetPath = `/${getMainPageSlug('services_page')}/`;
        break;
      case 'video_editing_page':
        targetPath = `/${getMainPageSlug('video_editing_page')}/`;
        break;
      case 'portfolio_page':
        targetPath = `/${getMainPageSlug('portfolio_page')}/`;
        break;
      case 'free_trial_page':
        targetPath = `/${getMainPageSlug('free_trial_page')}/`;
        break;
      case 'get_quote_page':
        targetPath = `/${getMainPageSlug('get_quote_page')}/`;
        break;
      case 'blogs_page':
        targetPath = `/${getMainPageSlug('blogs_page')}/`;
        break;
      case 'portal':
        targetPath = `/${getMainPageSlug('portal')}/`;
        break;
      case 'reviews_page':
        targetPath = `/${getMainPageSlug('reviews_page')}/`;
        break;
      case 'service_detail':
        targetPath = `/${activeServiceSlug}/`;
        break;
      case 'blog_detail_page':
        targetPath = `/${activeBlogSlug}/`;
        break;
      case 'admin_login':
        targetPath = '/admin-login/';
        break;
      default:
        targetPath = '/';
    }

    try {
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ page: activePage }, '', targetPath);
      }
    } catch {
      // ignore iframe history restrictions if any
    }
  }, [activePage, activeServiceSlug, activeBlogSlug, siteConfig.pageSeo]);

  const handleResetAllCmsToDefaults = () => {
    setSiteConfig(DEFAULT_SITE_CONFIG);
    setMainMenuServices(MAIN_MENU_PHOTO_SERVICES);
    setServicesList(STUDIO_SERVICES);
    setPortfolioItems(PORTFOLIO_ITEMS);
    setVideoShowreelProjects(VIDEO_SHOWREEL_PROJECTS);
    setCustomerReviews(INITIAL_CUSTOMER_REVIEWS);
    setBlogPosts(INITIAL_BLOG_POSTS);
    setSubscriptionPlans(SUBSCRIPTION_PLANS);
    setInvoicePaymentInfo(DEFAULT_INVOICE_PAYMENT_INFO);
    try {
      window.localStorage.removeItem('fps_site_config_v2');
      window.localStorage.removeItem('fps_main_menu_v2');
      window.localStorage.removeItem('fps_services_list_v2');
      window.localStorage.removeItem('fps_portfolio_items_v1');
      window.localStorage.removeItem('fps_video_showreel_v1');
      window.localStorage.removeItem('fps_customer_reviews_v2');
      window.localStorage.removeItem('fps_blog_posts_v1');
      window.localStorage.removeItem('fps_subscription_plans_v2');
      window.localStorage.removeItem('fps_invoice_payment_info_v2');
    } catch {
      // Ignore storage errors
    }
  };

  // ColorClipping-Inspired Free Trial Form State (Starts Normal Blank)
  const [trialDivision, setTrialDivision] = useState<
    'photo_editing' | 'video_editing'
  >('photo_editing');
  const [trialName, setTrialName] = useState('');
  const [trialEmail, setTrialEmail] = useState('');
  const [trialPhone, setTrialPhone] = useState('');
  const [trialServiceSlug, setTrialServiceSlug] = useState(
    'clipping-path-service'
  );
  const [trialInstructions, setTrialInstructions] = useState('');
  const [trialUploadedFiles, setTrialUploadedFiles] = useState<
    Array<{
      id: string;
      name: string;
      sizeLabel: string;
      dataUrl?: string;
      progress: number;
      done: boolean;
    }>
  >([]);
  const [trialStatus, setTrialStatus] = useState<string | null>(null);
  const [trialSuccessNotice, setTrialSuccessNotice] = useState<{
    queryNumber: string;
    orderNumber?: string;
    routedToPortal: boolean;
    serviceTitle: string;
    clientName: string;
    clientEmail: string;
  } | null>(null);

  useEffect(() => {
    const hasPending = trialUploadedFiles.some((f) => !f.done);
    if (!hasPending) return;
    const timer = window.setInterval(() => {
      setTrialUploadedFiles((prev) =>
        prev.map((f) => {
          if (f.done) return f;
          const next = Math.min(100, f.progress + 22);
          return { ...f, progress: next, done: next >= 100 };
        })
      );
    }, 220);
    return () => window.clearInterval(timer);
  }, [trialUploadedFiles]);

  const handleHomeTrialFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const remaining = Math.max(0, 5 - trialUploadedFiles.length);
    if (remaining === 0) {
      e.target.value = '';
      return;
    }
    const selectedFiles = Array.from(files).slice(0, remaining);
    selectedFiles.forEach((f, idx) => {
      const id = `htf_${Date.now()}_${idx}`;
      const cleanName = f.name.slice(0, 120);
      const sizeLabel = `${Math.max(0.1, Number((f.size / (1024 * 1024)).toFixed(1)))} MB`;
      setTrialUploadedFiles((prev) =>
        [
          ...prev,
          {
            id,
            name: cleanName,
            sizeLabel,
            progress: 20,
            done: false,
          },
        ].slice(0, 5)
      );
      if (f.size <= 8 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            setTrialUploadedFiles((prev) =>
              prev.map((item) =>
                item.id === id ? { ...item, dataUrl: reader.result as string } : item
              )
            );
          }
        };
        reader.readAsDataURL(f);
      }
    });
    e.target.value = '';
  };

  // Firebase Auth & Real-Time Data State
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [portalClientName, setPortalClientName] = useState<string | null>(() => {
    try {
      const saved = window.localStorage.getItem('fps_client_portal_session_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.signedIn && parsed?.name) return String(parsed.name);
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [portalClientEmail, setPortalClientEmail] = useState<string | null>(
    () => {
      try {
        const saved = window.localStorage.getItem(
          'fps_client_portal_session_v1'
        );
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.signedIn && parsed?.email)
            return String(parsed.email).trim().toLowerCase();
        }
      } catch {
        // ignore
      }
      return null;
    }
  );

  const [portalClientPhone, setPortalClientPhone] = useState<string>(() => {
    try {
      const saved = window.localStorage.getItem('fps_client_portal_session_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.signedIn && parsed?.phone) return String(parsed.phone);
      }
    } catch {
      // ignore
    }
    return '';
  });

  const [portalClientCompany, setPortalClientCompany] = useState<string>(() => {
    try {
      const saved = window.localStorage.getItem('fps_client_portal_session_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.signedIn && parsed?.companyName) {
          const c = String(parsed.companyName);
          return c === 'Registered Creative Studio' || c === 'Creative Retail Brand'
            ? ''
            : c;
        }
      }
    } catch {
      // ignore
    }
    return '';
  });

  const [portalClientAddress, setPortalClientAddress] = useState<string>(() => {
    try {
      const saved = window.localStorage.getItem('fps_client_portal_session_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.signedIn && parsed?.billingAddress)
          return String(parsed.billingAddress);
      }
    } catch {
      // ignore
    }
    return '';
  });

  const [portalClientWebsite, setPortalClientWebsite] = useState<string>(() => {
    try {
      const saved = window.localStorage.getItem('fps_client_portal_session_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.signedIn && parsed?.website) return String(parsed.website);
      }
    } catch {
      // ignore
    }
    return '';
  });

  const activeClientId = firebaseUser
    ? firebaseUser.uid
    : portalClientEmail
    ? getClientIdFromEmail(portalClientEmail)
    : '';

  const activeClientDisplayName =
    firebaseUser?.displayName || portalClientName || 'Studio Client';

  const isClientAuthenticated = Boolean(firebaseUser || portalClientEmail);

  const [userProfile, setUserProfile] = useState<UserProfileDoc>(
    INITIAL_SANDBOX_PROFILE
  );
  const [privateInfo, setPrivateInfo] = useState<UserPrivateInfoDoc | null>(
    INITIAL_SANDBOX_PRIVATE
  );

  const activeClientProfileData = {
    name: activeClientDisplayName,
    email: firebaseUser?.email || portalClientEmail || '',
    phone: portalClientPhone || privateInfo?.phone || '',
    companyName:
      portalClientCompany ||
      (userProfile.companyName === 'Registered Creative Studio'
        ? ''
        : userProfile.companyName || ''),
    address: portalClientAddress || privateInfo?.billingAddress || '',
    website: portalClientWebsite || '',
  };

  useEffect(() => {
    if (isClientAuthenticated) {
      if (activeClientProfileData.name) setTrialName(activeClientProfileData.name);
      if (activeClientProfileData.email) setTrialEmail(activeClientProfileData.email);
      if (activeClientProfileData.phone) setTrialPhone(activeClientProfileData.phone);
    }
  }, [
    isClientAuthenticated,
    activeClientProfileData.name,
    activeClientProfileData.email,
    activeClientProfileData.phone,
  ]);
  const [orders, setOrders] = useState<OrderDoc[]>(() =>
    loadStoredJson<OrderDoc[]>('fps_all_orders_v3', []).filter(
      (o) => o && o.clientId && o.clientId !== 'sandbox_studio_client'
    )
  );
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [sandboxMessagesMap, setSandboxMessagesMap] = useState<
    Record<string, OrderMessageDoc[]>
  >(() =>
    loadStoredJson<Record<string, OrderMessageDoc[]>>(
      'fps_all_messages_v3',
      {}
    )
  );
  const [liveMessages, setLiveMessages] = useState<OrderMessageDoc[]>([]);
  const [notifications, setNotifications] = useState<NotificationAlertDoc[]>(
    () =>
      loadStoredJson<NotificationAlertDoc[]>('fps_all_notifications_v3', []).filter(
        (n) => n && n.userId && n.userId !== 'sandbox_studio_client'
      )
  );

  // Migrate any legacy FPS-2026-XXXX order numbers and INV- prefixes to simple FX-DDMMYYYY format
  useEffect(() => {
    if (firebaseUser) return;
    const hasLegacyOrderNumber = orders.some(
      (o) => !o.orderNumber.startsWith('FX-')
    );
    const hasLegacyNotifRef = notifications.some(
      (n) => n.invoiceRef && n.invoiceRef.startsWith('INV-')
    );
    if (!hasLegacyOrderNumber && !hasLegacyNotifRef) return;

    const usedCounts: Record<string, number> = {};
    const oldToNewMap: Record<string, string> = {};

    const migratedOrders = orders.map((o) => {
      if (o.orderNumber.startsWith('FX-')) {
        usedCounts[o.orderNumber] = (usedCounts[o.orderNumber] || 0) + 1;
        return o;
      }
      const baseCode = formatFxDateCode(o.createdAt);
      const count = (usedCounts[baseCode] || 0) + 1;
      usedCounts[baseCode] = count;
      const newOrderNum =
        count === 1
          ? baseCode
          : `${baseCode}-${String(count).padStart(2, '0')}`;
      oldToNewMap[o.orderNumber] = newOrderNum;
      oldToNewMap[`INV-${o.orderNumber}`] = newOrderNum;
      return {
        ...o,
        orderNumber: newOrderNum,
      };
    });

    if (hasLegacyOrderNumber) {
      setOrders(migratedOrders);
      setOrderApprovalMap((prev) => {
        const next = { ...prev };
        Object.entries(oldToNewMap).forEach(([oldKey, newKey]) => {
          if (prev[oldKey]) {
            next[newKey] = prev[oldKey];
          }
        });
        return next;
      });
      setInvoiceStatusMap((prev) => {
        const next = { ...prev };
        Object.entries(oldToNewMap).forEach(([oldKey, newKey]) => {
          if (prev[oldKey]) {
            next[newKey] = prev[oldKey];
          }
        });
        return next;
      });
    }

    setNotifications((prev) =>
      prev.map((n) => {
        let nextRef = n.invoiceRef || '';
        if (oldToNewMap[nextRef]) {
          nextRef = oldToNewMap[nextRef];
        } else if (nextRef.startsWith('INV-')) {
          const stripped = nextRef.replace(/^INV-/i, '');
          nextRef = oldToNewMap[stripped] || stripped;
        }
        let nextTitle = n.title;
        let nextMessage = n.message;
        Object.entries(oldToNewMap).forEach(([oldKey, newKey]) => {
          nextTitle = nextTitle.split(oldKey).join(newKey);
          nextMessage = nextMessage.split(oldKey).join(newKey);
        });
        return {
          ...n,
          invoiceRef: nextRef,
          title: nextTitle,
          message: nextMessage,
        };
      })
    );
  }, [orders, notifications, firebaseUser]);

  // Persist user-submitted orders, messages, and notifications so each client sees their own history and Admin sees all
  useEffect(() => {
    if (firebaseUser) return;
    try {
      window.localStorage.setItem('fps_all_orders_v3', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders, firebaseUser]);

  useEffect(() => {
    if (firebaseUser) return;
    try {
      window.localStorage.setItem(
        'fps_all_messages_v3',
        JSON.stringify(sandboxMessagesMap)
      );
    } catch {
      // ignore
    }
  }, [sandboxMessagesMap, firebaseUser]);

  useEffect(() => {
    if (firebaseUser) return;
    try {
      window.localStorage.setItem(
        'fps_all_notifications_v3',
        JSON.stringify(notifications)
      );
    } catch {
      // ignore
    }
  }, [notifications, firebaseUser]);

  // 1. Listen to Auth State
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      setAuthReady(true);

      if (!user) {
        setUserProfile(INITIAL_SANDBOX_PROFILE);
        setPrivateInfo(INITIAL_SANDBOX_PRIVATE);
      }
    });
    return () => unsub();
  }, []);

  // 2. Attach Firestore Listeners when Authenticated
  useEffect(() => {
    if (!authReady || !firebaseUser) return;

    const uid = firebaseUser.uid;
    const userDocRef = doc(db, 'users', uid);
    const privateDocRef = doc(db, 'users', uid, 'private', 'info');

    const unsubProfile = onSnapshot(
      userDocRef,
      async (snap) => {
        if (snap.exists()) {
          setUserProfile(snap.data() as UserProfileDoc);
        } else {
          const isBootstrappedAdmin =
            firebaseUser.email === 'asiaclipp@gmail.com';
          const newProfile = {
            uid,
            displayName: sanitizeString(
              firebaseUser.displayName || 'Studio Client',
              SCHEMA_LIMITS.DISPLAY_NAME_MAX,
              'Studio Client'
            ),
            companyName: '',
            role: isBootstrappedAdmin ? 'admin' : 'client',
            planTier: 'studio_pro',
            billingCycle: 'monthly',
            monthlyQuota: 1250,
            usedCredits: 0,
            mfaEnabled: true,
            mfaMethod: 'totp_authenticator',
            mfaSecretHint: 'TOTP-FPS9',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          };
          try {
            await setDoc(userDocRef, newProfile);
            await setDoc(privateDocRef, {
              uid,
              email: sanitizeString(
                firebaseUser.email || 'client@fixphotostudio.com',
                SCHEMA_LIMITS.EMAIL_MAX,
                'client@fixphotostudio.com'
              ),
              phone: '',
              billingAddress: '',
              mfaRecoveryCodeHash: 'SHA256_FPS-REC-9941-8820-SAFE',
              updatedAt: serverTimestamp(),
            });
          } catch (err) {
            handleFirestoreError(err, OperationType.WRITE, `users/${uid}`);
          }
        }
      },
      (err) => handleFirestoreError(err, OperationType.GET, `users/${uid}`)
    );

    const unsubPrivate = onSnapshot(
      privateDocRef,
      (snap) => {
        if (snap.exists()) {
          setPrivateInfo(snap.data() as UserPrivateInfoDoc);
        }
      },
      (err) => handleFirestoreError(err, OperationType.GET, `users/${uid}/private/info`)
    );

    const ordersQuery = query(collection(db, 'orders'), where('clientId', '==', uid));
    const unsubOrders = onSnapshot(
      ordersQuery,
      (snap) => {
        const list: OrderDoc[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<OrderDoc, 'id'>),
        }));
        setOrders(list);
        if (list.length > 0 && !list.some((o) => o.id === selectedOrderId)) {
          setSelectedOrderId(list[0].id);
        }
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'orders')
    );

    const notifQuery = query(
      collection(db, 'notifications'),
      where('userId', '==', uid)
    );
    const unsubNotifs = onSnapshot(
      notifQuery,
      (snap) => {
        const list: NotificationAlertDoc[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<NotificationAlertDoc, 'id'>),
        }));
        setNotifications(list);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'notifications')
    );

    return () => {
      unsubProfile();
      unsubPrivate();
      unsubOrders();
      unsubNotifs();
    };
  }, [authReady, firebaseUser]);

  // 3. Attach Messages Listener for Selected Order when Authenticated
  useEffect(() => {
    if (!authReady || !firebaseUser || !selectedOrderId) return;
    const uid = firebaseUser.uid;
    const msgsQuery = query(
      collection(db, 'orders', selectedOrderId, 'messages'),
      where('clientId', '==', uid)
    );
    const unsubMsgs = onSnapshot(
      msgsQuery,
      (snap) => {
        const list: OrderMessageDoc[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<OrderMessageDoc, 'id'>),
        }));
        setLiveMessages(list);
      },
      (err) =>
        handleFirestoreError(err, OperationType.LIST, `orders/${selectedOrderId}/messages`)
    );
    return () => unsubMsgs();
  }, [authReady, firebaseUser, selectedOrderId]);

  const navigateToServicePage = (slug: string) => {
    setActiveServiceSlug(slug);
    setActivePage('service_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToServiceByCategory = (cat: ServiceCategory) => {
    const found =
      servicesList.find((s) => s.id === cat) || servicesList[0];
    navigateToServicePage(found.slug);
  };

  const navigateToAllBlogsPage = () => {
    setActivePage('blogs_page');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToSingleBlogPage = (slug: string) => {
    setActiveBlogSlug(slug);
    setBlogPosts((prev) =>
      prev.map((b) =>
        b.slug === slug
          ? { ...b, viewsCount: (b.viewsCount || 2400) + 1 }
          : b
      )
    );
    setActivePage('blog_detail_page');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      const timeoutPromise = new Promise<never>((_, reject) =>
        window.setTimeout(
          () => reject(new Error('Google popup timeout or blocked on live domain')),
          4000
        )
      );
      await Promise.race([signInWithPopup(auth, googleProvider), timeoutPromise]);
      setActivePage('portal');
    } catch (err) {
      console.error('Google Sign-In fallback:', err);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const handleOpenOrderWithService = (service: ServiceCategory) => {
    setPreselectedService(service);
    setNewOrderModalOpen(true);
  };

  const handleCreateOrder = async (
    payload: {
      projectTitle: string;
      serviceCategory: ServiceCategory;
      serviceTitle?: string;
      imageCount: number;
      turnaroundHours: number;
      outputFormat: OutputFormat;
      backgroundSpec: BackgroundSpec;
      instructions: string;
      totalPrice: number;
      uploadedBatchNames: string[];
      uploadedFilesData?: UploadedClientFileItem[];
      clientSourceFilesUrl?: string;
      clientName?: string;
      clientEmail?: string;
      clientPhone?: string;
      companyName?: string;
      clientAddress?: string;
      clientWebsite?: string;
    },
    options?: { redirectToPortal?: boolean }
  ): Promise<string> => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const baseDateCode = formatFxDateCode(new Date());
    const sameDayExistingCount = orders.filter((o) =>
      o.orderNumber.startsWith(baseDateCode)
    ).length;
    const orderNumber =
      sameDayExistingCount === 0
        ? baseDateCode
        : `${baseDateCode}-${String(sameDayExistingCount + 1).padStart(2, '0')}`;
    const invoiceRef = orderNumber;
    const orderId = sanitizeId(`ord_${Date.now()}_${randomSuffix}`);

    const resolvedServiceTitle =
      payload.serviceTitle ||
      servicesList.find((s) => s.id === payload.serviceCategory)?.shortNavTitle ||
      STUDIO_SERVICES.find((s) => s.id === payload.serviceCategory)
        ?.shortNavTitle ||
      'Clipping Path Service';

    const resolvedClientEmail =
      payload.clientEmail?.trim().toLowerCase() ||
      activeClientProfileData.email ||
      '';
    const resolvedOwnerId = firebaseUser
      ? firebaseUser.uid
      : resolvedClientEmail
      ? getClientIdFromEmail(resolvedClientEmail)
      : activeClientId || 'guest_client';

    const resolvedOwnerName =
      payload.clientName?.trim() || activeClientDisplayName;
    const resolvedClientPhone =
      payload.clientPhone?.trim() || activeClientProfileData.phone || '';
    const resolvedCompanyName =
      payload.companyName !== undefined
        ? payload.companyName.trim()
        : activeClientProfileData.companyName || '';
    const resolvedClientAddress =
      payload.clientAddress?.trim() || activeClientProfileData.address || '';
    const resolvedClientWebsite =
      payload.clientWebsite?.trim() || activeClientProfileData.website || '';

    // New customer orders start as Pending Approval & Invoice Pending
    setOrderApprovalMap((prev) => ({
      ...prev,
      [orderNumber]: 'pending',
    }));
    setInvoiceStatusMap((prev) => ({
      ...prev,
      [invoiceRef]: 'pending',
    }));

    if (firebaseUser) {
      const uid = firebaseUser.uid;
      const orderRef = doc(db, 'orders', orderId);
      try {
        await setDoc(orderRef, {
          orderNumber: sanitizeString(orderNumber, SCHEMA_LIMITS.ORDER_NUMBER_MAX),
          clientId: uid,
          clientName: sanitizeString(
            resolvedOwnerName,
            SCHEMA_LIMITS.DISPLAY_NAME_MAX,
            'Studio Client'
          ),
          projectTitle: sanitizeString(
            payload.projectTitle,
            SCHEMA_LIMITS.PROJECT_TITLE_MAX,
            'Photo Retouching Batch'
          ),
          serviceCategory: payload.serviceCategory,
          imageCount: payload.imageCount,
          turnaroundHours: payload.turnaroundHours,
          outputFormat: payload.outputFormat,
          backgroundSpec: payload.backgroundSpec,
          instructions: sanitizeString(payload.instructions, SCHEMA_LIMITS.INSTRUCTIONS_MAX),
          totalPrice: payload.totalPrice,
          status: 'queued',
          progressPercent: 0,
          uploadedBatchNames: payload.uploadedBatchNames
            .slice(0, SCHEMA_LIMITS.BATCH_ARRAY_MAX)
            .map((f) => sanitizeString(f, SCHEMA_LIMITS.BATCH_ITEM_MAX)),
          deliveryReady: false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        const msgId = sanitizeId(`msg_${Date.now()}_init`);
        await setDoc(doc(db, 'orders', orderId, 'messages', msgId), {
          orderId,
          clientId: uid,
          senderId: uid,
          senderName: 'Elena Rostova (Lead Specialist)',
          senderRole: 'specialist',
          body: `Order ${orderNumber} received (${payload.imageCount} frames · ${payload.turnaroundHours}h SLA). Status: 1. Order Status: Pending.`,
          attachmentName: payload.uploadedBatchNames[0] || '',
          createdAt: serverTimestamp(),
        });

        const notifId = sanitizeId(`notif_${Date.now()}_${randomSuffix}`);
        await setDoc(doc(db, 'notifications', notifId), {
          userId: uid,
          type: 'payment_receipt',
          title: `Order Invoice (Pending) — Order ${orderNumber}`,
          message: `Invoice ${invoiceRef} generated for ${payload.imageCount} frames (${payload.outputFormat} · ${payload.turnaroundHours}h SLA) for "${payload.projectTitle}". Status: PENDING PAYMENT.`,
          amountFormatted: `$${payload.totalPrice.toFixed(2)} USD`,
          invoiceRef,
          read: false,
          createdAt: serverTimestamp(),
        });

        await updateDoc(doc(db, 'users', uid), {
          planTier: userProfile.planTier,
          billingCycle: userProfile.billingCycle,
          monthlyQuota: userProfile.monthlyQuota,
          usedCredits: Math.min(100000, userProfile.usedCredits + payload.imageCount),
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `orders/${orderId}`);
      }
    } else {
      const newOrder: OrderDoc = {
        id: orderId,
        orderNumber,
        clientId: resolvedOwnerId,
        clientName: resolvedOwnerName,
        clientEmail: resolvedClientEmail,
        clientPhone: resolvedClientPhone,
        companyName: resolvedCompanyName,
        clientAddress: resolvedClientAddress,
        clientWebsite: resolvedClientWebsite,
        paymentTerms: invoicePaymentInfo.defaultPaymentTerms || 'Project',
        paymentOption: invoicePaymentInfo.defaultPaymentOption || 'PayPal',
        projectTitle: payload.projectTitle,
        serviceCategory: payload.serviceCategory,
        serviceTitle: resolvedServiceTitle,
        imageCount: payload.imageCount,
        turnaroundHours: payload.turnaroundHours,
        outputFormat: payload.outputFormat,
        backgroundSpec: payload.backgroundSpec,
        instructions: payload.instructions,
        totalPrice: payload.totalPrice,
        status: 'queued',
        progressPercent: 0,
        uploadedBatchNames: payload.uploadedBatchNames,
        uploadedFilesData: payload.uploadedFilesData,
        clientSourceFilesUrl: payload.clientSourceFilesUrl,
        deliveryReady: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setOrders((prev) => [newOrder, ...prev]);
      setSandboxMessagesMap((prev) => ({
        ...prev,
        [orderId]: [
          {
            id: `msg_${Date.now()}`,
            orderId,
            clientId: resolvedOwnerId,
            senderId: 'specialist_elena',
            senderName: 'Elena Rostova',
            senderRole: 'specialist',
            body: `Order ${orderNumber} received (${payload.imageCount} frames · ${payload.turnaroundHours}h SLA). Status: 1. Order Status: Pending.`,
            attachmentName: payload.uploadedBatchNames[0] || '',
            createdAt: new Date(),
          },
        ],
      }));
      setNotifications((prev) => [
        {
          id: `notif_${Date.now()}`,
          userId: resolvedOwnerId,
          type: 'payment_receipt',
          title: `Order Invoice (Pending) — Order ${orderNumber}`,
          message: `Invoice ${invoiceRef} generated for ${payload.imageCount} frames (${payload.outputFormat} · ${payload.turnaroundHours}h SLA) for "${payload.projectTitle}". Status: PENDING PAYMENT.`,
          amountFormatted: `$${payload.totalPrice.toFixed(2)} USD`,
          invoiceRef,
          read: false,
          createdAt: new Date(),
        },
        ...prev,
      ]);
      setUserProfile((prev) => ({
        ...prev,
        usedCredits: prev.usedCredits + payload.imageCount,
      }));
    }

    setSelectedOrderId(orderId);
    if (options?.redirectToPortal !== false) {
      setActivePage('portal');
    }
    return orderNumber;
  };

  const getOrderCurrentStageIndex = (order: OrderDoc): number => {
    const isPending =
      orderApprovalMap[order.orderNumber] === 'pending' ||
      (orderApprovalMap[order.orderNumber] !== 'approved' &&
        order.progressPercent === 0);
    if (isPending) return -1;
    if (order.status === 'queued' || order.status === 'ingesting') return 0;
    if (order.status === 'clipping' || order.status === 'retouching') return 1;
    if (order.status === 'qa_review') return 2;
    if (order.status === 'completed') return 3;
    return 0;
  };

  const handleSetOrderStage = async (
    order: OrderDoc,
    targetStatus: OrderStatus | 'pending_approval',
    deliveryDownloadUrl?: string
  ) => {
    const resolvedDownloadUrl =
      deliveryDownloadUrl !== undefined
        ? deliveryDownloadUrl.trim()
        : order.deliveryDownloadUrl || '';

    const currentStageIdx = getOrderCurrentStageIndex(order);

    // Once approved (stage >= 0), an order can never revert to pending_approval
    if (targetStatus === 'pending_approval') {
      if (currentStageIdx >= 0) {
        return;
      }
      return;
    }

    const stageMeta =
      PIPELINE_STAGES.find((s) => s.status === targetStatus) ||
      PIPELINE_STAGES[0];
    const targetStageIdx = PIPELINE_STAGES.findIndex(
      (s) => s.status === stageMeta.status
    );

    // Enforce forward-only stage progression: cannot go backwards to an earlier stage.
    // Allow re-saving stage 3 (completed) if updating the delivery download link.
    if (
      targetStageIdx < currentStageIdx ||
      (targetStageIdx === currentStageIdx && stageMeta.status !== 'completed')
    ) {
      return;
    }

    setOrderApprovalMap((prev) => ({
      ...prev,
      [order.orderNumber]: 'approved',
    }));

    const isNowCompleted = stageMeta.status === 'completed';
    const isStartWorking = stageMeta.status === 'clipping';
    const isUpdatingDeliveredLink =
      isNowCompleted && currentStageIdx === 3 && Boolean(resolvedDownloadUrl);

    const notifTitle = isUpdatingDeliveredLink
      ? `Got New Download Link — Order ${order.orderNumber}`
      : isNowCompleted
      ? `4. Ready for Delivery (Got New Download Link) — Order ${order.orderNumber}`
      : isStartWorking
      ? `2. Start Working & Invoice Issued — Order ${order.orderNumber}`
      : `Order ${order.orderNumber} · ${stageMeta.label} (${stageMeta.progress}%)`;

    const notifMessage = isUpdatingDeliveredLink
      ? `You got a new download link for Order ${order.orderNumber} (${order.projectTitle})! Download Link: ${resolvedDownloadUrl} (Also sent to your email ${
          order.clientEmail || 'on file'
        }).`
      : isNowCompleted
      ? resolvedDownloadUrl
        ? `Your completed files for Order ${order.orderNumber} are Ready for Delivery! You got a new download link: ${resolvedDownloadUrl} (Also sent to your email ${
            order.clientEmail || 'on file'
          }).`
        : `${stageMeta.description}`
      : isStartWorking
      ? `Production has started on Order ${order.orderNumber} (${order.projectTitle}). Your official invoice (${order.orderNumber}) is now available in your Client Portal.`
      : stageMeta.description;

    if (firebaseUser) {
      const uid = order.clientId || firebaseUser.uid;
      try {
        await updateDoc(doc(db, 'orders', order.id), {
          status: stageMeta.status,
          progressPercent: stageMeta.progress,
          deliveryReady: isNowCompleted,
          updatedAt: serverTimestamp(),
        });

        const notifId = sanitizeId(`notif_stage_${Date.now()}`);
        await setDoc(doc(db, 'notifications', notifId), {
          userId: uid,
          type: isNowCompleted
            ? 'delivery_ready'
            : isStartWorking
            ? 'payment_receipt'
            : 'order_status',
          title: sanitizeString(notifTitle, SCHEMA_LIMITS.NOTIF_TITLE_MAX),
          message: sanitizeString(notifMessage, SCHEMA_LIMITS.NOTIF_MESSAGE_MAX),
          amountFormatted: isStartWorking
            ? `$${order.totalPrice.toFixed(2)} USD`
            : '',
          invoiceRef: isStartWorking ? order.orderNumber : '',
          read: false,
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `orders/${order.id}`);
      }
    } else {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id
            ? {
                ...o,
                status: stageMeta.status,
                progressPercent: stageMeta.progress,
                deliveryReady: isNowCompleted,
                deliveryDownloadUrl: resolvedDownloadUrl,
                deliveryEmailSent: isNowCompleted && Boolean(resolvedDownloadUrl),
                reopenedByChat: isNowCompleted ? false : o.reopenedByChat,
                updatedAt: new Date(),
              }
            : o
        )
      );
      setNotifications((prev) => [
        {
          id: `notif_${Date.now()}`,
          userId: order.clientId || activeClientId,
          type: isNowCompleted
            ? 'delivery_ready'
            : isStartWorking
            ? 'payment_receipt'
            : 'order_status',
          title: notifTitle,
          message: notifMessage,
          amountFormatted: isStartWorking
            ? `$${order.totalPrice.toFixed(2)} USD`
            : '',
          invoiceRef: isStartWorking ? order.orderNumber : '',
          read: false,
          createdAt: new Date(),
        },
        ...prev,
      ]);

      if (isNowCompleted && resolvedDownloadUrl) {
        const deliveryChatMsg: OrderMessageDoc = {
          id: `msg_${Date.now()}_deliv`,
          orderId: order.id,
          clientId: order.clientId || activeClientId,
          senderId: 'specialist_elena',
          senderName: 'FixPhoto Studio Delivery Desk',
          senderRole: 'specialist',
          body: isUpdatingDeliveredLink
            ? `Got New Download Link! Your updated download link for Order ${order.orderNumber} is ready: ${resolvedDownloadUrl} (An email with this new download link has also been dispatched to ${
                order.clientEmail || 'your email'
              }).`
            : `Stage 04: Ready for Delivery! Your completed files for ${order.orderNumber} are ready. Click your download link to download: ${resolvedDownloadUrl} (An email with this download link has also been dispatched to ${
                order.clientEmail || 'your email'
              }).`,
          attachmentName: resolvedDownloadUrl,
          createdAt: new Date(),
        };
        setSandboxMessagesMap((prev) => ({
          ...prev,
          [order.id]: [...(prev[order.id] || []), deliveryChatMsg],
        }));

        if (order.clientEmail) {
          void createAndDispatchClientQuery({
            source: 'custom_quote_popup',
            clientName: order.clientName || 'Client',
            clientEmail: order.clientEmail,
            clientPhone: order.clientPhone || '',
            companyName: order.companyName || '',
            serviceTitle: isUpdatingDeliveredLink
              ? `GOT NEW DOWNLOAD LINK — ${order.orderNumber}`
              : `READY FOR DELIVERY — ${order.orderNumber}`,
            serviceSlug: 'delivery-ready',
            instructions: `Download Link Sent to Customer: ${resolvedDownloadUrl}`,
            sampleFiles: [resolvedDownloadUrl],
            isLoggedInClient: true,
            routedToPortal: true,
            portalOrderNumber: order.orderNumber,
            adminEmailRecipient: siteConfig.supportEmail || 'asiaclipp@gmail.com',
          });
        }
      }
    }
  };

  const handleApproveOrder = async (order: OrderDoc) => {
    const currentStageIdx = getOrderCurrentStageIndex(order);
    if (currentStageIdx >= 0) return;
    await handleSetOrderStage(order, 'ingesting');
  };

  const handleAdvanceOrderStage = async (order: OrderDoc) => {
    const currentIdx = getOrderCurrentStageIndex(order);
    if (currentIdx < 0) {
      await handleSetOrderStage(order, 'ingesting');
      return;
    }
    if (currentIdx >= PIPELINE_STAGES.length - 1) return;
    const nextStage = PIPELINE_STAGES[currentIdx + 1];
    await handleSetOrderStage(order, nextStage.status);
  };

  const handleCompleteOrderByClient = async (order: OrderDoc) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === order.id
          ? {
              ...o,
              status: 'completed',
              progressPercent: 100,
              deliveryReady: true,
              clientCompleted: true,
              clientCompletedAt: new Date(),
              reopenedByChat: false,
              updatedAt: new Date(),
            }
          : o
      )
    );

    const notifTitle = `5. Complete Order — ${order.orderNumber}`;
    const notifMessage = `Order ${order.orderNumber} (${order.projectTitle}) has been marked Complete and moved to your Complete Order archive.`;
    setNotifications((prev) => [
      {
        id: `notif_complete_${Date.now()}`,
        userId: order.clientId || activeClientId,
        type: 'order_status',
        title: notifTitle,
        message: notifMessage,
        amountFormatted: '',
        invoiceRef: '',
        read: false,
        createdAt: new Date(),
      },
      ...prev,
    ]);
  };

  const handleDeleteOrder = async (order: OrderDoc) => {
    if (firebaseUser) {
      try {
        await deleteDoc(doc(db, 'orders', order.id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `orders/${order.id}`);
      }
    } else {
      setOrders((prev) => prev.filter((o) => o.id !== order.id));
    }

    setOrderApprovalMap((prev) => {
      const next = { ...prev };
      delete next[order.orderNumber];
      return next;
    });
    setInvoiceStatusMap((prev) => {
      const next = { ...prev };
      delete next[order.orderNumber];
      delete next[`INV-${order.orderNumber}`];
      return next;
    });
    setNotifications((prev) =>
      prev.filter(
        (n) =>
          n.invoiceRef !== order.orderNumber &&
          n.invoiceRef !== `INV-${order.orderNumber}` &&
          !n.title.includes(order.orderNumber)
      )
    );
  };

  const handleSubmitInvoicePaymentProof = async (
    order: OrderDoc,
    payload: { fileName: string; dataUrl: string; note: string }
  ) => {
    const submittedAt = new Date().toISOString();
    setOrders((prev) =>
      prev.map((o) =>
        o.id === order.id
          ? {
              ...o,
              paymentProofFileName: payload.fileName,
              paymentProofDataUrl: payload.dataUrl,
              paymentProofNote: payload.note,
              paymentProofSubmittedAt: submittedAt,
              updatedAt: new Date(),
            }
          : o
      )
    );

    const proofNotif: NotificationAlertDoc = {
      id: `notif_payproof_${Date.now()}`,
      userId: order.clientId || activeClientId,
      type: 'payment_receipt',
      title: `Payment Proof Uploaded — Order ${order.orderNumber}`,
      message: `Your payment receipt (${payload.fileName})${
        payload.note ? ` · Note: "${payload.note}"` : ''
      } has been attached to Invoice ${order.orderNumber}. Studio Admin will verify your payment and update your invoice status to PAID.`,
      amountFormatted: `$${order.totalPrice.toFixed(2)} USD`,
      invoiceRef: order.orderNumber,
      read: false,
      createdAt: new Date(),
    };
    setNotifications((prev) => [proofNotif, ...prev]);
  };

  const handleUpdateInvoiceStatus = async (
    invoiceRef: string,
    nextStatus: InvoicePaymentStatus,
    relatedOrderNumber?: string
  ) => {
    const currentInvoiceStatus =
      invoiceStatusMap[invoiceRef] ||
      (relatedOrderNumber ? invoiceStatusMap[relatedOrderNumber] : undefined) ||
      'pending';

    // Once marked PAID, an invoice can never revert to pending
    if (currentInvoiceStatus === 'paid' && nextStatus === 'pending') {
      return;
    }

    setInvoiceStatusMap((prev) => ({
      ...prev,
      [invoiceRef]: nextStatus,
      ...(relatedOrderNumber ? { [relatedOrderNumber]: nextStatus } : {}),
    }));

    const matchingNotif = notifications.find((n) => n.invoiceRef === invoiceRef);
    const updatedTitle =
      nextStatus === 'paid'
        ? `Payment Confirmation Receipt (PAID) — ${
            relatedOrderNumber ? `Order ${relatedOrderNumber}` : invoiceRef
          }`
        : `Order Invoice (Pending) — ${
            relatedOrderNumber ? `Order ${relatedOrderNumber}` : invoiceRef
          }`;
    const updatedMessage =
      nextStatus === 'paid'
        ? `Official payment verified by Admin for Invoice ${invoiceRef}. Status: PAID.`
        : `Invoice ${invoiceRef} awaits settlement. Please view invoice for official payment instructions. Status: PENDING.`;

    if (firebaseUser && matchingNotif) {
      try {
        await updateDoc(doc(db, 'notifications', matchingNotif.id), {
          title: sanitizeString(updatedTitle, SCHEMA_LIMITS.NOTIF_TITLE_MAX),
          message: sanitizeString(updatedMessage, SCHEMA_LIMITS.NOTIF_MESSAGE_MAX),
          read: false,
        });
      } catch (err) {
        handleFirestoreError(
          err,
          OperationType.UPDATE,
          `notifications/${matchingNotif.id}`
        );
      }
    } else {
      setNotifications((prev) =>
        prev.map((n) =>
          n.invoiceRef === invoiceRef
            ? {
                ...n,
                title: updatedTitle,
                message: updatedMessage,
                read: false,
              }
            : n
        )
      );
    }
  };

  const handleUpdateOrderInvoiceDetails = async (
    orderId: string,
    updates: {
      clientName?: string;
      clientEmail?: string;
      clientPhone?: string;
      companyName?: string;
      clientAddress?: string;
      clientWebsite?: string;
      paymentTerms?: InvoicePaymentTerms;
      paymentOption?: InvoicePaymentOption;
      deliveryDownloadUrl?: string;
      projectTitle?: string;
      imageCount?: number;
      totalPrice?: number;
      turnaroundHours?: number;
      outputFormat?: OutputFormat;
    }
  ) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    const nextClientName =
      updates.clientName !== undefined ? updates.clientName : targetOrder.clientName;
    const nextClientEmail =
      updates.clientEmail !== undefined ? updates.clientEmail : targetOrder.clientEmail;
    const nextClientPhone =
      updates.clientPhone !== undefined ? updates.clientPhone : targetOrder.clientPhone;
    const nextCompanyName =
      updates.companyName !== undefined ? updates.companyName : targetOrder.companyName;
    const nextClientAddress =
      updates.clientAddress !== undefined
        ? updates.clientAddress
        : targetOrder.clientAddress;
    const nextClientWebsite =
      updates.clientWebsite !== undefined
        ? updates.clientWebsite
        : targetOrder.clientWebsite;
    const nextPaymentTerms =
      updates.paymentTerms !== undefined
        ? updates.paymentTerms
        : targetOrder.paymentTerms;
    const nextPaymentOption =
      updates.paymentOption !== undefined
        ? updates.paymentOption
        : targetOrder.paymentOption;
    const nextDeliveryUrl =
      updates.deliveryDownloadUrl !== undefined
        ? updates.deliveryDownloadUrl
        : targetOrder.deliveryDownloadUrl;
    const nextTitle =
      updates.projectTitle !== undefined ? updates.projectTitle : targetOrder.projectTitle;
    const nextCount =
      updates.imageCount !== undefined
        ? Math.max(1, Number(updates.imageCount))
        : targetOrder.imageCount;
    const nextPrice =
      updates.totalPrice !== undefined
        ? Math.max(0, Number(updates.totalPrice))
        : targetOrder.totalPrice;
    const nextSla =
      updates.turnaroundHours !== undefined
        ? Math.max(1, Number(updates.turnaroundHours))
        : targetOrder.turnaroundHours;
    const nextFormat =
      updates.outputFormat !== undefined ? updates.outputFormat : targetOrder.outputFormat;

    const invoiceRef = targetOrder.orderNumber;
    const matchingNotif = notifications.find(
      (n) =>
        n.invoiceRef === invoiceRef ||
        n.invoiceRef === `INV-${targetOrder.orderNumber}` ||
        n.title.includes(targetOrder.orderNumber)
    );

    if (firebaseUser) {
      try {
        await updateDoc(doc(db, 'orders', orderId), {
          clientName: sanitizeString(nextClientName, SCHEMA_LIMITS.DISPLAY_NAME_MAX, 'Studio Client'),
          projectTitle: sanitizeString(nextTitle, SCHEMA_LIMITS.PROJECT_TITLE_MAX, 'Retouching Batch'),
          imageCount: nextCount,
          totalPrice: nextPrice,
          turnaroundHours: nextSla,
          outputFormat: nextFormat,
          updatedAt: serverTimestamp(),
        });
        if (matchingNotif) {
          await updateDoc(doc(db, 'notifications', matchingNotif.id), {
            title: sanitizeString(
              `Order Invoice — ${targetOrder.orderNumber} (${nextTitle})`,
              SCHEMA_LIMITS.NOTIF_TITLE_MAX
            ),
            message: sanitizeString(
              `Invoice ${invoiceRef} for ${nextCount} frames (${nextFormat} · ${nextSla}h SLA) — "${nextTitle}".`,
              SCHEMA_LIMITS.NOTIF_MESSAGE_MAX
            ),
            amountFormatted: `$${nextPrice.toFixed(2)} USD`,
          });
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
      }
    } else {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                clientName: nextClientName,
                clientEmail: nextClientEmail,
                clientPhone: nextClientPhone,
                companyName: nextCompanyName,
                clientAddress: nextClientAddress,
                clientWebsite: nextClientWebsite,
                paymentTerms: nextPaymentTerms,
                paymentOption: nextPaymentOption,
                deliveryDownloadUrl: nextDeliveryUrl,
                projectTitle: nextTitle,
                imageCount: nextCount,
                totalPrice: nextPrice,
                turnaroundHours: nextSla,
                outputFormat: nextFormat,
                updatedAt: new Date(),
              }
            : o
        )
      );
      setNotifications((prev) =>
        prev.map((n) =>
          n.invoiceRef === invoiceRef || n.title.includes(targetOrder.orderNumber)
            ? {
                ...n,
                title: `Order Invoice — ${targetOrder.orderNumber} (${nextTitle})`,
                message: `Invoice ${invoiceRef} for ${nextCount} frames (${nextFormat} · ${nextSla}h SLA) — "${nextTitle}".`,
                amountFormatted: `$${nextPrice.toFixed(2)} USD`,
              }
            : n
        )
      );
    }
  };

  const handleUpdateClientProfile = async (payload: {
    oldEmail: string;
    newEmail: string;
    name: string;
    phone: string;
    companyName: string;
    billingAddress: string;
    website?: string;
    password?: string;
  }) => {
    const cleanNewEmail = payload.newEmail.trim().toLowerCase();
    const cleanOldEmail = payload.oldEmail.trim().toLowerCase();
    const oldClientId = getClientIdFromEmail(cleanOldEmail);
    const newClientId = getClientIdFromEmail(cleanNewEmail);

    setPortalClientName(payload.name);
    setPortalClientEmail(cleanNewEmail);
    setPortalClientPhone(payload.phone);
    setPortalClientCompany(payload.companyName);
    setPortalClientAddress(payload.billingAddress);
    setPortalClientWebsite(payload.website || '');

    setUserProfile((prev) => ({
      ...prev,
      displayName: payload.name || prev.displayName,
      companyName: payload.companyName,
      updatedAt: new Date(),
    }));

    setPrivateInfo((prev) =>
      prev
        ? {
            ...prev,
            email: cleanNewEmail || prev.email,
            phone: payload.phone,
            billingAddress: payload.billingAddress,
            updatedAt: new Date(),
          }
        : null
    );

    if (firebaseUser) {
      const uid = firebaseUser.uid;
      try {
        await updateDoc(doc(db, 'users', uid), {
          displayName: sanitizeString(
            payload.name || 'Studio Client',
            SCHEMA_LIMITS.DISPLAY_NAME_MAX,
            'Studio Client'
          ),
          companyName: sanitizeString(payload.companyName, 120),
          updatedAt: serverTimestamp(),
        });
        await updateDoc(doc(db, 'users', uid, 'private', 'info'), {
          email: sanitizeString(
            cleanNewEmail || firebaseUser.email || 'client@fixphotostudio.com',
            SCHEMA_LIMITS.EMAIL_MAX,
            'client@fixphotostudio.com'
          ),
          phone: sanitizeString(payload.phone, SCHEMA_LIMITS.PHONE_MAX),
          billingAddress: sanitizeString(payload.billingAddress, SCHEMA_LIMITS.ADDRESS_MAX),
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${uid}`);
      }
    } else {
      // Update all orders belonging to this client so their invoices reflect the updated billing info
      setOrders((prev) =>
        prev.map((o) =>
          o.clientId === oldClientId || o.clientId === newClientId
            ? {
                ...o,
                clientId: newClientId || o.clientId,
                clientName: payload.name || o.clientName,
                clientEmail: cleanNewEmail || o.clientEmail,
                clientPhone: payload.phone,
                companyName: payload.companyName,
                clientAddress: payload.billingAddress,
                clientWebsite: payload.website || '',
                updatedAt: new Date(),
              }
            : o
        )
      );

      if (oldClientId && newClientId && oldClientId !== newClientId) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.userId === oldClientId ? { ...n, userId: newClientId } : n
          )
        );
        setSandboxMessagesMap((prev) => {
          const next: Record<string, OrderMessageDoc[]> = {};
          for (const [ordId, msgs] of Object.entries(prev)) {
            next[ordId] = msgs.map((m) =>
              m.clientId === oldClientId ? { ...m, clientId: newClientId } : m
            );
          }
          return next;
        });
      }
    }
  };

  const handleSendMessage = async (
    order: OrderDoc,
    body: string,
    attachmentName: string,
    senderRoleOverride?: 'client' | 'specialist'
  ) => {
    const cleanBody = sanitizeString(
      body,
      SCHEMA_LIMITS.MESSAGE_BODY_MAX,
      'Update requested.'
    );
    const cleanAttachment = sanitizeString(
      attachmentName,
      SCHEMA_LIMITS.ATTACHMENT_NAME_MAX
    );
    const role: 'client' | 'specialist' = senderRoleOverride || 'client';

    if (firebaseUser) {
      const uid = firebaseUser.uid;
      const msgId = sanitizeId(`msg_${Date.now()}_${role === 'specialist' ? 's' : 'c'}`);
      try {
        await setDoc(doc(db, 'orders', order.id, 'messages', msgId), {
          orderId: order.id,
          clientId: order.clientId || uid,
          senderId: uid,
          senderName: sanitizeString(
            role === 'specialist'
              ? 'FixPhoto Studio Admin'
              : userProfile.displayName || order.clientName || 'Client',
            SCHEMA_LIMITS.DISPLAY_NAME_MAX,
            role === 'specialist' ? 'FixPhoto Studio Admin' : 'Client'
          ),
          senderRole: role,
          body: cleanBody,
          attachmentName: cleanAttachment,
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `orders/${order.id}/messages`);
      }
    } else {
      const ownerId = order.clientId || activeClientId || 'guest_client';
      const newMsg: OrderMessageDoc = {
        id: `msg_${Date.now()}_${role === 'specialist' ? 's' : 'c'}`,
        orderId: order.id,
        clientId: ownerId,
        senderId: role === 'specialist' ? 'studio_admin' : ownerId,
        senderName:
          role === 'specialist'
            ? 'FixPhoto Studio Admin'
            : order.clientName || activeClientDisplayName || 'Client',
        senderRole: role,
        body: cleanBody,
        attachmentName: cleanAttachment,
        createdAt: new Date(),
      };
      setSandboxMessagesMap((prev) => ({
        ...prev,
        [order.id]: [...(prev[order.id] || []), newMsg],
      }));
    }

    // If a new reply is sent on an already completed/delivered order, move it back to the active/pending list
    // until Admin or Client finishes/confirms it again!
    if (order.status === 'completed' || order.clientCompleted) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id
            ? {
                ...o,
                reopenedByChat: true,
                clientCompleted: false,
                updatedAt: new Date(),
              }
            : o
        )
      );
    }

    if (role === 'specialist') {
      setNotifications((prev) => [
        {
          id: `notif_msg_${Date.now()}`,
          userId: order.clientId || activeClientId,
          type: 'order_status',
          title: `New Reply from Studio Admin — Order ${order.orderNumber}`,
          message: cleanBody,
          amountFormatted: '',
          invoiceRef: '',
          read: false,
          createdAt: new Date(),
        },
        ...prev,
      ]);
    }
  };

  const handleMarkNotificationRead = async (notif: NotificationAlertDoc) => {
    if (firebaseUser) {
      try {
        await updateDoc(doc(db, 'notifications', notif.id), {
          read: true,
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `notifications/${notif.id}`);
      }
    } else {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
      );
    }
  };

  const handleChangeSubscriptionPlan = async (tier: PlanTier, cycle: BillingCycle) => {
    const spec =
      SUBSCRIPTION_PLANS.find((p) => p.id === tier) || SUBSCRIPTION_PLANS[1];
    const price = cycle === 'annual' ? spec.annualPricePerMonth : spec.monthlyPrice;
    const invoiceRef = `INV-SUB-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    setInvoiceStatusMap((prev) => ({
      ...prev,
      [invoiceRef]: 'pending',
    }));

    if (firebaseUser) {
      const uid = firebaseUser.uid;
      try {
        await updateDoc(doc(db, 'users', uid), {
          planTier: tier,
          billingCycle: cycle,
          monthlyQuota: spec.monthlyCredits,
          usedCredits: userProfile.usedCredits,
          updatedAt: serverTimestamp(),
        });

        const notifId = sanitizeId(`notif_sub_${Date.now()}`);
        await setDoc(doc(db, 'notifications', notifId), {
          userId: uid,
          type: 'payment_receipt',
          title: `Subscription Invoice (Pending) — ${spec.name} (${cycle.toUpperCase()})`,
          message: `Provisioned ${spec.monthlyCredits.toLocaleString()} monthly image credits with ${spec.slaHours}. Status: PENDING PAYMENT.`,
          amountFormatted: `$${price}.00 / mo`,
          invoiceRef,
          read: false,
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${uid}`);
      }
    } else {
      setUserProfile((prev) => ({
        ...prev,
        planTier: tier,
        billingCycle: cycle,
        monthlyQuota: spec.monthlyCredits,
        updatedAt: new Date(),
      }));
      setNotifications((prev) => [
        {
          id: `notif_sub_${Date.now()}`,
          userId: activeClientId || 'guest_client',
          type: 'payment_receipt',
          title: `Subscription Invoice (Pending) — ${spec.name} (${cycle.toUpperCase()})`,
          message: `Provisioned ${spec.monthlyCredits.toLocaleString()} monthly image credits with ${spec.slaHours}. Status: PENDING PAYMENT.`,
          amountFormatted: `$${price}.00 / mo`,
          invoiceRef,
          read: false,
          createdAt: new Date(),
        },
        ...prev,
      ]);
    }
  };

  const handleSaveMfaSettings = async (
    enabled: boolean,
    method: MfaMethod,
    secretHint: string,
    phone: string,
    billingAddress: string,
    recoveryHash: string
  ) => {
    if (firebaseUser) {
      const uid = firebaseUser.uid;
      try {
        await updateDoc(doc(db, 'users', uid), {
          mfaEnabled: enabled,
          mfaMethod: method,
          mfaSecretHint: sanitizeString(secretHint, SCHEMA_LIMITS.MFA_HINT_MAX),
          updatedAt: serverTimestamp(),
        });
        await updateDoc(doc(db, 'users', uid, 'private', 'info'), {
          email: sanitizeString(
            firebaseUser.email || 'client@fixphotostudio.com',
            SCHEMA_LIMITS.EMAIL_MAX,
            'client@fixphotostudio.com'
          ),
          phone: sanitizeString(phone, SCHEMA_LIMITS.PHONE_MAX),
          billingAddress: sanitizeString(billingAddress, SCHEMA_LIMITS.ADDRESS_MAX),
          mfaRecoveryCodeHash: sanitizeString(recoveryHash, 128),
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${uid}`);
      }
    } else {
      setUserProfile((prev) => ({
        ...prev,
        mfaEnabled: enabled,
        mfaMethod: method,
        mfaSecretHint: secretHint,
        updatedAt: new Date(),
      }));
      setPrivateInfo((prev) =>
        prev
          ? {
              ...prev,
              phone,
              billingAddress,
              mfaRecoveryCodeHash: recoveryHash,
              updatedAt: new Date(),
            }
          : null
      );
    }
  };

  const handleSubmitPublicQuery = async (payload: {
    source: 'home_trial_form' | 'free_trial_popup' | 'custom_quote_popup';
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    companyName?: string;
    serviceTitle: string;
    serviceSlug: string;
    instructions: string;
    sampleFiles?: string[];
    sampleFilesData?: UploadedClientFileItem[];
    clientSourceFilesUrl?: string;
    portalOrderNumber?: string;
  }): Promise<ClientQueryItem> => {
    const newQuery = await createAndDispatchClientQuery({
      ...payload,
      isLoggedInClient: isClientAuthenticated,
      routedToPortal: isClientAuthenticated,
      adminEmailRecipient: siteConfig.supportEmail || 'asiaclipp@gmail.com',
    });
    setClientQueries((prev) => [newQuery, ...prev]);
    return newQuery;
  };

  const handleFreeTrialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trialEmail.includes('@') || trialName.trim().length < 2) {
      setTrialStatus('Please enter your name and work email to submit your query.');
      setTrialSuccessNotice(null);
      return;
    }
    const chosenService =
      servicesList.find((s) => s.slug === trialServiceSlug) || servicesList[0];
    const customerFileNames = trialUploadedFiles.map((f) => f.name);
    const customerFilesData = trialUploadedFiles.map((f) => ({
      name: f.name,
      sizeLabel: f.sizeLabel,
      dataUrl: f.dataUrl,
    }));

    const createdOrderNum = await handleCreateOrder(
      {
        projectTitle: `FREE ${
          trialDivision === 'video_editing' ? 'VIDEO' : '5-IMAGE'
        } TRIAL — ${chosenService.shortNavTitle} (${trialName.trim()})`,
        serviceCategory: chosenService.id,
        serviceTitle: chosenService.shortNavTitle,
        imageCount:
          customerFileNames.length > 0
            ? customerFileNames.length
            : trialDivision === 'video_editing'
            ? 1
            : 5,
        turnaroundHours: 12,
        outputFormat: 'PSD_LAYERED',
        backgroundSpec: 'PURE_WHITE_FFFFFF',
        instructions:
          trialInstructions.trim() ||
          `Complimentary Studio Quality Test for ${trialEmail}${
            trialPhone.trim() ? ` (Tel: ${trialPhone.trim()})` : ''
          }. Execute 400% zoom QA.`,
        totalPrice: 0,
        uploadedBatchNames: customerFileNames,
        uploadedFilesData: customerFilesData,
        clientName: trialName.trim(),
        clientEmail: trialEmail.trim(),
      },
      { redirectToPortal: false }
    );

    const createdQuery = await handleSubmitPublicQuery({
      source: 'home_trial_form',
      clientName: trialName.trim(),
      clientEmail: trialEmail.trim(),
      clientPhone: trialPhone.trim(),
      serviceTitle: chosenService.shortNavTitle,
      serviceSlug: chosenService.slug,
      instructions:
        trialInstructions.trim() ||
        `Complimentary Studio Quality Trial Inquiry for ${chosenService.shortNavTitle}.`,
      sampleFiles: customerFileNames,
      sampleFilesData: customerFilesData,
      portalOrderNumber: createdOrderNum,
    });

    setTrialStatus(null);
    setTrialSuccessNotice({
      queryNumber: createdQuery.queryNumber,
      orderNumber: createdOrderNum,
      routedToPortal: isClientAuthenticated,
      serviceTitle: chosenService.shortNavTitle,
      clientName: trialName.trim(),
      clientEmail: trialEmail.trim(),
    });
    setTrialInstructions('');
    setTrialPhone('');
    setTrialUploadedFiles([]);
  };

  const activeServiceObj =
    servicesList.find((s) => s.slug === activeServiceSlug) || servicesList[0];

  const activeBlogObj =
    blogPosts.find((b) => b.slug === activeBlogSlug) || blogPosts[0];

  // Dynamic SEO Metadata Manager (Title, Meta Description, OpenGraph, Twitter Cards, Canonical & JSON-LD)
  useEffect(() => {
    const baseOrigin =
      typeof window !== 'undefined'
        ? `${window.location.origin}${window.location.pathname}`
        : 'https://fixphotostudio.com/';

    let pageTitle =
      siteConfig.pageSeo?.home?.seoTitle ||
      'FixPhoto Studio – Commercial Photo & Video Editing';
    let metaDescription =
      siteConfig.pageSeo?.home?.seoMetaDescription ||
      'Get pixel-perfect clipping paths, 3D ghost mannequins, jewelry retouching, and 4K video editing in 12–24 hours. Start your free 5-image trial today.';
    let canonicalUrl = baseOrigin;

    switch (activePage) {
      case 'home': {
        pageTitle =
          siteConfig.pageSeo?.home?.seoTitle?.trim() ||
          'FixPhoto Studio – Commercial Photo & Video Editing';
        metaDescription =
          siteConfig.pageSeo?.home?.seoMetaDescription?.trim() ||
          'Get pixel-perfect clipping paths ($0.39/img), 3D ghost mannequins, jewelry retouching, and 4K video editing in 12–24h. Try 5 images free today.';
        break;
      }
      case 'services_page': {
        pageTitle =
          siteConfig.pageSeo?.services_page?.seoTitle?.trim() ||
          `All ${servicesList.length} Photo & Video Services – FixPhoto Studio`;
        metaDescription =
          siteConfig.pageSeo?.services_page?.seoMetaDescription?.trim() ||
          `Explore ${servicesList.length} dedicated photo editing and 4K video post-production pods with 12h–24h SLA turnaround and 99.94% QA accuracy. Order online.`;
        canonicalUrl = `${baseOrigin}#services`;
        break;
      }
      case 'service_detail': {
        const rateStr = `$${activeServiceObj.ratePerImage.toFixed(2)}/${activeServiceObj.unitLabel}`;
        const defaultServiceTitle = `${activeServiceObj.shortNavTitle} (${rateStr}) – FixPhoto Studio`;
        const cleanSummary = activeServiceObj.summary.slice(0, 95).trim();
        const defaultServiceDesc = `${cleanSummary} Starting at ${rateStr} with ${activeServiceObj.turnaroundLabel.split('·')[0].trim()}. Claim your free 5-image trial today.`;
        pageTitle =
          activeServiceObj.seoTitle?.trim() || defaultServiceTitle;
        metaDescription =
          activeServiceObj.seoMetaDescription?.trim() || defaultServiceDesc;
        canonicalUrl = `${baseOrigin}#service/${activeServiceObj.slug}`;
        break;
      }
      case 'video_editing_page': {
        pageTitle =
          siteConfig.pageSeo?.video_editing_page?.seoTitle?.trim() ||
          '4K Video Editing & Color Grading – FixPhoto Studio';
        metaDescription =
          siteConfig.pageSeo?.video_editing_page?.seoMetaDescription?.trim() ||
          'Commercial 4K product video editing, fashion social reels, wedding cinema grading, and VFX rotoscoping delivered in 12–48h. Book a studio pod today.';
        canonicalUrl = `${baseOrigin}#video-editing`;
        break;
      }
      case 'portfolio_page': {
        pageTitle =
          siteConfig.pageSeo?.portfolio_page?.seoTitle?.trim() ||
          'Before & After Photo & Video Portfolio – FixPhoto Studio';
        metaDescription =
          siteConfig.pageSeo?.portfolio_page?.seoMetaDescription?.trim() ||
          'Inspect pixel-level Before & After clipping paths, 3D ghost mannequins, fine jewelry retouching, and 4K video showreels. Upload your batch today.';
        canonicalUrl = `${baseOrigin}#portfolio`;
        break;
      }
      case 'free_trial_page': {
        pageTitle =
          siteConfig.pageSeo?.free_trial_page?.seoTitle?.trim() ||
          'Free 5-Image Photo Editing Trial – FixPhoto Studio';
        metaDescription =
          siteConfig.pageSeo?.free_trial_page?.seoMetaDescription?.trim() ||
          'Test FixPhoto Studio free of charge. Upload up to 5 RAW or studio frames and receive retouched masters in 12–24 hours with no credit card required.';
        canonicalUrl = `${baseOrigin}#free-trial`;
        break;
      }
      case 'get_quote_page': {
        pageTitle =
          siteConfig.pageSeo?.get_quote_page?.seoTitle?.trim() ||
          'Instant Volume Quote Calculator – FixPhoto Studio';
        metaDescription =
          siteConfig.pageSeo?.get_quote_page?.seoMetaDescription?.trim() ||
          'Calculate custom bulk pricing for commercial photo editing and 4K video post-production with up to 25% volume discounts and guaranteed SLA delivery.';
        canonicalUrl = `${baseOrigin}#get-quote`;
        break;
      }
      case 'reviews_page': {
        pageTitle =
          siteConfig.pageSeo?.reviews_page?.seoTitle?.trim() ||
          'Verified Client Reviews & Outcomes – FixPhoto Studio';
        metaDescription =
          siteConfig.pageSeo?.reviews_page?.seoMetaDescription?.trim() ||
          'Read verified studio reviews and commercial e-commerce production outcomes from global retail brands, jewelry houses, and apparel photographers.';
        canonicalUrl = `${baseOrigin}#reviews`;
        break;
      }
      case 'blogs_page': {
        pageTitle =
          siteConfig.pageSeo?.blogs_page?.seoTitle?.trim() ||
          'Commercial Photo & Video Editing Blog – FixPhoto Studio';
        metaDescription =
          siteConfig.pageSeo?.blogs_page?.seoMetaDescription?.trim() ||
          'Read technical guides on Bezier clipping paths, 3D ghost mannequins, fine jewelry retouching, Flambient HDR, and 4K video post-production.';
        canonicalUrl = `${baseOrigin}#blogs`;
        break;
      }
      case 'blog_detail_page': {
        if (activeBlogObj) {
          pageTitle =
            activeBlogObj.seoTitle?.trim() ||
            `${activeBlogObj.title} | FixPhoto Studio Blog`;
          metaDescription =
            activeBlogObj.seoMetaDescription?.trim() || activeBlogObj.excerpt;
          canonicalUrl = `${baseOrigin}#blogs/${activeBlogObj.slug}`;
        }
        break;
      }
      case 'portal': {
        pageTitle =
          siteConfig.pageSeo?.portal?.seoTitle?.trim() ||
          'Client Portal & Live Batch Tracker – FixPhoto Studio';
        metaDescription =
          siteConfig.pageSeo?.portal?.seoMetaDescription?.trim() ||
          'Manage active photo and video retouching orders, track 6-stage QA progress in real time, and download official PDF invoices.';
        canonicalUrl = `${baseOrigin}#client-portal`;
        break;
      }
      case 'admin_login': {
        pageTitle = 'Agency Master CMS & Admin Console – FixPhoto Studio';
        metaDescription =
          'Authorized FixPhoto Studio agency administration console for managing services, Before/After portfolio items, showreels, reviews, blogs, and live orders.';
        canonicalUrl = `${baseOrigin}#admin-login`;
        break;
      }
    }

    document.title = pageTitle;

    const upsertMeta = (
      attrName: 'name' | 'property',
      attrValue: string,
      content: string
    ) => {
      let tag = document.head.querySelector<HTMLMetaElement>(
        `meta[${attrName}="${attrValue}"]`
      );
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attrName, attrValue);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    upsertMeta('name', 'description', metaDescription);
    upsertMeta(
      'name',
      'robots',
      activePage === 'admin_login'
        ? 'noindex, nofollow'
        : 'index, follow, max-image-preview:large, max-snippet:-1'
    );
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:site_name', 'FixPhoto Studio');
    upsertMeta('property', 'og:title', pageTitle);
    upsertMeta('property', 'og:description', metaDescription);
    upsertMeta('property', 'og:url', canonicalUrl);
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', pageTitle);
    upsertMeta('name', 'twitter:description', metaDescription);

    let canonicalLink = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]'
    );
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // Update Schema.org JSON-LD Structured Data
    let jsonLdScript = document.head.querySelector<HTMLScriptElement>(
      'script#dynamic-jsonld'
    );
    if (!jsonLdScript) {
      jsonLdScript = document.createElement('script');
      jsonLdScript.id = 'dynamic-jsonld';
      jsonLdScript.type = 'application/ld+json';
      document.head.appendChild(jsonLdScript);
    }

    if (activePage === 'service_detail') {
      const graphEntities: Record<string, unknown>[] = [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: baseOrigin,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Services',
              item: `${baseOrigin}#services`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: activeServiceObj.shortNavTitle,
              item: canonicalUrl,
            },
          ],
        },
        {
          '@type': 'Service',
          name: activeServiceObj.seoTitle?.trim() || activeServiceObj.title,
          serviceType: activeServiceObj.shortNavTitle,
          provider: {
            '@type': 'ProfessionalService',
            name: 'FixPhoto Studio',
            url: baseOrigin,
          },
          description:
            activeServiceObj.seoMetaDescription?.trim() ||
            activeServiceObj.summary,
          offers: {
            '@type': 'Offer',
            price: activeServiceObj.ratePerImage.toFixed(2),
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
          },
        },
      ];

      if (activeServiceObj.faqs && activeServiceObj.faqs.length > 0) {
        graphEntities.push({
          '@type': 'FAQPage',
          mainEntity: activeServiceObj.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        });
      }

      if (
        activeServiceObj.slug === 'clipping-path-service' ||
        activeServiceObj.id === 'clipping_path'
      ) {
        const howToSteps =
          activeServiceObj.workflowHighlights &&
          activeServiceObj.workflowHighlights.length > 0
            ? activeServiceObj.workflowHighlights.map((item, idx) => ({
                '@type': 'HowToStep',
                position: idx + 1,
                name: item.title,
                text: item.detail,
                url: `${canonicalUrl}#step-${idx + 1}`,
              }))
            : [
                {
                  '@type': 'HowToStep',
                  position: 1,
                  name: 'Upload RAW or High-Resolution Studio Files',
                  text: 'Submit your product photographs via our encrypted client portal along with background and margin specifications.',
                  url: `${canonicalUrl}#step-1`,
                },
                {
                  '@type': 'HowToStep',
                  position: 2,
                  name: '300%-400% Zoom Manual Pen-Tool Vector Tracing',
                  text: 'Senior vector specialists draw point-by-point Bezier curves with 0.25px choke feathering to eliminate edge halos.',
                  url: `${canonicalUrl}#step-2`,
                },
                {
                  '@type': 'HowToStep',
                  position: 3,
                  name: 'Multi-Path Layer Isolation & Dual-Stage QA',
                  text: 'Separate vector paths are created for outer silhouettes, inner cutouts, and independent color-grade zones, followed by a 400% zoom inspection.',
                  url: `${canonicalUrl}#step-3`,
                },
                {
                  '@type': 'HowToStep',
                  position: 4,
                  name: 'Marketplace-Ready Delivery (12–24h SLA)',
                  text: 'Download production-ready TIFF, PSD, PNG, or pure-white (#FFFFFF) JPG files with embedded working paths.',
                  url: `${canonicalUrl}#step-4`,
                },
              ];

        graphEntities.push({
          '@type': 'HowTo',
          name: `How Our Hand-Drawn ${activeServiceObj.shortNavTitle} Workflow Works`,
          description:
            activeServiceObj.seoMetaDescription?.trim() ||
            activeServiceObj.summary,
          totalTime: 'PT12H',
          estimatedCost: {
            '@type': 'MonetaryAmount',
            currency: 'USD',
            value: activeServiceObj.ratePerImage.toFixed(2),
          },
          supply: [
            {
              '@type': 'HowToSupply',
              name: 'High-Resolution RAW, PSD, TIFF, or JPG Product Images',
            },
            {
              '@type': 'HowToSupply',
              name: 'Marketplace Margin & Background Specifications (#FFFFFF or Transparent)',
            },
          ],
          tool: [
            {
              '@type': 'HowToTool',
              name: 'Adobe Photoshop CC Manual Pen Tool (Bezier Vector Paths)',
            },
            {
              '@type': 'HowToTool',
              name: '300%–400% Pixel-Level Quality Assurance Inspection Loupe',
            },
          ],
          step: howToSteps,
        });
      }

      jsonLdScript.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': graphEntities,
      });
    } else if (activePage === 'blog_detail_page' && activeBlogObj) {
      jsonLdScript.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: pageTitle,
        description: metaDescription,
        articleSection: activeBlogObj.category,
        datePublished: activeBlogObj.publishedAt,
        author: {
          '@type': 'Person',
          name: activeBlogObj.authorName,
          jobTitle: activeBlogObj.authorRole,
        },
        publisher: {
          '@type': 'Organization',
          name: 'FixPhoto Studio',
          url: baseOrigin,
        },
      });
    } else {
      jsonLdScript.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        name: 'FixPhoto Studio',
        url: canonicalUrl,
        description: metaDescription,
        priceRange: '$0.35 - $65.00',
        email: siteConfig.supportEmail,
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: String(Math.max(480, customerReviews.length * 80)),
        },
      });
    }
  }, [
    activePage,
    activeServiceObj,
    activeBlogObj,
    servicesList.length,
    siteConfig.supportEmail,
    siteConfig.pageSeo,
    customerReviews.length,
  ]);

  const heroServiceObj =
    servicesList.find((s) => s.slug === heroShowcaseSlug) || servicesList[0];

  const homeFilteredServices = servicesList.filter(
    (s) => s.division === homeDivisionTab
  );

  const visiblePortfolio =
    portfolioFilter === 'all'
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === portfolioFilter);

  const visibleVideoPortfolio =
    videoPortfolioFilter === 'all'
      ? videoShowreelProjects
      : videoShowreelProjects.filter(
          (item) => item.category === videoPortfolioFilter
        );

  // Strict Per-User Isolation for Client Portal (New users see 0 orders / 0 notifications)
  const clientPortalOrders = firebaseUser
    ? orders.filter((o) => o.clientId === firebaseUser.uid)
    : activeClientId
    ? orders.filter((o) => o.clientId === activeClientId)
    : [];

  const clientPortalNotifications = firebaseUser
    ? notifications.filter((n) => n.userId === firebaseUser.uid)
    : activeClientId
    ? notifications.filter((n) => n.userId === activeClientId)
    : [];

  const clientPortalUsedCredits = clientPortalOrders.reduce(
    (sum, o) => sum + (o.imageCount || 0),
    0
  );

  const clientPortalProfile: UserProfileDoc = {
    ...userProfile,
    uid: activeClientId,
    displayName: activeClientDisplayName,
    usedCredits: firebaseUser
      ? userProfile.usedCredits
      : clientPortalUsedCredits,
  };

  const effectiveSelectedOrderId =
    clientPortalOrders.some((o) => o.id === selectedOrderId)
      ? selectedOrderId
      : clientPortalOrders[0]?.id || '';

  const currentOrderMessages = firebaseUser
    ? liveMessages
    : effectiveSelectedOrderId
    ? sandboxMessagesMap[effectiveSelectedOrderId] || []
    : [];

  const videoDivisionServices = servicesList.filter(
    (s) => s.division === 'video_editing'
  );

  // Standalone Full-Screen Admin Application (Dedicated Login Page + Separate Admin Dashboard Page)
  if (activePage === 'admin_login') {
    return (
      <AdminCmsPanel
        isAuthenticatedGoogleAdmin={Boolean(
          firebaseUser?.email === 'asiaclipp@gmail.com'
        )}
        googleEmail={firebaseUser?.email || null}
        onSignInGoogle={handleGoogleSignIn}
        siteConfig={siteConfig}
        onUpdateSiteConfig={setSiteConfig}
        mainMenuServices={mainMenuServices}
        onUpdateMainMenuServices={setMainMenuServices}
        servicesList={servicesList}
        onUpdateServicesList={setServicesList}
        portfolioItems={portfolioItems}
        onUpdatePortfolioItems={setPortfolioItems}
        videoShowreelProjects={videoShowreelProjects}
        onUpdateVideoShowreelProjects={setVideoShowreelProjects}
        customerReviews={customerReviews}
        onUpdateCustomerReviews={setCustomerReviews}
        blogPosts={blogPosts}
        onUpdateBlogPosts={setBlogPosts}
        subscriptionPlans={subscriptionPlans}
        onUpdateSubscriptionPlans={setSubscriptionPlans}
        orders={orders}
        notifications={notifications}
        orderApprovalMap={orderApprovalMap}
        onApproveOrder={handleApproveOrder}
        onSetOrderStage={handleSetOrderStage}
        onAdvanceOrderStage={handleAdvanceOrderStage}
        onDeleteOrder={handleDeleteOrder}
        onUpdateOrderInvoiceDetails={handleUpdateOrderInvoiceDetails}
        messagesByOrderId={sandboxMessagesMap}
        onSendOrderMessage={(ord, body, attachment) =>
          handleSendMessage(ord, body, attachment, 'specialist')
        }
        invoicePaymentInfo={invoicePaymentInfo}
        onUpdateInvoicePaymentInfo={setInvoicePaymentInfo}
        invoiceStatusMap={invoiceStatusMap}
        onUpdateInvoiceStatus={handleUpdateInvoiceStatus}
        clientQueries={clientQueries}
        onUpdateClientQueries={setClientQueries}
        onResetAllToDefaults={handleResetAllCmsToDefaults}
        onExitAdminToLiveSite={() => {
          try {
            window.history.replaceState(null, '', window.location.pathname);
          } catch {
            // ignore
          }
          setActivePage('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onPreviewServicePage={(slug) => {
          try {
            window.history.replaceState(null, '', window.location.pathname);
          } catch {
            // ignore
          }
          navigateToServicePage(slug);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F9FD] text-[#0B1933]">
      {/* =====================================================================
          STRICT 3-ZONE TOP BAR CONTRACT (MATCHED TO FIX PHOTO STUDIO LOGO)
          Zone 1: Official FIX Photo Studio Logo (Full with Tagline)
          Zone 2: Photo Editing | Video Editing | Portfolio | Free Trial | Get a Quote
          Zone 3: Client Portal Head Icon + Primary CTA
         ===================================================================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-[#DCE6F2]">
        <div className="max-w-[1360px] mx-auto flex items-center justify-between gap-6 px-6 py-3">
          {/* Zone 1: Official FIX Photo Studio Brand Mark (Full Logo with Tagline) */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActivePage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="whitespace-nowrap shrink-0 focus:outline-none"
          >
            <FixPhotoBrandLogo size="sm" showTagline={true} />
          </a>

          {/* Zone 2: 5 Multi-Page Navigation Links (No Reviews or Admin in Main Menu) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-[#001E5A]/80">
            {/* 1. Photo Editing Mega-Menu (6 Main Services + Link to Services Directory Page) */}
            <div
              className="relative"
              onMouseEnter={() => setPhotoMenuOpen(true)}
              onMouseLeave={() => setPhotoMenuOpen(false)}
            >
              <button
                type="button"
                onClick={() => setPhotoMenuOpen((prev) => !prev)}
                className={`flex items-center gap-1 py-2 hover:text-[#0088FF] transition-colors whitespace-nowrap shrink-0 ${
                  activePage === 'services_page' ||
                  (activePage === 'service_detail' &&
                    activeServiceObj.division === 'photo_editing')
                    ? 'text-[#0088FF] underline underline-offset-4'
                    : ''
                }`}
              >
                <span>Photo Editing</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    photoMenuOpen ? 'rotate-180 text-[#0088FF]' : ''
                  }`}
                />
              </button>

              {photoMenuOpen && (
                <div className="absolute left-0 top-full pt-2 w-[640px] z-50">
                  <div className="bg-white border border-[#B8D0EB] rounded-2xl shadow-xl overflow-hidden">
                    <div className="px-5 py-3 bg-[#001E5A] text-white flex items-center justify-between text-xs">
                      <span className="font-mono-tabular font-semibold text-[#00B8FF]">
                        MAIN PHOTO EDITING SERVICES (6 CORE PODS)
                      </span>
                      <span className="font-mono-tabular text-blue-200">
                        12h – 24h SLA · 99.94% QA
                      </span>
                    </div>

                    <div className="p-4 grid grid-cols-2 gap-2.5">
                      {mainMenuServices.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setPhotoMenuOpen(false);
                            navigateToServicePage(item.targetSlug);
                          }}
                          className="p-3.5 rounded-xl border border-[#DCE6F2] hover:border-[#0088FF] hover:bg-[#F5F9FD] text-left transition-colors group flex items-start justify-between gap-3"
                        >
                          <div>
                            <p className="text-sm font-bold text-[#001E5A] group-hover:text-[#0088FF] transition-colors">
                              {item.title}
                            </p>
                            <p className="text-xs text-slate-600 mt-0.5">
                              {item.subtitle}
                            </p>
                            <p className="text-[11px] font-mono-tabular text-[#0088FF] font-semibold mt-1.5">
                              From {item.startingRate} · {item.turnaround}
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#0088FF] shrink-0 mt-0.5" />
                        </button>
                      ))}
                    </div>

                    <div className="px-5 py-3 bg-[#F5F9FD] border-t border-[#DCE6F2] flex items-center justify-between text-xs">
                      <div className="flex flex-wrap items-center gap-2 text-slate-600">
                        <span className="font-semibold text-[#001E5A]">
                          More Specialties:
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setPhotoMenuOpen(false);
                            navigateToServicePage('wedding-photo-editing-services');
                          }}
                          className="hover:text-[#0088FF] underline"
                        >
                          Wedding Photo
                        </button>
                        <span>·</span>
                        <button
                          type="button"
                          onClick={() => {
                            setPhotoMenuOpen(false);
                            navigateToServicePage('fashion-photo-editing-service');
                          }}
                          className="hover:text-[#0088FF] underline"
                        >
                          Fashion Editing
                        </button>
                        <span>·</span>
                        <button
                          type="button"
                          onClick={() => {
                            setPhotoMenuOpen(false);
                            navigateToServicePage('color-correction-services');
                          }}
                          className="hover:text-[#0088FF] underline"
                        >
                          Color Correction
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setPhotoMenuOpen(false);
                          setActivePage('services_page');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#001E5A] hover:bg-[#0088FF] text-white font-bold transition-colors whitespace-nowrap shrink-0"
                      >
                        All Services Directory ({servicesList.length}) →
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Video Editing Sub-Menu (V1 - V4 Dedicated Pages + Video Studio Showreel Hub) */}
            <div
              className="relative"
              onMouseEnter={() => setVideoMenuOpen(true)}
              onMouseLeave={() => setVideoMenuOpen(false)}
            >
              <button
                type="button"
                onClick={() => setVideoMenuOpen((prev) => !prev)}
                className={`flex items-center gap-1 py-2 hover:text-[#0088FF] transition-colors whitespace-nowrap shrink-0 ${
                  activePage === 'video_editing_page' ||
                  (activePage === 'service_detail' &&
                    activeServiceObj.division === 'video_editing')
                    ? 'text-[#0088FF] underline underline-offset-4'
                    : ''
                }`}
              >
                <span>Video Editing</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    videoMenuOpen ? 'rotate-180 text-[#0088FF]' : ''
                  }`}
                />
              </button>

              {videoMenuOpen && (
                <div className="absolute left-0 top-full pt-2 w-[380px] z-50">
                  <div className="bg-white border border-[#B8D0EB] rounded-2xl shadow-xl overflow-hidden">
                    <div className="px-4 py-2.5 bg-[#001E5A] text-white flex items-center justify-between text-xs">
                      <span className="font-mono-tabular font-semibold text-[#00B8FF]">
                        VIDEO POST-PRODUCTION PODS
                      </span>
                      <span className="font-mono-tabular text-blue-200">
                        4K 60fps · Rec.709
                      </span>
                    </div>

                    <div className="p-3 space-y-2">
                      {videoDivisionServices.map((vService) => (
                        <button
                          key={vService.slug}
                          type="button"
                          onClick={() => {
                            setVideoMenuOpen(false);
                            navigateToServicePage(vService.slug);
                          }}
                          className="w-full p-3 rounded-xl border border-[#DCE6F2] hover:border-[#0088FF] hover:bg-[#F5F9FD] text-left transition-colors group flex items-start justify-between gap-3"
                        >
                          <div>
                            <p className="text-xs font-mono-tabular font-bold text-[#0088FF]">
                              {vService.indexNumber} · {vService.turnaroundLabel.split('·')[0]}
                            </p>
                            <p className="text-sm font-bold text-[#001E5A] group-hover:text-[#0088FF] transition-colors mt-0.5">
                              {vService.shortNavTitle}
                            </p>
                            <p className="text-[11px] font-mono-tabular text-slate-500 mt-1">
                              From ${vService.ratePerImage.toFixed(2)} / {vService.unitLabel}
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#0088FF] shrink-0 mt-1" />
                        </button>
                      ))}
                    </div>

                    <div className="px-4 py-3 bg-[#F5F9FD] border-t border-[#DCE6F2] flex items-center justify-between text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setVideoMenuOpen(false);
                          setActivePage('video_editing_page');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-full py-2 px-3 bg-[#001E5A] hover:bg-[#0088FF] text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Film className="w-3.5 h-3.5 text-[#00B8FF]" />
                        <span>Open Video Editing Studio & NLE Showreel →</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Portfolio Page */}
            <button
              type="button"
              onClick={() => {
                setActivePage('portfolio_page');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`hover:text-[#0088FF] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
                activePage === 'portfolio_page' ? 'text-[#0088FF] underline' : ''
              }`}
            >
              Portfolio
            </button>

            {/* 4. Free Trial Standalone Page (/free-trial/) */}
            <button
              type="button"
              onClick={() => {
                setActivePage('free_trial_page');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`hover:text-[#0088FF] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
                activePage === 'free_trial_page' ? 'text-[#0088FF] underline' : ''
              }`}
            >
              Free Trial
            </button>

            {/* 5. Get a Quote Standalone Page (/get-quote/) */}
            <button
              type="button"
              onClick={() => {
                setActivePage('get_quote_page');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`hover:text-[#0088FF] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
                activePage === 'get_quote_page' ? 'text-[#0088FF] underline' : ''
              }`}
            >
              Get a Quote
            </button>
          </nav>

          {/* Zone 3: Client Portal Head Icon */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                setActivePage('portal');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              title="Client Portal & Live Orders"
              aria-label="Open Client Portal"
              className={`relative px-3 py-2 rounded-xl border transition-colors flex items-center gap-1.5 ${
                activePage === 'portal'
                  ? 'bg-[#001E5A] text-white border-[#001E5A]'
                  : 'bg-[#F5F9FD] hover:bg-[#EAF3FC] text-[#001E5A] border-[#DCE6F2]'
              }`}
            >
              <UserCircle className="w-5 h-5 text-[#0088FF]" />
              <span className="text-xs font-semibold max-w-[150px] truncate">
                {firebaseUser?.displayName ||
                  portalClientName ||
                  (firebaseUser?.email
                    ? firebaseUser.email.split('@')[0]
                    : 'Portal')}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================================
          MULTI-PAGE ROUTER
         ===================================================================== */}
      {activePage === 'services_page' ? (
        <main className="flex-1">
          <AllServicesPage
            allServices={servicesList}
            mainMenuPhotoServices={mainMenuServices}
            onSelectServicePage={(slug) => navigateToServicePage(slug)}
            onOrderService={(cat) => handleOpenOrderWithService(cat)}
            onOpenFreeTrial={() => {
              setActivePage('free_trial_page');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenGetQuote={() => {
              setActivePage('get_quote_page');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenVideoStudioHub={() => {
              setActivePage('video_editing_page');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenPortfolioPage={() => {
              setActivePage('portfolio_page');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenReviewsPage={() => {
              setActivePage('reviews_page');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenClientPortal={() => {
              setActivePage('portal');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenNewOrderModal={() => setNewOrderModalOpen(true)}
            onBackToHome={() => {
              setActivePage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </main>
      ) : activePage === 'free_trial_page' ? (
        <main className="flex-1">
          <FreeTrialPage
            mode="page"
            isOpen={true}
            onClose={() => {
              setActivePage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            services={servicesList}
            isAuthenticatedClient={isClientAuthenticated}
            clientProfileData={activeClientProfileData}
            onSubmitPublicQuery={async (q) => {
              const created = await handleSubmitPublicQuery({
                source: 'free_trial_popup',
                ...q,
              });
              return { queryNumber: created.queryNumber };
            }}
            onSubmitTrialOrder={async (payload) => {
              await handleCreateOrder(payload, {
                redirectToPortal: isClientAuthenticated,
              });
            }}
            onExploreService={(slug) => navigateToServicePage(slug)}
          />
        </main>
      ) : activePage === 'get_quote_page' ? (
        <main className="flex-1">
          <GetQuotePage
            mode="page"
            isOpen={true}
            onClose={() => {
              setActivePage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            services={servicesList}
            isAuthenticatedClient={isClientAuthenticated}
            clientProfileData={activeClientProfileData}
            onSubmitPublicQuery={async (q) => {
              const created = await handleSubmitPublicQuery({
                source: 'custom_quote_popup',
                ...q,
              });
              return { queryNumber: created.queryNumber };
            }}
            onSubmitQuoteOrder={async (payload) => {
              await handleCreateOrder(payload, {
                redirectToPortal: isClientAuthenticated,
              });
            }}
            onOpenFreeTrial={() => {
              setActivePage('free_trial_page');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </main>
      ) : activePage === 'portal' ? (
        <main className="flex-1">
          <ClientPortalView
            isAuthenticated={Boolean(firebaseUser)}
            isSigningIn={isSigningIn}
            userEmail={firebaseUser?.email || portalClientEmail || null}
            userProfile={clientPortalProfile}
            mfaSessionVerified={mfaSessionVerified}
            orders={clientPortalOrders}
            selectedOrderId={effectiveSelectedOrderId}
            onSelectOrder={setSelectedOrderId}
            messages={currentOrderMessages}
            notifications={clientPortalNotifications}
            orderApprovalMap={orderApprovalMap}
            invoicePaymentInfo={invoicePaymentInfo}
            invoiceStatusMap={invoiceStatusMap}
            onSignInGoogle={handleGoogleSignIn}
            onSignOut={handleSignOut}
            onOpenNewOrder={() => setNewOrderModalOpen(true)}
            onOpenMfaModal={() => setMfaModalOpen(true)}
            onAdvanceOrderStage={handleAdvanceOrderStage}
            onCompleteOrderByClient={handleCompleteOrderByClient}
            onSendMessage={handleSendMessage}
            onMarkNotificationRead={handleMarkNotificationRead}
            onChangeSubscriptionPlan={handleChangeSubscriptionPlan}
            onClientPortalSessionChange={(session) => {
              setPortalClientName(session ? session.name : null);
              setPortalClientEmail(
                session ? session.email.trim().toLowerCase() : null
              );
              setPortalClientPhone(session?.phone || '');
              setPortalClientCompany(session?.companyName || '');
              setPortalClientAddress(session?.billingAddress || '');
              setPortalClientWebsite(session?.website || '');
            }}
            onUpdateClientProfile={handleUpdateClientProfile}
            onSubmitInvoicePaymentProof={handleSubmitInvoicePaymentProof}
            onOpenAdminDashboard={() => {
              setActivePage('admin_login');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </main>
      ) : activePage === 'video_editing_page' ? (
        <main className="flex-1">
          <VideoEditingStudioPage
            videoServices={videoDivisionServices}
            showreelProjects={videoShowreelProjects}
            onOpenServiceDetail={(slug) => navigateToServicePage(slug)}
            onOrderVideoService={(cat) => handleOpenOrderWithService(cat)}
            onBackToHome={() => {
              setActivePage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </main>
      ) : activePage === 'service_detail' ? (
        <main className="flex-1">
          <ServiceDetailPage
            allServices={servicesList}
            activeService={activeServiceObj}
            reviews={customerReviews}
            onSelectService={(slug) => {
              setActiveServiceSlug(slug);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBackToHome={() => {
              setActivePage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOrderService={(cat) => handleOpenOrderWithService(cat)}
            onOpenAllServicesPage={() => {
              setActivePage('services_page');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenFreeTrial={() => setFreeTrialModalOpen(true)}
            onOpenGetQuote={() => setGetQuoteModalOpen(true)}
            onOpenAdminEditor={() => {
              setActivePage('admin_login');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </main>
      ) : activePage === 'reviews_page' ? (
        <main className="flex-1">
          <div className="bg-[#001E5A] text-white py-12 border-b border-[#00338D]">
            <div className="max-w-[1360px] mx-auto px-6 flex flex-wrap items-center justify-between gap-6">
              <div>
                <p className="text-xs font-mono-tabular text-[#00B8FF]">
                  DEDICATED CLIENT REVIEWS & CASE STUDY WALL
                </p>
                <h1 className="text-3xl font-bold mt-1">
                  Verified Studio Reviews & Production Outcomes
                </h1>
              </div>
              <button
                type="button"
                onClick={() => setActivePage('home')}
                className="px-4 py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                ← Back to Home Page
              </button>
            </div>
          </div>

          <CustomerReviewsSection
            reviews={customerReviews}
            onExploreServicePage={navigateToServiceByCategory}
          />
        </main>
      ) : activePage === 'blogs_page' || activePage === 'blog_detail_page' ? (
        <main className="flex-1">
          <StudioBlogsPage
            mode={activePage === 'blog_detail_page' ? 'single_blog' : 'all_blogs'}
            blogPosts={blogPosts}
            activeBlogSlug={activeBlogSlug}
            servicesList={servicesList}
            onSelectBlogSlug={navigateToSingleBlogPage}
            onOpenAllBlogs={navigateToAllBlogsPage}
            onBackToHome={() => {
              try {
                window.history.pushState(null, '', window.location.pathname);
              } catch {
                // ignore
              }
              setActivePage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onExploreServiceSlug={navigateToServicePage}
            onOpenFreeTrial={() => setFreeTrialModalOpen(true)}
            onOpenGetQuote={() => setGetQuoteModalOpen(true)}
          />
        </main>
      ) : activePage === 'portfolio_page' ? (
        <main className="flex-1">
          <div className="bg-[#001E5A] text-white py-12 border-b border-[#00338D]">
            <div className="max-w-[1360px] mx-auto px-6 flex flex-wrap items-center justify-between gap-6">
              <div>
                <p className="text-xs font-mono-tabular text-[#00B8FF]">
                  PHOTO EDITING & 4K VIDEO POST-PRODUCTION MASTER ARCHIVE
                </p>
                <h1 className="text-3xl font-bold mt-1">
                  Interactive Photo & Video Studio Portfolio
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 p-1 bg-white/10 border border-white/20 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setPortfolioDivisionTab('photo_editing')}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
                      portfolioDivisionTab === 'photo_editing'
                        ? 'bg-[#0088FF] text-white shadow-xs'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Camera className="w-4 h-4" />
                    <span>01. Photo Editing Portfolio ({portfolioItems.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPortfolioDivisionTab('video_editing')}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
                      portfolioDivisionTab === 'video_editing'
                        ? 'bg-[#0088FF] text-white shadow-xs'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Film className="w-4 h-4" />
                    <span>02. Video Editing Portfolio ({videoShowreelProjects.length})</span>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setActivePage('home')}
                  className="px-4 py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  ← Back to Home Page
                </button>
              </div>
            </div>
          </div>

          <section className="py-12 max-w-[1360px] mx-auto px-6 space-y-8">
            {portfolioDivisionTab === 'photo_editing' ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-1 p-1.5 bg-[#EAF3FC] rounded-lg">
                    {[
                      { id: 'all', label: 'All Photo Works' },
                      { id: 'clipping_path', label: 'Clipping Path' },
                      { id: 'ghost_mannequin', label: 'Ghost Mannequin' },
                      { id: 'jewelry_retouch', label: 'Fine Jewelry' },
                      { id: 'ecommerce_shadow', label: 'Product & Shadow' },
                      { id: 'beauty_high_end', label: 'High-End Beauty' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() =>
                          setPortfolioFilter(tab.id as ServiceCategory | 'all')
                        }
                        className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                          portfolioFilter === tab.id
                            ? 'bg-[#001E5A] text-white shadow-xs'
                            : 'text-[#001E5A] hover:bg-white/70'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setNewOrderModalOpen(true)}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#0088FF] hover:bg-[#001E5A] rounded-lg transition-colors"
                  >
                    Upload Your Own Photo Batch
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {visiblePortfolio.map((item) => (
                    <div
                      key={item.id}
                      className={`${item.colSpanClass} bg-white border border-[#DCE6F2] rounded-2xl overflow-hidden flex flex-col justify-between`}
                    >
                      <BeforeAfterStudioCanvas
                        artworkType={item.artworkType}
                        beforeImageUrl={item.beforeImageUrl}
                        afterImageUrl={item.afterImageUrl}
                        initialSplit={50}
                        showVectorOverlay={false}
                        interactive={true}
                        className={item.aspectClass}
                      />
                      <div className="p-5 space-y-3">
                        <div className="flex items-center justify-between text-xs font-mono-tabular text-slate-500">
                          <span>
                            {item.categoryLabel} · {item.turnaround}
                          </span>
                          <span className="font-bold text-[#0088FF]">
                            {item.pricePerImage}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-[#001E5A]">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {item.afterNotes}
                        </p>
                        <div className="pt-3 border-t border-[#DCE6F2] flex items-center justify-between gap-3">
                          <button
                            type="button"
                            onClick={() => navigateToServiceByCategory(item.category)}
                            className="text-xs font-semibold text-[#0088FF] hover:underline"
                          >
                            Open Service Page →
                          </button>
                          <button
                            type="button"
                            onClick={() => setLightboxItem(item)}
                            className="px-3 py-1.5 text-xs font-semibold text-[#001E5A] bg-[#EAF3FC] hover:bg-[#001E5A] hover:text-white rounded-lg transition-colors flex items-center gap-1.5"
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                            <span>Inspect Fullscreen</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-1 p-1.5 bg-[#EAF3FC] rounded-lg">
                    {[
                      { id: 'all', label: 'All Video Works' },
                      { id: 'ecommerce_product', label: 'E-Commerce Product Video' },
                      { id: 'social_reels', label: 'Reels, TikTok & Shorts' },
                      { id: 'real_estate_drone', label: 'Real Estate & Drone' },
                      { id: 'wedding_cinema', label: 'Wedding Cinema' },
                      { id: 'color_vfx', label: 'Color Grading & Roto VFX' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() =>
                          setVideoPortfolioFilter(
                            tab.id as VideoShowreelProject['category'] | 'all'
                          )
                        }
                        className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                          videoPortfolioFilter === tab.id
                            ? 'bg-[#0088FF] text-white shadow-xs'
                            : 'text-[#001E5A] hover:bg-white/70'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setActivePage('video_editing_page');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#001E5A] hover:bg-[#0088FF] rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>Open Interactive NLE Video Studio →</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {visibleVideoPortfolio.map((vid) => (
                    <div
                      key={vid.id}
                      className="bg-white border border-[#DCE6F2] rounded-2xl overflow-hidden flex flex-col justify-between shadow-xs"
                    >
                      {/* Video / Thumbnail Preview Box */}
                      <div className="relative h-60 bg-gradient-to-br from-[#001238] via-[#001E5A] to-[#00338D] text-white overflow-hidden flex flex-col justify-between p-4">
                        {vid.videoPreviewUrl ? (
                          <video
                            src={vid.videoPreviewUrl}
                            controls
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : vid.thumbnailImageUrl ? (
                          <img
                            src={vid.thumbnailImageUrl}
                            alt={vid.title}
                            className="absolute inset-0 w-full h-full object-cover opacity-85"
                          />
                        ) : null}

                        <div className="relative z-10 flex items-center justify-between gap-2 text-[11px] font-mono-tabular">
                          <span className="px-2.5 py-1 rounded bg-black/50 backdrop-blur-xs text-[#00C8FF] font-semibold">
                            {vid.categoryLabel}
                          </span>
                          <span className="px-2.5 py-1 rounded bg-black/50 backdrop-blur-xs text-white">
                            {vid.duration}
                          </span>
                        </div>

                        {!vid.videoPreviewUrl && (
                          <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center px-3">
                            <div className="w-12 h-12 rounded-full bg-[#0088FF]/90 text-white flex items-center justify-center shadow-lg border border-white/30 mb-2">
                              <Film className="w-5 h-5" />
                            </div>
                            <p className="text-xs font-mono-tabular text-blue-100 font-semibold">
                              {vid.resolutionFps}
                            </p>
                            <p className="text-[11px] text-blue-200/90 mt-0.5">
                              {vid.lutProfile}
                            </p>
                          </div>
                        )}

                        <div className="relative z-10 flex items-center justify-between text-[11px] font-mono-tabular bg-black/45 backdrop-blur-xs px-3 py-1.5 rounded-lg">
                          <span className="text-emerald-300 font-semibold">
                            {vid.outcomeMetric}
                          </span>
                        </div>
                      </div>

                      {/* Card Details */}
                      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between text-xs font-mono-tabular text-slate-500">
                            <span>
                              {vid.clientBrand} · {vid.turnaround}
                            </span>
                            <span className="font-bold text-[#0088FF]">
                              {vid.priceLabel}
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-[#001E5A]">
                            {vid.title}
                          </h3>

                          <ul className="space-y-1 text-xs text-slate-600">
                            {vid.vfxHighlights.map((hl, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#0088FF] shrink-0 mt-0.5" />
                                <span>{hl}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-3 mt-3 border-t border-[#DCE6F2] flex items-center justify-between gap-3">
                          <button
                            type="button"
                            onClick={() => navigateToServicePage(vid.serviceSlug)}
                            className="text-xs font-semibold text-[#0088FF] hover:underline"
                          >
                            Open Video Service →
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setActivePage('video_editing_page');
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="px-3 py-1.5 text-xs font-semibold text-[#001E5A] bg-[#EAF3FC] hover:bg-[#001E5A] hover:text-white rounded-lg transition-colors"
                          >
                            Inspect in Video Studio
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>
        </main>
      ) : (
        /* =====================================================================
           HOME PAGE (COLORCLIPPING-INSPIRED HIGH-RETENTION STUDIO SHOWCASE)
           ===================================================================== */
        <main className="flex-1">
          {/* 1. SPLIT-SCREEN HERO WITH LIVE 6-SERVICE INTERACTIVE INSPECTOR */}
          <section id="top" className="max-w-[1360px] mx-auto px-6 pt-8 pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
              {/* Left 6 Columns: Headline & CTAs (No Duplicate Logo Above Headline) */}
              <div className="lg:col-span-6 flex flex-col justify-between py-2">
                <div className="space-y-5">
                  <p className="text-xs font-mono-tabular uppercase tracking-wider text-[#0088FF] font-semibold">
                    {siteConfig.heroEyebrow}
                  </p>

                  <h1
                    className="font-bold tracking-tight text-[#001E5A] leading-[1.08]"
                    style={{ fontSize: 'clamp(2.15rem, 3.6vw, 3.35rem)' }}
                  >
                    {siteConfig.heroHeadline}
                  </h1>

                  <RichContentRenderer
                    content={siteConfig.heroSubtitle}
                    className="text-base text-slate-600 leading-relaxed max-w-[62ch]"
                  />
                </div>

                <div className="pt-6 space-y-5">
                  <div className="flex flex-wrap items-center gap-3.5">
                    <button
                      type="button"
                      onClick={() => setNewOrderModalOpen(true)}
                      className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#001E5A] to-[#0088FF] hover:from-[#00143D] hover:to-[#006FE0] rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
                    >
                      <span>{siteConfig.primaryCtaLabel}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActivePage('services_page');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-5 py-3 text-sm font-semibold text-[#001E5A] bg-white hover:bg-[#EAF3FC] border border-[#B8D0EB] rounded-lg transition-colors whitespace-nowrap shrink-0"
                    >
                      All Services ({servicesList.length})
                    </button>

                    <button
                      type="button"
                      onClick={() => setFreeTrialModalOpen(true)}
                      className="px-4 py-3 text-sm font-semibold text-[#0088FF] hover:underline whitespace-nowrap shrink-0"
                    >
                      Free 5-Image Trial →
                    </button>
                  </div>

                  <div className="text-xs text-slate-600 font-mono-tabular">
                    <span>From $0.35 / image</span>
                    <span className="mx-2">·</span>
                    <span>Free 5-Image Quality Trial</span>
                    <span className="mx-2">·</span>
                    <span>Photo + Video Dedicated Service Pods</span>
                  </div>
                </div>
              </div>

              {/* Right 6 Columns: Interactive Category-Switching Before/After Studio Lab */}
              <div className="lg:col-span-6 flex flex-col bg-white border border-[#DCE6F2] rounded-2xl overflow-hidden shadow-xs">
                <div className="px-4 py-2.5 bg-[#001E5A] text-white flex items-center justify-between gap-2 overflow-x-auto">
                  <div className="flex items-center gap-1">
                    {[
                      { slug: 'clipping-path-service', label: 'Clipping Path' },
                      { slug: 'real-estate-photo-editing', label: 'Real Estate HDR' },
                      { slug: 'ghost-mannequin-services', label: 'Ghost Mannequin' },
                      { slug: 'jewelry-retouching-services', label: 'Jewelry' },
                      { slug: 'product-photo-editing-services', label: 'E-Commerce' },
                      { slug: 'photo-retouching-services', label: 'Photo Retouching' },
                    ].map((tab) => (
                      <button
                        key={tab.slug}
                        type="button"
                        onClick={() => setHeroShowcaseSlug(tab.slug)}
                        className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 ${
                          heroShowcaseSlug === tab.slug
                            ? 'bg-[#0088FF] text-white'
                            : 'text-white/80 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <BeforeAfterStudioCanvas
                  artworkType={heroServiceObj.artworkType}
                  initialSplit={48}
                  showVectorOverlay={heroServiceObj.artworkType === 'watch'}
                  interactive={true}
                  className="flex-1 min-h-[360px] lg:h-full"
                />

                <div className="px-5 py-3.5 bg-white border-t border-[#DCE6F2] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-[#001E5A]">
                      {heroServiceObj.shortNavTitle}
                    </span>
                    <span className="mx-2 text-slate-400">·</span>
                    <span className="font-mono-tabular text-[#0088FF] font-semibold">
                      From ${heroServiceObj.ratePerImage.toFixed(2)} / {heroServiceObj.unitLabel}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigateToServicePage(heroServiceObj.slug)}
                    className="font-semibold text-[#0088FF] hover:text-[#001E5A] flex items-center gap-1 whitespace-nowrap shrink-0"
                  >
                    <span>Open {heroServiceObj.shortNavTitle} Page</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Full-Width 4-Column Quantitative Proof Row Below Hero Split */}
            <div className="mt-10 pt-8 border-t border-[#DCE6F2] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="text-2xl sm:text-3xl font-bold font-mono-tabular text-[#001E5A]">
                  {siteConfig.stat1Value}
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  {siteConfig.stat1Label}
                </p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold font-mono-tabular text-[#0088FF]">
                  {siteConfig.stat2Value}
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  {siteConfig.stat2Label}
                </p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold font-mono-tabular text-[#001E5A]">
                  {siteConfig.stat3Value}
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  {siteConfig.stat3Label}
                </p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold font-mono-tabular text-[#0088FF]">
                  {siteConfig.stat4Value}
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  {siteConfig.stat4Label}
                </p>
              </div>
            </div>
          </section>

          {/* 2. ALL SPECIALIZED SERVICE PAGES — PHOTO EDITING & VIDEO EDITING */}
          <section id="services" className="border-t border-[#DCE6F2] bg-white py-16">
            <div className="max-w-[1360px] mx-auto px-6 space-y-8">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div>
                  <p className="text-xs font-mono-tabular text-[#0088FF] font-semibold">
                    COMPLETE MULTI-PAGE SERVICE CATALOG
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#001E5A] mt-1">
                    All Specialized Service Pages — Photo Editing & Video Editing
                  </h2>
                  <p className="text-xs text-slate-600 mt-1 max-w-2xl">
                    Click any service below to open its full dedicated page with interactive Before/After samples, 3 complexity pricing tiers, marketplace specs, FAQs, and customer reviews.
                  </p>
                </div>

                {/* 2-Part Division Switcher */}
                <div className="flex flex-wrap items-center gap-2 self-start">
                  <div className="flex items-center gap-1.5 p-1.5 bg-[#EAF3FC] border border-[#DCE6F2] rounded-xl">
                    <button
                      type="button"
                      onClick={() => setHomeDivisionTab('photo_editing')}
                      className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
                        homeDivisionTab === 'photo_editing'
                          ? 'bg-[#001E5A] text-white shadow-xs'
                          : 'text-[#001E5A] hover:bg-white/70'
                      }`}
                    >
                      <Camera className="w-4 h-4" />
                      <span>
                        01. Photo Editing Services (
                        {servicesList.filter((s) => s.division === 'photo_editing').length})
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setHomeDivisionTab('video_editing')}
                      className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
                        homeDivisionTab === 'video_editing'
                          ? 'bg-[#0088FF] text-white shadow-xs'
                          : 'text-[#001E5A] hover:bg-white/70'
                      }`}
                    >
                      <Film className="w-4 h-4" />
                      <span>
                        02. Video Editing Services (
                        {servicesList.filter((s) => s.division === 'video_editing').length})
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Grid of Dedicated Service Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {homeFilteredServices.map((service) => (
                  <div
                    key={service.slug}
                    className="bg-[#F5F9FD] border border-[#DCE6F2] hover:border-[#0088FF] rounded-2xl overflow-hidden flex flex-col justify-between transition-colors"
                  >
                    <BeforeAfterStudioCanvas
                      artworkType={service.artworkType}
                      beforeImageUrl={service.beforeImageUrl}
                      afterImageUrl={service.afterImageUrl}
                      initialSplit={50}
                      showVectorOverlay={service.artworkType === 'watch'}
                      interactive={true}
                      className="h-48"
                    />

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-5">
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between text-xs font-mono-tabular">
                          <span className="font-bold text-[#0088FF] text-sm">
                            {service.indexNumber} {service.shortNavTitle}
                          </span>
                          <span className="text-slate-500">
                            {service.turnaroundLabel.split('·')[0]}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-[#001E5A] leading-snug">
                          {service.title}
                        </h3>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {service.summary}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-[#DCE6F2] space-y-3">
                        <div className="flex items-baseline justify-between">
                          <span className="text-xs text-slate-500">Starting Rate</span>
                          <span className="text-lg font-bold font-mono-tabular text-[#001E5A]">
                            ${service.ratePerImage.toFixed(2)}
                            <span className="text-xs font-normal text-slate-500">
                              {' '}
                              / {service.unitLabel}
                            </span>
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => navigateToServicePage(service.slug)}
                            className="py-2 px-3 text-xs font-semibold text-[#001E5A] bg-white hover:bg-[#001E5A] hover:text-white border border-[#B8D0EB] rounded-lg transition-colors flex items-center justify-center gap-1 whitespace-nowrap"
                          >
                            <span>View Service Page</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenOrderWithService(service.id)}
                            className="py-2 px-3 text-xs font-semibold text-white bg-[#0088FF] hover:bg-[#001E5A] rounded-lg transition-colors whitespace-nowrap"
                          >
                            Order Online
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 3. COLORCLIPPING-INSPIRED 4-STEP PORTAL WORKFLOW + FREE 5-IMAGE TRIAL */}
          <section className="border-t border-[#DCE6F2] bg-[#001E5A] text-white py-16">
            <div className="max-w-[1360px] mx-auto px-6 space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                {/* Left 7 Columns: 4-Step Visual Workflow */}
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <p className="text-xs font-mono-tabular text-[#00B8FF] font-semibold">
                      SEAMLESS CLOUD WORKFLOW · ZERO BOTTLENECKS
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-bold mt-1">
                      How FixPhoto Studio Delivers Your Retouched Batch in 4 Steps
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      {
                        step: 'STEP 01',
                        title: 'Select Service & Specify Rules',
                        desc: 'Choose from Photo or Video services, set output format (PSD, TIFF, PNG, JPG), and lock your turnaround SLA.',
                      },
                      {
                        step: 'STEP 02',
                        title: 'Automated RAW Batch Upload',
                        desc: 'Drag-and-drop RAW (.CR3, .NEF, .RAF), PSD, or video files via our encrypted portal or direct SFTP sync.',
                      },
                      {
                        step: 'STEP 03',
                        title: 'Hand Execution + 400% QA Audit',
                        desc: '120+ senior specialists craft every Bezier path and layer mask, followed by independent dual-stage QA.',
                      },
                      {
                        step: 'STEP 04',
                        title: 'Instant Download & CSV Receipt',
                        desc: 'Receive real-time status alerts, download your master archive, and export accounting CSV invoices.',
                      },
                    ].map((item) => (
                      <div
                        key={item.step}
                        className="p-5 rounded-xl bg-white/5 border border-white/15 space-y-2"
                      >
                        <p className="text-xs font-mono-tabular font-bold text-[#00B8FF]">
                          {item.step}
                        </p>
                        <h3 className="text-base font-bold text-white">{item.title}</h3>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right 5 Columns: ColorClipping-Style "Try 5 Images / 1 Clip Free" Instant Widget */}
                <div className="lg:col-span-5 bg-white text-[#0B1933] rounded-2xl p-6 md:p-7 border border-[#DCE6F2] space-y-4">
                  <div className="pb-3 border-b border-[#DCE6F2] flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-mono-tabular text-[#0088FF] font-bold">
                        TRY BEFORE YOU PAY · NO CREDIT CARD REQUIRED
                      </p>
                      <h3 className="text-xl font-bold text-[#001E5A] mt-1">
                        Claim Your Free 5-Image / 1-Clip Studio Trial
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFreeTrialModalOpen(true)}
                      className="text-xs font-bold text-[#0088FF] hover:underline shrink-0"
                    >
                      Open Trial Popup →
                    </button>
                  </div>

                  {/* Division Tabs: Photo Editing vs Video Editing */}
                  <div className="flex items-center gap-1.5 p-1 bg-[#EAF3FC] border border-[#DCE6F2] rounded-xl">
                    <button
                      type="button"
                      onClick={() => {
                        setTrialDivision('photo_editing');
                        setTrialServiceSlug('clipping-path-service');
                      }}
                      className={`flex-1 py-1.5 px-2.5 text-[11px] font-bold rounded-lg transition-colors ${
                        trialDivision === 'photo_editing'
                          ? 'bg-[#001E5A] text-white'
                          : 'text-[#001E5A] hover:bg-white/70'
                      }`}
                    >
                      01. Photo Editing Trial (Up to 5 RAWs)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTrialDivision('video_editing');
                        setTrialServiceSlug('commercial-product-video-editing');
                      }}
                      className={`flex-1 py-1.5 px-2.5 text-[11px] font-bold rounded-lg transition-colors ${
                        trialDivision === 'video_editing'
                          ? 'bg-[#0088FF] text-white'
                          : 'text-[#001E5A] hover:bg-white/70'
                      }`}
                    >
                      02. Video Editing Trial (1 Sample Clip)
                    </button>
                  </div>

                  <form onSubmit={handleFreeTrialSubmit} className="space-y-3.5">
                    {isClientAuthenticated ? (
                      <div className="p-3 rounded-xl bg-[#EAF3FC] border border-[#B8D0EB] flex items-center justify-between gap-2 text-xs">
                        <div>
                          <p className="text-[10px] font-mono-tabular font-bold text-[#0088FF] uppercase">
                            AUTO-FILLED FROM YOUR PROFILE
                          </p>
                          <p className="font-bold text-[#001E5A] mt-0.5">
                            {activeClientProfileData.name}{' '}
                            {activeClientProfileData.companyName
                              ? `(${activeClientProfileData.companyName})`
                              : ''}
                          </p>
                          <p className="text-[11px] font-mono-tabular text-slate-600">
                            {activeClientProfileData.email}
                            {activeClientProfileData.phone
                              ? ` · ${activeClientProfileData.phone}`
                              : ''}
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono-tabular text-[10px] font-bold shrink-0">
                          Signed In ✓
                        </span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                            Your Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={trialName}
                            onChange={(e) => setTrialName(e.target.value)}
                            placeholder="Alex Rivera"
                            className="w-full px-3 py-2 text-xs border border-[#B8D0EB] rounded-lg focus:outline-none focus:border-[#0088FF]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                            Studio Work Email *
                          </label>
                          <input
                            type="email"
                            required
                            value={trialEmail}
                            onChange={(e) => setTrialEmail(e.target.value)}
                            placeholder="alex@brandstudio.com"
                            className="w-full px-3 py-2 text-xs border border-[#B8D0EB] rounded-lg focus:outline-none focus:border-[#0088FF]"
                          />
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {!isClientAuthenticated && (
                        <div>
                          <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                            Phone / WhatsApp Number *
                          </label>
                          <input
                            type="tel"
                            required
                            value={trialPhone}
                            onChange={(e) => setTrialPhone(e.target.value)}
                            placeholder="+1 (212) 555-0194"
                            className="w-full px-3 py-2 text-xs border border-[#B8D0EB] rounded-lg focus:outline-none focus:border-[#0088FF]"
                          />
                        </div>
                      )}

                      <div className={isClientAuthenticated ? 'sm:col-span-2' : ''}>
                        <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                          Select Trial Service
                        </label>
                        <select
                          value={trialServiceSlug}
                          onChange={(e) => setTrialServiceSlug(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-[#B8D0EB] rounded-lg bg-white focus:outline-none focus:border-[#0088FF]"
                        >
                          {servicesList
                            .filter((s) => s.division === trialDivision)
                            .map((s) => (
                              <option key={s.slug} value={s.slug}>
                                {s.indexNumber} {s.shortNavTitle}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>

                    {/* Customer File Upload Queue (Starts Normal Blank) */}
                    <div className="p-3 rounded-xl bg-[#F5F9FD] border border-[#DCE6F2] space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <UploadCloud className="w-4 h-4 text-[#0088FF]" />
                          <span className="text-xs font-bold text-[#001E5A]">
                            {trialDivision === 'video_editing'
                              ? `Upload Sample Video Clip (${trialUploadedFiles.length}/5)`
                              : `Upload Sample Files (${trialUploadedFiles.length}/5)`}
                          </span>
                        </div>
                        <label
                          className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors inline-flex items-center gap-1 ${
                            trialUploadedFiles.length >= 5
                              ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                              : 'bg-[#0088FF] hover:bg-[#001E5A] text-white cursor-pointer'
                          }`}
                        >
                          <Plus className="w-3 h-3" />
                          <span>
                            {trialUploadedFiles.length >= 5
                              ? 'Max 5 Added'
                              : trialDivision === 'video_editing'
                              ? 'Upload Clip'
                              : 'Upload Files'}
                          </span>
                          <input
                            type="file"
                            multiple
                            disabled={trialUploadedFiles.length >= 5}
                            accept="image/*,video/*,.mp4,.mov,.raw,.cr2,.cr3,.nef,.raf,.dng,.psd,.tif,.tiff"
                            onChange={handleHomeTrialFileSelect}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {trialUploadedFiles.length === 0 ? (
                        <label className="flex flex-col items-center justify-center py-3 px-3 rounded-lg border border-dashed border-[#B8D0EB] bg-white hover:bg-[#EAF3FC]/50 cursor-pointer transition-colors text-center">
                          <span className="text-[11px] font-semibold text-[#001E5A]">
                            {trialDivision === 'video_editing'
                              ? 'Click to upload sample video clip (MP4, MOV, ProRes, RAW)'
                              : 'Click to upload up to 5 sample images (RAW, PSD, TIFF, PNG, JPG)'}
                          </span>
                          <input
                            type="file"
                            multiple
                            accept="image/*,video/*,.mp4,.mov,.raw,.cr2,.cr3,.nef,.raf,.dng,.psd,.tif,.tiff"
                            onChange={handleHomeTrialFileSelect}
                            className="hidden"
                          />
                        </label>
                      ) : (
                        <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                          {trialUploadedFiles.map((f) => (
                            <div
                              key={f.id}
                              className="p-2 bg-white border border-[#DCE6F2] rounded-lg space-y-1"
                            >
                              <div className="flex items-center justify-between gap-2 text-xs">
                                <div className="flex items-center gap-1.5 min-w-0">
                                  {f.done ? (
                                    <FileCheck2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  ) : (
                                    <Loader2 className="w-3.5 h-3.5 text-[#0088FF] animate-spin shrink-0" />
                                  )}
                                  <span className="font-mono-tabular font-semibold text-[#001E5A] truncate">
                                    {f.name}
                                  </span>
                                  <span className="text-[10px] font-mono-tabular text-slate-400 shrink-0">
                                    ({f.sizeLabel})
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <span className="text-[10px] font-mono-tabular font-bold text-[#0088FF]">
                                    {f.progress}%
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setTrialUploadedFiles((prev) =>
                                        prev.filter((item) => item.id !== f.id)
                                      )
                                    }
                                    className="text-slate-400 hover:text-red-600"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                              <div className="w-full h-1 bg-[#EAF3FC] rounded-full overflow-hidden">
                                <div
                                  className={`h-full transition-all duration-300 ${
                                    f.done ? 'bg-emerald-500' : 'bg-[#0088FF]'
                                  }`}
                                  style={{ width: `${f.progress}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                        Instructions
                      </label>
                      <textarea
                        rows={2}
                        value={trialInstructions}
                        onChange={(e) => setTrialInstructions(e.target.value)}
                        placeholder="Describe your retouching or video instructions (e.g., pure white background, natural shadow, color match)..."
                        className="w-full px-3 py-2 text-xs border border-[#B8D0EB] rounded-lg bg-white focus:outline-none focus:border-[#0088FF]"
                      />
                    </div>

                    {trialStatus && (
                      <p className="text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                        {trialStatus}
                      </p>
                    )}

                    {trialSuccessNotice && (
                      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 space-y-2 shadow-xs">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <p className="text-xs font-bold text-emerald-900">
                              Thank you for your query! Our team will contact you soon.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setTrialSuccessNotice(null)}
                            className="text-[11px] font-semibold text-emerald-700 hover:underline shrink-0"
                          >
                            Dismiss
                          </button>
                        </div>
                        <p className="text-[11px] text-emerald-800 leading-relaxed">
                          Hello <strong>{trialSuccessNotice.clientName}</strong>, we have received your{' '}
                          <strong>{trialSuccessNotice.serviceTitle}</strong> inquiry ({trialSuccessNotice.queryNumber}). A confirmation email has been sent to{' '}
                          <span className="font-mono-tabular font-semibold">{trialSuccessNotice.clientEmail}</span>{' '}
                          and our studio desk has been notified.
                        </p>
                        {trialSuccessNotice.routedToPortal && (
                          <div className="pt-1 flex items-center justify-between gap-2">
                            <span className="text-[10px] font-mono-tabular text-emerald-700 font-semibold">
                              ORDER LOGGED IN YOUR ACCOUNT ({trialSuccessNotice.orderNumber})
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setActivePage('portal');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="px-3 py-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors"
                            >
                              Open Client Portal →
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-3 px-4 text-xs font-bold text-white bg-gradient-to-r from-[#001E5A] to-[#0088FF] hover:from-[#00143D] hover:to-[#0072E0] rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <UploadCloud className="w-4 h-4" />
                      <span>
                        {trialDivision === 'video_editing'
                          ? 'Launch Free Video Trial'
                          : 'Launch Free 5-Image Trial'}
                      </span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section>

          {/* 4. INTERACTIVE PHOTO & VIDEO PORTFOLIO SHOWCASE */}
          <section id="portfolio" className="border-t border-[#DCE6F2] py-16">
            <div className="max-w-[1360px] mx-auto px-6 space-y-8">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div>
                  <p className="text-xs font-mono-tabular text-[#0088FF] font-semibold">
                    INTERACTIVE PHOTO & VIDEO PORTFOLIO ARCHIVE
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#001E5A] mt-1">
                    Inspect Pixel-Level Photo Retouching & 4K Video Showreels
                  </h2>
                </div>

                {/* Photo vs Video Portfolio Switcher */}
                <div className="flex items-center gap-1.5 p-1.5 bg-[#EAF3FC] border border-[#DCE6F2] rounded-xl self-start">
                  <button
                    type="button"
                    onClick={() => setPortfolioDivisionTab('photo_editing')}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
                      portfolioDivisionTab === 'photo_editing'
                        ? 'bg-[#001E5A] text-white shadow-xs'
                        : 'text-[#001E5A] hover:bg-white/70'
                    }`}
                  >
                    <Camera className="w-4 h-4" />
                    <span>01. Photo Portfolio ({portfolioItems.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPortfolioDivisionTab('video_editing')}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
                      portfolioDivisionTab === 'video_editing'
                        ? 'bg-[#0088FF] text-white shadow-xs'
                        : 'text-[#001E5A] hover:bg-white/70'
                    }`}
                  >
                    <Film className="w-4 h-4" />
                    <span>02. Video Portfolio ({videoShowreelProjects.length})</span>
                  </button>
                </div>
              </div>

              {portfolioDivisionTab === 'photo_editing' ? (
                <>
                  <div className="flex flex-wrap items-center gap-1 p-1 bg-[#EAF3FC] rounded-lg w-fit">
                    {[
                      { id: 'all', label: 'All Photo Works' },
                      { id: 'clipping_path', label: 'Clipping Path' },
                      { id: 'ghost_mannequin', label: 'Ghost Mannequin' },
                      { id: 'jewelry_retouch', label: 'Fine Jewelry' },
                      { id: 'ecommerce_shadow', label: 'Product & Shadow' },
                      { id: 'beauty_high_end', label: 'High-End Beauty' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() =>
                          setPortfolioFilter(tab.id as ServiceCategory | 'all')
                        }
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                          portfolioFilter === tab.id
                            ? 'bg-[#001E5A] text-white shadow-xs'
                            : 'text-[#001E5A] hover:bg-white/70'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {visiblePortfolio.map((item) => (
                      <div
                        key={item.id}
                        className={`${item.colSpanClass} bg-white border border-[#DCE6F2] rounded-2xl overflow-hidden flex flex-col justify-between`}
                      >
                        <BeforeAfterStudioCanvas
                          artworkType={item.artworkType}
                          beforeImageUrl={item.beforeImageUrl}
                          afterImageUrl={item.afterImageUrl}
                          initialSplit={50}
                          showVectorOverlay={false}
                          interactive={true}
                          className={item.aspectClass}
                        />

                        <div className="p-5 space-y-3">
                          <div className="flex items-center justify-between text-xs font-mono-tabular text-slate-500">
                            <span>
                              {item.categoryLabel} · {item.turnaround}
                            </span>
                            <span className="font-bold text-[#0088FF]">
                              {item.pricePerImage}
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-[#001E5A]">
                            {item.title}
                          </h3>

                          <p className="text-xs text-slate-600 leading-relaxed">
                            {item.afterNotes}
                          </p>

                          <div className="pt-3 border-t border-[#DCE6F2] flex items-center justify-between gap-3">
                            <button
                              type="button"
                              onClick={() => navigateToServiceByCategory(item.category)}
                              className="text-xs font-semibold text-[#0088FF] hover:underline"
                            >
                              Dedicated Service Page →
                            </button>

                            <button
                              type="button"
                              onClick={() => setLightboxItem(item)}
                              className="px-3 py-1.5 text-xs font-semibold text-[#001E5A] bg-[#EAF3FC] hover:bg-[#001E5A] hover:text-white rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
                            >
                              <Maximize2 className="w-3.5 h-3.5" />
                              <span>Inspect Fullscreen</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-wrap items-center gap-1 p-1 bg-[#EAF3FC] rounded-lg w-fit">
                    {[
                      { id: 'all', label: 'All Video Works' },
                      { id: 'ecommerce_product', label: 'E-Commerce Product Video' },
                      { id: 'social_reels', label: 'Reels, TikTok & Shorts' },
                      { id: 'real_estate_drone', label: 'Real Estate & Drone' },
                      { id: 'wedding_cinema', label: 'Wedding Cinema' },
                      { id: 'color_vfx', label: 'Color Grading & Roto VFX' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() =>
                          setVideoPortfolioFilter(
                            tab.id as VideoShowreelProject['category'] | 'all'
                          )
                        }
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                          videoPortfolioFilter === tab.id
                            ? 'bg-[#0088FF] text-white shadow-xs'
                            : 'text-[#001E5A] hover:bg-white/70'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visibleVideoPortfolio.map((vid) => (
                      <div
                        key={vid.id}
                        className="bg-white border border-[#DCE6F2] rounded-2xl overflow-hidden flex flex-col justify-between shadow-xs"
                      >
                        <div className="relative h-60 bg-gradient-to-br from-[#001238] via-[#001E5A] to-[#00338D] text-white overflow-hidden flex flex-col justify-between p-4">
                          {vid.videoPreviewUrl ? (
                            <video
                              src={vid.videoPreviewUrl}
                              controls
                              playsInline
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          ) : vid.thumbnailImageUrl ? (
                            <img
                              src={vid.thumbnailImageUrl}
                              alt={vid.title}
                              className="absolute inset-0 w-full h-full object-cover opacity-85"
                            />
                          ) : null}

                          <div className="relative z-10 flex items-center justify-between gap-2 text-[11px] font-mono-tabular">
                            <span className="px-2.5 py-1 rounded bg-black/50 backdrop-blur-xs text-[#00C8FF] font-semibold">
                              {vid.categoryLabel}
                            </span>
                            <span className="px-2.5 py-1 rounded bg-black/50 backdrop-blur-xs text-white">
                              {vid.duration}
                            </span>
                          </div>

                          {!vid.videoPreviewUrl && (
                            <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center px-3">
                              <div className="w-12 h-12 rounded-full bg-[#0088FF]/90 text-white flex items-center justify-center shadow-lg border border-white/30 mb-2">
                                <Film className="w-5 h-5" />
                              </div>
                              <p className="text-xs font-mono-tabular text-blue-100 font-semibold">
                                {vid.resolutionFps}
                              </p>
                              <p className="text-[11px] text-blue-200/90 mt-0.5">
                                {vid.lutProfile}
                              </p>
                            </div>
                          )}

                          <div className="relative z-10 flex items-center justify-between text-[11px] font-mono-tabular bg-black/45 backdrop-blur-xs px-3 py-1.5 rounded-lg">
                            <span className="text-emerald-300 font-semibold">
                              {vid.outcomeMetric}
                            </span>
                          </div>
                        </div>

                        <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                          <div className="space-y-2.5">
                            <div className="flex items-center justify-between text-xs font-mono-tabular text-slate-500">
                              <span>
                                {vid.clientBrand} · {vid.turnaround}
                              </span>
                              <span className="font-bold text-[#0088FF]">
                                {vid.priceLabel}
                              </span>
                            </div>

                            <h3 className="text-base font-bold text-[#001E5A]">
                              {vid.title}
                            </h3>

                            <ul className="space-y-1 text-xs text-slate-600">
                              {vid.vfxHighlights.map((hl, idx) => (
                                <li key={idx} className="flex items-start gap-1.5">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0088FF] shrink-0 mt-0.5" />
                                  <span>{hl}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="pt-3 mt-3 border-t border-[#DCE6F2] flex items-center justify-between gap-3">
                            <button
                              type="button"
                              onClick={() => navigateToServicePage(vid.serviceSlug)}
                              className="text-xs font-semibold text-[#0088FF] hover:underline"
                            >
                              Open Video Service →
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setActivePage('video_editing_page');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="px-3 py-1.5 text-xs font-semibold text-[#001E5A] bg-[#EAF3FC] hover:bg-[#001E5A] hover:text-white rounded-lg transition-colors"
                            >
                              Inspect in Video Studio
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>

          {/* 5. VERIFIED CUSTOMER REVIEWS 3-CARD CAROUSEL SECTION */}
          <CustomerReviewsSection
            reviews={customerReviews}
            onExploreServicePage={navigateToServiceByCategory}
          />

          {/* 6. STUDIO BLOG & TECHNICAL POST-PRODUCTION GUIDES (NEWEST SHOWN 1ST) */}
          <StudioBlogSection
            blogPosts={blogPosts}
            onReadBlogPost={navigateToSingleBlogPage}
            onOpenAllBlogsPage={navigateToAllBlogsPage}
          />
        </main>
      )}

      {/* =====================================================================
          MULTI-COLUMN SERVICE DIRECTORY FOOTER (WITH OFFICIAL LOGO & BLOG LINK)
         ===================================================================== */}
      <footer className="border-t border-[#DCE6F2] bg-[#EAF3FC] pt-12 pb-10">
        <div className="max-w-[1360px] mx-auto px-6 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-4">
              <FixPhotoBrandLogo size="md" showTagline={true} />
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
                Dedicated commercial photo editing and video post-production agency for global e-commerce retailers, jewelry houses, apparel studios, and wedding photographers.
              </p>
              <p className="text-xs font-mono-tabular text-[#001E5A] font-semibold">
                fixphotostudio.com · 24/7 Production Pods
              </p>
            </div>

            <div className="lg:col-span-5">
              <p className="text-xs font-bold text-[#001E5A] mb-3">
                01. Photo Editing Service Pages (12)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                {servicesList
                  .filter((s) => s.division === 'photo_editing')
                  .map((s) => (
                    <button
                      key={s.slug}
                      type="button"
                      onClick={() => navigateToServicePage(s.slug)}
                      className="text-left hover:text-[#0088FF] transition-colors truncate"
                    >
                      {s.indexNumber} {s.shortNavTitle}
                    </button>
                  ))}
              </div>
            </div>

            <div className="lg:col-span-3 space-y-4">
              <div>
                <p className="text-xs font-bold text-[#001E5A] mb-3">
                  02. Video Editing Pages (4)
                </p>
                <div className="space-y-2 text-xs text-slate-600 flex flex-col items-start">
                  {servicesList
                    .filter((s) => s.division === 'video_editing')
                    .map((s) => (
                      <button
                        key={s.slug}
                        type="button"
                        onClick={() => navigateToServicePage(s.slug)}
                        className="text-left hover:text-[#0088FF] transition-colors"
                      >
                        {s.indexNumber} {s.shortNavTitle}
                      </button>
                    ))}
                </div>
              </div>

              <div className="pt-2 border-t border-[#DCE6F2] flex flex-wrap gap-3 text-xs font-semibold text-[#0088FF]">
                <button
                  type="button"
                  onClick={navigateToAllBlogsPage}
                  className="hover:underline font-bold"
                >
                  Blogs (/blogs)
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => setActivePage('portal')}
                  className="hover:underline"
                >
                  Client Portal
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => {
                    setActivePage('admin_login');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:underline"
                >
                  Admin CMS Login
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => {
                    setActivePage('portal');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:underline"
                >
                  Your Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* =====================================================================
          MODALS: FULLSCREEN PORTFOLIO LIGHTBOX, NEW ORDER, FREE TRIAL, GET QUOTE, MFA VAULT
         ===================================================================== */}
      <PortfolioLightbox
        item={lightboxItem}
        onClose={() => setLightboxItem(null)}
        onOrderThisSpec={(cat) => handleOpenOrderWithService(cat)}
      />

      <NewOrderModal
        isOpen={newOrderModalOpen}
        onClose={() => setNewOrderModalOpen(false)}
        initialService={preselectedService}
        isAuthenticatedClient={isClientAuthenticated}
        clientProfileData={activeClientProfileData}
        onSubmitOrder={async (payload) => {
          await handleCreateOrder(payload);
        }}
      />

      <FreeTrialPage
        isOpen={freeTrialModalOpen}
        onClose={() => setFreeTrialModalOpen(false)}
        services={servicesList}
        isAuthenticatedClient={isClientAuthenticated}
        clientProfileData={activeClientProfileData}
        onSubmitPublicQuery={async (q) => {
          const created = await handleSubmitPublicQuery({
            source: 'free_trial_popup',
            ...q,
          });
          return { queryNumber: created.queryNumber };
        }}
        onSubmitTrialOrder={async (payload) => {
          await handleCreateOrder(payload, {
            redirectToPortal: isClientAuthenticated,
          });
        }}
        onExploreService={(slug) => navigateToServicePage(slug)}
      />

      <GetQuotePage
        isOpen={getQuoteModalOpen}
        onClose={() => setGetQuoteModalOpen(false)}
        services={servicesList}
        isAuthenticatedClient={isClientAuthenticated}
        clientProfileData={activeClientProfileData}
        onSubmitPublicQuery={async (q) => {
          const created = await handleSubmitPublicQuery({
            source: 'custom_quote_popup',
            ...q,
          });
          return { queryNumber: created.queryNumber };
        }}
        onSubmitQuoteOrder={async (payload) => {
          await handleCreateOrder(payload, {
            redirectToPortal: isClientAuthenticated,
          });
        }}
        onOpenFreeTrial={() => {
          setGetQuoteModalOpen(false);
          setFreeTrialModalOpen(true);
        }}
      />

      <MfaSecurityModal
        isOpen={mfaModalOpen}
        onClose={() => setMfaModalOpen(false)}
        userProfile={userProfile}
        privateInfo={privateInfo}
        mfaSessionVerified={mfaSessionVerified}
        onVerifySession={() => setMfaSessionVerified(true)}
        onSaveMfaSettings={handleSaveMfaSettings}
      />
    </div>
  );
}
