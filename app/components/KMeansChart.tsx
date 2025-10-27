'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface DataPoint {
  x: number;
  y: number;
  cluster: number;
}

interface Centroid {
  x: number;
  y: number;
}

interface KMeansChartProps {
  subnetTasks?: any[];
}

export default function KMeansChart({ subnetTasks = [] }: KMeansChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);

  // Generate clusters based on REAL subnet tasks
  const generateClusters = (): { points: DataPoint[], centroids: Centroid[] } => {
    const points: DataPoint[] = [];
    
    if (subnetTasks.length === 0) {
      // Generate more realistic sample clusters
      for (let i = 0; i < 20; i++) {
        points.push({
          x: 1 + (Math.random() - 0.5) * 2,
          y: 1 + (Math.random() - 0.5) * 2,
          cluster: 0
        });
      }
      for (let i = 0; i < 15; i++) {
        points.push({
          x: 3 + (Math.random() - 0.5) * 2,
          y: 3 + (Math.random() - 0.5) * 2,
          cluster: 1
        });
      }
    } else {
      // Use REAL task data for clustering with better distribution
      const processingTasks = subnetTasks.filter(task => task.status === 'processing');
      const completedTasks = subnetTasks.filter(task => task.status === 'completed');
      
      // Processing tasks cluster - circular distribution
      processingTasks.forEach((task, i) => {
        const progress = task.progress || 0;
        const angle = (i / Math.max(processingTasks.length, 1)) * 2 * Math.PI;
        const radius = 0.6 + (progress / 100) * 0.4;
        points.push({
          x: 1.5 + Math.cos(angle) * radius + (Math.random() - 0.5) * 0.2,
          y: 1.5 + Math.sin(angle) * radius + (Math.random() - 0.5) * 0.2,
          cluster: 0
        });
      });
      
      // Completed tasks cluster - circular distribution
      completedTasks.forEach((task, i) => {
        const angle = (i / Math.max(completedTasks.length, 1)) * 2 * Math.PI;
        const radius = 0.6 + Math.random() * 0.3;
        points.push({
          x: 3.5 + Math.cos(angle) * radius + (Math.random() - 0.5) * 0.2,
          y: 3.5 + Math.sin(angle) * radius + (Math.random() - 0.5) * 0.2,
          cluster: 1
        });
      });
    }
    
    const centroids: Centroid[] = [
      { x: 1, y: 1 }, // Processing cluster
      { x: 3, y: 3 }  // Completed cluster
    ];
    
    return { points, centroids };
  };

  const { points, centroids } = generateClusters();
  const minX = -3, maxX = 4;
  const minY = -3, maxY = 4;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas with black background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set up coordinate system
    const padding = 40;
    const chartWidth = rect.width - padding * 2;
    const chartHeight = rect.height - padding * 2;

    const scaleX = (x: number) => padding + ((x - minX) / (maxX - minX)) * chartWidth;
    const scaleY = (y: number) => padding + ((maxY - y) / (maxY - minY)) * chartHeight;

    // Draw subtle grid
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 5; i++) {
      const x = padding + (i / 5) * chartWidth;
      const y = padding + (i / 5) * chartHeight;
      
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, padding + chartHeight);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(padding + chartWidth, y);
      ctx.stroke();
    }

    // Draw data points with animation
    points.forEach((point, index) => {
      const originalX = scaleX(point.x);
      const originalY = scaleY(point.y);
      
      // Animate points moving slightly towards their cluster center
      const centroid = centroids[point.cluster];
      const targetX = scaleX(centroid.x);
      const targetY = scaleY(centroid.y);
      
      const animatedX = originalX + (targetX - originalX) * animationProgress * 0.3;
      const animatedY = originalY + (targetY - originalY) * animationProgress * 0.3;
      
      // Set color based on cluster with gradient
      const colors = point.cluster === 0 ? ['#0201ff', '#0100cc'] : ['#ff4500', '#ff6347'];
      const gradient = ctx.createRadialGradient(animatedX, animatedY, 0, animatedX, animatedY, 6);
      gradient.addColorStop(0, colors[0]);
      gradient.addColorStop(1, colors[1]);
      
      ctx.fillStyle = gradient;
      ctx.shadowColor = point.cluster === 0 ? '#0201ff' : '#ff4500';
      ctx.shadowBlur = 8;
      
      ctx.beginPath();
      ctx.arc(animatedX, animatedY, 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Draw centroids with animation
    centroids.forEach((centroid, index) => {
      const x = scaleX(centroid.x);
      const y = scaleY(centroid.y);
      
      // Animate centroids appearing with better styling
      const scale = animationProgress;
      
      // Draw centroid with pulsing effect
      ctx.strokeStyle = '#0201ff';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#0201ff';
      ctx.shadowBlur = 12;
      
      // Draw X marker with pulsing
      const size = 10 * scale;
      const pulse = Math.sin(Date.now() * 0.003) * 2;
      const finalSize = size + pulse;
      
      ctx.beginPath();
      ctx.moveTo(x - finalSize, y - finalSize);
      ctx.lineTo(x + finalSize, y + finalSize);
      ctx.moveTo(x + finalSize, y - finalSize);
      ctx.lineTo(x - finalSize, y + finalSize);
      ctx.stroke();
      
      // Add inner circle
      ctx.fillStyle = '#0201ff';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(x, y, 3 * scale, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw axes with labels
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 0;
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(padding, padding + chartHeight);
    ctx.lineTo(padding + chartWidth, padding + chartHeight);
    ctx.stroke();
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, padding + chartHeight);
    ctx.stroke();
    
    // Add axis labels
    ctx.fillStyle = '#aaa';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Task Complexity', padding + chartWidth / 2, padding + chartHeight + 20);
    
    ctx.save();
    ctx.translate(15, padding + chartHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Progress %', 0, 0);
    ctx.restore();

    // Draw labels
    ctx.fillStyle = '#aaa';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('X-axis', padding + chartWidth / 2, padding + chartHeight + 30);
    
    ctx.save();
    ctx.translate(15, padding + chartHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Y-axis', 0, 0);
    ctx.restore();
  }, [isVisible, animationProgress, points, centroids, minX, maxX, minY, maxY]);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setAnimationProgress(1);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  return (
    <motion.div
      className="relative bg-black/80 backdrop-blur-md rounded-lg border border-[#0201ff]/50 p-4"
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      onViewportEnter={() => setIsVisible(true)}
      transition={{ duration: 0.6 }}
    >
      <h3 className="chart-title font-bold text-base mb-3">All Subnets Task Clustering</h3>
      
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full h-48 rounded"
          style={{ background: '#000000' }}
        />
      </div>
      
      {/* Legend - Below Chart */}
      <div className="mt-3 flex justify-center">
        <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-[#0201ff]/20">
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-[#0201ff] to-[#0100cc] rounded-full shadow-lg shadow-[#0201ff]/30"></div>
              <span className="text-xs text-white font-medium">Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-red-400 rounded-full shadow-lg shadow-red-500/30"></div>
              <span className="text-xs text-white font-medium">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-[#0201ff] rounded-full flex items-center justify-center">
                <div className="w-1 h-1 bg-[#0201ff] rounded-full animate-pulse"></div>
              </div>
              <span className="text-xs text-white font-medium">Centroids</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
