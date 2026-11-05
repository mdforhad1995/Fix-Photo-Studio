import { PortfolioItem, ServiceCategory, OrderStatus } from '../types';

export type StudioDivision = 'photo_editing' | 'video_editing';

export interface ServiceComplexityTier {
  tierName: string;
  pricePerImage: string;
  turnaround: string;
  description: string;
  examples: string;
}

export interface ServiceSampleItem {
  id: string;
  title: string;
  complexityTag: string;
  turnaround: string;
  specNote: string;
  artworkType: 'watch' | 'mannequin' | 'jewelry' | 'footwear' | 'beauty' | 'variant' | 'real_estate';
  beforeImageUrl?: string;
  afterImageUrl?: string;
}

export interface ServiceFaqItem {
  question: string;
  answer: string;
}

export interface ServiceEditorialBlock {
  id: string;
  sectionBadge: string;
  headline: string;
  paragraphs: string[];
  highlightBadges: string[];
  imagePosition: 'right' | 'left';
  imageUrl?: string;
  captionTitle?: string;
  captionMetric?: string;
}

export interface ServiceDefinition {
  id: ServiceCategory;
  slug: string;
  division: StudioDivision;
  indexNumber: string;
  title: string;
  shortNavTitle: string;
  ratePerImage: number;
  unitLabel: string;
  turnaroundLabel: string;
  artworkType: 'watch' | 'mannequin' | 'jewelry' | 'footwear' | 'beauty' | 'variant' | 'real_estate';
  heroSubtitle: string;
  summary: string;
  deliverables: string;
  colSpan: string;
  isCoreFocus?: boolean;
  complexityTiers: ServiceComplexityTier[];
  technicalSpecs: {
    label: string;
    value: string;
  }[];
  workflowHighlights: {
    step: string;
    title: string;
    detail: string;
  }[];
  beforeImageUrl?: string;
  afterImageUrl?: string;
  sampleGallery?: ServiceSampleItem[];
  faqs?: ServiceFaqItem[];
  editorialBlocks?: ServiceEditorialBlock[];
  seoTitle?: string;
  seoMetaDescription?: string;
}

export interface MainMenuPhotoServiceItem {
  id: string;
  title: string;
  subtitle: string;
  targetSlug: string;
  startingRate: string;
  turnaround: string;
  artworkType: 'watch' | 'mannequin' | 'jewelry' | 'footwear' | 'beauty' | 'variant' | 'real_estate';
  relatedSlugs: string[];
  beforeImageUrl?: string;
  afterImageUrl?: string;
}

export const MAIN_MENU_PHOTO_SERVICES: MainMenuPhotoServiceItem[] = [
  {
    id: 'menu-photo-retouching',
    title: 'Photo Retouching',
    subtitle: 'Product, Beauty, Headshot',
    targetSlug: 'photo-retouching-services',
    startingRate: '$0.95 / img',
    turnaround: '8–12h SLA',
    artworkType: 'beauty',
    relatedSlugs: [
      'photo-retouching-services',
      'high-end-retouching-services',
      'headshot-retouching-services',
      'product-photo-editing-services',
    ],
  },
  {
    id: 'menu-real-estate-photo',
    title: 'Real Estate Photo',
    subtitle: 'Interior, Virtual Staging, HDR',
    targetSlug: 'real-estate-photo-editing',
    startingRate: '$0.80 / img',
    turnaround: '6–12h SLA',
    artworkType: 'real_estate',
    relatedSlugs: ['real-estate-photo-editing', 'color-correction-services'],
  },
  {
    id: 'menu-jewelry-retouching',
    title: 'Jewelry Retouching',
    subtitle: 'Basic & High-End',
    targetSlug: 'jewelry-retouching-services',
    startingRate: '$2.40 / img',
    turnaround: '12–24h SLA',
    artworkType: 'jewelry',
    relatedSlugs: ['jewelry-retouching-services', 'clipping-path-service'],
  },
  {
    id: 'menu-ghost-mannequin',
    title: 'Ghost Mannequin',
    subtitle: 'Neck Joint & 3D Ghost',
    targetSlug: 'ghost-mannequin-services',
    startingRate: '$0.85 / img',
    turnaround: '8–12h SLA',
    artworkType: 'mannequin',
    relatedSlugs: ['ghost-mannequin-services', 'fashion-photo-editing-service'],
  },
  {
    id: 'menu-ecommerce-ready',
    title: 'E-Commerce Ready',
    subtitle: 'Amazon, eBay & More',
    targetSlug: 'product-photo-editing-services',
    startingRate: '$0.35 / img',
    turnaround: '6–12h SLA',
    artworkType: 'footwear',
    relatedSlugs: [
      'product-photo-editing-services',
      'background-removal-service',
      'color-correction-services',
    ],
  },
  {
    id: 'menu-clipping-path',
    title: 'Clipping Path',
    subtitle: 'Masking, Shadow, Cutout',
    targetSlug: 'clipping-path-service',
    startingRate: '$0.39 / img',
    turnaround: '6–12h SLA',
    artworkType: 'watch',
    relatedSlugs: [
      'clipping-path-service',
      'image-masking-service',
      'background-removal-service',
    ],
  },
];

export const STUDIO_SERVICES: ServiceDefinition[] = [
  // ===========================================================================
  // PART 1: PHOTO EDITING SERVICES (12 DEDICATED SERVICE PAGES)
  // ===========================================================================
  {
    id: 'clipping_path',
    slug: 'clipping-path-service',
    division: 'photo_editing',
    indexNumber: '01.',
    title: 'Clipping Path Service — Hand-Drawn Bezier Vector Isolation',
    shortNavTitle: 'Clipping Path Service',
    ratePerImage: 0.39,
    unitLabel: 'image',
    turnaroundLabel: '6–12h SLA · 300+ Anchor Nodes',
    artworkType: 'watch',
    isCoreFocus: true,
    heroSubtitle:
      '100% manual Pen-Tool vector paths with 0.25px edge feathering and multi-channel alpha masks for e-commerce catalogs, watches, footwear, and industrial hardware.',
    summary:
      'Manual Pen-Tool vector paths with 0.25px edge feathering and separate layer masks for hardware, straps, soles, and translucent surfaces.',
    deliverables: 'Layered PSD · Clipping Path #1 · Transparent PNG',
    colSpan: 'lg:col-span-2',
    complexityTiers: [
      {
        tierName: 'Basic Clipping Path',
        pricePerImage: '$0.39 / image',
        turnaround: '6–12 Hours SLA',
        description: 'Single continuous outer vector path with smooth curves and zero internal holes.',
        examples: 'Boxes, smartphones, books, simple footwear, folded apparel.',
      },
      {
        tierName: 'Medium Complexity Clipping Path',
        pricePerImage: '$0.79 / image',
        turnaround: '6–12 Hours SLA',
        description: 'Multiple anchor points and 2–5 internal compound paths for handles, straps, or buckles.',
        examples: 'Handbags with straps, chronographs, eyewear frames, athletic shoes.',
      },
      {
        tierName: 'Super Complex & Multi-Path Isolation',
        pricePerImage: '$1.49 – $2.90 / image',
        turnaround: '12–24 Hours SLA',
        description: 'Up to 15 independent vector paths isolating every material surface for separate adjustments.',
        examples: 'Bicycles, intricate chains, multi-stone jewelry, furniture mesh.',
      },
    ],
    technicalSpecs: [
      { label: 'Vector Tooling', value: 'Adobe Photoshop Pen Tool (Hand-Drawn Bezier Nodes)' },
      { label: 'Edge Feathering', value: '0.25px – 0.5px Custom Choke (Zero White Halo)' },
      { label: 'Included Paths', value: 'Working Path #1 Saved in PSD/TIFF + Alpha Mask' },
      { label: 'Zoom Inspection', value: '300% – 400% Dual-Stage Senior QA Verification' },
    ],
    workflowHighlights: [
      {
        step: '01',
        title: 'Anchor Node Plotting',
        detail: 'Senior path specialists place manual Bezier nodes along true geometric edges at 300% zoom.',
      },
      {
        step: '02',
        title: 'Internal Cutout Isolation',
        detail: 'All negative spaces (loops, spokes, buckles, chains) are subtracted cleanly via compound sub-paths.',
      },
      {
        step: '03',
        title: '400% Contrast Check',
        detail: 'Edges are audited against both pure #FFFFFF white and #000000 matte black test backdrops.',
      },
    ],
  },
  {
    id: 'ecommerce_shadow',
    slug: 'background-removal-service',
    division: 'photo_editing',
    indexNumber: '02.',
    title: 'Background Removal Service — Pure White #FFFFFF & Alpha Knockouts',
    shortNavTitle: 'Background Removal Service',
    ratePerImage: 0.35,
    unitLabel: 'image',
    turnaroundLabel: '6–12h SLA · Marketplace Compliant',
    artworkType: 'footwear',
    isCoreFocus: true,
    heroSubtitle:
      'Clean studio background knockout to pure RGB(255,255,255) white, transparent PNG alpha, or custom brand hex backdrops with natural grounding shadows.',
    summary:
      'Instant marketplace-compliant background removal for Amazon, Shopify, eBay, Farfetch, and Walmart catalogs with crisp edge fidelity.',
    deliverables: 'Pure White #FFFFFF JPG · Transparent PNG-24 · Layered PSD',
    colSpan: 'lg:col-span-1',
    complexityTiers: [
      {
        tierName: 'Solid Product Knockout',
        pricePerImage: '$0.35 / image',
        turnaround: '6–12 Hours SLA',
        description: 'Clean background removal to pure white #FFFFFF or transparent PNG for hard-edged products.',
        examples: 'Cosmetics bottles, electronics, packaged goods, footwear.',
      },
      {
        tierName: 'Background Removal + Natural Shadow',
        pricePerImage: '$0.65 / image',
        turnaround: '6–12 Hours SLA',
        description: 'Full background replacement plus realistic contact or soft drop shadow on a separate layer.',
        examples: 'Sneakers, leather bags, home appliances, studio accessories.',
      },
      {
        tierName: 'Translucent & Glass Background Removal',
        pricePerImage: '$1.35 / image',
        turnaround: '12–24 Hours SLA',
        description: 'Alpha channel extraction preserving optical transparency through glass, crystal, and liquids.',
        examples: 'Perfume bottles, drinkware, tinted sunglasses, acrylic decor.',
      },
    ],
    technicalSpecs: [
      { label: 'Background RGB', value: 'Verified RGB(255, 255, 255) #FFFFFF or Alpha Transparency' },
      { label: 'Marketplace Ready', value: 'Amazon, Shopify Plus, Zalando, Farfetch, Walmart' },
      { label: 'Canvas Margin', value: 'Standardized 85% Product Fill & Centered Horizon' },
      { label: 'Batch Capacity', value: 'Up to 5,000 Frames / 24 Hours' },
    ],
    workflowHighlights: [
      {
        step: '01',
        title: 'Edge Boundary Detection',
        detail: 'Combined hand-drawn vector path and channel mask isolate hard and soft product edges.',
      },
      {
        step: '02',
        title: 'Color Spill Neutralization',
        detail: 'Studio sweep color cast along the bottom and outer edges of the subject is neutralized.',
      },
      {
        step: '03',
        title: 'Pure White & Shadow Export',
        detail: 'Exported in both web-ready sRGB and archival layered PSD formats.',
      },
    ],
  },
  {
    id: 'beauty_high_end',
    slug: 'image-masking-service',
    division: 'photo_editing',
    indexNumber: '03.',
    title: 'Image Masking Service — Hair, Fur, Chiffon & Alpha Channel Extraction',
    shortNavTitle: 'Image Masking Service',
    ratePerImage: 0.75,
    unitLabel: 'image',
    turnaroundLabel: '8–16h SLA · Strand-Level Alpha',
    artworkType: 'beauty',
    isCoreFocus: true,
    heroSubtitle:
      'Advanced alpha channel masking, luminosity masking, and strand-level hair/fur extraction for models,knitwear, faux fur, and semi-transparent fabrics.',
    summary:
      'Isolate wind-blown hair, plush fur, lace, bridal veils, and translucent textiles without losing a single delicate strand or edge detail.',
    deliverables: '16-Bit Alpha Channel PSD · Transparent PNG · Composite Ready',
    colSpan: 'lg:col-span-1',
    complexityTiers: [
      {
        tierName: 'Soft Edge & Knitwear Masking',
        pricePerImage: '$0.75 / image',
        turnaround: '8–12 Hours SLA',
        description: 'Refined layer mask for fuzzy sweaters, wool scarves, and textured plush edges.',
        examples: 'Cashmere knitwear, winter coats, plush toys, velvet accessories.',
      },
      {
        tierName: 'Model Hair & Fur Alpha Extraction',
        pricePerImage: '$1.25 / image',
        turnaround: '12–18 Hours SLA',
        description: 'Multi-channel blue/red contrast extraction preserving fine flyaway hair strands.',
        examples: 'Fashion models, studio headshots, pet photography, shearling jackets.',
      },
      {
        tierName: 'Bridal Lace, Veil & Chiffon Transparency',
        pricePerImage: '$1.95 / image',
        turnaround: '24 Hours SLA',
        description: 'Complex luminosity + alpha masking allowing new backgrounds to show naturally through sheer fabric.',
        examples: 'Wedding gowns, organza dresses, net curtains, smoke & water splashes.',
      },
    ],
    technicalSpecs: [
      { label: 'Masking Technique', value: 'Color Channel Calculation + Manual Brush Refinement' },
      { label: 'Decontamination', value: 'Edge Halo & Studio Backdrop Spill Removal' },
      { label: 'Transparency Control', value: 'Graduated 8-Bit / 16-Bit Greyscale Alpha Masks' },
      { label: 'File Delivery', value: 'Non-Destructive Layer Mask in PSD or TIFF' },
    ],
    workflowHighlights: [
      {
        step: '01',
        title: 'Base Vector + Alpha Split',
        detail: 'Hard garment body is clipped with a Pen path while hair/fur is routed to alpha channel extraction.',
      },
      {
        step: '02',
        title: 'Strand Reconstruction',
        detail: 'Delicate flyaway strands are preserved and color-decontaminated against the target backdrop.',
      },
      {
        step: '03',
        title: 'Seamless Composite Audit',
        detail: 'Tested on light, mid-grey, and dark backgrounds to guarantee natural edge blending.',
      },
    ],
  },
  {
    id: 'ghost_mannequin',
    slug: 'ghost-mannequin-services',
    division: 'photo_editing',
    indexNumber: '04.',
    title: 'Ghost Mannequin Services — 3D Hollow Neck-Joint & Garment Shaping',
    shortNavTitle: 'Ghost Mannequin Services',
    ratePerImage: 0.85,
    unitLabel: 'image',
    turnaroundLabel: '12h SLA · Multi-Shot Neck Joint',
    artworkType: 'mannequin',
    isCoreFocus: true,
    heroSubtitle:
      'True-to-life 3D invisible mannequin composites combining front, back, and inner-collar plates with symmetrical liquify shaping and wrinkle removal.',
    summary:
      'Seamless composite of front, back, and inner-label plates to create natural hollow 3D volume, balanced shoulder symmetry, and steam crease removal.',
    deliverables: '16-Bit TIFF · Symmetrical Liquify · Inner Collar Composite',
    colSpan: 'lg:col-span-1',
    complexityTiers: [
      {
        tierName: 'Standard Neck-Joint Composite',
        pricePerImage: '$0.85 / image',
        turnaround: '8–12 Hours SLA',
        description: 'Mannequin removal with inner collar/brand label composite and natural interior drop shadow.',
        examples: 'T-shirts, polo shirts, tailored blazers, hoodies, sweaters, dresses.',
      },
      {
        tierName: '3D Bottom / Sleeve & Hem Joint',
        pricePerImage: '$1.25 / image',
        turnaround: '12 Hours SLA',
        description: 'Multi-plate composite for cuffs, open jackets, waistbands, and asymmetrical hemlines.',
        examples: 'Trench coats, denim jeans, activewear leggings, unbuttoned cardigans.',
      },
      {
        tierName: 'Couture Liquify & Crease Reconstruction',
        pricePerImage: '$1.85 / image',
        turnaround: '12–24 Hours SLA',
        description: 'Full shoulder/sleeve symmetry alignment, pin/clip removal, and fabric weave restoration.',
        examples: 'Luxury suiting, silk eveningwear, structured outerwear, swimwear.',
      },
    ],
    technicalSpecs: [
      { label: 'Composite Method', value: 'Multi-Plate Blending (Front + Inner Neck + Hem)' },
      { label: 'Depth Shading', value: 'Graduated Interior Realism Shadow (15%–28% Opacity)' },
      { label: 'Symmetry Alignment', value: 'Shoulder, Sleeve Length & Collar Balance Grid' },
      { label: 'Fabric Cleanup', value: 'Lint, Pin Marks, Steamer Spots & Crease Removal' },
    ],
    workflowHighlights: [
      {
        step: '01',
        title: 'Outer Garment Isolation',
        detail: 'Precise clipping path removes the physical acrylic or matte mannequin torso and stand.',
      },
      {
        step: '02',
        title: 'Inner Label & Neck Warp',
        detail: 'The inside-out garment plate is perspective-warped and blended seamlessly along the collar seam.',
      },
      {
        step: '03',
        title: '3D Volume & Symmetry',
        detail: 'Subtle interior shading and symmetrical liquify give the garment a natural 3D fit.',
      },
    ],
  },
  {
    id: 'color_variants',
    slug: 'color-correction-services',
    division: 'photo_editing',
    indexNumber: '05.',
    title: 'Color Correction Services — Pantone SKU Recoloring & Exposure Balance',
    shortNavTitle: 'Color Correction Services',
    ratePerImage: 0.65,
    unitLabel: 'image',
    turnaroundLabel: '6–12h SLA · ΔE < 0.5 Color Match',
    artworkType: 'variant',
    isCoreFocus: true,
    heroSubtitle:
      'Calibrate white balance, exposure, and Pantone TCX/TPG colorway variants across entire e-commerce catalogs while preserving authentic fabric weave and highlights.',
    summary:
      'Eliminate studio lighting color casts and generate 10+ accurate SKU colorways from a single master studio frame.',
    deliverables: 'Pantone TCX/TPG Matched · ICC Profiled PSD & sRGB JPG',
    colSpan: 'lg:col-span-1',
    complexityTiers: [
      {
        tierName: 'White Balance & Exposure Standardization',
        pricePerImage: '$0.45 / image',
        turnaround: '6 Hours SLA',
        description: 'Batch color temperature normalization, shadow recovery, and highlight roll-off balancing.',
        examples: 'Lookbook batches, real estate interiors, event catalogs.',
      },
      {
        tierName: 'Single-Material Pantone SKU Recoloring',
        pricePerImage: '$0.95 / variant',
        turnaround: '8–12 Hours SLA',
        description: 'Recolor garments, leather goods, or hard products to exact HEX or Pantone swatch codes.',
        examples: 'Apparel basics, handbags, footwear uppers, silicone accessories.',
      },
      {
        tierName: 'Multi-Surface & Pattern Swapping',
        pricePerImage: '$1.75 / variant',
        turnaround: '12–24 Hours SLA',
        description: 'Independent masking for body fabric, contrast stitching, hardware, and 3D pattern wrapping.',
        examples: 'Multi-panel sneakers, patterned upholstery, printed fashion.',
      },
    ],
    technicalSpecs: [
      { label: 'Color Tolerance', value: 'ΔE < 0.5 Lab Color Space Verification' },
      { label: 'Swatch Standards', value: 'Pantone TCX, TPG, Solid Coated, HEX & sRGB' },
      { label: 'Highlight Integrity', value: 'Separate Specular & Shadow Luminance Preservation' },
      { label: 'File Naming', value: 'Automated SKU_ColorCode_Angle Batch Renaming' },
    ],
    workflowHighlights: [
      {
        step: '01',
        title: 'Component Sub-Masking',
        detail: 'Buttons, threads, hardware, and logos are masked separately so only target panels shift color.',
      },
      {
        step: '02',
        title: 'Lab-Space Swatch Locking',
        detail: 'Target swatches are matched in CIE Lab space to maintain natural shadow and highlight roll-off.',
      },
      {
        step: '03',
        title: 'Automated SKU Export',
        detail: 'All colorway variants are exported simultaneously into your exact e-commerce SKU folder hierarchy.',
      },
    ],
  },
  {
    id: 'beauty_high_end',
    slug: 'photo-retouching-services',
    division: 'photo_editing',
    indexNumber: '06.',
    title: 'Photo Retouching Services — Commercial Blemish, Dust & Surface Cleanup',
    shortNavTitle: 'Photo Retouching Services',
    ratePerImage: 1.20,
    unitLabel: 'image',
    turnaroundLabel: '12h SLA · Non-Destructive Layers',
    artworkType: 'watch',
    isCoreFocus: true,
    heroSubtitle:
      'All-around studio photo retouching removing sensor dust, studio props, fabric wrinkles, skin blemishes, and distracting glare for commercial and lifestyle imagery.',
    summary:
      'Clean, natural, non-destructive retouching for brands, photographers, and agencies needing fast, consistent turnaround.',
    deliverables: 'Unflattened Layered PSD · High-Res TIFF · sRGB Web Ready',
    colSpan: 'lg:col-span-1',
    complexityTiers: [
      {
        tierName: 'Essential Studio Cleanup',
        pricePerImage: '$0.95 / image',
        turnaround: '8–12 Hours SLA',
        description: 'Dust, scratch, lint, minor wrinkle, and sensor spot removal with tonal balance.',
        examples: 'Catalog lifestyle shots, studio portraits, everyday products.',
      },
      {
        tierName: 'Advanced Commercial Retouching',
        pricePerImage: '$1.80 / image',
        turnaround: '12–24 Hours SLA',
        description: 'Prop/rig removal, garment shaping, skin texture smoothing, and reflection control.',
        examples: 'Brand campaigns, lookbooks, composite product scenes.',
      },
      {
        tierName: 'Master Creative Composite & Restoration',
        pricePerImage: '$3.50 / image',
        turnaround: '24 Hours SLA',
        description: 'Complex object reconstruction, multi-exposure merging, and high-res print preparation.',
        examples: 'Advertising key visuals, damaged archive restoration.',
      },
    ],
    technicalSpecs: [
      { label: 'Workflow Standard', value: '100% Non-Destructive Healing & Clone Stamp Layers' },
      { label: 'Texture Integrity', value: 'Frequency Separation Preserving Authentic Surface Grain' },
      { label: 'Color Calibration', value: 'sRGB, AdobeRGB 1998 & CMYK Print Profiles' },
      { label: 'Revisions', value: 'Unlimited Complimentary Fine-Tuning Revisions' },
    ],
    workflowHighlights: [
      {
        step: '01',
        title: 'Defect & Distraction Audit',
        detail: 'Every frame is inspected at 200% zoom to mark dust, creases, cords, and lighting hotspots.',
      },
      {
        step: '02',
        title: 'Texture-Preserving Healing',
        detail: 'Surface imperfections are removed on separate layers while preserving natural material grain.',
      },
      {
        step: '03',
        title: 'Final Tonal & Sharpness Polish',
        detail: 'Output sharpening and color grading are tailored to web retina or print specifications.',
      },
    ],
  },
  {
    id: 'jewelry_retouch',
    slug: 'jewelry-retouching-services',
    division: 'photo_editing',
    indexNumber: '07.',
    title: 'Jewelry Retouching Services — Macro Gemstone & Precious Metal Polishing',
    shortNavTitle: 'Jewelry Photo Retouching',
    ratePerImage: 2.40,
    unitLabel: 'image',
    turnaroundLabel: '24h SLA · Macro Focus Stack',
    artworkType: 'jewelry',
    isCoreFocus: true,
    heroSubtitle:
      'High-magnification diamond, gemstone, and precious metal retouching with focus-stack blending, studio wax removal, and liquid-mirror gold/platinum polishing.',
    summary:
      'Individual gemstone facet luminance calibration, wax-mount removal, precious metal scratch reconstruction, and neutral daylight fire dispersion.',
    deliverables: 'Focus-Stacked Master · Separate Gem & Metal Alpha Channels',
    colSpan: 'lg:col-span-1',
    complexityTiers: [
      {
        tierName: 'Solitaire Rings & Stud Earrings',
        pricePerImage: '$2.40 / image',
        turnaround: '12–24 Hours SLA',
        description: 'Wax/putty removal, metal band mirror polishing, and primary center-stone facet enhancement.',
        examples: 'Engagement rings, wedding bands, pearl studs, minimalist pendants.',
      },
      {
        tierName: 'Pavé & Multi-Gemstone Pieces',
        pricePerImage: '$3.80 / image',
        turnaround: '24 Hours SLA',
        description: 'Individual micro-prong cleanup and facet-by-facet brilliance calibration across 20+ stones.',
        examples: 'Halo rings, tennis bracelets, chronograph bezels, gemstone drop earrings.',
      },
      {
        tierName: 'Haute Joaillerie & Intricate Chains',
        pricePerImage: '$5.50 / image',
        turnaround: '24–36 Hours SLA',
        description: 'Hundreds of internal chain-link cutouts, focus-stack merging, and rose/yellow/white gold variants.',
        examples: 'Statement necklaces, chandelier earrings, luxury skeleton watches.',
      },
    ],
    technicalSpecs: [
      { label: 'Focus Stacking', value: 'Multi-Plane Helicon / Photoshop Depth Merging' },
      { label: 'Metal Calibration', value: '18K Yellow, Rose, Platinum & Sterling Silver LUTs' },
      { label: 'Gemstone Treatment', value: 'Camera Reflection Removal & Neutral White Fire' },
      { label: 'Channel Separation', value: 'Independent Alpha Masks for Metal, Center Stone & Pavé' },
    ],
    workflowHighlights: [
      {
        step: '01',
        title: 'Multi-Mask Isolation',
        detail: 'Every gemstone, prong, and inner shank is isolated onto separate vector alpha channels.',
      },
      {
        step: '02',
        title: 'Liquid Metal Reconstruction',
        detail: 'Micro-scratches, casting pores, and studio reflections are replaced with smooth metallic gradients.',
      },
      {
        step: '03',
        title: 'Facet Brilliance & Grounding',
        detail: 'Diamonds and colored gems are sharpened with authentic internal refraction and soft reflection shadows.',
      },
    ],
  },
  {
    id: 'beauty_high_end',
    slug: 'high-end-retouching-services',
    division: 'photo_editing',
    indexNumber: '08.',
    title: 'High-End Retouching Services — Editorial Beauty, Dodge & Burn Mastery',
    shortNavTitle: 'High-End Retouching',
    ratePerImage: 3.50,
    unitLabel: 'image',
    turnaroundLabel: '24h SLA · Pore-Level Dodge & Burn',
    artworkType: 'beauty',
    isCoreFocus: true,
    heroSubtitle:
      'Magazine-grade beauty, cosmetics, and advertising retouching preserving 100% authentic skin pore texture via micro dodge-and-burn and 16-bit frequency separation.',
    summary:
      'Micro-dodge and burn retouching preserving authentic skin pore structure, flyaway hair reconstruction, and ICC-calibrated editorial LUT grading.',
    deliverables: 'Unflattened 16-Bit PSD · AdobeRGB 1998 & sRGB Web Masters',
    colSpan: 'lg:col-span-1',
    complexityTiers: [
      {
        tierName: 'Editorial Portrait & Lookbook',
        pricePerImage: '$2.50 / image',
        turnaround: '12–24 Hours SLA',
        description: 'Natural skin blemish cleanup, stray hair removal, eye/teeth enhancement, and tonal grading.',
        examples: 'Fashion lookbooks, designer portraits, editorial lifestyle.',
      },
      {
        tierName: 'Commercial Beauty & Cosmetics Campaign',
        pricePerImage: '$3.50 / image',
        turnaround: '24 Hours SLA',
        description: '16-bit frequency separation, micro dodge-and-burn contour balancing, and precise lip/eye refinement.',
        examples: 'Skincare campaigns, cosmetics key visuals, magazine covers.',
      },
      {
        tierName: 'Billboard Key Visual & Macro Beauty',
        pricePerImage: '$5.90 / image',
        turnaround: '24–48 Hours SLA',
        description: 'Pore-by-pore dermal refinement, individual eyelash/brow work, and complex multi-plate compositing.',
        examples: 'Global luxury fragrance ads, 100MP medium-format beauty spreads.',
      },
    ],
    technicalSpecs: [
      { label: 'Skin Workflow', value: 'Non-Destructive Micro Dodge & Burn + 16-Bit Frequency Separation' },
      { label: 'Color Space', value: 'ProPhoto RGB / AdobeRGB 1998 / CMYK Print Ready' },
      { label: 'Layer Structure', value: 'Fully Intact Adjustment Layers (Zero Plastic Blur)' },
      { label: 'Hair & Edges', value: 'Channel-Based Strand Extraction & Hand-Painted Flyaways' },
    ],
    workflowHighlights: [
      {
        step: '01',
        title: 'RAW Development & Tonal Base',
        detail: 'Capture One / Camera Raw exposure, skin-tone uniformity, and neutral white balance calibration.',
      },
      {
        step: '02',
        title: 'Micro Dodge & Burn',
        detail: 'Luminance transitions are smoothed at the pore level without blurring natural skin texture.',
      },
      {
        step: '03',
        title: 'Color Grade & Output Proofing',
        detail: 'Custom LUT color grading and soft-proofing for both retina web displays and offset print.',
      },
    ],
  },
  {
    id: 'ecommerce_shadow',
    slug: 'product-photo-editing-services',
    division: 'photo_editing',
    indexNumber: '09.',
    title: 'Product Photo Editing Services — Packshot Retouching & Shadow Making',
    shortNavTitle: 'Product Photo Retouching',
    ratePerImage: 0.65,
    unitLabel: 'image',
    turnaroundLabel: '6–12h SLA · High-Conversion Packshots',
    artworkType: 'footwear',
    isCoreFocus: true,
    heroSubtitle:
      'End-to-end commercial product photo editing: dust/scratch removal, label straightening, specular highlight control, pure white grounding, and reflection shadows.',
    summary:
      'Transform raw studio packshots into high-converting e-commerce product visuals for Amazon, Shopify, and luxury retail.',
    deliverables: 'Pure White #FFFFFF · Separate Shadow Layer · 85% Canvas Fill',
    colSpan: 'lg:col-span-1',
    complexityTiers: [
      {
        tierName: 'Standard E-Commerce Packshot',
        pricePerImage: '$0.65 / image',
        turnaround: '6–12 Hours SLA',
        description: 'Clipping path, pure white #FFFFFF background, minor dust cleanup, and natural contact shadow.',
        examples: 'Footwear, apparel accessories, electronics, packaged consumer goods.',
      },
      {
        tierName: 'Reflective & Metallic Product Retouch',
        pricePerImage: '$1.35 / image',
        turnaround: '12 Hours SLA',
        description: 'Specular glare control, brushed metal gradient reconstruction, and acrylic reflection shadow.',
        examples: 'Watches, sunglasses, cosmetics bottles, kitchen appliances, hardware.',
      },
      {
        tierName: 'Hero Product Composite & Packaging Rebuild',
        pricePerImage: '$2.75 / image',
        turnaround: '24 Hours SLA',
        description: 'Multi-lighting plate blending, packaging label Perspective warp, and custom background staging.',
        examples: 'Amazon A+ Hero Banners, beverage bottles with condensation, audio gear.',
      },
    ],
    technicalSpecs: [
      { label: 'Backdrop Standard', value: 'Pure RGB(255, 255, 255) #FFFFFF or Custom Hex' },
      { label: 'Shadow Separation', value: 'Dedicated Multiply Layer (Adjustable Opacity 10%–35%)' },
      { label: 'Marketplace Presets', value: 'Amazon, Shopify, Farfetch, Zalando, eBay, Walmart' },
      { label: 'Smart Cropping', value: 'Automated 85% Subject Fill & Baseline Alignment' },
    ],
    workflowHighlights: [
      {
        step: '01',
        title: 'Clean Subject Isolation',
        detail: 'Hand-drawn clipping path separates the product cleanly from the raw studio sweep.',
      },
      {
        step: '02',
        title: 'Surface & Label Refinement',
        detail: 'Scuffs, glue marks, and packaging creases are reconstructed while sharpening brand typography.',
      },
      {
        step: '03',
        title: 'Dual-Density Shadow & Margin Lock',
        detail: 'Every frame is grounded with a natural shadow and aligned to your exact catalog aspect ratio.',
      },
    ],
  },
  {
    id: 'color_variants',
    slug: 'wedding-photo-editing-services',
    division: 'photo_editing',
    indexNumber: '10.',
    title: 'Wedding Photo Editing Services — Culling, Color Grading & Bridal Retouch',
    shortNavTitle: 'Wedding Photo Retouching',
    ratePerImage: 0.28,
    unitLabel: 'image',
    turnaroundLabel: '24–48h Gallery SLA · Custom Lightroom/Capture One Presets',
    artworkType: 'beauty',
    isCoreFocus: false,
    heroSubtitle:
      'Dedicated post-production for wedding and event photographers: smart gallery culling, consistent filmic color grading, exposure matching, and signature bridal portrait retouching.',
    summary:
      'Send us your full 3,000-frame RAW wedding shoot; receive a perfectly color-matched Lightroom catalog and retouched hero portraits within 48 hours.',
    deliverables: 'Lightroom Smart Previews / XMP · High-Res sRGB JPGs · Layered PSD Heroes',
    colSpan: 'lg:col-span-1',
    complexityTiers: [
      {
        tierName: 'Full Gallery Culling & Color Grading',
        pricePerImage: '$0.18 – $0.28 / image',
        turnaround: '24–48 Hours SLA',
        description: 'White balance sync, exposure/tint calibration, horizon straightening, and custom preset application.',
        examples: 'Full wedding day galleries (500–3,500 RAW frames), engagement sessions.',
      },
      {
        tierName: 'Signature Bridal & Couple Portrait Retouch',
        pricePerImage: '$1.50 / image',
        turnaround: '24 Hours SLA',
        description: 'Natural skin softening, dress wrinkle cleanup, stray hair removal, and eye/smile enhancement.',
        examples: 'First-look portraits, bridal party group shots, album spreads.',
      },
      {
        tierName: 'Fine Art Wedding Album Composite',
        pricePerImage: '$3.20 / image',
        turnaround: '24–48 Hours SLA',
        description: 'Distracting guest/exit-sign removal, sky replacement, flash reflection cleanup on glasses.',
        examples: 'Sunset couple key visuals, reception dance-floor composites, print canvases.',
      },
    ],
    technicalSpecs: [
      { label: 'Catalog Formats', value: 'Lightroom Classic (.LRCAT), Smart Previews, XMP Sidecars' },
      { label: 'Preset Matching', value: '100% Custom Matched to Your Studio Film/Editorial LUTs' },
      { label: 'Skin Tone Lock', value: 'Consistent Warm/Natural Skin Luminance Across Mixed Lighting' },
      { label: 'Gallery Capacity', value: 'Up to 15 Full Wedding Galleries / Week per Studio' },
    ],
    workflowHighlights: [
      {
        step: '01',
        title: 'Smart Culling & Anchor Selection',
        detail: 'Duplicate blinks and out-of-focus frames are filtered out; hero anchor frames are color-locked first.',
      },
      {
        step: '02',
        title: 'Scene-by-Scene Tonal Sync',
        detail: 'Ceremony, golden hour, and tungsten reception scenes are balanced for seamless gallery flow.',
      },
      {
        step: '03',
        title: 'Bridal Portrait Polish',
        detail: 'Selected album favorites receive dedicated Photoshop dodge-and-burn and background cleanup.',
      },
    ],
  },
  {
    id: 'beauty_high_end',
    slug: 'headshot-retouching-services',
    division: 'photo_editing',
    indexNumber: '11.',
    title: 'Headshot Retouching Services — Corporate, Executive & Actor Portraits',
    shortNavTitle: 'Headshot Retouching',
    ratePerImage: 1.75,
    unitLabel: 'image',
    turnaroundLabel: '12h SLA · Natural Executive Polish',
    artworkType: 'beauty',
    isCoreFocus: false,
    heroSubtitle:
      'Authentic, confidence-inspiring corporate, LinkedIn, medical, and theatrical headshot retouching with natural skin texture, eyeglass glare removal, and uniform backdrop matching.',
    summary:
      'Look rested and polished without ever looking over-retouched: blemish removal, under-eye softening, stray hair cleanup, and suit/collar alignment.',
    deliverables: 'High-Res TIFF/PSD · Web & LinkedIn Cropped sRGB JPGs',
    colSpan: 'lg:col-span-1',
    complexityTiers: [
      {
        tierName: 'Corporate Team Batch Standardization',
        pricePerImage: '$1.45 / image',
        turnaround: '12 Hours SLA',
        description: 'Consistent head size/eye-line cropping, uniform studio backdrop replacement, and basic skin cleanup.',
        examples: 'Law firms, executive boards, company-wide directory headshots.',
      },
      {
        tierName: 'Executive & Actor Signature Headshot',
        pricePerImage: '$2.25 / image',
        turnaround: '12–24 Hours SLA',
        description: 'Under-eye circle softening, teeth whitening, flyaway hair cleanup, and suit lapel steaming.',
        examples: 'CEO press kits, casting agency headshots, author book jackets.',
      },
      {
        tierName: 'Eyeglass Glare Rebuild & Composite',
        pricePerImage: '$3.40 / image',
        turnaround: '24 Hours SLA',
        description: 'Complex green/blue lens reflection removal, iris catchlight balancing, and background compositing.',
        examples: 'Subjects wearing prescription glasses, outdoor-to-studio composites.',
      },
    ],
    technicalSpecs: [
      { label: 'Dermal Realism', value: 'Frequency Separation Retaining Natural Laugh Lines & Pores' },
      { label: 'Team Consistency', value: 'Locked Eye-Line Grid & Unified Backdrop Hex/Gradient' },
      { label: 'Grooming Details', value: 'Collar Alignment, Lint Removal, Stray Hair & Beard Trim' },
      { label: 'Aspect Crops', value: 'Full Frame + 1:1 Square + 4:5 Portrait Crops Included' },
    ],
    workflowHighlights: [
      {
        step: '01',
        title: 'Expression & Crop Alignment',
        detail: 'Every team member is aligned to a unified head-to-shoulder proportion and eye-level grid.',
      },
      {
        step: '02',
        title: 'Natural Facial Refinement',
        detail: 'Temporary blemishes, redness, and fatigue shadows are reduced by 60–70% for an authentic rested look.',
      },
      {
        step: '03',
        title: 'Wardrobe & Backdrop Unification',
        detail: 'Suit wrinkles and lint are cleaned up and placed on your company’s exact brand backdrop.',
      },
    ],
  },
  {
    id: 'ghost_mannequin',
    slug: 'fashion-photo-editing-service',
    division: 'photo_editing',
    indexNumber: '12.',
    title: 'Fashion Photo Editing Service — Lookbooks, Editorial & Apparel Campaigns',
    shortNavTitle: 'Fashion Photo Editing',
    ratePerImage: 1.95,
    unitLabel: 'image',
    turnaroundLabel: '12–24h SLA · Lookbook & Runway Ready',
    artworkType: 'mannequin',
    isCoreFocus: true,
    heroSubtitle:
      'Complete fashion post-production combining model skin retouching, fabric drape and crease refinement, studio floor extension, and Pantone-calibrated garment color accuracy.',
    summary:
      'Bridge the gap between creative editorial grading and strict e-commerce garment color accuracy across seasonal fashion collections.',
    deliverables: '16-Bit Master PSD · Print CMYK & Web sRGB Lookbook Sets',
    colSpan: 'lg:col-span-1',
    complexityTiers: [
      {
        tierName: 'E-Commerce On-Model Fashion',
        pricePerImage: '$1.35 / image',
        turnaround: '12 Hours SLA',
        description: 'Garment steaming/shaping, model skin cleanup, cyclorama floor cleanup, and crop standardization.',
        examples: 'Zara/ASOS/Farfetch style on-model studio catalog photography.',
      },
      {
        tierName: 'Seasonal Lookbook & Designer Collection',
        pricePerImage: '$2.40 / image',
        turnaround: '18–24 Hours SLA',
        description: 'Full frequency separation skin work, complex fabric fold reconstruction, and editorial color LUTs.',
        examples: 'Designer seasonal lookbooks, showroom line sheets, PR lookbooks.',
      },
      {
        tierName: 'High-Fashion Magazine & Billboard Campaign',
        pricePerImage: '$4.80 / image',
        turnaround: '24–36 Hours SLA',
        description: 'Intricate hair masking, multi-frame lighting composites, and high-res print color separation.',
        examples: 'Vogue/Harper’s style editorial spreads, flagship store lightboxes.',
      },
    ],
    technicalSpecs: [
      { label: 'Garment Fidelity', value: 'Pantone Fabric Lock + Separate Model Skin Grading' },
      { label: 'Studio Set Cleanup', value: 'Cyclorama Seam Removal, Light Stand & Cord Eradication' },
      { label: 'Fabric Liquify', value: 'Natural Silhouette Drape Without Warping Background' },
      { label: 'Output Package', value: 'Simultaneous Web PDP Crops + High-Res Print Masters' },
    ],
    workflowHighlights: [
      {
        step: '01',
        title: 'Dual-Mask Garment & Skin Split',
        detail: 'Apparel is masked separately from model skin so clothing stays 100% color-true during editorial grading.',
      },
      {
        step: '02',
        title: 'Drape, Crease & Set Perfection',
        detail: 'Pin marks, bunching fabric, and studio floor scuffs are seamlessly reconstructed.',
      },
      {
        step: '03',
        title: 'Multi-Channel Retail Delivery',
        detail: 'Exported in exact aspect ratios for your online storefront, social lookbooks, and print catalogs.',
      },
    ],
  },
  {
    id: 'color_variants',
    slug: 'real-estate-photo-editing',
    division: 'photo_editing',
    indexNumber: '13.',
    title: 'Real Estate Photo Editing — Interior Flambient HDR, Virtual Staging & Day-to-Dusk',
    shortNavTitle: 'Real Estate Photo',
    ratePerImage: 0.80,
    unitLabel: 'image',
    turnaroundLabel: '6–12h Overnight SLA · MLS & Architectural Ready',
    artworkType: 'real_estate',
    isCoreFocus: true,
    heroSubtitle:
      'Turn bracketed raw real estate exposures into magazine-grade architectural photography: HDR Flambient window pulls, 3D photorealistic virtual staging, vertical perspective correction, and twilight sky replacement.',
    summary:
      'Interior HDR bracket merging, crisp outdoor window views, cord/clutter removal, lawn greening, and 3D virtual furniture staging delivered overnight.',
    deliverables: 'MLS-Compliant sRGB JPG · 16-Bit Print TIFF · Layered Staging PSD',
    colSpan: 'lg:col-span-1',
    complexityTiers: [
      {
        tierName: 'HDR Bracket Merging & Window Pull',
        pricePerImage: '$0.80 / image',
        turnaround: '6–12 Hours SLA',
        description: '3 to 7 bracketed RAW exposures hand-blended with flash frames (Flambient), vertical straightening, and clear window views.',
        examples: 'Residential MLS interiors, luxury condos, architectural exteriors.',
      },
      {
        tierName: 'Day-to-Dusk Twilight & Decluttering',
        pricePerImage: '$3.50 / image',
        turnaround: '12 Hours SLA',
        description: 'Golden-hour sunset sky replacement, warm interior window glow, driveway/pool reflection enhancement, and object removal.',
        examples: 'Hero listing exteriors, commercial properties, vacation rentals.',
      },
      {
        tierName: '3D Photorealistic Virtual Staging',
        pricePerImage: '$14.00 / room',
        turnaround: '12–24 Hours SLA',
        description: 'Furnish empty rooms with 3D ray-traced modern sofas, dining sets, rugs, lighting, and natural floor reflections.',
        examples: 'Vacant new builds, luxury penthouses, commercial office floorplans.',
      },
    ],
    technicalSpecs: [
      { label: 'Blending Pipeline', value: 'Hand-Masked Flambient (Ambient + Flash) Window Pulls' },
      { label: 'Geometry Control', value: 'Zero-Distortion Vertical & Horizontal Line Alignment' },
      { label: 'Virtual Furniture', value: '4K Ray-Traced Scandinavian, Modern & Luxury Catalogs' },
      { label: 'Color Cast Removal', value: 'Neutral White Ceilings & True Hardwood Floor Tones' },
    ],
    workflowHighlights: [
      {
        step: '01',
        title: 'Bracket & Flash Alignment',
        detail: 'Multiple ambient exposures and flash frames are aligned and hand-brushed for balanced interior lighting.',
      },
      {
        step: '02',
        title: 'Window Pull & Sky Replacement',
        detail: 'Blown-out windows are masked to reveal crisp outdoor views and blue skies.',
      },
      {
        step: '03',
        title: '3D Virtual Staging & MLS Export',
        detail: 'Architectural furniture is rendered to match room perspective and lighting, exported ready for MLS.',
      },
    ],
  },
  // ===========================================================================
  // PART 2: VIDEO EDITING SERVICES (4 DEDICATED VIDEO POST-PRODUCTION PAGES)
  // ===========================================================================
  {
    id: 'clipping_path',
    slug: 'commercial-product-video-editing',
    division: 'video_editing',
    indexNumber: 'V1.',
    title: 'Commercial & E-Commerce Product Video Editing Service',
    shortNavTitle: 'Product Video Editing',
    ratePerImage: 29.00,
    unitLabel: 'video clip',
    turnaroundLabel: '24h SLA · 4K 60fps ProRes & MP4',
    artworkType: 'watch',
    isCoreFocus: true,
    heroSubtitle:
      'High-converting 360° product spin videos, Amazon PDP video ads, rotoscoped clean-white product reels, and dynamic motion graphics callouts.',
    summary:
      'Frame-accurate video rotoscoping, background replacement, dust/rig removal, and 4K color grading for commercial product videos.',
    deliverables: '4K H.264/HEVC MP4 · Apple ProRes 422 HQ · 16:9, 9:16 & 1:1 Cuts',
    colSpan: 'lg:col-span-2',
    complexityTiers: [
      {
        tierName: 'E-Commerce PDP Product Loop (15–30s)',
        pricePerImage: '$29.00 / video',
        turnaround: '12–24 Hours SLA',
        description: 'Stabilization, pure white background cleanup, speed ramping, and clean color calibration.',
        examples: 'Shopify product page loops, 360° turntable spins, unboxing clips.',
      },
      {
        tierName: 'Commercial Social Ad & Motion Callouts (30–60s)',
        pricePerImage: '$59.00 / video',
        turnaround: '24 Hours SLA',
        description: 'Multi-angle cutting, kinetic typography specs, licensed sound design, and 9:16 + 16:9 aspect exports.',
        examples: 'Amazon Sponsored Brand videos, Meta/TikTok/YouTube product ads.',
      },
      {
        tierName: 'Frame-by-Frame Rotoscoping & Rig Removal',
        pricePerImage: '$110.00 / video',
        turnaround: '24–48 Hours SLA',
        description: 'After Effects Mocha/Silhouette rotoscoping to remove turntable rigs, wires, and studio reflections.',
        examples: 'Floating luxury watches, levitating footwear, jewelry macro reels.',
      },
    ],
    technicalSpecs: [
      { label: 'Resolution & Codec', value: '4K UHD (3840×2160) · ProRes 422 HQ & H.264/H.265' },
      { label: 'Color Pipeline', value: 'DaVinci Resolve ACES / Rec.709 Calibrated Grading' },
      { label: 'Aspect Ratios', value: '16:9 Horizontal + 9:16 Vertical Reel + 1:1 Square' },
      { label: 'VFX & Cleanup', value: 'Mocha Pro Planar Tracking & Wire/Rig Eradication' },
    ],
    workflowHighlights: [
      {
        step: '01',
        title: 'RAW Log Ingest & Proxy Sync',
        detail: 'Sony S-Log3, Canon C-Log, and RED/ARRI footage is ingested and color-normalized in DaVinci Resolve.',
      },
      {
        step: '02',
        title: 'Precision Cut, Roto & Clean-Plate',
        detail: 'Speed ramps, turntable rig removal, and clean background isolation are executed frame by frame.',
      },
      {
        step: '03',
        title: 'Multi-Format Master Delivery',
        detail: 'Delivered with web-optimized bitrates and unflattened project files upon request.',
      },
    ],
  },
  {
    id: 'beauty_high_end',
    slug: 'fashion-reel-video-editing',
    division: 'video_editing',
    indexNumber: 'V2.',
    title: 'Fashion Campaign, Lookbook & Social Reel Video Editing',
    shortNavTitle: 'Fashion & Reel Video Editing',
    ratePerImage: 45.00,
    unitLabel: 'video edit',
    turnaroundLabel: '24h SLA · Beat-Synced 9:16 & 16:9',
    artworkType: 'mannequin',
    isCoreFocus: true,
    heroSubtitle:
      'High-retention editorial fashion films, runway cuts, and beat-synced 9:16 Instagram/TikTok Reels with optical skin beauty grading and film grain.',
    summary:
      'Turn raw behind-the-scenes and studio motion clips into luxury fashion reels with accurate garment color locking.',
    deliverables: '9:16 Vertical Reels · 16:9 Campaign Master · DaVinci LUT Grade',
    colSpan: 'lg:col-span-1',
    complexityTiers: [
      {
        tierName: 'Social Lookbook Reel (15–30s)',
        pricePerImage: '$45.00 / edit',
        turnaround: '12–24 Hours SLA',
        description: 'Beat-synced pacing, smooth optical flow transitions, and garment-true color grading.',
        examples: 'Instagram Reels, TikTok fashion drops, Pinterest video pins.',
      },
      {
        tierName: 'Seasonal Brand Campaign Film (60–120s)',
        pricePerImage: '$95.00 / edit',
        turnaround: '24–36 Hours SLA',
        description: 'Editorial storytelling, moving skin beauty retouching, sound design, and custom title design.',
        examples: 'Collection launch films, website hero background videos.',
      },
      {
        tierName: 'Multi-Ratio Global Ad Campaign Pack',
        pricePerImage: '$165.00 / pack',
        turnaround: '36–48 Hours SLA',
        description: '1 master edit + 6 localized cutdowns (16:9, 9:16, 4:5, 1:1) with A/B hook variations.',
        examples: 'Paid social performance packs for fashion & beauty brands.',
      },
    ],
    technicalSpecs: [
      { label: 'Beauty Plugin Pipeline', value: 'DaVinci Resolve Face Refinement & Temporal Denoising' },
      { label: 'Frame Rate Support', value: '23.976fps Cinema, 30fps & 60/120fps Slow-Motion' },
      { label: 'Audio Mastering', value: '-14 LUFS Broadcast/Social Loudness Normalization' },
      { label: 'Garment Color Lock', value: 'Secondary Qualifier Masking for True SKU Colors' },
    ],
    workflowHighlights: [
      {
        step: '01',
        title: 'Rhythm & Storyboard Assembly',
        detail: 'Best model movement takes are selected and cut to the exact tempo of your brand soundtrack.',
      },
      {
        step: '02',
        title: 'Moving Skin & Garment Grade',
        detail: 'Tracked power windows keep garment colors accurate while applying editorial skin tones.',
      },
      {
        step: '03',
        title: 'Multi-Platform Export Suite',
        detail: 'Simultaneous delivery of 9:16, 4:5, and 16:9 masters ready for immediate ad manager upload.',
      },
    ],
  },
  {
    id: 'color_variants',
    slug: 'wedding-cinematic-video-editing',
    division: 'video_editing',
    indexNumber: 'V3.',
    title: 'Wedding & Event Cinematic Video Editing Service',
    shortNavTitle: 'Wedding Video Editing',
    ratePerImage: 140.00,
    unitLabel: 'project',
    turnaroundLabel: '72h SLA · Multi-Cam Sync & Color Grade',
    artworkType: 'beauty',
    isCoreFocus: false,
    heroSubtitle:
      'Outsource your wedding film post-production: multi-camera audio/timecode sync, emotional vow storytelling, cinematic color grading, and teaser reels.',
    summary:
      'Dedicated wedding film editors who match your studio’s signature storytelling style, music licensing pacing, and LUTs.',
    deliverables: '4K Highlight Film · Full Ceremony/Speeches Cut · Premiere/Resolve Project',
    colSpan: 'lg:col-span-1',
    complexityTiers: [
      {
        tierName: 'Social Teaser & Highlight Reel (1–3 min)',
        pricePerImage: '$85.00 / project',
        turnaround: '48 Hours SLA',
        description: 'High-impact cinematic teaser cut with vow audio overlays and filmic color grading.',
        examples: 'Next-day wedding teasers, engagement announcement films.',
      },
      {
        tierName: 'Signature Cinematic Highlight Film (5–8 min)',
        pricePerImage: '$160.00 / project',
        turnaround: '72 Hours SLA',
        description: 'Full narrative arc weaving 3–4 camera angles, lapel/recorder audio mastering, and LUT grading.',
        examples: 'Core wedding highlight films, luxury event recaps.',
      },
      {
        tierName: 'Full Documentary Feature + Multi-Cam Edit (30–90 min)',
        pricePerImage: '$260.00 / project',
        turnaround: '4–5 Days SLA',
        description: 'Complete ceremony, speeches, and dances synced across all cameras plus highlight film.',
        examples: 'Multi-day destination weddings, full archival documentary packages.',
      },
    ],
    technicalSpecs: [
      { label: 'NLE Project Files', value: 'Adobe Premiere Pro (.PRPROJ), Final Cut & DaVinci Resolve' },
      { label: 'Audio Engineering', value: 'Izotope RX Dialogue De-Noise, Wind Removal & EQ' },
      { label: 'Multi-Cam Sync', value: 'Up to 6 Camera Angles + 4 External Audio Recorders' },
      { label: 'Color Matching', value: 'Drone, Gimbal & Mirrorless Sensor Profile Matching' },
    ],
    workflowHighlights: [
      {
        step: '01',
        title: 'Proxy Ingest & Multi-Cam Sync',
        detail: 'Send lightweight proxies via cloud portal; we sync all cameras and external Zoom/Tascam audio.',
      },
      {
        step: '02',
        title: 'Narrative Vow & Music Assembly',
        detail: 'Emotional story beats from vows and toasts are woven into a cohesive cinematic timeline.',
      },
      {
        step: '03',
        title: 'Color Grade & XML/Project Return',
        detail: 'Receive both rendered 4K masters and the native Premiere/Resolve project file.',
      },
    ],
  },
  {
    id: 'jewelry_retouch',
    slug: 'video-color-grading-rotoscoping',
    division: 'video_editing',
    indexNumber: 'V4.',
    title: 'Video Color Grading, Rotoscoping & VFX Cleanup Service',
    shortNavTitle: 'Video Color & Rotoscoping',
    ratePerImage: 49.00,
    unitLabel: 'shot / minute',
    turnaroundLabel: '24h SLA · DaVinci Resolve & Nuke/AE',
    artworkType: 'jewelry',
    isCoreFocus: true,
    heroSubtitle:
      'Specialized DaVinci Resolve color grading, green-screen chroma keying, object/wire removal, and frame-accurate alpha matte rotoscoping.',
    summary:
      'Studio-grade finishing for production houses and commercial agencies needing clean VFX plates and calibrated color pipelines.',
    deliverables: 'ProRes 4444 Alpha Mattes · EXR Sequences · Rec.709 / HDR Masters',
    colSpan: 'lg:col-span-2',
    complexityTiers: [
      {
        tierName: 'Commercial Color Grading & Shot Matching',
        pricePerImage: '$49.00 / minute',
        turnaround: '24 Hours SLA',
        description: 'Primary exposure/white balance normalization, secondary skin/product tracking, and commercial LUT look.',
        examples: 'Brand commercials, interviews, luxury jewelry & automotive spots.',
      },
      {
        tierName: 'Green Screen Chroma Key & Spill Suppression',
        pricePerImage: '$65.00 / clip',
        turnaround: '12–24 Hours SLA',
        description: 'Fine hair detail extraction, green/blue spill neutralization, and background plate compositing.',
        examples: 'Studio presenter videos, virtual production plates, e-commerce models.',
      },
      {
        tierName: 'Frame-by-Frame Silhouette Rotoscoping',
        pricePerImage: '$95.00 / clip',
        turnaround: '24–48 Hours SLA',
        description: 'Articulated spline rotoscoping for complex moving subjects without a green screen.',
        examples: 'VFX isolation mattes, Rig/boom mic removal, screen replacements.',
      },
    ],
    technicalSpecs: [
      { label: 'Alpha Delivery', value: 'Apple ProRes 4444 with Straight/Premultiplied Alpha' },
      { label: 'Tracking Engine', value: 'Mocha Pro, Silhouette & DaVinci Magic Mask' },
      { label: 'Color Science', value: 'ACEScct 32-Bit Float Color Management' },
      { label: 'Frame Accuracy', value: 'Zero Matte Chatter Guaranteed Across Motion Blur' },
    ],
    workflowHighlights: [
      {
        step: '01',
        title: 'Shot Diagnostics & Plate Prep',
        detail: 'Camera noise profile is analyzed and denoised cleanly before keying or spline tracking.',
      },
      {
        step: '02',
        title: 'Spline Roto & Tracked Windows',
        detail: 'Separate motion-tracked splines isolate limbs, hair, and product edges with realistic motion blur.',
      },
      {
        step: '03',
        title: 'Final Composite & QC Playback',
        detail: 'Audited frame by frame on calibrated reference monitors before ProRes 4444 delivery.',
      },
    ],
  },
];

export interface CustomerReviewItem {
  id: string;
  clientName: string;
  role: string;
  company: string;
  location: string;
  serviceCategory: ServiceCategory;
  serviceLabel: string;
  rating: number;
  verifiedOrderRef: string;
  imagesProcessed: string;
  headline: string;
  quote: string;
  measurableResult: string;
  dateLabel: string;
}

export const INITIAL_CUSTOMER_REVIEWS: CustomerReviewItem[] = [
  {
    id: 'rev-101',
    clientName: 'Henrik Lindqvist',
    role: 'Head of Studio Production',
    company: 'Vacheron & Nordic Timepieces',
    location: 'Geneva & Stockholm',
    serviceCategory: 'clipping_path',
    serviceLabel: 'Clipping Path & Watch Retouching',
    rating: 5,
    verifiedOrderRef: 'FPS-2026-8410',
    imagesProcessed: '4,200+ Frames',
    headline: 'Zero white halos and razor-sharp 14-path horology masks on every single watch.',
    quote:
      'Before switching to FixPhoto Studio, our in-house team spent 45 minutes per chronograph isolating brushed lugs, crowns, and alligator straps. FixPhoto delivers 14 clean vector paths per timepiece in under 8 hours with 100% consistent specular reflections.',
    measurableResult: 'Saved 180+ studio hours/month · 99.96% QA pass rate',
    dateLabel: 'October 2026',
  },
  {
    id: 'rev-102',
    clientName: 'Camille Laurent',
    role: 'E-Commerce Creative Director',
    company: 'Maison Atelier Apparel',
    location: 'Paris, France',
    serviceCategory: 'ghost_mannequin',
    serviceLabel: 'Ghost Mannequin & Fashion Editing',
    rating: 5,
    verifiedOrderRef: 'FPS-2026-8192',
    imagesProcessed: '11,500+ Frames',
    headline: 'Our seasonal lookbook return rate dropped 28% thanks to symmetrical 3D ghost mannequins.',
    quote:
      'Their neck-joint composites and shoulder symmetry shaping make our linen blazers and silk dresses look like they are floating in 3D space. We upload 400 RAW files at 6 PM Paris time and wake up to finished 16-bit TIFF masters.',
    measurableResult: '12h Overnight Turnaround · -28% Customer Fit Returns',
    dateLabel: 'October 2026',
  },
  {
    id: 'rev-103',
    clientName: 'Arjun Mehta',
    role: 'VP of Digital Merchandising',
    company: 'Aurelia Fine Diamonds & Gold',
    location: 'New York & Mumbai',
    serviceCategory: 'jewelry_retouch',
    serviceLabel: 'Jewelry Photo Retouching & Video Reels',
    rating: 5,
    verifiedOrderRef: 'FPS-2026-7904',
    imagesProcessed: '6,800+ Frames & 120 Videos',
    headline: 'Pavé diamond fire and liquid-mirror 18K gold polishing that tripled our zoom engagement.',
    quote:
      'Macro jewelry photography always shows positioning wax, dust, and green lens reflections inside diamond facets. FixPhoto Studio reconstructs every micro-prong and also rotoscopes our 360° turntable ring videos onto pure white.',
    measurableResult: '+62% Checkout Conversion on High-Ticket Rings',
    dateLabel: 'September 2026',
  },
  {
    id: 'rev-104',
    clientName: 'Elena Vance-Sterling',
    role: 'Executive Producer',
    company: 'Kinetix Footwear Collective',
    location: 'Portland, USA',
    serviceCategory: 'ecommerce_shadow',
    serviceLabel: 'Product Photo Editing & Background Removal',
    rating: 5,
    verifiedOrderRef: 'FPS-2026-8620',
    imagesProcessed: '19,400+ Frames',
    headline: '85 consecutive sneaker drops delivered on an Express SLA without a single missed deadline.',
    quote:
      'Every sneaker frame comes back on pure #FFFFFF white with a separate natural ground contact shadow layer and zero glue residue on the midsole stitching. The integrated live specialist chat inside each order is a game changer.',
    measurableResult: '8h Average Express Delivery · $148k Saved Annually',
    dateLabel: 'October 2026',
  },
  {
    id: 'rev-105',
    clientName: 'Soo-Jin Park',
    role: 'Brand Art Director',
    company: 'Sérum Botanique Lab',
    location: 'Seoul, South Korea',
    serviceCategory: 'beauty_high_end',
    serviceLabel: 'High-End Beauty & Headshot Retouching',
    rating: 5,
    verifiedOrderRef: 'FPS-2026-8305',
    imagesProcessed: '1,850+ Frames',
    headline: 'True pore-level frequency separation and hair masking that never looks plastic.',
    quote:
      'We shoot 100-megapixel medium format beauty campaigns where every pore is visible. FixPhoto Studio retains 100% authentic dermal texture while evening out T-zone shine and matching our cosmetic packaging within ΔE 0.3.',
    measurableResult: '100% Retoucher Stylebook Compliance on First Pass',
    dateLabel: 'September 2026',
  },
  {
    id: 'rev-106',
    clientName: 'Lucas Meyer',
    role: 'Catalog Operations Lead',
    company: 'Nordic Home & Bridal Studio',
    location: 'Copenhagen, Denmark',
    serviceCategory: 'color_variants',
    serviceLabel: 'Color Correction & Wedding Editing',
    rating: 5,
    verifiedOrderRef: 'FPS-2026-8511',
    imagesProcessed: '9,300+ Frames',
    headline: 'Generated 18 Pantone-accurate colorway SKUs from a single studio hero shot.',
    quote:
      'Instead of shooting 18 colors of every sofa and jacket, we shoot one neutral grey master and send the Pantone TCX codes to FixPhoto Studio. Their color correction and wedding gallery grading pods are unmatched in speed.',
    measurableResult: '-74% Studio Photography Cost per Seasonal Launch',
    dateLabel: 'October 2026',
  },
];

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'pf-watch-01',
    title: 'Calibre 89 Chronograph Multi-Path & Crystal Anti-Glare',
    clientBrand: 'Vacheron & Sons Horology, Geneva',
    category: 'clipping_path',
    categoryLabel: 'Clipping Path & Specular Control',
    artworkType: 'watch',
    turnaround: '8h Express Delivery',
    pricePerImage: '$1.20 / frame',
    anchorNodes: 348,
    colorProfile: 'AdobeRGB 1998 · 16-Bit TIFF',
    beforeNotes: 'Raw 4100K tungsten cast, harsh sapphire crystal hot-spot, unclipped alligator strap stitching.',
    afterNotes: '14 independent vector masks separating bezel, sub-dials, hands, and brushed lugs with controlled studio gradient.',
    metricsOutcome: '+41% Zoom-Inspect Engagement on Product PDP',
    aspectClass: 'h-80',
    colSpanClass: 'lg:col-span-2',
  },
  {
    id: 'pf-apparel-02',
    title: 'Autumn Tailored Double-Breasted Blazer 3D Neck Composite',
    clientBrand: 'Atelier Nord Menswear, Stockholm',
    category: 'ghost_mannequin',
    categoryLabel: 'Invisible Ghost Mannequin',
    artworkType: 'mannequin',
    turnaround: '12h Standard SLA',
    pricePerImage: '$0.85 / frame',
    anchorNodes: 210,
    colorProfile: 'sRGB IEC61966-2.1 · Layered PSD',
    beforeNotes: 'Visible matte acrylic mannequin neck post, asymmetrical sleeve hang, and shipping lapel creases.',
    afterNotes: 'Seamless inner-collar insert composite, symmetrical hemline alignment, and natural wool depth shading.',
    metricsOutcome: '-28% Size/Fit Return Rate Across 1,400 SKUs',
    aspectClass: 'h-80',
    colSpanClass: 'lg:col-span-1',
  },
  {
    id: 'pf-jewelry-03',
    title: 'Pavé Platinum Solitaire Micro-Facet & Prong Reconstruction',
    clientBrand: 'Maison Lumière Fine Jewelry, Paris',
    category: 'jewelry_retouch',
    categoryLabel: 'Fine Jewelry Retouching',
    artworkType: 'jewelry',
    turnaround: '24h Master Retouch',
    pricePerImage: '$2.40 / frame',
    anchorNodes: 490,
    colorProfile: 'ProPhoto RGB · 16-Bit PSD',
    beforeNotes: 'Hot-glue positioning wax at base, green camera lens reflection inside table facet, micro-pitting on shank.',
    afterNotes: 'Hand-reconstructed platinum mirror finish, neutral white-fire facet brilliance, and grounded contact shadow.',
    metricsOutcome: '+62% High-Ticket Online Checkout Conversion',
    aspectClass: 'h-72',
    colSpanClass: 'lg:col-span-1',
  },
  {
    id: 'pf-footwear-04',
    title: 'Artisan Court Leather Sneaker Ground Shadow & Color Match',
    clientBrand: 'Veloce Footwear Collective, Milan',
    category: 'ecommerce_shadow',
    categoryLabel: 'Product Photo Retouching',
    artworkType: 'footwear',
    turnaround: '6h Rush Batch',
    pricePerImage: '$0.65 / frame',
    anchorNodes: 184,
    colorProfile: 'sRGB · Pure #FFFFFF Canvas',
    beforeNotes: 'Uneven acrylic studio sweep horizon, glue residue along gum outsole, off-axis toe cap perspective.',
    afterNotes: 'Pure RGB(255,255,255) marketplace backdrop, dual-density grounded shadow, and Pantone-calibrated suede.',
    metricsOutcome: '3,800 Footwear Frames Delivered in 18 Hours',
    aspectClass: 'h-72',
    colSpanClass: 'lg:col-span-1',
  },
  {
    id: 'pf-beauty-05',
    title: 'Editorial Campaign Skin Frequency Separation & Tonal Grade',
    clientBrand: 'Sérum Botanique Cosmetics, Seoul & New York',
    category: 'beauty_high_end',
    categoryLabel: 'High-End Beauty & Fashion',
    artworkType: 'beauty',
    turnaround: '24h Senior Retoucher',
    pricePerImage: '$3.50 / frame',
    anchorNodes: 160,
    colorProfile: 'AdobeRGB 1998 · Non-Destructive PSD',
    beforeNotes: 'Uneven key-light specular shine on T-zone, stray studio wind hairs, ΔE 4.8 color drift on packaging.',
    afterNotes: '16-bit frequency separation preserving 100% natural dermal texture, ΔE 0.3 Pantone cosmetic match.',
    metricsOutcome: '+140% Qualified B2B Retail Buyer Inquiries in 60 Days',
    aspectClass: 'h-72',
    colSpanClass: 'lg:col-span-1',
  },
  {
    id: 'pf-realestate-06',
    title: 'Penthouse Interior HDR Flambient Window Pull & 3D Virtual Staging',
    clientBrand: 'Sotheby’s & Vanguard Architectural Realty, Miami',
    category: 'color_variants',
    categoryLabel: 'Real Estate Photo (HDR & Staging)',
    artworkType: 'real_estate',
    turnaround: '8h Overnight Delivery',
    pricePerImage: '$0.80 / HDR · $14 / Stage',
    anchorNodes: 265,
    colorProfile: 'sRGB MLS Ready · 16-Bit TIFF',
    beforeNotes: 'Empty unstaged living room, +3.5 EV blown-out panoramic window, warm 3100K ceiling cast.',
    afterNotes: 'Hand-blended 5-bracket HDR window pull showing coastal skyline plus ray-traced 3D sofa & rug staging.',
    metricsOutcome: 'Sold 3.2× Faster Than Unstaged Comparable Listings',
    aspectClass: 'h-72',
    colSpanClass: 'lg:col-span-2',
  },
];

export interface VideoShowreelProject {
  id: string;
  title: string;
  clientBrand: string;
  category: 'ecommerce_product' | 'social_reels' | 'real_estate_drone' | 'wedding_cinema' | 'color_vfx';
  categoryLabel: string;
  duration: string;
  resolutionFps: string;
  turnaround: string;
  priceLabel: string;
  lutProfile: string;
  vfxHighlights: string[];
  outcomeMetric: string;
  serviceSlug: string;
  thumbnailImageUrl?: string;
  videoPreviewUrl?: string;
}

export const VIDEO_SHOWREEL_PROJECTS: VideoShowreelProject[] = [
  {
    id: 'vid-01',
    title: 'Calibre 89 Chronograph 360° Rig Removal & Floating Water Splash Ad',
    clientBrand: 'Vacheron & Nordic Timepieces',
    category: 'ecommerce_product',
    categoryLabel: 'E-Commerce Product Video',
    duration: '00:30s (16:9 + 9:16 + 1:1)',
    resolutionFps: '4K UHD · 60fps · ProRes 422 HQ',
    turnaround: '24h Express SLA',
    priceLabel: '$59 / video',
    lutProfile: 'DaVinci Resolve ACEScct Metallic Specular Grade',
    vfxHighlights: [
      'Mocha Pro Planar Tracking & Turntable Rig Removal',
      'Pure #FFFFFF & Deep Navy Dynamic Backdrop Swap',
      'Kinetic Spec Callouts & Sub-Bass Sound Design',
    ],
    outcomeMetric: '+4.4× ROAS on Meta & Amazon Sponsored Brand Video',
    serviceSlug: 'commercial-product-video-editing',
  },
  {
    id: 'vid-02',
    title: 'Autumn Runway & Streetwear High-Retention Beat-Synced Reel Pack',
    clientBrand: 'Atelier Nord & Kinetix Collective',
    category: 'social_reels',
    categoryLabel: 'Reels, TikTok & Shorts',
    duration: '00:22s × 5 Hook Variations',
    resolutionFps: '4K Vertical (2160×3840) · 60fps',
    turnaround: '12–24h SLA',
    priceLabel: '$45 / reel',
    lutProfile: 'Kodak 2383 Film Emulation + Pantone Garment Lock',
    vfxHighlights: [
      'Speed-Ramped Optical Flow Transitions on Beat Drops',
      'Tracked Secondary Masking Locking True Garment SKU Colors',
      'Dynamic Animated Captions & -14 LUFS Audio Mastering',
    ],
    outcomeMetric: '78% 3-Second Hook Retention · 1.4M Organic Views',
    serviceSlug: 'fashion-reel-video-editing',
  },
  {
    id: 'vid-03',
    title: 'Miami Waterfront Villa FPV Drone Speed-Ramp & 3D Callout Tour',
    clientBrand: 'Vanguard Architectural Realty',
    category: 'real_estate_drone',
    categoryLabel: 'Real Estate & Drone Video',
    duration: '02:15s Full Property Film',
    resolutionFps: '4K UHD · 60fps HDR Rec.2020',
    turnaround: '24h Overnight SLA',
    priceLabel: '$75 / property video',
    lutProfile: 'Architectural Daylight Neutral + Golden Hour Sky Grade',
    vfxHighlights: [
      '3D Camera-Tracked Property Lot Boundary Lines & Callouts',
      'Warp Stabilizer & Horizon Lock on Indoor FPV Drone Flythrough',
      'Day-to-Dusk Sky Replacement & Interior Window Exposure Balance',
    ],
    outcomeMetric: '310% More Private Showing Requests in 7 Days',
    serviceSlug: 'commercial-product-video-editing',
  },
  {
    id: 'vid-04',
    title: 'Lake Como Destination Wedding 4-Camera Narrative Feature & Teaser',
    clientBrand: 'Lumière Bridal Cinema Studio',
    category: 'wedding_cinema',
    categoryLabel: 'Wedding & Event Cinema',
    duration: '06:40s Highlight + 01:00s Teaser',
    resolutionFps: '4K 23.976fps Cinema Scope',
    turnaround: '72h Studio SLA',
    priceLabel: '$140 / project',
    lutProfile: ' Sony S-Log3 to Fine-Art Warm Skin Tone LUT',
    vfxHighlights: [
      '4-Camera Timecode Sync + Izotope RX Lapel Vow De-Noising',
      'Emotional Story Arc Weaving Ceremony, Speeches & Aerials',
      'Delivered as 4K MP4 Master + Native Premiere/Resolve Project',
    ],
    outcomeMetric: 'Saved Studio 22 Editing Hours per Wedding Weekend',
    serviceSlug: 'wedding-cinematic-video-editing',
  },
  {
    id: 'vid-05',
    title: 'Haute Joaillerie Diamond Necklace Frame-by-Frame Silhouette Roto',
    clientBrand: 'Maison Lumière Paris',
    category: 'color_vfx',
    categoryLabel: 'Color Grading, Roto & VFX',
    duration: '00:45s Commercial Master',
    resolutionFps: '4K ProRes 4444 Alpha (12-Bit)',
    turnaround: '24–36h SLA',
    priceLabel: '$49 / min grade · $65 / roto',
    lutProfile: '32-Bit Float ACES Color Pipeline',
    vfxHighlights: [
      'Articulated Spline Rotoscoping with Zero Motion-Blur Chatter',
      'Micro-Scratch & Studio Reflection Cleanup on Moving 18K Gold',
      'Custom Optical Starburst Glints on Diamond Facets',
    ],
    outcomeMetric: 'Broadcast & Flagship LED Wall Approved on First Pass',
    serviceSlug: 'video-color-grading-rotoscoping',
  },
];

export const CASE_STUDIES = [
  {
    id: 'cs-1',
    metric: '14,200 SKUs in 72 Hours',
    delta: '-64% Post-Production Cost vs. In-House',
    clientName: 'Marcus Lindqvist',
    clientRole: 'VP of Studio Operations',
    organization: 'Nordic Apparel Group (Stockholm)',
    beforeState:
      'Seasonal 14,000-piece lookbook launches were bottlenecked by a 3-week editing backlog and inconsistent neck-joint composites across 6 freelance retouchers.',
    solutionState:
      'Migrated to FixPhoto Studio dedicated 40-seat pod with automated FTP/portal batch ingestion and standardized 3D ghost mannequin style guides.',
    outcomeState:
      'Cut average SKU time-to-site from 19 days to 14 hours while achieving 99.94% first-pass QA approval across web and print catalogs.',
  },
  {
    id: 'cs-2',
    metric: '+38% Product Page Conversion',
    delta: '99.98% Marketplace Compliance',
    clientName: 'Sophia Chen-Vane',
    clientRole: 'Creative Director',
    organization: 'Aurelia Fine Timepieces & Jewelry (Geneva)',
    beforeState:
      'Macro jewelry and watch captures suffered from muddy metallic reflections and jagged clipping edges on 4K retina displays.',
    solutionState:
      'Implemented multi-path Bezier isolation (12+ alpha masks per timepiece) with standardized brushed-steel gradient reconstruction.',
    outcomeState:
      'Increased online boutique conversion by 38% in 90 days and eliminated marketplace listing rejections across 24 international storefronts.',
  },
  {
    id: 'cs-3',
    metric: '8 Hour Average Express SLA',
    delta: '1,200 Daily Active Frames',
    clientName: 'David K. Thorne',
    clientRole: 'Head of E-Commerce Production',
    organization: 'Kinetix Footwear & Athletics (Portland)',
    beforeState:
      'Daily drop sneaker releases required same-day color variant generation and natural shadow grounding before 5:00 PM EST.',
    solutionState:
      'Integrated FixPhoto Studio Pro subscription with priority express routing and Pantone TCX digital swatch locking.',
    outcomeState:
      'Launched 85 consecutive product drops with zero missed deadlines and saved $148,000 in annual sample reshoot expenses.',
  },
];

export interface SubscriptionPlanSpec {
  id: 'starter' | 'studio_pro' | 'enterprise';
  audienceTag: string;
  name: string;
  monthlyPrice: number;
  annualPricePerMonth: number;
  monthlyCredits: number;
  effectiveRate: string;
  slaHours: string;
  dedicatedTeam: string;
  formatsSupported: string;
  securityFeatures: string;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlanSpec[] = [
  {
    id: 'starter',
    audienceTag: 'For Emerging Studios & Boutiques',
    name: 'Studio Starter',
    monthlyPrice: 149,
    annualPricePerMonth: 119,
    monthlyCredits: 350,
    effectiveRate: '$0.42 / image base credit',
    slaHours: '24-Hour Standard SLA',
    dedicatedTeam: 'Shared Senior QA Pod · 2 Revisions Included',
    formatsSupported: 'JPG sRGB · PNG Transparent · Layered PSD',
    securityFeatures: 'TOTP Multi-Factor Auth · Encrypted Portal Delivery',
  },
  {
    id: 'studio_pro',
    audienceTag: 'For Scaling E-Commerce Brands',
    name: 'Studio Pro Agency',
    monthlyPrice: 449,
    annualPricePerMonth: 359,
    monthlyCredits: 1250,
    effectiveRate: '$0.35 / image base credit',
    slaHours: '12-Hour Express SLA',
    dedicatedTeam: 'Dedicated 8-Retoucher Pod + Custom Brand Stylebook',
    formatsSupported: '16-Bit TIFF · Multi-Path PSD · 4K Video Cuts',
    securityFeatures: 'Mandatory MFA · Private PII Vault · Priority Live Chat',
  },
  {
    id: 'enterprise',
    audienceTag: 'For High-Volume Catalogs & Marketplaces',
    name: 'Enterprise Production Pod',
    monthlyPrice: 1290,
    annualPricePerMonth: 1050,
    monthlyCredits: 4500,
    effectiveRate: '$0.28 / image base credit',
    slaHours: '8–12 Hour Express SLA Guaranteed',
    dedicatedTeam: '25-Seat 24/7 Photo & Video Pod + Account Director',
    formatsSupported: 'All RAW/PSD/TIFF & ProRes 4444 Video · SFTP Sync',
    securityFeatures: 'Hardware Token MFA · ISO-Aligned NDA · Custom Retention',
  },
];

export const PIPELINE_STAGES: {
  status: OrderStatus;
  stepIndex: string;
  label: string;
  progress: number;
  description: string;
}[] = [
  {
    status: 'ingesting',
    stepIndex: '01',
    label: 'Order Received',
    progress: 25,
    description:
      'Order received and verified by FixPhoto Studio Admin.',
  },
  {
    status: 'retouching',
    stepIndex: '02',
    label: 'Start Working',
    progress: 50,
    description:
      'Dedicated studio specialists have started working on your files.',
  },
  {
    status: 'qa_review',
    stepIndex: '03',
    label: 'Quality Control Processing',
    progress: 75,
    description:
      'Quality Control team is inspecting and verifying all edited files.',
  },
  {
    status: 'completed',
    stepIndex: '04',
    label: 'Ready for Delivery',
    progress: 100,
    description:
      'Your edited files are complete and your download link is ready for delivery.',
  },
];

export interface StudioBlogPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  authorName: string;
  authorRole: string;
  readTime: string;
  publishedAt: string;
  viewsCount?: number;
  coverImageUrl?: string;
  artworkType?: 'watch' | 'mannequin' | 'jewelry' | 'footwear' | 'beauty' | 'variant' | 'real_estate';
  relatedServiceSlug?: string;
  seoTitle?: string;
  seoMetaDescription?: string;
  faqs?: ServiceFaqItem[];
}

export const DEFAULT_BLOG_FAQS: ServiceFaqItem[] = [
  {
    question: 'How fast can FixPhoto Studio deliver bulk Photo & Video Editing orders?',
    answer:
      'Our 24/7 dedicated production pods process up to 3,500+ frames per day. Standard delivery is 12–24 hours, while urgent e-commerce launches can select our 12-Hour Express SLA at checkout with real-time stage tracking inside the Client Portal.',
  },
  {
    question: 'Can I test your Photo or Video Retouching quality with a Free Trial first?',
    answer:
      'Yes. You can upload up to 5 RAW or studio frames (or 1 test video clip) free of charge via our Free Trial page. Our senior specialists will execute your exact style brief so you can inspect the 400% zoom quality before placing a bulk order.',
  },
  {
    question: 'What file formats and color profiles do you support for commercial production?',
    answer:
      'We ingest all RAW camera formats (CR3, NEF, ARW, DNG), layered PSD, 16-bit TIFF, PNG, and 4K ProRes/MP4 video. We deliver in sRGB IEC61966-2.1, AdobeRGB 1998, or Rec.709 with embedded vector clipping paths and intact alpha channels.',
  },
  {
    question: 'How does your 400% Zoom Dual-Stage QA & Free Revision policy work?',
    answer:
      'Every frame undergoes a two-stage quality audit at 400% pixel magnification by an independent QA lead. If any edge, shadow, or color tone requires adjustment, unlimited revisions are included at no extra cost.',
  },
  {
    question: 'Do you offer volume discounts for recurring catalog shoots?',
    answer:
      'Yes. High-volume e-commerce catalogs, seasonal lookbooks, and agency partners automatically receive up to 25% volume discounts along with a dedicated retouching pod locked to your brand stylebook.',
  },
  {
    question: 'How do you protect unreleased product launches and client intellectual property?',
    answer:
      'All file transfers occur over 256-bit encrypted portals and SFTP. We operate under strict ISO-aligned Non-Disclosure Agreements (NDA) so your unreleased collections are never shared or used publicly without authorization.',
  },
];

export const INITIAL_BLOG_POSTS: StudioBlogPost[] = [
  {
    id: 'blog-01',
    slug: 'why-manual-bezier-clipping-path-outperforms-automated-ai-cutouts',
    title: 'Why Hand-Drawn Bezier Clipping Paths Outperform Automated Cutouts for Luxury E-Commerce',
    category: 'Clipping Path & E-Commerce',
    excerpt:
      'Discover how 300+ anchor-node manual Pen-Tool vector paths with 0.25px choke feathering prevent white halos on 4K retina displays and boost marketplace conversion.',
    content:
      'When luxury watchmakers, footwear brands, and high-volume Shopify or Amazon retailers publish product imagery on 4K retina displays, automated magic-wand or one-click AI background removal tools frequently leave jagged alpha stair-stepping, missing internal cutouts around buckles and chains, and chalky white edge halos.\n\nAt FixPhoto Studio, our senior vector specialists plot every anchor node manually at 300%–400% zoom using the Adobe Photoshop Pen Tool. By isolating hardware, straps, soles, and translucent surfaces onto independent Working Paths with a calibrated 0.25px–0.5px edge choke, your master PSD and TIFF files pass Amazon, Farfetch, and Net-a-Porter compliance on the first submission while increasing product page conversion by up to 38%.\n\nEvery multi-path order also includes organized layer naming so your internal art directors can swap background colors, adjust specular metal highlights, or re-color leather straps in seconds without re-masking the product.',
    authorName: 'Elena Rostova',
    authorRole: 'Lead Vector & Retouching Director',
    readTime: '5 min read',
    publishedAt: 'Nov 5, 2026',
    viewsCount: 4820,
    artworkType: 'watch',
    relatedServiceSlug: 'clipping-path-service',
    seoTitle: 'Hand-Drawn Bezier Clipping Path vs Automated Cutouts | FixPhoto Studio Blog',
    seoMetaDescription:
      'Learn why 300+ anchor-node manual Pen-Tool vector clipping paths with 0.25px choke feathering outperform automated cutouts for luxury e-commerce catalogs.',
  },
  {
    id: 'blog-02',
    slug: '3d-ghost-mannequin-neck-joint-workflow-for-apparel-lookbooks',
    title: 'The Complete 3D Ghost Mannequin & Neck-Joint Workflow for Seasonal Fashion Lookbooks',
    category: '3D Ghost Mannequin',
    excerpt:
      'How to capture front, back, and inner-label plates on set so your post-production pod can build seamless hollow-mannequin composites in under 12 hours.',
    content:
      'Shooting apparel on a matte white mannequin gives garments natural 3D drape and shoulder structure that flat-lay photography cannot replicate. However, achieving an invisible hollow-neck composite requires both disciplined studio capture and precision liquify and shadow reconstruction.\n\nBy capturing a dedicated inner-neck and brand-label plate at matching focal length and color temperature, our dedicated apparel retouching pod seamlessly aligns collar seams, reconstructs natural interior depth gradients, and locks Pantone garment colors across 1,000+ SKU seasonal drops.\n\nWe also apply symmetric hemline alignment and fabric crease refinement while preserving authentic weave texture—ensuring every jacket, shirt, and dress looks tailored and consistent across your entire online store.',
    authorName: 'Marcus Vance',
    authorRole: 'Senior Fashion Post-Production Lead',
    readTime: '6 min read',
    publishedAt: 'Oct 28, 2026',
    viewsCount: 3940,
    artworkType: 'mannequin',
    relatedServiceSlug: 'ghost-mannequin-services',
    seoTitle: '3D Ghost Mannequin & Neck-Joint Workflow Guide | FixPhoto Studio Blog',
    seoMetaDescription:
      'Step-by-step commercial fashion guide to shooting and compositing invisible 3D ghost mannequin apparel photography with 12-hour turnaround.',
  },
  {
    id: 'blog-03',
    slug: 'high-end-jewelry-retouching-and-4k-product-video-rotoscoping',
    title: 'Mastering Macro Jewelry Retouching & 4K Product Video Rig Removal for Fine Joaillerie',
    category: 'Jewelry & 4K Video',
    excerpt:
      'Inside our multi-path metal gradient reconstruction, diamond facet dispersion enhancement, and Mocha Pro planar tracking pipeline.',
    content:
      'Macro photography and 360-degree turntable video of rings, necklaces, and pavé diamonds magnify every microscopic casting pore, studio reflection, and acrylic support rig. Standard global contrast adjustments crush diamond fire and turn 18K gold muddy.\n\nOur fine jewelry division separates every gemstone facet, prong, and shank onto independent vector masks—rebuilding silky metallic reflections and optical starbursts in 16-bit TIFF and 4K ProRes 4444 masters.\n\nFor commercial product videos, we utilize Mocha Pro planar tracking and frame-accurate rotoscoping to erase hot-glue mounts and fishing lines while maintaining natural contact shadows on pure white or dark luxury surfaces.',
    authorName: 'Sophia Laurent',
    authorRole: 'Head of Fine Jewelry & ACES Color',
    readTime: '7 min read',
    publishedAt: 'Oct 19, 2026',
    viewsCount: 3510,
    artworkType: 'jewelry',
    relatedServiceSlug: 'jewelry-retouching-services',
    seoTitle: 'Macro Jewelry Retouching & 4K Video Rig Removal | FixPhoto Studio Blog',
    seoMetaDescription:
      'Discover how FixPhoto Studio executes multi-path metal polishing, diamond facet dispersion enhancement, and 4K video rotoscoping for fine jewelry brands.',
  },
  {
    id: 'blog-04',
    slug: 'real-estate-hdr-flambient-blending-and-twilight-sky-replacement',
    title: 'Flambient HDR Exposure Blending & Dusk Sky Replacement for Luxury Real Estate',
    category: 'Real Estate HDR',
    excerpt:
      'How combining ambient brackets with flash frames eliminates window blowouts, corrects color casts, and sells architectural listings faster.',
    content:
      'Architectural and real estate photographers face extreme dynamic range challenges when shooting bright sunlit windows alongside warm interior lighting. Automated HDR software often produces flat, muddy midtones and unnatural halos around window frames.\n\nOur real estate editing pod hand-blends 3 to 7 bracketed ambient exposures with dedicated flash frames (Flambient workflow), pulls crisp exterior views through every window, enforces strict vertical and horizontal perspective lines, and removes driveway clutter or power lines.\n\nFor hero exterior shots, our Day-to-Dusk virtual twilight conversion replaces overcast skies with calibrated sunset gradients and warm interior window glow within a guaranteed 12-hour overnight turnaround.',
    authorName: 'David Chen',
    authorRole: 'Architectural HDR Lead Specialist',
    readTime: '5 min read',
    publishedAt: 'Oct 11, 2026',
    viewsCount: 2890,
    artworkType: 'real_estate',
    relatedServiceSlug: 'real-estate-photo-editing',
    seoTitle: 'Real Estate Flambient HDR Blending & Twilight Editing | FixPhoto Studio Blog',
    seoMetaDescription:
      'Learn how manual Flambient HDR exposure blending, window pull masking, and virtual twilight sky replacement elevate luxury real estate photography.',
  },
  {
    id: 'blog-05',
    slug: 'non-destructive-frequency-separation-for-beauty-and-editorial-campaigns',
    title: 'Non-Destructive 16-Bit Frequency Separation & Dodge-and-Burn for Beauty Campaigns',
    category: 'High-End Beauty',
    excerpt:
      'Why leading cosmetic brands demand micro-dodge-and-burn and intact pore structure over plastic blur filters for 4K print and digital billboards.',
    content:
      'High-resolution beauty, cosmetics, and executive portrait campaigns require flawless skin luminosity without sacrificing authentic pore micro-texture. Over-filtering or automated skin smoothing immediately looks artificial on modern 4K displays and large-format retail lightboxes.\n\nAt FixPhoto Studio, our senior beauty retouchers work non-destructively in 16-bit PSD layers using calibrated Dual-Frequency Separation and pixel-level Dodge & Burn. We balance redness and uneven transitions on the low-frequency color layer while healing individual flyaway hairs and blemishes on the high-frequency texture layer.\n\nEvery file is delivered with intact adjustment layers so creative directors retain full control over skin warmth, lip saturation, and catchlight intensity.',
    authorName: 'Elena Rostova',
    authorRole: 'Lead Vector & Retouching Director',
    readTime: '6 min read',
    publishedAt: 'Oct 02, 2026',
    viewsCount: 2460,
    artworkType: 'beauty',
    relatedServiceSlug: 'high-end-retouching-services',
    seoTitle: '16-Bit Frequency Separation & Beauty Retouching Guide | FixPhoto Studio Blog',
    seoMetaDescription:
      'Explore non-destructive 16-bit Frequency Separation and micro Dodge & Burn techniques for commercial beauty, fashion, and headshot photography.',
  },
];



