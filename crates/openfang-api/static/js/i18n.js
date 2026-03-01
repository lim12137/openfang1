// OpenFang Internationalization Module
'use strict';

// Default language
const DEFAULT_LANGUAGE = 'en';
const SUPPORTED_LANGUAGES = ['en', 'zh-CN'];

// Global i18n instance
window.OpenFangI18n = (function() {
  let currentLanguage = localStorage.getItem('openfang-language') || DEFAULT_LANGUAGE;
  let translations = {};
  let fallbackTranslations = {};

  // Load translation resources
  async function loadTranslations(lang) {
    try {
      // Load fallback English translations first
      if (lang !== 'en') {
        const fallbackResponse = await fetch('/locales/en/translation.json');
        if (fallbackResponse.ok) {
          fallbackTranslations = await fallbackResponse.json();
        }
      }

      // Load current language translations
      const response = await fetch(`/locales/${lang}/translation.json`);
      if (response.ok) {
        translations = await response.json();
      } else {
        console.warn(`[OpenFang i18n] Translation file not found for ${lang}, falling back to English`);
        translations = {};
      }
    } catch (error) {
      console.error(`[OpenFang i18n] Error loading translations for ${lang}:`, error);
      translations = {};
    }
  }

  // Get translation for key
  function t(key, fallback = key) {
    // Navigate nested keys like 'nav.chat' or 'dashboard.title'
    const keys = key.split('.');
    let value = translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && value.hasOwnProperty(k)) {
        value = value[k];
      } else {
        value = undefined;
        break;
      }
    }

    // Fall back to fallback translations if not found
    if (value === undefined || value === null) {
      let fallbackValue = fallbackTranslations;
      for (const k of keys) {
        if (fallbackValue && typeof fallbackValue === 'object' && fallbackValue.hasOwnProperty(k)) {
          fallbackValue = fallbackValue[k];
        } else {
          fallbackValue = undefined;
          break;
        }
      }

      if (fallbackValue !== undefined && fallbackValue !== null) {
        value = fallbackValue;
      } else {
        value = fallback;
      }
    }

    return value;
  }

  // Set current language
  async function setLanguage(lang) {
    if (!SUPPORTED_LANGUAGES.includes(lang)) {
      console.warn(`[OpenFang i18n] Unsupported language: ${lang}`);
      lang = DEFAULT_LANGUAGE;
    }

    await loadTranslations(lang);
    currentLanguage = lang;
    localStorage.setItem('openfang-language', lang);

    // Update HTML lang attribute
    document.documentElement.lang = lang;

    // Trigger language change event
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));

    // Update all elements with data-i18n attributes
    updatePageTranslations();

    return true;
  }

  // Get current language
  function getLanguage() {
    return currentLanguage;
  }

  // Update all page elements with translations
  function updatePageTranslations() {
    // Update elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        el.textContent = t(key);
      }
    });

    // Update elements with data-i18n-placeholder attribute
    const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderElements.forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key) {
        el.placeholder = t(key);
      }
    });

    // Update elements with data-i18n-title attribute
    const titleElements = document.querySelectorAll('[data-i18n-title]');
    titleElements.forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (key) {
        el.title = t(key);
      }
    });

    // Update elements with data-i18n-alt attribute
    const altElements = document.querySelectorAll('[data-i18n-alt]');
    altElements.forEach(el => {
      const key = el.getAttribute('data-i18n-alt');
      if (key) {
        el.alt = t(key);
      }
    });

    // Update page title if it has data-i18n attribute
    const titleElement = document.querySelector('title[data-i18n]');
    if (titleElement) {
      document.title = t(titleElement.getAttribute('data-i18n'));
    }
  }

  // Initialize i18n module
  async function init() {
    // Load initial translations
    await loadTranslations(currentLanguage);

    // Update page with initial translations
    updatePageTranslations();
  }

  // Get available languages
  function getSupportedLanguages() {
    return [...SUPPORTED_LANGUAGES];
  }

  // Format a number as currency
  function formatCurrency(amount, currency = 'USD') {
    try {
      return new Intl.NumberFormat(getLanguage(), {
        style: 'currency',
        currency: currency
      }).format(amount);
    } catch (error) {
      console.warn('[OpenFang i18n] Error formatting currency:', error);
      return amount.toString();
    }
  }

  // Format a date
  function formatDate(date, options = {}) {
    try {
      return new Intl.DateTimeFormat(getLanguage(), {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        ...options
      }).format(new Date(date));
    } catch (error) {
      console.warn('[OpenFang i18n] Error formatting date:', error);
      return new Date(date).toString();
    }
  }

  // Format relative time
  function formatRelativeTime(date) {
    try {
      const rtf = new Intl.RelativeTimeFormat(getLanguage(), { numeric: 'auto' });
      const deltaSeconds = (new Date(date) - new Date()) / 1000;
      const units = [
        { unit: 'year', seconds: 31536000 },
        { unit: 'month', seconds: 2592000 },
        { unit: 'day', seconds: 86400 },
        { unit: 'hour', seconds: 3600 },
        { unit: 'minute', seconds: 60 },
        { unit: 'second', seconds: 1 }
      ];

      for (const { unit, seconds } of units) {
        const interval = Math.floor(Math.abs(deltaSeconds) / seconds);
        if (interval >= 1) {
          return rtf.format(Math.sign(deltaSeconds) * interval, unit);
        }
      }
      return rtf.format(0, 'second');
    } catch (error) {
      console.warn('[OpenFang i18n] Error formatting relative time:', error);
      return new Date(date).toString();
    }
  }

  return {
    init,
    t,
    setLanguage,
    getLanguage,
    getSupportedLanguages,
    formatCurrency,
    formatDate,
    formatRelativeTime
  };
})();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  OpenFangI18n.init();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = OpenFangI18n;
}