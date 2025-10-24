'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Dashboard' },
  { href: '/explorer', label: 'Explorer' },
  { href: '/subnets', label: 'Subnets' },
  { href: '/validators', label: 'Validators' },
  { href: '/stake', label: 'Stake' },
  { href: '/tasks', label: 'AI Tasks' },
  { href: '/docs', label: 'Docs' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'glass-panel border-b border-white/10 shadow-lg'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12 lg:h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="text-lg font-bold text-white font-mono tracking-wider border border-white px-2 py-1 hover:bg-primary-gold hover:text-black hover:border-primary-gold transition-all">
              01A LABS
            </span>
            <span className="text-xs text-gray-400 hidden md:inline-block font-mono">
              {/* AI_LAYER2_TERMINAL */}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target={(link as any).external ? '_blank' : undefined}
                rel={(link as any).external ? 'noopener noreferrer' : undefined}
                className={cn(
                  'px-3 py-1.5 rounded-none text-xs font-medium transition-all duration-200',
                  pathname === link.href
                    ? 'bg-primary-gold text-black border border-primary-gold'
                    : 'text-white hover:bg-white hover:text-black border border-transparent hover:border-white'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Bridge & Connect Buttons */}
          <div className="hidden lg:flex items-center gap-2">
            <Link href="/bridge">
              <button className="px-3 py-1.5 border border-primary-gold text-primary-gold hover:bg-primary-gold hover:text-black transition-all text-xs font-mono">
                [BRIDGE]
              </button>
            </Link>
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                mounted,
              }) => {
                const ready = mounted;
                const connected = ready && account && chain;

                return (
                  <div
                    {...(!ready && {
                      'aria-hidden': true,
                      style: {
                        opacity: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <button
                            onClick={openConnectModal}
                            className="px-3 py-1.5 border border-white text-white hover:bg-white hover:text-black transition-all text-xs font-mono"
                          >
                            [CONNECT]
                          </button>
                        );
                      }

                      if (chain.unsupported) {
                        return (
                          <button
                            onClick={openChainModal}
                            className="px-3 py-1.5 border border-red-400 text-red-400 hover:bg-red-400 hover:text-black transition-all text-xs font-mono"
                          >
                            [WRONG_NETWORK]
                          </button>
                        );
                      }

                      return (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={openChainModal}
                            className="px-3 py-1.5 border border-white/30 text-white hover:bg-white hover:text-black transition-all text-xs font-mono"
                          >
                            [{chain.name?.toUpperCase().replace(/ /g, '_') || 'UNKNOWN'}]
                          </button>
                          <button
                            onClick={openAccountModal}
                            className="px-3 py-1.5 border border-primary-gold text-white hover:bg-primary-gold hover:text-black transition-all text-xs font-mono"
                          >
                            [{account.displayName}]
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg glass-panel-hover"
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass-panel border-t border-white/10"
          >
            <div className="px-4 py-6 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  target={(link as any).external ? '_blank' : undefined}
                  rel={(link as any).external ? 'noopener noreferrer' : undefined}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'block px-4 py-3 rounded-lg text-base font-medium transition-all',
                    pathname === link.href
                      ? 'bg-white/10 text-primary-accent'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-white/10 space-y-2 font-mono">
                <Link href="/bridge" onClick={() => setIsOpen(false)}>
                  <button className="w-full px-4 py-3 border border-primary-gold text-primary-gold hover:bg-primary-gold hover:text-black transition-all text-sm font-medium">
                    [BRIDGE]
                  </button>
                </Link>
                <ConnectButton.Custom>
                  {({
                    account,
                    chain,
                    openAccountModal,
                    openChainModal,
                    openConnectModal,
                    mounted,
                  }) => {
                    const ready = mounted;
                    const connected = ready && account && chain;

                    if (!connected) {
                      return (
                        <button
                          onClick={openConnectModal}
                          className="w-full px-4 py-3 border border-white text-white hover:bg-white hover:text-black transition-all text-sm font-medium"
                        >
                          [CONNECT]
                        </button>
                      );
                    }

                    return (
                      <div className="space-y-2">
                        <button
                          onClick={openChainModal}
                          className="w-full px-4 py-3 border border-white/30 text-white hover:bg-white hover:text-black transition-all text-sm font-medium"
                        >
                          [{chain.name?.toUpperCase().replace(/ /g, '_') || 'UNKNOWN'}]
                        </button>
                        <button
                          onClick={openAccountModal}
                          className="w-full px-4 py-3 border border-primary-gold text-white hover:bg-primary-gold hover:text-black transition-all text-sm font-medium"
                        >
                          [{account.displayName}]
                        </button>
                      </div>
                    );
                  }}
                </ConnectButton.Custom>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

