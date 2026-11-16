import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getFoodItemsApi } from '../services/api';
import { FoodCard } from '../components/food/FoodCard';
import { FoodDetailModal } from '../components/food/FoodDetailModal';
import {
  IconSearch,
  IconTruck,
  IconShield,
  IconClock,
  IconStar,
  IconArrowRight,
  IconSparkles,
} from '../components/common/Icons';

export const Home = () => {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await getFoodItemsApi();
        if (response.data.success) {
          // Take first 6 items as featured
          setFeaturedItems(response.data.data.slice(0, 6));
        }
      } catch (err) {
        console.error('Error fetching featured meals:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/menu?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/menu');
    }
  };

  const categories = [
    {
      title: 'Main Course',
      desc: 'Artisan burgers, cheesy pizzas & gourmet steaks',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
      tag: 'Burgers & Pizzas',
    },
    {
      title: 'Starters',
      desc: 'Crispy chicken tenders, garlic fries & spicy wings',
      image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&auto=format&fit=crop&q=80',
      tag: 'Crispy & Savory',
    },
    {
      title: 'Desserts',
      desc: 'Decadent chocolate lava cakes & fresh pastries',
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80',
      tag: 'Sweet Treats',
    },
    {
      title: 'Beverages',
      desc: 'Iced macchiatos, mango smoothies & mocktails',
      image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=80',
      tag: 'Chilled Drinks',
    },
  ];

  return (
    <div>
      {/* =========================================================================
          HERO SECTION
          ========================================================================= */}
      <section
        style={{
          background: 'var(--hero-gradient)',
          paddingTop: '60px',
          paddingBottom: '80px',
          borderBottom: '1px solid rgba(255, 107, 0, 0.1)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              alignItems: 'center',
              gap: '40px',
            }}
          >
            {/* Left Hero Content */}
            <div>
              <div
                className="badge"
                style={{
                  backgroundColor: 'rgba(255, 107, 0, 0.15)',
                  color: 'var(--primary)',
                  border: '1px solid rgba(255, 107, 0, 0.3)',
                  marginBottom: '18px',
                  padding: '6px 14px',
                  fontSize: '0.82rem',
                }}
              >
                <IconSparkles size={14} /> The Food You Love, Delivered Sizzling Hot
              </div>

              <h1
                style={{
                  fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
                  fontWeight: 900,
                  color: '#0F172A',
                  lineHeight: 1.15,
                  marginBottom: '20px',
                }}
              >
                Delicious Meals, <br />
                <span style={{ color: 'var(--primary)' }}>Fast & Fresh</span> to Your Doorstep.
              </h1>

              <p
                style={{
                  fontSize: '1.15rem',
                  color: '#475569',
                  lineHeight: 1.6,
                  marginBottom: '32px',
                  maxWidth: '520px',
                }}
              >
                Experience gourmet flavors prepared by expert chefs. Seamless ordering across
                our web platform and connected mobile application.
              </p>

              {/* Search Bar Form */}
              <form
                onSubmit={handleSearchSubmit}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-full)',
                  padding: '6px 8px 6px 20px',
                  boxShadow: 'var(--shadow-xl)',
                  border: '1.5px solid var(--border-light)',
                  maxWidth: '520px',
                  marginBottom: '28px',
                }}
              >
                <IconSearch size={22} color="var(--primary)" />
                <input
                  type="text"
                  placeholder="Search burgers, pizzas, desserts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    padding: '12px 14px',
                    fontSize: '1rem',
                    color: 'var(--text-main)',
                    background: 'transparent',
                  }}
                />
                <button type="submit" className="btn btn-primary" style={{ borderRadius: 'var(--radius-full)' }}>
                  Find Food
                </button>
              </form>

              {/* Social Proof Stats */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex', color: '#F59E0B' }}>
                    <IconStar size={18} />
                    <IconStar size={18} />
                    <IconStar size={18} />
                    <IconStar size={18} />
                    <IconStar size={18} />
                  </div>
                  <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>4.9/5</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>(2,400+ reviews)</span>
                </div>
                <div style={{ color: '#CBD5E1' }}>|</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: '#475569', fontWeight: 600 }}>
                  <IconTruck size={18} color="var(--primary)" />
                  <span>Free 25-35 min delivery</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Banner */}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '480px',
                  aspectRatio: '1',
                  borderRadius: '36px',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-xl)',
                  border: '4px solid #FFFFFF',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80"
                  alt="Delicious burger with crispy fries"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* Floating Badge 1 */}
                <div
                  style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(8px)',
                    padding: '10px 16px',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <span style={{ fontSize: '24px' }}>🔥</span>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>HOTTEST SELLER</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)' }}>Cheeseburger Supreme</div>
                  </div>
                </div>

                {/* Floating Badge 2 */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '24px',
                    right: '20px',
                    backgroundColor: 'rgba(15, 23, 42, 0.92)',
                    backdropFilter: 'blur(8px)',
                    color: '#FFFFFF',
                    padding: '12px 18px',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-xl)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconClock size={20} color="#FFF" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>SPEEDY DISPATCH</div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 800 }}>Under 30 Minutes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CATEGORY EXPLORATION
          ========================================================================= */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 48px' }}>
            <span className="badge badge-category" style={{ marginBottom: '10px' }}>
              Explore By Category
            </span>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '12px' }}>What Are You Craving Today?</h2>
            <p>From sizzling burgers to sweet desserts and energizing smoothies, we have everything you love.</p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
            }}
          >
            {categories.map((cat) => (
              <Link
                key={cat.title}
                to={`/menu?category=${encodeURIComponent(cat.title)}`}
                className="card"
                style={{
                  position: 'relative',
                  height: '240px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '24px',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                  }}
                  onMouseEnter={(e) => (e.target.style.transform = 'scale(1.08)')}
                  onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.3) 60%, transparent 100%)',
                  }}
                />
                <div style={{ position: 'relative', zIndex: 1, color: '#FFFFFF' }}>
                  <span
                    className="badge"
                    style={{
                      backgroundColor: 'rgba(255, 107, 0, 0.85)',
                      color: '#FFF',
                      marginBottom: '8px',
                    }}
                  >
                    {cat.tag}
                  </span>
                  <h3 style={{ fontSize: '1.4rem', color: '#FFFFFF', marginBottom: '4px' }}>{cat.title}</h3>
                  <p style={{ color: '#CBD5E1', fontSize: '0.85rem' }}>{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          FEATURED POPULAR DISHES
          ========================================================================= */}
      <section style={{ padding: '80px 0', backgroundColor: 'var(--bg-subtle)' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '40px',
              gap: '16px',
            }}
          >
            <div>
              <span className="badge badge-category" style={{ marginBottom: '10px' }}>
                Chef's Handpicked
              </span>
              <h2 style={{ fontSize: '2.2rem' }}>Featured Delicacies</h2>
              <p>Top ordered customer favorites, prepared fresh daily.</p>
            </div>

            <Link to="/menu" className="btn btn-outline">
              Explore All Dishes <IconArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
              <div className="spinner spinner-lg"></div>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
                gap: '28px',
              }}
            >
              {featuredItems.map((item) => (
                <FoodCard
                  key={item._id}
                  foodItem={item}
                  onSelect={(selected) => setSelectedFood(selected)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          WHY CHOOSE FOODIEEXPRESS
          ========================================================================= */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 50px' }}>
            <span className="badge badge-category" style={{ marginBottom: '10px' }}>
              Our Promise
            </span>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '12px' }}>Why Food Lovers Choose Us</h2>
            <p>We pride ourselves on culinary excellence and high-speed delivery service.</p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '24px',
            }}
          >
            <div className="card" style={{ padding: '30px 24px', textAlign: 'center' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  fontSize: '28px',
                }}
              >
                🍳
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Farm-Fresh Ingredients</h3>
              <p style={{ fontSize: '0.9rem' }}>
                Only the finest organic produce, premium cuts of beef, and artisanal bakery bread.
              </p>
            </div>

            <div className="card" style={{ padding: '30px 24px', textAlign: 'center' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--success-bg)',
                  color: 'var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                }}
              >
                <IconTruck size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>30-Minute Guarantee</h3>
              <p style={{ fontSize: '0.9rem' }}>
                Thermal insulated packaging ensures your meals arrive piping hot and fresh.
              </p>
            </div>

            <div className="card" style={{ padding: '30px 24px', textAlign: 'center' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--info-bg)',
                  color: 'var(--info)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                }}
              >
                <IconShield size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Cash On Delivery</h3>
              <p style={{ fontSize: '0.9rem' }}>
                Pay safely in cash when your delivery driver arrives at your doorstep. Zero risk.
              </p>
            </div>

            <div className="card" style={{ padding: '30px 24px', textAlign: 'center' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--purple-bg)',
                  color: 'var(--purple)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  fontSize: '28px',
                }}
              >
                📱
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Mobile & Web Sync</h3>
              <p style={{ fontSize: '0.9rem' }}>
                Order from your desktop browser or mobile phone app; both connect to the same real-time account.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modal for item preview */}
      {selectedFood && (
        <FoodDetailModal
          foodItem={selectedFood}
          onClose={() => setSelectedFood(null)}
        />
      )}
    </div>
  );
};
