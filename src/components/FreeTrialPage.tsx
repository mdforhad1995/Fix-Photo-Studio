import React, { useState, useEffect } from 'react';
import {
  UploadCloud,
  CheckCircle2,
  ArrowRight,
  Clock,
  ShieldCheck,
  FileCheck2,
  Loader2,
  Trash2,
  Plus,
  X,
} from 'lucide-react';
import {
  ServiceCategory,
  OutputFormat,
  BackgroundSpec,
} from '../types';
import { ServiceDefinition } from '../data/studioCatalog';

interface FreeTrialPageProps {
  isOpen?: boolean;
  onClose?: () => void;
  services: ServiceDefinition[];
  isAuthenticatedClient?: boolean;
  onSubmitTrialOrder: (payload: {
    projectTitle: string;
    serviceCategory: ServiceCategory;
    imageCount: number;
    turnaroundHours: number;
    outputFormat: OutputFormat;
    backgroundSpec: BackgroundSpec;
    instructions: string;
    totalPrice: number;
    uploadedBatchNames: string[];
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
  }) => Promise<{ queryNumber: string }>;
  onExploreService?: (slug: string) => void;
  onBackToHome?: () => void;
}

interface TrialUploadFile {
  id: string;
  name: string;
  sizeLabel: string;
  progress: number;
  done: boolean;
}

export const FreeTrialPage: React.FC<FreeTrialPageProps> = ({
  isOpen = true,
  onClose,
  services,
  isAuthenticatedClient = false,
  onSubmitTrialOrder,
  onSubmitPublicQuery,
  onExploreService,
  onBackToHome,
}) => {
  const [division, setDivision] = useState<'photo_editing' | 'video_editing'>(
    'photo_editing'
  );
  const [selectedSlug, setSelectedSlug] = useState<string>(
    'clipping-path-service'
  );
  const [fullName, setFullName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [trialCount, setTrialCount] = useState<number>(5);
  const [outputFormat] = useState<OutputFormat>('PSD_LAYERED');
  const [backgroundSpec] = useState<BackgroundSpec>('PURE_WHITE_FFFFFF');
  const [turnaroundHours] = useState<number>(12);
  const [instructions, setInstructions] = useState('');

  const [trialFiles, setTrialFiles] = useState<TrialUploadFile[]>([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [uploadLimitNotice, setUploadLimitNotice] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedNotice, setSubmittedNotice] = useState<{
    queryNumber: string;
    clientName: string;
    clientEmail: string;
    serviceTitle: string;
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

  // Real-time progress bar animation for customer-uploaded trial files
  useEffect(() => {
    if (!isOpen) return;
    const hasPending = trialFiles.some((f) => !f.done);
    if (!hasPending) return;

    const timer = window.setInterval(() => {
      setTrialFiles((prev) =>
        prev.map((f) => {
          if (f.done) return f;
          const next = Math.min(100, f.progress + 20);
          return {
            ...f,
            progress: next,
            done: next >= 100,
          };
        })
      );
    }, 220);

    return () => window.clearInterval(timer);
  }, [trialFiles, isOpen]);

  if (!isOpen) return null;

  const filteredServices = services.filter((s) => s.division === division);
  const activeServiceObj =
    services.find((s) => s.slug === selectedSlug) || services[0];

  const maxAllowedFiles = 5;

  const overallProgress =
    trialFiles.length === 0
      ? 0
      : Math.round(
          trialFiles.reduce((acc, f) => acc + f.progress, 0) / trialFiles.length
        );

  const addCustomerFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setUploadLimitNotice(null);

    const remainingSlots = Math.max(0, maxAllowedFiles - trialFiles.length);
    if (remainingSlots === 0) {
      setUploadLimitNotice(
        'Maximum 5 files allowed. Remove a file to upload another.'
      );
      return;
    }

    const incomingArray = Array.from(fileList);
    if (incomingArray.length > remainingSlots) {
      setUploadLimitNotice(
        `Up to 5 files allowed. Added ${remainingSlots} file(s).`
      );
    }

    const incoming: TrialUploadFile[] = incomingArray
      .slice(0, remainingSlots)
      .map((f, idx) => ({
        id: `tr_up_${Date.now()}_${idx}`,
        name: f.name.slice(0, 120),
        sizeLabel: `${Math.max(0.1, Number((f.size / (1024 * 1024)).toFixed(1)))} MB`,
        progress: 18,
        done: false,
      }));

    setTrialFiles((prev) => {
      const updated = [...prev, ...incoming].slice(0, maxAllowedFiles);
      setTrialCount(Math.min(maxAllowedFiles, Math.max(1, updated.length)));
      return updated;
    });
  };

  const handleSelectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    addCustomerFiles(e.target.files);
    e.target.value = '';
  };

  const handleDropFiles = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    addCustomerFiles(e.dataTransfer.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (fullName.trim().length < 2 || !workEmail.includes('@')) {
      setErrorMsg('Please enter your full name and a valid work email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const sampleFileNames = trialFiles.map((f) => f.name);

      let qNum = `FPS-QRY-${Math.floor(1000 + Math.random() * 9000)}`;
      if (onSubmitPublicQuery) {
        const res = await onSubmitPublicQuery({
          clientName: fullName.trim(),
          clientEmail: workEmail.trim(),
          clientPhone: phoneNumber.trim(),
          companyName: companyName.trim(),
          serviceTitle: activeServiceObj.shortNavTitle,
          serviceSlug: activeServiceObj.slug,
          instructions:
            instructions.trim() ||
            `Free ${division === 'video_editing' ? 'Video Editing' : 'Photo Editing'} Trial request for ${activeServiceObj.shortNavTitle}.`,
          sampleFiles: sampleFileNames,
        });
        qNum = res.queryNumber;
      }

      if (isAuthenticatedClient) {
        await onSubmitTrialOrder({
          projectTitle: `FREE ${
            division === 'video_editing' ? 'VIDEO' : '5-IMAGE'
          } TRIAL (${qNum}) — ${activeServiceObj.shortNavTitle} · ${
            companyName.trim() || fullName.trim()
          }`,
          serviceCategory: activeServiceObj.id,
          imageCount: Math.min(5, Math.max(1, trialCount)),
          turnaroundHours,
          outputFormat,
          backgroundSpec,
          instructions: `[FREE TRIAL · ${fullName.trim()} <${workEmail.trim()}>${
            phoneNumber.trim() ? ` · Tel: ${phoneNumber.trim()}` : ''
          }] ${
            instructions.trim() ||
            `Complimentary trial for ${activeServiceObj.shortNavTitle}.`
          }`,
          totalPrice: 0,
          uploadedBatchNames: sampleFileNames,
        });
        handleDismiss();
      } else {
        setSubmittedNotice({
          queryNumber: qNum,
          clientName: fullName.trim(),
          clientEmail: workEmail.trim(),
          serviceTitle: activeServiceObj.shortNavTitle,
        });
      }
    } catch {
      setErrorMsg('Unable to submit trial request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00143D]/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-[#DCE6F2] rounded-2xl max-w-4xl w-full p-6 md:p-8 shadow-xl my-8">
        {/* Top Modal Header */}
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-[#DCE6F2]">
          <div>
            <p className="text-xs font-mono-tabular text-[#0088FF] font-semibold">
              COMPLIMENTARY 5-FILE STUDIO QUALITY TEST · $0.00 · NO CREDIT CARD REQUIRED
            </p>
            <h2 className="text-xl font-bold text-[#001E5A] mt-1">
              Claim Your Free 5-Image / 1-Clip Studio Trial
            </h2>
          </div>
          <button
            type="button"
            onClick={handleDismiss}
            className="p-2 text-slate-500 hover:text-[#001E5A] rounded-lg border border-[#DCE6F2] transition-colors"
            aria-label="Close Free Trial popup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Left 7 Columns: Contact, Service Selection & Blank-By-Default Customer File Upload */}
          <div className="lg:col-span-7 space-y-4">
            {/* Division Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-[#EAF3FC] border border-[#DCE6F2] rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setDivision('photo_editing');
                  setSelectedSlug('clipping-path-service');
                  setTrialCount(5);
                }}
                className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-lg transition-colors ${
                  division === 'photo_editing'
                    ? 'bg-[#001E5A] text-white'
                    : 'text-[#001E5A] hover:bg-white/70'
                }`}
              >
                01. Photo Editing Trial (Up to 5 RAWs)
              </button>
              <button
                type="button"
                onClick={() => {
                  setDivision('video_editing');
                  setSelectedSlug('commercial-product-video-editing');
                  setTrialCount(1);
                }}
                className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-lg transition-colors ${
                  division === 'video_editing'
                    ? 'bg-[#0088FF] text-white'
                    : 'text-[#001E5A] hover:bg-white/70'
                }`}
              >
                02. Video Editing Trial (1 Sample Clip)
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alex Rivera"
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
                  placeholder="alex@brandstudio.com"
                  className="w-full px-3 py-2 text-xs border border-[#B8D0EB] rounded-lg focus:outline-none focus:border-[#0088FF]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                  Phone / WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 (212) 555-0194"
                  className="w-full px-3 py-2 text-xs border border-[#B8D0EB] rounded-lg focus:outline-none focus:border-[#0088FF]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                  Studio / Brand Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Atelier Nord"
                  className="w-full px-3 py-2 text-xs border border-[#B8D0EB] rounded-lg focus:outline-none focus:border-[#0088FF]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                  Select Service to Test
                </label>
                <select
                  value={selectedSlug}
                  onChange={(e) => setSelectedSlug(e.target.value)}
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
                <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                  {division === 'video_editing'
                    ? 'Sample Clips (1–5)'
                    : 'Trial Frame Count (1–5)'}
                </label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={trialCount}
                  onChange={(e) =>
                    setTrialCount(Math.min(5, Math.max(1, Number(e.target.value))))
                  }
                  className="w-full px-3 py-2 text-xs font-mono-tabular border border-[#B8D0EB] rounded-lg focus:outline-none focus:border-[#0088FF]"
                />
              </div>
            </div>

            {/* Customer File Upload Queue (Starts Normal Blank for Both Photo & Video Trials) */}
            <div className="p-4 rounded-xl bg-[#F5F9FD] border border-[#DCE6F2] space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-[#0088FF]" />
                  <span className="text-xs font-bold text-[#001E5A]">
                    {division === 'video_editing'
                      ? `Upload Sample Video Clip (${trialFiles.length}/5 Files${
                          trialFiles.length > 0 ? ` · ${overallProgress}%` : ''
                        })`
                      : `Upload Sample Images (${trialFiles.length}/5 Files${
                          trialFiles.length > 0 ? ` · ${overallProgress}%` : ''
                        })`}
                  </span>
                </div>
                <label
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors inline-flex items-center gap-1.5 ${
                    trialFiles.length >= maxAllowedFiles
                      ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                      : 'bg-[#0088FF] hover:bg-[#001E5A] text-white cursor-pointer'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>
                    {trialFiles.length >= maxAllowedFiles
                      ? 'Max 5 Files Added'
                      : division === 'video_editing'
                      ? 'Upload Video Clip'
                      : 'Upload Sample Files'}
                  </span>
                  <input
                    type="file"
                    multiple
                    disabled={trialFiles.length >= maxAllowedFiles}
                    accept={
                      division === 'video_editing'
                        ? 'video/*,.mp4,.mov,.mxf,.avi,.mkv,.prproj,.drp,image/*,.raw,.cr2,.cr3,.nef,.raf,.dng,.psd,.tif,.tiff'
                        : 'image/*,.raw,.cr2,.cr3,.nef,.raf,.dng,.psd,.tif,.tiff,video/*,.mp4,.mov'
                    }
                    onChange={handleSelectFiles}
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
                  style={{ width: `${overallProgress}%` }}
                />
              </div>

              {trialFiles.length === 0 ? (
                <label
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingOver(true);
                  }}
                  onDragLeave={() => setIsDraggingOver(false)}
                  onDrop={handleDropFiles}
                  className={`flex flex-col items-center justify-center gap-1.5 py-5 px-4 rounded-lg border border-dashed cursor-pointer transition-colors text-center ${
                    isDraggingOver
                      ? 'border-[#0088FF] bg-[#EAF3FC]'
                      : 'border-[#B8D0EB] bg-white hover:bg-[#EAF3FC]/50'
                  }`}
                >
                  <UploadCloud className="w-5 h-5 text-[#0088FF]" />
                  <span className="text-xs font-semibold text-[#001E5A]">
                    {division === 'video_editing'
                      ? 'Click to select or drag & drop your sample video clip (MP4, MOV, ProRes, RAW)'
                      : 'Click to select or drag & drop up to 5 sample images (RAW, PSD, TIFF, PNG, JPG)'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {division === 'video_editing'
                      ? 'Upload your raw camera footage or sample clip for our 4K video editing pod'
                      : 'Upload your own photos from your computer to start your free studio quality test'}
                  </span>
                  <input
                    type="file"
                    multiple
                    accept={
                      division === 'video_editing'
                        ? 'video/*,.mp4,.mov,.mxf,.avi,.mkv,.prproj,.drp,image/*,.raw,.cr2,.cr3,.nef,.raf,.dng,.psd,.tif,.tiff'
                        : 'image/*,.raw,.cr2,.cr3,.nef,.raf,.dng,.psd,.tif,.tiff,video/*,.mp4,.mov'
                    }
                    onChange={handleSelectFiles}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {trialFiles.map((file) => (
                    <div
                      key={file.id}
                      className="p-2.5 bg-white border border-[#DCE6F2] rounded-lg space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-1.5 min-w-0">
                          {file.done ? (
                            <FileCheck2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          ) : (
                            <Loader2 className="w-3.5 h-3.5 text-[#0088FF] animate-spin shrink-0" />
                          )}
                          <span className="font-mono-tabular font-semibold text-[#001E5A] truncate">
                            {file.name}
                          </span>
                          <span className="text-[10px] font-mono-tabular text-slate-400 shrink-0">
                            ({file.sizeLabel})
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[11px] font-mono-tabular text-[#0088FF] font-bold">
                            {file.progress}%
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setUploadLimitNotice(null);
                              setTrialFiles((prev) =>
                                prev.filter((item) => item.id !== file.id)
                              );
                            }}
                            className="text-slate-400 hover:text-red-600"
                            aria-label={`Remove ${file.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-[#EAF3FC] rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            file.done ? 'bg-emerald-500' : 'bg-[#0088FF]'
                          }`}
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#001E5A] mb-1">
                {division === 'video_editing'
                  ? 'Video Editing Brief & Color / Cut Instructions'
                  : 'Retouching Brief & Layer Instructions'}
              </label>
              <textarea
                rows={2}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder={
                  division === 'video_editing'
                    ? 'Describe your video editing instructions (e.g., 4K Rec.709 color grade, rig removal, 9:16 social reel cut, beat sync)...'
                    : 'Describe your retouching instructions (e.g., pure white #FFFFFF background, natural shadow layer, unflattened PSD)...'
                }
                className="w-full px-3 py-2 text-xs border border-[#B8D0EB] rounded-lg focus:outline-none focus:border-[#0088FF]"
              />
            </div>
          </div>

          {/* Right 5 Columns: $0.00 Free Trial Summary & Instant Portal Activation */}
          <div className="lg:col-span-5 bg-[#F5F9FD] border border-[#DCE6F2] rounded-xl p-5 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#DCE6F2] pb-3">
                <span className="text-xs font-mono-tabular font-bold text-[#0088FF]">
                  FREE TRIAL SPECIFICATION
                </span>
                <span className="px-2 py-0.5 text-[11px] font-mono-tabular font-bold bg-emerald-100 text-emerald-800 rounded">
                  100% FREE ($0.00)
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Selected Pod</span>
                  <span className="font-bold text-[#001E5A]">
                    {activeServiceObj.shortNavTitle}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Trial Allowance</span>
                  <span className="font-mono-tabular font-semibold text-[#001E5A]">
                    {division === 'video_editing'
                      ? `${trialCount} Free Sample Clip${trialCount > 1 ? 's' : ''}`
                      : `${trialCount} Free Test Files`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Turnaround SLA</span>
                  <span className="font-mono-tabular font-semibold text-[#0088FF]">
                    {division === 'video_editing'
                      ? '12 Hours Guaranteed'
                      : `${turnaroundHours} Hours Guaranteed`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Master Deliverable</span>
                  <span className="font-mono-tabular font-semibold text-[#001E5A]">
                    {division === 'video_editing'
                      ? '4K MP4 / PRORES'
                      : outputFormat.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Uploaded Customer Files</span>
                  <span className="font-mono-tabular font-semibold text-[#0088FF]">
                    {trialFiles.length} / {maxAllowedFiles} Files ({overallProgress}%)
                  </span>
                </div>

                <div className="pt-3 border-t border-[#DCE6F2] flex items-baseline justify-between">
                  <span className="text-sm font-bold text-[#001E5A]">
                    Total Trial Cost
                  </span>
                  <span className="text-2xl font-bold font-mono-tabular text-emerald-600">
                    $0.00 USD
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#DCE6F2] space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2 font-semibold text-[#001E5A]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>
                    {division === 'video_editing'
                      ? '4K 60fps Rec.709 Grading & VFX Rotoscoping'
                      : '100% Hand-Crafted Pen Tool & Layer Masks'}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-semibold text-[#001E5A]">
                  <Clock className="w-3.5 h-3.5 text-[#0088FF] shrink-0" />
                  <span>Instant Confirmation Email Sent to Your Inbox</span>
                </div>
                <div className="flex items-center gap-2 font-semibold text-[#001E5A]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0088FF] shrink-0" />
                  <span>Strict NDA & Zero Public Portfolio Use</span>
                </div>
              </div>

              {onExploreService && (
                <button
                  type="button"
                  onClick={() => {
                    handleDismiss();
                    onExploreService(activeServiceObj.slug);
                  }}
                  className="text-xs font-semibold text-[#0088FF] hover:underline flex items-center gap-1"
                >
                  <span>Inspect {activeServiceObj.shortNavTitle} Service Page</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
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
                    Thank you, <strong>{submittedNotice.clientName}</strong>! Your free trial query (
                    <span className="font-mono-tabular font-semibold">{submittedNotice.queryNumber}</span>
                    ) for <strong>{submittedNotice.serviceTitle}</strong> has been received. A confirmation email has been sent to{' '}
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
                    ? 'Submitting Free Trial Query...'
                    : isAuthenticatedClient
                    ? division === 'video_editing'
                      ? 'Submit Free Video Trial & Open Portal'
                      : 'Submit Free 5-File Trial & Open Portal'
                    : division === 'video_editing'
                    ? 'Submit Free Video Trial'
                    : 'Submit Free 5-File Trial'}
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
