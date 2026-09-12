export default function Footer() {
  return (
    <footer className="mt-12 border-t border-line py-8 px-5">
      <div className="mx-auto max-w-3xl flex flex-col items-center gap-3 text-center">

        {/* Credit line */}
        <p className="font-body text-sm text-muted leading-relaxed">
          Made with{" "}
          <span style={{ color: "#EF5D5D" }}>❤️</span>
          {" "}in India by{" "}
          <a
            href="https://github.com/Adityasingh9453"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-offwhite hover:text-xp transition-colors"
          >
            Aditya Bhadauriya
          </a>
        </p>

        {/* Links — stack vertically on mobile, horizontal on sm+ */}
        <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4 font-mono text-xs text-muted w-full">

          <a
            href="https://github.com/Adityasingh9453"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-offwhite transition-colors min-w-0"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.14 3 .4 2.28-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.21.7.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span className="truncate">github.com/Adityasingh9453</span>
          </a>

          {/* Dot separator — hidden on mobile */}
          <span className="hidden sm:block text-line">·</span>

          <a
            href="mailto:adityabhadauriya9453@gmail.com"
            className="flex items-center gap-1.5 hover:text-offwhite transition-colors min-w-0"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
            <span className="truncate">adityabhadauriya9453@gmail.com</span>
          </a>

        </div>

      </div>
    </footer>
  );
}
