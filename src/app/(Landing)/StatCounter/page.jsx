"use client";

import React, { useState, useEffect } from 'react';
import { Briefcase, Users, MapPin, Star } from 'lucide-react';

const StatCard = ({ icon: Icon, value, label, suffix = '+' }) => {
  return (
    <div className="text-center group">
      <div className="text-5xl md:text-6xl font-bold mb-4 group-hover:scale-110 transition-transform duration-300 text-violet-300">
        {value.toLocaleString()}{suffix}
      </div>
      <div className="text-white flex items-center justify-center gap-3 text-lg">
        <Icon className="w-6 h-6" style={{color: 'rgba(105, 90, 166, 0.8)'}} />
        {label}
      </div>
    </div>
  );
};

const StatCounter = () => {
  const [stats, setStats] = useState({
    jobsDone: 0,
    providers: 0,
    communities: 0,
    satisfaction: 0
  });

  useEffect(() => {
    const targets = { jobsDone: 1000, providers: 200, communities: 150, satisfaction: 95 };
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      
      setStats({
        jobsDone: Math.floor(targets.jobsDone * progress),
        providers: Math.floor(targets.providers * progress),
        communities: Math.floor(targets.communities * progress),
        satisfaction: Math.floor(targets.satisfaction * progress)
      });

      if (step >= steps) clearInterval(timer);
    }, stepDuration);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 text-white relative overflow-hidden" style={{backgroundColor: '#695aa6'}}>
      <div className="absolute inset-0" style={{backgroundColor: 'rgba(105, 90, 166, 0.1)'}}></div>
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full blur-xl animate-pulse" style={{backgroundColor: 'rgba(255, 255, 255, 0.1)'}}></div>
        <div className="absolute bottom-10 right-20 w-40 h-40 rounded-full blur-xl animate-pulse" style={{backgroundColor: 'rgba(255, 255, 255, 0.05)'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-2xl" style={{backgroundColor: 'rgba(255, 255, 255, 0.03)'}}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 text-white">Our Impact</h2>
          <p className="text-xl text-white opacity-80">Making a difference across communities</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 ">
          <StatCard icon={Briefcase} value={stats.jobsDone} label="Jobs Completed" />
          <StatCard icon={Users} value={stats.providers} label="Service Providers" />
          <StatCard icon={MapPin} value={stats.communities} label="Communities Served" />
          <StatCard icon={Star} value={stats.satisfaction} label="Satisfaction Rate" suffix="%" />
        </div>
      </div>
    </section>
  );
};

export default StatCounter;