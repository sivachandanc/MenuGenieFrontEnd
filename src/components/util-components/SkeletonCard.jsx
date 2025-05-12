function SkeletonCard() {
    return (
      <div className="w-full p-4 border rounded-lg shadow bg-white animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  
  export default SkeletonCard;