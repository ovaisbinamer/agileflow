// File: client/src/pages/PaymentSuccessPage.jsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const PaymentSuccessPage = () => {
  useEffect(() => {
    // Refresh user plan info from localStorage — the webhook will have updated
    // the DB already. They can simply visit dashboard to see their Pro badge.
  }, []);

  return (
    <div style={{
      minHeight: '100vh', background: '#0d0f14',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <style>{`
        @keyframes fadeInUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pop { 0%{transform:scale(0.5);opacity:0} 80%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
      `}</style>
      <div style={{
        background: '#13161e', border: '1px solid rgba(108,99,255,0.2)',
        borderRadius: 28, padding: '56px 48px',
        maxWidth: 480, width: '100%', textAlign: 'center',
        animation: 'fadeInUp 0.4s ease forwards',
        boxShadow: '0 24px 64px rgba(0,0,0,0.4), 0 0 40px rgba(108,99,255,0.08)',
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: 20, margin: '0 auto 24px',
          background: 'linear-gradient(135deg, rgba(108,99,255,0.2), rgba(168,85,247,0.1))',
          border: '1px solid rgba(108,99,255,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 32,
          animation: 'pop 0.5s ease 0.2s forwards', opacity: 0,
        }}>🎉</div>

        <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: 26, fontWeight: 800, color: '#e8eaf0', margin: '0 0 12px', letterSpacing: '-0.5px' }}>
          Welcome to Pro!
        </h1>
        <p style={{ color: '#8b90a7', fontSize: 15, lineHeight: 1.6, margin: '0 0 32px', fontFamily: 'Inter, sans-serif' }}>
          Your subscription is active. You now have access to unlimited boards, unlimited team members, and priority support.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Link to="/dashboard" style={{
            display: 'block', padding: '13px 28px', borderRadius: 12, textDecoration: 'none',
            background: 'linear-gradient(135deg, #6c63ff, #a855f7)',
            color: '#fff', fontSize: 15, fontWeight: 700, fontFamily: 'Inter, sans-serif',
            boxShadow: '0 4px 20px rgba(108,99,255,0.4)',
          }}>
            Go to Dashboard →
          </Link>
          <span style={{ fontSize: 12, color: '#555a72', fontFamily: 'Inter, sans-serif' }}>
            A confirmation email is on its way from Stripe.
          </span>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
