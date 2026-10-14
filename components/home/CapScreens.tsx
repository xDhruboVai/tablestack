/**
 * The small screens on the "Start with the actual need" cards: a business site on a phone, a booking
 * request form, and an admin screen. They are generic examples of what we build, not anyone's real site.
 * Every size is in em, so each screen scales with its card (see .cap-screen in globals.css).
 */

export function CapPhone() {
  return (
    <div className="cap-screen cap-phone" aria-hidden="true">
      <i className="cap-notch" />
      <div className="cap-phone-nav">
        <b />
        <span>About</span>
        <span>Services</span>
        <span>Contact</span>
      </div>
      <p className="cap-phone-h">
        Your
        <br />
        business.
      </p>
      <p className="cap-phone-sub">Open today, 10 am to 8 pm</p>
      <div className="cap-phone-img" />
      <div className="cap-phone-row">
        <span>Our services</span>
        <em>›</em>
      </div>
      <div className="cap-phone-row">
        <span>Prices</span>
        <em>›</em>
      </div>
      <div className="cap-ui-btn">Message us on WhatsApp</div>
    </div>
  );
}

export function CapForm() {
  return (
    <div className="cap-screen cap-form" aria-hidden="true">
      <p className="cap-form-title">Book a visit</p>
      <p className="cap-form-label">Day</p>
      <div className="cap-form-field">Friday, 7:00 pm</div>
      <p className="cap-form-label">People</p>
      <div className="cap-form-seg">
        <span>1</span>
        <span>2</span>
        <span className="is-on">4</span>
        <span>6+</span>
      </div>
      <p className="cap-form-label">Phone</p>
      <div className="cap-form-field">
        01X XXXX XXXX
        <i className="cap-form-caret" />
      </div>
      <div className="cap-ui-btn">Send request</div>
      {/* Slides in when the card is pointed at, as if the request had just been sent. */}
      <div className="cap-form-toast">
        <b>✓</b> Request sent. We will call to confirm.
      </div>
    </div>
  );
}

export function CapAdmin() {
  return (
    <div className="cap-screen cap-admin" aria-hidden="true">
      <div className="cap-admin-top">
        <b>Admin</b>
        <span>Saved</span>
      </div>
      <div className="cap-admin-row">
        <span>Lunch menu</span>
        <i className="cap-switch is-on" />
      </div>
      <div className="cap-admin-row">
        <span>Weekend offer</span>
        {/* Switches on when the card is pointed at. */}
        <i className="cap-switch cap-switch-hover" />
      </div>
      <div className="cap-admin-row">
        <span>Home page photo</span>
        <em>Change</em>
      </div>
      <div className="cap-admin-row">
        <span>Set menu price</span>
        <em className="cap-admin-price">Tk 300</em>
      </div>
      <div className="cap-admin-row">
        <span>New booking requests</span>
        <em className="cap-admin-badge">3</em>
      </div>
    </div>
  );
}
