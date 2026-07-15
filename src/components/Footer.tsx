import { social } from '@/content';
import type { Dictionary } from '@/content';

export default function Footer({ dict }: { dict: Dictionary }) {
  return (
    <footer className="border-t border-line/5">
      <div className="mx-auto flex max-w-content flex-col items-center gap-4 px-5 py-10 text-center md:flex-row md:justify-between md:text-left">
        <div>
          <p className="text-sm font-medium text-fg">Philip Scheer</p>
          <p className="mt-1 text-sm text-faint">{dict.footer.tagline}</p>
        </div>
        <div className="flex items-center gap-5 text-sm">
          <a
            href={social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted transition-colors hover:text-primary"
          >
            LinkedIn
          </a>
          <a
            href={social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted transition-colors hover:text-primary"
          >
            GitHub
          </a>
          <a
            href={`mailto:${social.email}`}
            className="text-muted transition-colors hover:text-primary"
          >
            Email
          </a>
        </div>
      </div>
      <div className="border-t border-line/5 py-4 text-center text-xs text-faint">
        © {new Date().getFullYear()} {dict.footer.rights}
      </div>
    </footer>
  );
}
