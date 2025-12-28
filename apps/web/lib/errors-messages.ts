// @TODO: move error message from backend and frontend to packages/shared

const error_messages = {
  auth: {
    empty_email: {
      code: 400,
      message: "Oops! Looks like you forgot to enter your email.",
    },
    empty_password: {
      code: 400,
      message: "Hold on - you’ll need a password to continue.",
    },
    invalid_email: {
      code: 400,
      message:
        "Hmm, that doesn’t look like a valid email. Mind double-checking?",
    },
    empty_otp: {
      code: 400,
      message: "We’re going to need that OTP to move forward.",
    },
    verify_request_not_found: {
      code: 400,
      message:
        "We couldn’t find a matching verification request. Try starting over?",
    },
    otp_mismatch: {
      code: 400,
      message:
        "That OTP didn’t quite match - or maybe it expired. Give it another go.",
    },
    invalid_email_or_password: {
      code: 401,
      message: "Invalid email or password.",
    },
    resend_otp_error: {
      code: 500,
      message: "Something went wrong while trying to resend the OTP.",
    },
    email_exists: {
      code: 409,
      message:
        "There’s already an account with this email. Maybe try logging in?",
    },
    invalid_access: {
      code: 401,
      message: "That action needs valid access.",
    },
  },
  project: {
    not_found: {
      code: 404,
      message: "We couldn’t find that project. Mind double-checking?",
    },
    access_denied: {
      code: 403,
      message: "Looks like this project is off-limits for now.",
    },
    name_required: {
      code: 400,
      message: "Every project needs a name - don’t forget to add one.",
    },
    website_required: {
      code: 400,
      message: "A project without a website? Let’s fix that.",
    },
    insufficient_permissions: {
      code: 403,
      message: "You don’t have the right permissions to make that change.",
    },
    id_required: {
      code: 400,
      message: "We need the project ID to proceed.",
    },
    delete_failed: {
      code: 500,
      message: "Something went wrong while trying to delete the project.",
    },
  },
  user: {
    no_user_with_email: {
      code: 404,
      message: "No account found with that email address.",
    },
  },
  global: {
    header_required: {
      code: 400,
      message: "Missing required header. Please check your request headers.",
    },
    internal_error: {
      code: 500,
      message: "Something went wrong on our end. We’re on it!",
    },
  },
};

export default error_messages;
