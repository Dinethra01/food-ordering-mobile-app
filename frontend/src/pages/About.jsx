import React from 'react';
import { Link } from 'react-router-dom';
import { IconTruck, IconShield, IconClock, IconStar, IconArrowRight } from '../components/common/Icons';

export const About = () => {
  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container" style={{ maxWidth: '980px' }}>
        {/* Hero Banner */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span className="badge badge-category" style={{ marginBottom: '12px' }}>
            Our Culinary Story
          </span>
          <h1 style={{ fontSize: '2.8rem', marginBottom: '16px', lineHeight: 1.2 }}>
            Crafting Extraordinary Meals, <br />
            Delivered in Record Time.
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto' }}>
            FoodieExpress is dedicated to bringing chef-grade gourmet burgers, authentic Italian pizzas,
            crisp starters, and artisan desserts straight to your doorstep.
          </p>
        </div>

        {/* Feature Split Banner */}
        <div
          className="card"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            overflow: 'hidden',
            marginBottom: '60px',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <div style={{ height: '360px', position: 'relative' }}>
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80"
              alt="Cozy restaurant atmosphere and chef preparation"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span className="badge" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)', marginBottom: '14px', width: 'fit-content' }}>
              Freshness First
            </span>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '16px' }}>Quality You Can Taste in Every Bite</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '20px' }}>
              Every meal begins with sustainably sourced farm ingredients. Our beef patties are ground daily in-house,
              our pizza dough is fermented for 48 hours for ultimate crispiness, and our desserts are baked fresh each morning.
            </p>
            <div style={{ display: 'flex', gap: '24px' }}>
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)' }}>50,000+</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Orders Fulfilled</div>
              </div>
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--success)' }}>99.4%</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>On-Time Rate</div>
              </div>
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#F59E0B' }}>4.9 ★</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Customer Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Pillars */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Our Core Pillars</h2>
          <p>What sets FoodieExpress apart from ordinary food ordering.</p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
            marginBottom: '60px',
          }}
        >
          <div className="card" style={{ padding: '30px 24px', textAlign: 'center' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <IconClock size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Express Fulfillment</h3>
            <p style={{ fontSize: '0.92rem' }}>
              State-of-the-art kitchen routing minimizes prep time without compromising perfection.
            </p>
          </div>

          <div className="card" style={{ padding: '30px 24px', textAlign: 'center' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--success-bg)',
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <IconShield size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Unified Experience</h3>
            <p style={{ fontSize: '0.92rem' }}>
              Seamless synchronization between our responsive website and React Native mobile app.
            </p>
          </div>

          <div className="card" style={{ padding: '30px 24px', textAlign: 'center' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--info-bg)',
                color: 'var(--info)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <IconTruck size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Thermal Packaging</h3>
            <p style={{ fontSize: '0.92rem' }}>
              Custom insulated containers keep your food steaming hot and drinks ice-cold.
            </p>
          </div>
        </div>

        {/* CTA Card */}
        <div
          className="card"
          style={{
            background: 'var(--hero-gradient)',
            padding: '40px',
            textAlign: 'center',
            border: '2px dashed var(--primary)',
          }}
        >
          <h2 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>Ready to Experience FoodieExpress?</h2>
          <p style={{ marginBottom: '24px', maxWidth: '480px', margin: '0 auto 24px' }}>
            Explore our curated menu and enjoy fresh, chef-crafted meals delivered directly to your doorstep.
          </p>
          <Link to="/menu" className="btn btn-primary btn-lg">
            Browse Menu & Order <IconArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};
