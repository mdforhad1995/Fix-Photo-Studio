import React, { useState, useEffect } from 'react';
import {
  UploadCloud,
  FileCheck2,
  X,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import {
  ServiceCategory,
  OutputFormat,
  BackgroundSpec,
} from '../types';
import { STUDIO_SERVICES } from '../data/studioCatalog';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: ServiceCategory;
  isAuthenticatedClient?: boolean;
  clientProfileData?: {
    name: string;
    email: string;
    phone: string;
    companyName: string;
  };
  onSubmitOrder: (payload: {
    projectTitle: string;
    serviceCategory: ServiceCategory;
    imageCount: number;
    turnaroundHours: number;
    outputFormat: OutputFormat;
    backgroundSpec: BackgroundSpec;
    instructions: string;
    totalPrice: number;
    uploadedBatchNames: string[];
    clientName?: string;
    clientEmail?: string;
    clientPhone?: string;
    companyName?: string;
  }) => Promise<void>;
}

type FileUploadStage = 'queued' | 'uploading' | 'verifying_icc' | 'completed';

interface BatchUploadFileItem {
  id: string;
  name: string;
  sizeLabel: string;
  progress: number;
  stage: FileUploadStage;
  speedLabel: string;
  colorProfile: string;
}

const formatByteSize = (bytes: number): string => {
  if (!bytes || bytes <= 0) return '0.5 MB';
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  const kb = Math.max(1, Math.round(bytes / 1024));
  return `${kb} KB`;
};

export const NewOrderModal: React.FC<NewOrderModalProps> = ({
  isOpen,
  onClose,
  initialService = 'clipping_path',
  isAuthenticatedClient = false,
  clientProfileData,
  onSubmitOrder,
}) => {
  const [division, setDivision] = useState<'photo_editing' | 'video_editing'>(
    'photo_editing'
  );
  const [guestName, setGuestName] = useState(clientProfileData?.name || '');
  const [guestEmail, setGuestEmail] = useState(clientProfileData?.email || '');
  const [guestPhone, setGuestPhone] = useState(clientProfileData?.phone || '');
  const [guestCompany, setGuestCompany] = useState(
    clientProfileData?.companyName || ''
  );
  const [projectTitle, setProjectTitle] = useState('');
  const [serviceSlug, setServiceSlug] = useState<string>(
    STUDIO_SERVICES[0].slug
  );
  const [imageCount, setImageCount] = useState<number>(25);
  const [turnaroundHours] = useState<number>(12);
  const [outputFormat] = useState<OutputFormat>('PSD_LAYERED');
  const [backgroundSpec] = useState<BackgroundSpec>('PURE_WHITE_FFFFFF');
  const [instructions, setInstructions] = useState('');
  const [uploadQueue, setUploadQueue] = useState<BatchUploadFileItem[]>([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [uploadLimitNotice, setUploadLimitNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isAuthenticatedClient && clientProfileData) {
      setGuestName(clientProfileData.name || '');
      setGuestEmail(clientProfileData.email || '');
      setGuestPhone(clientProfileData.phone || '');
      setGuestCompany(clientProfileData.companyName || '');
    }
  }, [isAuthenticatedClient, clientProfileData, isOpen]);

  useEffect(() => {
    if (isOpen && initialService) {
      const matched =
        STUDIO_SERVICES.find((s) => s.id === initialService) ||
        STUDIO_SERVICES[0];
      setDivision(matched.division);
      setServiceSlug(matched.slug);
    }
  }, [isOpen, initialService]);

  // Real-time per-file upload progress ticker for customer-selected files
  useEffect(() => {
    if (!isOpen) return;

    const hasActiveUploads = uploadQueue.some(
      (item) => item.stage !== 'completed'
    );
    if (!hasActiveUploads) return;

    const timer = window.setInterval(() => {
      setUploadQueue((prev) => {
        let activeSlotsUsed = 0;
        return prev.map((file) => {
          if (file.stage === 'completed') return file;

          if (activeSlotsUsed >= 2 && file.stage === 'queued') {
            return file;
          }
          activeSlotsUsed += 1;

          const stepIncrement =
            file.stage === 'queued'
              ? 18
              : file.progress < 75
              ? Math.floor(16 + (file.name.length % 9))
              : 18;

          const nextProgress = Math.min(100, file.progress + stepIncrement);
          const nextStage: FileUploadStage =
            nextProgress >= 100
              ? 'completed'
              : nextProgress >= 82
              ? 'verifying_icc'
              : 'uploading';

          return {
            ...file,
            progress: nextProgress,
            stage: nextStage,
          };
        });
      });
    }, 240);

    return () => window.clearInterval(timer);
  }, [isOpen, uploadQueue]);

  if (!isOpen) return null;

  const filteredServices = STUDIO_SERVICES.filter(
    (s) => s.division === division
  );
  const selectedServiceObj =
    STUDIO_SERVICES.find((s) => s.slug === serviceSlug) ||
    filteredServices[0] ||
    STUDIO_SERVICES[0];

  const rushMultiplier = 1.0;
  const formatAddon = 0;
  const unitPrice = Number(
    (selectedServiceObj.ratePerImage * rushMultiplier + formatAddon).toFixed(2)
  );
  const totalPrice = Number((unitPrice * imageCount).toFixed(2));

  // Aggregate Batch Upload Progress
  const totalFilesCount = uploadQueue.length;
  const completedFilesCount = uploadQueue.filter(
    (f) => f.stage === 'completed'
  ).length;
  const overallBatchProgress =
    totalFilesCount === 0
      ? 0
      : Math.round(
          uploadQueue.reduce((acc, item) => acc + item.progress, 0) /
            totalFilesCount
        );
  const isBatchUploading =
    totalFilesCount > 0 && completedFilesCount < totalFilesCount;

  const enqueueIncomingFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setUploadLimitNotice(null);

    const remainingSlots = Math.max(0, 10 - uploadQueue.length);
    if (remainingSlots === 0) {
      setUploadLimitNotice(
        'Maximum 10 files allowed in queue. Remove a file to upload another.'
      );
      return;
    }

    const incomingArray = Array.from(fileList);
    if (incomingArray.length > remainingSlots) {
      setUploadLimitNotice(
        `Up to 10 files allowed. Added ${remainingSlots} file(s).`
      );
    }

    const newEntries: BatchUploadFileItem[] = incomingArray
      .slice(0, remainingSlots)
      .map((f, idx) => {
        const ext = f.name.split('.').pop()?.toUpperCase() || 'RAW';
        return {
          id: `file_${Date.now()}_${idx}`,
          name: f.name.slice(0, 150),
          sizeLabel: formatByteSize(f.size),
          progress: idx === 0 ? 18 : 0,
          stage: idx === 0 ? 'uploading' : 'queued',
          speedLabel: `${(36 + ((idx * 5) % 14)).toFixed(1)} MB/s`,
          colorProfile:
            ext === 'MP4' || ext === 'MOV' || ext === 'MXF'
              ? '4K Rec.709 Stream'
              : ext === 'CR3' || ext === 'NEF' || ext === 'RAF'
              ? '16-Bit Camera RAW'
              : ext === 'PSD' || ext === 'TIFF'
              ? 'AdobeRGB 1998'
              : 'sRGB IEC61966-2.1',
        };
      });

    setUploadQueue((prev) => {
      const existingNames = new Set(prev.map((item) => item.name));
      const deduped = newEntries.filter((n) => !existingNames.has(n.name));
      const updated = [...prev, ...deduped].slice(0, 10);
      if (updated.length > 0) {
        setImageCount((curr) => Math.max(curr, updated.length));
      }
      return updated;
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    enqueueIncomingFiles(e.target.files);
    e.target.value = '';
  };

  const handleDropFiles = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    enqueueIncomingFiles(e.dataTransfer.files);
  };

  const handleRemoveFile = (id: string) => {
    setUploadLimitNotice(null);
    setUploadQueue((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const effectiveName = (
      isAuthenticatedClient && clientProfileData?.name
        ? clientProfileData.name
        : guestName
    ).trim();
    const effectiveEmail = (
      isAuthenticatedClient && clientProfileData?.email
        ? clientProfileData.email
        : guestEmail
    ).trim();
    const effectivePhone = (
      isAuthenticatedClient && clientProfileData?.phone
        ? clientProfileData.phone
        : guestPhone
    ).trim();
    const effectiveCompany = (
      isAuthenticatedClient && clientProfileData?.companyName
        ? clientProfileData.companyName
        : guestCompany
    ).trim();

    if (!isAuthenticatedClient) {
      if (effectiveName.length < 2 || !effectiveEmail.includes('@')) {
        setErrorMsg('Please enter your Full Name and Work Email to place an order.');
        return;
      }
      if (effectivePhone.length < 4) {
        setErrorMsg('Please enter your Phone / WhatsApp Number to place an order.');
        return;
      }
    }

    const finalTitle =
      projectTitle.trim() ||
      `${selectedServiceObj.shortNavTitle} Production Batch${
        effectiveCompany ? ` (${effectiveCompany})` : ''
      }`;

    setIsSubmitting(true);
    try {
      await onSubmitOrder({
        projectTitle: finalTitle.slice(0, 140),
        serviceCategory: selectedServiceObj.id,
        imageCount: Math.min(Math.max(1, imageCount), 10000),
        turnaroundHours,
        outputFormat,
        backgroundSpec,
        instructions:
          instructions.trim().slice(0, 2000) ||
          `Standard studio SOP for ${selectedServiceObj.shortNavTitle}.`,
        totalPrice,
        uploadedBatchNames: uploadQueue.map((item) => item.name).slice(0, 10),
        clientName: effectiveName || undefined,
        clientEmail: effectiveEmail || undefined,
        clientPhone: effectivePhone || undefined,
        companyName: effectiveCompany || undefined,
      });
      onClose();
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Unable to submit order.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00143D]/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-[#DCE6F2] rounded-2xl max-w-4xl w-full p-6 md:p-8 shadow-xl my-8">
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-[#DCE6F2]">
          <div>
            <p className="text-xs font-mono-tabular text-[#0088FF] font-semibold">
              ONLINE STUDIO ORDER · PHOTO & VIDEO PRODUCTION
            </p>
            <h2 className="text-xl font-bold text-[#001E5A] mt-1">
              Configure Online Order & Upload Your Files
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-[#001E5A] rounded-lg border border-[#DCE6F2] transition-colors"
            aria-label="Close order modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Left 7 Columns: Service Selection & Blank-By-Default Customer File Upload */}
          <div className="lg:col-span-7 space-y-4">
            {/* Division Tabs: 01. Photo Editing vs 02. Video Editing */}
            <div className="flex items-center gap-1.5 p-1 bg-[#EAF3FC] border border-[#DCE6F2] rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setDivision('photo_editing');
                  setServiceSlug('clipping-path-service');
                  setImageCount(25);
                }}
                className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-lg transition-colors ${
                  division === 'photo_editing'
                    ? 'bg-[#001E5A] text-white'
                    : 'text-[#001E5A] hover:bg-white/70'
                }`}
              >
                01. Photo Editing Order
              </button>
              <button
                type="button"
                onClick={() => {
                  setDivision('video_editing');
                  setServiceSlug('commercial-product-video-editing');
                  setImageCount(1);
                }}
                className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-lg transition-colors ${
                  division === 'video_editing'
                    ? 'bg-[#0088FF] text-white'
                    : 'text-[#001E5A] hover:bg-white/70'
                }`}
              >
                02. Video Editing Order
              </button>
            </div>

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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#F5F9FD] border border-[#DCE6F2]">
                <div>
                  <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Sarah Jenkins"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#B8D0EB] rounded-lg focus:outline-none focus:border-[#0088FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="sarah@retailbrand.com"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#B8D0EB] rounded-lg focus:outline-none focus:border-[#0088FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="+1 (212) 555-0194"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#B8D0EB] rounded-lg focus:outline-none focus:border-[#0088FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                    Company / Agency
                  </label>
                  <input
                    type="text"
                    value={guestCompany}
                    onChange={(e) => setGuestCompany(e.target.value)}
                    placeholder="Veloce Commerce"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#B8D0EB] rounded-lg focus:outline-none focus:border-[#0088FF]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#001E5A] mb-1.5">
                Project or Campaign Title
              </label>
              <input
                type="text"
                maxLength={140}
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-[#B8D0EB] rounded-lg focus:outline-none focus:border-[#0088FF]"
                placeholder={
                  division === 'video_editing'
                    ? 'e.g., 4K Product Spin & Social Reels Campaign'
                    : 'e.g., SS27 Footwear & Timepiece Catalog Batch'
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#001E5A] mb-1.5">
                  Select Service
                </label>
                <select
                  value={serviceSlug}
                  onChange={(e) => setServiceSlug(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#B8D0EB] rounded-lg bg-white focus:outline-none focus:border-[#0088FF]"
                >
                  {filteredServices.map((s) => (
                    <option key={s.slug} value={s.slug}>
                      {s.indexNumber} {s.shortNavTitle}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#001E5A] mb-1.5">
                  {division === 'video_editing'
                    ? 'Total Video Clips (1–500)'
                    : 'Total Batch Frame Count (1–10,000)'}
                </label>
                <input
                  type="number"
                  min={1}
                  max={10000}
                  value={imageCount}
                  onChange={(e) =>
                    setImageCount(Math.max(1, Number(e.target.value)))
                  }
                  className="w-full px-3.5 py-2 text-xs border border-[#B8D0EB] rounded-lg font-mono-tabular focus:outline-none focus:border-[#0088FF]"
                />
              </div>
            </div>

            {/* Customer File Upload Queue (Starts Normal Blank for Both Photo & Video) */}
            <div className="p-4 rounded-xl bg-[#F5F9FD] border border-[#DCE6F2] space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-[#0088FF]" />
                  <span className="text-xs font-bold text-[#001E5A]">
                    {division === 'video_editing'
                      ? `Upload Video Footage / Clips (${uploadQueue.length}/10 Files${
                          uploadQueue.length > 0
                            ? ` · ${overallBatchProgress}%`
                            : ''
                        })`
                      : `Upload Batch Files (${uploadQueue.length}/10 Files${
                          uploadQueue.length > 0
                            ? ` · ${overallBatchProgress}%`
                            : ''
                        })`}
                  </span>
                </div>

                <label
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors inline-flex items-center gap-1.5 ${
                    uploadQueue.length >= 10
                      ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                      : 'bg-[#0088FF] hover:bg-[#001E5A] text-white cursor-pointer'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>
                    {uploadQueue.length >= 10
                      ? 'Max 10 Files Added'
                      : division === 'video_editing'
                      ? 'Upload Video Clips'
                      : 'Upload Files'}
                  </span>
                  <input
                    type="file"
                    multiple
                    disabled={uploadQueue.length >= 10}
                    accept="image/*,video/*,.jpg,.jpeg,.png,.tif,.tiff,.psd,.cr2,.cr3,.nef,.raf,.arw,.dng,.mp4,.mov,.mxf,.avi,.mkv"
                    onChange={handleFileInput}
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
                  style={{ width: `${overallBatchProgress}%` }}
                />
              </div>

              {uploadQueue.length === 0 ? (
                <label
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingOver(true);
                  }}
                  onDragLeave={() => setIsDraggingOver(false)}
                  onDrop={handleDropFiles}
                  className={`flex flex-col items-center justify-center p-5 border border-dashed rounded-lg transition-colors cursor-pointer text-center ${
                    isDraggingOver
                      ? 'border-[#0088FF] bg-[#EAF3FC]'
                      : 'border-[#B8D0EB] bg-white hover:bg-[#EAF3FC]/50'
                  }`}
                >
                  <UploadCloud className="w-5 h-5 text-[#0088FF] mb-1.5" />
                  <span className="text-xs font-semibold text-[#001E5A]">
                    {division === 'video_editing'
                      ? 'Click to select or drag & drop your video clips (MP4, MOV, ProRes, RAW)'
                      : 'Click to select or drag & drop your files (RAW, PSD, TIFF, PNG, JPG)'}
                  </span>
                  <span className="text-[11px] text-slate-500 mt-0.5">
                    Select files from your device to attach to this order
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*,.jpg,.jpeg,.png,.tif,.tiff,.psd,.cr2,.cr3,.nef,.raf,.arw,.dng,.mp4,.mov,.mxf,.avi,.mkv"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {uploadQueue.map((item) => {
                    const isDone = item.stage === 'completed';
                    const isIcc = item.stage === 'verifying_icc';
                    const isQueued = item.stage === 'queued';

                    return (
                      <div
                        key={item.id}
                        className="p-2.5 bg-white border border-[#DCE6F2] rounded-lg space-y-1.5"
                      >
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-1.5 min-w-0">
                            {isDone ? (
                              <FileCheck2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            ) : (
                              <Loader2
                                className={`w-3.5 h-3.5 text-[#0088FF] shrink-0 ${
                                  isQueued ? '' : 'animate-spin'
                                }`}
                              />
                            )}
                            <span className="font-mono-tabular font-semibold text-[#001E5A] truncate">
                              {item.name}
                            </span>
                            <span className="text-[10px] font-mono-tabular text-slate-400 shrink-0">
                              ({item.sizeLabel})
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[11px] font-mono-tabular font-bold text-[#0088FF]">
                              {item.progress}%
                            </span>

                            <button
                              type="button"
                              onClick={() => handleRemoveFile(item.id)}
                              className="text-slate-400 hover:text-red-600 p-0.5 transition-colors"
                              aria-label={`Remove ${item.name}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="w-full h-1.5 bg-[#EAF3FC] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isDone
                                ? 'bg-emerald-500'
                                : isIcc
                                ? 'bg-[#00B8FF]'
                                : 'bg-[#0088FF]'
                            }`}
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#001E5A] mb-1.5">
                {division === 'video_editing'
                  ? 'Video Editing Brief & Style Guide Notes'
                  : 'Technical Retoucher Brief & Style Guide Notes'}
              </label>
              <textarea
                rows={2}
                maxLength={2000}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder={
                  division === 'video_editing'
                    ? 'Describe your video editing instructions (e.g., 4K Rec.709 color grade, rig removal, 9:16 social cuts, audio sync)...'
                    : 'Describe your retouching instructions (e.g., 0.25px feather Bezier path, pure white background, natural shadow)...'
                }
                className="w-full px-3.5 py-2 text-xs border border-[#B8D0EB] rounded-lg focus:outline-none focus:border-[#0088FF]"
              />
            </div>
          </div>

          {/* Right 5 Columns: Live Cost Breakdown & SLA Summary */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-[#F5F9FD] border border-[#DCE6F2] rounded-xl p-5">
            <div className="space-y-4">
              <div className="pb-3 border-b border-[#DCE6F2]">
                <p className="text-xs font-mono-tabular text-[#0088FF] font-semibold">
                  ORDER MANIFEST & SLA SUMMARY
                </p>
                <h3 className="text-base font-bold text-[#001E5A] mt-0.5">
                  {selectedServiceObj.title}
                </h3>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Base Service Rate</span>
                  <span className="font-mono-tabular font-medium text-[#001E5A]">
                    ${selectedServiceObj.ratePerImage.toFixed(2)} / image
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Turnaround SLA Multiplier ({turnaroundHours}h)</span>
                  <span className="font-mono-tabular font-medium text-[#001E5A]">
                    {rushMultiplier}x
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Output Format ({outputFormat})</span>
                  <span className="font-mono-tabular font-medium text-[#001E5A]">
                    +${formatAddon.toFixed(2)} / image
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Effective Unit Rate</span>
                  <span className="font-mono-tabular font-semibold text-[#001E5A]">
                    ${unitPrice.toFixed(2)} / image
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Total Frame Quantity</span>
                  <span className="font-mono-tabular font-semibold text-[#001E5A]">
                    {imageCount.toLocaleString()} frames
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Batch Upload Status</span>
                  <span className="font-mono-tabular font-semibold text-[#0088FF]">
                    {completedFilesCount}/{totalFilesCount} Files ({overallBatchProgress}%)
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#DCE6F2]">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-semibold text-[#001E5A]">
                    Estimated Total
                  </span>
                  <span className="text-2xl font-bold font-mono-tabular text-[#001E5A]">
                    $
                    {totalPrice.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Automatically deducts from active subscription credits or issues an instant payment confirmation receipt.
                </p>
              </div>

              <div className="p-3 bg-white border border-[#DCE6F2] rounded-lg space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2 text-[#001E5A] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#0088FF] shrink-0" />
                  <span>Guaranteed Dual-Stage 400% Zoom QA</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Every frame undergoes primary senior retouching followed by an independent lead quality check before delivery archive encryption.
                </p>
              </div>

              {errorMsg && (
                <p className="text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {errorMsg}
                </p>
              )}
            </div>

            <div className="pt-6 space-y-2.5">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-gradient-to-r from-[#001E5A] to-[#0088FF] hover:from-[#00143D] hover:to-[#006FE0] rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
              >
                <span>
                  {isSubmitting
                    ? 'Encrypting & Dispatching Order...'
                    : isBatchUploading
                    ? `Submit Order (${overallBatchProgress}% Uploaded)`
                    : 'Submit Order & Generate Receipt'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 px-4 text-xs font-medium text-slate-600 hover:text-[#001E5A] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
