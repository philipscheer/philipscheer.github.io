import { social } from '@/content';
import type { Dictionary } from '@/content';

export default function Footer({ dict }: { dict: Dictionary }) {
  return (
    <footer className="border-t border-white/5">
      <div className="mx-auto flex max-w-content flex-col items-center gap-4 px-5 py-10 text-center md:flex-row md:justify-between md:text-left">
        <div>
          <p className="text-sm font-medium text-white">Philip Scheer</p>
          <p className="mt-1 text-sm text-slate-500">{dict.footer.tagline}</p>
        </div>
        <div className="flex items-center gap-5 text-sm">
          <a
            href={social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 transition-colors hover:text-accent"
          >
            LinkedIn
          </a>
          <a
            href={social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 transition-colors hover:text-accent"
          >
            GitHub
          </a>
          <a
            href={`mailto:${social.email}`}
            className="text-slate-400 transition-colors hover:text-accent"
          >
            Email
          </a>
        </div>
      </div>
      <div className="border-t border-white/5 py-4 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} {dict.footer.rights}
      </div>
    </footer>
  );
}
