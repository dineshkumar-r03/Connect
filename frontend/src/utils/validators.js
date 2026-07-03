// Validate email
export const validateEmail = (email) => {
  const re = /^[A-Za-z0-9+_.-]+@(.+)$/;
  return re.test(email);
};

// Validate password strength
export const validatePassword = (password) => {
  const hasMinLength = password.length >= 6;
  const hasNumber = /\d/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return {
    isValid: hasMinLength && hasNumber && hasUpperCase && hasLowerCase,
    hasMinLength,
    hasNumber,
    hasUpperCase,
    hasLowerCase,
    hasSpecialChar
  };
};

// Validate URL
export const validateUrl = (url) => {
  if (!url) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Validate blog title
export const validateBlogTitle = (title) => {
  if (!title) return 'Title is required';
  if (title.length < 5) return 'Title must be at least 5 characters';
  if (title.length > 200) return 'Title must be less than 200 characters';
  return null;
};

// Validate blog content
export const validateBlogContent = (content) => {
  if (!content) return 'Content is required';
  if (content.length < 20) return 'Content must be at least 20 characters';
  return null;
};

// Validate tags
export const validateTags = (tags) => {
  if (!tags) return null;
  const tagArray = tags.split(',').map(t => t.trim()).filter(t => t);
  if (tagArray.length > 10) return 'Maximum 10 tags allowed';
  if (tagArray.some(tag => tag.length > 30)) return 'Tags must be less than 30 characters';
  return null;
};

// Validate profile data
export const validateProfile = (data) => {
  const errors = {};
  
  if (!data.name) errors.name = 'Name is required';
  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Invalid email format';
  }
  
  if (data.github && !validateUrl(data.github)) {
    errors.github = 'Invalid GitHub URL';
  }
  
  if (data.linkedin && !validateUrl(data.linkedin)) {
    errors.linkedin = 'Invalid LinkedIn URL';
  }
  
  return errors;
};

// Validate search query
export const validateSearchQuery = (query) => {
  if (!query || query.trim().length === 0) {
    return 'Search query cannot be empty';
  }
  if (query.length > 100) {
    return 'Search query is too long';
  }
  return null;
};