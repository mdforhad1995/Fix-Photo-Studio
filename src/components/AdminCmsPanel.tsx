import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  UploadCloud,
  Plus,
  Trash2,
  CheckCircle2,
  Sliders,
  Camera,
  Film,
  RefreshCw,
  LogOut,
  Eye,
  EyeOff,
  Download,
  HelpCircle,
  Layers,
  Clock,
  Mail,
  FileText,
  LayoutDashboard,
  ShoppingBag,
  CreditCard,
  MessageSquare,
  Star,
  Globe,
  ArrowRight,
  ExternalLink,
  Check,
  AlertCircle,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import {
  PortfolioItem,
  ServiceCategory,
  OrderDoc,
  OrderStatus,
  NotificationAlertDoc,
  InvoicePaymentInfo,
  InvoicePaymentStatus,
  ClientQueryItem,
  QueryStatus,
} from '../types';
import {
  ServiceDefinition,
  StudioDivision,
  MainMenuPhotoServiceItem,
  CustomerReviewItem,
  SubscriptionPlanSpec,
  VideoShowreelProject,
  ServiceSampleItem,
  ServiceFaqItem,
  ServiceEditorialBlock,
  PIPELINE_STAGES,
  StudioBlogPost,
} from '../data/studioCatalog';
import { BeforeAfterStudioCanvas } from './StudioArtworks';

export interface PageSeoSpec {
  seoTitle: string;
  seoMetaDescription: string;
}

export interface SiteGlobalConfig {
  heroEyebrow: string;
  heroHeadline: string;
  heroSubtitle: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
  stat4Value: string;
  stat4Label: string;
  footerTagline: string;
  footerDomainLine: string;
  supportEmail: string;
  pageSeo?: Record<string, PageSeoSpec>;
}

export const DEFAULT_SITE_CONFIG: SiteGlobalConfig = {
  heroEyebrow:
    'COMMERCIAL PHOTO & VIDEO POST-PRODUCTION AGENCY · 24/7 PODS',
  heroHeadline:
    'Pixel-perfect photo editing & video retouching delivered in as little as 12 hours.',
  heroSubtitle:
    'From hand-drawn Bezier clipping paths ($0.39/img), invisible 3D ghost mannequins, and macro jewelry retouching to 4K product video rotoscoping—trusted by global e-commerce studios with 99.94% first-pass QA accuracy.',
  primaryCtaLabel: 'Upload Batch & Order Online',
  secondaryCtaLabel: 'Explore All Services',
  stat1Value: '4,820,000+',
  stat1Label:
    'Commercial e-commerce & lookbook frames delivered since inception',
  stat2Value: '99.94%',
  stat2Label:
    'First-pass dual 400% zoom QA approval across global retail catalogs',
  stat3Value: '12h – 24h',
  stat3Label:
    'Guaranteed SLA turnaround windows with real-time stage tracking',
  stat4Value: '17 Dedicated Pods',
  stat4Label:
    '6 Core Photo Editing Menu Hubs + Dedicated Video Editing Studio',
  footerTagline:
    'Dedicated commercial photo editing and video post-production agency for global e-commerce retailers, jewelry houses, apparel studios, and wedding photographers.',
  footerDomainLine: 'fixphotostudio.com · 24/7 Production Pods',
  supportEmail: 'asiaclipp@gmail.com',
  pageSeo: {
    home: {
      seoTitle: 'FixPhoto Studio – Commercial Photo & Video Editing',
      seoMetaDescription:
        'Get pixel-perfect clipping paths ($0.39/img), 3D ghost mannequins, jewelry retouching, and 4K video editing in 12–24h. Try 5 images free today.',
    },
    services_page: {
      seoTitle: 'All Photo & Video Editing Services – FixPhoto Studio',
      seoMetaDescription:
        'Explore dedicated photo editing and 4K video post-production pods with 12h–24h SLA turnaround and 99.94% QA accuracy. Order online.',
    },
    video_editing_page: {
      seoTitle: '4K Video Editing & Color Grading – FixPhoto Studio',
      seoMetaDescription:
        'Commercial 4K product video editing, fashion social reels, wedding cinema grading, and VFX rotoscoping delivered in 12–48h.',
    },
    portfolio_page: {
      seoTitle: 'Before & After Photo & Video Portfolio – FixPhoto Studio',
      seoMetaDescription:
        'Inspect pixel-level Before & After clipping paths, 3D ghost mannequins, fine jewelry retouching, and 4K video showreels.',
    },
    free_trial_page: {
      seoTitle: 'Free 5-Image Photo Editing Trial – FixPhoto Studio',
      seoMetaDescription:
        'Test FixPhoto Studio free of charge. Upload up to 5 RAW or studio frames and receive retouched masters in 12–24 hours.',
    },
    get_quote_page: {
      seoTitle: 'Instant Volume Quote Calculator – FixPhoto Studio',
      seoMetaDescription:
        'Calculate custom bulk pricing for commercial photo editing and 4K video post-production with guaranteed SLA delivery.',
    },
    blogs_page: {
      seoTitle: 'Commercial Photo & Video Editing Blog – FixPhoto Studio',
      seoMetaDescription:
        'Read technical guides on Bezier clipping paths, 3D ghost mannequins, fine jewelry retouching, Flambient HDR, and 4K video post-production.',
    },
    portal: {
      seoTitle: 'Client Portal & Live Batch Tracker – FixPhoto Studio',
      seoMetaDescription:
        'Manage active photo and video retouching orders, track 6-stage QA progress in real time, and download official PDF invoices.',
    },
  },
};

interface AdminCmsPanelProps {
  isAuthenticatedGoogleAdmin: boolean;
  googleEmail: string | null;
  onSignInGoogle: () => Promise<void>;
  siteConfig: SiteGlobalConfig;
  onUpdateSiteConfig: (next: SiteGlobalConfig) => void;
  mainMenuServices: MainMenuPhotoServiceItem[];
  onUpdateMainMenuServices: (next: MainMenuPhotoServiceItem[]) => void;
  servicesList: ServiceDefinition[];
  onUpdateServicesList: (next: ServiceDefinition[]) => void;
  portfolioItems: PortfolioItem[];
  onUpdatePortfolioItems: (next: PortfolioItem[]) => void;
  videoShowreelProjects: VideoShowreelProject[];
  onUpdateVideoShowreelProjects: (next: VideoShowreelProject[]) => void;
  customerReviews: CustomerReviewItem[];
  onUpdateCustomerReviews: (next: CustomerReviewItem[]) => void;
  blogPosts: StudioBlogPost[];
  onUpdateBlogPosts: (next: StudioBlogPost[]) => void;
  subscriptionPlans: SubscriptionPlanSpec[];
  onUpdateSubscriptionPlans: (next: SubscriptionPlanSpec[]) => void;
  orders: OrderDoc[];
  notifications: NotificationAlertDoc[];
  orderApprovalMap: Record<string, 'pending' | 'approved'>;
  onApproveOrder: (order: OrderDoc) => Promise<void>;
  onSetOrderStage: (
    order: OrderDoc,
    targetStatus: OrderStatus | 'pending_approval'
  ) => Promise<void>;
  onAdvanceOrderStage: (order: OrderDoc) => Promise<void>;
  onUpdateOrderInvoiceDetails?: (
    orderId: string,
    updates: {
      clientName?: string;
      projectTitle?: string;
      imageCount?: number;
      totalPrice?: number;
      turnaroundHours?: number;
    }
  ) => Promise<void>;
  invoicePaymentInfo: InvoicePaymentInfo;
  onUpdateInvoicePaymentInfo: (next: InvoicePaymentInfo) => void;
  invoiceStatusMap: Record<string, InvoicePaymentStatus>;
  onUpdateInvoiceStatus: (
    invoiceRef: string,
    nextStatus: InvoicePaymentStatus,
    relatedOrderNumber?: string
  ) => Promise<void>;
  clientQueries: ClientQueryItem[];
  onUpdateClientQueries: (next: ClientQueryItem[]) => void;
  onResetAllToDefaults: () => void;
  onExitAdminToLiveSite: () => void;
  onPreviewServicePage?: (slug: string) => void;
}

export interface AdminAccountRecord {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'super_admin' | 'sub_admin';
  createdBy: string;
  createdAt: string;
}

const DEFAULT_MAIN_ADMIN_ACCOUNT: AdminAccountRecord = {
  id: 'admin-master-owner',
  name: 'Main Super Admin (Owner)',
  email: 'asiaclipp@gmail.com',
  password: 'fixphoto2026',
  role: 'super_admin',
  createdBy: 'System Owner',
  createdAt: '2026-01-01T00:00:00.000Z',
};

const DEFAULT_SECONDARY_MAIN_ADMIN_ACCOUNT: AdminAccountRecord = {
  id: 'admin-master-studio',
  name: 'Main Studio Admin',
  email: 'admin@fixphotostudio.com',
  password: 'fixphoto2026',
  role: 'super_admin',
  createdBy: 'System Owner',
  createdAt: '2026-01-01T00:00:00.000Z',
};

type AdminTab =
  | 'dashboard_overview'
  | 'plans_and_orders'
  | 'invoices_billing'
  | 'client_queries'
  | 'menu_and_services'
  | 'portfolio_before_after'
  | 'video_studio_showreel'
  | 'reviews_carousel'
  | 'blog_manager'
  | 'seo_manager'
  | 'global_hero_footer'
  | 'admin_accounts'
  | 'database_backup';

export const AdminCmsPanel: React.FC<AdminCmsPanelProps> = ({
  isAuthenticatedGoogleAdmin,
  googleEmail,
  siteConfig,
  onUpdateSiteConfig,
  mainMenuServices,
  onUpdateMainMenuServices,
  servicesList,
  onUpdateServicesList,
  portfolioItems,
  onUpdatePortfolioItems,
  videoShowreelProjects,
  onUpdateVideoShowreelProjects,
  customerReviews,
  onUpdateCustomerReviews,
  blogPosts,
  onUpdateBlogPosts,
  subscriptionPlans,
  onUpdateSubscriptionPlans,
  orders,
  notifications,
  orderApprovalMap,
  onApproveOrder,
  onSetOrderStage,
  onAdvanceOrderStage,
  onUpdateOrderInvoiceDetails,
  invoicePaymentInfo,
  onUpdateInvoicePaymentInfo,
  invoiceStatusMap,
  onUpdateInvoiceStatus,
  clientQueries,
  onUpdateClientQueries,
  onResetAllToDefaults,
  onExitAdminToLiveSite,
  onPreviewServicePage,
}) => {
  const [adminAccounts, setAdminAccounts] = useState<AdminAccountRecord[]>(
    () => {
      const defaults = [
        DEFAULT_MAIN_ADMIN_ACCOUNT,
        DEFAULT_SECONDARY_MAIN_ADMIN_ACCOUNT,
      ];
      try {
        const raw =
          window.localStorage.getItem('fps_admin_accounts_v2') ||
          window.localStorage.getItem('fps_admin_accounts_v1');
        if (raw) {
          const parsed = JSON.parse(raw) as AdminAccountRecord[];
          if (Array.isArray(parsed) && parsed.length > 0) {
            const sanitized = parsed.map((a) => ({
              ...a,
              email: (a.email || '').trim(),
              password: (a.password || 'fixphoto2026').trim() || 'fixphoto2026',
            }));
            const hasPrimary = sanitized.some(
              (a) => a.email.toLowerCase() === 'asiaclipp@gmail.com'
            );
            const hasSecondary = sanitized.some(
              (a) => a.email.toLowerCase() === 'admin@fixphotostudio.com'
            );
            const merged = [...sanitized];
            if (!hasSecondary) {
              merged.unshift(DEFAULT_SECONDARY_MAIN_ADMIN_ACCOUNT);
            }
            if (!hasPrimary) {
              merged.unshift(DEFAULT_MAIN_ADMIN_ACCOUNT);
            }
            return merged;
          }
        }
      } catch {
        // ignore
      }
      return defaults;
    }
  );

  const saveAdminAccountsList = (next: AdminAccountRecord[]) => {
    setAdminAccounts(next);
    try {
      window.localStorage.setItem(
        'fps_admin_accounts_v2',
        JSON.stringify(next)
      );
    } catch {
      // ignore
    }
  };

  const [loggedInAdminEmail, setLoggedInAdminEmail] = useState<string>(() => {
    try {
      const savedEmail = window.localStorage.getItem('fps_admin_email_v1');
      if (savedEmail) return savedEmail;
    } catch {
      // ignore
    }
    return isAuthenticatedGoogleAdmin && googleEmail ? googleEmail : '';
  });

  const [adminUnlocked, setAdminUnlocked] = useState<boolean>(() => {
    try {
      const saved = window.localStorage.getItem('fps_admin_session_v1');
      const savedEmail = window.localStorage.getItem('fps_admin_email_v1');
      if (saved === 'unlocked' && savedEmail) return true;
    } catch {
      // ignore
    }
    return isAuthenticatedGoogleAdmin;
  });

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPasscode, setLoginPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [rememberSession, setRememberSession] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  // New Sub-Admin Creator & Main Admin Password Update State
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [mainAdminNewPassword, setMainAdminNewPassword] = useState('');

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard_overview');
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [queryStatusFilter, setQueryStatusFilter] = useState<
    QueryStatus | 'all'
  >('all');
  const [expandedEmailQueryId, setExpandedEmailQueryId] = useState<
    string | null
  >(null);

  // Sync URL hash to reflect separate Login Page vs Dashboard Page
  useEffect(() => {
    try {
      if (adminUnlocked) {
        if (window.location.hash !== '#admin-dashboard') {
          window.history.replaceState(null, '', '#admin-dashboard');
        }
      } else {
        if (window.location.hash !== '#admin-login') {
          window.history.replaceState(null, '', '#admin-login');
        }
      }
    } catch {
      // ignore history errors
    }
  }, [adminUnlocked]);

  // 1. Portfolio Before/After Creator State
  const [newPfTitle, setNewPfTitle] = useState('');
  const [newPfBrand, setNewPfBrand] = useState('');
  const [newPfCategory, setNewPfCategory] =
    useState<ServiceCategory>('clipping_path');
  const [newPfPrice, setNewPfPrice] = useState('$0.85 / frame');
  const [newPfTurnaround, setNewPfTurnaround] = useState('12h Express SLA');
  const [newPfBeforeNotes, setNewPfBeforeNotes] = useState(
    'Raw studio capture before clipping path and color correction.'
  );
  const [newPfAfterNotes, setNewPfAfterNotes] = useState(
    'Pixel-perfect retouched master with grounded contact shadow.'
  );
  const [newPfOutcome, setNewPfOutcome] = useState(
    '+42% Product Page Conversion'
  );
  const [newPfBeforeImg, setNewPfBeforeImg] = useState<string>('');
  const [newPfAfterImg, setNewPfAfterImg] = useState<string>('');

  // 2. Selected Service Slug + New Custom Service Page Creator State
  const [editingServiceSlug, setEditingServiceSlug] = useState<string>(
    servicesList[0]?.slug || 'clipping-path-service'
  );
  const [newSrvDivision, setNewSrvDivision] =
    useState<StudioDivision>('photo_editing');
  const [newSrvName, setNewSrvName] = useState('');
  const [newSrvRate, setNewSrvRate] = useState('0.65');
  const [newSrvTurnaround, setNewSrvTurnaround] = useState(
    '12h–24h Express SLA · Dedicated Pod'
  );
  const [newSrvDeliverables, setNewSrvDeliverables] = useState(
    'Layered PSD · 16-Bit TIFF · Pure White #FFFFFF & Alpha PNG'
  );
  const [newSrvSubtitle, setNewSrvSubtitle] = useState('');
  const [newSrvArtwork, setNewSrvArtwork] = useState<
    | 'watch'
    | 'mannequin'
    | 'jewelry'
    | 'footwear'
    | 'beauty'
    | 'variant'
    | 'real_estate'
  >('watch');
  const [newSrvBeforeImg, setNewSrvBeforeImg] = useState('');
  const [newSrvAfterImg, setNewSrvAfterImg] = useState('');

  // New Service Sample & New Service FAQ inputs
  const [newSampleTitle, setNewSampleTitle] = useState('');
  const [newSampleTag, setNewSampleTag] = useState('Complex Studio Sample');
  const [newSampleTurnaround, setNewSampleTurnaround] =
    useState('12h Express SLA');
  const [newSampleNote, setNewSampleNote] = useState('');
  const [newSampleBeforeImg, setNewSampleBeforeImg] = useState('');
  const [newSampleAfterImg, setNewSampleAfterImg] = useState('');

  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');

  // New Service Split Image + Text Section inputs
  const [newEditorialBadge, setNewEditorialBadge] = useState(
    'SECTION 01 · STUDIO CRAFTSMANSHIP'
  );
  const [newEditorialHeadline, setNewEditorialHeadline] = useState('');
  const [newEditorialParagraphs, setNewEditorialParagraphs] = useState('');
  const [newEditorialHighlights, setNewEditorialHighlights] = useState(
    '100% Hand-Crafted Precision, Dual 400% Zoom QA, 12h–24h Turnaround'
  );
  const [newEditorialImageSide, setNewEditorialImageSide] = useState<
    'right' | 'left'
  >('right');
  const [newEditorialImageUrl, setNewEditorialImageUrl] = useState('');
  const [newEditorialCaption, setNewEditorialCaption] = useState(
    'Faster Turnaround Time · 12h–24h SLA'
  );

  // 3. New Video Showreel Project Creator State
  const [newVidTitle, setNewVidTitle] = useState('');
  const [newVidClient, setNewVidClient] = useState('');
  const [newVidCategory, setNewVidCategory] = useState<
    VideoShowreelProject['category']
  >('ecommerce_product');
  const [newVidDuration, setNewVidDuration] = useState('00:45');
  const [newVidPrice, setNewVidPrice] = useState('$55 / video');
  const [newVidTurnaround, setNewVidTurnaround] = useState('24h SLA');
  const [newVidOutcome, setNewVidOutcome] = useState('+38% Video Ad ROAS');

  // 4. New Customer Review Creator State
  const [revClientName, setRevClientName] = useState('');
  const [revRole, setRevRole] = useState('');
  const [revCompany, setRevCompany] = useState('');
  const [revLocation, setRevLocation] = useState('');
  const [revCategory, setRevCategory] =
    useState<ServiceCategory>('clipping_path');
  const [revHeadline, setRevHeadline] = useState('');
  const [revQuote, setRevQuote] = useState('');
  const [revOutcome, setRevOutcome] = useState('');

  // 5. New Service Page SEO Fields
  const [newSrvSeoTitle, setNewSrvSeoTitle] = useState('');
  const [newSrvSeoDesc, setNewSrvSeoDesc] = useState('');

  // 6. New Blog Post Creator State (Always added 1st at index 0)
  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogCategory, setNewBlogCategory] = useState(
    'Clipping Path & E-Commerce'
  );
  const [newBlogAuthorName, setNewBlogAuthorName] = useState('Elena Rostova');
  const [newBlogAuthorRole, setNewBlogAuthorRole] = useState(
    'Lead Vector & Retouching Director'
  );
  const [newBlogReadTime, setNewBlogReadTime] = useState('5 min read');
  const [newBlogExcerpt, setNewBlogExcerpt] = useState('');
  const [newBlogContent, setNewBlogContent] = useState('');
  const [newBlogCoverImg, setNewBlogCoverImg] = useState('');
  const [newBlogRelatedSlug, setNewBlogRelatedSlug] = useState(
    'clipping-path-service'
  );
  const [newBlogSeoTitle, setNewBlogSeoTitle] = useState('');
  const [newBlogSeoDesc, setNewBlogSeoDesc] = useState('');

  const notifySaved = (msg: string) => {
    setSaveToast(msg);
    window.setTimeout(() => {
      setSaveToast((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  // If Google Admin signs in and matches an authorized admin account, unlock automatically
  useEffect(() => {
    if (googleEmail) {
      const matched = adminAccounts.find(
        (acc) => acc.email.toLowerCase() === googleEmail.toLowerCase()
      );
      if (matched && !adminUnlocked) {
        setLoggedInAdminEmail(matched.email);
        setAdminUnlocked(true);
        try {
          window.localStorage.setItem('fps_admin_session_v1', 'unlocked');
          window.localStorage.setItem('fps_admin_email_v1', matched.email);
        } catch {
          // ignore
        }
      }
    }
  }, [googleEmail, adminAccounts, adminUnlocked]);

  const currentAdminAccount =
    adminAccounts.find(
      (a) =>
        a.email.toLowerCase() ===
        (loggedInAdminEmail || googleEmail || '').toLowerCase()
    ) || null;

  const isMainSuperAdmin =
    currentAdminAccount?.role === 'super_admin' ||
    (loggedInAdminEmail || googleEmail || '').toLowerCase() ===
      'asiaclipp@gmail.com' ||
    (loggedInAdminEmail || googleEmail || '').toLowerCase() ===
      'admin@fixphotostudio.com';

  const unlockAdminSession = (authenticatedEmail: string, toastMsg: string) => {
    setLoggedInAdminEmail(authenticatedEmail);
    setAdminUnlocked(true);
    try {
      if (rememberSession) {
        window.localStorage.setItem('fps_admin_session_v1', 'unlocked');
        window.localStorage.setItem('fps_admin_email_v1', authenticatedEmail);
      }
    } catch {
      // ignore
    }
    notifySaved(toastMsg);
  };

  const handleSignOutAdmin = () => {
    setAdminUnlocked(false);
    setLoggedInAdminEmail('');
    setLoginEmail('');
    setLoginPasscode('');
    try {
      window.localStorage.removeItem('fps_admin_session_v1');
      window.localStorage.removeItem('fps_admin_email_v1');
      window.history.replaceState(null, '', '#admin-login');
    } catch {
      // ignore
    }
  };

  const handleAdminPasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const rawEmailInput = loginEmail
      .replace(/^admin\s*email\s*:\s*/i, '')
      .trim()
      .toLowerCase();

    const normalizedEmail = rawEmailInput.includes('asiaclipp@gmail.com')
      ? 'asiaclipp@gmail.com'
      : rawEmailInput.includes('admin@fixphotostudio.com')
      ? 'admin@fixphotostudio.com'
      : rawEmailInput;

    const cleanPasscode = loginPasscode
      .replace(/^admin\s*password\s*:\s*/i, '')
      .trim();

    const isMasterEmail =
      normalizedEmail === 'asiaclipp@gmail.com' ||
      normalizedEmail === 'admin@fixphotostudio.com';

    const isMasterDefaultPassword =
      cleanPasscode.toLowerCase() === 'fixphoto2026';

    const matchedAccount = adminAccounts.find(
      (acc) => acc.email.trim().toLowerCase() === normalizedEmail
    );

    const passwordMatchesAccount =
      matchedAccount &&
      (matchedAccount.password === loginPasscode ||
        matchedAccount.password.trim() === cleanPasscode);

    if (passwordMatchesAccount || (isMasterEmail && isMasterDefaultPassword)) {
      const resolvedEmail = matchedAccount?.email || normalizedEmail;
      const resolvedName =
        matchedAccount?.name || 'Main Super Admin (Owner)';
      const isSuper =
        isMasterEmail || matchedAccount?.role === 'super_admin';

      unlockAdminSession(
        resolvedEmail,
        `Welcome back, ${resolvedName}! Authenticated as ${
          isSuper ? 'Main Super Admin' : 'Authorized Sub-Admin'
        }.`
      );
    } else {
      setLoginError(
        'Access Denied: Invalid admin email or password. Use asiaclipp@gmail.com (or admin@fixphotostudio.com) and password fixphoto2026.'
      );
    }
  };

  const handleCreateNewAdminAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMainSuperAdmin) {
      notifySaved(
        'Permission Denied: Only the Main Super Admin (asiaclipp@gmail.com) can create new admin accounts.'
      );
      return;
    }
    const cleanEmail = newAdminEmail.trim().toLowerCase();
    if (!newAdminName.trim() || !cleanEmail || !newAdminPassword.trim()) {
      return;
    }
    if (adminAccounts.some((a) => a.email.toLowerCase() === cleanEmail)) {
      notifySaved(`An admin account with email "${cleanEmail}" already exists.`);
      return;
    }
    const created: AdminAccountRecord = {
      id: `admin-${Date.now()}`,
      name: newAdminName.trim(),
      email: cleanEmail,
      password: newAdminPassword.trim(),
      role: 'sub_admin',
      createdBy: loggedInAdminEmail || 'asiaclipp@gmail.com',
      createdAt: new Date().toISOString(),
    };
    saveAdminAccountsList([...adminAccounts, created]);
    setNewAdminName('');
    setNewAdminEmail('');
    setNewAdminPassword('');
    notifySaved(
      `Created new Admin Account for "${created.name}" (${created.email}). They can now log in at #admin-login.`
    );
  };

  const handleDeleteAdminAccount = (target: AdminAccountRecord) => {
    if (!isMainSuperAdmin) {
      notifySaved(
        'Permission Denied: Only the Main Super Admin can remove admin accounts.'
      );
      return;
    }
    if (
      target.role === 'super_admin' ||
      target.email.toLowerCase() === 'asiaclipp@gmail.com'
    ) {
      notifySaved(
        'Protected Account: The Main Super Admin account cannot be deleted.'
      );
      return;
    }
    const next = adminAccounts.filter((a) => a.id !== target.id);
    saveAdminAccountsList(next);
    notifySaved(
      `Removed admin access for "${target.name}" (${target.email}).`
    );
  };

  const handleUpdateMainAdminPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMainSuperAdmin || !mainAdminNewPassword.trim()) return;
    const next = adminAccounts.map((acc) =>
      acc.email.toLowerCase() === 'asiaclipp@gmail.com'
        ? { ...acc, password: mainAdminNewPassword.trim() }
        : acc
    );
    saveAdminAccountsList(next);
    setMainAdminNewPassword('');
    notifySaved('Updated Main Super Admin password successfully!');
  };

  const readImageFileAsDataUrl = (
    file: File,
    onLoaded: (dataUrl: string) => void
  ) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onLoaded(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePortfolioImageUpload = (
    itemId: string,
    side: 'before' | 'after',
    file: File | undefined
  ) => {
    if (!file) return;
    readImageFileAsDataUrl(file, (dataUrl) => {
      const next = portfolioItems.map((item) => {
        if (item.id !== itemId) return item;
        return side === 'before'
          ? { ...item, beforeImageUrl: dataUrl }
          : { ...item, afterImageUrl: dataUrl };
      });
      onUpdatePortfolioItems(next);
      notifySaved(
        `Updated ${side.toUpperCase()} image for portfolio item "${
          portfolioItems.find((p) => p.id === itemId)?.title || itemId
        }".`
      );
    });
  };

  const handleAddNewPortfolioItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPfTitle.trim()) return;

    const categoryLabels: Record<ServiceCategory, string> = {
      clipping_path: 'Clipping Path & Cutout',
      ghost_mannequin: 'Ghost Mannequin 3D',
      jewelry_retouch: 'Jewelry Retouching',
      ecommerce_shadow: 'E-Commerce Ready',
      beauty_high_end: 'Photo Retouching & Beauty',
      color_variants: 'Real Estate HDR & Color',
    };

    const created: PortfolioItem = {
      id: `pf-custom-${Date.now()}`,
      title: newPfTitle.trim(),
      clientBrand: newPfBrand.trim() || 'FixPhoto Studio Client',
      category: newPfCategory,
      categoryLabel: categoryLabels[newPfCategory],
      artworkType: 'watch',
      turnaround: newPfTurnaround.trim() || '12h SLA',
      pricePerImage: newPfPrice.trim() || '$0.85 / frame',
      anchorNodes: 260,
      colorProfile: 'sRGB / AdobeRGB 16-Bit',
      beforeNotes: newPfBeforeNotes.trim(),
      afterNotes: newPfAfterNotes.trim(),
      metricsOutcome: newPfOutcome.trim(),
      aspectClass: 'h-72',
      colSpanClass: 'lg:col-span-1',
      beforeImageUrl: newPfBeforeImg || undefined,
      afterImageUrl: newPfAfterImg || undefined,
    };

    onUpdatePortfolioItems([created, ...portfolioItems]);
    setNewPfTitle('');
    setNewPfBrand('');
    setNewPfBeforeImg('');
    setNewPfAfterImg('');
    notifySaved(
      `Published new Before/After Portfolio item "${created.title}" to the live Portfolio page!`
    );
  };

  const handleServiceImageUpload = (
    slug: string,
    side: 'before' | 'after',
    file: File | undefined
  ) => {
    if (!file) return;
    readImageFileAsDataUrl(file, (dataUrl) => {
      const next = servicesList.map((s) => {
        if (s.slug !== slug) return s;
        return side === 'before'
          ? { ...s, beforeImageUrl: dataUrl }
          : { ...s, afterImageUrl: dataUrl };
      });
      onUpdateServicesList(next);
      notifySaved(
        `Uploaded custom ${side.toUpperCase()} image for service page "${slug}".`
      );
    });
  };

  const handleCreateCustomServicePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSrvName.trim().length < 2) return;
    const slug = newSrvName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');
    const rate = Math.max(0.1, Number(newSrvRate) || 0.65);
    const divList = servicesList.filter((s) => s.division === newSrvDivision);
    const idxNum =
      newSrvDivision === 'video_editing'
        ? `V${divList.length + 1}.`
        : `${String(divList.length + 1).padStart(2, '0')}.`;

    const created: ServiceDefinition = {
      id: 'clipping_path',
      slug,
      division: newSrvDivision,
      indexNumber: idxNum,
      title: newSrvName.trim(),
      shortNavTitle: newSrvName.trim(),
      ratePerImage: rate,
      unitLabel: newSrvDivision === 'video_editing' ? 'video edit' : 'image',
      turnaroundLabel:
        newSrvTurnaround.trim() || '12h–24h SLA · Dedicated Studio Pod',
      artworkType: newSrvArtwork,
      isCoreFocus: true,
      heroSubtitle:
        newSrvSubtitle.trim() ||
        `Pixel-perfect commercial ${newSrvName.trim()} executed by senior specialists with dual 400% zoom QA verification.`,
      summary:
        newSrvSubtitle.trim() ||
        `Dedicated studio production pod for ${newSrvName.trim()} with master archive delivery.`,
      deliverables:
        newSrvDeliverables.trim() ||
        (newSrvDivision === 'video_editing'
          ? '4K ProRes 422 HQ · H.264 MP4 · 16:9 & 9:16 Cuts'
          : 'Layered PSD · 16-Bit TIFF · Pure White #FFFFFF & Alpha PNG'),
      colSpan: 'lg:col-span-1',
      beforeImageUrl: newSrvBeforeImg || undefined,
      afterImageUrl: newSrvAfterImg || undefined,
      complexityTiers: [
        {
          tierName: `Basic ${newSrvName.trim()}`,
          pricePerImage: `$${rate.toFixed(2)} / ${
            newSrvDivision === 'video_editing' ? 'video' : 'image'
          }`,
          turnaround: '12 Hours SLA',
          description:
            'Standard commercial execution for clean studio captures.',
          examples: 'Single product packshots, standard catalog frames.',
        },
        {
          tierName: `Medium Complexity ${newSrvName.trim()}`,
          pricePerImage: `$${(rate * 1.4).toFixed(2)} / ${
            newSrvDivision === 'video_editing' ? 'video' : 'image'
          }`,
          turnaround: '12–24 Hours SLA',
          description:
            'Multi-layer masking, reflection balancing, and edge refinement.',
          examples: 'Multi-item sets, detailed textures, complex silhouettes.',
        },
        {
          tierName: `Complex Master ${newSrvName.trim()}`,
          pricePerImage: `$${(rate * 1.9).toFixed(2)} / ${
            newSrvDivision === 'video_editing' ? 'video' : 'image'
          }`,
          turnaround: '24–48 Hours SLA',
          description:
            'High-resolution print & campaign master retouching with Pantone calibration.',
          examples:
            'Hero lookbook spreads, macro luxury goods, composite key visuals.',
        },
      ],
      technicalSpecs: [
        {
          label: 'Execution Method',
          value: '100% Hand-Crafted Non-Destructive Studio Workflow',
        },
        {
          label: 'Color Calibration',
          value: 'AdobeRGB 1998, sRGB & Rec.709 Verified',
        },
        {
          label: 'Quality Assurance',
          value: 'Dual-Stage 400% Pixel-Perfect QA Audit',
        },
        {
          label: 'Delivery Security',
          value: '256-Bit Encrypted Client Portal & SFTP',
        },
      ],
      workflowHighlights: [
        {
          step: '01',
          title: 'RAW Preflight & Style Mapping',
          detail:
            'Your brand stylebook and ICC color profile are locked before editing begins.',
        },
        {
          step: '02',
          title: 'Senior Specialist Execution',
          detail:
            'Dedicated category specialists perform precision masking and retouching.',
        },
        {
          step: '03',
          title: '400% Zoom QA & Instant Delivery',
          detail:
            'Independent QA leads inspect every edge prior to master archive release.',
        },
      ],
      seoTitle:
        newSrvSeoTitle.trim() ||
        `${newSrvName.trim()} – FixPhoto Studio`,
      seoMetaDescription:
        newSrvSeoDesc.trim() ||
        newSrvSubtitle.trim() ||
        `Dedicated ${newSrvName.trim()} with 12h–24h SLA turnaround and 400% zoom QA.`,
    };

    onUpdateServicesList([...servicesList, created]);
    setEditingServiceSlug(created.slug);
    setNewSrvName('');
    setNewSrvSubtitle('');
    setNewSrvBeforeImg('');
    setNewSrvAfterImg('');
    setNewSrvSeoTitle('');
    setNewSrvSeoDesc('');
    notifySaved(
      `Created new Custom Service Page "${created.title}" (${created.indexNumber}) with SEO metadata!`
    );
  };

  const handleAddSampleToService = (
    e: React.FormEvent,
    service: ServiceDefinition
  ) => {
    e.preventDefault();
    if (!newSampleTitle.trim()) return;
    const sampleItem: ServiceSampleItem = {
      id: `sample-${Date.now()}`,
      title: newSampleTitle.trim(),
      complexityTag: newSampleTag.trim() || 'Studio Sample',
      turnaround: newSampleTurnaround.trim() || '12h SLA',
      specNote:
        newSampleNote.trim() ||
        'Hand-crafted commercial retouching with 400% QA verification.',
      artworkType: service.artworkType,
      beforeImageUrl: newSampleBeforeImg || undefined,
      afterImageUrl: newSampleAfterImg || undefined,
    };

    const existing = service.sampleGallery || [];
    const next = servicesList.map((s) =>
      s.slug === service.slug
        ? { ...s, sampleGallery: [sampleItem, ...existing] }
        : s
    );
    onUpdateServicesList(next);
    setNewSampleTitle('');
    setNewSampleNote('');
    setNewSampleBeforeImg('');
    setNewSampleAfterImg('');
    notifySaved(
      `Added new Before/After Sample Card to "${service.shortNavTitle}"!`
    );
  };

  const handleAddFaqToService = (
    e: React.FormEvent,
    service: ServiceDefinition
  ) => {
    e.preventDefault();
    if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) return;
    const faqItem: ServiceFaqItem = {
      question: newFaqQuestion.trim(),
      answer: newFaqAnswer.trim(),
    };
    const existing = service.faqs || [];
    const next = servicesList.map((s) =>
      s.slug === service.slug ? { ...s, faqs: [...existing, faqItem] } : s
    );
    onUpdateServicesList(next);
    setNewFaqQuestion('');
    setNewFaqAnswer('');
    notifySaved(`Added new FAQ item to "${service.shortNavTitle}"!`);
  };

  const handleAddEditorialBlockToService = (
    e: React.FormEvent,
    service: ServiceDefinition
  ) => {
    e.preventDefault();
    if (!newEditorialHeadline.trim() || !newEditorialParagraphs.trim()) return;

    const paragraphsList = newEditorialParagraphs
      .split('\n')
      .map((p) => p.trim())
      .filter(Boolean);
    const highlightsList = newEditorialHighlights
      .split(',')
      .map((h) => h.trim())
      .filter(Boolean);

    const newBlock: ServiceEditorialBlock = {
      id: `ed-${Date.now()}`,
      sectionBadge:
        newEditorialBadge.trim() || 'SECTION 01 · STUDIO CRAFTSMANSHIP',
      headline: newEditorialHeadline.trim(),
      paragraphs:
        paragraphsList.length > 0
          ? paragraphsList
          : [newEditorialParagraphs.trim()],
      highlightBadges: highlightsList,
      imagePosition: newEditorialImageSide,
      imageUrl: newEditorialImageUrl || undefined,
      captionTitle: service.shortNavTitle,
      captionMetric:
        newEditorialCaption.trim() || 'Faster Turnaround Time · 12h–24h SLA',
    };

    const existing = service.editorialBlocks || [];
    const next = servicesList.map((s) =>
      s.slug === service.slug
        ? { ...s, editorialBlocks: [...existing, newBlock] }
        : s
    );
    onUpdateServicesList(next);
    setNewEditorialHeadline('');
    setNewEditorialParagraphs('');
    setNewEditorialImageUrl('');
    notifySaved(
      `Added new Split Image + Text Section to "${service.shortNavTitle}"!`
    );
  };

  const handleAddVideoShowreel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVidTitle.trim()) return;

    const categoryLabels: Record<VideoShowreelProject['category'], string> = {
      ecommerce_product: 'E-Commerce Product Video',
      social_reels: 'Fashion & Social Reels',
      real_estate_drone: 'Real Estate & Drone Tour',
      wedding_cinema: 'Wedding & Event Cinema',
      color_vfx: 'DaVinci Color & VFX Roto',
    };

    const created: VideoShowreelProject = {
      id: `vid-custom-${Date.now()}`,
      title: newVidTitle.trim(),
      clientBrand: newVidClient.trim() || 'FixPhoto Video Client',
      category: newVidCategory,
      categoryLabel: categoryLabels[newVidCategory],
      duration: newVidDuration.trim() || '00:45',
      resolutionFps: '4K UHD · 60fps · ProRes 422 HQ',
      turnaround: newVidTurnaround.trim() || '24h SLA',
      priceLabel: newVidPrice.trim() || '$55 / video',
      lutProfile: 'DaVinci Resolve ACEScct → Rec.709',
      vfxHighlights: [
        '16:9 Master + 9:16 Vertical Cut',
        'DaVinci Resolve ACES Color Grade',
        'Frame-Accurate Roto & Sound Mix',
      ],
      outcomeMetric: newVidOutcome.trim() || '+38% Video Ad ROAS',
      serviceSlug: 'commercial-product-video-editing',
    };

    onUpdateVideoShowreelProjects([created, ...videoShowreelProjects]);
    setNewVidTitle('');
    setNewVidClient('');
    notifySaved(`Published new Video Showreel project "${created.title}"!`);
  };

  const handleAddCustomerReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revClientName.trim() || !revHeadline.trim() || !revQuote.trim()) return;

    const serviceMap: Record<ServiceCategory, string> = {
      clipping_path: 'Clipping Path & Vector Isolation',
      ghost_mannequin: 'Ghost Mannequin & Fashion Editing',
      jewelry_retouch: 'Jewelry Photo Retouching',
      beauty_high_end: 'High-End Beauty & Headshot Retouching',
      ecommerce_shadow: 'Product Photo Editing & Background Removal',
      color_variants: 'Real Estate HDR & Color Correction',
    };

    const created: CustomerReviewItem = {
      id: `rev-admin-${Date.now()}`,
      clientName: revClientName.trim(),
      role: revRole.trim() || 'Creative Director',
      company: revCompany.trim() || 'Global E-Commerce Studio',
      location: revLocation.trim() || 'New York, USA',
      serviceCategory: revCategory,
      serviceLabel: serviceMap[revCategory],
      rating: 5,
      verifiedOrderRef: `FPS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      imagesProcessed: '650+ Frames',
      headline: revHeadline.trim(),
      quote: revQuote.trim(),
      measurableResult:
        revOutcome.trim() || '100% On-Time SLA & Zero Revisions',
      dateLabel: 'November 2026',
    };

    onUpdateCustomerReviews([created, ...customerReviews]);
    setRevClientName('');
    setRevRole('');
    setRevCompany('');
    setRevLocation('');
    setRevHeadline('');
    setRevQuote('');
    setRevOutcome('');
    notifySaved(
      `Published verified review from "${created.clientName}" to the 3-card carousel!`
    );
  };

  const handleAddBlogPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlogTitle.trim() || !newBlogExcerpt.trim()) return;

    const cleanSlug =
      newBlogTitle
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || `blog-${Date.now()}`;

    const todayFormatted = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const createdBlog: StudioBlogPost = {
      id: `blog-${Date.now()}`,
      slug: cleanSlug,
      title: newBlogTitle.trim(),
      category: newBlogCategory.trim() || 'Studio Guide',
      excerpt: newBlogExcerpt.trim(),
      content:
        newBlogContent.trim() ||
        `${newBlogExcerpt.trim()}\n\nPublished by the FixPhoto Studio commercial retouching and 4K video post-production team.`,
      authorName: newBlogAuthorName.trim() || 'Elena Rostova',
      authorRole:
        newBlogAuthorRole.trim() || 'Lead Vector & Retouching Director',
      readTime: newBlogReadTime.trim() || '5 min read',
      publishedAt: todayFormatted,
      coverImageUrl: newBlogCoverImg || undefined,
      artworkType: 'watch',
      relatedServiceSlug: newBlogRelatedSlug || 'clipping-path-service',
      seoTitle:
        newBlogSeoTitle.trim() ||
        `${newBlogTitle.trim()} | FixPhoto Studio Blog`,
      seoMetaDescription:
        newBlogSeoDesc.trim() || newBlogExcerpt.trim().slice(0, 160),
    };

    // Prepend at index 0 so the newest/last added blog post ALWAYS shows 1st on the website
    onUpdateBlogPosts([createdBlog, ...blogPosts]);
    setNewBlogTitle('');
    setNewBlogExcerpt('');
    setNewBlogContent('');
    setNewBlogCoverImg('');
    setNewBlogSeoTitle('');
    setNewBlogSeoDesc('');
    notifySaved(
      `Published new Blog Post "${createdBlog.title}" as #1 (First) on the Website!`
    );
  };

  const handleExportAgencyBackupJson = () => {
    const payload = {
      databaseName: 'FixPhotoStudio_Enterprise_DB',
      schemaVersion: '2.0',
      exportedAt: new Date().toISOString(),
      firestoreDatabaseId: 'ai-studio-9e347d0e-d2b3-4eaa-96dd-d4e1bba0357d',
      summaryCounts: {
        ordersCount: orders.length,
        invoicesCount: notifications.filter((n) => Boolean(n.invoiceRef)).length,
        clientQueriesCount: clientQueries.length,
        servicesCount: servicesList.length,
        portfolioCount: portfolioItems.length,
        videoShowreelCount: videoShowreelProjects.length,
        reviewsCount: customerReviews.length,
        subscriptionPlansCount: subscriptionPlans.length,
        adminAccountsCount: adminAccounts.length,
      },
      collections: {
        adminAccounts,
        orders,
        orderApprovalMap,
        notifications,
        invoiceStatusMap,
        invoicePaymentInfo,
        clientQueries,
        siteConfig,
        mainMenuServices,
        servicesList,
        portfolioItems,
        videoShowreelProjects,
        customerReviews,
        subscriptionPlans,
      },
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FixPhotoStudio_Full_Database_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    notifySaved(
      'Downloaded complete FixPhotoStudio_Full_Database.json (All Orders, Queries, Invoices & CMS Tables).'
    );
  };

  const escapeSqlString = (val: unknown): string => {
    if (val === null || val === undefined) return 'NULL';
    const str = String(val)
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "''")
      .replace(/\r?\n/g, '\\n');
    return `'${str}'`;
  };

  const handleExportSqlDump = () => {
    const nowIso = new Date().toISOString();
    const lines: string[] = [
      '-- ============================================================================',
      '-- FixPhoto Studio Enterprise Database SQL Dump (MySQL / MariaDB / cPanel phpMyAdmin)',
      `-- Generated At: ${nowIso}`,
      '-- Firestore Reference ID: ai-studio-9e347d0e-d2b3-4eaa-96dd-d4e1bba0357d',
      '-- ============================================================================',
      '',
      'SET NAMES utf8mb4;',
      'SET FOREIGN_KEY_CHECKS = 0;',
      '',
      '-- ----------------------------------------------------------------------------',
      '-- 1. Table structure for `orders`',
      '-- ----------------------------------------------------------------------------',
      'CREATE TABLE IF NOT EXISTS `orders` (',
      '  `id` VARCHAR(64) NOT NULL,',
      '  `order_number` VARCHAR(64) NOT NULL,',
      '  `client_id` VARCHAR(128) NOT NULL,',
      '  `client_name` VARCHAR(255) NOT NULL,',
      '  `project_title` VARCHAR(255) NOT NULL,',
      '  `service_category` VARCHAR(100) NOT NULL,',
      '  `image_count` INT NOT NULL DEFAULT 0,',
      '  `turnaround_hours` INT NOT NULL DEFAULT 24,',
      '  `total_price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,',
      '  `status` VARCHAR(64) NOT NULL,',
      '  `approval_state` VARCHAR(32) NOT NULL DEFAULT \'pending\',',
      '  `progress_percent` INT NOT NULL DEFAULT 0,',
      '  `created_at` VARCHAR(64) NOT NULL,',
      '  PRIMARY KEY (`id`)',
      ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;',
      '',
    ];

    orders.forEach((ord) => {
      const approval =
        orderApprovalMap[ord.orderNumber] ||
        (ord.progressPercent > 0 ? 'approved' : 'pending');
      lines.push(
        `INSERT INTO \`orders\` (\`id\`, \`order_number\`, \`client_id\`, \`client_name\`, \`project_title\`, \`service_category\`, \`image_count\`, \`turnaround_hours\`, \`total_price\`, \`status\`, \`approval_state\`, \`progress_percent\`, \`created_at\`) VALUES (${escapeSqlString(
          ord.id
        )}, ${escapeSqlString(ord.orderNumber)}, ${escapeSqlString(
          ord.clientId
        )}, ${escapeSqlString(ord.clientName)}, ${escapeSqlString(
          ord.projectTitle
        )}, ${escapeSqlString(ord.serviceCategory)}, ${Number(
          ord.imageCount || 0
        )}, ${Number(ord.turnaroundHours || 24)}, ${Number(
          ord.totalPrice || 0
        ).toFixed(2)}, ${escapeSqlString(ord.status)}, ${escapeSqlString(
          approval
        )}, ${Number(ord.progressPercent || 0)}, ${escapeSqlString(
          String(ord.createdAt)
        )});`
      );
    });

    lines.push(
      '',
      '-- ----------------------------------------------------------------------------',
      '-- 2. Table structure for `client_queries`',
      '-- ----------------------------------------------------------------------------',
      'CREATE TABLE IF NOT EXISTS `client_queries` (',
      '  `id` VARCHAR(64) NOT NULL,',
      '  `query_number` VARCHAR(64) NOT NULL,',
      '  `source` VARCHAR(64) NOT NULL,',
      '  `status` VARCHAR(32) NOT NULL,',
      '  `client_name` VARCHAR(255) NOT NULL,',
      '  `client_email` VARCHAR(255) NOT NULL,',
      '  `phone` VARCHAR(64) DEFAULT NULL,',
      '  `company` VARCHAR(255) DEFAULT NULL,',
      '  `service_title` VARCHAR(255) NOT NULL,',
      '  `sample_files_count` INT NOT NULL DEFAULT 0,',
      '  `instructions` TEXT,',
      '  `created_at` VARCHAR(64) NOT NULL,',
      '  PRIMARY KEY (`id`)',
      ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;',
      ''
    );

    clientQueries.forEach((q) => {
      lines.push(
        `INSERT INTO \`client_queries\` (\`id\`, \`query_number\`, \`source\`, \`status\`, \`client_name\`, \`client_email\`, \`phone\`, \`company\`, \`service_title\`, \`sample_files_count\`, \`instructions\`, \`created_at\`) VALUES (${escapeSqlString(
          q.id
        )}, ${escapeSqlString(q.queryNumber)}, ${escapeSqlString(
          q.source
        )}, ${escapeSqlString(q.status)}, ${escapeSqlString(
          q.clientName
        )}, ${escapeSqlString(q.clientEmail)}, ${escapeSqlString(
          q.clientPhone || ''
        )}, ${escapeSqlString(q.companyName || '')}, ${escapeSqlString(
          q.serviceTitle
        )}, ${Number((q.sampleFiles || []).length)}, ${escapeSqlString(
          q.instructions
        )}, ${escapeSqlString(q.createdAt)});`
      );
    });

    lines.push(
      '',
      '-- ----------------------------------------------------------------------------',
      '-- 3. Table structure for `services`',
      '-- ----------------------------------------------------------------------------',
      'CREATE TABLE IF NOT EXISTS `services` (',
      '  `slug` VARCHAR(128) NOT NULL,',
      '  `division` VARCHAR(64) NOT NULL,',
      '  `title` VARCHAR(255) NOT NULL,',
      '  `short_nav_title` VARCHAR(128) NOT NULL,',
      '  `starting_price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,',
      '  `price_unit` VARCHAR(64) NOT NULL,',
      '  `turnaround_summary` VARCHAR(128) NOT NULL,',
      '  `full_json_payload` LONGTEXT NOT NULL,',
      '  PRIMARY KEY (`slug`)',
      ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;',
      ''
    );

    servicesList.forEach((srv) => {
      lines.push(
        `INSERT INTO \`services\` (\`slug\`, \`division\`, \`title\`, \`short_nav_title\`, \`starting_price\`, \`price_unit\`, \`turnaround_summary\`, \`full_json_payload\`) VALUES (${escapeSqlString(
          srv.slug
        )}, ${escapeSqlString(srv.division)}, ${escapeSqlString(
          srv.title
        )}, ${escapeSqlString(srv.shortNavTitle)}, ${Number(
          srv.ratePerImage || 0
        ).toFixed(2)}, ${escapeSqlString(srv.unitLabel)}, ${escapeSqlString(
          srv.turnaroundLabel
        )}, ${escapeSqlString(JSON.stringify(srv))});`
      );
    });

    lines.push(
      '',
      '-- ----------------------------------------------------------------------------',
      '-- 4. Table structure for `portfolio_items`',
      '-- ----------------------------------------------------------------------------',
      'CREATE TABLE IF NOT EXISTS `portfolio_items` (',
      '  `id` VARCHAR(64) NOT NULL,',
      '  `title` VARCHAR(255) NOT NULL,',
      '  `brand` VARCHAR(255) NOT NULL,',
      '  `category` VARCHAR(64) NOT NULL,',
      '  `price_per_image` VARCHAR(64) NOT NULL,',
      '  `turnaround` VARCHAR(64) NOT NULL,',
      '  `full_json_payload` LONGTEXT NOT NULL,',
      '  PRIMARY KEY (`id`)',
      ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;',
      ''
    );

    portfolioItems.forEach((pf) => {
      lines.push(
        `INSERT INTO \`portfolio_items\` (\`id\`, \`title\`, \`brand\`, \`category\`, \`price_per_image\`, \`turnaround\`, \`full_json_payload\`) VALUES (${escapeSqlString(
          pf.id
        )}, ${escapeSqlString(pf.title)}, ${escapeSqlString(
          pf.clientBrand
        )}, ${escapeSqlString(pf.category)}, ${escapeSqlString(
          pf.pricePerImage
        )}, ${escapeSqlString(pf.turnaround)}, ${escapeSqlString(
          JSON.stringify(pf)
        )});`
      );
    });

    lines.push(
      '',
      '-- ----------------------------------------------------------------------------',
      '-- 5. Table structure for `customer_reviews`',
      '-- ----------------------------------------------------------------------------',
      'CREATE TABLE IF NOT EXISTS `customer_reviews` (',
      '  `id` VARCHAR(64) NOT NULL,',
      '  `client_name` VARCHAR(255) NOT NULL,',
      '  `company` VARCHAR(255) NOT NULL,',
      '  `service_label` VARCHAR(255) NOT NULL,',
      '  `rating` INT NOT NULL DEFAULT 5,',
      '  `headline` VARCHAR(255) NOT NULL,',
      '  `quote` TEXT NOT NULL,',
      '  PRIMARY KEY (`id`)',
      ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;',
      ''
    );

    customerReviews.forEach((rev) => {
      lines.push(
        `INSERT INTO \`customer_reviews\` (\`id\`, \`client_name\`, \`company\`, \`service_label\`, \`rating\`, \`headline\`, \`quote\`) VALUES (${escapeSqlString(
          rev.id
        )}, ${escapeSqlString(rev.clientName)}, ${escapeSqlString(
          rev.company
        )}, ${escapeSqlString(rev.serviceLabel)}, ${Number(
          rev.rating || 5
        )}, ${escapeSqlString(rev.headline)}, ${escapeSqlString(rev.quote)});`
      );
    });

    lines.push('', 'SET FOREIGN_KEY_CHECKS = 1;', '');

    const blob = new Blob([lines.join('\n')], {
      type: 'application/sql;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FixPhotoStudio_MySQL_Database_${new Date().toISOString().slice(0, 10)}.sql`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    notifySaved(
      'Downloaded FixPhotoStudio_MySQL_Database.sql! Ready for cPanel phpMyAdmin or MySQL import.'
    );
  };

  const escapeCsvCell = (val: unknown): string => {
    const str = val === null || val === undefined ? '' : String(val);
    return `"${str.replace(/"/g, '""')}"`;
  };

  const handleExportCsvTable = (
    tableType: 'orders' | 'queries' | 'invoices' | 'services'
  ) => {
    let headers: string[] = [];
    let rows: string[][] = [];
    let filename = '';

    if (tableType === 'orders') {
      filename = `FixPhotoStudio_Orders_${new Date().toISOString().slice(0, 10)}.csv`;
      headers = [
        'Order Number',
        'Client Name',
        'Client ID',
        'Project Title',
        'Service Category',
        'Image Count',
        'Turnaround Hours',
        'Total Price ($)',
        'Approval Status',
        'Pipeline Stage',
        'Progress (%)',
        'Created At',
      ];
      rows = orders.map((o) => [
        o.orderNumber,
        o.clientName,
        o.clientId,
        o.projectTitle,
        o.serviceCategory,
        String(o.imageCount),
        String(o.turnaroundHours),
        String(o.totalPrice),
        orderApprovalMap[o.orderNumber] ||
          (o.progressPercent > 0 ? 'approved' : 'pending'),
        o.status,
        String(o.progressPercent),
        String(o.createdAt),
      ]);
    } else if (tableType === 'queries') {
      filename = `FixPhotoStudio_Client_Queries_${new Date().toISOString().slice(0, 10)}.csv`;
      headers = [
        'Query Number',
        'Source',
        'Status',
        'Client Name',
        'Client Email',
        'Phone / WhatsApp',
        'Company',
        'Service Title',
        'Uploaded Sample Files',
        'Instructions',
        'Created At',
      ];
      rows = clientQueries.map((q) => [
        q.queryNumber,
        q.source,
        q.status,
        q.clientName,
        q.clientEmail,
        q.clientPhone || '',
        q.companyName || '',
        q.serviceTitle,
        (q.sampleFiles || []).join('; '),
        q.instructions,
        q.createdAt,
      ]);
    } else if (tableType === 'invoices') {
      filename = `FixPhotoStudio_Invoices_${new Date().toISOString().slice(0, 10)}.csv`;
      headers = [
        'Invoice Ref',
        'Amount',
        'Payment Status',
        'Subject / Title',
        'Message',
        'Created At',
      ];
      const invList = notifications.filter((n) => Boolean(n.invoiceRef));
      rows = invList.map((n) => {
        const st =
          invoiceStatusMap[n.invoiceRef] ||
          (n.title.toUpperCase().includes('[PAID]') ? 'paid' : 'pending');
        return [
          n.invoiceRef,
          n.amountFormatted,
          st.toUpperCase(),
          n.title,
          n.message,
          String(n.createdAt),
        ];
      });
    } else {
      filename = `FixPhotoStudio_Services_Catalog_${new Date().toISOString().slice(0, 10)}.csv`;
      headers = [
        'Slug',
        'Division',
        'Service Title',
        'Short Menu Title',
        'Starting Rate ($)',
        'Price Unit',
        'Turnaround Summary',
        'Complexity Tiers Count',
        'Editorial Split Blocks Count',
      ];
      rows = servicesList.map((s) => [
        s.slug,
        s.division,
        s.title,
        s.shortNavTitle,
        String(s.ratePerImage),
        s.unitLabel,
        s.turnaroundLabel,
        String((s.complexityTiers || []).length),
        String((s.editorialBlocks || []).length),
      ]);
    }

    const csvContent = [
      headers.map(escapeCsvCell).join(','),
      ...rows.map((r) => r.map(escapeCsvCell).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    notifySaved(`Downloaded ${filename} spreadsheet export!`);
  };

  const handleImportDatabaseJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const src = parsed.collections || parsed;
        if (src.siteConfig) onUpdateSiteConfig(src.siteConfig);
        if (Array.isArray(src.mainMenuServices))
          onUpdateMainMenuServices(src.mainMenuServices);
        if (Array.isArray(src.servicesList))
          onUpdateServicesList(src.servicesList);
        if (Array.isArray(src.portfolioItems))
          onUpdatePortfolioItems(src.portfolioItems);
        if (Array.isArray(src.videoShowreelProjects))
          onUpdateVideoShowreelProjects(src.videoShowreelProjects);
        if (Array.isArray(src.customerReviews))
          onUpdateCustomerReviews(src.customerReviews);
        if (Array.isArray(src.subscriptionPlans))
          onUpdateSubscriptionPlans(src.subscriptionPlans);
        if (Array.isArray(src.clientQueries))
          onUpdateClientQueries(src.clientQueries);
        if (src.invoicePaymentInfo)
          onUpdateInvoicePaymentInfo(src.invoicePaymentInfo);
        if (Array.isArray(src.adminAccounts) && isMainSuperAdmin) {
          saveAdminAccountsList(src.adminAccounts);
        }

        notifySaved(
          `Successfully restored database from "${file.name}"! All services, queries, portfolio items & settings updated.`
        );
      } catch {
        notifySaved(
          'Invalid JSON backup file. Please upload a valid FixPhotoStudio_Full_Database.json file.'
        );
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Computed Agency Metrics
  const pendingApprovalOrdersCount = orders.filter(
    (ord) =>
      orderApprovalMap[ord.orderNumber] === 'pending' ||
      (orderApprovalMap[ord.orderNumber] !== 'approved' &&
        ord.progressPercent === 0)
  ).length;

  const newQueriesCount = clientQueries.filter(
    (q) => q.status === 'new'
  ).length;

  const invoiceNotifications = notifications.filter((n) =>
    Boolean(n.invoiceRef)
  );
  const pendingInvoicesCount = invoiceNotifications.filter((n) => {
    const st =
      invoiceStatusMap[n.invoiceRef] ||
      (n.title.toUpperCase().includes('[PAID]') ? 'paid' : 'pending');
    return st === 'pending';
  }).length;

  const totalOrderRevenue = orders.reduce(
    (sum, ord) => sum + (ord.totalPrice || 0),
    0
  );

  // =========================================================================
  // PAGE 1: DEDICATED STANDALONE ADMIN LOGIN PAGE (#admin-login)
  // =========================================================================
  if (!adminUnlocked && !isAuthenticatedGoogleAdmin) {
    return (
      <div className="min-h-screen w-full bg-[#040D21] text-white flex flex-col justify-between p-6 sm:p-10">
        {/* Top Bar: Brand + Back to Public Website */}
        <div className="max-w-5xl w-full mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0088FF] to-[#00B8FF] flex items-center justify-center text-white font-bold shadow-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-mono-tabular uppercase tracking-widest text-[#00B8FF] font-semibold">
                FIXPHOTO STUDIO · ENTERPRISE BACK-OFFICE
              </p>
              <p className="text-base font-bold text-white">
                Master Admin Control Center
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onExitAdminToLiveSite}
            className="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-blue-200 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>← Back to Public Website</span>
          </button>
        </div>

        {/* Centered Clean Admin Sign-In Form */}
        <div className="my-auto flex items-center justify-center py-8">
          <div className="max-w-md w-full bg-[#0B1D42] border border-[#1E3A70] rounded-2xl p-8 space-y-6 shadow-2xl">
            <div className="space-y-2 border-b border-white/10 pb-5">
              <div className="inline-flex items-center gap-2 text-xs font-mono-tabular text-[#00B8FF] font-semibold">
                <Lock className="w-3.5 h-3.5" />
                <span>ADMINISTRATOR AUTHENTICATION</span>
              </div>
              <h1 className="text-2xl font-bold text-white">
                Sign In to Admin Panel
              </h1>
              <p className="text-xs text-slate-300">
                Enter your administrator credentials to open the standalone FixPhoto Studio management dashboard.
              </p>
            </div>

            <form onSubmit={handleAdminPasswordLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-blue-100 mb-1.5">
                  Administrator Email Address
                </label>
                <input
                  type="text"
                  required
                  autoComplete="username"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="asiaclipp@gmail.com"
                  className="w-full px-3.5 py-2.5 text-xs rounded-lg bg-[#051026] border border-[#234582] text-white focus:outline-none focus:border-[#00B8FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-blue-100 mb-1.5">
                  Administrator Password
                </label>
                <div className="relative">
                  <input
                    type={showPasscode ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={loginPasscode}
                    onChange={(e) => setLoginPasscode(e.target.value)}
                    placeholder="Enter administrator password"
                    className="w-full pl-3.5 pr-10 py-2.5 text-xs font-mono-tabular rounded-lg bg-[#051026] border border-[#234582] text-white focus:outline-none focus:border-[#00B8FF]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasscode((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    aria-label="Toggle password visibility"
                  >
                    {showPasscode ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none pt-1">
                <input
                  type="checkbox"
                  checked={rememberSession}
                  onChange={(e) => setRememberSession(e.target.checked)}
                  className="rounded border-slate-600 text-[#0088FF] focus:ring-0"
                />
                <span>Keep me signed in on this browser</span>
              </label>

              {loginError && (
                <div className="p-3 rounded-lg bg-red-950/80 border border-red-500/40 text-xs text-red-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 text-xs font-bold text-white bg-gradient-to-r from-[#0088FF] to-[#00B8FF] hover:from-[#006FE0] hover:to-[#0088FF] rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Sign In to Admin Dashboard →</span>
              </button>
            </form>
          </div>
        </div>

        {/* Minimal Footer */}
        <div className="max-w-5xl w-full mx-auto pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <span>FixPhoto Studio Enterprise CMS · Dedicated Admin Route</span>
          <span className="font-mono-tabular text-slate-400">
            256-Bit Encrypted Admin Session
          </span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // PAGE 2: DEDICATED STANDALONE PROFESSIONAL ADMIN DASHBOARD (#admin-dashboard)
  // =========================================================================
  const activeEditService =
    servicesList.find((s) => s.slug === editingServiceSlug) || servicesList[0];

  const photoPodsCount = servicesList.filter(
    (s) => s.division === 'photo_editing'
  ).length;
  const videoPodsCount = servicesList.filter(
    (s) => s.division === 'video_editing'
  ).length;

  const sidebarGroups: {
    groupTitle: string;
    items: {
      id: AdminTab;
      label: string;
      icon: React.ReactNode;
      badge?: string | number;
      badgeTone?: 'amber' | 'blue' | 'emerald' | 'slate';
    }[];
  }[] = [
    {
      groupTitle: 'EXECUTIVE OVERVIEW',
      items: [
        {
          id: 'dashboard_overview',
          label: 'Dashboard Overview',
          icon: <LayoutDashboard className="w-4 h-4" />,
        },
      ],
    },
    {
      groupTitle: 'OPERATIONS & BILLING',
      items: [
        {
          id: 'plans_and_orders',
          label: 'Orders & Work Pipeline',
          icon: <ShoppingBag className="w-4 h-4" />,
          badge:
            pendingApprovalOrdersCount > 0
              ? `${pendingApprovalOrdersCount} Pending`
              : orders.length,
          badgeTone: pendingApprovalOrdersCount > 0 ? 'amber' : 'slate',
        },
        {
          id: 'invoices_billing',
          label: 'Invoices & Payment Setup',
          icon: <CreditCard className="w-4 h-4" />,
          badge:
            pendingInvoicesCount > 0
              ? `${pendingInvoicesCount} Unpaid`
              : 'Paid',
          badgeTone: pendingInvoicesCount > 0 ? 'amber' : 'emerald',
        },
        {
          id: 'client_queries',
          label: 'Client Queries & Trials',
          icon: <MessageSquare className="w-4 h-4" />,
          badge:
            newQueriesCount > 0 ? `${newQueriesCount} New` : clientQueries.length,
          badgeTone: newQueriesCount > 0 ? 'blue' : 'slate',
        },
      ],
    },
    {
      groupTitle: 'WEBSITE CONTENT (CMS)',
      items: [
        {
          id: 'menu_and_services',
          label: 'Service Pages & Builder',
          icon: <Layers className="w-4 h-4" />,
          badge: servicesList.length,
          badgeTone: 'slate',
        },
        {
          id: 'portfolio_before_after',
          label: 'Portfolio Before / After',
          icon: <Camera className="w-4 h-4" />,
          badge: portfolioItems.length,
          badgeTone: 'slate',
        },
        {
          id: 'video_studio_showreel',
          label: 'Video Studio Showreels',
          icon: <Film className="w-4 h-4" />,
          badge: videoShowreelProjects.length,
          badgeTone: 'slate',
        },
        {
          id: 'reviews_carousel',
          label: 'Client Reviews CMS',
          icon: <Star className="w-4 h-4" />,
          badge: customerReviews.length,
          badgeTone: 'slate',
        },
        {
          id: 'blog_manager',
          label: 'Blog Posts CMS (Newest 1st)',
          icon: <BookOpen className="w-4 h-4" />,
          badge: blogPosts.length,
          badgeTone: 'blue',
        },
        {
          id: 'seo_manager',
          label: 'All Pages & Blog SEO',
          icon: <Sparkles className="w-4 h-4" />,
          badge: 'Title & Meta',
          badgeTone: 'emerald',
        },
        {
          id: 'global_hero_footer',
          label: 'Site Settings & Hero',
          icon: <Globe className="w-4 h-4" />,
        },
      ],
    },
    {
      groupTitle: 'SYSTEM, ADMINS & DATABASE',
      items: [
        {
          id: 'admin_accounts',
          label: 'Create Admin Account',
          icon: <ShieldCheck className="w-4 h-4" />,
          badge: `${adminAccounts.length} Admins`,
          badgeTone: 'blue',
        },
        {
          id: 'database_backup',
          label: 'Database Download & SQL',
          icon: <Download className="w-4 h-4" />,
          badge: 'JSON / SQL',
          badgeTone: 'emerald',
        },
      ],
    },
  ];

  const activeTabMeta: Record<AdminTab, { title: string; subtitle: string }> = {
    dashboard_overview: {
      title: 'Executive Dashboard Overview',
      subtitle:
        'Real-time summary of studio orders, pending approvals, client inquiries, invoices, and website content.',
    },
    plans_and_orders: {
      title: 'Customer Orders & 6-Stage Production Pipeline',
      subtitle:
        'Approve pending orders and update real-time production stages synced directly to the Client Portal.',
    },
    invoices_billing: {
      title: 'Customer Invoices & Payment Gateway Configuration',
      subtitle:
        'Toggle invoice status between PENDING and PAID, and customize company name, address, and payment details on all PDF invoices.',
    },
    client_queries: {
      title: 'Client Queries, Free Trial Leads & Custom Quotes',
      subtitle:
        'Review inquiries from visitors and logged-in clients, update status, and inspect automated email logs.',
    },
    menu_and_services: {
      title: 'Service Pages, Split Image+Text Sections, Pricing & SEO CMS',
      subtitle:
        'Create new Photo or Video service pages, edit SEO Title & Meta Description, add Split Image+Text blocks, and edit complexity tiers.',
    },
    portfolio_before_after: {
      title: 'Portfolio Before & After Image Manager',
      subtitle:
        'Upload new Before/After interactive comparison cards or replace images on existing portfolio items.',
    },
    video_studio_showreel: {
      title: 'Video Post-Production Showreel Manager',
      subtitle:
        'Add and edit 4K commercial video editing, color grading, and VFX rotoscoping showreel projects.',
    },
    reviews_carousel: {
      title: 'Verified Client Reviews Manager',
      subtitle:
        'Publish new client testimonials and manage the 3-card customer review showcase.',
    },
    blog_manager: {
      title: 'Studio Blog Posts & SEO Manager (Latest Blog Shown 1st)',
      subtitle:
        'Publish new blog articles (automatically shown 1st on the website after Reviews), edit existing articles, and customize each blog SEO Title & Meta Description.',
    },
    seo_manager: {
      title: 'On-Page SEO Manager — All Website Pages, Service Pages & Blog Posts',
      subtitle:
        'Edit live SEO Title (<title>), Meta Description (<meta name="description">), OpenGraph tags, and Schema.org JSON-LD for every page and blog on your website.',
    },
    global_hero_footer: {
      title: 'Global Website Settings, Homepage Hero & Footer Copy',
      subtitle:
        'Customize the homepage hero headline, proof counters, and footer information.',
    },
    admin_accounts: {
      title: 'Create Admin Account & Strict Master Admin Access Control',
      subtitle:
        'Logged in as Master Admin (asiaclipp@gmail.com): create new Admin accounts, change the master password, or revoke sub-admin access.',
    },
    database_backup: {
      title: 'Database Download, SQL Export & Backup Center',
      subtitle:
        'Download your entire database in JSON, MySQL/cPanel (.sql), or Excel (.csv) formats, or restore from a backup file.',
    },
  };

  return (
    <div className="min-h-screen w-full bg-[#F1F5F9] text-[#0B1933] flex flex-col lg:flex-row">
      {/* =====================================================================
          LEFT FIXED SIDEBAR NAVIGATION (PROFESSIONAL ADMIN BACK-OFFICE)
         ===================================================================== */}
      <aside className="w-full lg:w-72 bg-[#051129] text-white flex flex-col justify-between shrink-0 border-b lg:border-b-0 lg:border-r border-slate-800 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
        <div className="p-5 space-y-6">
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0088FF] to-[#00B8FF] flex items-center justify-center text-white shadow-md">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-mono-tabular uppercase tracking-widest text-[#00B8FF] font-bold">
                  FIXPHOTO STUDIO
                </p>
                <p className="text-sm font-bold text-white">
                  Admin Control Panel
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono-tabular font-bold">
              PRO CMS
            </span>
          </div>

          {/* Grouped Sidebar Navigation */}
          <div className="space-y-6">
            {sidebarGroups.map((group) => (
              <div key={group.groupTitle} className="space-y-1.5">
                <p className="px-3 text-[10px] font-mono-tabular font-bold tracking-wider text-slate-400 uppercase">
                  {group.groupTitle}
                </p>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setActiveTab(item.id);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between gap-2 ${
                          isActive
                            ? 'bg-[#0088FF] text-white shadow-md'
                            : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                        }`}
                      >
                        <span className="flex items-center gap-2.5 truncate">
                          <span
                            className={
                              isActive ? 'text-white' : 'text-[#00B8FF]'
                            }
                          >
                            {item.icon}
                          </span>
                          <span className="truncate">{item.label}</span>
                        </span>

                        {item.badge !== undefined && (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono-tabular font-bold shrink-0 ${
                              isActive
                                ? 'bg-white text-[#001E5A]'
                                : item.badgeTone === 'amber'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                                : item.badgeTone === 'blue'
                                ? 'bg-[#0088FF]/30 text-[#00B8FF] border border-[#00B8FF]/30'
                                : item.badgeTone === 'emerald'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                                : 'bg-white/10 text-slate-300'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Bottom Admin Profile & Sign Out */}
        <div className="p-5 border-t border-white/10 bg-[#030B1B] space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] font-mono-tabular text-emerald-400 font-semibold">
                ● {isMainSuperAdmin ? 'MAIN SUPER ADMIN' : 'SUB-ADMIN SESSION'}
              </p>
              <p className="text-xs font-bold text-white truncate">
                {loggedInAdminEmail || googleEmail || 'asiaclipp@gmail.com'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onExitAdminToLiveSite}
              className="py-2 px-3 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#00B8FF]" />
              <span>Live Site</span>
            </button>

            <button
              type="button"
              onClick={handleSignOutAdmin}
              className="py-2 px-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* =====================================================================
          RIGHT MAIN ADMIN WORKSPACE
         ===================================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Sticky Admin Command Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono-tabular text-slate-500">
              <span>ADMIN CONSOLE</span>
              <span>/</span>
              <span className="text-[#0088FF] font-semibold uppercase">
                {activeTab.replace(/_/g, ' ')}
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-[#001E5A]">
              {activeTabMeta[activeTab].title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {pendingApprovalOrdersCount > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab('plans_and_orders')}
                className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>{pendingApprovalOrdersCount} Pending Orders</span>
              </button>
            )}

            {newQueriesCount > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab('client_queries')}
                className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#001E5A] text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5 text-[#0088FF]" />
                <span>{newQueriesCount} New Queries</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setActiveTab('admin_accounts')}
              className="px-3 py-1.5 text-xs font-bold text-[#001E5A] bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#0088FF]" />
              <span className="hidden sm:inline">Manage Admins</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('database_backup')}
              className="px-3 py-1.5 text-xs font-bold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Database</span>
            </button>

            {isMainSuperAdmin && (
              <button
                type="button"
                onClick={() => {
                  onResetAllToDefaults();
                  notifySaved('Restored default studio catalog & configuration.');
                }}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset Defaults</span>
              </button>
            )}

            <button
              type="button"
              onClick={onExitAdminToLiveSite}
              className="px-4 py-2 text-xs font-bold text-white bg-[#001E5A] hover:bg-[#0088FF] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Visit Live Website ↗</span>
            </button>
          </div>
        </header>

        {/* Main Workspace Container */}
        <div className="p-6 lg:p-8 max-w-[1400px] w-full mx-auto space-y-8 flex-1">
          {saveToast && (
            <div className="flex items-center justify-between gap-4 bg-emerald-50 border border-emerald-300 text-emerald-950 rounded-xl px-4 py-3 text-xs font-semibold shadow-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{saveToast}</span>
              </div>
              <button
                type="button"
                onClick={() => setSaveToast(null)}
                className="text-emerald-700 hover:underline font-bold"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* ===================================================================
              MODULE 0: EXECUTIVE DASHBOARD OVERVIEW
             =================================================================== */}
          {activeTab === 'dashboard_overview' && (
            <div className="space-y-8">
              {/* Top 4 Executive KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono-tabular font-bold text-slate-500">
                      TOTAL ORDERS & PIPELINE
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0088FF] flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="my-3">
                    <p className="text-3xl font-bold font-mono-tabular text-[#001E5A]">
                      {orders.length}
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      <strong className="text-amber-600">
                        {pendingApprovalOrdersCount} pending approval
                      </strong>{' '}
                      · ${totalOrderRevenue.toFixed(2)} volume
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('plans_and_orders')}
                    className="text-xs font-bold text-[#0088FF] hover:text-[#001E5A] flex items-center gap-1"
                  >
                    <span>Manage Orders & Work Process</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono-tabular font-bold text-slate-500">
                      INVOICES & BILLING
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <CreditCard className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="my-3">
                    <p className="text-3xl font-bold font-mono-tabular text-[#001E5A]">
                      {invoiceNotifications.length}
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      <strong className="text-amber-600">
                        {pendingInvoicesCount} pending payment
                      </strong>{' '}
                      · {invoiceNotifications.length - pendingInvoicesCount} paid
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('invoices_billing')}
                    className="text-xs font-bold text-[#0088FF] hover:text-[#001E5A] flex items-center gap-1"
                  >
                    <span>Manage Invoices & Payment Info</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono-tabular font-bold text-slate-500">
                      CLIENT QUERIES & TRIALS
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="my-3">
                    <p className="text-3xl font-bold font-mono-tabular text-[#001E5A]">
                      {clientQueries.length}
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      <strong className="text-[#0088FF]">
                        {newQueriesCount} new unread
                      </strong>{' '}
                      · Auto-emails active
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('client_queries')}
                    className="text-xs font-bold text-[#0088FF] hover:text-[#001E5A] flex items-center gap-1"
                  >
                    <span>Open Client Queries Inbox</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono-tabular font-bold text-slate-500">
                      LIVE SERVICE PAGES
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Layers className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="my-3">
                    <p className="text-3xl font-bold font-mono-tabular text-[#001E5A]">
                      {servicesList.length}
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      {photoPodsCount} Photo · {videoPodsCount} Video Pages
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('menu_and_services')}
                    className="text-xs font-bold text-[#0088FF] hover:text-[#001E5A] flex items-center gap-1"
                  >
                    <span>Edit Services & Split Sections</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Recent Orders & Recent Client Queries Side-by-Side */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Recent Orders & Quick Approval */}
                <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <h2 className="text-base font-bold text-[#001E5A]">
                        Recent Customer Orders & Approval Status
                      </h2>
                      <p className="text-xs text-slate-500">
                        Approve new orders or advance their live production stage
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('plans_and_orders')}
                      className="px-3 py-1.5 rounded-lg bg-[#EAF3FC] text-[#001E5A] hover:bg-[#001E5A] hover:text-white text-xs font-bold transition-colors"
                    >
                      View All ({orders.length}) →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {orders.slice(0, 4).map((ord) => {
                      const isPendingApproval =
                        orderApprovalMap[ord.orderNumber] === 'pending' ||
                        (orderApprovalMap[ord.orderNumber] !== 'approved' &&
                          ord.progressPercent === 0);
                      const invRef = `INV-${ord.orderNumber}`;
                      const ordInvoiceStatus: InvoicePaymentStatus =
                        invoiceStatusMap[invRef] ||
                        invoiceStatusMap[ord.orderNumber] ||
                        'pending';

                      return (
                        <div
                          key={ord.id}
                          className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 flex flex-wrap items-center justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tabular">
                              <span className="font-bold text-[#001E5A]">
                                {ord.orderNumber}
                              </span>
                              <span>·</span>
                              <span className="text-slate-600">
                                {ord.clientName || 'Studio Client'}
                              </span>
                              <span>·</span>
                              {isPendingApproval ? (
                                <span className="text-amber-700 font-bold">
                                  ● PENDING APPROVAL
                                </span>
                              ) : (
                                <span className="text-emerald-700 font-bold">
                                  ● APPROVED ({ord.progressPercent}%)
                                </span>
                              )}
                              <span>·</span>
                              <span
                                className={
                                  ordInvoiceStatus === 'paid'
                                    ? 'text-emerald-700 font-bold'
                                    : 'text-amber-700 font-bold'
                                }
                              >
                                Invoice: {ordInvoiceStatus.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-sm font-bold text-[#001E5A]">
                              {ord.projectTitle}
                            </p>
                            <p className="text-xs text-slate-500 font-mono-tabular">
                              {ord.imageCount} frames · {ord.turnaroundHours}h SLA · $
                              {ord.totalPrice.toFixed(2)} USD
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            {isPendingApproval ? (
                              <button
                                type="button"
                                onClick={async () => {
                                  await onApproveOrder(ord);
                                  notifySaved(
                                    `Order ${ord.orderNumber} APPROVED and started production!`
                                  );
                                }}
                                className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Approve Order</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setActiveTab('plans_and_orders')}
                                className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-[#0088FF] text-xs font-semibold text-[#001E5A]"
                              >
                                Update Stage
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recent Client Queries */}
                <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <h2 className="text-base font-bold text-[#001E5A]">
                        Latest Client Queries & Trial Leads
                      </h2>
                      <p className="text-xs text-slate-500">
                        Public & logged-in inquiries with email confirmation
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('client_queries')}
                      className="px-3 py-1.5 rounded-lg bg-[#EAF3FC] text-[#001E5A] hover:bg-[#001E5A] hover:text-white text-xs font-bold transition-colors"
                    >
                      All Queries ({clientQueries.length}) →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {clientQueries.slice(0, 4).map((q) => (
                      <div
                        key={q.id}
                        className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs font-mono-tabular">
                          <span className="font-bold text-[#0088FF]">
                            {q.queryNumber}
                          </span>
                          <span className="uppercase font-bold text-[10px] text-slate-600">
                            {q.status}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-[#001E5A]">
                          {q.clientName} ({q.clientEmail})
                        </p>
                        <p className="text-xs text-slate-600 line-clamp-2">
                          {q.instructions}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick CMS Module Launcher Grid */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                <h2 className="text-base font-bold text-[#001E5A]">
                  Website Content Management (CMS) — Quick Access
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {[
                    {
                      tab: 'menu_and_services' as AdminTab,
                      title: 'Service Pages & Sections',
                      desc: `Edit ${servicesList.length} services, Split Image+Text blocks & pricing`,
                    },
                    {
                      tab: 'portfolio_before_after' as AdminTab,
                      title: 'Portfolio Before/After',
                      desc: `Upload & manage ${portfolioItems.length} comparison pairs`,
                    },
                    {
                      tab: 'video_studio_showreel' as AdminTab,
                      title: 'Video Showreel Studio',
                      desc: `Manage ${videoShowreelProjects.length} 4K video showreel projects`,
                    },
                    {
                      tab: 'reviews_carousel' as AdminTab,
                      title: 'Client Reviews CMS',
                      desc: `Add & edit ${customerReviews.length} verified client reviews`,
                    },
                    {
                      tab: 'global_hero_footer' as AdminTab,
                      title: 'Global Hero & Footer',
                      desc: 'Edit homepage headlines, metrics & subscription plans',
                    },
                  ].map((card) => (
                    <button
                      key={card.tab}
                      type="button"
                      onClick={() => setActiveTab(card.tab)}
                      className="p-4 rounded-xl bg-[#F8FAFC] hover:bg-[#EAF3FC] border border-slate-200 hover:border-[#0088FF] text-left transition-all group flex flex-col justify-between gap-3"
                    >
                      <div>
                        <p className="text-sm font-bold text-[#001E5A] group-hover:text-[#0088FF]">
                          {card.title}
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          {card.desc}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-[#0088FF] flex items-center gap-1">
                        <span>Open Editor</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              MODULE 1: ORDERS APPROVAL & 6-STAGE WORK PROCESS MANAGER
             =================================================================== */}
          {activeTab === 'plans_and_orders' && (
            <div className="space-y-8">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <p className="text-xs font-mono-tabular font-bold text-[#0088FF]">
                      CUSTOMER ORDER APPROVAL & LIVE WORK PROCESS CONTROL
                    </p>
                    <h2 className="text-lg font-bold text-[#001E5A]">
                      Approve Pending Orders & Update Customer 6-Stage Work Process ({orders.length})
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('invoices_billing')}
                    className="px-3.5 py-2 rounded-lg bg-[#EAF3FC] hover:bg-[#001E5A] text-[#001E5A] hover:text-white text-xs font-bold transition-colors"
                  >
                    Open Invoice & Payment Setup →
                  </button>
                </div>

                {orders.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">
                    No customer orders yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {orders.map((ord) => {
                      const isPendingApproval =
                        orderApprovalMap[ord.orderNumber] === 'pending' ||
                        (orderApprovalMap[ord.orderNumber] !== 'approved' &&
                          ord.progressPercent === 0);
                      const invRef = `INV-${ord.orderNumber}`;
                      const ordInvoiceStatus: InvoicePaymentStatus =
                        invoiceStatusMap[invRef] ||
                        invoiceStatusMap[ord.orderNumber] ||
                        'pending';
                      const activeStageObj = PIPELINE_STAGES.find(
                        (s) => s.status === ord.status
                      );

                      return (
                        <div
                          key={ord.id}
                          className="p-5 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-4"
                        >
                          {/* Top Row: Order Summary + Approval Action + Invoice Status Action */}
                          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-3.5">
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tabular">
                                <span className="font-bold text-[#001E5A] text-sm">
                                  {ord.orderNumber}
                                </span>
                                <span>·</span>
                                <span className="font-semibold text-slate-700">
                                  Client: {ord.clientName || 'Studio Client'}
                                </span>
                                <span>·</span>
                                {isPendingApproval ? (
                                  <span className="text-amber-700 font-bold">
                                    ORDER STATUS: PENDING APPROVAL
                                  </span>
                                ) : (
                                  <span className="text-emerald-700 font-bold">
                                    APPROVED ·{' '}
                                    {activeStageObj?.label.toUpperCase() ||
                                      ord.status.toUpperCase()}{' '}
                                    ({ord.progressPercent}%)
                                  </span>
                                )}
                                <span>·</span>
                                <span
                                  className={
                                    ordInvoiceStatus === 'paid'
                                      ? 'text-emerald-700 font-bold'
                                      : 'text-amber-700 font-bold'
                                  }
                                >
                                  INVOICE ({invRef}):{' '}
                                  {ordInvoiceStatus.toUpperCase()}
                                </span>
                              </div>

                              <p className="font-bold text-[#001E5A] text-sm">
                                {ord.projectTitle}
                              </p>
                              <p className="text-xs text-slate-600 font-mono-tabular">
                                {ord.imageCount} frames · {ord.outputFormat} ·{' '}
                                {ord.backgroundSpec} · {ord.turnaroundHours}h SLA ·{' '}
                                <strong className="text-[#001E5A]">
                                  ${ord.totalPrice.toFixed(2)} USD
                                </strong>
                              </p>
                              {ord.instructions && (
                                <p className="text-xs text-slate-600 pt-1">
                                  <strong className="text-[#001E5A]">
                                    Brief:
                                  </strong>{' '}
                                  {ord.instructions}
                                </p>
                              )}
                            </div>

                            {/* Right Actions: Approve Order & Toggle Invoice Paid/Pending */}
                            <div className="flex flex-wrap items-center gap-2">
                              {isPendingApproval ? (
                                <button
                                  type="button"
                                  onClick={async () => {
                                    await onApproveOrder(ord);
                                    notifySaved(
                                      `Order ${ord.orderNumber} APPROVED and moved into active production!`
                                    );
                                  }}
                                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                  <span>Approve Order ✓</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={async () => {
                                    await onSetOrderStage(
                                      ord,
                                      'pending_approval'
                                    );
                                    notifySaved(
                                      `Order ${ord.orderNumber} set back to Pending Approval.`
                                    );
                                  }}
                                  className="px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg transition-colors"
                                >
                                  Set Order Pending
                                </button>
                              )}

                              {ordInvoiceStatus === 'pending' ? (
                                <button
                                  type="button"
                                  onClick={async () => {
                                    await onUpdateInvoiceStatus(
                                      invRef,
                                      'paid',
                                      ord.orderNumber
                                    );
                                    notifySaved(
                                      `Invoice ${invRef} marked as PAID ✓ in Client Portal!`
                                    );
                                  }}
                                  className="px-3.5 py-2 text-xs font-bold text-white bg-[#0088FF] hover:bg-[#001E5A] rounded-lg transition-colors flex items-center gap-1.5"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Mark Invoice PAID ✓</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={async () => {
                                    await onUpdateInvoiceStatus(
                                      invRef,
                                      'pending',
                                      ord.orderNumber
                                    );
                                    notifySaved(
                                      `Invoice ${invRef} set to PENDING in Client Portal.`
                                    );
                                  }}
                                  className="px-3.5 py-2 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg transition-colors"
                                >
                                  Set Invoice PENDING
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Bottom Row: Customer Work Process Stage Tracker & 1-Click Stage Selector */}
                          <div className="space-y-2.5">
                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                              <span className="font-bold text-[#001E5A]">
                                Customer Work Process Stage (Click any stage to update Client Portal):
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="font-mono-tabular text-[#0088FF] font-semibold">
                                  Current Process:{' '}
                                  {isPendingApproval
                                    ? 'Pending Approval (0%)'
                                    : `${activeStageObj?.stepIndex || ''} ${
                                        activeStageObj?.label || ord.status
                                      } (${ord.progressPercent}%)`}
                                </span>
                                <button
                                  type="button"
                                  disabled={
                                    !isPendingApproval &&
                                    ord.status === 'completed'
                                  }
                                  onClick={async () => {
                                    if (isPendingApproval) {
                                      await onApproveOrder(ord);
                                      notifySaved(
                                        `Approved ${ord.orderNumber} and started Stage 01 (Order Queued 12%).`
                                      );
                                    } else {
                                      await onAdvanceOrderStage(ord);
                                      notifySaved(
                                        `Advanced ${ord.orderNumber} to the next production stage!`
                                      );
                                    }
                                  }}
                                  className="px-3 py-1 text-[11px] font-bold text-white bg-[#001E5A] hover:bg-[#0088FF] disabled:opacity-40 rounded-md transition-colors"
                                >
                                  {isPendingApproval
                                    ? 'Approve & Start Stage 01 →'
                                    : ord.status === 'completed'
                                    ? '100% Completed ✓'
                                    : 'Advance Next Stage →'}
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                              <button
                                type="button"
                                onClick={async () => {
                                  await onSetOrderStage(ord, 'pending_approval');
                                  notifySaved(
                                    `Set ${ord.orderNumber} to Pending Approval (0%).`
                                  );
                                }}
                                className={`p-2.5 rounded-lg border text-left text-xs transition-colors ${
                                  isPendingApproval
                                    ? 'bg-amber-500 text-white border-amber-600 font-bold shadow-xs'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-amber-400'
                                }`}
                              >
                                <div className="font-mono-tabular text-[10px] opacity-85">
                                  00 · 0%
                                </div>
                                <div className="font-semibold mt-0.5 leading-tight">
                                  Pending Approval
                                </div>
                              </button>

                              {PIPELINE_STAGES.map((st, idx) => {
                                const currentIdx = isPendingApproval
                                  ? -1
                                  : PIPELINE_STAGES.findIndex(
                                      (s) => s.status === ord.status
                                    );
                                const isCurrent =
                                  !isPendingApproval && idx === currentIdx;
                                const isPassed =
                                  !isPendingApproval && idx < currentIdx;

                                return (
                                  <button
                                    key={st.status}
                                    type="button"
                                    onClick={async () => {
                                      await onSetOrderStage(ord, st.status);
                                      notifySaved(
                                        `Updated ${ord.orderNumber} work process to "${st.label}" (${st.progress}%)!`
                                      );
                                    }}
                                    className={`p-2.5 rounded-lg border text-left text-xs transition-colors ${
                                      isCurrent
                                        ? 'bg-[#001E5A] text-white border-[#001E5A] font-bold shadow-xs'
                                        : isPassed
                                        ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-semibold'
                                        : 'bg-white text-[#001E5A] border-slate-200 hover:border-[#0088FF]'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between font-mono-tabular text-[10px]">
                                      <span>
                                        {st.stepIndex} · {st.progress}%
                                      </span>
                                      {(isCurrent || isPassed) && (
                                        <CheckCircle2 className="w-3 h-3 shrink-0" />
                                      )}
                                    </div>
                                    <div className="font-semibold mt-0.5 leading-tight">
                                      {st.label}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===================================================================
              MODULE 2: INVOICES (PAID/PENDING), LINE ITEM EDITOR & COMPANY SETUP
             =================================================================== */}
          {activeTab === 'invoices_billing' && (
            <div className="space-y-8">
              {/* SECTION A: EDIT ORDER INVOICE LINE ITEMS, AMOUNTS & PAID/PENDING STATUS */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div>
                    <p className="text-xs font-mono-tabular font-bold text-[#0088FF]">
                      ADMIN-ONLY INVOICE & LINE ITEM EDITOR (CLIENT READ-ONLY PDF)
                    </p>
                    <h2 className="text-lg font-bold text-[#001E5A]">
                      Edit Customer Invoice Line Items, Prices, Quantities & Payment Status ({orders.length} Orders)
                    </h2>
                  </div>
                  <span className="text-xs font-mono-tabular text-slate-500">
                    Clients can only view & download PDF · Only Admin can edit
                  </span>
                </div>

                <div className="space-y-4">
                  {orders.map((ord) => {
                    const invRef = `INV-${ord.orderNumber}`;
                    const ordInvoiceStatus: InvoicePaymentStatus =
                      invoiceStatusMap[invRef] ||
                      invoiceStatusMap[ord.orderNumber] ||
                      'pending';
                    return (
                      <div
                        key={ord.id}
                        className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-2.5">
                          <div className="flex items-center gap-2 text-xs font-mono-tabular">
                            <span className="font-bold text-[#001E5A] text-sm">
                              {invRef}
                            </span>
                            <span>·</span>
                            <span className="text-slate-500">
                              Order: {ord.orderNumber}
                            </span>
                            <span>·</span>
                            {ordInvoiceStatus === 'paid' ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                                PAID & CONFIRMED ✓
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[11px]">
                                PENDING PAYMENT
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={async () => {
                                await onUpdateInvoiceStatus(
                                  invRef,
                                  'paid',
                                  ord.orderNumber
                                );
                                notifySaved(
                                  `Invoice ${invRef} marked as PAID ✓!`
                                );
                              }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                ordInvoiceStatus === 'paid'
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-50'
                              }`}
                            >
                              Mark PAID ✓
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                await onUpdateInvoiceStatus(
                                  invRef,
                                  'pending',
                                  ord.orderNumber
                                );
                                notifySaved(
                                  `Invoice ${invRef} set to PENDING.`
                                );
                              }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                ordInvoiceStatus === 'pending'
                                  ? 'bg-amber-500 text-white'
                                  : 'bg-white text-amber-800 border border-amber-300 hover:bg-amber-50'
                              }`}
                            >
                              Set PENDING
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Client Name (Bill To)
                            </label>
                            <input
                              type="text"
                              value={ord.clientName}
                              onChange={(e) => {
                                if (onUpdateOrderInvoiceDetails) {
                                  onUpdateOrderInvoiceDetails(ord.id, {
                                    clientName: e.target.value,
                                  });
                                }
                              }}
                              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                            />
                          </div>
                          <div className="lg:col-span-2">
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Invoice Project / Service Description
                            </label>
                            <input
                              type="text"
                              value={ord.projectTitle}
                              onChange={(e) => {
                                if (onUpdateOrderInvoiceDetails) {
                                  onUpdateOrderInvoiceDetails(ord.id, {
                                    projectTitle: e.target.value,
                                  });
                                }
                              }}
                              className="w-full px-2.5 py-1.5 text-xs font-semibold text-[#001E5A] bg-white border border-slate-300 rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Quantity (Frames)
                            </label>
                            <input
                              type="number"
                              min={1}
                              value={ord.imageCount}
                              onChange={(e) => {
                                if (onUpdateOrderInvoiceDetails) {
                                  onUpdateOrderInvoiceDetails(ord.id, {
                                    imageCount: Number(e.target.value),
                                  });
                                }
                              }}
                              className="w-full px-2.5 py-1.5 text-xs font-mono-tabular bg-white border border-slate-300 rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Invoice Total Amount ($ USD)
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              min={0}
                              value={ord.totalPrice}
                              onChange={(e) => {
                                if (onUpdateOrderInvoiceDetails) {
                                  onUpdateOrderInvoiceDetails(ord.id, {
                                    totalPrice: Number(e.target.value),
                                  });
                                }
                              }}
                              className="w-full px-2.5 py-1.5 text-xs font-mono-tabular font-bold text-[#0088FF] bg-white border border-slate-300 rounded-lg"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION B: COMPANY HEADER, TAX RATE, BANK & PAYMENT INFORMATION EDITOR */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div>
                    <p className="text-xs font-mono-tabular font-bold text-[#0088FF]">
                      OFFICIAL INVOICE HEADER, COMPANY DETAILS & PAYMENT REMITTANCE SETUP
                    </p>
                    <h2 className="text-lg font-bold text-[#001E5A]">
                      Customize Invoice Company Name, Address, Tax Rate, Terms & Payment Details
                    </h2>
                  </div>
                  <FileText className="w-5 h-5 text-[#0088FF]" />
                </div>

                {/* Row 1: Company Branding & Tax */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                      Invoice Company Name
                    </label>
                    <input
                      type="text"
                      value={invoicePaymentInfo.companyName || 'FixPhoto Studio Inc.'}
                      onChange={(e) =>
                        onUpdateInvoicePaymentInfo({
                          ...invoicePaymentInfo,
                          companyName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-xs font-bold border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                      Company Address (Shown on Invoice)
                    </label>
                    <input
                      type="text"
                      value={
                        invoicePaymentInfo.companyAddress ||
                        '450 West 33rd Street, Suite 900, New York, NY 10001, USA'
                      }
                      onChange={(e) =>
                        onUpdateInvoicePaymentInfo({
                          ...invoicePaymentInfo,
                          companyAddress: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                      Company Phone Number
                    </label>
                    <input
                      type="text"
                      value={invoicePaymentInfo.companyPhone || '+1 (212) 555-0199'}
                      onChange={(e) =>
                        onUpdateInvoicePaymentInfo({
                          ...invoicePaymentInfo,
                          companyPhone: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-xs font-mono-tabular border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                      Tax / VAT Percentage (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min={0}
                      max={100}
                      value={invoicePaymentInfo.taxRatePercent ?? 0}
                      onChange={(e) =>
                        onUpdateInvoicePaymentInfo({
                          ...invoicePaymentInfo,
                          taxRatePercent: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 text-xs font-mono-tabular border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                {/* Row 2: Bank Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      value={invoicePaymentInfo.bankName}
                      onChange={(e) =>
                        onUpdateInvoicePaymentInfo({
                          ...invoicePaymentInfo,
                          bankName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      value={invoicePaymentInfo.accountHolderName}
                      onChange={(e) =>
                        onUpdateInvoicePaymentInfo({
                          ...invoicePaymentInfo,
                          accountHolderName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                      Account Number / IBAN
                    </label>
                    <input
                      type="text"
                      value={invoicePaymentInfo.accountNumberOrIban}
                      onChange={(e) =>
                        onUpdateInvoicePaymentInfo({
                          ...invoicePaymentInfo,
                          accountNumberOrIban: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-xs font-mono-tabular border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                      Routing / SWIFT Code
                    </label>
                    <input
                      type="text"
                      value={invoicePaymentInfo.routingOrSwiftCode}
                      onChange={(e) =>
                        onUpdateInvoicePaymentInfo({
                          ...invoicePaymentInfo,
                          routingOrSwiftCode: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-xs font-mono-tabular border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                {/* Row 3: Online Gateways */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                      PayPal Payment Email / Link
                    </label>
                    <input
                      type="text"
                      value={invoicePaymentInfo.paypalEmail}
                      onChange={(e) =>
                        onUpdateInvoicePaymentInfo({
                          ...invoicePaymentInfo,
                          paypalEmail: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-xs font-mono-tabular border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                      Payoneer / Wise Email
                    </label>
                    <input
                      type="text"
                      value={invoicePaymentInfo.payoneerOrWiseEmail}
                      onChange={(e) =>
                        onUpdateInvoicePaymentInfo({
                          ...invoicePaymentInfo,
                          payoneerOrWiseEmail: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-xs font-mono-tabular border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                      Billing Support Email
                    </label>
                    <input
                      type="text"
                      value={invoicePaymentInfo.billingSupportEmail}
                      onChange={(e) =>
                        onUpdateInvoicePaymentInfo({
                          ...invoicePaymentInfo,
                          billingSupportEmail: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-xs font-mono-tabular border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                {/* Row 4: Alternative & Instructions & Footer Terms */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                      Alternative / Mobile Wallet / Card Info
                    </label>
                    <input
                      type="text"
                      value={invoicePaymentInfo.mobileWalletOrCardInfo}
                      onChange={(e) =>
                        onUpdateInvoicePaymentInfo({
                          ...invoicePaymentInfo,
                          mobileWalletOrCardInfo: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                      Invoice Payment Instructions Note
                    </label>
                    <input
                      type="text"
                      value={invoicePaymentInfo.paymentInstructions}
                      onChange={(e) =>
                        onUpdateInvoicePaymentInfo({
                          ...invoicePaymentInfo,
                          paymentInstructions: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                      Invoice Terms & Warranty Footer Note
                    </label>
                    <input
                      type="text"
                      value={
                        invoicePaymentInfo.invoiceNotesAndTerms ||
                        'Official Commercial Invoice issued by FixPhoto Studio.'
                      }
                      onChange={(e) =>
                        onUpdateInvoicePaymentInfo({
                          ...invoicePaymentInfo,
                          invoiceNotesAndTerms: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      notifySaved(
                        'Saved Invoice Header & Payment Information! All customer invoices in the Client Portal are now updated.'
                      )
                    }
                    className="px-5 py-2.5 text-xs font-bold text-white bg-[#001E5A] hover:bg-[#0088FF] rounded-lg transition-colors flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save Invoice Settings & Payment Info</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              MODULE 3: CLIENT QUERIES & PUBLIC TRIAL INQUIRIES (WITH EMAIL LOGS)
             =================================================================== */}
          {activeTab === 'client_queries' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <p className="text-xs font-mono-tabular font-bold text-[#0088FF]">
                      PUBLIC & CLIENT QUERIES · CONFIRMATION & ADMIN EMAIL LOGS
                    </p>
                    <h2 className="text-lg font-bold text-[#001E5A]">
                      Client Queries, Free Trial Requests & Custom Quote Inquiries ({clientQueries.length})
                    </h2>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Every query submitted on the website (with or without an account) is stored here. Client confirmation emails and Admin alert emails are automatically dispatched.
                    </p>
                  </div>

                  <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                    {(['all', 'new', 'contacted', 'resolved'] as const).map(
                      (st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setQueryStatusFilter(st)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors capitalize ${
                            queryStatusFilter === st
                              ? 'bg-[#001E5A] text-white'
                              : 'text-[#001E5A] hover:bg-white'
                          }`}
                        >
                          {st}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {clientQueries.filter((q) =>
                  queryStatusFilter === 'all'
                    ? true
                    : q.status === queryStatusFilter
                ).length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-8">
                    No queries matching filter "{queryStatusFilter}".
                  </p>
                ) : (
                  <div className="space-y-4">
                    {clientQueries
                      .filter((q) =>
                        queryStatusFilter === 'all'
                          ? true
                          : q.status === queryStatusFilter
                      )
                      .map((qry) => {
                        const isExpanded = expandedEmailQueryId === qry.id;
                        return (
                          <div
                            key={qry.id}
                            className="p-5 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-3.5"
                          >
                            <div className="flex flex-wrap items-start justify-between gap-4">
                              <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tabular">
                                  <span className="font-bold text-[#0088FF]">
                                    {qry.queryNumber}
                                  </span>
                                  <span>·</span>
                                  <span className="text-slate-500">
                                    {new Date(qry.createdAt).toLocaleString()}
                                  </span>
                                  <span>·</span>
                                  {qry.isLoggedInClient ? (
                                    <span className="text-blue-700 font-bold">
                                      LOGGED-IN CLIENT (ROUTED TO PORTAL)
                                    </span>
                                  ) : (
                                    <span className="text-slate-700 font-bold">
                                      PUBLIC VISITOR (NO ACCOUNT · ADMIN & EMAIL ONLY)
                                    </span>
                                  )}
                                  <span>·</span>
                                  <span className="font-bold uppercase text-[#001E5A]">
                                    STATUS: {qry.status}
                                  </span>
                                </div>

                                <h3 className="text-sm font-bold text-[#001E5A]">
                                  {qry.clientName} —{' '}
                                  <span className="text-[#0088FF]">
                                    {qry.serviceTitle}
                                  </span>
                                </h3>

                                <div className="flex flex-wrap items-center gap-4 text-xs font-mono-tabular text-slate-700">
                                  <span>
                                    <strong>Client Email:</strong>{' '}
                                    {qry.clientEmail}
                                  </span>
                                  <span>
                                    <strong>Phone / WhatsApp:</strong>{' '}
                                    {qry.clientPhone}
                                  </span>
                                  {qry.companyName && (
                                    <span>
                                      <strong>Company:</strong>{' '}
                                      {qry.companyName}
                                    </span>
                                  )}
                                </div>

                                <p className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200 mt-2 leading-relaxed">
                                  <strong className="text-[#001E5A]">
                                    Client Instructions / Query Message:{' '}
                                  </strong>
                                  {qry.instructions}
                                </p>

                                <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] font-mono-tabular text-emerald-800">
                                  <span className="inline-flex items-center gap-1">
                                    <Mail className="w-3 h-3 text-emerald-600" />
                                    ✓ Confirmation Mail Sent to {qry.clientEmail}
                                  </span>
                                  <span>·</span>
                                  <span className="inline-flex items-center gap-1">
                                    <Mail className="w-3 h-3 text-emerald-600" />
                                    ✓ Admin Mail Sent to{' '}
                                    {qry.adminEmailRecipient}
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-2">
                                {(['new', 'contacted', 'resolved'] as const).map(
                                  (st) => (
                                    <button
                                      key={st}
                                      type="button"
                                      onClick={() => {
                                        const next = clientQueries.map((item) =>
                                          item.id === qry.id
                                            ? { ...item, status: st }
                                            : item
                                        );
                                        onUpdateClientQueries(next);
                                        notifySaved(
                                          `Updated query ${qry.queryNumber} status to ${st.toUpperCase()}.`
                                        );
                                      }}
                                      className={`px-2.5 py-1 rounded text-[11px] font-bold capitalize border transition-colors ${
                                        qry.status === st
                                          ? 'bg-[#001E5A] text-white border-[#001E5A]'
                                          : 'bg-white text-[#001E5A] border-slate-300 hover:bg-[#EAF3FC]'
                                      }`}
                                    >
                                      {st}
                                    </button>
                                  )
                                )}

                                <button
                                  type="button"
                                  onClick={() =>
                                    setExpandedEmailQueryId(
                                      isExpanded ? null : qry.id
                                    )
                                  }
                                  className="px-3 py-1 rounded text-[11px] font-bold text-[#0088FF] bg-white border border-slate-300 hover:bg-[#EAF3FC]"
                                >
                                  {isExpanded
                                    ? 'Hide Sent Emails'
                                    : 'View Sent Emails'}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    onUpdateClientQueries(
                                      clientQueries.filter(
                                        (item) => item.id !== qry.id
                                      )
                                    );
                                    notifySaved(
                                      `Deleted query ${qry.queryNumber}.`
                                    );
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-red-600"
                                  title="Delete Query"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {isExpanded && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-200 text-xs">
                                <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5">
                                  <p className="font-mono-tabular font-bold text-emerald-700 text-[11px]">
                                    1. CLIENT CONFIRMATION EMAIL (TO:{' '}
                                    {qry.clientEmail})
                                  </p>
                                  <p className="font-bold text-[#001E5A]">
                                    Subject: {qry.clientConfirmationSubject}
                                  </p>
                                  <pre className="whitespace-pre-wrap font-mono-tabular text-[11px] text-slate-600 bg-[#F8FAFC] p-2.5 rounded border border-slate-200">
                                    {qry.clientConfirmationBody}
                                  </pre>
                                </div>

                                <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5">
                                  <p className="font-mono-tabular font-bold text-[#0088FF] text-[11px]">
                                    2. ADMIN NOTIFICATION EMAIL (TO:{' '}
                                    {qry.adminEmailRecipient})
                                  </p>
                                  <p className="font-bold text-[#001E5A]">
                                    Subject: {qry.adminNotificationSubject}
                                  </p>
                                  <pre className="whitespace-pre-wrap font-mono-tabular text-[11px] text-slate-600 bg-[#F8FAFC] p-2.5 rounded border border-slate-200">
                                    {qry.adminNotificationBody}
                                  </pre>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===================================================================
              MODULE 4: SERVICE PAGES, SPLIT IMAGE+TEXT BUILDER, SAMPLES & FAQS
             =================================================================== */}
          {activeTab === 'menu_and_services' && (
            <div className="space-y-8">
              {/* 1.Individual Service Page Editor (Hero, Split Sections, Complexity Tiers, Samples & FAQs) */}
              {activeEditService && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
                    <div>
                      <p className="text-xs font-mono-tabular font-bold text-[#0088FF]">
                        SINGLE SERVICE PAGE A-TO-Z EDITOR (
                        {activeEditService.indexNumber}{' '}
                        {activeEditService.shortNavTitle.toUpperCase()})
                      </p>
                      <h3 className="text-lg font-bold text-[#001E5A]">
                        Select Any Service Page to Edit Content, Split Image+Text Sections, Pricing & Samples
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={editingServiceSlug}
                        onChange={(e) => setEditingServiceSlug(e.target.value)}
                        className="px-3.5 py-2 text-xs font-bold text-[#001E5A] bg-[#EAF3FC] border border-[#B8D0EB] rounded-lg"
                      >
                        {servicesList.map((s) => (
                          <option key={s.slug} value={s.slug}>
                            {s.indexNumber} {s.shortNavTitle} ($
                            {s.ratePerImage.toFixed(2)})
                          </option>
                        ))}
                      </select>

                      {onPreviewServicePage && (
                        <button
                          type="button"
                          onClick={() =>
                            onPreviewServicePage(activeEditService.slug)
                          }
                          className="px-3.5 py-2 text-xs font-semibold text-white bg-[#0088FF] hover:bg-[#001E5A] rounded-lg transition-colors flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Preview This Service Page Live</span>
                        </button>
                      )}

                      {servicesList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const remaining = servicesList.filter(
                              (s) => s.slug !== activeEditService.slug
                            );
                            onUpdateServicesList(remaining);
                            setEditingServiceSlug(remaining[0].slug);
                            notifySaved(
                              `Removed service page "${activeEditService.shortNavTitle}".`
                            );
                          }}
                          className="p-2 text-slate-400 hover:text-red-600 border border-slate-200 rounded-lg"
                          title="Delete This Service Page"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                        Service Page Full Headline
                      </label>
                      <input
                        type="text"
                        value={activeEditService.title}
                        onChange={(e) => {
                          const next = servicesList.map((s) =>
                            s.slug === activeEditService.slug
                              ? { ...s, title: e.target.value }
                              : s
                          );
                          onUpdateServicesList(next);
                        }}
                        className="w-full px-3 py-2 text-xs font-bold border border-slate-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                        Short Menu Title
                      </label>
                      <input
                        type="text"
                        value={activeEditService.shortNavTitle}
                        onChange={(e) => {
                          const next = servicesList.map((s) =>
                            s.slug === activeEditService.slug
                              ? { ...s, shortNavTitle: e.target.value }
                              : s
                          );
                          onUpdateServicesList(next);
                        }}
                        className="w-full px-3 py-2 text-xs font-semibold border border-slate-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                        Starting Rate ($ USD)
                      </label>
                      <input
                        type="number"
                        step="0.05"
                        value={activeEditService.ratePerImage}
                        onChange={(e) => {
                          const next = servicesList.map((s) =>
                            s.slug === activeEditService.slug
                              ? {
                                  ...s,
                                  ratePerImage: Math.max(
                                    0.05,
                                    Number(e.target.value)
                                  ),
                                }
                              : s
                          );
                          onUpdateServicesList(next);
                        }}
                        className="w-full px-3 py-2 text-xs font-mono-tabular font-bold border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                      Service Hero Subtitle
                    </label>
                    <textarea
                      rows={2}
                      value={activeEditService.heroSubtitle}
                      onChange={(e) => {
                        const next = servicesList.map((s) =>
                          s.slug === activeEditService.slug
                            ? { ...s, heroSubtitle: e.target.value }
                            : s
                        );
                        onUpdateServicesList(next);
                      }}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>

                  {/* On-Page SEO Title & Meta Description for this Service Page */}
                  <div className="p-4 rounded-xl bg-[#EAF3FC]/70 border border-[#B8D0EB] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono-tabular font-bold text-[#0088FF]">
                        ON-PAGE SEO SETTINGS FOR {activeEditService.shortNavTitle.toUpperCase()}
                      </span>
                      <span className="text-[11px] font-mono-tabular text-emerald-700 font-semibold">
                        Live &lt;title&gt;, &lt;meta description&gt; &amp; Schema.org
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#001E5A] mb-1">
                          SEO Meta Title (&lt;title&gt;)
                        </label>
                        <input
                          type="text"
                          value={
                            activeEditService.seoTitle ??
                            `${activeEditService.shortNavTitle} ($${activeEditService.ratePerImage.toFixed(
                              2
                            )}/${activeEditService.unitLabel}) – FixPhoto Studio`
                          }
                          onChange={(e) => {
                            const next = servicesList.map((s) =>
                              s.slug === activeEditService.slug
                                ? { ...s, seoTitle: e.target.value }
                                : s
                            );
                            onUpdateServicesList(next);
                          }}
                          placeholder="SEO Title for Google Search & Browser Tab"
                          className="w-full px-3 py-2 text-xs font-semibold text-[#001E5A] bg-white border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#001E5A] mb-1">
                          SEO Meta Description (&lt;meta name=&quot;description&quot;&gt;)
                        </label>
                        <input
                          type="text"
                          value={
                            activeEditService.seoMetaDescription ??
                            activeEditService.summary
                          }
                          onChange={(e) => {
                            const next = servicesList.map((s) =>
                              s.slug === activeEditService.slug
                                ? { ...s, seoMetaDescription: e.target.value }
                                : s
                            );
                            onUpdateServicesList(next);
                          }}
                          placeholder="SEO Meta Description (150–160 chars recommended)"
                          className="w-full px-3 py-2 text-xs text-slate-700 bg-white border border-slate-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Upload Custom Hero Before/After Images */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="p-3.5 rounded-xl bg-[#F8FAFC] border border-dashed border-[#0088FF] cursor-pointer hover:bg-[#EAF3FC]/60 flex items-center justify-between text-xs font-semibold text-[#001E5A]">
                      <span className="flex items-center gap-2">
                        <UploadCloud className="w-4 h-4 text-[#0088FF]" />
                        <span>
                          {activeEditService.beforeImageUrl
                            ? `Replace Hero BEFORE Image (${activeEditService.shortNavTitle})`
                            : `Upload Hero BEFORE Image (${activeEditService.shortNavTitle})`}
                        </span>
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleServiceImageUpload(
                            activeEditService.slug,
                            'before',
                            e.target.files?.[0]
                          )
                        }
                        className="hidden"
                      />
                    </label>

                    <label className="p-3.5 rounded-xl bg-[#F8FAFC] border border-dashed border-[#0088FF] cursor-pointer hover:bg-[#EAF3FC]/60 flex items-center justify-between text-xs font-semibold text-[#001E5A]">
                      <span className="flex items-center gap-2">
                        <UploadCloud className="w-4 h-4 text-emerald-600" />
                        <span>
                          {activeEditService.afterImageUrl
                            ? `Replace Hero AFTER Image (${activeEditService.shortNavTitle})`
                            : `Upload Hero AFTER Image (${activeEditService.shortNavTitle})`}
                        </span>
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleServiceImageUpload(
                            activeEditService.slug,
                            'after',
                            e.target.files?.[0]
                          )
                        }
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Add / Manage Split Image + Text Showcase Sections on Service Page */}
                  <div className="pt-6 border-t border-slate-200 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-mono-tabular font-bold text-[#001E5A] flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-[#0088FF]" />
                        <span>
                          SPLIT IMAGE + TEXT SECTION BUILDER (ONE SIDE IMAGE, ONE SIDE TEXT) FOR{' '}
                          {activeEditService.shortNavTitle.toUpperCase()}
                        </span>
                      </p>
                      <span className="text-[11px] font-mono-tabular text-[#0088FF] font-semibold">
                        Supports Left/Right Image Toggle & Custom Image Upload
                      </span>
                    </div>

                    <form
                      onSubmit={(e) =>
                        handleAddEditorialBlockToService(e, activeEditService)
                      }
                      className="p-5 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-3.5"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#001E5A] mb-1">
                            Section Badge / Eyebrow
                          </label>
                          <input
                            type="text"
                            value={newEditorialBadge}
                            onChange={(e) =>
                              setNewEditorialBadge(e.target.value)
                            }
                            placeholder="e.g., SECTION 01 · STUDIO CRAFTSMANSHIP"
                            className="w-full px-3 py-2 text-xs font-mono-tabular bg-white border border-slate-300 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[#001E5A] mb-1">
                            Image Side Layout
                          </label>
                          <select
                            value={newEditorialImageSide}
                            onChange={(e) =>
                              setNewEditorialImageSide(
                                e.target.value as 'right' | 'left'
                              )
                            }
                            className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg"
                          >
                            <option value="right">
                              Text on Left · Image Showcase on Right
                            </option>
                            <option value="left">
                              Image Showcase on Left · Text on Right
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[#001E5A] mb-1">
                            Turnaround / QA Caption Badge
                          </label>
                          <input
                            type="text"
                            value={newEditorialCaption}
                            onChange={(e) =>
                              setNewEditorialCaption(e.target.value)
                            }
                            placeholder="e.g., Faster Turnaround Time · 12h–24h SLA"
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#001E5A] mb-1">
                          Section Headline *
                        </label>
                        <input
                          type="text"
                          required
                          value={newEditorialHeadline}
                          onChange={(e) =>
                            setNewEditorialHeadline(e.target.value)
                          }
                          placeholder={`e.g., Why should you trust & choose FixPhoto Studio for ${activeEditService.shortNavTitle}?`}
                          className="w-full px-3 py-2 text-xs font-bold bg-white border border-slate-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#001E5A] mb-1">
                          Text Paragraphs * (Write each paragraph on a new line)
                        </label>
                        <textarea
                          rows={4}
                          required
                          value={newEditorialParagraphs}
                          onChange={(e) =>
                            setNewEditorialParagraphs(e.target.value)
                          }
                          placeholder={
                            'Reliable editing is about more than removing a backdrop. Your finished files need consistent edges and accurate shapes.\nOur senior editors manually control difficult curves, corners, holes, and product details.\nWhether you send ten photos or a high-volume catalog, our production team supports bulk editing.'
                          }
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#001E5A] mb-1">
                            Highlight Badges (Comma-separated)
                          </label>
                          <input
                            type="text"
                            value={newEditorialHighlights}
                            onChange={(e) =>
                              setNewEditorialHighlights(e.target.value)
                            }
                            placeholder="100% Hand-Crafted, Dual 400% Zoom QA, 12h–24h SLA"
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[#001E5A] mb-1">
                            Upload Side Showcase Image (Optional)
                          </label>
                          <label className="px-3 py-2 rounded-lg bg-white border border-dashed border-[#0088FF] text-xs font-semibold text-[#001E5A] cursor-pointer flex items-center justify-center gap-1.5 hover:bg-[#EAF3FC]">
                            <UploadCloud className="w-4 h-4 text-[#0088FF]" />
                            <span>
                              {newEditorialImageUrl
                                ? 'Custom Side Image Loaded ✓ (Click to Replace)'
                                : 'Upload Custom Side Image (PNG/JPG/WebP)'}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f)
                                  readImageFileAsDataUrl(
                                    f,
                                    setNewEditorialImageUrl
                                  );
                              }}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="px-5 py-2.5 text-xs font-semibold text-white bg-[#001E5A] hover:bg-[#0088FF] rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>
                          Add Split Image + Text Section to{' '}
                          {activeEditService.shortNavTitle}
                        </span>
                      </button>
                    </form>

                    {/* Existing Custom Split Image + Text Sections List */}
                    {activeEditService.editorialBlocks &&
                      activeEditService.editorialBlocks.length > 0 && (
                        <div className="space-y-3">
                          <p className="text-xs font-bold text-[#001E5A]">
                            Custom Split Image + Text Sections on{' '}
                            {activeEditService.shortNavTitle} (
                            {activeEditService.editorialBlocks.length})
                          </p>
                          {activeEditService.editorialBlocks.map(
                            (block, bIdx) => (
                              <div
                                key={block.id || bIdx}
                                className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-2.5 text-xs"
                              >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <span className="font-mono-tabular font-bold text-[#0088FF]">
                                    {block.sectionBadge} · Image on{' '}
                                    {block.imagePosition.toUpperCase()}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const nextBlocks = (
                                          activeEditService.editorialBlocks ||
                                          []
                                        ).map((b, i) =>
                                          i === bIdx
                                            ? {
                                                ...b,
                                                imagePosition: (b.imagePosition ===
                                                'right'
                                                  ? 'left'
                                                  : 'right') as
                                                  | 'right'
                                                  | 'left',
                                              }
                                            : b
                                        );
                                        onUpdateServicesList(
                                          servicesList.map((s) =>
                                            s.slug === activeEditService.slug
                                              ? {
                                                  ...s,
                                                  editorialBlocks: nextBlocks,
                                                }
                                              : s
                                          )
                                        );
                                        notifySaved(
                                          'Swapped Image/Text column side!'
                                        );
                                      }}
                                      className="px-2.5 py-1 rounded bg-white border border-slate-300 font-semibold text-[#001E5A] hover:bg-[#EAF3FC]"
                                    >
                                      Flip Image Side ↔
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const nextBlocks = (
                                          activeEditService.editorialBlocks ||
                                          []
                                        ).filter((_, i) => i !== bIdx);
                                        onUpdateServicesList(
                                          servicesList.map((s) =>
                                            s.slug === activeEditService.slug
                                              ? {
                                                  ...s,
                                                  editorialBlocks: nextBlocks,
                                                }
                                              : s
                                          )
                                        );
                                        notifySaved(
                                          'Removed Split Image + Text section.'
                                        );
                                      }}
                                      className="text-slate-400 hover:text-red-600 p-1"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>

                                <input
                                  type="text"
                                  value={block.headline}
                                  onChange={(e) => {
                                    const nextBlocks = (
                                      activeEditService.editorialBlocks || []
                                    ).map((b, i) =>
                                      i === bIdx
                                        ? { ...b, headline: e.target.value }
                                        : b
                                    );
                                    onUpdateServicesList(
                                      servicesList.map((s) =>
                                        s.slug === activeEditService.slug
                                          ? {
                                              ...s,
                                              editorialBlocks: nextBlocks,
                                            }
                                          : s
                                      )
                                    );
                                  }}
                                  className="w-full px-3 py-1.5 font-bold text-[#001E5A] bg-white border border-slate-300 rounded"
                                />

                                <textarea
                                  rows={3}
                                  value={block.paragraphs.join('\n')}
                                  onChange={(e) => {
                                    const nextBlocks = (
                                      activeEditService.editorialBlocks || []
                                    ).map((b, i) =>
                                      i === bIdx
                                        ? {
                                            ...b,
                                            paragraphs: e.target.value
                                              .split('\n')
                                              .filter(Boolean),
                                          }
                                        : b
                                    );
                                    onUpdateServicesList(
                                      servicesList.map((s) =>
                                        s.slug === activeEditService.slug
                                          ? {
                                              ...s,
                                              editorialBlocks: nextBlocks,
                                            }
                                          : s
                                      )
                                    );
                                  }}
                                  className="w-full px-3 py-1.5 text-slate-600 bg-white border border-slate-300 rounded"
                                />
                              </div>
                            )
                          )}
                        </div>
                      )}
                  </div>

                  {/* Edit 3 Complexity Pricing Tiers */}
                  <div className="pt-4 border-t border-slate-200 space-y-3">
                    <p className="text-xs font-mono-tabular font-bold text-[#001E5A] flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-[#0088FF]" />
                      <span>
                        EDIT 3 COMPLEXITY PRICING TIERS FOR{' '}
                        {activeEditService.shortNavTitle.toUpperCase()}
                      </span>
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {activeEditService.complexityTiers.map((tier, tIdx) => (
                        <div
                          key={tIdx}
                          className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-2"
                        >
                          <p className="text-[11px] font-mono-tabular font-bold text-[#0088FF]">
                            TIER 0{tIdx + 1}
                          </p>
                          <input
                            type="text"
                            value={tier.tierName}
                            onChange={(e) => {
                              const updatedTiers =
                                activeEditService.complexityTiers.map((t, i) =>
                                  i === tIdx
                                    ? { ...t, tierName: e.target.value }
                                    : t
                                );
                              onUpdateServicesList(
                                servicesList.map((s) =>
                                  s.slug === activeEditService.slug
                                    ? { ...s, complexityTiers: updatedTiers }
                                    : s
                                )
                              );
                            }}
                            className="w-full px-2.5 py-1 text-xs font-bold text-[#001E5A] bg-white border border-slate-300 rounded"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={tier.pricePerImage}
                              onChange={(e) => {
                                const updatedTiers =
                                  activeEditService.complexityTiers.map(
                                    (t, i) =>
                                      i === tIdx
                                        ? {
                                            ...t,
                                            pricePerImage: e.target.value,
                                          }
                                        : t
                                  );
                                onUpdateServicesList(
                                  servicesList.map((s) =>
                                    s.slug === activeEditService.slug
                                      ? { ...s, complexityTiers: updatedTiers }
                                      : s
                                  )
                                );
                              }}
                              className="px-2 py-1 text-xs font-mono-tabular bg-white border border-slate-300 rounded"
                            />
                            <input
                              type="text"
                              value={tier.turnaround}
                              onChange={(e) => {
                                const updatedTiers =
                                  activeEditService.complexityTiers.map(
                                    (t, i) =>
                                      i === tIdx
                                        ? { ...t, turnaround: e.target.value }
                                        : t
                                  );
                                onUpdateServicesList(
                                  servicesList.map((s) =>
                                    s.slug === activeEditService.slug
                                      ? { ...s, complexityTiers: updatedTiers }
                                      : s
                                  )
                                );
                              }}
                              className="px-2 py-1 text-xs font-mono-tabular bg-white border border-slate-300 rounded"
                            />
                          </div>
                          <textarea
                            rows={2}
                            value={tier.description}
                            onChange={(e) => {
                              const updatedTiers =
                                activeEditService.complexityTiers.map((t, i) =>
                                  i === tIdx
                                    ? { ...t, description: e.target.value }
                                    : t
                                );
                              onUpdateServicesList(
                                servicesList.map((s) =>
                                  s.slug === activeEditService.slug
                                    ? { ...s, complexityTiers: updatedTiers }
                                    : s
                                )
                              );
                            }}
                            className="w-full px-2.5 py-1 text-xs text-slate-600 bg-white border border-slate-300 rounded"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add Custom Before/After Sample Card to This Service Page */}
                  <div className="pt-4 border-t border-slate-200 space-y-4">
                    <p className="text-xs font-mono-tabular font-bold text-[#001E5A] flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-[#0088FF]" />
                      <span>
                        ADD BEFORE/AFTER SAMPLE WORK TO{' '}
                        {activeEditService.shortNavTitle.toUpperCase()} PAGE
                      </span>
                    </p>

                    <form
                      onSubmit={(e) =>
                        handleAddSampleToService(e, activeEditService)
                      }
                      className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-3"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <input
                          type="text"
                          required
                          value={newSampleTitle}
                          onChange={(e) => setNewSampleTitle(e.target.value)}
                          placeholder="Sample Title (e.g., Multi-Stone Emerald Ring)"
                          className="md:col-span-2 px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                        />
                        <input
                          type="text"
                          value={newSampleTag}
                          onChange={(e) => setNewSampleTag(e.target.value)}
                          placeholder="Complexity Tag"
                          className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                        />
                        <input
                          type="text"
                          value={newSampleTurnaround}
                          onChange={(e) =>
                            setNewSampleTurnaround(e.target.value)
                          }
                          placeholder="Turnaround (e.g., 12h SLA)"
                          className="px-3 py-2 text-xs font-mono-tabular bg-white border border-slate-300 rounded-lg"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                        <input
                          type="text"
                          value={newSampleNote}
                          onChange={(e) => setNewSampleNote(e.target.value)}
                          placeholder="Technical retouching notes..."
                          className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                        />

                        <label className="px-3 py-2 rounded-lg bg-white border border-dashed border-[#0088FF] text-xs font-semibold text-[#001E5A] cursor-pointer flex items-center justify-center gap-1.5">
                          <UploadCloud className="w-3.5 h-3.5 text-[#0088FF]" />
                          <span>
                            {newSampleBeforeImg
                              ? 'Sample BEFORE Loaded ✓'
                              : 'Upload Sample BEFORE'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f)
                                readImageFileAsDataUrl(f, setNewSampleBeforeImg);
                            }}
                            className="hidden"
                          />
                        </label>

                        <label className="px-3 py-2 rounded-lg bg-white border border-dashed border-[#0088FF] text-xs font-semibold text-[#001E5A] cursor-pointer flex items-center justify-center gap-1.5">
                          <UploadCloud className="w-3.5 h-3.5 text-emerald-600" />
                          <span>
                            {newSampleAfterImg
                              ? 'Sample AFTER Loaded ✓'
                              : 'Upload Sample AFTER'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f)
                                readImageFileAsDataUrl(f, setNewSampleAfterImg);
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <button
                        type="submit"
                        className="px-4 py-2 text-xs font-semibold text-white bg-[#001E5A] hover:bg-[#0088FF] rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>
                          Add Sample Card to {activeEditService.shortNavTitle}
                        </span>
                      </button>
                    </form>
                  </div>

                  {/* Add / Manage Service FAQs */}
                  <div className="pt-4 border-t border-slate-200 space-y-4">
                    <p className="text-xs font-mono-tabular font-bold text-[#001E5A] flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-[#0088FF]" />
                      <span>
                        ADD CUSTOM FAQ TO{' '}
                        {activeEditService.shortNavTitle.toUpperCase()} PAGE
                      </span>
                    </p>

                    <form
                      onSubmit={(e) =>
                        handleAddFaqToService(e, activeEditService)
                      }
                      className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-3"
                    >
                      <input
                        type="text"
                        required
                        value={newFaqQuestion}
                        onChange={(e) => setNewFaqQuestion(e.target.value)}
                        placeholder="FAQ Question (e.g., Do you include multi-path PSD layers?)"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg font-semibold"
                      />
                      <textarea
                        rows={2}
                        required
                        value={newFaqAnswer}
                        onChange={(e) => setNewFaqAnswer(e.target.value)}
                        placeholder="Detailed FAQ Answer..."
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 text-xs font-semibold text-white bg-[#0088FF] hover:bg-[#001E5A] rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>
                          Add FAQ to {activeEditService.shortNavTitle}
                        </span>
                      </button>
                    </form>

                    {activeEditService.faqs &&
                      activeEditService.faqs.length > 0 && (
                        <div className="space-y-2">
                          {activeEditService.faqs.map((faq, fIdx) => (
                            <div
                              key={fIdx}
                              className="p-3 rounded-lg bg-[#F8FAFC] border border-slate-200 flex items-start justify-between gap-3 text-xs"
                            >
                              <div>
                                <p className="font-bold text-[#001E5A]">
                                  Q: {faq.question}
                                </p>
                                <p className="text-slate-600 mt-0.5">
                                  {faq.answer}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const nextFaqs = (
                                    activeEditService.faqs || []
                                  ).filter((_, i) => i !== fIdx);
                                  onUpdateServicesList(
                                    servicesList.map((s) =>
                                      s.slug === activeEditService.slug
                                        ? { ...s, faqs: nextFaqs }
                                        : s
                                    )
                                  );
                                }}
                                className="text-slate-400 hover:text-red-600 p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                </div>
              )}

              {/* 2. ADD NEW CUSTOM SERVICE PAGE BUILDER */}
              <form
                onSubmit={handleCreateCustomServicePage}
                className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div>
                    <p className="text-xs font-mono-tabular font-bold text-[#0088FF]">
                      + CREATE NEW SERVICE PAGE
                    </p>
                    <h2 className="text-lg font-bold text-[#001E5A]">
                      Add a New Photo Editing or Video Editing Service Page
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                      Service Division
                    </label>
                    <select
                      value={newSrvDivision}
                      onChange={(e) =>
                        setNewSrvDivision(e.target.value as StudioDivision)
                      }
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg font-semibold"
                    >
                      <option value="photo_editing">
                        01. Photo Editing Division
                      </option>
                      <option value="video_editing">
                        02. Video Editing Division
                      </option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                      New Service Page Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={newSrvName}
                      onChange={(e) => setNewSrvName(e.target.value)}
                      placeholder="e.g., Automotive Photo Retouching & Shadow"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                      Starting Rate ($ USD)
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      min="0.10"
                      value={newSrvRate}
                      onChange={(e) => setNewSrvRate(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono-tabular bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                      Turnaround SLA Badge
                    </label>
                    <input
                      type="text"
                      value={newSrvTurnaround}
                      onChange={(e) => setNewSrvTurnaround(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono-tabular bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                      Deliverables Specification
                    </label>
                    <input
                      type="text"
                      value={newSrvDeliverables}
                      onChange={(e) => setNewSrvDeliverables(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                      Default Interactive Canvas Preset
                    </label>
                    <select
                      value={newSrvArtwork}
                      onChange={(e) =>
                        setNewSrvArtwork(
                          e.target.value as ServiceDefinition['artworkType']
                        )
                      }
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                    >
                      <option value="watch">Luxury Watch / Clipping Path</option>
                      <option value="real_estate">
                        Real Estate HDR & Staging
                      </option>
                      <option value="jewelry">Macro Fine Jewelry</option>
                      <option value="mannequin">3D Ghost Mannequin</option>
                      <option value="footwear">
                        E-Commerce Footwear & Shadow
                      </option>
                      <option value="beauty">
                        Beauty & Portrait Retouching
                      </option>
                      <option value="variant">Multi-Color & Video Grade</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                    Hero Subtitle & Overview
                  </label>
                  <input
                    type="text"
                    value={newSrvSubtitle}
                    onChange={(e) => setNewSrvSubtitle(e.target.value)}
                    placeholder="Describe the workflow, QA precision, and commercial deliverables..."
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                      SEO Meta Title (&lt;title&gt;)
                    </label>
                    <input
                      type="text"
                      value={newSrvSeoTitle}
                      onChange={(e) => setNewSrvSeoTitle(e.target.value)}
                      placeholder="e.g., Luxury Watch Retouching Services – FixPhoto Studio"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                      SEO Meta Description (&lt;meta name=&quot;description&quot;&gt;)
                    </label>
                    <input
                      type="text"
                      value={newSrvSeoDesc}
                      onChange={(e) => setNewSrvSeoDesc(e.target.value)}
                      placeholder="150–160 character SEO summary for Google search results..."
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="p-3 rounded-xl bg-[#F8FAFC] border border-dashed border-[#0088FF] cursor-pointer hover:bg-[#EAF3FC]/60 flex items-center justify-between text-xs font-semibold text-[#001E5A]">
                    <span className="flex items-center gap-2">
                      <UploadCloud className="w-4 h-4 text-[#0088FF]" />
                      <span>
                        {newSrvBeforeImg
                          ? 'Custom BEFORE Image Attached ✓'
                          : 'Optional: Upload Hero BEFORE Image'}
                      </span>
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) readImageFileAsDataUrl(f, setNewSrvBeforeImg);
                      }}
                      className="hidden"
                    />
                  </label>

                  <label className="p-3 rounded-xl bg-[#F8FAFC] border border-dashed border-[#0088FF] cursor-pointer hover:bg-[#EAF3FC]/60 flex items-center justify-between text-xs font-semibold text-[#001E5A]">
                    <span className="flex items-center gap-2">
                      <UploadCloud className="w-4 h-4 text-emerald-600" />
                      <span>
                        {newSrvAfterImg
                          ? 'Custom AFTER Image Attached ✓'
                          : 'Optional: Upload Hero AFTER Image'}
                      </span>
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) readImageFileAsDataUrl(f, setNewSrvAfterImg);
                      }}
                      className="hidden"
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-[#001E5A] hover:bg-[#0088FF] rounded-lg transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create & Publish Custom Service Page</span>
                </button>
              </form>

              {/* 3. 6 Main Menu Photo Editing Services Editor */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <p className="text-xs font-mono-tabular font-bold text-[#0088FF]">
                      CORE STUDIO MENU · 6 FLAGSHIP PHOTO EDITING SERVICES
                    </p>
                    <h2 className="text-lg font-bold text-[#001E5A]">
                      Edit 6 Flagship Service Boxes (Titles, Subtitles, Rates & Before/After Images)
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {mainMenuServices.map((item, idx) => (
                    <div
                      key={item.id}
                      className="rounded-xl bg-[#F8FAFC] border border-slate-200 overflow-hidden flex flex-col justify-between"
                    >
                      <BeforeAfterStudioCanvas
                        artworkType={item.artworkType}
                        beforeImageUrl={item.beforeImageUrl}
                        afterImageUrl={item.afterImageUrl}
                        initialSplit={50}
                        showVectorOverlay={item.artworkType === 'watch'}
                        interactive={true}
                        className="h-44"
                      />
                      <div className="p-4 space-y-2.5">
                        <p className="text-[11px] font-mono-tabular font-bold text-[#0088FF]">
                          MAIN MENU SLOT 0{idx + 1}
                        </p>
                        <div>
                          <label className="block text-[11px] text-slate-500">
                            Menu Title
                          </label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              const next = mainMenuServices.map((m) =>
                                m.id === item.id
                                  ? { ...m, title: e.target.value }
                                  : m
                              );
                              onUpdateMainMenuServices(next);
                            }}
                            className="w-full px-2.5 py-1.5 text-xs font-bold text-[#001E5A] bg-white border border-slate-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-500">
                            Sub-Services Subtitle
                          </label>
                          <input
                            type="text"
                            value={item.subtitle}
                            onChange={(e) => {
                              const next = mainMenuServices.map((m) =>
                                m.id === item.id
                                  ? { ...m, subtitle: e.target.value }
                                  : m
                              );
                              onUpdateMainMenuServices(next);
                            }}
                            className="w-full px-2.5 py-1.5 text-xs text-slate-700 bg-white border border-slate-300 rounded-lg"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] text-slate-500">
                              Starting Rate
                            </label>
                            <input
                              type="text"
                              value={item.startingRate}
                              onChange={(e) => {
                                const next = mainMenuServices.map((m) =>
                                  m.id === item.id
                                    ? { ...m, startingRate: e.target.value }
                                    : m
                                );
                                onUpdateMainMenuServices(next);
                              }}
                              className="w-full px-2 py-1 text-xs font-mono-tabular bg-white border border-slate-300 rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] text-slate-500">
                              Turnaround
                            </label>
                            <input
                              type="text"
                              value={item.turnaround}
                              onChange={(e) => {
                                const next = mainMenuServices.map((m) =>
                                  m.id === item.id
                                    ? { ...m, turnaround: e.target.value }
                                    : m
                                );
                                onUpdateMainMenuServices(next);
                              }}
                              className="w-full px-2 py-1 text-xs font-mono-tabular bg-white border border-slate-300 rounded-lg"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                          <label className="py-1.5 px-2 rounded-lg bg-[#EAF3FC] hover:bg-[#001E5A] hover:text-white text-[#001E5A] text-[11px] font-semibold cursor-pointer transition-colors flex items-center justify-center gap-1 text-center">
                            <UploadCloud className="w-3 h-3 shrink-0" />
                            <span>
                              {item.beforeImageUrl
                                ? 'Replace BEFORE'
                                : 'Upload BEFORE'}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                readImageFileAsDataUrl(file, (dataUrl) => {
                                  const next = mainMenuServices.map((m) =>
                                    m.id === item.id
                                      ? { ...m, beforeImageUrl: dataUrl }
                                      : m
                                  );
                                  onUpdateMainMenuServices(next);
                                  notifySaved(
                                    `Updated BEFORE image for "${item.title}"!`
                                  );
                                });
                              }}
                              className="hidden"
                            />
                          </label>

                          <label className="py-1.5 px-2 rounded-lg bg-[#0088FF] hover:bg-[#001E5A] text-white text-[11px] font-semibold cursor-pointer transition-colors flex items-center justify-center gap-1 text-center">
                            <UploadCloud className="w-3 h-3 shrink-0" />
                            <span>
                              {item.afterImageUrl
                                ? 'Replace AFTER'
                                : 'Upload AFTER'}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                readImageFileAsDataUrl(file, (dataUrl) => {
                                  const next = mainMenuServices.map((m) =>
                                    m.id === item.id
                                      ? { ...m, afterImageUrl: dataUrl }
                                      : m
                                  );
                                  onUpdateMainMenuServices(next);
                                  notifySaved(
                                    `Updated AFTER image for "${item.title}"!`
                                  );
                                });
                              }}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              MODULE 5: PORTFOLIO BEFORE & AFTER IMAGE UPLOADER & MANAGER
             =================================================================== */}
          {activeTab === 'portfolio_before_after' && (
            <div className="space-y-8">
              <form
                onSubmit={handleAddNewPortfolioItem}
                className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div>
                    <p className="text-xs font-mono-tabular font-bold text-[#0088FF]">
                      ADD NEW PORTFOLIO COMPARISON CARD
                    </p>
                    <h2 className="text-lg font-bold text-[#001E5A]">
                      Upload New Before & After Images to Portfolio Page
                    </h2>
                  </div>
                  <span className="text-xs font-mono-tabular text-slate-500">
                    Changes appear immediately on the Portfolio Page & Home Showcase
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                      Portfolio Project Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={newPfTitle}
                      onChange={(e) => setNewPfTitle(e.target.value)}
                      placeholder="e.g., Diamond Ring Micro-Prong & Facet Retouch"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                      Client / Brand Name
                    </label>
                    <input
                      type="text"
                      value={newPfBrand}
                      onChange={(e) => setNewPfBrand(e.target.value)}
                      placeholder="e.g., Aurelia Fine Jewelry"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                      Service Category
                    </label>
                    <select
                      value={newPfCategory}
                      onChange={(e) =>
                        setNewPfCategory(e.target.value as ServiceCategory)
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="clipping_path">Clipping Path</option>
                      <option value="ghost_mannequin">Ghost Mannequin</option>
                      <option value="jewelry_retouch">Fine Jewelry</option>
                      <option value="ecommerce_shadow">Product & Shadow</option>
                      <option value="beauty_high_end">High-End Beauty</option>
                      <option value="color_variants">Real Estate & Color</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-2">
                    <label className="block text-xs font-bold text-[#001E5A]">
                      1. Upload BEFORE Image (Raw Capture)
                    </label>
                    <label className="flex items-center justify-between p-3 border border-dashed border-[#0088FF] rounded-lg bg-white cursor-pointer hover:bg-[#EAF3FC]/50">
                      <span className="text-xs font-semibold text-[#001E5A] flex items-center gap-2">
                        <UploadCloud className="w-4 h-4 text-[#0088FF]" />
                        {newPfBeforeImg
                          ? 'Before Image Loaded ✓ (Click to replace)'
                          : 'Select Before Image (JPG/PNG/WebP)'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) readImageFileAsDataUrl(f, setNewPfBeforeImg);
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-2">
                    <label className="block text-xs font-bold text-[#001E5A]">
                      2. Upload AFTER Image (Edited Master)
                    </label>
                    <label className="flex items-center justify-between p-3 border border-dashed border-[#0088FF] rounded-lg bg-white cursor-pointer hover:bg-[#EAF3FC]/50">
                      <span className="text-xs font-semibold text-[#001E5A] flex items-center gap-2">
                        <UploadCloud className="w-4 h-4 text-emerald-600" />
                        {newPfAfterImg
                          ? 'After Image Loaded ✓ (Click to replace)'
                          : 'Select After Image (JPG/PNG/WebP)'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) readImageFileAsDataUrl(f, setNewPfAfterImg);
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                      Price Display
                    </label>
                    <input
                      type="text"
                      value={newPfPrice}
                      onChange={(e) => setNewPfPrice(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono-tabular border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                      Turnaround SLA
                    </label>
                    <input
                      type="text"
                      value={newPfTurnaround}
                      onChange={(e) => setNewPfTurnaround(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono-tabular border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                      After Retouching Notes
                    </label>
                    <input
                      type="text"
                      value={newPfAfterNotes}
                      onChange={(e) => setNewPfAfterNotes(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-[#001E5A] hover:bg-[#0088FF] rounded-lg transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish New Before/After Item to Portfolio</span>
                </button>
              </form>

              {/* Existing Portfolio Items Grid */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#001E5A]">
                  Manage Existing Portfolio Items ({portfolioItems.length}) — Upload Custom Before & After Images
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {portfolioItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between"
                    >
                      <BeforeAfterStudioCanvas
                        artworkType={item.artworkType}
                        initialSplit={50}
                        interactive={true}
                        className="h-64"
                        beforeImageUrl={item.beforeImageUrl}
                        afterImageUrl={item.afterImageUrl}
                      />

                      <div className="p-5 space-y-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 space-y-2">
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => {
                                const next = portfolioItems.map((p) =>
                                  p.id === item.id
                                    ? { ...p, title: e.target.value }
                                    : p
                                );
                                onUpdatePortfolioItems(next);
                              }}
                              placeholder="Portfolio Title"
                              className="w-full px-2.5 py-1.5 text-sm font-bold text-[#001E5A] border border-slate-300 rounded-lg"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={item.clientBrand}
                                onChange={(e) => {
                                  const next = portfolioItems.map((p) =>
                                    p.id === item.id
                                      ? { ...p, clientBrand: e.target.value }
                                      : p
                                  );
                                  onUpdatePortfolioItems(next);
                                }}
                                placeholder="Client Brand"
                                className="px-2.5 py-1 text-xs text-slate-700 border border-slate-300 rounded-lg"
                              />
                              <select
                                value={item.category}
                                onChange={(e) => {
                                  const cat = e.target.value as ServiceCategory;
                                  const labelMap: Record<ServiceCategory, string> = {
                                    clipping_path: 'Clipping Path',
                                    ghost_mannequin: 'Ghost Mannequin',
                                    jewelry_retouch: 'Fine Jewelry',
                                    ecommerce_shadow: 'Product & Shadow',
                                    beauty_high_end: 'High-End Beauty',
                                    color_variants: 'Real Estate & Color',
                                  };
                                  const next = portfolioItems.map((p) =>
                                    p.id === item.id
                                      ? {
                                          ...p,
                                          category: cat,
                                          categoryLabel: labelMap[cat] || p.categoryLabel,
                                        }
                                      : p
                                  );
                                  onUpdatePortfolioItems(next);
                                }}
                                className="px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-lg"
                              >
                                <option value="clipping_path">Clipping Path</option>
                                <option value="ghost_mannequin">Ghost Mannequin</option>
                                <option value="jewelry_retouch">Fine Jewelry</option>
                                <option value="ecommerce_shadow">Product & Shadow</option>
                                <option value="beauty_high_end">High-End Beauty</option>
                                <option value="color_variants">Real Estate & Color</option>
                              </select>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={item.pricePerImage}
                                onChange={(e) => {
                                  const next = portfolioItems.map((p) =>
                                    p.id === item.id
                                      ? { ...p, pricePerImage: e.target.value }
                                      : p
                                  );
                                  onUpdatePortfolioItems(next);
                                }}
                                placeholder="Price (e.g. $0.39 / img)"
                                className="px-2.5 py-1 text-xs font-mono-tabular text-[#0088FF] font-bold border border-slate-300 rounded-lg"
                              />
                              <input
                                type="text"
                                value={item.turnaround}
                                onChange={(e) => {
                                  const next = portfolioItems.map((p) =>
                                    p.id === item.id
                                      ? { ...p, turnaround: e.target.value }
                                      : p
                                  );
                                  onUpdatePortfolioItems(next);
                                }}
                                placeholder="Turnaround SLA"
                                className="px-2.5 py-1 text-xs font-mono-tabular text-slate-600 border border-slate-300 rounded-lg"
                              />
                            </div>
                            <input
                              type="text"
                              value={item.afterNotes}
                              onChange={(e) => {
                                const next = portfolioItems.map((p) =>
                                  p.id === item.id
                                    ? { ...p, afterNotes: e.target.value }
                                    : p
                                );
                                onUpdatePortfolioItems(next);
                              }}
                              placeholder="After Retouching Description / Notes"
                              className="w-full px-2.5 py-1 text-xs text-slate-600 border border-slate-300 rounded-lg"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              onUpdatePortfolioItems(
                                portfolioItems.filter((p) => p.id !== item.id)
                              );
                              notifySaved(
                                `Removed portfolio item "${item.title}".`
                              );
                            }}
                            className="p-2 text-slate-400 hover:text-red-600"
                            title="Delete Portfolio Item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-200">
                          <label className="py-2 px-3 rounded-lg bg-[#EAF3FC] hover:bg-[#001E5A] hover:text-white text-[#001E5A] text-xs font-semibold cursor-pointer transition-colors flex items-center justify-center gap-1.5 text-center">
                            <UploadCloud className="w-3.5 h-3.5 shrink-0" />
                            <span>
                              {item.beforeImageUrl
                                ? 'Replace BEFORE Image'
                                : 'Upload BEFORE Image'}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handlePortfolioImageUpload(
                                  item.id,
                                  'before',
                                  e.target.files?.[0]
                                )
                              }
                              className="hidden"
                            />
                          </label>

                          <label className="py-2 px-3 rounded-lg bg-[#0088FF] hover:bg-[#001E5A] text-white text-xs font-semibold cursor-pointer transition-colors flex items-center justify-center gap-1.5 text-center">
                            <UploadCloud className="w-3.5 h-3.5 shrink-0" />
                            <span>
                              {item.afterImageUrl
                                ? 'Replace AFTER Image'
                                : 'Upload AFTER Image'}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handlePortfolioImageUpload(
                                  item.id,
                                  'after',
                                  e.target.files?.[0]
                                )
                              }
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              MODULE 6: VIDEO STUDIO & SHOWREEL PROJECTS MANAGER
             =================================================================== */}
          {activeTab === 'video_studio_showreel' && (
            <div className="space-y-8">
              <form
                onSubmit={handleAddVideoShowreel}
                className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <p className="text-xs font-mono-tabular font-bold text-[#0088FF]">
                      VIDEO PORTFOLIO & NLE SHOWREEL MANAGER
                    </p>
                    <h2 className="text-lg font-bold text-[#001E5A]">
                      Add New Video Portfolio Project (Shown on Portfolio & Video Studio Pages)
                    </h2>
                  </div>
                  <Film className="w-5 h-5 text-[#0088FF]" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                      Video Project Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={newVidTitle}
                      onChange={(e) => setNewVidTitle(e.target.value)}
                      placeholder="e.g., Luxury Perfume 360° Rig Removal & Grade"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                      Client / Studio Brand
                    </label>
                    <input
                      type="text"
                      value={newVidClient}
                      onChange={(e) => setNewVidClient(e.target.value)}
                      placeholder="e.g., Maison Lumière Paris"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                      Video Track Category
                    </label>
                    <select
                      value={newVidCategory}
                      onChange={(e) =>
                        setNewVidCategory(
                          e.target.value as VideoShowreelProject['category']
                        )
                      }
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                    >
                      <option value="ecommerce_product">
                        E-Commerce Product Video
                      </option>
                      <option value="social_reels">
                        Reels, TikTok & Shorts
                      </option>
                      <option value="real_estate_drone">
                        Real Estate & Drone Tour
                      </option>
                      <option value="wedding_cinema">
                        Wedding & Event Cinema
                      </option>
                      <option value="color_vfx">
                        Color Grading & Roto VFX
                      </option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <input
                    type="text"
                    value={newVidDuration}
                    onChange={(e) => setNewVidDuration(e.target.value)}
                    placeholder="Duration (00:45)"
                    className="px-3 py-2 text-xs font-mono-tabular border border-slate-300 rounded-lg"
                  />
                  <input
                    type="text"
                    value={newVidPrice}
                    onChange={(e) => setNewVidPrice(e.target.value)}
                    placeholder="Rate ($55 / video)"
                    className="px-3 py-2 text-xs font-mono-tabular border border-slate-300 rounded-lg"
                  />
                  <input
                    type="text"
                    value={newVidTurnaround}
                    onChange={(e) => setNewVidTurnaround(e.target.value)}
                    placeholder="SLA (24h SLA)"
                    className="px-3 py-2 text-xs font-mono-tabular border border-slate-300 rounded-lg"
                  />
                  <input
                    type="text"
                    value={newVidOutcome}
                    onChange={(e) => setNewVidOutcome(e.target.value)}
                    placeholder="Outcome (+38% Video Ad ROAS)"
                    className="px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-[#001E5A] hover:bg-[#0088FF] rounded-lg transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Project to Video Portfolio & Showreel</span>
                </button>
              </form>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-bold text-[#001E5A]">
                  Edit Existing Video Portfolio Projects ({videoShowreelProjects.length}) — Full Admin Control
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {videoShowreelProjects.map((proj) => (
                    <div
                      key={proj.id}
                      className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <select
                          value={proj.category}
                          onChange={(e) => {
                            const cat = e.target.value as VideoShowreelProject['category'];
                            const labelMap: Record<VideoShowreelProject['category'], string> = {
                              ecommerce_product: 'E-Commerce Product Video',
                              social_reels: 'Reels, TikTok & Shorts',
                              real_estate_drone: 'Real Estate & Drone Video',
                              wedding_cinema: 'Wedding & Event Cinema',
                              color_vfx: 'Color Grading, Roto & VFX',
                            };
                            const next = videoShowreelProjects.map((v) =>
                              v.id === proj.id
                                ? {
                                    ...v,
                                    category: cat,
                                    categoryLabel: labelMap[cat] || v.categoryLabel,
                                  }
                                : v
                            );
                            onUpdateVideoShowreelProjects(next);
                          }}
                          className="px-2.5 py-1 text-xs font-bold text-[#0088FF] bg-white border border-slate-300 rounded"
                        >
                          <option value="ecommerce_product">E-Commerce Product Video</option>
                          <option value="social_reels">Reels, TikTok & Shorts</option>
                          <option value="real_estate_drone">Real Estate & Drone Video</option>
                          <option value="wedding_cinema">Wedding & Event Cinema</option>
                          <option value="color_vfx">Color Grading, Roto & VFX</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateVideoShowreelProjects(
                              videoShowreelProjects.filter(
                                (v) => v.id !== proj.id
                              )
                            );
                            notifySaved(
                              `Removed video project "${proj.title}".`
                            );
                          }}
                          className="text-slate-400 hover:text-red-600 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => {
                          const next = videoShowreelProjects.map((v) =>
                            v.id === proj.id
                              ? { ...v, title: e.target.value }
                              : v
                          );
                          onUpdateVideoShowreelProjects(next);
                        }}
                        placeholder="Video Project Title"
                        className="w-full px-2.5 py-1.5 text-xs font-bold text-[#001E5A] bg-white border border-slate-300 rounded"
                      />

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={proj.clientBrand}
                          onChange={(e) => {
                            const next = videoShowreelProjects.map((v) =>
                              v.id === proj.id
                                ? { ...v, clientBrand: e.target.value }
                                : v
                            );
                            onUpdateVideoShowreelProjects(next);
                          }}
                          placeholder="Client Brand"
                          className="px-2.5 py-1 text-xs bg-white border border-slate-300 rounded"
                        />
                        <input
                          type="text"
                          value={proj.duration}
                          onChange={(e) => {
                            const next = videoShowreelProjects.map((v) =>
                              v.id === proj.id
                                ? { ...v, duration: e.target.value }
                                : v
                            );
                            onUpdateVideoShowreelProjects(next);
                          }}
                          placeholder="Duration"
                          className="px-2.5 py-1 text-xs font-mono-tabular bg-white border border-slate-300 rounded"
                        />
                        <input
                          type="text"
                          value={proj.turnaround}
                          onChange={(e) => {
                            const next = videoShowreelProjects.map((v) =>
                              v.id === proj.id
                                ? { ...v, turnaround: e.target.value }
                                : v
                            );
                            onUpdateVideoShowreelProjects(next);
                          }}
                          placeholder="Turnaround SLA"
                          className="px-2.5 py-1 text-xs font-mono-tabular bg-white border border-slate-300 rounded"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={proj.priceLabel}
                          onChange={(e) => {
                            const next = videoShowreelProjects.map((v) =>
                              v.id === proj.id
                                ? { ...v, priceLabel: e.target.value }
                                : v
                            );
                            onUpdateVideoShowreelProjects(next);
                          }}
                          placeholder="Price Label"
                          className="px-2.5 py-1 text-xs font-mono-tabular font-bold text-[#0088FF] bg-white border border-slate-300 rounded"
                        />
                        <input
                          type="text"
                          value={proj.outcomeMetric}
                          onChange={(e) => {
                            const next = videoShowreelProjects.map((v) =>
                              v.id === proj.id
                                ? { ...v, outcomeMetric: e.target.value }
                                : v
                            );
                            onUpdateVideoShowreelProjects(next);
                          }}
                          placeholder="Outcome Metric"
                          className="px-2.5 py-1 text-xs font-mono-tabular text-emerald-700 bg-white border border-slate-300 rounded"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={proj.videoPreviewUrl || ''}
                          onChange={(e) => {
                            const next = videoShowreelProjects.map((v) =>
                              v.id === proj.id
                                ? { ...v, videoPreviewUrl: e.target.value }
                                : v
                            );
                            onUpdateVideoShowreelProjects(next);
                          }}
                          placeholder="MP4 Video URL (Optional)"
                          className="px-2.5 py-1 text-xs font-mono-tabular bg-white border border-slate-300 rounded"
                        />
                        <label className="py-1.5 px-3 rounded bg-[#EAF3FC] hover:bg-[#001E5A] hover:text-white text-[#001E5A] text-xs font-semibold cursor-pointer transition-colors flex items-center justify-center gap-1.5 text-center">
                          <UploadCloud className="w-3.5 h-3.5 shrink-0" />
                          <span>
                            {proj.thumbnailImageUrl
                              ? 'Replace Video Thumbnail'
                              : 'Upload Video Thumbnail'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (!f) return;
                              readImageFileAsDataUrl(f, (dataUrl) => {
                                const next = videoShowreelProjects.map((v) =>
                                  v.id === proj.id
                                    ? { ...v, thumbnailImageUrl: dataUrl }
                                    : v
                                );
                                onUpdateVideoShowreelProjects(next);
                                notifySaved(
                                  `Uploaded thumbnail for "${proj.title}"!`
                                );
                              });
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              MODULE 7: CUSTOMER REVIEWS CAROUSEL MANAGER
             =================================================================== */}
          {activeTab === 'reviews_carousel' && (
            <div className="space-y-8">
              <form
                onSubmit={handleAddCustomerReview}
                className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <p className="text-xs font-mono-tabular font-bold text-[#0088FF]">
                      + ADD VERIFIED CLIENT REVIEW
                    </p>
                    <h2 className="text-lg font-bold text-[#001E5A]">
                      Publish New Review to the 3-Card Customer Review Carousel
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input
                    type="text"
                    required
                    value={revClientName}
                    onChange={(e) => setRevClientName(e.target.value)}
                    placeholder="Client Name *"
                    className="px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                  <input
                    type="text"
                    value={revRole}
                    onChange={(e) => setRevRole(e.target.value)}
                    placeholder="Role (e.g., Head of Studio)"
                    className="px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                  <input
                    type="text"
                    value={revCompany}
                    onChange={(e) => setRevCompany(e.target.value)}
                    placeholder="Company / Brand"
                    className="px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                  <select
                    value={revCategory}
                    onChange={(e) =>
                      setRevCategory(e.target.value as ServiceCategory)
                    }
                    className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="clipping_path">Clipping Path</option>
                    <option value="ghost_mannequin">Ghost Mannequin</option>
                    <option value="jewelry_retouch">Jewelry Retouching</option>
                    <option value="beauty_high_end">Photo Retouching</option>
                    <option value="ecommerce_shadow">E-Commerce Ready</option>
                    <option value="color_variants">Real Estate & Color</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={revHeadline}
                    onChange={(e) => setRevHeadline(e.target.value)}
                    placeholder="Review Headline *"
                    className="px-3 py-2 text-xs border border-slate-300 rounded-lg font-semibold"
                  />
                  <input
                    type="text"
                    value={revOutcome}
                    onChange={(e) => setRevOutcome(e.target.value)}
                    placeholder="Measurable Result (e.g., Saved 18 hours per catalog shoot)"
                    className="px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>

                <textarea
                  rows={2}
                  required
                  value={revQuote}
                  onChange={(e) => setRevQuote(e.target.value)}
                  placeholder="Detailed client review quote *"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />

                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-[#001E5A] hover:bg-[#0088FF] rounded-lg transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Review to 3-Card Carousel</span>
                </button>
              </form>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                <h2 className="text-lg font-bold text-[#001E5A] border-b border-slate-200 pb-3">
                  Manage Existing 3-Card Carousel Reviews ({customerReviews.length} Active)
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {customerReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={rev.clientName}
                          onChange={(e) => {
                            const next = customerReviews.map((r) =>
                              r.id === rev.id
                                ? { ...r, clientName: e.target.value }
                                : r
                            );
                            onUpdateCustomerReviews(next);
                          }}
                          className="px-2.5 py-1 text-xs font-bold text-[#001E5A] bg-white border border-slate-300 rounded"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateCustomerReviews(
                              customerReviews.filter((r) => r.id !== rev.id)
                            )
                          }
                          className="text-slate-400 hover:text-red-600 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={rev.headline}
                        onChange={(e) => {
                          const next = customerReviews.map((r) =>
                            r.id === rev.id
                              ? { ...r, headline: e.target.value }
                              : r
                          );
                          onUpdateCustomerReviews(next);
                        }}
                        className="w-full px-2.5 py-1 text-xs font-semibold text-[#001E5A] bg-white border border-slate-300 rounded"
                      />
                      <textarea
                        rows={2}
                        value={rev.quote}
                        onChange={(e) => {
                          const next = customerReviews.map((r) =>
                            r.id === rev.id
                              ? { ...r, quote: e.target.value }
                              : r
                          );
                          onUpdateCustomerReviews(next);
                        }}
                        className="w-full px-2.5 py-1 text-xs text-slate-600 bg-white border border-slate-300 rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              MODULE 7B: STUDIO BLOG POSTS & BLOG SEO MANAGER (NEWEST SHOWN 1ST)
             =================================================================== */}
          {activeTab === 'blog_manager' && (
            <div className="space-y-8">
              {/* Publish New Blog Post Form (Automatically placed #1 First) */}
              <form
                onSubmit={handleAddBlogPost}
                className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div>
                    <p className="text-xs font-mono-tabular font-bold text-[#0088FF]">
                      + PUBLISH NEW BLOG ARTICLE (AUTOMATICALLY SHOWN 1ST ON SITE)
                    </p>
                    <h2 className="text-lg font-bold text-[#001E5A]">
                      Add New Blog Post After Reviews Section (With Full On-Page SEO)
                    </h2>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono-tabular font-semibold">
                    Last Added Blog = #1 First Position
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                      Blog Post Title (H1/H2) *
                    </label>
                    <input
                      type="text"
                      required
                      value={newBlogTitle}
                      onChange={(e) => setNewBlogTitle(e.target.value)}
                      placeholder="e.g., How 16-Bit Frequency Separation Preserves Natural Skin Texture"
                      className="w-full px-3 py-2 text-xs font-bold text-[#001E5A] border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                      Category Tag *
                    </label>
                    <input
                      type="text"
                      required
                      value={newBlogCategory}
                      onChange={(e) => setNewBlogCategory(e.target.value)}
                      placeholder="e.g., Clipping Path & E-Commerce"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                      Author Name
                    </label>
                    <input
                      type="text"
                      value={newBlogAuthorName}
                      onChange={(e) => setNewBlogAuthorName(e.target.value)}
                      placeholder="Elena Rostova"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                      Author Role
                    </label>
                    <input
                      type="text"
                      value={newBlogAuthorRole}
                      onChange={(e) => setNewBlogAuthorRole(e.target.value)}
                      placeholder="Lead Retouching Director"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                      Read Time
                    </label>
                    <input
                      type="text"
                      value={newBlogReadTime}
                      onChange={(e) => setNewBlogReadTime(e.target.value)}
                      placeholder="5 min read"
                      className="w-full px-3 py-2 text-xs font-mono-tabular border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                      Related Service Page
                    </label>
                    <select
                      value={newBlogRelatedSlug}
                      onChange={(e) => setNewBlogRelatedSlug(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                    >
                      {servicesList.map((s) => (
                        <option key={s.slug} value={s.slug}>
                          {s.indexNumber} {s.shortNavTitle}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                    Short Summary / Excerpt (Shown on Blog Card) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={newBlogExcerpt}
                    onChange={(e) => setNewBlogExcerpt(e.target.value)}
                    placeholder="Write a 1–2 sentence summary of the article..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                    Full Blog Article Content (Paragraphs) *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={newBlogContent}
                    onChange={(e) => setNewBlogContent(e.target.value)}
                    placeholder="Write the full blog post body here. Separate paragraphs with a blank line..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>

                {/* Blog SEO Title & Meta Description */}
                <div className="p-4 rounded-xl bg-[#EAF3FC]/70 border border-[#B8D0EB] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono-tabular font-bold text-[#0088FF]">
                      BLOG POST ON-PAGE SEO (META TITLE &amp; META DESCRIPTION)
                    </span>
                    <span className="text-[11px] font-mono-tabular text-emerald-700 font-semibold">
                      Injected into &lt;title&gt;, &lt;meta description&gt; &amp; BlogPosting Schema
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#001E5A] mb-1">
                        Blog SEO Title (&lt;title&gt;)
                      </label>
                      <input
                        type="text"
                        value={newBlogSeoTitle}
                        onChange={(e) => setNewBlogSeoTitle(e.target.value)}
                        placeholder="Defaults to Blog Title | FixPhoto Studio Blog"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#001E5A] mb-1">
                        Blog SEO Meta Description (&lt;meta name=&quot;description&quot;&gt;)
                      </label>
                      <input
                        type="text"
                        value={newBlogSeoDesc}
                        onChange={(e) => setNewBlogSeoDesc(e.target.value)}
                        placeholder="Defaults to Blog Excerpt (150–160 chars recommended)"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <label className="px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-dashed border-[#0088FF] cursor-pointer hover:bg-[#EAF3FC]/60 flex items-center gap-2 text-xs font-semibold text-[#001E5A]">
                    <UploadCloud className="w-4 h-4 text-[#0088FF]" />
                    <span>
                      {newBlogCoverImg
                        ? 'Custom Blog Cover Image Attached ✓'
                        : 'Optional: Upload Blog Cover Image'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) readImageFileAsDataUrl(f, setNewBlogCoverImg);
                      }}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="submit"
                    className="px-6 py-2.5 text-xs font-bold text-white bg-[#001E5A] hover:bg-[#0088FF] rounded-xl transition-colors flex items-center gap-2 shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Publish Blog Post (Show 1st on Website)</span>
                  </button>
                </div>
              </form>

              {/* Manage & Edit Existing Blog Posts */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div>
                    <h2 className="text-lg font-bold text-[#001E5A]">
                      Manage &amp; Edit Published Blog Posts ({blogPosts.length} Active)
                    </h2>
                    <p className="text-xs text-slate-500">
                      Position #1 is displayed first on the website. Edit any field, update SEO Title &amp; Meta Description, upload a cover photo, or click &ldquo;Make #1 First&rdquo; to move any post to the first spot.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {blogPosts.map((post, idx) => (
                    <div
                      key={post.id}
                      className={`p-5 rounded-2xl border space-y-3.5 ${
                        idx === 0
                          ? 'bg-[#F0F7FF] border-[#0088FF]'
                          : 'bg-[#F8FAFC] border-slate-200'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono-tabular font-bold ${
                              idx === 0
                                ? 'bg-[#0088FF] text-white'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {idx === 0
                              ? '★ SHOWN 1ST ON SITE (#1 LATEST)'
                              : `POSITION #${idx + 1}`}
                          </span>
                          <span className="text-xs font-mono-tabular text-slate-500">
                            ID: {post.id}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {idx > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                const remaining = blogPosts.filter(
                                  (b) => b.id !== post.id
                                );
                                onUpdateBlogPosts([post, ...remaining]);
                                notifySaved(
                                  `Moved "${post.title}" to #1 First position on the website!`
                                );
                              }}
                              className="px-3 py-1 rounded-lg bg-[#001E5A] hover:bg-[#0088FF] text-white text-[11px] font-bold transition-colors"
                            >
                              Make #1 First ↑
                            </button>
                          )}

                          <label className="px-3 py-1 rounded-lg bg-white border border-slate-300 hover:border-[#0088FF] text-[#001E5A] text-[11px] font-semibold cursor-pointer flex items-center gap-1">
                            <UploadCloud className="w-3.5 h-3.5 text-[#0088FF]" />
                            <span>
                              {post.coverImageUrl
                                ? 'Replace Cover Image'
                                : 'Upload Cover Image'}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                readImageFileAsDataUrl(file, (dataUrl) => {
                                  const next = blogPosts.map((b) =>
                                    b.id === post.id
                                      ? { ...b, coverImageUrl: dataUrl }
                                      : b
                                  );
                                  onUpdateBlogPosts(next);
                                  notifySaved(
                                    `Updated cover image for "${post.title}"!`
                                  );
                                });
                              }}
                              className="hidden"
                            />
                          </label>

                          <button
                            type="button"
                            onClick={() => {
                              onUpdateBlogPosts(
                                blogPosts.filter((b) => b.id !== post.id)
                              );
                              notifySaved(`Deleted blog post "${post.title}".`);
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded"
                            title="Delete Blog Post"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-2">
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Blog Title
                          </label>
                          <input
                            type="text"
                            value={post.title}
                            onChange={(e) => {
                              const next = blogPosts.map((b) =>
                                b.id === post.id
                                  ? { ...b, title: e.target.value }
                                  : b
                              );
                              onUpdateBlogPosts(next);
                            }}
                            className="w-full px-3 py-1.5 text-xs font-bold text-[#001E5A] bg-white border border-slate-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Category
                          </label>
                          <input
                            type="text"
                            value={post.category}
                            onChange={(e) => {
                              const next = blogPosts.map((b) =>
                                b.id === post.id
                                  ? { ...b, category: e.target.value }
                                  : b
                              );
                              onUpdateBlogPosts(next);
                            }}
                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Author Name
                          </label>
                          <input
                            type="text"
                            value={post.authorName}
                            onChange={(e) => {
                              const next = blogPosts.map((b) =>
                                b.id === post.id
                                  ? { ...b, authorName: e.target.value }
                                  : b
                              );
                              onUpdateBlogPosts(next);
                            }}
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Author Role
                          </label>
                          <input
                            type="text"
                            value={post.authorRole}
                            onChange={(e) => {
                              const next = blogPosts.map((b) =>
                                b.id === post.id
                                  ? { ...b, authorRole: e.target.value }
                                  : b
                              );
                              onUpdateBlogPosts(next);
                            }}
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Published Date
                          </label>
                          <input
                            type="text"
                            value={post.publishedAt}
                            onChange={(e) => {
                              const next = blogPosts.map((b) =>
                                b.id === post.id
                                  ? { ...b, publishedAt: e.target.value }
                                  : b
                              );
                              onUpdateBlogPosts(next);
                            }}
                            className="w-full px-2.5 py-1.5 text-xs font-mono-tabular bg-white border border-slate-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Read Time
                          </label>
                          <input
                            type="text"
                            value={post.readTime}
                            onChange={(e) => {
                              const next = blogPosts.map((b) =>
                                b.id === post.id
                                  ? { ...b, readTime: e.target.value }
                                  : b
                              );
                              onUpdateBlogPosts(next);
                            }}
                            className="w-full px-2.5 py-1.5 text-xs font-mono-tabular bg-white border border-slate-300 rounded-lg"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Card Summary / Excerpt
                        </label>
                        <textarea
                          rows={2}
                          value={post.excerpt}
                          onChange={(e) => {
                            const next = blogPosts.map((b) =>
                              b.id === post.id
                                ? { ...b, excerpt: e.target.value }
                                : b
                            );
                            onUpdateBlogPosts(next);
                          }}
                          className="w-full px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Full Article Content
                        </label>
                        <textarea
                          rows={4}
                          value={post.content}
                          onChange={(e) => {
                            const next = blogPosts.map((b) =>
                              b.id === post.id
                                ? { ...b, content: e.target.value }
                                : b
                            );
                            onUpdateBlogPosts(next);
                          }}
                          className="w-full px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-300 rounded-lg"
                        />
                      </div>

                      {/* Blog Post Live SEO Title & Meta Description Editor */}
                      <div className="p-3.5 rounded-xl bg-white border border-[#B8D0EB] grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#0088FF] mb-1">
                            SEO Meta Title (&lt;title&gt;)
                          </label>
                          <input
                            type="text"
                            value={
                              post.seoTitle ??
                              `${post.title} | FixPhoto Studio Blog`
                            }
                            onChange={(e) => {
                              const next = blogPosts.map((b) =>
                                b.id === post.id
                                  ? { ...b, seoTitle: e.target.value }
                                  : b
                              );
                              onUpdateBlogPosts(next);
                            }}
                            className="w-full px-2.5 py-1.5 text-xs font-semibold text-[#001E5A] bg-[#F8FAFC] border border-slate-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-[#0088FF] mb-1">
                            SEO Meta Description (&lt;meta name=&quot;description&quot;&gt;)
                          </label>
                          <input
                            type="text"
                            value={post.seoMetaDescription ?? post.excerpt}
                            onChange={(e) => {
                              const next = blogPosts.map((b) =>
                                b.id === post.id
                                  ? {
                                      ...b,
                                      seoMetaDescription: e.target.value,
                                    }
                                  : b
                              );
                              onUpdateBlogPosts(next);
                            }}
                            className="w-full px-2.5 py-1.5 text-xs text-slate-700 bg-[#F8FAFC] border border-slate-300 rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              MODULE 7C: CENTRALIZED ON-PAGE SEO MANAGER (ALL PAGES, SERVICES & BLOGS)
             =================================================================== */}
          {activeTab === 'seo_manager' && (
            <div className="space-y-8">
              {/* 1. Core Website Pages SEO Title & Meta Description */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xs">
                <div className="border-b border-slate-200 pb-3">
                  <p className="text-xs font-mono-tabular font-bold text-[#0088FF]">
                    01 · MAIN WEBSITE PAGES ON-PAGE SEO
                  </p>
                  <h2 className="text-lg font-bold text-[#001E5A]">
                    Edit SEO Title (&lt;title&gt;) &amp; Meta Description for All Main Website Pages
                  </h2>
                  <p className="text-xs text-slate-600">
                    Every change here updates the live browser <code className="font-mono-tabular bg-slate-100 px-1 rounded">&lt;title&gt;</code>, <code className="font-mono-tabular bg-slate-100 px-1 rounded">&lt;meta name=&quot;description&quot;&gt;</code>, OpenGraph tags, Twitter cards, and Schema.org JSON-LD.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      key: 'home',
                      label: 'Home Page (#top)',
                      defaultTitle:
                        'FixPhoto Studio – Commercial Photo & Video Editing',
                      defaultDesc:
                        'Get pixel-perfect clipping paths ($0.39/img), 3D ghost mannequins, jewelry retouching, and 4K video editing in 12–24h. Try 5 images free today.',
                    },
                    {
                      key: 'services_page',
                      label: 'All Services Directory Page (#services)',
                      defaultTitle:
                        'All Photo & Video Editing Services – FixPhoto Studio',
                      defaultDesc:
                        'Explore dedicated photo editing and 4K video post-production pods with 12h–24h SLA turnaround and 99.94% QA accuracy. Order online.',
                    },
                    {
                      key: 'video_editing_page',
                      label: 'Video Editing Studio Page (#video-editing)',
                      defaultTitle:
                        '4K Video Editing & Color Grading – FixPhoto Studio',
                      defaultDesc:
                        'Commercial 4K product video editing, fashion social reels, wedding cinema grading, and VFX rotoscoping delivered in 12–48h.',
                    },
                    {
                      key: 'portfolio_page',
                      label: 'Photo & Video Portfolio Page (#portfolio)',
                      defaultTitle:
                        'Before & After Photo & Video Portfolio – FixPhoto Studio',
                      defaultDesc:
                        'Inspect pixel-level Before & After clipping paths, 3D ghost mannequins, fine jewelry retouching, and 4K video showreels.',
                    },
                    {
                      key: 'free_trial_page',
                      label: 'Free Trial Page (#free-trial)',
                      defaultTitle:
                        'Free 5-Image Photo Editing Trial – FixPhoto Studio',
                      defaultDesc:
                        'Test FixPhoto Studio free of charge. Upload up to 5 RAW or studio frames and receive retouched masters in 12–24 hours.',
                    },
                    {
                      key: 'get_quote_page',
                      label: 'Get a Quote Page (#get-quote)',
                      defaultTitle:
                        'Instant Volume Quote Calculator – FixPhoto Studio',
                      defaultDesc:
                        'Calculate custom bulk pricing for commercial photo editing and 4K video post-production with guaranteed SLA delivery.',
                    },
                    {
                      key: 'blogs_page',
                      label: 'Blogs Directory Page (/blogs · #blogs)',
                      defaultTitle:
                        'Commercial Photo & Video Editing Blog – FixPhoto Studio',
                      defaultDesc:
                        'Read technical guides on Bezier clipping paths, 3D ghost mannequins, fine jewelry retouching, Flambient HDR, and 4K video post-production.',
                    },
                    {
                      key: 'portal',
                      label: 'Client Portal Page (#client-portal)',
                      defaultTitle:
                        'Client Portal & Live Batch Tracker – FixPhoto Studio',
                      defaultDesc:
                        'Manage active photo and video retouching orders, track 6-stage QA progress in real time, and download official PDF invoices.',
                    },
                  ].map((pageItem) => {
                    const currentEntry = siteConfig.pageSeo?.[pageItem.key] || {
                      seoTitle: pageItem.defaultTitle,
                      seoMetaDescription: pageItem.defaultDesc,
                    };
                    return (
                      <div
                        key={pageItem.key}
                        className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-2.5"
                      >
                        <p className="text-xs font-bold text-[#001E5A]">
                          {pageItem.label}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              SEO Title (&lt;title&gt;)
                            </label>
                            <input
                              type="text"
                              value={currentEntry.seoTitle}
                              onChange={(e) => {
                                const nextPageSeo = {
                                  ...(siteConfig.pageSeo || {}),
                                  [pageItem.key]: {
                                    ...currentEntry,
                                    seoTitle: e.target.value,
                                  },
                                };
                                onUpdateSiteConfig({
                                  ...siteConfig,
                                  pageSeo: nextPageSeo,
                                });
                              }}
                              className="w-full px-3 py-1.5 text-xs font-semibold text-[#001E5A] bg-white border border-slate-300 rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Meta Description (&lt;meta name=&quot;description&quot;&gt;)
                            </label>
                            <input
                              type="text"
                              value={currentEntry.seoMetaDescription}
                              onChange={(e) => {
                                const nextPageSeo = {
                                  ...(siteConfig.pageSeo || {}),
                                  [pageItem.key]: {
                                    ...currentEntry,
                                    seoMetaDescription: e.target.value,
                                  },
                                };
                                onUpdateSiteConfig({
                                  ...siteConfig,
                                  pageSeo: nextPageSeo,
                                });
                              }}
                              className="w-full px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-300 rounded-lg"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. All Individual Photo & Video Service Pages SEO */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xs">
                <div className="border-b border-slate-200 pb-3">
                  <p className="text-xs font-mono-tabular font-bold text-[#0088FF]">
                    02 · ALL {servicesList.length} PHOTO &amp; VIDEO SERVICE PAGES SEO
                  </p>
                  <h2 className="text-lg font-bold text-[#001E5A]">
                    Edit SEO Title &amp; Meta Description for Every Service Page
                  </h2>
                </div>

                <div className="space-y-3">
                  {servicesList.map((srv) => {
                    const rateStr = `$${srv.ratePerImage.toFixed(2)}/${srv.unitLabel}`;
                    const fallbackTitle = `${srv.shortNavTitle} (${rateStr}) – FixPhoto Studio`;
                    const fallbackDesc = `${srv.summary.slice(0, 95).trim()} Starting at ${rateStr} with ${srv.turnaroundLabel.split('·')[0].trim()}. Claim your free 5-image trial today.`;
                    return (
                      <div
                        key={srv.slug}
                        className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#001E5A]">
                            {srv.indexNumber} · {srv.title}
                          </span>
                          <span className="text-[11px] font-mono-tabular text-[#0088FF]">
                            #service/{srv.slug}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              SEO Title (&lt;title&gt;)
                            </label>
                            <input
                              type="text"
                              value={srv.seoTitle ?? fallbackTitle}
                              onChange={(e) => {
                                onUpdateServicesList(
                                  servicesList.map((s) =>
                                    s.slug === srv.slug
                                      ? { ...s, seoTitle: e.target.value }
                                      : s
                                  )
                                );
                              }}
                              className="w-full px-3 py-1.5 text-xs font-semibold text-[#001E5A] bg-white border border-slate-300 rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Meta Description (&lt;meta name=&quot;description&quot;&gt;)
                            </label>
                            <input
                              type="text"
                              value={srv.seoMetaDescription ?? fallbackDesc}
                              onChange={(e) => {
                                onUpdateServicesList(
                                  servicesList.map((s) =>
                                    s.slug === srv.slug
                                      ? {
                                          ...s,
                                          seoMetaDescription: e.target.value,
                                        }
                                      : s
                                  )
                                );
                              }}
                              className="w-full px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-300 rounded-lg"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. All Blog Posts SEO */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xs">
                <div className="border-b border-slate-200 pb-3">
                  <p className="text-xs font-mono-tabular font-bold text-[#0088FF]">
                    03 · ALL {blogPosts.length} BLOG POSTS SEO
                  </p>
                  <h2 className="text-lg font-bold text-[#001E5A]">
                    Edit SEO Title &amp; Meta Description for Every Blog Article
                  </h2>
                </div>

                <div className="space-y-3">
                  {blogPosts.map((post, idx) => (
                    <div
                      key={post.id}
                      className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#001E5A]">
                          #{idx + 1} · {post.title}
                        </span>
                        <span className="text-[11px] font-mono-tabular text-[#0088FF]">
                          {post.category}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Blog SEO Title (&lt;title&gt;)
                          </label>
                          <input
                            type="text"
                            value={
                              post.seoTitle ??
                              `${post.title} | FixPhoto Studio Blog`
                            }
                            onChange={(e) => {
                              onUpdateBlogPosts(
                                blogPosts.map((b) =>
                                  b.id === post.id
                                    ? { ...b, seoTitle: e.target.value }
                                    : b
                                )
                              );
                            }}
                            className="w-full px-3 py-1.5 text-xs font-semibold text-[#001E5A] bg-white border border-slate-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Blog Meta Description (&lt;meta name=&quot;description&quot;&gt;)
                          </label>
                          <input
                            type="text"
                            value={post.seoMetaDescription ?? post.excerpt}
                            onChange={(e) => {
                              onUpdateBlogPosts(
                                blogPosts.map((b) =>
                                  b.id === post.id
                                    ? {
                                        ...b,
                                        seoMetaDescription: e.target.value,
                                      }
                                    : b
                                )
                              );
                            }}
                            className="w-full px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-300 rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              MODULE 8: GLOBAL HERO, METRICS, SUBSCRIPTION PLANS & FOOTER EDITOR
             =================================================================== */}
          {activeTab === 'global_hero_footer' && (
            <div className="space-y-8">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
                <h2 className="text-lg font-bold text-[#001E5A] border-b border-slate-200 pb-3">
                  Edit Home Hero Headlines, Quantitative Proof Metrics & Footer Copy
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                      Hero Eyebrow Line
                    </label>
                    <input
                      type="text"
                      value={siteConfig.heroEyebrow}
                      onChange={(e) =>
                        onUpdateSiteConfig({
                          ...siteConfig,
                          heroEyebrow: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-xs font-mono-tabular border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                      Primary Hero Button Label
                    </label>
                    <input
                      type="text"
                      value={siteConfig.primaryCtaLabel}
                      onChange={(e) =>
                        onUpdateSiteConfig({
                          ...siteConfig,
                          primaryCtaLabel: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                    Hero Main Headline (H1)
                  </label>
                  <input
                    type="text"
                    value={siteConfig.heroHeadline}
                    onChange={(e) =>
                      onUpdateSiteConfig({
                        ...siteConfig,
                        heroHeadline: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 text-sm font-bold text-[#001E5A] border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                    Hero Lead Paragraph
                  </label>
                  <textarea
                    rows={2}
                    value={siteConfig.heroSubtitle}
                    onChange={(e) =>
                      onUpdateSiteConfig({
                        ...siteConfig,
                        heroSubtitle: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                      Metric 1 Value
                    </label>
                    <input
                      type="text"
                      value={siteConfig.stat1Value}
                      onChange={(e) =>
                        onUpdateSiteConfig({
                          ...siteConfig,
                          stat1Value: e.target.value,
                        })
                      }
                      className="w-full px-3 py-1.5 text-xs font-mono-tabular font-bold border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                      Metric 2 Value
                    </label>
                    <input
                      type="text"
                      value={siteConfig.stat2Value}
                      onChange={(e) =>
                        onUpdateSiteConfig({
                          ...siteConfig,
                          stat2Value: e.target.value,
                        })
                      }
                      className="w-full px-3 py-1.5 text-xs font-mono-tabular font-bold border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                      Metric 3 Value
                    </label>
                    <input
                      type="text"
                      value={siteConfig.stat3Value}
                      onChange={(e) =>
                        onUpdateSiteConfig({
                          ...siteConfig,
                          stat3Value: e.target.value,
                        })
                      }
                      className="w-full px-3 py-1.5 text-xs font-mono-tabular font-bold border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                      Metric 4 Value
                    </label>
                    <input
                      type="text"
                      value={siteConfig.stat4Value}
                      onChange={(e) =>
                        onUpdateSiteConfig({
                          ...siteConfig,
                          stat4Value: e.target.value,
                        })
                      }
                      className="w-full px-3 py-1.5 text-xs font-mono-tabular font-bold border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-200">
                  <div>
                    <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                      Footer Agency Description
                    </label>
                    <textarea
                      rows={2}
                      value={siteConfig.footerTagline}
                      onChange={(e) =>
                        onUpdateSiteConfig({
                          ...siteConfig,
                          footerTagline: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                      Footer Domain & Operations Line
                    </label>
                    <input
                      type="text"
                      value={siteConfig.footerDomainLine}
                      onChange={(e) =>
                        onUpdateSiteConfig({
                          ...siteConfig,
                          footerDomainLine: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-xs font-mono-tabular border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              MODULE 8B: ADMIN ACCOUNTS & STRICT ACCESS CONTROL (MAIN ADMIN ONLY)
             =================================================================== */}
          {activeTab === 'admin_accounts' && (
            <div className="space-y-8">
              {/* Top Security Banner */}
              <div className="bg-gradient-to-r from-[#041029] via-[#0A2254] to-[#041029] text-white rounded-2xl p-6 sm:p-8 border border-blue-900/50 shadow-lg">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-[#00B8FF] text-[11px] font-mono-tabular font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>STRICT ROLE-BASED ADMIN SECURITY</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                      Main Admin & Authorized Sub-Admin Accounts
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Public admin sign-up and 1-click guest login are disabled. Only the{' '}
                      <strong className="text-white">
                        Main Super Admin (asiaclipp@gmail.com)
                      </strong>{' '}
                      can create new Admin accounts or revoke existing sub-admins. Nobody else on the website can register as an admin or log into the Admin Panel.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.06] border border-white/15 shrink-0 space-y-1">
                    <p className="text-[10px] font-mono-tabular text-slate-300 uppercase">
                      YOUR CURRENT SESSION ROLE
                    </p>
                    <p className="text-sm font-bold text-emerald-300">
                      {isMainSuperAdmin
                        ? '★ Main Super Admin (Full Owner Rights)'
                        : 'Authorized Sub-Admin'}
                    </p>
                    <p className="text-xs font-mono-tabular text-white">
                      {loggedInAdminEmail || googleEmail || 'asiaclipp@gmail.com'}
                    </p>
                  </div>
                </div>
              </div>

              {!isMainSuperAdmin ? (
                <div className="bg-amber-50 border border-amber-300 rounded-2xl p-6 text-amber-950 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <Lock className="w-4 h-4 text-amber-700" />
                    <span>
                      Main Super Admin Permission Required (asiaclipp@gmail.com)
                    </span>
                  </div>
                  <p className="text-xs text-amber-900 leading-relaxed">
                    You are currently signed in as a Sub-Admin (
                    <strong>{loggedInAdminEmail}</strong>). Only the Main Super Admin account (<strong>asiaclipp@gmail.com</strong>) is allowed to create new Admin accounts, change the master password, or remove administrators.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left: Create New Sub-Admin Account (Main Admin Only) */}
                  <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
                    <div className="border-b border-slate-200 pb-3">
                      <span className="text-[11px] font-mono-tabular font-bold text-[#0088FF]">
                        MAIN ADMIN EXCLUSIVE ACTION
                      </span>
                      <h3 className="text-lg font-bold text-[#001E5A]">
                        Create a New Admin Account
                      </h3>
                      <p className="text-xs text-slate-600">
                        Add a trusted team member or manager so they can log in at <code className="font-mono-tabular bg-slate-100 px-1 py-0.5 rounded">#admin-login</code> with their own email and password.
                      </p>
                    </div>

                    <form
                      onSubmit={handleCreateNewAdminAccount}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                            Admin Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={newAdminName}
                            onChange={(e) => setNewAdminName(e.target.value)}
                            placeholder="e.g., Production Manager"
                            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                            Admin Login Email *
                          </label>
                          <input
                            type="email"
                            required
                            value={newAdminEmail}
                            onChange={(e) => setNewAdminEmail(e.target.value)}
                            placeholder="manager@fixphotostudio.com"
                            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                          Assign Login Password *
                        </label>
                        <input
                          type="text"
                          required
                          value={newAdminPassword}
                          onChange={(e) => setNewAdminPassword(e.target.value)}
                          placeholder="Create a strong password for this admin"
                          className="w-full px-3 py-2 text-xs font-mono-tabular border border-slate-300 rounded-lg"
                        />
                      </div>

                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-[#0088FF] hover:bg-[#001E5A] text-white text-xs font-bold transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Create Authorized Admin Account</span>
                      </button>
                    </form>
                  </div>

                  {/* Right: Change Main Super Admin Password */}
                  <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="border-b border-slate-200 pb-3">
                        <span className="text-[11px] font-mono-tabular font-bold text-emerald-700">
                          MAIN SUPER ADMIN CREDENTIALS
                        </span>
                        <h3 className="text-lg font-bold text-[#001E5A]">
                          Update Main Admin Password
                        </h3>
                        <p className="text-xs text-slate-600">
                          Change the master password for <strong>asiaclipp@gmail.com</strong>.
                        </p>
                      </div>

                      <form
                        onSubmit={handleUpdateMainAdminPassword}
                        className="space-y-3 pt-1"
                      >
                        <div>
                          <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                            Main Admin Email (Permanent Owner)
                          </label>
                          <input
                            type="text"
                            disabled
                            value="asiaclipp@gmail.com"
                            className="w-full px-3 py-2 text-xs font-mono-tabular bg-slate-100 border border-slate-300 rounded-lg text-slate-600"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                            New Master Password *
                          </label>
                          <input
                            type="text"
                            required
                            value={mainAdminNewPassword}
                            onChange={(e) =>
                              setMainAdminNewPassword(e.target.value)
                            }
                            placeholder="Enter new master password"
                            className="w-full px-3 py-2 text-xs font-mono-tabular border border-slate-300 rounded-lg"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 px-4 rounded-xl bg-[#001E5A] hover:bg-[#0088FF] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Save New Main Admin Password</span>
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {/* Registered Admin Accounts Directory Table */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-[#001E5A]">
                      Authorized Administrator Accounts ({adminAccounts.length})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Only the accounts listed below can sign in to the Admin Panel
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {adminAccounts.map((acc) => {
                    const isOwner =
                      acc.role === 'super_admin' ||
                      acc.email.toLowerCase() === 'asiaclipp@gmail.com';
                    return (
                      <div
                        key={acc.id}
                        className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 flex flex-wrap items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#001E5A]">
                              {acc.name}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-mono-tabular font-bold ${
                                isOwner
                                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                  : 'bg-blue-100 text-[#001E5A] border border-blue-200'
                              }`}
                            >
                              {isOwner
                                ? 'MAIN SUPER ADMIN (OWNER)'
                                : 'AUTHORIZED SUB-ADMIN'}
                            </span>
                          </div>
                          <p className="text-xs font-mono-tabular text-slate-700">
                            Email: <strong>{acc.email}</strong>
                            {isMainSuperAdmin && (
                              <span className="ml-4 text-slate-500">
                                Password: <strong>{acc.password}</strong>
                              </span>
                            )}
                          </p>
                        </div>

                        <div>
                          {isOwner ? (
                            <span className="px-3 py-1.5 rounded-lg bg-slate-200/70 text-slate-600 text-xs font-semibold inline-flex items-center gap-1.5">
                              <Lock className="w-3.5 h-3.5" />
                              <span>Permanent Main Admin</span>
                            </span>
                          ) : isMainSuperAdmin ? (
                            <button
                              type="button"
                              onClick={() => handleDeleteAdminAccount(acc)}
                              className="px-3.5 py-2 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-bold transition-colors flex items-center gap-1.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove Admin Access</span>
                            </button>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              MODULE 9: DATABASE DOWNLOAD, SQL DUMP & BACKUP CENTER
             =================================================================== */}
          {activeTab === 'database_backup' && (
            <div className="space-y-8">
              {/* Top Hero Banner for Database Export */}
              <div className="bg-gradient-to-r from-[#041029] via-[#08204E] to-[#041029] text-white rounded-2xl p-6 sm:p-8 border border-blue-900/50 shadow-lg">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-mono-tabular font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>1-CLICK FULL DATABASE EXPORT & MIGRATION CENTER</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                      Download Your Complete Website & Studio Database
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Export 100% of your orders, client inquiries, invoices, 17+ service pages (with split image/text blocks & pricing tiers), portfolio before/after items, and customer reviews in{' '}
                      <strong className="text-white">Full JSON</strong>,{' '}
                      <strong className="text-white">cPanel / MySQL (.sql)</strong>, or{' '}
                      <strong className="text-white">Excel (.csv)</strong> formats.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={handleExportAgencyBackupJson}
                      className="px-5 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold text-xs transition-colors flex items-center gap-2 shadow-md"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Full Database (.JSON)</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleExportSqlDump}
                      className="px-5 py-3 rounded-xl bg-[#0088FF] hover:bg-[#006FE0] text-white font-bold text-xs transition-colors flex items-center gap-2 shadow-md"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Download MySQL / cPanel (.SQL)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 3 Main Export Formats Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Card 1: Full JSON Backup */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-5 shadow-xs">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-mono-tabular font-bold">
                        FORMAT 01 · FULL NOSQL / JSON
                      </span>
                      <Download className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-bold text-[#001E5A]">
                      Complete System Backup (.JSON)
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Downloads a single master JSON file containing all collections, uploaded base64 images, orders, approval statuses, invoices, client queries, and CMS settings. Ideal for 1-click restoration or Firebase/MongoDB import.
                    </p>
                    <ul className="space-y-1.5 text-xs text-slate-700 pt-1">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>All {orders.length} Orders & 6-Stage Progress</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>All {clientQueries.length} Client Queries & Trial Leads</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>All {servicesList.length} Service Pages & Split Sections</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>All {portfolioItems.length} Before/After Portfolio Items</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={handleExportAgencyBackupJson}
                    className="w-full py-3 px-4 rounded-xl bg-[#001E5A] hover:bg-[#0088FF] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download FixPhotoStudio_Full_Database.json</span>
                  </button>
                </div>

                {/* Card 2: MySQL / cPanel SQL Dump */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-5 shadow-xs">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-md bg-blue-50 text-[#0088FF] border border-blue-200 text-[11px] font-mono-tabular font-bold">
                        FORMAT 02 · MYSQL / CPANEL (.SQL)
                      </span>
                      <FileText className="w-5 h-5 text-[#0088FF]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#001E5A]">
                      MySQL & phpMyAdmin Dump (.SQL)
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Generates a relational SQL script with <code className="font-mono-tabular bg-slate-100 px-1 py-0.5 rounded">CREATE TABLE</code> and <code className="font-mono-tabular bg-slate-100 px-1 py-0.5 rounded">INSERT INTO</code> statements. You can import this file directly inside <strong>cPanel → phpMyAdmin → Import</strong>.
                    </p>
                    <ul className="space-y-1.5 text-xs text-slate-700 pt-1">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#0088FF] shrink-0" />
                        <span>Table `orders` ({orders.length} rows)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#0088FF] shrink-0" />
                        <span>Table `client_queries` ({clientQueries.length} rows)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#0088FF] shrink-0" />
                        <span>Table `services` ({servicesList.length} rows)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#0088FF] shrink-0" />
                        <span>Tables `portfolio_items` & `customer_reviews`</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={handleExportSqlDump}
                    className="w-full py-3 px-4 rounded-xl bg-[#0088FF] hover:bg-[#001E5A] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download FixPhotoStudio_MySQL_Database.sql</span>
                  </button>
                </div>

                {/* Card 3: Excel / CSV Spreadsheets */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-5 shadow-xs">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-mono-tabular font-bold">
                        FORMAT 03 · EXCEL / GOOGLE SHEETS (.CSV)
                      </span>
                      <Layers className="w-5 h-5 text-amber-600" />
                    </div>
                    <h3 className="text-lg font-bold text-[#001E5A]">
                      Download Individual Tables (.CSV)
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Download clean spreadsheet tables compatible with Microsoft Excel and Google Sheets for accounting, client follow-ups, or reporting.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => handleExportCsvTable('orders')}
                      className="w-full py-2.5 px-3.5 rounded-xl bg-[#F8FAFC] hover:bg-[#EAF3FC] border border-slate-200 hover:border-[#0088FF] text-xs font-bold text-[#001E5A] transition-colors flex items-center justify-between"
                    >
                      <span>1. Orders & Pipeline ({orders.length})</span>
                      <span className="text-[#0088FF] font-mono-tabular">.CSV ↓</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleExportCsvTable('queries')}
                      className="w-full py-2.5 px-3.5 rounded-xl bg-[#F8FAFC] hover:bg-[#EAF3FC] border border-slate-200 hover:border-[#0088FF] text-xs font-bold text-[#001E5A] transition-colors flex items-center justify-between"
                    >
                      <span>2. Client Queries & Trials ({clientQueries.length})</span>
                      <span className="text-[#0088FF] font-mono-tabular">.CSV ↓</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleExportCsvTable('invoices')}
                      className="w-full py-2.5 px-3.5 rounded-xl bg-[#F8FAFC] hover:bg-[#EAF3FC] border border-slate-200 hover:border-[#0088FF] text-xs font-bold text-[#001E5A] transition-colors flex items-center justify-between"
                    >
                      <span>3. Customer Invoices ({invoiceNotifications.length})</span>
                      <span className="text-[#0088FF] font-mono-tabular">.CSV ↓</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleExportCsvTable('services')}
                      className="w-full py-2.5 px-3.5 rounded-xl bg-[#F8FAFC] hover:bg-[#EAF3FC] border border-slate-200 hover:border-[#0088FF] text-xs font-bold text-[#001E5A] transition-colors flex items-center justify-between"
                    >
                      <span>4. Services & Pricing ({servicesList.length})</span>
                      <span className="text-[#0088FF] font-mono-tabular">.CSV ↓</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Restore / Import Database from Backup File */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-7 space-y-2">
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono-tabular font-bold text-[#0088FF]">
                    <UploadCloud className="w-4 h-4" />
                    <span>RESTORE / IMPORT DATABASE BACKUP</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#001E5A]">
                    Upload a `.json` Backup File to Restore Website Data
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Have you previously downloaded a <code className="font-mono-tabular bg-slate-100 px-1.5 py-0.5 rounded">FixPhotoStudio_Full_Database.json</code> file? Select it below to immediately restore all service pages, split sections, portfolio images, client queries, reviews, and site settings.
                  </p>
                </div>

                <div className="lg:col-span-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
                  <label className="cursor-pointer px-5 py-3 rounded-xl bg-[#EAF3FC] hover:bg-[#0088FF] text-[#001E5A] hover:text-white border border-[#0088FF]/30 text-xs font-bold transition-colors flex items-center justify-center gap-2">
                    <UploadCloud className="w-4 h-4" />
                    <span>Upload & Restore `.JSON` Database</span>
                    <input
                      type="file"
                      accept=".json,application/json"
                      onChange={handleImportDatabaseJson}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
