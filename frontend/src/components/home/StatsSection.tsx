export default function StatsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#0b1736] mb-12">
          Adopted and loved by millions of users for over a decade
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Stat 1 */}
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="mb-4">
              <div className="inline-block relative">
                <svg
                  className="w-12 h-12 text-[#0066ff]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                  <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm3 7h-2v2h-2v-2H9v-2h2V9h2v2h2v2z" />
                </svg>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-[#ff5c00] rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="text-5xl font-bold text-[#0b1736] mb-2">500K+</div>
            <p className="text-gray-700">Global paying customers</p>
          </div>

          {/* Stat 2 */}
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="mb-4">
              <div className="inline-block relative">
                <svg
                  className="w-12 h-12 text-[#ff5c00]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-[#ff5c00] rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="text-5xl font-bold text-[#0b1736] mb-2">256M</div>
            <p className="text-gray-700">Links & QR Codes created monthly</p>
          </div>

          {/* Stat 3 */}
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="mb-4">
              <div className="inline-block relative">
                <svg
                  className="w-12 h-12 text-[#ff5c00]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M4.5 16.5c-1.5 1.26-2.5 3.44-2.5 5.5h15c0-2.06-1-4.24-2.5-5.5m-2.5-5.5c0 2.76-2.24 5-5 5s-5-2.24-5-5 2.24-5 5-5 5 2.24 5 5m-5-9c-4.96 0-9 4.04-9 9 0 1.42.34 2.76.93 3.96 1.53-1.92 3.83-3.06 6.07-3.06 2.24 0 4.54 1.14 6.07 3.06.59-1.2.93-2.55.93-3.96 0-4.96-4.04-9-9-9zm15 9c0-4.96-4.04-9-9-9-2.12 0-4.07.74-5.62 1.98C13.51 2.82 18 7.55 18 13.03c2.16-1.43 3.79-3.85 3.79-6.71z" />
                </svg>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-[#ff5c00] rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="text-5xl font-bold text-[#0b1736] mb-2">800+</div>
            <p className="text-gray-700">App integrations</p>
          </div>

          {/* Stat 4 */}
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="mb-4">
              <div className="inline-block relative">
                <svg
                  className="w-12 h-12 text-[#ff5c00]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path
                    d="M15 12c0 1.654-1.346 3-3 3s-3-1.346-3-3 1.346-3 3-3 3 1.346 3 3z"
                    fill="white"
                  />
                </svg>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-[#ff5c00] rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="text-5xl font-bold text-[#0b1736] mb-2">10B</div>
            <p className="text-gray-700">
              Connections (clicks & scans monthly)
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
