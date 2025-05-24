function AboutPage() {
    return (
      <section className="bg-[var(--background)] min-h-screen py-20 px-6 text-black font-inter">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-[var(--textMain)] leading-tight">
            Bringing AI to Local Restaurants
          </h1>
  
          <p className="text-lg sm:text-xl text-[var(--textSecondary)]">
            MenuGenie empowers small food businesses — restaurants, cafes, bakeries,
            food trucks — to create their own intelligent chatbot in just a few clicks.
            Your bot knows your menu and answers your customers instantly.
          </p>
  
          <p className="text-lg sm:text-xl text-[var(--textSecondary)]">
            Every business gets a QR code, letting customers scan and chat with your bot right from their phones.
          </p>
  
          <div className="bg-[#fff7ec] border border-yellow-300 p-6 rounded-xl shadow-md">
            <p className="text-yellow-800 text-lg font-semibold">
              🚀 Currently in Beta — Free for All Users
            </p>
            <p className="text-gray-600 text-sm mt-1">
              We're in active user testing. Join now and help us shape the future of AI in food service.
            </p>
          </div>
  
          <div className="pt-6">
            <a
              href="/signup"
              className="inline-block px-6 py-3 rounded-full bg-[var(--button)] text-black font-semibold hover:bg-[var(--button-hover)] transition"
            >
              Get Started for Free
            </a>
          </div>
        </div>
      </section>
    );
  }
  
  export default AboutPage;
  