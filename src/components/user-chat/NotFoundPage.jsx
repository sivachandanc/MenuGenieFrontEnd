function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6 py-12">
      <div className="text-center space-y-6 max-w-sm w-full">
        <h1 className="text-5xl font-extrabold text-[#075E54]">404</h1>
        <p className="text-lg text-gray-700">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
    </div>
  );
}

export default NotFoundPage;
