export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-0)', borderTop: '1px solid var(--line)', padding: 0, textAlign: 'center' }}>
      <div style={{ height: 2, background: 'linear-gradient(90deg,var(--accent),var(--accent-2),var(--accent))' }} />
      <div style={{ padding: '1.5rem 2rem' }}>
        <p style={{ color: 'var(--text-2)', fontSize: '0.82rem' }}>
          (c) 2026 Mas Formation. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

