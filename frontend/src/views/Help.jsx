import React from 'react';
import {
  Calculator,
  Package,
  Database,
  LineChart,
  Code2,
  Phone,
  Mail,
  User,
  HeartPulse
} from 'lucide-react';

const Help = () => {
  const services = [
    {
      title: 'Real-time POS & Billing',
      description: 'Streamline your checkout process with our lightning-fast point of sale system and automated invoice generation.',
      icon: <Calculator className="w-8 h-8 text-blue-500" />,
      color: 'bg-blue-50 border-blue-100'
    },
    {
      title: 'Automated Inventory',
      description: 'Never run out of stock. Track your medicines in real-time and get alerted when supplies run low.',
      icon: <Package className="w-8 h-8 text-emerald-500" />,
      color: 'bg-emerald-50 border-emerald-100'
    },
    {
      title: 'OpenFDA Integration',
      description: 'Instantly fetch accurate medicine details, side effects, and manufacturer information directly from the FDA.',
      icon: <Database className="w-8 h-8 text-indigo-500" />,
      color: 'bg-indigo-50 border-indigo-100'
    },
    {
      title: 'Advanced Analytics',
      description: 'Make data-driven decisions with comprehensive sales reports, profit margins, and trend analysis.',
      icon: <LineChart className="w-8 h-8 text-purple-500" />,
      color: 'bg-purple-50 border-purple-100'
    }
  ];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-10">

      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-50 rounded-2xl mb-4">
          <HeartPulse className="w-8 h-8 md:w-10 md:h-10 text-indigo-600" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">Help & Support</h1>
        <p className="text-base md:text-lg text-slate-500 px-2">
          Discover everything MediTrack Pro can do for your pharmacy, or get in touch with our developer for dedicated support.
        </p>
      </div>

      {/* Services Grid */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">Services Provided</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className={`p-6 rounded-3xl border transition-all hover:shadow-md flex flex-col sm:flex-row items-start gap-6 ${service.color}`}
            >
              <div className="bg-white p-4 rounded-2xl shadow-sm shrink-0">
                {service.icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-800">{service.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Developer Information Card */}
      <section className="pt-8">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl overflow-hidden shadow-xl relative">

          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none hidden md:block">
            <Code2 className="w-64 h-64 text-white" />
          </div>

          <div className="p-6 md:p-12 relative z-10 flex flex-col items-center gap-8">
            {/* Developer Icon */}
            <div className="bg-white/10 p-6 rounded-full border border-white/20 backdrop-blur-sm">
              <Code2 className="w-12 h-12 md:w-16 md:h-16 text-indigo-300" />
            </div>

            {/* Content */}
            <div className="space-y-6 text-center w-full">
              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Need Technical Support?</h2>
                <p className="text-indigo-200 text-base md:text-lg">Reach out to the lead developer directly.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                <div className="flex items-center justify-center gap-3 text-slate-200 bg-white/5 px-4 py-3 rounded-xl border border-white/10 backdrop-blur-sm">
                  <User className="w-5 h-5 text-indigo-400" />
                  <span className="font-medium">Sanket Kotkar</span>
                </div>

                <a
                  href="tel:9623295235"
                  className="flex items-center justify-center gap-3 text-slate-200 bg-white/5 px-4 py-3 rounded-xl border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors"
                >
                  <Phone className="w-5 h-5 text-indigo-400" />
                  <span className="font-medium">9623295235</span>
                </a>

                <a
                  href="mailto:meditrackpro01@gmail.com"
                  className="flex items-center justify-center gap-3 text-slate-200 bg-white/5 px-4 py-3 rounded-xl border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors break-all"
                >
                  <Mail className="w-5 h-5 text-indigo-400" />
                  <span className="font-medium">meditrackpro01@gmail.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Help;
