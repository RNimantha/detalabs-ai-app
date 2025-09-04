import { Wrench, Rocket, RefreshCw } from "lucide-react";

export default function UnderMaintenance() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white px-6 py-24 sm:px-16">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-indigo-500 text-white shadow-lg">
          <Wrench className="h-10 w-10" />
        </div>
        <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          We're Enhancing Our Platform
        </h1>
        <p className="mt-4 text-lg leading-8 text-gray-400">
          Our website is currently undergoing important maintenance and upgrades. We apologize for any inconvenience.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-gray-700 bg-gray-800 p-6 shadow-md transition-all duration-300 hover:scale-105">
            <Rocket className="mx-auto h-8 w-8 text-indigo-400" />
            <h3 className="mt-4 text-base font-semibold text-white">Launching Soon</h3>
            <p className="mt-2 text-sm text-gray-400">
              We're hard at work to bring you new features and a more powerful experience.
            </p>
          </div>
          <div className="rounded-xl border border-gray-700 bg-gray-800 p-6 shadow-md transition-all duration-300 hover:scale-105">
            <RefreshCw className="mx-auto h-8 w-8 text-green-400" />
            <h3 className="mt-4 text-base font-semibold text-white">Estimated Return</h3>
            <p className="mt-2 text-sm text-gray-400">
              Our site is expected to be back online shortly. Please check back in a few hours.
            </p>
          </div>
          <div className="rounded-xl border border-gray-700 bg-gray-800 p-6 shadow-md transition-all duration-300 hover:scale-105">
            <Wrench className="mx-auto h-8 w-8 text-red-400" />
            <h3 className="mt-4 text-base font-semibold text-white">System Optimizations</h3>
            <p className="mt-2 text-sm text-gray-400">
              We are improving our backend performance and security for your protection.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <a
            href="/"
            className="inline-flex items-center rounded-full bg-white px-8 py-3 text-lg font-medium text-gray-900 transition-colors duration-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Follow Our Socials
          </a>
          <p className="mt-4 text-sm text-gray-500">
            For real-time updates and announcements.
          </p>
        </div>
      </div>
    </div>
  );
}