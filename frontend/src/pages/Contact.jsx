import React, { useState } from 'react';
import { IconMapPin, IconPhone, IconMail, IconClock, IconCheckCircle } from '../components/common/Icons';

export const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please complete all required fields.');
      return;
    }
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="badge badge-category" style={{ marginBottom: '12px' }}>
            We're Here For You
          </span>
          <h1 style={{ fontSize: '2.6rem', marginBottom: '12px' }}>Contact FoodieExpress</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '560px', margin: '0 auto' }}>
            Have a question about your order, dietary preferences, or catering? Our team is always ready to assist!
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '36px',
            alignItems: 'flex-start',
          }}
        >
          {/* Left Column: Contact Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IconMapPin size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Main Hub & Kitchen</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  SLIIT Malabe Campus, New Kandy Road, Malabe, Sri Lanka
                </p>
              </div>
            </div>

            <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--success-bg)',
                  color: 'var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IconPhone size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Customer Hotline</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  +94 11 754 4801 (Toll Free, Daily 9am – 11pm)
                </p>
              </div>
            </div>

            <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--info-bg)',
                  color: 'var(--info)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IconMail size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Email Inquiries</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  support@foodieexpress.com / orders@foodieexpress.com
                </p>
              </div>
            </div>

            <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  backgroundColor: '#FEF3C7',
                  color: '#B45309',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IconClock size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Operating Hours</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Mon - Sun: 10:00 AM - 11:30 PM (Express deliveries active)
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="card" style={{ padding: '36px', boxShadow: 'var(--shadow-lg)' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>Send Us a Message</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '24px' }}>
              Leave your feedback or question and we'll reply within 30 minutes.
            </p>

            {submitted && (
              <div className="alert alert-success" style={{ marginBottom: '20px' }}>
                <IconCheckCircle size={20} />
                <span>Thank you! Your inquiry has been sent to our customer care team.</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Your Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Alex Johnson"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="alex@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Question about allergens or delivery area"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Your Message *</label>
                <textarea
                  className="form-textarea"
                  placeholder="Write your message here..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
