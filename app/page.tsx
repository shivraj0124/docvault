"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/client/profile";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  Shield,
  CloudUpload,
  Search,
  Download,
  Lock,
  FolderOpen,
} from "lucide-react";

export default function Home() {
  const { data } = useQuery({
    queryKey: ["current-user"],
    queryFn: getProfile,
    retry: false,
  });

  const user = data?.user;
  const features = [
    {
      title: "Secure Storage",
      description: "Store your important documents securely in the cloud.",
      icon: Shield,
    },
    {
      title: "Upload Files",
      description: "Upload PDFs and images in just a few clicks.",
      icon: CloudUpload,
    },
    {
      title: "Quick Search",
      description: "Find your documents instantly with smart search.",
      icon: Search,
    },
    {
      title: "Download Anytime",
      description: "Access and download your files whenever you need.",
      icon: Download,
    },
    {
      title: "Private & Safe",
      description: "JWT Authentication keeps your account protected.",
      icon: Lock,
    },
    {
      title: "Manage Documents",
      description: "Rename, delete and organize your files effortlessly.",
      icon: FolderOpen,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold text-blue-600">DocVault</h1>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/profile"
                className="flex items-center gap-3 rounded-lg p-1 hover:bg-gray-100 transition"
              >
                <Avatar>
                  <AvatarFallback>
                    {user.name?.charAt(0).toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>

                <span className="hidden md:block font-medium">{user.name}</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-lg border px-5 py-2 hover:bg-gray-100 transition"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto flex max-w-7xl flex-col items-center px-6 py-24 text-center">
        <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
          Secure Cloud Document Manager
        </span>

        <h1 className="mt-6 max-w-4xl text-5xl font-extrabold leading-tight text-gray-900">
          Store, Manage and Access Your Documents
          <span className="text-blue-600"> Anytime, Anywhere.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-gray-600">
          DocVault helps you securely upload, organize, search and manage your
          important documents with a simple and elegant interface.
        </p>

        <div className="mt-10 flex gap-4">
          {user ? (
            <Link
              href="/dashboard"
              className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white hover:bg-blue-700 transition"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/register"
                className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white hover:bg-blue-700 transition"
              >
                Get Started
              </Link>

              <Link
                href="/login"
                className="rounded-xl border border-gray-300 px-8 py-4 text-lg font-semibold hover:bg-gray-100 transition"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Everything You Need</h2>

          <p className="mt-3 text-gray-600">
            Powerful features for managing your documents.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <feature.icon className="mb-5 h-10 w-10 text-blue-600" />

              <h3 className="text-xl font-semibold">{feature.title}</h3>

              <p className="mt-3 text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-20">
        <div className="mx-auto max-w-5xl px-6 text-center text-white">
          <h2 className="text-4xl font-bold">
            Ready to organize your documents?
          </h2>

          <p className="mt-4 text-lg text-blue-100">
            Create your free account and start managing your files securely
            today.
          </p>

          <Link
            href="/register"
            className="mt-8 inline-block rounded-xl bg-white px-8 py-4 font-semibold text-blue-600 hover:bg-gray-100 transition"
          >
            Create Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-6">
        <div className="mx-auto max-w-7xl text-center text-gray-500">
          © {new Date().getFullYear()} DocVault. Built with Next.js, Tailwind
          CSS & Cloudinary.
        </div>
      </footer>
    </main>
  );
}
