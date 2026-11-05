import React, { useState } from 'react';
import {
  Plus,
  ShieldCheck,
  Send,
  Download,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  ArrowUpRight,
  Lock,
  LogIn,
  LogOut,
  Search,
  RefreshCw,
  UploadCloud,
  X,
  User,
  Mail,
  Phone,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  OrderDoc,
  OrderMessageDoc,
  NotificationAlertDoc,
  UserProfileDoc,
  PlanTier,
  BillingCycle,
  InvoicePaymentInfo,
  InvoicePaymentStatus,
} from '../types';
import { PIPELINE_STAGES, STUDIO_SERVICES } from '../data/studioCatalog';
import { FixPhotoBrandLogo } from './FixPhotoBrandLogo';
import { downloadCommercialInvoicePdf } from '../utils/invoicePdfGenerator';

interface ClientPortalViewProps {
  isAuthenticated: boolean;
  isSigningIn: boolean;
  userEmail: string | null;
  userProfile: UserProfileDoc;
  mfaSessionVerified: boolean;
  orders: OrderDoc[];
  selectedOrderId: string;
  onSelectOrder: (id: string) => void;
  messages: OrderMessageDoc[];
  notifications: NotificationAlertDoc[];
  orderApprovalMap: Record<string, 'pending' | 'approved'>;
  invoicePaymentInfo: InvoicePaymentInfo;
  invoiceStatusMap: Record<string, InvoicePaymentStatus>;
  onSignInGoogle: () => Promise<void>;
  onSignOut: () => Promise<void>;
  onOpenNewOrder: () => void;
  onOpenMfaModal: () => void;
  onAdvanceOrderStage: (order: OrderDoc) => Promise<void>;
  onSendMessage: (order: OrderDoc, body: string, attachmentName: string) => Promise<void>;
  onMarkNotificationRead: (notif: NotificationAlertDoc) => Promise<void>;
  onChangeSubscriptionPlan: (tier: PlanTier, cycle: BillingCycle) => Promise<void>;
  onClientPortalSessionChange?: (
    session: {
      name: string;
      email: string;
      phone?: string;
      companyName?: string;
      billingAddress?: string;
      website?: string;
    } | null
  ) => void;
  onUpdateClientProfile?: (payload: {
    oldEmail: string;
    newEmail: string;
    name: string;
    phone: string;
    companyName: string;
    billingAddress: string;
    website?: string;
    password?: string;
  }) => Promise<void>;
  onOpenAdminDashboard?: () => void;
}

export interface RegisteredClientAccount {
  name: string;
  email: string;
  password: string;
  phone: string;
  companyName: string;
  billingAddress: string;
  website?: string;
  updatedAt: string;
}

export const ClientPortalView: React.FC<ClientPortalViewProps> = ({
  isAuthenticated,
  isSigningIn,
  userEmail,
  userProfile,
  mfaSessionVerified,
  orders,
  selectedOrderId,
  onSelectOrder,
  messages,
  notifications,
  orderApprovalMap,
  invoicePaymentInfo,
  invoiceStatusMap,
  onSignInGoogle,
  onSignOut,
  onOpenNewOrder,
  onOpenMfaModal,
  onSendMessage,
  onMarkNotificationRead,
  onChangeSubscriptionPlan,
  onClientPortalSessionChange,
  onUpdateClientProfile,
  onOpenAdminDashboard,
}) => {
  const [portalSubTab, setPortalSubTab] = useState<
    'engagements' | 'notifications' | 'profile'
  >('engagements');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatAttachment, setChatAttachment] = useState('');
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [downloadFeedback, setDownloadFeedback] = useState<string | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<NotificationAlertDoc | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  // Client Portal Login Gate State (locks inner portal until Google OAuth or Client Email Login)
  const [clientSessionSignedIn, setClientSessionSignedIn] = useState<boolean>(() => {
    try {
      const saved = window.localStorage.getItem('fps_client_portal_session_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Boolean(parsed?.signedIn && parsed?.name);
      }
    } catch {
      // ignore
    }
    return false;
  });
  const [clientSessionEmail, setClientSessionEmail] = useState<string>(() => {
    try {
      const saved = window.localStorage.getItem('fps_client_portal_session_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed?.email || '';
      }
    } catch {
      // ignore
    }
    return '';
  });
  const [clientSessionName, setClientSessionName] = useState<string>(() => {
    try {
      const saved = window.localStorage.getItem('fps_client_portal_session_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed?.name || '';
      }
    } catch {
      // ignore
    }
    return '';
  });
  const [clientSessionPhone, setClientSessionPhone] = useState<string>(() => {
    try {
      const saved = window.localStorage.getItem('fps_client_portal_session_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed?.phone || '';
      }
    } catch {
      // ignore
    }
    return '';
  });
  const [clientSessionCompany, setClientSessionCompany] = useState<string>(() => {
    try {
      const saved = window.localStorage.getItem('fps_client_portal_session_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed?.companyName || '';
      }
    } catch {
      // ignore
    }
    return '';
  });
  const [clientSessionAddress, setClientSessionAddress] = useState<string>(() => {
    try {
      const saved = window.localStorage.getItem('fps_client_portal_session_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed?.billingAddress || '';
      }
    } catch {
      // ignore
    }
    return '';
  });
  const [clientSessionWebsite, setClientSessionWebsite] = useState<string>(() => {
    try {
      const saved = window.localStorage.getItem('fps_client_portal_session_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed?.website || '';
      }
    } catch {
      // ignore
    }
    return '';
  });
  const [clientSessionPassword, setClientSessionPassword] = useState<string>(() => {
    try {
      const saved = window.localStorage.getItem('fps_client_portal_session_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed?.password || '';
      }
    } catch {
      // ignore
    }
    return '';
  });

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loginNameInput, setLoginNameInput] = useState<string>('');
  const [loginCompanyInput, setLoginCompanyInput] = useState<string>('');
  const [loginPhoneInput, setLoginPhoneInput] = useState<string>('');
  const [loginEmailInput, setLoginEmailInput] = useState<string>('');
  const [loginPasswordInput, setLoginPasswordInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showGoogleQuickAccess, setShowGoogleQuickAccess] = useState<boolean>(false);
  const [googleQuickEmail, setGoogleQuickEmail] = useState<string>('');
  const [googleQuickName, setGoogleQuickName] = useState<string>('');

  const isPortalUnlocked = isAuthenticated || clientSessionSignedIn;
  const activeClientEmail = userEmail || clientSessionEmail || '';
  const activeClientName =
    (isAuthenticated ? userProfile.displayName : clientSessionName) ||
    userProfile.displayName;
  const rawCompanyCandidate = clientSessionCompany || userProfile.companyName || '';
  const activeClientCompany =
    rawCompanyCandidate === 'Registered Creative Studio' ||
    rawCompanyCandidate === 'Creative Retail Brand'
      ? ''
      : rawCompanyCandidate;

  // Editable Profile Form State
  const [profileName, setProfileName] = useState<string>(activeClientName);
  const [profileCompany, setProfileCompany] = useState<string>(activeClientCompany);
  const [profileEmail, setProfileEmail] = useState<string>(activeClientEmail);
  const [profilePhone, setProfilePhone] = useState<string>(clientSessionPhone);
  const [profileAddress, setProfileAddress] = useState<string>(clientSessionAddress);
  const [profileWebsite, setProfileWebsite] = useState<string>(clientSessionWebsite);
  const [profilePassword, setProfilePassword] = useState<string>(clientSessionPassword);
  const [showProfilePassword, setShowProfilePassword] = useState<boolean>(false);
  const [profileSaveNotice, setProfileSaveNotice] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Sync profile form fields whenever active client session changes
  React.useEffect(() => {
    if (!isPortalUnlocked) return;
    const emailKey = (userEmail || clientSessionEmail || '').trim().toLowerCase();
    try {
      const rawUsers = window.localStorage.getItem('fps_registered_clients_v1');
      const existingUsers: Record<string, RegisteredClientAccount> = rawUsers
        ? JSON.parse(rawUsers)
        : {};
      const record = existingUsers[emailKey];
      if (record) {
        const cleanRecCompany =
          record.companyName === 'Registered Creative Studio' ||
          record.companyName === 'Creative Retail Brand'
            ? ''
            : record.companyName || '';
        setProfileName(record.name || activeClientName);
        setProfileCompany(cleanRecCompany || activeClientCompany);
        setProfileEmail(record.email || activeClientEmail);
        setProfilePhone(record.phone || clientSessionPhone);
        setProfileAddress(record.billingAddress || clientSessionAddress);
        setProfileWebsite(record.website || clientSessionWebsite);
        setProfilePassword(record.password || clientSessionPassword);
        return;
      }
    } catch {
      // ignore
    }
    setProfileName(activeClientName);
    setProfileCompany(activeClientCompany);
    setProfileEmail(activeClientEmail);
    setProfilePhone(clientSessionPhone);
    setProfileAddress(clientSessionAddress);
    setProfileWebsite(clientSessionWebsite);
    setProfilePassword(clientSessionPassword);
  }, [
    isPortalUnlocked,
    userEmail,
    clientSessionEmail,
    activeClientName,
    activeClientCompany,
    clientSessionPhone,
    clientSessionAddress,
    clientSessionWebsite,
    clientSessionPassword,
  ]);

  const handleClientFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const cleanedEmail = loginEmailInput
      .replace(/^admin\s*email\s*:\s*/i, '')
      .trim()
      .toLowerCase();
    const cleanedPassword = loginPasswordInput
      .replace(/^admin\s*password\s*:\s*/i, '')
      .trim();

    // If Master Admin logs in from the Portal screen, unlock Admin Session and open Admin Dashboard
    const isAdminEmail =
      cleanedEmail.includes('asiaclipp@gmail.com') ||
      cleanedEmail.includes('admin@fixphotostudio.com');
    if (isAdminEmail && cleanedPassword.toLowerCase() === 'fixphoto2026') {
      const resolvedAdminEmail = cleanedEmail.includes('admin@fixphotostudio.com')
        ? 'admin@fixphotostudio.com'
        : 'asiaclipp@gmail.com';
      try {
        window.localStorage.setItem('fps_admin_session_v1', 'unlocked');
        window.localStorage.setItem('fps_admin_email_v1', resolvedAdminEmail);
      } catch {
        // ignore
      }
      if (onOpenAdminDashboard) {
        onOpenAdminDashboard();
        return;
      }
    }

    if (!cleanedEmail.includes('@')) {
      setLoginError('Please enter a valid studio or work email address.');
      return;
    }
    if (cleanedPassword.length < 4) {
      setLoginError('Please enter your password (at least 4 characters).');
      return;
    }
    if (authMode === 'register' && loginNameInput.trim().length < 2) {
      setLoginError('Please enter your full name or studio name to register.');
      return;
    }

    let derivedName = loginNameInput.trim()
      ? loginNameInput.trim()
      : cleanedEmail.split('@')[0].replace(/[._-]/g, ' ');
    let derivedPhone = loginPhoneInput.trim();
    let derivedCompany = loginCompanyInput.trim();
    let derivedAddress = '';
    let derivedWebsite = '';

    try {
      const rawUsers = window.localStorage.getItem('fps_registered_clients_v1');
      const existingUsers: Record<string, RegisteredClientAccount> = rawUsers
        ? JSON.parse(rawUsers)
        : {};
      const existingAccount = existingUsers[cleanedEmail];

      if (authMode === 'login' && existingAccount) {
        if (
          existingAccount.password &&
          existingAccount.password !== cleanedPassword
        ) {
          setLoginError(
            'Incorrect password for this account. Please enter the password you registered with.'
          );
          return;
        }
        derivedName = existingAccount.name || derivedName;
        derivedPhone = existingAccount.phone || derivedPhone;
        derivedCompany =
          existingAccount.companyName === 'Registered Creative Studio'
            ? ''
            : existingAccount.companyName || derivedCompany;
        derivedAddress = existingAccount.billingAddress || '';
        derivedWebsite = existingAccount.website || '';
      } else {
        existingUsers[cleanedEmail] = {
          name: derivedName,
          email: cleanedEmail,
          password: cleanedPassword,
          phone: derivedPhone,
          companyName: derivedCompany,
          billingAddress: derivedAddress,
          website: derivedWebsite,
          updatedAt: new Date().toISOString(),
        };
        window.localStorage.setItem(
          'fps_registered_clients_v1',
          JSON.stringify(existingUsers)
        );
      }
    } catch {
      // ignore
    }

    setClientSessionEmail(cleanedEmail);
    setClientSessionName(derivedName);
    setClientSessionPhone(derivedPhone);
    setClientSessionCompany(derivedCompany);
    setClientSessionAddress(derivedAddress);
    setClientSessionWebsite(derivedWebsite);
    setClientSessionPassword(cleanedPassword);
    setClientSessionSignedIn(true);
    setLoginPasswordInput('');
    try {
      window.localStorage.setItem(
        'fps_client_portal_session_v1',
        JSON.stringify({
          signedIn: true,
          email: cleanedEmail,
          name: derivedName,
          phone: derivedPhone,
          companyName: derivedCompany,
          billingAddress: derivedAddress,
          website: derivedWebsite,
          password: cleanedPassword,
        })
      );
    } catch {
      // ignore
    }
    if (onClientPortalSessionChange) {
      onClientPortalSessionChange({
        name: derivedName,
        email: cleanedEmail,
        phone: derivedPhone,
        companyName: derivedCompany,
        billingAddress: derivedAddress,
        website: derivedWebsite,
      });
    }
  };

  const handleSaveProfileChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSaveNotice(null);

    const nextName = profileName.trim();
    const nextEmail = (profileEmail.trim() || activeClientEmail).toLowerCase();
    const nextPhone = profilePhone.trim();
    const nextCompany = profileCompany.trim();
    const nextAddress = profileAddress.trim();
    const nextWebsite = profileWebsite.trim();
    const nextPassword = profilePassword.trim();

    const oldEmail = activeClientEmail.trim().toLowerCase();
    const effectiveEmailKey = nextEmail || oldEmail || 'client@fixphotostudio.com';

    try {
      const rawUsers = window.localStorage.getItem('fps_registered_clients_v1');
      const existingUsers: Record<string, RegisteredClientAccount> = rawUsers
        ? JSON.parse(rawUsers)
        : {};

      if (
        oldEmail &&
        oldEmail !== effectiveEmailKey &&
        existingUsers[effectiveEmailKey] &&
        existingUsers[effectiveEmailKey].email !== oldEmail
      ) {
        setProfileError(
          'Another client account already uses this email address.'
        );
        return;
      }

      if (oldEmail && oldEmail !== effectiveEmailKey) {
        delete existingUsers[oldEmail];
      }

      existingUsers[effectiveEmailKey] = {
        name: nextName,
        email: nextEmail,
        password: nextPassword || clientSessionPassword || 'client1234',
        phone: nextPhone,
        companyName: nextCompany,
        billingAddress: nextAddress,
        website: nextWebsite,
        updatedAt: new Date().toISOString(),
      };

      window.localStorage.setItem(
        'fps_registered_clients_v1',
        JSON.stringify(existingUsers)
      );

      window.localStorage.setItem(
        'fps_client_portal_session_v1',
        JSON.stringify({
          signedIn: true,
          email: nextEmail,
          name: nextName || 'Client',
          phone: nextPhone,
          companyName: nextCompany,
          billingAddress: nextAddress,
          website: nextWebsite,
          password: nextPassword || clientSessionPassword,
        })
      );
    } catch {
      // ignore
    }

    setClientSessionEmail(nextEmail);
    setClientSessionName(nextName);
    setClientSessionPhone(nextPhone);
    setClientSessionCompany(nextCompany);
    setClientSessionAddress(nextAddress);
    setClientSessionWebsite(nextWebsite);
    if (nextPassword) {
      setClientSessionPassword(nextPassword);
    }

    if (onClientPortalSessionChange) {
      onClientPortalSessionChange({
        name: nextName,
        email: nextEmail,
        phone: nextPhone,
        companyName: nextCompany,
        billingAddress: nextAddress,
        website: nextWebsite,
      });
    }

    if (onUpdateClientProfile) {
      await onUpdateClientProfile({
        oldEmail,
        newEmail: nextEmail,
        name: nextName,
        phone: nextPhone,
        companyName: nextCompany,
        billingAddress: nextAddress,
        website: nextWebsite,
        password: nextPassword,
      });
    }

    setProfileSaveNotice(
      'Your Profile & Billing details have been saved! Any fields you entered will automatically appear under BILL TO on your invoices.'
    );
    window.setTimeout(() => setProfileSaveNotice(null), 5000);
  };

  const handlePortalSignOut = async () => {
    setClientSessionSignedIn(false);
    setClientSessionEmail('');
    setClientSessionName('');
    setClientSessionPhone('');
    setClientSessionCompany('');
    setClientSessionAddress('');
    setClientSessionWebsite('');
    setClientSessionPassword('');
    setPortalSubTab('engagements');
    try {
      window.localStorage.removeItem('fps_client_portal_session_v1');
    } catch {
      // ignore
    }
    if (onClientPortalSessionChange) {
      onClientPortalSessionChange(null);
    }
    if (isAuthenticated) {
      await onSignOut();
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'completed'
        ? o.status === 'completed'
        : o.status !== 'completed';
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      o.projectTitle.toLowerCase().includes(q) ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.serviceCategory.toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });

  const activeOrder =
    orders.find((o) => o.id === selectedOrderId) || filteredOrders[0] || orders[0] || null;

  const activeEngagementsCount = orders.filter((o) => o.status !== 'completed').length;
  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder || !chatInput.trim()) return;
    setIsSendingChat(true);
    try {
      await onSendMessage(activeOrder, chatInput.trim(), chatAttachment.trim());
      setChatInput('');
      setChatAttachment('');
    } finally {
      setIsSendingChat(false);
    }
  };

  const isOrderPendingApproval = (order: OrderDoc): boolean => {
    if (orderApprovalMap[order.orderNumber] === 'pending') return true;
    if (orderApprovalMap[order.orderNumber] === 'approved') return false;
    return order.progressPercent === 0;
  };

  const getOrderStageIndex = (order: OrderDoc): number => {
    if (isOrderPendingApproval(order)) return -1;
    if (order.status === 'queued' || order.status === 'ingesting') return 0;
    if (order.status === 'clipping' || order.status === 'retouching') return 1;
    if (order.status === 'qa_review') return 2;
    if (order.status === 'completed') return 3;
    return 0;
  };

  const getOrderStageLabel = (order: OrderDoc): string => {
    if (isOrderPendingApproval(order)) {
      return 'ORDER STATUS: PENDING';
    }
    const idx = getOrderStageIndex(order);
    const stageObj = PIPELINE_STAGES[idx];
    return stageObj
      ? stageObj.label.toUpperCase()
      : order.status.replace('_', ' ').toUpperCase();
  };

  const getInvoiceStatus = (
    invoiceRef?: string,
    orderNumber?: string,
    notifTitle?: string
  ): InvoicePaymentStatus => {
    if (invoiceRef && invoiceStatusMap[invoiceRef]) {
      return invoiceStatusMap[invoiceRef];
    }
    if (orderNumber) {
      const derivedRef = `INV-${orderNumber}`;
      if (invoiceStatusMap[derivedRef]) return invoiceStatusMap[derivedRef];
      if (invoiceStatusMap[orderNumber]) return invoiceStatusMap[orderNumber];
    }
    if (notifTitle && notifTitle.toUpperCase().includes('[PAID]')) {
      return 'paid';
    }
    return 'pending';
  };

  const openOrderInvoiceModal = (order: OrderDoc) => {
    const matchedNotif = notifications.find(
      (n) =>
        n.invoiceRef &&
        (n.title.includes(order.orderNumber) ||
          n.invoiceRef === `INV-${order.orderNumber}`)
    );
    if (matchedNotif) {
      setSelectedReceipt(matchedNotif);
    } else {
      setSelectedReceipt({
        id: `inv_modal_${order.id}`,
        userId: order.clientId,
        type: 'payment_receipt',
        title: `Order Invoice — ${order.orderNumber} (${order.projectTitle})`,
        message: `${order.imageCount} frames · ${order.outputFormat} · ${order.turnaroundHours}h SLA`,
        amountFormatted: `$${order.totalPrice.toFixed(2)} USD`,
        invoiceRef: `INV-${order.orderNumber}`,
        read: true,
        createdAt: order.createdAt,
      });
    }
  };

  const handleDownloadArchive = (order: OrderDoc) => {
    if (order.deliveryDownloadUrl?.trim()) {
      const rawUrl = order.deliveryDownloadUrl.trim();
      const targetUrl =
        rawUrl.startsWith('http://') || rawUrl.startsWith('https://')
          ? rawUrl
          : `https://${rawUrl}`;
      const a = document.createElement('a');
      a.href = targetUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setDownloadFeedback(
        `Opened your delivery download link for Order ${order.orderNumber}: ${targetUrl}`
      );
      return;
    }
    setDownloadFeedback(
      `Order ${order.orderNumber} is currently in stage "${getOrderStageLabel(
        order
      )}". Once Admin sets "Ready for Delivery" and attaches your download link, you can click here to download your files.`
    );
  };

  const handleGoogleInstantLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const cleanedEmail = googleQuickEmail.trim().toLowerCase();
    if (!cleanedEmail.includes('@')) {
      setLoginError('Please enter your Google / Gmail address.');
      return;
    }
    if (
      cleanedEmail === 'asiaclipp@gmail.com' ||
      cleanedEmail === 'admin@fixphotostudio.com'
    ) {
      try {
        window.localStorage.setItem('fps_admin_session_v1', 'unlocked');
        window.localStorage.setItem('fps_admin_email_v1', cleanedEmail);
      } catch {
        // ignore
      }
    }

    let derivedName =
      googleQuickName.trim() ||
      cleanedEmail.split('@')[0].replace(/[._-]/g, ' ');
    let derivedPhone = '';
    let derivedCompany = '';
    let derivedAddress = '';
    let derivedWebsite = '';

    try {
      const rawUsers = window.localStorage.getItem('fps_registered_clients_v1');
      const existingUsers: Record<string, RegisteredClientAccount> = rawUsers
        ? JSON.parse(rawUsers)
        : {};
      const existing = existingUsers[cleanedEmail];
      if (existing) {
        derivedName = existing.name || derivedName;
        derivedPhone = existing.phone || '';
        derivedCompany =
          existing.companyName === 'Registered Creative Studio'
            ? ''
            : existing.companyName || '';
        derivedAddress = existing.billingAddress || '';
        derivedWebsite = existing.website || '';
      } else {
        existingUsers[cleanedEmail] = {
          name: derivedName,
          email: cleanedEmail,
          password: 'google_oauth_account',
          phone: '',
          companyName: '',
          billingAddress: '',
          website: '',
          updatedAt: new Date().toISOString(),
        };
        window.localStorage.setItem(
          'fps_registered_clients_v1',
          JSON.stringify(existingUsers)
        );
      }
    } catch {
      // ignore
    }

    setClientSessionEmail(cleanedEmail);
    setClientSessionName(derivedName);
    setClientSessionPhone(derivedPhone);
    setClientSessionCompany(derivedCompany);
    setClientSessionAddress(derivedAddress);
    setClientSessionWebsite(derivedWebsite);
    setClientSessionSignedIn(true);
    setShowGoogleQuickAccess(false);

    try {
      window.localStorage.setItem(
        'fps_client_portal_session_v1',
        JSON.stringify({
          signedIn: true,
          email: cleanedEmail,
          name: derivedName,
          phone: derivedPhone,
          companyName: derivedCompany,
          billingAddress: derivedAddress,
          website: derivedWebsite,
        })
      );
    } catch {
      // ignore
    }

    if (onClientPortalSessionChange) {
      onClientPortalSessionChange({
        name: derivedName,
        email: cleanedEmail,
        phone: derivedPhone,
        companyName: derivedCompany,
        billingAddress: derivedAddress,
        website: derivedWebsite,
      });
    }
  };

  const formatTimestamp = (ts: unknown): string => {
    if (!ts) return 'Just now';
    if (typeof ts === 'object' && ts !== null && 'toDate' in ts && typeof (ts as { toDate: () => Date }).toDate === 'function') {
      return (ts as { toDate: () => Date }).toDate().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    if (ts instanceof Date) {
      return ts.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return 'Today';
  };

  // ===========================================================================
  // AUTHENTICATION GATE: SHOW DEDICATED CLIENT PORTAL LOGIN VIEW BEFORE DASHBOARD
  // ===========================================================================
  if (!isPortalUnlocked) {
    return (
      <div className="min-h-[82vh] bg-[#F5F9FD] py-12 px-4 sm:px-6 flex items-center justify-center">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white border border-[#DCE6F2] rounded-2xl overflow-hidden shadow-lg">
          {/* Left 5 Columns: Studio Portal Security & Features Info */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#00143D] to-[#001E5A] text-white p-7 sm:p-8 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 border border-white/15 text-[11px] font-mono-tabular text-[#00B8FF] font-semibold">
                <Lock className="w-3.5 h-3.5" />
                <span>CLIENT PRODUCTION PORTAL</span>
              </div>

              <h1 className="text-2xl font-bold leading-snug">
                Sign In to Access Your Studio Production & Delivery Console
              </h1>

              <p className="text-xs text-blue-100/85 leading-relaxed">
                Your active retouching batches, 6-stage live SLA progress tracker, direct specialist chat, and downloadable tax invoices are protected behind client authentication.
              </p>
            </div>

            <div className="space-y-3.5 pt-4 border-t border-white/15 text-xs">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#00B8FF] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Live 6-Stage Batch Tracking</p>
                  <p className="text-blue-200/80 text-[11px]">
                    Monitor RAW ingestion, hand-drawn Bezier paths, and 400% zoom QA in real time.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#00B8FF] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Direct Lead Retoucher Chat</p>
                  <p className="text-blue-200/80 text-[11px]">
                    Message your assigned production pod specialist and exchange style references.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#00B8FF] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Encrypted ZIP & CSV Invoices</p>
                  <p className="text-blue-200/80 text-[11px]">
                    Download completed master archives and itemized accounting CSV ledgers.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/15 flex items-center justify-between text-[11px] font-mono-tabular text-blue-200">
              <span>256-Bit Encrypted Vault</span>
              <span>24/7 Studio SLA</span>
            </div>
          </div>

          {/* Right 7 Columns: Client Login / Registration Form + Google OAuth */}
          <div className="lg:col-span-7 p-7 sm:p-9 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-4 border-b border-[#DCE6F2] pb-4">
                <div>
                  <p className="text-xs font-mono-tabular text-[#0088FF] font-semibold">
                    CLIENT AUTHENTICATION REQUIRED
                  </p>
                  <h2 className="text-xl font-bold text-[#001E5A] mt-0.5">
                    {authMode === 'login'
                      ? 'Client Portal Sign In'
                      : 'Create Studio Client Account'}
                  </h2>
                </div>

                <div className="flex items-center gap-1 p-1 bg-[#EAF3FC] rounded-lg">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setLoginError(null);
                    }}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                      authMode === 'login'
                        ? 'bg-[#001E5A] text-white'
                        : 'text-[#001E5A] hover:bg-white/60'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('register');
                      setLoginError(null);
                    }}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                      authMode === 'register'
                        ? 'bg-[#001E5A] text-white'
                        : 'text-[#001E5A] hover:bg-white/60'
                    }`}
                  >
                    Register
                  </button>
                </div>
              </div>

              {/* Primary Option 1: 1-Click Google OAuth Sign In */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  disabled={isSigningIn}
                  onClick={async () => {
                    setLoginError(null);
                    try {
                      await onSignInGoogle();
                    } catch {
                      // ignore
                    }
                    // If Firebase popup was blocked or unauthorized on a live custom domain, open instant Google access input
                    setShowGoogleQuickAccess(true);
                  }}
                  className="w-full py-3 px-4 text-xs font-bold text-[#001E5A] bg-[#F5F9FD] hover:bg-[#EAF3FC] border border-[#B8D0EB] rounded-xl transition-colors flex items-center justify-center gap-2.5 shadow-2xs"
                >
                  <LogIn className="w-4 h-4 text-[#0088FF]" />
                  <span>
                    {isSigningIn
                      ? 'Connecting Google Account...'
                      : 'Continue with Google Account (Instant Access)'}
                  </span>
                </button>

                {showGoogleQuickAccess && (
                  <form
                    onSubmit={handleGoogleInstantLoginSubmit}
                    className="p-3.5 rounded-xl bg-[#EAF3FC] border border-[#0088FF] space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#001E5A]">
                        Instant Google Account Sign-In
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowGoogleQuickAccess(false)}
                        className="text-[11px] text-slate-500 hover:text-slate-800"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={googleQuickName}
                        onChange={(e) => setGoogleQuickName(e.target.value)}
                        placeholder="Your Name (e.g. Sarah Jenkins)"
                        className="w-full px-3 py-2 text-xs bg-white border border-[#B8D0EB] rounded-lg focus:outline-none focus:border-[#0088FF]"
                      />
                      <input
                        type="email"
                        required
                        value={googleQuickEmail}
                        onChange={(e) => setGoogleQuickEmail(e.target.value)}
                        placeholder="yourname@gmail.com *"
                        className="w-full px-3 py-2 text-xs bg-white border border-[#B8D0EB] rounded-lg font-mono-tabular focus:outline-none focus:border-[#0088FF]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 px-3 text-xs font-bold text-white bg-[#0088FF] hover:bg-[#001E5A] rounded-lg transition-colors"
                    >
                      Continue with Google Email →
                    </button>
                  </form>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="border-t border-[#DCE6F2] flex-1" />
                <span className="text-[11px] font-mono-tabular text-slate-400 uppercase whitespace-nowrap shrink-0">
                  or sign in with studio email
                </span>
                <div className="border-t border-[#DCE6F2] flex-1" />
              </div>

              {/* Option 2: Studio Email & Password Login Form */}
              <form onSubmit={handleClientFormLogin} className="space-y-4">
                {authMode === 'register' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={loginNameInput}
                        onChange={(e) => setLoginNameInput(e.target.value)}
                        placeholder="Alex Rivera"
                        className="w-full px-3.5 py-2.5 text-xs border border-[#B8D0EB] rounded-lg focus:outline-none focus:border-[#0088FF]"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                          Phone / WhatsApp Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={loginPhoneInput}
                          onChange={(e) => setLoginPhoneInput(e.target.value)}
                          placeholder="+1 (212) 555-0194"
                          className="w-full px-3.5 py-2.5 text-xs border border-[#B8D0EB] rounded-lg focus:outline-none focus:border-[#0088FF]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                          Company / Studio Name
                        </label>
                        <input
                          type="text"
                          value={loginCompanyInput}
                          onChange={(e) => setLoginCompanyInput(e.target.value)}
                          placeholder="Atelier Nord Studio"
                          className="w-full px-3.5 py-2.5 text-xs border border-[#B8D0EB] rounded-lg focus:outline-none focus:border-[#0088FF]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                    Studio Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={loginEmailInput}
                    onChange={(e) => setLoginEmailInput(e.target.value)}
                    placeholder="client@brandstudio.com"
                    className="w-full px-3.5 py-2.5 text-xs border border-[#B8D0EB] rounded-lg focus:outline-none focus:border-[#0088FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                    Portal Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={loginPasswordInput}
                    onChange={(e) => setLoginPasswordInput(e.target.value)}
                    placeholder="Enter your portal password"
                    className="w-full px-3.5 py-2.5 text-xs border border-[#B8D0EB] rounded-lg focus:outline-none focus:border-[#0088FF]"
                  />
                </div>

                {loginError && (
                  <p className="text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {loginError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 px-4 text-xs font-bold text-white bg-gradient-to-r from-[#001E5A] to-[#0088FF] hover:from-[#00143D] hover:to-[#006FE0] rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>
                    {authMode === 'login'
                      ? 'Sign In & Open Client Portal'
                      : 'Create Account & Open Client Portal'}
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Workspace Header & Auth / MFA Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="text-xs font-mono-tabular text-stone-500">
            <span>CLIENT WORKSPACE</span>
            <span className="mx-2">·</span>
            <span>{userProfile.companyName || 'FixPhoto Registered Studio'}</span>
            <span className="mx-2">·</span>
            <span className="text-emerald-700 font-semibold">
              AUTHENTICATED SESSION ({activeClientEmail})
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            Active Production Engagements & Delivery Console
          </h1>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsProfileModalOpen(true)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              isProfileModalOpen || portalSubTab === 'profile'
                ? 'bg-[#001E5A] text-white border-[#001E5A]'
                : 'text-stone-800 bg-white border-stone-300 hover:border-blue-700 hover:text-blue-700'
            }`}
          >
            <User className="w-4 h-4 text-blue-600" />
            <span>Your Profile</span>
          </button>

          <button
            type="button"
            onClick={onOpenNewOrder}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Order</span>
          </button>

          <button
            type="button"
            onClick={handlePortalSignOut}
            className="px-3.5 py-2 text-xs font-medium text-stone-700 hover:text-red-700 bg-white border border-stone-300 hover:border-red-300 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* 2-Column KPI Overview Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 bg-white border border-stone-200 rounded-xl">
          <p className="text-xs text-stone-500">Active Studio Engagements</p>
          <p className="text-2xl font-bold font-mono-tabular text-stone-900 mt-1">
            {activeEngagementsCount}
          </p>
          <p className="text-xs text-stone-600 mt-1 font-mono-tabular">
            {orders.length} total lifetime orders
          </p>
        </div>

        <div className="p-5 bg-white border border-stone-200 rounded-xl flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-stone-500">Your Profile & Invoice Billing Info</p>
            <div className="flex items-center gap-2 mt-1">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
              <p className="text-lg font-bold text-stone-900 truncate">
                {activeClientName}
                {activeClientCompany ? ` · ${activeClientCompany}` : ''}
              </p>
            </div>
            <p className="text-xs text-stone-600 mt-1 font-mono-tabular">
              {activeClientEmail}
              {clientSessionPhone ? ` · ${clientSessionPhone}` : ''}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsProfileModalOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors shrink-0"
          >
            Your Profile →
          </button>
        </div>
      </div>

      {/* Interactive Workspace Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div className="flex flex-wrap items-center gap-1 p-1 bg-stone-200/70 rounded-lg">
          <button
            type="button"
            onClick={() => setPortalSubTab('engagements')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              portalSubTab === 'engagements'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Active Engagements & Live Chat ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setPortalSubTab('notifications')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              portalSubTab === 'notifications'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Notifications & Payment Receipts ({unreadNotifCount} Unread)
          </button>
          <button
            type="button"
            onClick={() => setPortalSubTab('profile')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              portalSubTab === 'profile'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <User className="w-3.5 h-3.5 text-blue-700" />
            <span>Your Profile</span>
          </button>
        </div>

        {portalSubTab === 'engagements' && (
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search order ID or project..."
                className="pl-8 pr-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-blue-700"
              />
            </div>

            <div className="flex items-center gap-1 p-1 bg-stone-200/70 rounded-lg">
              {(['all', 'active', 'completed'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    statusFilter === st
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {st === 'all' ? 'All' : st === 'active' ? 'In Production' : 'Completed'}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SUB-TAB 1: ENGAGEMENTS, REAL-TIME TRACKER & INTEGRATED CHAT */}
      {portalSubTab === 'engagements' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 4 Columns: Engagement Queue List */}
          <div className="lg:col-span-4 bg-white border border-stone-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-stone-200 flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-900">
                Production Queue ({filteredOrders.length})
              </span>
              <span className="text-[11px] font-mono-tabular text-stone-500">
                Select to inspect
              </span>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <p className="text-sm font-semibold text-stone-900">No Matching Engagements</p>
                <p className="text-xs text-stone-600">
                  Launch a new online photo editing batch to track real-time retouching progress.
                </p>
                <button
                  type="button"
                  onClick={onOpenNewOrder}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors"
                >
                  Create First Order
                </button>
              </div>
            ) : (
              <div className="divide-y divide-stone-200">
                {filteredOrders.map((order) => {
                  const isSelected = activeOrder?.id === order.id;
                  const pendingApproval = isOrderPendingApproval(order);
                  const orderInvStatus = getInvoiceStatus(
                    `INV-${order.orderNumber}`,
                    order.orderNumber
                  );
                  return (
                    <button
                      key={order.id}
                      type="button"
                      onClick={() => {
                        onSelectOrder(order.id);
                        setDownloadFeedback(null);
                      }}
                      className={`w-full text-left p-4 transition-colors ${
                        isSelected ? 'bg-blue-50/50' : 'hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 text-xs font-mono-tabular text-stone-500">
                        <span className="font-semibold text-stone-800">{order.orderNumber}</span>
                        {pendingApproval ? (
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold">
                            PENDING APPROVAL
                          </span>
                        ) : (
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              order.status === 'completed'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-blue-100 text-blue-800 border border-blue-200'
                            }`}
                          >
                            {order.progressPercent}% · {getOrderStageLabel(order)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-bold text-stone-900 mt-1 truncate">
                        {order.projectTitle}
                      </p>
                      <div className="flex items-center justify-between text-xs text-stone-600 mt-1.5 font-mono-tabular">
                        <span>
                          {order.imageCount} frames · {order.turnaroundHours}h SLA
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              orderInvStatus === 'paid'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            INV: {orderInvStatus.toUpperCase()}
                          </span>
                          <span className="font-semibold text-stone-900">
                            ${order.totalPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden mt-2.5">
                        <div
                          className={`h-full transition-transform duration-200 origin-left ${
                            pendingApproval
                              ? 'bg-amber-500'
                              : order.status === 'completed'
                              ? 'bg-emerald-600'
                              : 'bg-blue-700'
                          }`}
                          style={{
                            transform: `scaleX(${
                              pendingApproval ? 0.08 : order.progressPercent / 100
                            })`,
                          }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right 8 Columns: Real-Time Project Progress & Direct Chat Support */}
          {!activeOrder ? (
            <div className="lg:col-span-8 bg-white border border-stone-200 rounded-xl p-10 text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center mx-auto">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div className="space-y-1.5 max-w-md mx-auto">
                <h2 className="text-lg font-bold text-stone-900">
                  Welcome, {activeClientName} — Your Studio Portal is Blank & Ready
                </h2>
                <p className="text-xs text-stone-600 leading-relaxed">
                  You have <strong>0 orders or free trials</strong> under your account (<strong>{activeClientEmail}</strong>). Every client account is strictly isolated—only orders, free trials, and invoices submitted by you will appear in this workspace.
                </p>
              </div>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={onOpenNewOrder}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Submit Your First Retouching Order</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-8 space-y-6">
              {/* Order Detail & Real-Time Pipeline Card */}
              <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-stone-200">
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono-tabular text-stone-500">
                      <span className="font-bold text-stone-800">{activeOrder.orderNumber}</span>
                      <span>·</span>
                      <span>{activeOrder.outputFormat}</span>
                      <span>·</span>
                      <span>{activeOrder.backgroundSpec}</span>
                      <span>·</span>
                      <span>{formatTimestamp(activeOrder.createdAt)}</span>
                      <span>·</span>
                      {isOrderPendingApproval(activeOrder) ? (
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 font-bold text-[11px]">
                          1. ORDER STATUS: PENDING
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-[11px]">
                          {getOrderStageLabel(activeOrder)}
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-bold text-stone-900 mt-1.5">
                      {activeOrder.projectTitle}
                    </h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => openOrderInvoiceModal(activeOrder)}
                      className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                        getInvoiceStatus(
                          `INV-${activeOrder.orderNumber}`,
                          activeOrder.orderNumber
                        ) === 'paid'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                          : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>
                        Invoice (
                        {getInvoiceStatus(
                          `INV-${activeOrder.orderNumber}`,
                          activeOrder.orderNumber
                        ).toUpperCase()}
                        )
                      </span>
                    </button>

                    {activeOrder.deliveryDownloadUrl?.trim() ? (
                      <a
                        href={
                          activeOrder.deliveryDownloadUrl.trim().startsWith('http')
                            ? activeOrder.deliveryDownloadUrl.trim()
                            : `https://${activeOrder.deliveryDownloadUrl.trim()}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Ready Files →</span>
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleDownloadArchive(activeOrder)}
                        className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                          activeOrder.status === 'completed' &&
                          !isOrderPendingApproval(activeOrder)
                            ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                            : 'bg-blue-700 hover:bg-blue-800 text-white'
                        }`}
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>
                          {activeOrder.status === 'completed' &&
                          !isOrderPendingApproval(activeOrder)
                            ? 'Ready for Delivery'
                            : 'Check Delivery Status'}
                        </span>
                      </button>
                    )}
                  </div>
                </div>

                {isOrderPendingApproval(activeOrder) && (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 flex items-start gap-3">
                    <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div className="text-xs space-y-1">
                      <p className="font-bold text-amber-900">
                        1. Order Status: Pending — Waiting for Studio Admin to Mark Received
                      </p>
                      <p className="text-amber-800 leading-relaxed">
                        Your order ({activeOrder.orderNumber}) is currently <strong>Pending</strong>. When FixPhoto Studio Admin receives your order and updates the 4-stage work process below, your live status will update automatically.
                      </p>
                    </div>
                  </div>
                )}

                {/* Ready for Delivery Download Link Box (Shown when Admin adds a download link or marks Ready for Delivery) */}
                {(activeOrder.deliveryDownloadUrl?.trim() ||
                  (activeOrder.status === 'completed' &&
                    !isOrderPendingApproval(activeOrder))) && (
                  <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-400 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <p className="text-xs font-bold text-emerald-900 uppercase font-mono-tabular">
                          STAGE 04 · READY FOR DELIVERY (DOWNLOAD LINK ACTIVE)
                        </p>
                      </div>
                      <p className="text-xs text-emerald-800">
                        Your completed files for <strong>{activeOrder.orderNumber}</strong> are ready! A confirmation email with your download link has also been sent to your email address.
                      </p>
                      {activeOrder.deliveryDownloadUrl?.trim() && (
                        <p className="text-[11px] font-mono-tabular text-emerald-900 break-all pt-0.5">
                          <strong>Download Link: </strong>
                          <a
                            href={
                              activeOrder.deliveryDownloadUrl.trim().startsWith('http')
                                ? activeOrder.deliveryDownloadUrl.trim()
                                : `https://${activeOrder.deliveryDownloadUrl.trim()}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline font-bold text-blue-700 hover:text-blue-900"
                          >
                            {activeOrder.deliveryDownloadUrl.trim()}
                          </a>
                        </p>
                      )}
                    </div>

                    {activeOrder.deliveryDownloadUrl?.trim() && (
                      <a
                        href={
                          activeOrder.deliveryDownloadUrl.trim().startsWith('http')
                            ? activeOrder.deliveryDownloadUrl.trim()
                            : `https://${activeOrder.deliveryDownloadUrl.trim()}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center justify-center gap-2 shrink-0 shadow-xs transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>Click to Download Files →</span>
                      </a>
                    )}
                  </div>
                )}

                {downloadFeedback && (
                  <div className="flex items-center gap-2 text-xs font-medium text-emerald-900 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{downloadFeedback}</span>
                  </div>
                )}

                {/* 4-Stage Real-Time Production Stage Progression (Managed by Studio Admin) */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-3">
                    <span className="font-semibold text-stone-900">
                      Real-Time Production Stage Progression (Managed by Studio Admin)
                    </span>
                    <span
                      className={`font-mono-tabular font-semibold ${
                        isOrderPendingApproval(activeOrder)
                          ? 'text-amber-700'
                          : 'text-blue-700'
                      }`}
                    >
                      {isOrderPendingApproval(activeOrder)
                        ? '1. Order Status: Pending (0%)'
                        : `${activeOrder.progressPercent}% Complete · ${getOrderStageLabel(activeOrder)}`}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {PIPELINE_STAGES.map((stage, idx) => {
                      const pendingApproval = isOrderPendingApproval(activeOrder);
                      const currentStageIdx = getOrderStageIndex(activeOrder);
                      const isDone = !pendingApproval && idx <= currentStageIdx;
                      const isCurrent = !pendingApproval && idx === currentStageIdx;

                      // Stage 01 displays "Order Status: Pending" when pending, or "Order Status: Received" when received
                      const stageTitle =
                        idx === 0
                          ? pendingApproval
                            ? 'Order Status: Pending'
                            : 'Order Status: Received'
                          : stage.label;

                      return (
                        <div
                          key={stage.status}
                          className={`p-3.5 rounded-xl border text-xs transition-colors ${
                            idx === 0 && pendingApproval
                              ? 'border-amber-400 bg-amber-50/70 text-amber-950'
                              : isCurrent
                              ? 'border-blue-700 bg-blue-50/50 text-stone-900 shadow-2xs'
                              : isDone
                              ? 'border-emerald-300 bg-emerald-50/40 text-stone-900'
                              : 'border-stone-200 bg-stone-50 text-stone-500'
                          }`}
                        >
                          <div className="flex items-center justify-between font-mono-tabular text-[11px]">
                            <span className="font-bold">{stage.stepIndex}.</span>
                            {isDone ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                            ) : idx === 0 && pendingApproval ? (
                              <Clock className="w-4 h-4 text-amber-600" />
                            ) : (
                              <Clock className="w-4 h-4 text-stone-400" />
                            )}
                          </div>
                          <p className="font-bold mt-1.5 leading-snug">{stageTitle}</p>
                          <p className="text-[11px] opacity-80 mt-0.5">
                            {idx === 0 && pendingApproval
                              ? 'Waiting for Admin to receive order'
                              : stage.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Technical Specs & Uploaded Manifest */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-stone-200 text-xs">
                  <div>
                    <p className="font-semibold text-stone-900">Retoucher Style Brief</p>
                    <p className="text-stone-600 mt-1 leading-relaxed">
                      {activeOrder.instructions || 'Standard studio SOP applied.'}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900">
                      Ingested RAW Batch Manifest ({activeOrder.uploadedBatchNames.length} sample files)
                    </p>
                    <div className="mt-1 space-y-1 font-mono-tabular text-[11px] text-stone-600">
                      {activeOrder.uploadedBatchNames.map((fname) => (
                        <div key={fname} className="truncate">
                          · {fname}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Integrated Direct Chat Support */}
              <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-stone-200 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">
                      Direct Studio Specialist Chat — {activeOrder.orderNumber}
                    </h3>
                    <p className="text-xs text-stone-500">
                      Assigned Lead: Elena Rostova (Senior Horology & Apparel Retoucher) · Response SLA &lt; 5 min
                    </p>
                  </div>
                  <span className="text-xs font-mono-tabular text-stone-600">
                    End-to-End Order Thread
                  </span>
                </div>

                <div className="p-6 space-y-4 max-h-80 overflow-y-auto bg-stone-50/50">
                  {messages.length === 0 ? (
                    <p className="text-xs text-stone-500 text-center py-6">
                      No messages in this order thread yet. Send a note to your assigned retouching pod below.
                    </p>
                  ) : (
                    messages.map((msg) => {
                      const isClient = msg.senderRole === 'client';
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isClient ? 'items-end' : 'items-start'}`}
                        >
                          <div className="flex items-center gap-2 text-[11px] text-stone-500 mb-1 font-mono-tabular">
                            <span className="font-semibold text-stone-700">{msg.senderName}</span>
                            <span>·</span>
                            <span>{msg.senderRole === 'specialist' ? 'Lead Retoucher' : 'Client'}</span>
                            <span>·</span>
                            <span>{formatTimestamp(msg.createdAt)}</span>
                          </div>
                          <div
                            className={`max-w-xl rounded-xl px-4 py-2.5 text-xs leading-relaxed border ${
                              isClient
                                ? 'bg-stone-900 text-white border-stone-900'
                                : 'bg-white text-stone-800 border-stone-200'
                            }`}
                          >
                            <p>{msg.body}</p>
                            {msg.attachmentName && (
                              <p className="mt-1.5 pt-1.5 border-t border-stone-300/30 font-mono-tabular text-[11px] opacity-90">
                                Attached Reference: {msg.attachmentName}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <form
                  onSubmit={handleChatSubmit}
                  className="p-4 bg-white border-t border-stone-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    maxLength={1500}
                    placeholder="Message Elena Rostova regarding clipping paths, color profile, or crop specs..."
                    className="flex-1 px-3.5 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-blue-700"
                  />
                  {chatAttachment ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-xs font-mono-tabular text-blue-900 shrink-0 max-w-52">
                      <span className="truncate">{chatAttachment}</span>
                      <button
                        type="button"
                        onClick={() => setChatAttachment('')}
                        className="text-blue-600 hover:text-red-600 shrink-0"
                        aria-label="Remove attached file"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <label className="px-3 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0">
                      <UploadCloud className="w-3.5 h-3.5 text-blue-700" />
                      <span>Upload File</span>
                      <input
                        type="file"
                        accept="image/*,video/*,.pdf,.zip,.psd,.tif,.tiff,.raw,.cr2,.cr3,.nef,.raf,.dng,.mp4,.mov"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setChatAttachment(file.name.slice(0, 140));
                          }
                          e.target.value = '';
                        }}
                        className="hidden"
                      />
                    </label>
                  )}
                  <button
                    type="submit"
                    disabled={isSendingChat || !chatInput.trim()}
                    className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-50 rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: NOTIFICATION CENTER & OFFICIAL INVOICES / PAYMENT RECEIPTS */}
      {portalSubTab === 'notifications' && (
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-200 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Notification Center & Official Payment Confirmation Receipts
              </h2>
              <p className="text-xs text-stone-500">
                Real-time order invoices, payment status (Pending / Paid), and downloadable PDF commercial invoices.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono-tabular text-stone-600">
                {notifications.length} Total Events
              </span>
            </div>
          </div>

          <div className="divide-y divide-stone-200">
            {notifications.map((notif) => {
              const hasInvoice = Boolean(notif.invoiceRef);
              const invStatus = hasInvoice
                ? getInvoiceStatus(notif.invoiceRef, undefined, notif.title)
                : null;

              return (
                <div
                  key={notif.id}
                  className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                    notif.read ? 'bg-white' : 'bg-blue-50/30'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tabular text-stone-500">
                      <span className="font-semibold text-stone-800">
                        {notif.type === 'payment_receipt'
                          ? 'ORDER INVOICE'
                          : notif.type.replace('_', ' ').toUpperCase()}
                      </span>
                      <span>·</span>
                      <span>{formatTimestamp(notif.createdAt)}</span>
                      {notif.invoiceRef && (
                        <>
                          <span>·</span>
                          <span className="text-blue-700 font-semibold">{notif.invoiceRef}</span>
                        </>
                      )}
                      {notif.amountFormatted && (
                        <>
                          <span>·</span>
                          <span className="text-stone-900 font-bold">
                            {notif.amountFormatted}
                          </span>
                        </>
                      )}
                      {invStatus && (
                        <>
                          <span>·</span>
                          {invStatus === 'paid' ? (
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-[11px]">
                              STATUS: PAID ✓
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 font-bold text-[11px]">
                              STATUS: PENDING
                            </span>
                          )}
                        </>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-stone-900">{notif.title}</h3>
                    <p className="text-xs text-stone-600 leading-relaxed">{notif.message}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {notif.invoiceRef && (
                      <button
                        type="button"
                        onClick={() => setSelectedReceipt(notif)}
                        className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors ${
                          invStatus === 'paid'
                            ? 'text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border-emerald-300'
                            : 'text-amber-950 bg-amber-50 hover:bg-amber-100 border-amber-300'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>
                          {invStatus === 'paid'
                            ? 'Download Paid Invoice PDF'
                            : 'View & Download Invoice PDF'}
                        </span>
                      </button>
                    )}
                    {!notif.read && (
                      <button
                        type="button"
                        onClick={() => onMarkNotificationRead(notif)}
                        className="px-3 py-1.5 text-xs font-medium text-blue-700 hover:underline whitespace-nowrap shrink-0"
                      >
                        Mark Read
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: USER PROFILE & REGISTRATION DATA EDITOR */}
      {portalSubTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 4 Columns: Current Account Summary Card */}
          <div className="lg:col-span-4 bg-white border border-stone-200 rounded-xl p-6 space-y-5">
            <div className="flex items-center gap-3.5 pb-4 border-b border-stone-200">
              <div className="w-12 h-12 rounded-xl bg-[#001E5A] text-white font-bold text-lg flex items-center justify-center shrink-0">
                {(activeClientName || 'C').slice(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-mono-tabular text-blue-700 font-semibold uppercase">
                  VERIFIED STUDIO CLIENT
                </p>
                <h2 className="text-base font-bold text-stone-900 truncate">
                  {activeClientName}
                </h2>
                <p className="text-xs text-stone-500 truncate">
                  {activeClientCompany}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 space-y-1">
                <span className="text-[10px] font-mono-tabular text-stone-500 uppercase flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-blue-700" />
                  <span>Registered Login Email</span>
                </span>
                <p className="font-mono-tabular font-semibold text-stone-900 break-all">
                  {activeClientEmail}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 space-y-1">
                <span className="text-[10px] font-mono-tabular text-stone-500 uppercase flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-blue-700" />
                  <span>Phone / WhatsApp Number</span>
                </span>
                <p className="font-mono-tabular font-semibold text-stone-900">
                  {clientSessionPhone || 'Not added yet'}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 space-y-1">
                <span className="text-[10px] font-mono-tabular text-stone-500 uppercase">
                  Auto-Fill Status for New Orders
                </span>
                <p className="text-stone-700 leading-relaxed">
                  Whenever you open <strong>New Order</strong>, <strong>Free Trial</strong>, or <strong>Get a Quote</strong> while signed in, your profile details above are automatically applied so you never have to re-type them.
                </p>
              </div>
            </div>
          </div>

          {/* Right 8 Columns: Your Profile & Billing Information Form (All fields optional for Invoice BILL TO) */}
          <div className="lg:col-span-8 bg-white border border-stone-200 rounded-xl p-6 sm:p-8 space-y-6">
            <div className="pb-4 border-b border-stone-200 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-mono-tabular text-blue-700 font-semibold uppercase">
                  YOUR PROFILE & INVOICE BILLING DETAILS
                </p>
                <h2 className="text-xl font-bold text-stone-900 mt-0.5">
                  Your Profile (Billing & Account Information)
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  All billing fields below are optional. Only the fields you fill in will be added under <strong>BILL TO</strong> on your invoices.
                </p>
              </div>
              <span className="px-3 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                Optional Billing Fields
              </span>
            </div>

            <form onSubmit={handleSaveProfileChanges} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                    Company Name:
                  </label>
                  <input
                    type="text"
                    value={profileCompany}
                    onChange={(e) => setProfileCompany(e.target.value)}
                    placeholder="Optional — Your company or studio name"
                    className="w-full px-3.5 py-2.5 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-blue-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                    Contact Person:
                  </label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="Optional — Contact person full name"
                    className="w-full px-3.5 py-2.5 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-blue-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                    Address:
                  </label>
                  <input
                    type="text"
                    value={profileAddress}
                    onChange={(e) => setProfileAddress(e.target.value)}
                    placeholder="Optional — Street, City, Postcode, Country"
                    className="w-full px-3.5 py-2.5 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-blue-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                    Phone No.:
                  </label>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    placeholder="Optional — Phone / WhatsApp number"
                    className="w-full px-3.5 py-2.5 text-xs font-mono-tabular border border-stone-300 rounded-lg focus:outline-none focus:border-blue-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                    Website:
                  </label>
                  <input
                    type="text"
                    value={profileWebsite}
                    onChange={(e) => setProfileWebsite(e.target.value)}
                    placeholder="Optional — https://yourwebsite.com"
                    className="w-full px-3.5 py-2.5 text-xs font-mono-tabular border border-stone-300 rounded-lg focus:outline-none focus:border-blue-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                    Email:
                  </label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    placeholder="Optional — Billing & login email"
                    className="w-full px-3.5 py-2.5 text-xs font-mono-tabular border border-stone-300 rounded-lg focus:outline-none focus:border-blue-700"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-stone-200">
                <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                  Change Portal Password (Optional):
                </label>
                <div className="relative max-w-sm">
                  <input
                    type={showProfilePassword ? 'text' : 'password'}
                    value={profilePassword}
                    onChange={(e) => setProfilePassword(e.target.value)}
                    placeholder="Leave unchanged or type new password"
                    className="w-full pl-3.5 pr-10 py-2.5 text-xs font-mono-tabular border border-stone-300 rounded-lg focus:outline-none focus:border-blue-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowProfilePassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                    aria-label="Toggle password visibility"
                  >
                    {showProfilePassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {profileError && (
                <p className="text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5">
                  {profileError}
                </p>
              )}

              {profileSaveNotice && (
                <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{profileSaveNotice}</span>
                </div>
              )}

              <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-stone-200">
                <p className="text-[11px] text-stone-500">
                  Not required — only the fields you enter here will be added to your invoice.
                </p>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors flex items-center gap-2 shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Your Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* YOUR PROFILE & BILLING INFORMATION POPUP MODAL (Opened when clicking "Your Profile") */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 p-4 overflow-y-auto">
          <div className="bg-white border border-stone-200 rounded-xl max-w-2xl w-full p-6 md:p-8 shadow-xl my-8">
            <div className="flex items-start justify-between gap-4 pb-5 border-b border-stone-200">
              <div>
                <p className="text-xs font-mono-tabular text-blue-700 font-semibold uppercase">
                  CLIENT ACCOUNT & INVOICE BILLING DETAILS
                </p>
                <h2 className="text-xl font-bold text-stone-900 mt-1">
                  Your Profile
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Add your billing details below (not required). Whichever fields you provide will automatically appear under <strong>BILL TO</strong> on your invoices.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="p-2 text-stone-500 hover:text-stone-900 rounded-lg border border-stone-200 transition-colors"
                aria-label="Close Your Profile modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfileChanges} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                    Company Name:
                  </label>
                  <input
                    type="text"
                    value={profileCompany}
                    onChange={(e) => setProfileCompany(e.target.value)}
                    placeholder="Optional — Company or Studio Name"
                    className="w-full px-3.5 py-2.5 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-blue-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                    Contact Person:
                  </label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="Optional — Contact Person Name"
                    className="w-full px-3.5 py-2.5 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-blue-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                    Address:
                  </label>
                  <input
                    type="text"
                    value={profileAddress}
                    onChange={(e) => setProfileAddress(e.target.value)}
                    placeholder="Optional — Billing Street Address, City, Country"
                    className="w-full px-3.5 py-2.5 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-blue-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                    Phone No.:
                  </label>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    placeholder="Optional — Phone / WhatsApp No."
                    className="w-full px-3.5 py-2.5 text-xs font-mono-tabular border border-stone-300 rounded-lg focus:outline-none focus:border-blue-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                    Website:
                  </label>
                  <input
                    type="text"
                    value={profileWebsite}
                    onChange={(e) => setProfileWebsite(e.target.value)}
                    placeholder="Optional — https://yourwebsite.com"
                    className="w-full px-3.5 py-2.5 text-xs font-mono-tabular border border-stone-300 rounded-lg focus:outline-none focus:border-blue-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                    Email:
                  </label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    placeholder="Optional — Billing & Login Email"
                    className="w-full px-3.5 py-2.5 text-xs font-mono-tabular border border-stone-300 rounded-lg focus:outline-none focus:border-blue-700"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-stone-200">
                <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                  Change Portal Password (Optional):
                </label>
                <div className="relative max-w-sm">
                  <input
                    type={showProfilePassword ? 'text' : 'password'}
                    value={profilePassword}
                    onChange={(e) => setProfilePassword(e.target.value)}
                    placeholder="Leave unchanged or enter new password"
                    className="w-full pl-3.5 pr-10 py-2.5 text-xs font-mono-tabular border border-stone-300 rounded-lg focus:outline-none focus:border-blue-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowProfilePassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                    aria-label="Toggle password visibility"
                  >
                    {showProfilePassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {profileError && (
                <p className="text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {profileError}
                </p>
              )}

              {profileSaveNotice && (
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{profileSaveNotice}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 border border-stone-300 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Your Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Read-Only Commercial Invoice & PDF Download Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 p-4 overflow-y-auto">
          {(() => {
            const modalInvoiceStatus = getInvoiceStatus(
              selectedReceipt.invoiceRef,
              undefined,
              selectedReceipt.title
            );
            const linkedOrder = orders.find(
              (o) =>
                selectedReceipt.invoiceRef === `INV-${o.orderNumber}` ||
                selectedReceipt.title.includes(o.orderNumber)
            );

            const billFromCompany =
              invoicePaymentInfo.companyName || 'Fix Photo Studio.';
            const billFromContact =
              invoicePaymentInfo.contactPerson || 'Eng. Md Forhad Hossen.';
            const billFromAddress =
              invoicePaymentInfo.companyAddress ||
              'House 5, Road 5, Block A, Mirpur 1, Dhaka, 1216.';
            const billFromCountry =
              invoicePaymentInfo.companyCountry || 'Bangladesh.';
            const billFromPhone =
              invoicePaymentInfo.companyPhone || '+8801911862115';
            const taxRate = Number(invoicePaymentInfo.taxRatePercent || 0);

            const effectivePaymentTerms =
              linkedOrder?.paymentTerms ||
              invoicePaymentInfo.defaultPaymentTerms ||
              'Project';
            const effectivePaymentOption =
              linkedOrder?.paymentOption ||
              invoicePaymentInfo.defaultPaymentOption ||
              'PayPal';

            // Customer BILL TO values: only show what the customer provided (never show placeholder 'Registered Creative Studio')
            const rawBillToCompany =
              linkedOrder?.companyName !== undefined
                ? linkedOrder.companyName
                : profileCompany || activeClientCompany;
            const billToCompany =
              rawBillToCompany === 'Registered Creative Studio' ||
              rawBillToCompany === 'Creative Retail Brand'
                ? ''
                : (rawBillToCompany || '').trim();

            const billToContact = (
              linkedOrder?.clientName ||
              profileName ||
              activeClientName ||
              ''
            ).trim();
            const billToAddress = (
              linkedOrder?.clientAddress ||
              profileAddress ||
              clientSessionAddress ||
              ''
            ).trim();
            const billToPhone = (
              linkedOrder?.clientPhone ||
              profilePhone ||
              clientSessionPhone ||
              ''
            ).trim();
            const billToWebsite = (
              linkedOrder?.clientWebsite ||
              profileWebsite ||
              clientSessionWebsite ||
              ''
            ).trim();
            const billToEmail = (
              linkedOrder?.clientEmail ||
              profileEmail ||
              activeClientEmail ||
              ''
            ).trim();

            const rawSubtotal = linkedOrder
              ? linkedOrder.totalPrice
              : parseFloat(
                  (selectedReceipt.amountFormatted || '0').replace(/[^0-9.]/g, '')
                ) || 0;
            const frameQty = linkedOrder ? linkedOrder.imageCount : 1;
            const unitRate = frameQty > 0 ? rawSubtotal / frameQty : rawSubtotal;
            const taxAmount = (rawSubtotal * taxRate) / 100;
            const grandTotal = rawSubtotal + taxAmount;

            const serviceDescription = linkedOrder
              ? `${linkedOrder.projectTitle} (${
                  STUDIO_SERVICES.find((s) => s.id === linkedOrder.serviceCategory)
                    ?.shortNavTitle || linkedOrder.serviceCategory
                })`
              : selectedReceipt.title;

            const specSummary = linkedOrder
              ? `${linkedOrder.outputFormat} · ${linkedOrder.backgroundSpec} · ${linkedOrder.turnaroundHours}h SLA`
              : selectedReceipt.message;

            const resolvedPayPalEmail =
              invoicePaymentInfo.paypalEmail || 'hello@clippasia.com';
            const resolvedBankDetails = {
              bankName: invoicePaymentInfo.bankName || 'Dutch Bangla Bank PLC',
              accountName:
                invoicePaymentInfo.accountHolderName || 'Md Forhad Hossen',
              accountNo:
                invoicePaymentInfo.accountNumberOrIban || '211.1510.213110',
              branch:
                invoicePaymentInfo.bankBranch ||
                'Mirpur 11, Pallabi Branch, Dhaka, Bangladesh.',
              branchCode: invoicePaymentInfo.branchCode || '211',
              swiftCode: invoicePaymentInfo.swiftCode || 'DBBLBDDH',
              routingNo: invoicePaymentInfo.routingNumber || '090263581',
            };

            const rawInstructions =
              invoicePaymentInfo.paymentInstructions ||
              `Please include your Invoice Reference ID (${selectedReceipt.invoiceRef}) in the payment memo. Once payment is sent, our billing desk will verify and update your invoice status from PENDING to PAID in the Client Portal.`;
            const dynamicPaymentInstructions = rawInstructions.replace(
              /INV-FPS-2026-XXXX/gi,
              selectedReceipt.invoiceRef
            );

            const handleDownloadInvoicePdfFile = () => {
              downloadCommercialInvoicePdf({
                invoiceRef: selectedReceipt.invoiceRef,
                orderNumber: linkedOrder?.orderNumber,
                issueDate: formatTimestamp(selectedReceipt.createdAt),
                status: modalInvoiceStatus,
                paymentTerms: effectivePaymentTerms,
                paymentOption: effectivePaymentOption,
                billFrom: {
                  companyName: billFromCompany,
                  contactPerson: billFromContact,
                  address: billFromAddress,
                  country: billFromCountry,
                  phone: billFromPhone,
                  billingEmail:
                    invoicePaymentInfo.billingSupportEmail ||
                    'asiaclipp@gmail.com',
                },
                billTo: {
                  companyName: billToCompany || undefined,
                  contactPerson: billToContact || undefined,
                  address: billToAddress || undefined,
                  phone: billToPhone || undefined,
                  website: billToWebsite || undefined,
                  email: billToEmail || undefined,
                },
                lineItem: {
                  description: serviceDescription,
                  specsAndSla: specSummary,
                  quantity: frameQty,
                  unitRate,
                  lineTotal: rawSubtotal,
                },
                subtotal: rawSubtotal,
                taxRatePercent: taxRate,
                taxAmount,
                grandTotal,
                paypalEmail: resolvedPayPalEmail,
                bankDetails: resolvedBankDetails,
                paymentInstructions: dynamicPaymentInstructions,
                invoiceNotesAndTerms: invoicePaymentInfo.invoiceNotesAndTerms,
              });
            };

            return (
              <div className="bg-white border border-stone-300 rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 my-8 shadow-2xl print:shadow-none print:border-none print:p-0 print:my-0">
                {/* Top Modal Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-200 print:hidden">
                  <div className="flex items-center gap-2 text-xs text-stone-600">
                    <Lock className="w-3.5 h-3.5 text-blue-700" />
                    <span>
                      Official Read-Only Studio Invoice (Issued by FixPhoto Studio Admin)
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={handleDownloadInvoicePdfFile}
                      className="px-4 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Invoice PDF</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedReceipt(null)}
                      className="text-xs font-semibold text-stone-600 hover:text-stone-900 px-3 py-2 rounded-lg border border-stone-300 bg-white"
                    >
                      Close ✕
                    </button>
                  </div>
                </div>

                <div className="space-y-6 text-stone-900 select-text">
                  {/* Invoice Header with Official Site Logo & Invoice Meta */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b-2 border-[#001E5A]">
                    <div className="space-y-2">
                      <FixPhotoBrandLogo showTagline={true} size="sm" />
                      <div className="text-xs text-stone-600 space-y-0.5 pt-1">
                        <p className="font-bold text-stone-900 text-sm">
                          {billFromCompany}
                        </p>
                        <p>{billFromAddress}</p>
                        <p>
                          Tel: {billFromPhone} · Billing:{' '}
                          {invoicePaymentInfo.billingSupportEmail}
                        </p>
                      </div>
                    </div>

                    <div className="sm:text-right space-y-1.5">
                      <span className="inline-block px-3 py-1 rounded bg-[#001E5A] text-white font-mono-tabular text-xs font-bold tracking-wider uppercase">
                        COMMERCIAL INVOICE
                      </span>
                      <div className="text-xs font-mono-tabular space-y-1 pt-1">
                        <p>
                          <span className="text-stone-500">INVOICE NO: </span>
                          <strong className="text-stone-900">
                            {selectedReceipt.invoiceRef}
                          </strong>
                        </p>
                        {linkedOrder && (
                          <p>
                            <span className="text-stone-500">ORDER REF: </span>
                            <strong className="text-stone-900">
                              {linkedOrder.orderNumber}
                            </strong>
                          </p>
                        )}
                        <p>
                          <span className="text-stone-500">ISSUE DATE: </span>
                          <span className="text-stone-900">
                            {formatTimestamp(selectedReceipt.createdAt)}
                          </span>
                        </p>
                        <p className="pt-1">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold border ${
                              modalInvoiceStatus === 'paid'
                                ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                                : 'bg-amber-100 text-amber-900 border-amber-400'
                            }`}
                          >
                            STATUS:{' '}
                            {modalInvoiceStatus === 'paid'
                              ? 'PAID & SETTLED ✓'
                              : 'PENDING PAYMENT'}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* BILL FROM, BILL TO & INVOICE TERMS GRID */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                    {/* BILL FROM */}
                    <div className="md:col-span-4 p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                      <p className="text-[10px] font-mono-tabular font-bold uppercase tracking-wider text-[#001E5A] pb-1 border-b border-stone-200">
                        BILL FROM:
                      </p>
                      <p className="text-stone-700 pt-1">
                        <span className="font-semibold text-stone-900">
                          Company Name:{' '}
                        </span>
                        {billFromCompany}
                      </p>
                      <p className="text-stone-700">
                        <span className="font-semibold text-stone-900">
                          Contact Person:{' '}
                        </span>
                        {billFromContact}
                      </p>
                      <p className="text-stone-700">
                        <span className="font-semibold text-stone-900">
                          Address:{' '}
                        </span>
                        {billFromAddress}
                      </p>
                      <p className="text-stone-700">
                        <span className="font-semibold text-stone-900">
                          Country:{' '}
                        </span>
                        {billFromCountry}
                      </p>
                      <p className="text-stone-700 font-mono-tabular">
                        <span className="font-sans font-semibold text-stone-900">
                          Phone:{' '}
                        </span>
                        {billFromPhone}
                      </p>
                    </div>

                    {/* BILL TO (Only shows fields provided by the customer) */}
                    <div className="md:col-span-5 p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                      <p className="text-[10px] font-mono-tabular font-bold uppercase tracking-wider text-[#001E5A] pb-1 border-b border-stone-200">
                        BILL TO:
                      </p>
                      <div className="pt-1 space-y-1">
                        {billToCompany && (
                          <p className="text-stone-700">
                            <span className="font-semibold text-stone-900">
                              Company Name:{' '}
                            </span>
                            {billToCompany}
                          </p>
                        )}
                        {billToContact && (
                          <p className="text-stone-700">
                            <span className="font-semibold text-stone-900">
                              Contact Person:{' '}
                            </span>
                            {billToContact}
                          </p>
                        )}
                        {billToAddress && (
                          <p className="text-stone-700">
                            <span className="font-semibold text-stone-900">
                              Address:{' '}
                            </span>
                            {billToAddress}
                          </p>
                        )}
                        {billToPhone && (
                          <p className="text-stone-700 font-mono-tabular">
                            <span className="font-sans font-semibold text-stone-900">
                              Phone No.:{' '}
                            </span>
                            {billToPhone}
                          </p>
                        )}
                        {billToWebsite && (
                          <p className="text-stone-700 font-mono-tabular">
                            <span className="font-sans font-semibold text-stone-900">
                              Website:{' '}
                            </span>
                            {billToWebsite}
                          </p>
                        )}
                        {billToEmail && (
                          <p className="text-stone-700 font-mono-tabular">
                            <span className="font-sans font-semibold text-stone-900">
                              Email:{' '}
                            </span>
                            {billToEmail}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* INVOICE SUMMARY & TERMS (No Verification / Document Lock lines) */}
                    <div className="md:col-span-3 p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
                      <p className="text-[10px] font-mono-tabular font-bold uppercase tracking-wider text-[#001E5A] pb-1 border-b border-stone-200">
                        INVOICE SUMMARY & TERMS
                      </p>
                      <p className="text-stone-700 pt-1">
                        <span className="font-semibold text-stone-900">
                          Currency:{' '}
                        </span>
                        USD ($)
                      </p>
                      <p className="text-stone-700">
                        <span className="font-semibold text-stone-900">
                          Payment Terms:{' '}
                        </span>
                        <span className="font-bold text-[#001E5A]">
                          {effectivePaymentTerms}
                        </span>
                      </p>
                      <p className="text-stone-700">
                        <span className="font-semibold text-stone-900">
                          Payment Option:{' '}
                        </span>
                        <span className="font-bold text-blue-700">
                          {effectivePaymentOption}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Spreadsheet / Excel-Style Itemized Invoice Table */}
                  <div className="overflow-x-auto border border-stone-300 rounded-xl">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#001E5A] text-white font-mono-tabular text-[11px] uppercase">
                          <th className="py-2.5 px-3 border-r border-blue-900 w-12 text-center">
                            SL
                          </th>
                          <th className="py-2.5 px-3 border-r border-blue-900">
                            Service / Project Description
                          </th>
                          <th className="py-2.5 px-3 border-r border-blue-900">
                            Specs & Turnaround SLA
                          </th>
                          <th className="py-2.5 px-3 border-r border-blue-900 text-right w-20">
                            Qty
                          </th>
                          <th className="py-2.5 px-3 border-r border-blue-900 text-right w-24">
                            Unit Rate
                          </th>
                          <th className="py-2.5 px-3 text-right w-28">
                            Line Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200 font-mono-tabular">
                        <tr className="bg-white">
                          <td className="py-3 px-3 border-r border-stone-200 text-center font-semibold text-stone-700">
                            01
                          </td>
                          <td className="py-3 px-3 border-r border-stone-200 font-sans font-semibold text-stone-900">
                            {serviceDescription}
                          </td>
                          <td className="py-3 px-3 border-r border-stone-200 text-stone-600">
                            {specSummary}
                          </td>
                          <td className="py-3 px-3 border-r border-stone-200 text-right text-stone-900">
                            {frameQty.toLocaleString()}
                          </td>
                          <td className="py-3 px-3 border-r border-stone-200 text-right text-stone-700">
                            ${unitRate.toFixed(2)}
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-stone-900">
                            ${rawSubtotal.toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                      <tfoot className="bg-stone-50 border-t-2 border-stone-300 font-mono-tabular text-xs">
                        <tr className="border-b border-stone-200">
                          <td
                            colSpan={5}
                            className="py-2 px-3 text-right font-semibold text-stone-600 border-r border-stone-200"
                          >
                            Subtotal (USD)
                          </td>
                          <td className="py-2 px-3 text-right font-semibold text-stone-900">
                            ${rawSubtotal.toFixed(2)}
                          </td>
                        </tr>
                        <tr className="border-b border-stone-200">
                          <td
                            colSpan={5}
                            className="py-2 px-3 text-right font-semibold text-stone-600 border-r border-stone-200"
                          >
                            Tax / VAT ({taxRate}%)
                          </td>
                          <td className="py-2 px-3 text-right font-semibold text-stone-900">
                            ${taxAmount.toFixed(2)}
                          </td>
                        </tr>
                        <tr className="bg-blue-50/70 text-sm">
                          <td
                            colSpan={5}
                            className="py-2.5 px-3 text-right font-bold text-[#001E5A] border-r border-stone-200"
                          >
                            {modalInvoiceStatus === 'paid'
                              ? 'GRAND TOTAL SETTLED (USD)'
                              : 'GRAND TOTAL DUE (USD)'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-[#001E5A]">
                            ${grandTotal.toFixed(2)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* Official Payment Remittance Details (Configured by Studio Admin) */}
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-2">
                      <span className="font-bold text-stone-900 uppercase font-mono-tabular">
                        Official Payment Remittance Details (Configured by Studio Admin)
                      </span>
                      <div className="flex items-center gap-3 text-[11px] font-mono-tabular">
                        <span className="font-semibold text-stone-700">
                          Payment Terms: <strong className="text-[#001E5A]">{effectivePaymentTerms}</strong>
                        </span>
                        <span>·</span>
                        <span className="font-semibold text-stone-700">
                          Payment Option: <strong className="text-blue-700">{effectivePaymentOption}</strong>
                        </span>
                        <span>·</span>
                        <span className="text-blue-700 font-semibold">
                          Ref: {selectedReceipt.invoiceRef}
                        </span>
                      </div>
                    </div>

                    {effectivePaymentOption === 'PayPal' ? (
                      <div className="p-3.5 rounded-lg bg-white border border-blue-200 space-y-1 font-mono-tabular">
                        <p className="text-[10px] font-bold uppercase text-stone-500">
                          PAYPAL PAYMENT ACCOUNT
                        </p>
                        <p className="text-sm font-bold text-blue-700">
                          PayPal Mail ID: {resolvedPayPalEmail}
                        </p>
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-lg bg-white border border-stone-200 space-y-2">
                        <p className="text-[11px] font-bold text-[#001E5A] uppercase font-mono-tabular">
                          Bank Details Below:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
                          <p className="text-stone-700">
                            <span className="font-semibold text-stone-900">
                              Bank Name :{' '}
                            </span>
                            {resolvedBankDetails.bankName}
                          </p>
                          <p className="text-stone-700">
                            <span className="font-semibold text-stone-900">
                              Account Name :{' '}
                            </span>
                            {resolvedBankDetails.accountName}
                          </p>
                          <p className="text-stone-700 font-mono-tabular">
                            <span className="font-sans font-semibold text-stone-900">
                              Account No :{' '}
                            </span>
                            {resolvedBankDetails.accountNo}
                          </p>
                          <p className="text-stone-700">
                            <span className="font-semibold text-stone-900">
                              Branch :{' '}
                            </span>
                            {resolvedBankDetails.branch}
                          </p>
                          <p className="text-stone-700 font-mono-tabular">
                            <span className="font-sans font-semibold text-stone-900">
                              Branch Code :{' '}
                            </span>
                            {resolvedBankDetails.branchCode}
                          </p>
                          <p className="text-stone-700 font-mono-tabular">
                            <span className="font-sans font-semibold text-stone-900">
                              SWIFT Code :{' '}
                            </span>
                            {resolvedBankDetails.swiftCode}
                          </p>
                          <p className="text-stone-700 font-mono-tabular">
                            <span className="font-sans font-semibold text-stone-900">
                              Routing No :{' '}
                            </span>
                            {resolvedBankDetails.routingNo}
                          </p>
                        </div>
                      </div>
                    )}

                    <p className="text-[11px] text-stone-700 leading-relaxed pt-1">
                      <strong className="text-stone-900">
                        Payment Instructions:{' '}
                      </strong>
                      {dynamicPaymentInstructions}
                    </p>

                    {invoicePaymentInfo.invoiceNotesAndTerms && (
                      <p className="text-[11px] text-stone-500 leading-relaxed border-t border-stone-200 pt-2">
                        <strong className="text-stone-700">
                          Terms & Notes:{' '}
                        </strong>
                        {invoicePaymentInfo.invoiceNotesAndTerms}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-200 print:hidden">
                  <span className="text-[11px] font-mono-tabular text-stone-500">
                    Billing Support: {invoicePaymentInfo.billingSupportEmail}
                  </span>
                  <button
                    type="button"
                    onClick={handleDownloadInvoicePdfFile}
                    className="px-5 py-2.5 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-lg flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download / Print Invoice PDF</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
