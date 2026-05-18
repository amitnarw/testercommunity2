import exifr from "exifr";

const MIN_WIDTH = 200;
const MIN_HEIGHT = 200;
const MIN_FILE_SIZE = 10 * 1024;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const LEGIT_SOFTWARE_KEYWORDS = [
  "android",
  "samsung",
  "one ui",
  "oneui",
  "xiaomi",
  "miui",
  "oppo",
  "coloros",
  "vivo",
  "funtouch",
  "realme",
  "google",
  "pixel",
  "nothing",
];
const EPOCH_MS = 86400000;

const EDITING_SOFTWARE_PATTERNS = [
  /photoshop/i,
  /adobe/i,
  /lightroom/i,
  /illustrator/i,
  /after effects/i,
  /gimp/i,
  /affinity/i,
  /pixelmator/i,
  /paint\.net/i,
  /corel/i,
  /paintshop/i,
  /canva/i,
  /picsart/i,
  /snapseed/i,
  /vsco/i,
  /inshot/i,
  /fotor/i,
  /polarr/i,
  /facetune/i,
  /kapwing/i,
  /figma/i,
  /sketch/i,
  /edited/i,
  /modified/i,
];

const SOCIAL_MEDIA_PATTERNS = [
  /wa\d{4,}/i,
  /whatsapp/i,
  /telegram/i,
  /signal/i,
  /instagram/i,
  /fb_img/i,
  /messenger/i,
  /drive_/i,
  /gmail/i,
  /dropbox/i,
  /icloud/i,
  /^photo_\d{4}-\d{2}-\d{2}_/i,
  /^video_\d{4}-\d{2}-\d{2}_/i,
  /^vid-\d{8}-/i,
];

const SUSPICIOUS_FILENAME_PATTERNS = [
  /edit/i,
  /edited/i,
  /modified/i,
  /cropped/i,
  /crop/i,
  /resized/i,
  /copy/i,
  /\s-\s*copy/i,
  /final/i,
  /v\d+/i,
  /version/i,
  /new/i,
  /fixed/i,
  /updated/i,
  /altered/i,
  /manipulated/i,
  /photoshop/i,
  /ps/i,
  /gimp/i,
  /canva/i,
];

export type VerificationErrorCode =
  | "SIZE_TOO_SMALL"
  | "FILE_TOO_LARGE"
  | "DIMENSIONS_TOO_SMALL"
  | "SUSPICIOUS_FILENAME"
  | "SOCIAL_MEDIA_DETECTED"
  | "FILENAME_DATE_MISMATCH"
  | "EDITING_SOFTWARE_DETECTED"
  | "DATE_NOT_TODAY"
  | "IMAGE_LOAD_FAILED"
  | "EXIF_PARSE_FAILED"
  | "VERIFICATION_FAILED";

export interface ImageVerificationResult {
  isValid: boolean;
  errors: VerificationError[];
  metadata?: ImageMetadata;
}

export interface VerificationError {
  code: VerificationErrorCode;
  message: string;
  details?: string;
}

export interface ImageMetadata {
  width?: number;
  height?: number;
  fileSize: number;
  software?: string;
  make?: string;
  model?: string;
  dateTimeOriginal?: Date;
  createDate?: Date;
  modifyDate?: Date;
  dateOfCapture?: Date;
  dateSource?: "exif" | "filename" | "lastModified";
}

async function getImageDimensions(
  file: File,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}

function parseExifDate(dateString: string | Date | undefined): Date | undefined {
  if (!dateString) return undefined;
  if (dateString instanceof Date) {
    return isNaN(dateString.getTime()) ? undefined : dateString;
  }

  const match = dateString.match(
    /(\d{4}):(\d{2}):(\d{2})\s+(\d{2}):(\d{2}):(\d{2})/,
  );
  if (match) {
    const [, year, month, day, hour, minute, second] = match;
    return new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute),
      parseInt(second),
    );
  }

  const parsed = new Date(dateString);
  return isNaN(parsed.getTime()) ? undefined : parsed;
}

function extractDateFromFilename(filename: string): Date | null {
  const patterns = [
    /(\d{4})(\d{2})(\d{2})[_-]?(\d{2})(\d{2})(\d{2})/,
    /(\d{4})[-_]?(\d{2})[-_]?(\d{2})/,
  ];

  for (const pattern of patterns) {
    const match = filename.match(pattern);
    if (!match) continue;

    let year: number, month: number, day: number;

    if (match[1].length === 4 && match[1].startsWith("20")) {
      year = parseInt(match[1]);
      month = parseInt(match[2]);
      day = parseInt(match[3]);
    } else {
      continue;
    }

    if (month < 1 || month > 12 || day < 1 || day > 31) continue;

    const date = new Date(year, month - 1, day);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  return null;
}

function isLastModifiedReliable(lastModified: number): boolean {
  if (lastModified <= 0) return false;
  if (lastModified < EPOCH_MS) return false;
  return true;
}

function isWithin24Hours(date: Date): boolean {
  const now = Date.now();
  const diff = Math.abs(now - date.getTime());
  return diff <= 24 * 60 * 60 * 1000;
}

export async function verifyImage(
  file: File,
): Promise<ImageVerificationResult> {
  const metadata: ImageMetadata = {
    fileSize: file.size,
  };

  const filename = file.name.toLowerCase();

  if (file.size < MIN_FILE_SIZE) {
    return {
      isValid: false,
      errors: [{ code: "SIZE_TOO_SMALL", message: "Screenshot is too small", details: `Minimum size is ${MIN_FILE_SIZE / 1024}KB.` }],
      metadata,
    };
  }
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      errors: [{ code: "FILE_TOO_LARGE", message: "Screenshot is too large", details: `Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.` }],
      metadata,
    };
  }

  for (const pattern of SOCIAL_MEDIA_PATTERNS) {
    if (pattern.test(filename)) {
      return {
        isValid: false,
        errors: [{ code: "SOCIAL_MEDIA_DETECTED", message: "Screenshot appears to be from a messaging or cloud app", details: "Please upload the original screenshot directly from your device gallery, not through social media or cloud storage." }],
        metadata,
      };
    }
  }

  for (const pattern of SUSPICIOUS_FILENAME_PATTERNS) {
    if (pattern.test(filename)) {
      return {
        isValid: false,
        errors: [{ code: "SUSPICIOUS_FILENAME", message: "Screenshot filename looks suspicious", details: "Please upload the original screenshot without renaming or editing it." }],
        metadata,
      };
    }
  }

  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();

  const datePatterns = [
    /(\d{4})[-_]?(\d{2})[-_]?(\d{2})/,
    /(\d{2})[-_](\d{2})[-_](\d{4})/,
  ];

  let passedFromFilename = false;
  for (const datePattern of datePatterns) {
    const match = filename.match(datePattern);
    if (match) {
      let year: number, month: number, day: number;

      if (match[1].length === 4 && match[1].startsWith("20")) {
        year = parseInt(match[1]);
        month = parseInt(match[2]);
        day = parseInt(match[3]);
      } else {
        day = parseInt(match[1]);
        month = parseInt(match[2]);
        year = parseInt(match[3]);
      }

      if (year === todayYear && month === todayMonth && day === todayDay) {
        passedFromFilename = true;
      }
      break;
    }
  }

  try {
    const dimensions = await getImageDimensions(file);
    metadata.width = dimensions.width;
    metadata.height = dimensions.height;

    if (dimensions.width < MIN_WIDTH || dimensions.height < MIN_HEIGHT) {
      return {
        isValid: false,
        errors: [{ code: "DIMENSIONS_TOO_SMALL", message: "Image resolution is too low", details: `Minimum resolution is ${MIN_WIDTH}x${MIN_HEIGHT}.` }],
        metadata,
      };
    }
  } catch {
    return {
      isValid: false,
      errors: [{ code: "IMAGE_LOAD_FAILED", message: "Failed to read image", details: "The file may be corrupted." }],
      metadata,
    };
  }

  if (passedFromFilename) {
    metadata.dateSource = "filename";
    const fd = extractDateFromFilename(filename);
    if (fd) metadata.dateOfCapture = fd;
    return { isValid: true, errors: [], metadata };
  }

  try {
    const exifData = await exifr.parse(file, {
      exif: true,
      iptc: true,
      xmp: true,
      icc: false,
      tiff: true,
      jfif: false,
    });

    if (exifData) {
      metadata.software =
        exifData.Software ||
        exifData.ProcessingSoftware ||
        exifData.CreatorTool ||
        exifData.Creator ||
        exifData.Producer ||
        exifData.Application;
      metadata.make = exifData.Make;
      metadata.model = exifData.Model;

      const fieldsToCheck = [
        exifData.Software,
        exifData.ProcessingSoftware,
        exifData.CreatorTool,
        exifData.HistorySoftwareAgent,
        exifData.XMPToolkit,
        exifData.Creator,
        exifData.Producer,
        exifData.Application,
        exifData.ImageDescription,
        exifData.Comment,
        exifData.UserComment,
        exifData.parameters,
        exifData.prompt,
        exifData.Description,
      ];

      for (const field of fieldsToCheck) {
        if (field && typeof field === "string") {
          const lowerField = field.toLowerCase();
          if (LEGIT_SOFTWARE_KEYWORDS.some(kw => lowerField.includes(kw))) continue;
          for (const pattern of EDITING_SOFTWARE_PATTERNS) {
            if (pattern.test(field)) {
              return {
                isValid: false,
                errors: [{ code: "EDITING_SOFTWARE_DETECTED", message: "Editing software was detected in image metadata", details: "Please upload an unedited screenshot taken directly from your device." }],
                metadata,
              };
            }
          }
        }
      }

      for (const [, value] of Object.entries(exifData)) {
        if (typeof value === "string" && value.length > 3 && value.length < 500) {
          const lowerValue = value.toLowerCase();
          if (LEGIT_SOFTWARE_KEYWORDS.some(kw => lowerValue.includes(kw))) continue;
          for (const pattern of EDITING_SOFTWARE_PATTERNS) {
            if (pattern.test(value)) {
              return {
                isValid: false,
                errors: [{ code: "EDITING_SOFTWARE_DETECTED", message: "Editing software was detected in image metadata", details: "Please upload an unedited screenshot taken directly from your device." }],
                metadata,
              };
            }
          }
        }
      }

      metadata.dateTimeOriginal = parseExifDate(exifData.DateTimeOriginal);
      metadata.createDate = parseExifDate(
        exifData.CreateDate || exifData.DateTimeDigitized,
      );
      metadata.modifyDate = parseExifDate(
        exifData.DateTime || exifData.ModifyDate,
      );

      const dateToCheck =
        metadata.dateTimeOriginal || metadata.createDate || metadata.modifyDate;
      metadata.dateOfCapture = dateToCheck;

      if (dateToCheck) {
        metadata.dateSource = "exif";
        if (isWithin24Hours(dateToCheck)) {
          return { isValid: true, errors: [], metadata };
        }
        return {
          isValid: false,
          errors: [{ code: "DATE_NOT_TODAY", message: "Screenshot was not taken within the last 24 hours", details: "Please take a fresh screenshot and upload it immediately." }],
          metadata,
        };
      }
    }
  } catch {
    // EXIF parsing failed
  }

  const filenameDate = extractDateFromFilename(filename);
  if (filenameDate) {
    if (isWithin24Hours(filenameDate)) {
      metadata.dateOfCapture = filenameDate;
      metadata.dateSource = "filename";
      return { isValid: true, errors: [], metadata };
    }
    return {
      isValid: false,
      errors: [{ code: "DATE_NOT_TODAY", message: "Screenshot filename shows an older date", details: "Please take a fresh screenshot from your device." }],
      metadata,
    };
  }

  if (isLastModifiedReliable(file.lastModified)) {
    const fileDate = new Date(file.lastModified);
    metadata.modifyDate = fileDate;
    metadata.dateSource = "lastModified";
    if (isWithin24Hours(fileDate)) {
      return { isValid: true, errors: [], metadata };
    }
    return {
      isValid: false,
      errors: [{ code: "DATE_NOT_TODAY", message: "Screenshot was not taken within the last 24 hours", details: "Please take a fresh screenshot and upload it immediately." }],
      metadata,
    };
  }

  return {
    isValid: false,
    errors: [{ code: "DATE_NOT_TODAY", message: "Could not verify screenshot date", details: "Please take a fresh screenshot directly from your device and try again." }],
    metadata,
  };
}

export function getVerificationErrorSummary(
  errors: VerificationError[],
): string {
  if (errors.length === 0) return "";
  return "Screenshot verification failed";
}
