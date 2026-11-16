import React from 'react';
import { Link } from 'react-router-dom';
import { IconMapPin, IconPhone, IconMail, IconClock, IconShield } from './Icons';

export const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#0F172A',
        color: '#E2E8F0',
        paddingTop: '60px',
        paddingBottom: '30px',
        marginTop: '80px',
        borderTop: '1px solid #1E293B',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '40px',
            marginBottom: '40px',
          }}
        >
          {/* Column 1: Brand & Bio */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '1.45rem',
                fontWeight: 800,
                fontFamily: 'var(--font-heading)',
                color: '#FFFFFF',
                marginBottom: '16px',
              }}
            >
              <span
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'var(--primary-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                }}
              >
                🍔
              </span>
              <span>
                Foodie<span style={{ color: 'var(--primary)' }}>Express</span>
              </span>
            </div>
            <p style={{ color: '#94A3B8', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '20px' }}>
              Delicious, chef-crafted meals delivered straight to your doorstep with lightning speed.
              Synchronized cross-platform experience with our official mobile app.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <span className="badge" style={{ backgroundColor: '#1E293B', color: '#38BDF8', border: '1px solid #334155' }}>
                🚀 React + Vite
              </span>
              <span className="badge" style={{ backgroundColor: '#1E293B', color: '#4ADE80', border: '1px solid #334155' }}>
                📱 Expo Mobile Sync
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.1rem', marginBottom: '18px' }}>Explore</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.92rem' }}>
              <li>
                <Link to="/" style={{ color: '#94A3B8', transition: 'color 0.2s' }} onMouseEnter={(e) => (e.target.style.color = '#FF6B00')} onMouseLeave={(e) => (e.target.style.color = '#94A3B8')}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/menu" style={{ color: '#94A3B8', transition: 'color 0.2s' }} onMouseEnter={(e) => (e.target.style.color = '#FF6B00')} onMouseLeave={(e) => (e.target.style.color = '#94A3B8')}>
                  Browse Full Menu
                </Link>
              </li>
              <li>
                <Link to="/orders" style={{ color: '#94A3B8', transition: 'color 0.2s' }} onMouseEnter={(e) => (e.target.style.color = '#FF6B00')} onMouseLeave={(e) => (e.target.style.color = '#94A3B8')}>
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link to="/about" style={{ color: '#94A3B8', transition: 'color 0.2s' }} onMouseEnter={(e) => (e.target.style.color = '#FF6B00')} onMouseLeave={(e) => (e.target.style.color = '#94A3B8')}>
                  About FoodieExpress
                </Link>
              </li>
              <li>
                <Link to="/contact" style={{ color: '#94A3B8', transition: 'color 0.2s' }} onMouseEnter={(e) => (e.target.style.color = '#FF6B00')} onMouseLeave={(e) => (e.target.style.color = '#94A3B8')}>
                  Help & Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Hours & Service */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.1rem', marginBottom: '18px' }}>Delivery Hours</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: '#94A3B8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IconClock size={16} color="var(--primary)" />
                <span>Mon – Fri: 10:00 AM – 11:00 PM</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IconClock size={16} color="var(--primary)" />
                <span>Sat – Sun: 09:00 AM – 12:00 AM</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', fontWeight: 600 }}>
                <span>⚡ Average Delivery: 25 - 35 mins</span>
              </div>
            </div>
          </div>

          {/* Column 4: Contact & Assignment Details */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.1rem', marginBottom: '18px' }}>Get in Touch</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: '#94A3B8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IconMapPin size={16} color="var(--primary)" />
                <span>SLIIT Malabe Campus, Sri Lanka</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IconPhone size={16} color="var(--primary)" />
                <span>+94 11 754 4801</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IconMail size={16} color="var(--primary)" />
                <span>support@foodieexpress.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid #1E293B',
            paddingTop: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            fontSize: '0.85rem',
            color: '#64748B',
          }}
        >
          <div>
            © {new Date().getFullYear()} FoodieExpress. All rights reserved. SE2020 Web & Mobile Technologies.
          </div>
          <div style={{ display: 'flex', gap: '18px' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
