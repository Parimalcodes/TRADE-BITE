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
        errorMsg.style.backgroundColor = '';
        errorMsg.style.border = '';
        
        // Get form data
        var formData = {
          fullname: contactForm.querySelector('input[name="fullname"]').value.trim(),
          email: contactForm.querySelector('input[name="email"]').value.trim(),
          country: countrySelect.value,
          countrycode: countryCodeInput.value.trim(),
          mobile: mobileInput.value.trim(),
          company: contactForm.querySelector('input[name="company"]').value.trim(),
          message: contactForm.querySelector('textarea[name="message"]').value.trim()
        };

        // Disable submit button during submission
        var submitButton = contactForm.querySelector('button[type="submit"]');
        var originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        // Send data to backend
        fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        })
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          if (data.success) {
            // Show success message
            errorMsg.style.color = '#10b981';
            errorMsg.style.backgroundColor = '#d1fae5';
            errorMsg.style.border = '1px solid #10b981';
            errorMsg.textContent = data.message || 'Thank you! Your enquiry has been submitted. We will contact you soon.';
            errorMsg.style.display = 'block';
            
            // Reset form
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
            
            // Scroll to top of form
            contactForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            // Show error message
            errorMsg.style.color = '#ef4444';
            errorMsg.style.backgroundColor = '#fee2e2';
            errorMsg.style.border = '1px solid #ef4444';
            errorMsg.textContent = data.message || 'An error occurred. Please try again.';
            errorMsg.style.display = 'block';
          }
        })
        .catch(function(error) {
          console.error('Error:', error);
          errorMsg.style.color = '#ef4444';
          errorMsg.style.backgroundColor = '#fee2e2';
          errorMsg.style.border = '1px solid #ef4444';
          errorMsg.textContent = 'An error occurred while sending your message. Please try again later.';
          errorMsg.style.display = 'block';
        })
        .finally(function() {
          // Re-enable submit button
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
        });
      } else {
        errorMsg.style.color = '#ef4444';
        errorMsg.style.backgroundColor = '#fee2e2';
        errorMsg.style.border = '1px solid #ef4444';
        errorMsg.textContent = errors.join(' • ');
        errorMsg.style.display = 'block';
      }
    });
  }
});


