// LandingPage.tsx
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaMicrophone,
  FaMusic,
  FaUsers,
  FaPalette,
  FaPenFancy,
  FaDownload,
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <FaMicrophone size={30} className="text-[#6C63FF]" />,
    title: 'Voice Selection',
    description: 'Choose from a variety of professional voiceovers and demo before selecting.',
  },
  {
    icon: <FaPalette size={30} className="text-[#FF6B81]" />,
    title: 'Theme Selection',
    description: 'Select the perfect theme to match the mood of your podcast.',
  },
  {
    icon: <FaMusic size={30} className="text-[#3DDC97]" />,
    title: 'Music Integration',
    description: 'Add background music that enhances your podcast’s storytelling.',
  },
  {
    icon: <FaUsers size={30} className="text-[#6C63FF]" />,
    title: 'Audience Targeting',
    description: 'Specify your target audience for a more personalized experience.',
  },
  {
    icon: <FaPenFancy size={30} className="text-[#FF6B81]" />,
    title: 'AI Script Generation',
    description: 'Turn your simple idea prompt into a professional podcast script.',
  },
  {
    icon: <FaDownload size={30} className="text-[#3DDC97]" />,
    title: 'Downloadable Audio',
    description: 'Generate, listen, and download your podcast-ready audio instantly.',
  },
];

const LandingPage: FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-screen min-h-screen bg-[#0A0F1C] text-[#E2E8F0]">
      {/* Hero Section */}
      <section className="relative w-full min-h-[70vh] flex flex-col justify-center items-center text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-6xl font-bold mb-4 leading-tight"
        >
          Create Your AI-Powered Podcast
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-lg md:text-xl max-w-2xl mb-8"
        >
          Turn a simple idea into a professional podcast voiceover with music. Customize voice, theme, music, and audience with ease.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="flex flex-col md:flex-row gap-4"
        >
          <button
            onClick={() => navigate('/signup')}
            className="px-8 py-3 rounded-md bg-[#6C63FF] hover:bg-[#5a54e0] transition font-semibold cursor-pointer"
          >
            Sign Up
          </button>
          <button
            onClick={() => navigate('/signin')}
            className="px-8 py-3 rounded-md border border-[#6C63FF] hover:bg-[#1A1F2B] transition font-semibold cursor-pointer"
          >
            Sign In
          </button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 md:px-20 bg-[#1A1F2B]">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-[#0A0F1C] p-6 rounded-xl shadow-lg flex flex-col items-center text-center hover:scale-105 hover:shadow-2xl transition-transform cursor-pointer"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-[#94A3B8]">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to start your podcast journey?
        </h2>
        <p className="text-[#94A3B8] mb-8">
          Sign up now and transform your ideas into high-quality podcast audio.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <button
            onClick={() => navigate('/signup')}
            className="px-8 py-3 rounded-md bg-[#6C63FF] hover:bg-[#5a54e0] transition font-semibold cursor-pointer"
          >
            Sign Up
          </button>
          <button
            onClick={() => navigate('/signin')}
            className="px-8 py-3 rounded-md border border-[#6C63FF] hover:bg-[#1A1F2B] transition font-semibold cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
