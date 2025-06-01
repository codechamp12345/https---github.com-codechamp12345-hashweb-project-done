import React from 'react';
import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const About = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const features = [
    {
      title: "Social Media Growth",
      description: "Boost your social media presence through genuine engagement and community building",
      icon: "🚀"
    },
    {
      title: "Reward System",
      description: "Earn points by completing tasks and redeem them for exciting rewards",
      icon: "🎁"
    },
    {
      title: "Real-time Updates",
      description: "Instant point updates and task completion tracking for seamless experience",
      icon: "⚡"
    },
    {
      title: "Community Driven",
      description: "Join a growing community of users helping each other grow their social presence",
      icon: "👥"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative bg-gradient-to-r from-[#0077b6] to-[#00a8e8] text-white py-20"
      >
        <div className="container mx-auto px-4">
          <motion.h1 
            {...fadeIn}
            className="text-4xl md:text-5xl font-bold mb-6 text-center"
          >
            Welcome to HashWeb
          </motion.h1>
          <motion.p 
            {...fadeIn}
            transition={{ delay: 0.2 }}
            className="text-xl text-center max-w-2xl mx-auto"
          >
            Empowering social media growth through community engagement and rewards
          </motion.p>
        </div>
        
        {/* Wave SVG */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-full h-12"
            style={{ transform: 'rotate(180deg)' }}
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              fill="#fff"
            />
          </svg>
        </div>
      </motion.div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Contact Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-gray-50 py-16"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Get in Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <motion.a
              href="tel:+919582859535"
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <FaPhone className="text-3xl text-[#0077b6] mb-4" />
              <h3 className="text-lg font-semibold mb-2">Phone</h3>
              <p className="text-gray-600 text-center">+91 95828 59535</p>
            </motion.a>

            <motion.a
              href="mailto:brandhashgenius@gmail.com"
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <FaEnvelope className="text-3xl text-[#0077b6] mb-4" />
              <h3 className="text-lg font-semibold mb-2">Email</h3>
              <p className="text-gray-600 text-center">brandhashgenius@gmail.com</p>
            </motion.a>

            <motion.a
              href="https://g.co/kgs/YgTaEzR"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <FaMapMarkerAlt className="text-3xl text-[#0077b6] mb-4" />
              <h3 className="text-lg font-semibold mb-2">Address</h3>
              <p className="text-gray-600 text-center">Block E, Saket<br />New Delhi - 110017</p>
            </motion.a>
          </div>
        </div>
      </motion.div>

      {/* Map Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="rounded-lg overflow-hidden shadow-lg"
        >
          <iframe
            title="HashWeb Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3505.5726461947253!2d77.21494731507926!3d28.52442798246063!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce1f1a6cd4c35%3A0x5c6e3f35c9068a8c!2sBlock%20E%2C%20Saket%2C%20New%20Delhi%2C%20Delhi%20110017!5e0!3m2!1sen!2sin!4v1674561234567!5m2!1sen!2sin"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default About;
