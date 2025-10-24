
import { useRef } from 'react';
import LaserFlow from '../laser';
import { useTheme } from '@/providers/ThemeProvider';
// NOTE: You can also adjust the variables in the shader for super detailed customization

// Basic Usage
export default function LaserBg({ children }: { children: React.ReactNode }) {
  const revealImgRef = useRef<HTMLImageElement | null>(null);
  const { theme } = useTheme()
  return (
    <div 
      style={{ 
        height: '100vh', 
        position: 'relative', 
        overflow: 'hidden',
        backgroundColor: theme === 'dark' ? '#060010' : '#f5ffff'
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const el = revealImgRef.current;
        if (el) {
          el.style.setProperty('--mx', `${x}px`);
          el.style.setProperty('--my', `${y + rect.height * 0.5}px`);
        }
      }}
      onMouseLeave={() => {
        const el = revealImgRef.current;
        if (el) {
          el.style.setProperty('--mx', '-9999px');
          el.style.setProperty('--my', '-9999px');
        }
      }}
    >
      <LaserFlow
        horizontalBeamOffset={0.1}
        verticalBeamOffset={0.32}
        color={theme === 'dark' ? '#FF79C6' : '#F8F8F5'}
      />
      
      <div className="dark:bg-[#060010] bg-neutral-50" style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '86%',
        height: '65%',
        borderRadius: '20px',
        border: `2px solid ${theme === 'dark' ? '#FF79C6' : '#2F5F5F'}`,
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'stretch',
        color: 'white',
        zIndex: 6,
        overflow: 'hidden'
      }}>
        <div style={{ width: '100%', height: '100%', overflow: 'auto', padding: '24px' }}>
          {children}
        </div>
      </div>

      <img
        ref={revealImgRef}
            src="/images/laserBg.png"
        alt="Reveal effect"
        style={{
          position: 'absolute',
          width: '100%',
          top: '-50%',
          zIndex: 5,
          mixBlendMode: 'lighten',
          opacity: 0.3,
          pointerEvents: 'none',
          // @ts-expect-error expect error because we are using a custom property
          '--mx': '-9999px',
          '--my': '-9999px',
          WebkitMaskImage: 'radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 60px, rgba(255,255,255,0.6) 120px, rgba(255,255,255,0.25) 180px, rgba(255,255,255,0) 240px)',
          maskImage: 'radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 60px, rgba(255,255,255,0.6) 120px, rgba(255,255,255,0.25) 180px, rgba(255,255,255,0) 240px)',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat'
        }}
      />
    </div>
  );
}