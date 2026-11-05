import React, { useState, useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  Quote,
  Code,
  RotateCcw,
  RotateCw,
  Eraser,
  Minus,
  Type,
  Palette,
  Highlighter,
  Check,
  X,
  UploadCloud,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (nextHtml: string) => void;
  placeholder?: string;
  minHeight?: string;
  label?: string;
}

const FONT_FAMILIES = [
  { label: 'Default Sans (Inter)', value: 'Inter, system-ui, sans-serif' },
  { label: 'Georgia (Editorial Serif)', value: 'Georgia, Cambria, serif' },
  { label: 'Playfair / Luxury Serif', value: '"Playfair Display", Georgia, serif' },
  { label: 'Arial / Helvetica', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Verdana / Clean', value: 'Verdana, Geneva, sans-serif' },
  { label: 'Trebuchet MS', value: '"Trebuchet MS", sans-serif' },
  { label: 'Monospace / Technical', value: '"JetBrains Mono", monospace' },
];

const FONT_SIZES = [
  { label: '12px (Small)', execVal: '2', cssPx: '12px' },
  { label: '14px (Normal)', execVal: '3', cssPx: '14px' },
  { label: '16px (Medium)', execVal: '4', cssPx: '16px' },
  { label: '18px (Large)', execVal: '5', cssPx: '18px' },
  { label: '22px (Subheading)', execVal: '6', cssPx: '22px' },
  { label: '28px (Title)', execVal: '7', cssPx: '28px' },
];

const COLOR_SWATCHES = [
  '#001E5A',
  '#0088FF',
  '#0F172A',
  '#475569',
  '#059669',
  '#DC2626',
  '#D97706',
  '#7C3AED',
];

export function isRichHtmlContent(text: string): boolean {
  if (!text) return false;
  return /<\/?(p|div|span|h[1-6]|strong|b|em|i|u|s|strike|ul|ol|li|a|blockquote|pre|code|font|img|hr|br)\b/i.test(
    text
  );
}

export function plainTextToHtml(text: string): string {
  if (!text) return '';
  if (isRichHtmlContent(text)) return text;
  return text
    .split(/\n\n+/)
    .map((para) => `<p>${para.replace(/\n/g, '<br/>')}</p>`)
    .join('');
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write and format your content here...',
  minHeight = '220px',
  label,
}) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const savedSelectionRef = useRef<Range | null>(null);

  const [sourceMode, setSourceMode] = useState(false);
  const [selectedFont, setSelectedFont] = useState(FONT_FAMILIES[0].value);
  const [selectedSize, setSelectedSize] = useState('3');
  const [textColor, setTextColor] = useState('#001E5A');
  const [highlightColor, setHighlightColor] = useState('#FEF08A');

  // Inline Link Popover State (no window.prompt)
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('https://');
  const [linkText, setLinkText] = useState('');
  const [linkNewTab, setLinkNewTab] = useState(true);

  // Inline Image Popover State
  const [showImageInput, setShowImageInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');

  // Keep editor DOM synced when value changes externally (e.g. switching items)
  useEffect(() => {
    const el = editorRef.current;
    if (!el || sourceMode) return;
    const normalized = plainTextToHtml(value);
    if (el.innerHTML !== normalized && document.activeElement !== el) {
      el.innerHTML = normalized;
    }
  }, [value, sourceMode]);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelectionRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    const sel = window.getSelection();
    if (sel && savedSelectionRef.current) {
      sel.removeAllRanges();
      sel.addRange(savedSelectionRef.current);
    }
  };

  const emitChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const runCmd = (command: string, arg?: string) => {
    if (sourceMode) return;
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    restoreSelection();
    document.execCommand(command, false, arg);
    saveSelection();
    emitChange();
  };

  const handleInsertLink = () => {
    if (!linkUrl.trim()) return;
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    restoreSelection();

    const cleanUrl =
      linkUrl.startsWith('http://') ||
      linkUrl.startsWith('https://') ||
      linkUrl.startsWith('mailto:') ||
      linkUrl.startsWith('#') ||
      linkUrl.startsWith('/')
        ? linkUrl.trim()
        : `https://${linkUrl.trim()}`;

    const sel = window.getSelection();
    const hasSelectedText = sel && sel.toString().trim().length > 0;
    const anchorLabel =
      linkText.trim() || (hasSelectedText ? sel!.toString() : cleanUrl);
    const targetAttr = linkNewTab
      ? ' target="_blank" rel="noopener noreferrer"'
      : '';

    const anchorHtml = `<a href="${cleanUrl}"${targetAttr} style="color:#0088FF;text-decoration:underline;font-weight:600;">${anchorLabel}</a>`;
    document.execCommand('insertHTML', false, anchorHtml);
    saveSelection();
    emitChange();

    setShowLinkInput(false);
    setLinkUrl('https://');
    setLinkText('');
  };

  const handleInsertImageHtml = (src: string, altText?: string) => {
    if (!src) return;
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    restoreSelection();
    const safeAlt = (altText || 'Studio Image').replace(/"/g, '&quot;');
    const imgHtml = `<p><img src="${src}" alt="${safeAlt}" style="max-width:100%;height:auto;border-radius:12px;margin:10px 0;border:1px solid #DCE6F2;" /></p>`;
    document.execCommand('insertHTML', false, imgHtml);
    saveSelection();
    emitChange();
    setShowImageInput(false);
    setImageUrl('');
    setImageAlt('');
  };

  const handleImageFileUpload = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        handleInsertImageHtml(reader.result, file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold text-[#001E5A]">
          {label}
        </label>
      )}

      <div className="rounded-xl border border-slate-300 bg-white overflow-hidden shadow-2xs focus-within:border-[#0088FF] focus-within:ring-2 focus-within:ring-[#0088FF]/15 transition-all">
        {/* TOP TOOLBAR ROW 1: Typography, Font Family, Font Size, Headings */}
        <div className="bg-[#F8FAFC] border-b border-slate-200 px-2.5 py-2 flex flex-wrap items-center gap-1.5">
          {/* Block Heading / Format Selector */}
          <select
            onChange={(e) => {
              const val = e.target.value;
              if (val) runCmd('formatBlock', val);
            }}
            defaultValue="P"
            title="Paragraph / Heading Style"
            className="px-2 py-1 text-xs font-semibold text-[#001E5A] bg-white border border-slate-300 rounded-md hover:border-[#0088FF] focus:outline-none"
          >
            <option value="P">Normal Paragraph</option>
            <option value="H1">Heading 1 (H1 Large)</option>
            <option value="H2">Heading 2 (H2 Section)</option>
            <option value="H3">Heading 3 (H3 Subtitle)</option>
            <option value="H4">Heading 4 (H4 Small)</option>
            <option value="BLOCKQUOTE">Blockquote / Callout</option>
            <option value="PRE">Code / Preformatted</option>
          </select>

          {/* Font Family Selector */}
          <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-md px-1.5 py-0.5">
            <Type className="w-3.5 h-3.5 text-[#0088FF] shrink-0" />
            <select
              value={selectedFont}
              onChange={(e) => {
                setSelectedFont(e.target.value);
                runCmd('fontName', e.target.value);
              }}
              title="Font Family"
              className="text-xs text-[#001E5A] bg-transparent py-0.5 focus:outline-none max-w-[140px]"
            >
              {FONT_FAMILIES.map((f) => (
                <option key={f.label} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          {/* Font Size Selector */}
          <select
            value={selectedSize}
            onChange={(e) => {
              setSelectedSize(e.target.value);
              runCmd('fontSize', e.target.value);
            }}
            title="Font Size"
            className="px-2 py-1 text-xs font-mono-tabular font-semibold text-[#001E5A] bg-white border border-slate-300 rounded-md hover:border-[#0088FF] focus:outline-none"
          >
            {FONT_SIZES.map((s) => (
              <option key={s.execVal} value={s.execVal}>
                {s.label}
              </option>
            ))}
          </select>

          <span className="h-4 w-[1px] bg-slate-300 mx-0.5" />

          {/* Bold, Italic, Underline, Strike */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              runCmd('bold');
            }}
            title="Bold (Ctrl+B)"
            className="p-1.5 rounded hover:bg-[#EAF3FC] text-[#001E5A] transition-colors"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              runCmd('italic');
            }}
            title="Italic (Ctrl+I)"
            className="p-1.5 rounded hover:bg-[#EAF3FC] text-[#001E5A] transition-colors"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              runCmd('underline');
            }}
            title="Underline (Ctrl+U)"
            className="p-1.5 rounded hover:bg-[#EAF3FC] text-[#001E5A] transition-colors"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              runCmd('strikeThrough');
            }}
            title="Strikethrough"
            className="p-1.5 rounded hover:bg-[#EAF3FC] text-[#001E5A] transition-colors"
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </button>

          <span className="h-4 w-[1px] bg-slate-300 mx-0.5" />

          {/* Text Color Picker + Quick Swatches */}
          <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-md px-1.5 py-0.5">
            <Palette className="w-3.5 h-3.5 text-[#0088FF]" />
            <input
              type="color"
              value={textColor}
              onChange={(e) => {
                setTextColor(e.target.value);
                runCmd('foreColor', e.target.value);
              }}
              title="Text Color"
              className="w-5 h-5 border-0 p-0 bg-transparent cursor-pointer"
            />
            <div className="hidden sm:flex items-center gap-0.5 pl-0.5">
              {COLOR_SWATCHES.slice(0, 5).map((hex) => (
                <button
                  key={hex}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setTextColor(hex);
                    runCmd('foreColor', hex);
                  }}
                  style={{ backgroundColor: hex }}
                  className="w-3.5 h-3.5 rounded-full border border-white shadow-2xs"
                  title={`Color ${hex}`}
                />
              ))}
            </div>
          </div>

          {/* Highlight / Background Color */}
          <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-md px-1.5 py-0.5">
            <Highlighter className="w-3.5 h-3.5 text-amber-500" />
            <input
              type="color"
              value={highlightColor}
              onChange={(e) => {
                setHighlightColor(e.target.value);
                runCmd('hiliteColor', e.target.value);
              }}
              title="Highlight Background Color"
              className="w-5 h-5 border-0 p-0 bg-transparent cursor-pointer"
            />
          </div>
        </div>

        {/* TOP TOOLBAR ROW 2: Alignment, Lists, Links, Images, Quote, Clear, Source Code */}
        <div className="bg-[#F1F5F9] border-b border-slate-200 px-2.5 py-1.5 flex flex-wrap items-center justify-between gap-1.5">
          <div className="flex flex-wrap items-center gap-1">
            {/* Alignment */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                runCmd('justifyLeft');
              }}
              title="Align Left"
              className="p-1.5 rounded hover:bg-white text-[#001E5A] transition-colors"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                runCmd('justifyCenter');
              }}
              title="Align Center"
              className="p-1.5 rounded hover:bg-white text-[#001E5A] transition-colors"
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                runCmd('justifyRight');
              }}
              title="Align Right"
              className="p-1.5 rounded hover:bg-white text-[#001E5A] transition-colors"
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                runCmd('justifyFull');
              }}
              title="Justify Full"
              className="p-1.5 rounded hover:bg-white text-[#001E5A] transition-colors"
            >
              <AlignJustify className="w-3.5 h-3.5" />
            </button>

            <span className="h-4 w-[1px] bg-slate-300 mx-0.5" />

            {/* Lists */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                runCmd('insertUnorderedList');
              }}
              title="Bullet List"
              className="p-1.5 rounded hover:bg-white text-[#001E5A] transition-colors"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                runCmd('insertOrderedList');
              }}
              title="Numbered List"
              className="p-1.5 rounded hover:bg-white text-[#001E5A] transition-colors"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>

            <span className="h-4 w-[1px] bg-slate-300 mx-0.5" />

            {/* Insert Link */}
            <button
              type="button"
              onClick={() => {
                saveSelection();
                const sel = window.getSelection();
                if (sel && sel.toString().trim()) {
                  setLinkText(sel.toString().trim());
                }
                setShowLinkInput((prev) => !prev);
                setShowImageInput(false);
              }}
              title="Insert Hyperlink"
              className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
                showLinkInput
                  ? 'bg-[#0088FF] text-white'
                  : 'bg-white hover:bg-[#EAF3FC] text-[#001E5A] border border-slate-200'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Link</span>
            </button>

            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                runCmd('unlink');
              }}
              title="Remove Link"
              className="p-1.5 rounded hover:bg-white text-slate-600 transition-colors"
            >
              <Unlink className="w-3.5 h-3.5" />
            </button>

            {/* Insert Image */}
            <button
              type="button"
              onClick={() => {
                saveSelection();
                setShowImageInput((prev) => !prev);
                setShowLinkInput(false);
              }}
              title="Insert Image inside Content"
              className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
                showImageInput
                  ? 'bg-[#0088FF] text-white'
                  : 'bg-white hover:bg-[#EAF3FC] text-[#001E5A] border border-slate-200'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Image</span>
            </button>

            {/* Quote Block */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                runCmd('formatBlock', 'BLOCKQUOTE');
              }}
              title="Quote / Callout Block"
              className="p-1.5 rounded hover:bg-white text-[#001E5A] transition-colors"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>

            {/* Horizontal Line */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                runCmd('insertHorizontalRule');
              }}
              title="Insert Horizontal Divider"
              className="p-1.5 rounded hover:bg-white text-[#001E5A] transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            <span className="h-4 w-[1px] bg-slate-300 mx-0.5" />

            {/* Undo / Redo / Clear Formatting */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                runCmd('undo');
              }}
              title="Undo"
              className="p-1.5 rounded hover:bg-white text-slate-600 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                runCmd('redo');
              }}
              title="Redo"
              className="p-1.5 rounded hover:bg-white text-slate-600 transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                runCmd('removeFormat');
              }}
              title="Clear Formatting"
              className="p-1.5 rounded hover:bg-white text-red-600 transition-colors"
            >
              <Eraser className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Toggle Visual Editor vs HTML Code */}
          <button
            type="button"
            onClick={() => setSourceMode((prev) => !prev)}
            className={`px-2.5 py-1 rounded text-[11px] font-mono-tabular font-bold flex items-center gap-1 transition-colors ${
              sourceMode
                ? 'bg-[#001E5A] text-white'
                : 'bg-white text-slate-600 hover:text-[#001E5A] border border-slate-300'
            }`}
          >
            <Code className="w-3 h-3" />
            <span>{sourceMode ? 'Visual Editor' : 'HTML Source'}</span>
          </button>
        </div>

        {/* INLINE LINK INSERTION BAR */}
        {showLinkInput && (
          <div className="bg-blue-50/90 border-b border-blue-200 px-3 py-2.5 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-[#001E5A] flex items-center gap-1">
              <LinkIcon className="w-3.5 h-3.5 text-[#0088FF]" />
              <span>Insert Link:</span>
            </span>
            <input
              type="text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              placeholder="Link Text (e.g., Clipping Path Service)"
              className="px-2.5 py-1 bg-white border border-slate-300 rounded text-xs w-44"
            />
            <input
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="URL (https://... or #service/clipping-path)"
              className="px-2.5 py-1 bg-white border border-slate-300 rounded text-xs font-mono-tabular flex-1 min-w-[180px]"
            />
            <label className="inline-flex items-center gap-1 text-[11px] text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={linkNewTab}
                onChange={(e) => setLinkNewTab(e.target.checked)}
                className="accent-[#0088FF]"
              />
              <span>New Tab</span>
            </label>
            <button
              type="button"
              onClick={handleInsertLink}
              className="px-3 py-1 rounded bg-[#0088FF] hover:bg-[#001E5A] text-white font-bold flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Add Link</span>
            </button>
            <button
              type="button"
              onClick={() => setShowLinkInput(false)}
              className="p-1 text-slate-500 hover:text-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* INLINE IMAGE INSERTION BAR */}
        {showImageInput && (
          <div className="bg-blue-50/90 border-b border-blue-200 px-3 py-2.5 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-[#001E5A] flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5 text-[#0088FF]" />
              <span>Insert Image:</span>
            </span>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Paste Image URL (https://...)"
              className="px-2.5 py-1 bg-white border border-slate-300 rounded text-xs flex-1 min-w-[180px]"
            />
            <input
              type="text"
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
              placeholder="Alt Text (SEO)"
              className="px-2.5 py-1 bg-white border border-slate-300 rounded text-xs w-36"
            />
            <button
              type="button"
              onClick={() => handleInsertImageHtml(imageUrl.trim(), imageAlt)}
              className="px-3 py-1 rounded bg-[#0088FF] hover:bg-[#001E5A] text-white font-bold"
            >
              Insert URL
            </button>
            <label className="px-3 py-1 rounded bg-[#001E5A] hover:bg-[#0088FF] text-white font-bold cursor-pointer flex items-center gap-1">
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload File</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageFileUpload(e.target.files?.[0])}
                className="hidden"
              />
            </label>
            <button
              type="button"
              onClick={() => setShowImageInput(false)}
              className="p-1 text-slate-500 hover:text-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* EDITOR BODY: EITHER CONTENTEDITABLE VISUAL CANVAS OR RAW HTML SOURCE TEXTAREA */}
        {sourceMode ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{ minHeight }}
            placeholder={placeholder}
            className="w-full p-4 text-xs font-mono-tabular bg-slate-900 text-emerald-300 focus:outline-none leading-relaxed"
          />
        ) : (
          <div className="relative">
            {!value && (
              <div className="pointer-events-none absolute top-3.5 left-4 text-xs text-slate-400 select-none">
                {placeholder}
              </div>
            )}
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={emitChange}
              onBlur={() => {
                saveSelection();
                emitChange();
              }}
              onKeyUp={saveSelection}
              onMouseUp={saveSelection}
              style={{ minHeight }}
              className="w-full p-4 text-sm text-slate-800 bg-white focus:outline-none leading-relaxed prose prose-sm max-w-none [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-[#001E5A] [&_h1]:my-2 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#001E5A] [&_h2]:my-2 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-[#001E5A] [&_h3]:my-1.5 [&_h4]:text-base [&_h4]:font-bold [&_h4]:text-[#001E5A] [&_p]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2 [&_blockquote]:border-l-4 [&_blockquote]:border-[#0088FF] [&_blockquote]:bg-[#F5F9FD] [&_blockquote]:px-4 [&_blockquote]:py-2 [&_blockquote]:my-2 [&_blockquote]:italic [&_a]:text-[#0088FF] [&_a]:underline [&_a]:font-semibold"
            />
          </div>
        )}
      </div>
    </div>
  );
};

interface RichContentRendererProps {
  content: string;
  className?: string;
}

/**
 * Renders either formatted Rich HTML content (from RichTextEditor) or legacy plain-text paragraphs
 */
export const RichContentRenderer: React.FC<RichContentRendererProps> = ({
  content,
  className = '',
}) => {
  if (!content) return null;

  if (isRichHtmlContent(content)) {
    return (
      <div
        className={`leading-relaxed [&_h1]:text-2xl sm:[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-[#001E5A] [&_h1]:mt-5 [&_h1]:mb-3 [&_h2]:text-xl sm:[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#001E5A] [&_h2]:mt-5 [&_h2]:mb-2.5 [&_h3]:text-lg sm:[&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#001E5A] [&_h3]:mt-4 [&_h3]:mb-2 [&_h4]:text-base [&_h4]:font-bold [&_h4]:text-[#001E5A] [&_h4]:mt-3 [&_h4]:mb-1.5 [&_p]:my-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-3 [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-3 [&_blockquote]:border-l-4 [&_blockquote]:border-[#0088FF] [&_blockquote]:bg-[#F5F9FD] [&_blockquote]:px-4 [&_blockquote]:py-3 [&_blockquote]:my-4 [&_blockquote]:rounded-r-xl [&_blockquote]:text-[#001E5A] [&_blockquote]:font-medium [&_a]:text-[#0088FF] [&_a]:underline hover:[&_a]:text-[#001E5A] [&_a]:font-semibold [&_hr]:my-6 [&_hr]:border-[#DCE6F2] [&_img]:rounded-xl [&_img]:my-4 [&_img]:max-w-full ${className}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  return (
    <div className={`space-y-4 leading-relaxed ${className}`}>
      {content
        .split('\n\n')
        .filter(Boolean)
        .map((paragraph, pIdx) => (
          <p key={pIdx}>{paragraph}</p>
        ))}
    </div>
  );
};
