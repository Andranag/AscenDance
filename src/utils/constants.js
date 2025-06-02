// Course-related constants
export const COURSE_LEVELS = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
  EXPERT: 'Expert'
};

export const COURSE_LEVEL_COLORS = {
  [COURSE_LEVELS.BEGINNER]: 'bg-emerald-500 text-white',
  [COURSE_LEVELS.INTERMEDIATE]: 'bg-amber-500 text-white',
  [COURSE_LEVELS.ADVANCED]: 'bg-rose-500 text-white',
  [COURSE_LEVELS.EXPERT]: 'bg-indigo-500 text-white'
};

// Dance style constants
export const DANCE_STYLES = {
  LINDY_HOP: 'Lindy Hop',
  SWING: 'Swing',
  BOOGIE_WOOGIE: 'Boogie Woogie',
  BACHATA: 'Bachata',
  SALSA: 'Salsa',
  KIZOMBA: 'Kizomba',
  SOLO_JAZZ: 'Solo Jazz'
};

export const DANCE_STYLE_COLORS = {
  [DANCE_STYLES.LINDY_HOP]: 'bg-purple-500 text-white',
  [DANCE_STYLES.SWING]: 'bg-blue-500 text-white',
  [DANCE_STYLES.BOOGIE_WOOGIE]: 'bg-pink-500 text-white',
  [DANCE_STYLES.BACHATA]: 'bg-orange-500 text-white',
  [DANCE_STYLES.SALSA]: 'bg-yellow-500 text-gray-900',
  [DANCE_STYLES.KIZOMBA]: 'bg-green-500 text-white',
  [DANCE_STYLES.SOLO_JAZZ]: 'bg-gray-500 text-white'
};

// Toast duration constants
export const TOAST_DURATIONS = {
  SUCCESS: 3000,
  ERROR: 5000,
  WARNING: 4000,
  INFO: 3000
};

// API response status codes
export const API_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
};

// Error message constants
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  WEAK_PASSWORD: 'Password must be at least 8 characters',
  INVALID_CREDENTIALS: 'Invalid email or password',
  NETWORK_ERROR: 'Network error occurred',
  SERVER_ERROR: 'Server error occurred',
  UNAUTHORIZED: 'Unauthorized access',
  NOT_FOUND: 'Resource not found'
};

// Form validation patterns
export const VALIDATION_PATTERNS = {
  // Basic patterns
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Basic email validation
  PASSWORD: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}$/, // At least 8 chars, one uppercase, one lowercase, one number
  NAME: /^[a-zA-Z\s]+$/, // Only letters and spaces
  PHONE: /^\+?[1-9]\d{1,14}$/, // International phone number format
  ZIP_CODE: /^[0-9]{5}(?:-[0-9]{4})?$/, // US ZIP code format
  
  // Advanced patterns
  PASSWORD_STRENGTH: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()]).{8,}$/, // Strong password with special char
  URL: /^(https?:\/\/)?[\w.-]+(?:\/[\w.-]*)*\/?$/, // URL validation
  DATE: /^(0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01])\/[0-9]{4}$/, // MM/DD/YYYY format
  TIME: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, // 24-hour format
  
  // Content patterns
  TEXT: /^[\w\s-]+$/, // Basic text with spaces and hyphens
  NUMBER: /^[0-9]+$/, // Only numbers
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/, // Alphanumeric characters
  
  // Special patterns
  IP_ADDRESS: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, // IPv4
  HEX_COLOR: /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i, // Hex color code
  CREDIT_CARD: /^\d{15,16}$/, // Credit card number
  
  // Custom patterns
  USERNAME: /^[a-zA-Z0-9._]{3,16}$/, // Username with 3-16 chars
  SLUG: /^[a-z0-9-]+$/, // URL-safe slug
  FILENAME: /^[a-zA-Z0-9._-]+$/ // Basic filename pattern
};

// UI-related constants
export const UI_CONFIG = {
  // Button styles
  BUTTON_STYLES: {
    PRIMARY: 'bg-primary text-white hover:bg-primary-dark',
    SECONDARY: 'bg-secondary text-white hover:bg-secondary-dark',
    OUTLINE: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    DANGER: 'bg-red-500 text-white hover:bg-red-600',
    SUCCESS: 'bg-green-500 text-white hover:bg-green-600',
    WARNING: 'bg-yellow-500 text-gray-800 hover:bg-yellow-600'
  },

  // Card styles
  CARD_STYLES: {
    BASE: 'rounded-lg shadow-sm',
    HOVER: 'hover:shadow-lg',
    HOVER_LARGE: 'hover:shadow-xl',
    HOVER_2XL: 'hover:shadow-2xl',
    HOVER_3XL: 'hover:shadow-3xl'
  },

  // Transition styles
  TRANSITION_STYLES: {
    FAST: 'transition-all duration-150',
    NORMAL: 'transition-all duration-200',
    SLOW: 'transition-all duration-300',
    SMOOTH: 'transition-all duration-500'
  },

  // Loading states
  LOADING_STATES: {
    SKELETON: 'animate-pulse',
    SPINNER: 'animate-spin',
    FADE: 'animate-fade',
    SCALE: 'animate-scale'
  },

  // Error styles
  ERROR_STYLES: {
    MESSAGE: 'text-red-600',
    CONTAINER: 'bg-red-50 border border-red-200 rounded-md p-4',
    ICON: 'text-red-400'
  },

  // Success styles
  SUCCESS_STYLES: {
    MESSAGE: 'text-green-600',
    CONTAINER: 'bg-green-50 border border-green-200 rounded-md p-4',
    ICON: 'text-green-400'
  },

  // Tooltip styles
  TOOLTIP_STYLES: {
    BASE: 'absolute z-50 px-2 py-1 text-xs rounded-md shadow-lg',
    LIGHT: 'bg-white text-gray-700 border border-gray-200',
    DARK: 'bg-gray-800 text-white border border-gray-700'
  },

  // Modal styles
  MODAL_STYLES: {
    OVERLAY: 'fixed inset-0 bg-black bg-opacity-50',
    CONTENT: 'fixed inset-0 flex items-center justify-center',
    PANEL: 'bg-white rounded-lg shadow-xl p-6 max-w-lg mx-4'
  },

  // Loading spinner configuration
  LOADING_SPINNER_SIZE: 'h-8 w-8',
  BUTTON_PADDING: 'py-2 px-4',
  CARD_SHADOW: 'shadow-lg hover:shadow-xl',
  TRANSITION_DURATION: 'duration-300',
  SKELETON_ANIMATION: 'animate-pulse'
};
