"use client"
import { useState } from 'react';
import Image from 'next/image';
import logo from '../youtube.png';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const session = useSession();
  console.log(session);
  const authenticateUser = () => {
    if (session.status != 'authenticated') {
      window.open('/', "_self");
    }
    else {
      window.open("/central-free", "_self");
    }
  };
  return (
    <div className="fixed w-full z-50">
      {/* Header Container */}
      <div className="h-16 bg-black shadow-md">
        <div className="flex justify-between items-center h-full px-6">
          {/* Branding */}
          <Link href={'/'}>
            <div className="flex items-center">
              <Image
                src={logo}
                className="mr-1"
                alt="Logo"
                width={35}
                height={20}
              />
              <h1 className="text-white text-xl font-bold tracking-wide">
                Video<span className='text-orange-500'>Pod</span>
              </h1>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex space-x-6">
            <Link href="/features" className="text-white hover:text-orange-200 transition mt-1">
              Features
            </Link>
            <Link href="/pricing" className="text-white hover:text-orange-200 transition mt-1">
              Pricing
            </Link>
            <Link href="https://www.linkedin.com/in/sidd-myself/" className="text-white hover:text-orange-200 transition mt-1">
              Developer
            </Link>
            <Link href="https://wa.me/6289368650" className="text-white hover:text-orange-200 transition mt-1">
              Contact
            </Link>

            <Button className="bg-orange-500 text-black hover:bg-slate-200"
              onClick={authenticateUser}
            >
              Get Started
            </Button>

          </nav>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none hover:text-orange-200 transition"
              aria-label="Open navigation menu"
            >
              ☰
            </button>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-x-0 h-[3px] bg-gradient-to-r from-orange-500 via-yellow-500 to-red-500 blur-sm" />
          <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-orange-500 via-yellow-500 to-red-500" />
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black shadow-md">
          <nav className="flex flex-col space-y-4 py-4 px-6">
            <Link href="/" className="text-white hover:text-orange-200 transition">
              Features
            </Link>
            <Link href="/" className="text-white hover:text-orange-200 transition">
              About Us
            </Link>
            <Link href="/" className="text-white hover:text-orange-200 transition">
              Pricing
            </Link>
            <Link href="/" className="text-white hover:text-orange-200 transition">
              Contact
            </Link>
            <Link href="/signup">
              <Button className="bg-orange-500 text-black hover:bg-slate-200 w-full">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
