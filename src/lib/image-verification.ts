import exifr from "exifr";

// Minimum image dimensions (in pixels)
const MIN_WIDTH = 200;
const MIN_HEIGHT = 200;
// Minimum file size (in bytes) - 10KB
const MIN_FILE_SIZE = 10 * 1024;

// Known image editing software signatures that might appear in EXIF
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
  /editor/i,
  /edited/i,
  /modified/i,
];

// Suspicious patterns in filenames
const SUSPICIOUS_FILENAME_PATTERNS = [
  /edit/i,
  /edited/i,
  /modified/i,
  /cropped/i,
  /crop/i,
  /resized/i,
  /copy/i,
  /\(\d+\)/,
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

export interface ImageVerificationResult {
  isValid: boolean;
  errors: VerificationError[];
  metadata?: ImageMetadata;
}

export interface VerificationError {
  code:
    | "SIZE_TOO_SMALL"
    | "EDITING_SOFTWARE_DETECTED"
    | "DATE_NOT_TODAY"
    | "VERIFICATION_FAILED";
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
}

/**
 * Get image dimensions by loading it into an Image element
 */
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

/**
 * Check if a date is from today (same calendar day)
 */
function isDateToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

/**
 * Parse EXIF date string to Date object
 */
function parseExifDate(
  dateString: string | Date | undefined,
): Date | undefined {
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

// Generic error message shown to users - intentionally vague
const GENERIC_ERROR_MESSAGE = "Screenshot verification failed";
const GENERIC_ERROR_DETAILS =
  "Please take a fresh screenshot directly from your device and try again.";

/**
 * Verify an image file before uploading
 */
export async function verifyImage(
  file: File,
): Promise<ImageVerificationResult> {
  const errors: VerificationError[] = [];
  const metadata: ImageMetadata = {
    fileSize: file.size,
  };

  // Track if any verification failed (for vague error messaging)
  let verificationFailed = false;

  // 1. Check file size
  if (file.size < MIN_FILE_SIZE) {
    verificationFailed = true;
  }

  // 2. Check filename for suspicious patterns
  const filename = file.name.toLowerCase();
  for (const pattern of SUSPICIOUS_FILENAME_PATTERNS) {
    if (pattern.test(filename)) {
      verificationFailed = true;
      break;
    }
  }

  // 3. Check if filename contains a date that's not today
  const datePatterns = [
    /(\d{4})[-_]?(\d{2})[-_]?(\d{2})/,
    /(\d{2})[-_](\d{2})[-_](\d{4})/,
  ];

  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();

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

      if (year !== todayYear || month !== todayMonth || day !== todayDay) {
        verificationFailed = true;
      }
      break;
    }
  }

  // 4. Check image dimensions
  try {
    const dimensions = await getImageDimensions(file);
    metadata.width = dimensions.width;
    metadata.height = dimensions.height;

    if (dimensions.width < MIN_WIDTH || dimensions.height < MIN_HEIGHT) {
      verificationFailed = true;
    }
  } catch {
    // Failed to load image
    verificationFailed = true;
  }

  // Variable to track if we found a valid date in EXIF
  let foundExifDate = false;

  // 5. Read EXIF data
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
      // Extract metadata (for internal use, not shown to user)
      metadata.software =
        exifData.Software ||
        exifData.ProcessingSoftware ||
        exifData.CreatorTool ||
        exifData.Creator ||
        exifData.Producer ||
        exifData.Application;
      metadata.make = exifData.Make;
      metadata.model = exifData.Model;

      // Check for editing software in all fields
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
          for (const pattern of EDITING_SOFTWARE_PATTERNS) {
            if (pattern.test(field)) {
              verificationFailed = true;
              break;
            }
          }
        }
        if (verificationFailed) break;
      }

      // Also scan all string fields
      if (!verificationFailed) {
        for (const [, value] of Object.entries(exifData)) {
          if (
            typeof value === "string" &&
            value.length > 3 &&
            value.length < 500
          ) {
            for (const pattern of EDITING_SOFTWARE_PATTERNS) {
              if (pattern.test(value)) {
                verificationFailed = true;
                break;
              }
            }
          }
          if (verificationFailed) break;
        }
      }

      // Check date metadata
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
        foundExifDate = true;
        if (!isDateToday(dateToCheck)) {
          verificationFailed = true;
        }
      }
    }
  } catch {
    // EXIF parsing failed - continue with other checks
  }

  // 6. If no EXIF date was found, use file.lastModified as fallback
  if (!foundExifDate) {
    const fileDate = new Date(file.lastModified);
    metadata.modifyDate = fileDate;
    metadata.dateOfCapture = fileDate;

    if (!isDateToday(fileDate)) {
      verificationFailed = true;
    }
  }

  // If any verification failed, add a single generic error
  if (verificationFailed) {
    errors.push({
      code: "VERIFICATION_FAILED",
      message: GENERIC_ERROR_MESSAGE,
      details: GENERIC_ERROR_DETAILS,
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    metadata,
  };
}

/**
 * Get a human-readable summary of verification errors
 */
export function getVerificationErrorSummary(
  errors: VerificationError[],
): string {
  if (errors.length === 0) return "";
  return GENERIC_ERROR_MESSAGE;
}
