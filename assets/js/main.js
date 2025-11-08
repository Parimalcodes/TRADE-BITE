document.addEventListener('DOMContentLoaded', function () {
  var navToggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.site-nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  var subToggles = document.querySelectorAll('.has-sub > .sub-toggle');
  subToggles.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var li = e.currentTarget.parentElement;
      var expanded = li.classList.toggle('open');
      e.currentTarget.setAttribute('aria-expanded', String(expanded));
    });
  });

  // Ensure any product submenu is closed on load
  document.querySelectorAll('.has-sub').forEach(function (li) {
    li.classList.remove('open');
    var btn = li.querySelector('.sub-toggle');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  });

  // Shrink logo on scroll
  var header = document.querySelector('.site-header');
  var onScroll = function () {
    if (!header) return;
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Contact form validation
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    var countrySelect = document.getElementById('countrySelect');
    var countryCodeInput = document.getElementById('countryCodeInput');
    var mobileInput = document.getElementById('mobileInput');
    var currentMobileLength = 10; // Default

    // Handle country selection
    if (countrySelect && countryCodeInput && mobileInput) {
      countrySelect.addEventListener('change', function(e) {
        var selectedOption = e.target.options[e.target.selectedIndex];
        var countryCode = selectedOption.getAttribute('data-code');
        var mobileLength = parseInt(selectedOption.getAttribute('data-length')) || 15;
        
        currentMobileLength = mobileLength;
        
        if (selectedOption.value === 'OTHER') {
          countryCodeInput.removeAttribute('readonly');
          countryCodeInput.style.background = '#ffffff';
          countryCodeInput.value = '';
          countryCodeInput.placeholder = 'Enter country code (e.g., +91)';
          countryCodeInput.setAttribute('pattern', '\\+[0-9]{1,4}');
          mobileInput.maxLength = 15;
          mobileInput.setAttribute('pattern', '[0-9]{8,15}');
        } else {
          countryCodeInput.setAttribute('readonly', 'readonly');
          countryCodeInput.style.background = '#f9fafb';
          countryCodeInput.value = countryCode || '';
          countryCodeInput.placeholder = countryCode || 'Select country first';
          countryCodeInput.removeAttribute('pattern');
          mobileInput.maxLength = mobileLength;
          mobileInput.setAttribute('pattern', '[0-9]{' + mobileLength + '}');
        }
        mobileInput.value = ''; // Clear mobile number when country changes
      });
    }

    if (mobileInput) {
      // Only allow numbers in mobile field
      mobileInput.addEventListener('input', function(e) {
        var value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length > currentMobileLength) {
          value = value.substring(0, currentMobileLength);
        }
        e.target.value = value;
      });
      
      // Prevent paste of non-numeric characters
      mobileInput.addEventListener('paste', function(e) {
        e.preventDefault();
        var paste = (e.clipboardData || window.clipboardData).getData('text');
        var numbers = paste.replace(/[^0-9]/g, '');
        if (numbers.length > currentMobileLength) {
          numbers = numbers.substring(0, currentMobileLength);
        }
        e.target.value = numbers;
      });
    }

    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var errorMsg = document.getElementById('errorMsg');
      var isValid = true;
      var errors = [];

      // Validate country selection
      if (!countrySelect || !countrySelect.value) {
        isValid = false;
        errors.push('Please select your country');
      }

      // Validate email format
      var email = contactForm.querySelector('input[name="email"]');
      if (email && !email.validity.valid) {
        isValid = false;
        errors.push('Please enter a valid email address (e.g., example@email.com)');
      }

      // Validate country code
      if (countryCodeInput) {
        var countryCodeValue = countryCodeInput.value.trim();
        if (!countryCodeValue) {
          isValid = false;
          errors.push('Country code is required');
        } else if (!countryCodeValue.startsWith('+')) {
          isValid = false;
          errors.push('Country code must start with + (e.g., +91)');
        }
      }

      // Validate mobile number based on selected country
      if (mobileInput && countrySelect) {
        var selectedOption = countrySelect.options[countrySelect.selectedIndex];
        var mobileLength = parseInt(selectedOption.getAttribute('data-length')) || 15;
        var mobileValue = mobileInput.value.replace(/[^0-9]/g, '');
        
        if (selectedOption.value === 'OTHER') {
          if (mobileValue.length < 8 || mobileValue.length > 15) {
            isValid = false;
            errors.push('Mobile number must be 8-15 digits');
          }
        } else {
          if (mobileValue.length !== mobileLength) {
            isValid = false;
            errors.push('Mobile number must be exactly ' + mobileLength + ' digits for ' + selectedOption.text);
          }
        }
        mobileInput.value = mobileValue;
      }

      if (isValid) {
        errorMsg.style.display = 'none';
        errorMsg.textContent = '';
        // Form is valid - you can submit to backend here
        alert('Thank you! Your enquiry has been submitted. We will contact you soon.');
        contactForm.reset();
        // Reset country code input state
        if (countryCodeInput) {
          countryCodeInput.setAttribute('readonly', 'readonly');
          countryCodeInput.style.background = '#f9fafb';
          countryCodeInput.value = '';
          countryCodeInput.placeholder = 'Select country first';
        }
        currentMobileLength = 10;
        if (mobileInput) {
          mobileInput.maxLength = 10;
        }
      } else {
        errorMsg.textContent = errors.join(' • ');
        errorMsg.style.display = 'block';
      }
    });
  }
});


