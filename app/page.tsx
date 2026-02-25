import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:64px_64px]"></div>
      
      <div className="relative flex flex-col items-center justify-center min-h-screen px-6">
        {/* Small decorative element */}
        <div className="w-1 h-12 bg-neutral-200 dark:bg-neutral-800 mb-12"></div>
        
        <h1 className="text-[5rem] md:text-[7rem] lg:text-[9rem] font-normal tracking-tight text-neutral-900 dark:text-neutral-100 mb-8 text-center leading-none">
          Citatio
        </h1>
        
        <p className="text-base md:text-lg text-neutral-500 dark:text-neutral-400 mb-16 text-center max-w-md font-normal tracking-wide">
          A sanctuary for words that matter
        </p>
        
        <Link 
          href="/quotes"
          className="group relative px-12 py-4 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium tracking-wider uppercase overflow-hidden transition-all duration-300 hover:tracking-widest"
        >
          <span className="relative z-10">Enter</span>
          <div className="absolute inset-0 bg-neutral-800 dark:bg-neutral-200 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
        </Link>
        
        {/* Bottom decorative line */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-24 h-px bg-neutral-200 dark:bg-neutral-800"></div>
      </div>
    </div>
  );
}
