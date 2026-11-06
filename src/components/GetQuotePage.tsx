import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  ArrowRight,
  UploadCloud,
  FileCheck2,
  Loader2,
  Trash2,
  Plus,
  X,
  CheckCircle2,
} from 'lucide-react';
import {
  ServiceCategory,
  OutputFormat,
  BackgroundSpec,
  UploadedClientFileItem,
} from '../types';
import { ServiceDefinition } from '../data/studioCatalog';

interface GetQuotePageProps {
  mode?: 'page' | 'modal';
  isOpen?: boolean;
  onClose?: () => void;
  services: ServiceDefinition[];
  isAuthenticatedClient?: boolean;
  clientProfileData?: {
    name: string;
    email: string;
    phone: string;
    companyName: string;
  };
  onSubmitQuoteOrder: (payload: {
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
    clientName?: string;
    clientEmail?: string;
    clientPhone?: string;
    companyName?: string;
  }) => Promise<void>;
  onSubmitPublicQuery?: (payload: {
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    companyName: string;
    serviceTitle: string;
    serviceSlug: string;
    instructions: string;
    sampleFiles: string[];
    sampleFilesData?: UploadedClientFileItem[];
  }) => Promise<{ queryNumber: string }>;
  onOpenFreeTrial?: () => void;
  onBackToHome?: () => void;
}

interface QuoteLineItem {
  id: string;
  serviceSlug: string;
  serviceTitle: string;
  category: ServiceCategory;
  complexityMultiplier: number;
  complexityLabel: string;
  quantity: number;
  baseRate: number;
}

export const GetQuotePage: React.FC<GetQuotePageProps> = ({
  mode = 'modal',
  isOpen = true,
  onClose,
  services,
  isAuthenticatedClient = false,
  clientProfileData,
  onSubmitQuoteOrder,
  onSubmitPublicQuery,
  onOpenFreeTrial,
  onBackToHome,
}) => {
  const [clientName, setClientName] = useState(clientProfileData?.name || '');
  const [workEmail, setWorkEmail] = useState(clientProfileData?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(clientProfileData?.phone || '');
  const [companyName, setCompanyName] = useState(
    clientProfileData?.companyName || ''
  );
  const [projectTitle, setProjectTitle] = useState('');
  const [turnaroundHours] = useState<number>(24);
  const [outputFormat] = useState<OutputFormat>('PSD_LAYERED');
  const [backgroundSpec] = useState<BackgroundSpec>('PURE_WHITE_FFFFFF');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isAuthenticatedClient && clientProfileData) {
      setClientName(clientProfileData.name || '');
      setWorkEmail(clientProfileData.email || '');
      setPhoneNumber(clientProfileData.phone || '');
      setCompanyName(clientProfileData.companyName || '');
    }
  }, [isAuthenticatedClient, clientProfileData]);

  const [lineItems, setLineItems] = useState<QuoteLineItem[]>([]);

  const [newItemSlug, setNewItemSlug] = useState<string>(
    'clipping-path-service'
  );
  const [newItemComplexity, setNewItemComplexity] = useState<number>(1.0);
  const [newItemQty, setNewItemQty] = useState<number>(100);

  const [sampleFiles, setSampleFiles] = useState<
    Array<{
      id: string;
      name: string;
      sizeLabel: string;
      progress: number;
      done: boolean;
      dataUrl?: string;
    }>
  >([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [csvBanner, setCsvBanner] = useState<string | null>(null);
  const [uploadLimitNotice, setUploadLimitNotice] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedNotice, setSubmittedNotice] = useState<{
    queryNumber: string;
    clientName: string;
    clientEmail: string;
  } | null>(null);

  const handleDismiss = () => {
    setSubmittedNotice(null);
    if (onClose) onClose();
    else if (onBackToHome) onBackToHome();
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleDismiss();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const hasPending = sampleFiles.some((f) => !f.done);
    if (!hasPending) return;
    const timer = window.setInterval(() => {
      setSampleFiles((prev) =>
        prev.map((f) => {
          if (f.done) return f;
          const next = Math.min(100, f.progress + 22);
          return { ...f, progress: next, done: next >= 100 };
        })
      );
    }, 220);
    return () => window.clearInterval(timer);
  }, [sampleFiles, isOpen]);

  if (!isOpen) return null;

  const handleAddLineItem = () => {
    const svc =
      services.find((s) => s.slug === newItemSlug) || services[0];
    const compLabel =
      newItemComplexity === 1.0
        ? 'Basic (1.0×)'
        : newItemComplexity === 1.4
        ? 'Medium (1.4×)'
        : 'Complex (1.9×)';

    setLineItems((prev) => [
      ...prev,
      {
        id: `li_${Date.now()}`,
        serviceSlug: svc.slug,
        serviceTitle: svc.shortNavTitle,
        category: svc.id,
        complexityMultiplier: newItemComplexity,
        complexityLabel: compLabel,
        quantity: Math.max(1, newItemQty),
        baseRate: svc.ratePerImage,
      },
    ]);
  };

  const handleRemoveLineItem = (id: string) => {
    setLineItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateLineQty = (id: string, qty: number) => {
    setLineItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, qty) } : item
      )
    );
  };

  const addCustomerQuoteFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploadLimitNotice(null);
    const remainingSlots = Math.max(0, 5 - sampleFiles.length);
    if (remainingSlots === 0) {
      setUploadLimitNotice(
        'Maximum 5 sample files allowed. Remove a file to upload another.'
      );
      return;
    }

    const incoming = Array.from(files);
    if (incoming.length > remainingSlots) {
      setUploadLimitNotice(
        `Up to 5 sample files allowed. Added ${remainingSlots} file(s).`
      );
    }

    const sliced = incoming.slice(0, remainingSlots);
    const ts = Date.now();
    const added = sliced.map((f, idx) => ({
      id: `qf_${ts}_${idx}`,
      name: f.name.slice(0, 120),
      sizeLabel: `${Math.max(0.1, Number((f.size / (1024 * 1024)).toFixed(1)))} MB`,
      progress: 18,
      done: false,
    }));

    setSampleFiles((prev) => [...prev, ...added].slice(0, 5));

    sliced.forEach((f, idx) => {
      const entryId = `qf_${ts}_${idx}`;
      try {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            const dataUrl = reader.result;
            setSampleFiles((prev) =>
              prev.map((item) =>
                item.id === entryId ? { ...item, dataUrl } : item
              )
            );
          }
        };
        reader.readAsDataURL(f);
      } catch {
        // ignore
      }
    });
  };

  const handleReferenceFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    addCustomerQuoteFiles(e.target.files);
    e.target.value = '';
  };

  const handleDropReferenceFiles = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    addCustomerQuoteFiles(e.dataTransfer.files);
  };

  const overallSampleUploadProgress =
    sampleFiles.length === 0
      ? 0
      : Math.round(
          sampleFiles.reduce((acc, f) => acc + f.progress, 0) /
            sampleFiles.length
        );

  // Pricing Calculations
  const totalQuantity = lineItems.reduce((acc, item) => acc + item.quantity, 0);
  const slaMultiplier = 1.0;
  const addonPerFrame = 0;

  const rawSubtotal = lineItems.reduce((sum, item) => {
    const unit =
      item.baseRate * item.complexityMultiplier * slaMultiplier + addonPerFrame;
    return sum + unit * item.quantity;
  }, 0);

  const volumeDiscountPct =
    totalQuantity >= 1000
      ? 25
      : totalQuantity >= 500
      ? 15
      : totalQuantity >= 200
      ? 10
      : 0;

  const discountAmount = Number(
    ((rawSubtotal * volumeDiscountPct) / 100).toFixed(2)
  );
  const netQuoteTotal = Number((rawSubtotal - discountAmount).toFixed(2));
  const effectiveUnitAvg =
    totalQuantity > 0
      ? Number((netQuoteTotal / totalQuantity).toFixed(2))
      : 0;

  const handleExportQuoteCsv = () => {
    const headers = [
      'Line_Item',
      'Service_Name',
      'Complexity',
      'Quantity',
      'Base_Rate_USD',
      'SLA_Hours',
      'Line_Subtotal_USD',
    ];
    const rows = lineItems.map((item, idx) => {
      const unit =
        item.baseRate * item.complexityMultiplier * slaMultiplier +
        addonPerFrame;
      return [
        idx + 1,
        `"${item.serviceTitle}"`,
        `"${item.complexityLabel}"`,
        item.quantity,
        item.baseRate.toFixed(2),
        turnaroundHours,
        (unit * item.quantity).toFixed(2),
      ].join(',');
    });
    rows.push(
      `SUMMARY,"Net Quote Total (${volumeDiscountPct}% Volume Discount)",${totalQuantity},,,${turnaroundHours},${netQuoteTotal.toFixed(
        2
      )}`
    );

    const csvString = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `FixPhoto_Studio_Quote_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setCsvBanner('Formal CSV Quote Estimate downloaded!');
    setTimeout(() => setCsvBanner(null), 4000);
  };

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const effectiveName = (
      isAuthenticatedClient && clientProfileData?.name
        ? clientProfileData.name
        : clientName
    ).trim();
    const effectiveEmail = (
      isAuthenticatedClient && clientProfileData?.email
        ? clientProfileData.email
        : workEmail
    ).trim();
    const effectivePhone = (
      isAuthenticatedClient && clientProfileData?.phone
        ? clientProfileData.phone
        : phoneNumber
    ).trim();
    const effectiveCompany = (
      isAuthenticatedClient && clientProfileData?.companyName
        ? clientProfileData.companyName
        : companyName
    ).trim();

    if (effectiveName.length < 2 || !effectiveEmail.includes('@')) {
      setErrorMsg('Please enter your name and work email to lock your custom quote.');
      return;
    }

    if (!isAuthenticatedClient && effectivePhone.length < 4) {
      setErrorMsg(
        'Please enter your Phone / WhatsApp number so our studio desk can confirm your quote.'
      );
      return;
    }

    // If customer hasn't clicked "+ Add" yet, use the currently selected service row
    const fallbackSvc =
      services.find((s) => s.slug === newItemSlug) || services[0];
    const fallbackCompLabel =
      newItemComplexity === 1.0
        ? 'Basic (1.0×)'
        : newItemComplexity === 1.4
        ? 'Medium (1.4×)'
        : 'Complex (1.9×)';
    const effectiveItems: QuoteLineItem[] =
      lineItems.length > 0
        ? lineItems
        : [
            {
              id: `li_${Date.now()}`,
              serviceSlug: fallbackSvc.slug,
              serviceTitle: fallbackSvc.shortNavTitle,
              category: fallbackSvc.id,
              complexityMultiplier: newItemComplexity,
              complexityLabel: fallbackCompLabel,
              quantity: Math.max(1, newItemQty),
              baseRate: fallbackSvc.ratePerImage,
            },
          ];

    const effectiveTotalQty = effectiveItems.reduce(
      (acc, item) => acc + item.quantity,
      0
    );
    const effectiveRawSub = effectiveItems.reduce((sum, item) => {
      const unit =
        item.baseRate * item.complexityMultiplier * slaMultiplier +
        addonPerFrame;
      return sum + unit * item.quantity;
    }, 0);
    const effectiveDiscPct =
      effectiveTotalQty >= 1000
        ? 25
        : effectiveTotalQty >= 500
        ? 15
        : effectiveTotalQty >= 200
        ? 10
        : 0;
    const effectiveDiscAmt = Number(
      ((effectiveRawSub * effectiveDiscPct) / 100).toFixed(2)
    );
    const effectiveNetTotal = Number(
      (effectiveRawSub - effectiveDiscAmt).toFixed(2)
    );

    setIsSubmitting(true);
    try {
      const primaryItem = effectiveItems[0];
      const breakdownSummary = effectiveItems
        .map(
          (i) => `${i.quantity}x ${i.serviceTitle} (${i.complexityLabel})`
        )
        .join(' + ');

      const sampleFilesData: UploadedClientFileItem[] = sampleFiles.map((f) => ({
        name: f.name,
        sizeLabel: f.sizeLabel,
        dataUrl: f.dataUrl,
      }));
      let qNum = `FX-${new Date().getDate().toString().padStart(2, '0')}${(
        new Date().getMonth() + 1
      )
        .toString()
        .padStart(2, '0')}${new Date().getFullYear()}`;
      if (onSubmitPublicQuery) {
        const res = await onSubmitPublicQuery({
          clientName: effectiveName,
          clientEmail: effectiveEmail,
          clientPhone: effectivePhone,
          companyName: effectiveCompany,
          serviceTitle: `${primaryItem.serviceTitle} ($${effectiveNetTotal.toFixed(2)} Quote)`,
          serviceSlug: primaryItem.serviceSlug,
          instructions: `Items: ${breakdownSummary} | Total: $${effectiveNetTotal.toFixed(2)} USD.${
            notes.trim() ? ` Working Instruction: ${notes.trim()}` : ''
          }`,
          sampleFiles: sampleFiles.map((f) => f.name),
          sampleFilesData,
        });
        qNum = res.queryNumber;
      }

      const finalTitle =
        projectTitle.trim() || 'Custom Studio Volume Production Quote';
      await onSubmitQuoteOrder({
        projectTitle: `CUSTOM QUOTE — ${finalTitle} (${
          effectiveCompany || effectiveName
        })`,
        serviceCategory: primaryItem.category,
        serviceTitle: primaryItem.serviceTitle,
        imageCount: effectiveTotalQty,
        turnaroundHours,
        outputFormat,
        backgroundSpec,
        instructions:
          notes.trim() || `Items: ${breakdownSummary} (${effectiveDiscPct}% Vol Discount).`,
        totalPrice: effectiveNetTotal,
        uploadedBatchNames: sampleFiles.map((f) => f.name),
        uploadedFilesData: sampleFilesData,
        clientName: effectiveName,
        clientEmail: effectiveEmail,
        clientPhone: effectivePhone,
        companyName: effectiveCompany,
      });

      if (isAuthenticatedClient) {
        handleDismiss();
      } else {
        setSubmittedNotice({
          queryNumber: qNum,
          clientName: effectiveName,
          clientEmail: effectiveEmail,
        });
      }
    } catch {
      setErrorMsg('Could not submit quote request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={
        mode === 'page'
          ? 'py-10 max-w-[1280px] mx-auto px-6'
          : 'fixed inset-0 z-50 flex items-center justify-center bg-[#00143D]/70 backdrop-blur-xs p-4 overflow-y-auto'
      }
    >
      <div
        className={
          mode === 'page'
            ? 'bg-white border border-[#DCE6F2] rounded-2xl w-full p-6 md:p-10 shadow-xs'
            : 'bg-white border border-[#DCE6F2] rounded-2xl max-w-5xl w-full p-6 md:p-8 shadow-xl my-8'
        }
      >
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-[#DCE6F2]">
          <div>
            <p className="text-xs font-mono-tabular text-[#0088FF] font-semibold">
              MULTI-SERVICE CUSTOM VOLUME QUOTE BUILDER · UP TO 25% BULK DISCOUNT
            </p>
            <h1 className="text-xl md:text-2xl font-bold text-[#001E5A] mt-1">
              Get an Instant Custom Studio Quote & Lock Enterprise Pricing
            </h1>
          </div>
          {mode === 'page' && onBackToHome ? (
            <button
              type="button"
              onClick={onBackToHome}
              className="px-4 py-2 text-xs font-semibold text-[#001E5A] bg-[#F5F9FD] hover:bg-[#001E5A] hover:text-white rounded-lg border border-[#DCE6F2] transition-colors shrink-0"
            >
              ← Back to Home Page
            </button>
          ) : (
            <button
              type="button"
              onClick={handleDismiss}
              className="p-2 text-slate-500 hover:text-[#001E5A] rounded-lg border border-[#DCE6F2] transition-colors"
              aria-label="Close Get a Quote popup"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <form
          onSubmit={handleSubmitQuote}
          className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Left 7 Columns: Contact, Line-Item Builder & Sample Image Upload */}
          <div className="lg:col-span-7 space-y-4">
            {isAuthenticatedClient && clientProfileData?.email ? (
              <div className="p-3.5 rounded-xl bg-[#EAF3FC] border border-[#B8D0EB] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0088FF] shrink-0" />
                  <div>
                    <p className="text-[11px] font-bold text-[#001E5A]">
                      Ordering with Your Logged-In Profile (Auto-Filled)
                    </p>
                    <p className="text-[11px] text-slate-600 font-mono-tabular">
                      {clientProfileData.name} · {clientProfileData.email}
                      {clientProfileData.phone
                        ? ` · ${clientProfileData.phone}`
                        : ''}
                      {clientProfileData.companyName
                        ? ` · ${clientProfileData.companyName}`
                        : ''}
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-white border border-[#DCE6F2] text-[10px] font-bold text-[#0088FF]">
                  Profile Linked
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
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Sarah Jenkins"
                    className="w-full px-3 py-2 text-xs border border-[#B8D0EB] rounded-lg focus:outline-none focus:border-[#0088FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={workEmail}
                    onChange={(e) => setWorkEmail(e.target.value)}
                    placeholder="sarah@retailbrand.com"
                    className="w-full px-3 py-2 text-xs border border-[#B8D0EB] rounded-lg focus:outline-none focus:border-[#0088FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 (212) 555-0194"
                    className="w-full px-3 py-2 text-xs border border-[#B8D0EB] rounded-lg focus:outline-none focus:border-[#0088FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                    Company / Agency
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Veloce Commerce"
                    className="w-full px-3 py-2 text-xs border border-[#B8D0EB] rounded-lg focus:outline-none focus:border-[#0088FF]"
                  />
                </div>
              </div>
            )}

            {/* Multi-Service Line Item Builder */}
            <div className="p-4 rounded-xl bg-[#F5F9FD] border border-[#DCE6F2] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#001E5A]">
                  1. Multi-Service Batch Line Items ({lineItems.length})
                </span>
                <span className="text-[11px] font-mono-tabular text-[#0088FF] font-semibold">
                  200+ (10% Off) · 500+ (15% Off) · 1,000+ (25% Off)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end bg-white p-2.5 rounded-lg border border-[#DCE6F2]">
                <div className="sm:col-span-5">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Select Service
                  </label>
                  <select
                    value={newItemSlug}
                    onChange={(e) => setNewItemSlug(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#B8D0EB] rounded-lg"
                  >
                    {services.map((s) => (
                      <option key={s.slug} value={s.slug}>
                        {s.indexNumber} {s.shortNavTitle}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Complexity
                  </label>
                  <select
                    value={newItemComplexity}
                    onChange={(e) => setNewItemComplexity(Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-xs bg-white border border-[#B8D0EB] rounded-lg"
                  >
                    <option value={1.0}>Basic (1.0×)</option>
                    <option value={1.4}>Medium (1.4×)</option>
                    <option value={1.9}>Complex (1.9×)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Qty
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50000}
                    value={newItemQty}
                    onChange={(e) =>
                      setNewItemQty(Math.max(1, Number(e.target.value)))
                    }
                    className="w-full px-2 py-1.5 text-xs font-mono-tabular bg-white border border-[#B8D0EB] rounded-lg"
                  />
                </div>

                <div className="sm:col-span-2">
                  <button
                    type="button"
                    onClick={handleAddLineItem}
                    className="w-full py-1.5 px-2.5 text-xs font-bold text-white bg-[#0088FF] hover:bg-[#001E5A] rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {lineItems.length === 0 ? (
                  <div className="p-3 rounded-lg bg-white border border-dashed border-[#B8D0EB] text-center text-xs text-slate-500">
                    No services added yet — select a service, complexity, and quantity above and click <strong className="text-[#0088FF]">+ Add</strong>.
                  </div>
                ) : (
                  lineItems.map((item) => {
                    const unitPrice =
                      item.baseRate * item.complexityMultiplier * slaMultiplier +
                      addonPerFrame;
                    const lineTotal = unitPrice * item.quantity;

                    return (
                      <div
                        key={item.id}
                        className="p-2.5 rounded-lg bg-white border border-[#DCE6F2] flex flex-wrap items-center justify-between gap-2 text-xs"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-[#001E5A] truncate">
                            {item.serviceTitle}
                          </p>
                          <p className="text-[11px] font-mono-tabular text-slate-500">
                            {item.complexityLabel} · ${unitPrice.toFixed(2)}/unit
                          </p>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                          <input
                            type="number"
                            min={1}
                            max={50000}
                            value={item.quantity}
                            onChange={(e) =>
                              handleUpdateLineQty(item.id, Number(e.target.value))
                            }
                            className="w-20 px-2 py-1 text-xs font-mono-tabular border border-[#B8D0EB] rounded-md"
                          />
                          <span className="font-mono-tabular font-bold text-[#001E5A] w-16 text-right">
                            ${lineTotal.toFixed(2)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveLineItem(item.id)}
                            title="Remove this service"
                            className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* 2. Sample File Upload Queue (Up to 5 Files, Starts Normal Blank) */}
            <div className="p-4 rounded-xl bg-[#F5F9FD] border border-[#DCE6F2] space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-[#0088FF]" />
                  <span className="text-xs font-bold text-[#001E5A]">
                    2. Upload Sample Files ({sampleFiles.length}/5 Files
                    {sampleFiles.length > 0
                      ? ` · ${overallSampleUploadProgress}%`
                      : ''}
                    )
                  </span>
                </div>

                <label
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors inline-flex items-center gap-1.5 ${
                    sampleFiles.length >= 5
                      ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                      : 'bg-[#0088FF] hover:bg-[#001E5A] text-white cursor-pointer'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>
                    {sampleFiles.length >= 5
                      ? 'Max 5 Files Added'
                      : 'Upload Sample Files (Up to 5)'}
                  </span>
                  <input
                    type="file"
                    multiple
                    disabled={sampleFiles.length >= 5}
                    accept="image/*,video/*,.mp4,.mov,.raw,.cr2,.cr3,.nef,.raf,.dng,.psd,.tif,.tiff"
                    onChange={handleReferenceFileSelect}
                    className="hidden"
                  />
                </label>
              </div>

              {uploadLimitNotice && (
                <p className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5">
                  {uploadLimitNotice}
                </p>
              )}

              <div className="w-full h-2 bg-[#DCE6F2] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#001E5A] via-[#0088FF] to-[#00B8FF] transition-all duration-300"
                  style={{ width: `${overallSampleUploadProgress}%` }}
                />
              </div>

              {sampleFiles.length === 0 ? (
                <label
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingOver(true);
                  }}
                  onDragLeave={() => setIsDraggingOver(false)}
                  onDrop={handleDropReferenceFiles}
                  className={`flex flex-col items-center justify-center gap-1.5 py-5 px-4 rounded-lg border border-dashed cursor-pointer transition-colors text-center ${
                    isDraggingOver
                      ? 'border-[#0088FF] bg-[#EAF3FC]'
                      : 'border-[#B8D0EB] bg-white hover:bg-[#EAF3FC]/50'
                  }`}
                >
                  <UploadCloud className="w-5 h-5 text-[#0088FF]" />
                  <span className="text-xs font-semibold text-[#001E5A]">
                    Click to select or drag & drop up to 5 sample files (RAW, PSD, TIFF, PNG, JPG, MP4, MOV)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Upload your own sample photos or video clips so our specialists can verify exact complexity
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*,.mp4,.mov,.raw,.cr2,.cr3,.nef,.raf,.dng,.psd,.tif,.tiff"
                    onChange={handleReferenceFileSelect}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {sampleFiles.map((sf) => (
                    <div
                      key={sf.id}
                      className="p-2.5 bg-white border border-[#DCE6F2] rounded-lg space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-1.5 min-w-0">
                          {sf.done ? (
                            <FileCheck2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          ) : (
                            <Loader2 className="w-3.5 h-3.5 text-[#0088FF] animate-spin shrink-0" />
                          )}
                          <span className="font-mono-tabular font-semibold text-[#001E5A] truncate">
                            {sf.name}
                          </span>
                          <span className="text-[10px] font-mono-tabular text-slate-400 shrink-0">
                            ({sf.sizeLabel})
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[11px] font-mono-tabular text-[#0088FF] font-bold">
                            {sf.progress}%
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setUploadLimitNotice(null);
                              setSampleFiles((prev) =>
                                prev.filter((item) => item.id !== sf.id)
                              );
                            }}
                            className="text-slate-400 hover:text-red-600"
                            aria-label={`Remove ${sf.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-[#EAF3FC] rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            sf.done ? 'bg-emerald-500' : 'bg-[#0088FF]'
                          }`}
                          style={{ width: `${sf.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                Campaign Title & Technical Notes
              </label>
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="e.g., Seasonal E-Commerce & Catalog Production Quote"
                className="w-full px-3 py-2 text-xs border border-[#B8D0EB] rounded-lg mb-2 focus:outline-none focus:border-[#0088FF]"
              />
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe your batch requirements, clipping path or video editing instructions, turnaround preferences..."
                className="w-full px-3 py-2 text-xs border border-[#B8D0EB] rounded-lg focus:outline-none focus:border-[#0088FF]"
              />
            </div>
          </div>

          {/* Right 5 Columns: Live Quote Summary, Volume Discount & Actions */}
          <div className="lg:col-span-5 bg-[#F5F9FD] border border-[#DCE6F2] rounded-xl p-5 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#DCE6F2] pb-3">
                <span className="text-xs font-mono-tabular font-bold text-[#0088FF]">
                  INSTANT VOLUME QUOTE SUMMARY
                </span>
                <span className="px-2 py-0.5 text-[11px] font-mono-tabular font-bold bg-[#EAF3FC] text-[#001E5A] rounded">
                  {totalQuantity.toLocaleString()} Total Units
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Gross Batch Subtotal</span>
                  <span className="font-mono-tabular font-semibold text-[#001E5A]">
                    ${rawSubtotal.toFixed(2)} USD
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Volume Discount ({volumeDiscountPct}%)
                  </span>
                  <span className="font-mono-tabular font-bold text-emerald-600">
                    -${discountAmount.toFixed(2)} USD
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Effective Avg Rate</span>
                  <span className="font-mono-tabular font-semibold text-[#0088FF]">
                    ${effectiveUnitAvg.toFixed(2)} / unit
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Turnaround SLA</span>
                  <span className="font-mono-tabular font-semibold text-[#001E5A]">
                    {turnaroundHours}h Guaranteed
                  </span>
                </div>

                <div className="pt-3 border-t border-[#DCE6F2] flex items-baseline justify-between">
                  <span className="text-sm font-bold text-[#001E5A]">
                    Net Locked Quote
                  </span>
                  <span className="text-2xl font-bold font-mono-tabular text-[#001E5A]">
                    ${netQuoteTotal.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{' '}
                    USD
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleExportQuoteCsv}
                className="w-full py-2.5 px-3 text-xs font-semibold text-[#001E5A] bg-white hover:bg-[#EAF3FC] border border-[#B8D0EB] rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4 text-[#0088FF]" />
                <span>Download Formal CSV Quote Estimate</span>
              </button>

              {csvBanner && (
                <p className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                  {csvBanner}
                </p>
              )}

              {onOpenFreeTrial && (
                <div className="p-3 rounded-xl bg-white border border-[#DCE6F2] flex items-center justify-between gap-2 text-xs">
                  <span className="text-slate-600">
                    Want to test our quality first?
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      handleDismiss();
                      onOpenFreeTrial();
                    }}
                    className="font-bold text-[#0088FF] hover:underline shrink-0"
                  >
                    Free 5-File Trial →
                  </button>
                </div>
              )}

              {errorMsg && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2.5">
                  {errorMsg}
                </p>
              )}

              {submittedNotice && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <p className="text-xs font-bold text-emerald-900">
                      Thank you for your query! Our team will contact you soon.
                    </p>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    Thank you, <strong>{submittedNotice.clientName}</strong>! Your custom quote inquiry (
                    <span className="font-mono-tabular font-semibold">{submittedNotice.queryNumber}</span>
                    ) has been received. A confirmation email has been sent to{' '}
                    <span className="font-mono-tabular font-semibold">{submittedNotice.clientEmail}</span>.
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2.5 pt-3 border-t border-[#DCE6F2]">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 text-xs font-bold text-white bg-gradient-to-r from-[#001E5A] to-[#0088FF] hover:from-[#00143D] hover:to-[#006FE0] disabled:opacity-50 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <span>
                  {isSubmitting
                    ? 'Submitting Custom Quote...'
                    : isAuthenticatedClient
                    ? 'Approve Quote & Launch in Client Portal'
                    : 'Submit Custom Quote Request'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                className="w-full py-2 px-4 text-xs font-semibold text-slate-600 hover:text-[#001E5A] border border-[#DCE6F2] bg-white rounded-lg transition-colors"
              >
                {submittedNotice ? 'Done / Close' : 'Cancel'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
