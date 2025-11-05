// EmailJS integration for signup form
// IMPORTANT: Do NOT put your EmailJS private key in client-side code.
// Only the public key should be used in the browser.

// Configure these values
const EMAILJS_PUBLIC_KEY = "Av33DaVyg5wDM5N9s"; // provided by user
const EMAILJS_SERVICE_ID = "service_x2fv1ji"; // set by user
const EMAILJS_TEMPLATE_ID = "template_xrm7y6m"; // set by user

(function () {
  // Guard: ensure required configuration is set
  const missingConfig = [
    EMAILJS_PUBLIC_KEY,
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
  ].some((v) => !v || /YOUR_/.test(String(v)));

  const setStatus = (msg, type = "info") => {
    const el = document.getElementById("formStatus");
    if (!el) return;
    el.textContent = msg;
    el.className = `status status--${type}`; // resets and applies variant
  };

  const init = () => {
    try {
      // emailjs is provided by the CDN script
      emailjs.init(EMAILJS_PUBLIC_KEY);
    } catch (e) {
      // If the SDK isn't loaded yet
      console.error("EmailJS SDK not loaded", e);
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("signupForm");
    const submitBtn = form?.querySelector("button[type='submit']");

    if (!form) return;

    if (missingConfig) {
      setStatus(
        "Form is not configured yet. Please add your EmailJS Service ID and Template ID.",
        "error"
      );
      return;
    }

    init();

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Basic client-side validation fallback (HTML5 required already present)
      if (!form.checkValidity()) {
        setStatus("Please fill in all required fields.", "error");
        return;
      }

      // Disable while sending
      const originalText = submitBtn ? submitBtn.textContent : null;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
      }
      setStatus("Sending your signup...", "info");

      try {
        // Collect values and map to common EmailJS template variables
        const fd = new FormData(form);
        const values = Object.fromEntries(fd.entries());

        // Compose a human-readable message including all fields
        const composedMessage = `Mission Possible Signup\n\n`
          + `Full Name: ${values.name || ""}\n`
          + `Age: ${values.age || ""}\n`
          + `Grade: ${values.grade || ""}\n`
          + `Phone: ${values.phone || ""}\n`
          + `Email: ${values.email || ""}\n`
          + `Youth Pastor: ${values.youthPastor || ""}\n`
          + `Church Name: ${values.churchName || ""}`;

        const templateParams = {
          // Default/common EmailJS variables many starter templates use
          from_name: values.name || "",
          from_email: values.email || "",
          reply_to: values.email || "",
          subject: "Mission Possible Signup",
          message: composedMessage,
          // Also pass raw fields in case your template uses these names
          name: values.name || "",
          age: values.age || "",
          grade: values.grade || "",
          phone: values.phone || "",
          email: values.email || "",
          youthPastor: values.youthPastor || "",
          churchName: values.churchName || "",
        };

        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
        setStatus("Thanks! Your signup was sent successfully.", "success");
        form.reset();
      } catch (err) {
        console.error(err);
        setStatus(
          "Sorry, there was a problem sending your form. Please try again.",
          "error"
        );
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      }
    });
  });
})();
