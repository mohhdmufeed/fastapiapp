function Footer() {
  return (
    <footer style={{
      marginTop: 'auto',
      padding: '24px 16px',
      borderTop: '1px solid var(--border)',
      textAlign: 'center',
      color: 'var(--text)',
      fontSize: '14px'
    }}>
      <p>&copy; {new Date().getFullYear()} TalentSpark. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
