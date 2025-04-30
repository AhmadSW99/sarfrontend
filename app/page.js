// LOCATION: app/page.js (or src/app/page.js if you use a src directory)

import Head from 'next/head';
import { Playwrite_RO } from 'next/font/google';

// Configure the Playwrite font
const playwriteRO = Playwrite_RO({
  subsets: ['latin', 'latin-ext'],
  weight: '400',
  display: 'swap',
});

export default function HomePage() {
  return (
    <>
      <Head>
          {/* Updated title to reflect the project */}
          <title>AI Desert Rescue - Finding the Lost</title>
          <meta name="description" content="Using AI technology to locate individuals lost in the desert." />
      </Head>

      <main
        // Adjusted Padding: Increased top (pt) and left (pl) padding
        // to move content down and right. Removed overall padding (p).
        className="relative flex min-h-screen flex-col items-start justify-start pt-28 pl-16 md:pt-32 md:pl-24 lg:pt-36 lg:pl-28" // More padding top/left
        style={{
          backgroundImage: "url('/desert.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Optional Overlay */}
        {/* <div className="absolute inset-0 bg-black/40 z-0"></div> */}

        {/* Content Wrapper */}
        <div className="relative z-10 max-w-xl"> {/* Added max-width for better text flow */}

          {/* Updated Heading with the Font */}
          <h1
            className={`${playwriteRO.className} mb-4 text-5xl font-normal text-white drop-shadow-lg md:text-6xl lg:text-7xl`} // Slightly less margin-bottom
          >
             AI Desert Rescue
          </h1>

          {/* Added Descriptive Paragraph */}
          <p className="mb-8 text-lg text-gray-100 drop-shadow-md md:text-xl">
          AI-powered object detection to assist in search and rescue operations by locating lost individuals in the desert through real-time camera analysis.          </p>

          {/* Updated Button Text */}
          <a
            href="/detect" // <-- VERY IMPORTANT: Replace '#' with the actual URL!
            className="inline-block rounded-lg bg-green-600 px-10 py-4 text-xl font-semibold text-white shadow-lg transition duration-300 ease-in-out hover:bg-green-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50" // Slightly larger padding
          >
            DETECT
          </a>
        </div>
      </main>
    </>
  );
}