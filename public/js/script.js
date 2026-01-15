(() => {
  'use strict';

  // Bootstrap validation
  const forms = document.querySelectorAll('.needs-validation');
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });

  // Starability → hidden rating
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('input[name="starUI"]').forEach(star => {
      star.addEventListener("change", function () {
        document.getElementById("ratingValue").value = this.value;
      });
    });
  });

})();
