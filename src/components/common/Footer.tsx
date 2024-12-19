"use client";
import Link from "next/link";
import Image from "next/image";
import { FaInstagram, FaTwitter } from "react-icons/fa";
import { IoLogoFacebook } from "react-icons/io5";

export function Footer() {
  return (
    <footer className="w-full border-t  bg-background mt-16">
      <div className="container max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/svgs/app-logo.svg"
                alt="CitiBooks.co.in"
                width={238}
                height={35}
                className="h-10 w-auto"
              />
            </Link>
            <div className="space-y-1 text-sm">
              <p className="text-muted-foreground">
                NY State Thruway, New York, USA
              </p>
              <p>
                <a
                  href="mailto:demo@demo.com"
                  className="text-muted-foreground hover:text-primary"
                >
                  demo@demo.com
                </a>
              </p>
              <p>
                <a
                  href="tel:+12929012122"
                  className="text-muted-foreground hover:text-primary"
                >
                  +12929012122
                </a>
              </p>
            </div>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary"
              >
                <IoLogoFacebook className="h-5 w-5" color="#0070c4" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary"
              >
                <FaTwitter className="h-5 w-5" color="#0070c4" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary"
              >
                <FaInstagram className="h-5 w-5" color="#0070c4" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>

          {/* Explore */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Explore</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  Shops
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  Authors
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  Flash Deals
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  Coupon
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  FAQ & Helps
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  Vendor Refund Policies
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  Customer Refund Policies
                </Link>
              </li>
            </ul>
          </div>

          {/* Our Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Our information</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  Manufacturers
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  Privacy policies
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  Terms & conditions
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 text-sm text-muted-foreground">
          <p>
            ©2024 Bookrent . Copyright © REDQ. All rights reserved worldwide.
            REDQ
          </p>
        </div>
      </div>
    </footer>
  );
}
