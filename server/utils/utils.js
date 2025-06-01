import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

// Date utilities
export const formatDate = (date, formatStr = 'yyyy-MM-dd HH:mm:ss') => {
  return format(date, formatStr);
};

export const isDateValid = (date) => {
  return date instanceof Date && !isNaN(date);
};

// String utilities
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const slugify = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Object utilities
export const omit = (obj, keys) => {
  return Object.entries(obj)
    .filter(([key]) => !keys.includes(key))
    .reduce((acc, [key, val]) => ({ ...acc, [key]: val }), {});
};

export const pick = (obj, keys) => {
  return Object.entries(obj)
    .filter(([key]) => keys.includes(key))
    .reduce((acc, [key, val]) => ({ ...acc, [key]: val }), {});
};

// Array utilities
export const chunkArray = (arr, size) => {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
};

// File utilities
export const generateFileName = (originalName, extension) => {
  return `${uuidv4()}-${slugify(originalName)}.${extension}`;
};

// Validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return passwordRegex.test(password);
};

// Pagination utilities
export const paginate = (items, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = items.length;
  const result = items.slice(startIndex, endIndex);

  return {
    items: result,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    hasMore: endIndex < total
  };
};

// Random utilities
export const generateRandomString = (length = 10) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => 
    characters.charAt(Math.floor(Math.random() * characters.length))
  ).join('');
};

export const generateOTP = (length = 6) => {
  return Math.floor(10 ** (length - 1) + Math.random() * (10 ** length - 10 ** (length - 1)));
};
