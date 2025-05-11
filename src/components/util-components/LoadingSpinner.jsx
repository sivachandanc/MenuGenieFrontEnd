function LoadingSpinner() {
    return (
      <div className="flex items-center justify-center">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-[var(--button)] animate-spin"></div>
          <div className="absolute inset-0 rounded-full border-4 border-dashed border-[var(--button)] opacity-30 animate-ping"></div>
        </div>
      </div>
    );
  }

export default LoadingSpinner;