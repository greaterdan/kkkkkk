'use client';

import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { GlassCard } from '@/components/GlassCard';
import { ParticleBackground } from '@/components/ParticleBackground';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <ParticleBackground />

      {/* Hologram Effect Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-[600px] h-[600px] rounded-full bg-gradient-radial from-primary-accent/20 to-transparent blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-2xl w-full">
        <GlassCard className="p-12 text-center" gradient>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* 404 Hologram */}
            <motion.div
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative"
            >
              <h1 className="text-9xl font-black gradient-text text-shadow">404</h1>
              <div className="absolute inset-0 bg-gradient-to-b from-primary-accent/30 to-primary-purple/30 blur-3xl animate-glow-pulse" />
            </motion.div>

            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-white">Page Not Found</h2>
              <p className="text-xl text-gray-300">
                The page you&apos;re looking for doesn&apos;t exist in this dimension of the
                AI Layer-2.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Link href="/">
                <Button variant="primary" size="lg" icon={Home}>
                  Go Home
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                icon={ArrowLeft}
                onClick={() => window.history.back()}
              >
                Go Back
              </Button>
            </div>

            {/* Decorative Elements */}
            <div className="pt-8 flex items-center justify-center gap-12 text-sm text-gray-400">
              <Link
                href="/explorer"
                className="hover:text-primary-accent transition-colors"
              >
                Explorer
              </Link>
              <span>•</span>
              <Link
                href="/subnets"
                className="hover:text-primary-accent transition-colors"
              >
                Subnets
              </Link>
              <span>•</span>
              <Link
                href="/validators"
                className="hover:text-primary-accent transition-colors"
              >
                Validators
              </Link>
            </div>
          </motion.div>
        </GlassCard>
      </div>
    </div>
  );
}

