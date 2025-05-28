import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'
//import abcd from '../abcd'

const Home = () => {
  const [darkMode, setDarkMode] = useState(false)


  useEffect(() => {
    //console.log('abcd :', abcd);
    const isDark = localStorage.getItem('darkMode') === 'true'
    setDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  //console.log('abcd :', abcd);


  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 glass-morphism dark:glass-morphism-dark border-b border-white/20 dark:border-slate-700/50"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center shadow-lg">
                <ApperIcon name="CheckSquare" className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                TaskFlow
              </h1>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <span className="text-primary font-medium">Home</span>
            <Link 
              to="/projects" 
              className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary-light transition-colors"
            >
              Projects
            </Link>
          </nav>
          
          <div className="flex items-center space-x-2 sm:space-x-4">

            
            
            <div className="flex items-center space-x-2 sm:space-x-4">

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary-light transition-colors"
              >
                <ApperIcon name={darkMode ? "Sun" : "Moon"} className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:flex items-center space-x-2 px-3 py-2 lg:px-4 lg:py-2 bg-gradient-to-r from-primary to-primary-light text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-shadow"
              >
                <ApperIcon name="Zap" className="w-4 h-4" />
                <span className="text-sm lg:text-base">Quick Add</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="pt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8 sm:mb-12 lg:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-800 dark:text-slate-100 mb-3 sm:mb-4 lg:mb-6">
              Master Your{" "}
              <span className="bg-gradient-to-r from-primary via-primary-light to-secondary bg-clip-text text-transparent">
                Productivity
              </span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Organize tasks, track progress, and achieve your goals with our intuitive task management system
            </p>
          </motion.div>

          <MainFeature />
        </div>
      </main>

      {/* Stats Footer */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="py-8 sm:py-12 lg:py-16 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-t border-white/20 dark:border-slate-700/50"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[
              { icon: "Target", label: "Tasks Completed", value: "2,847" },
              { icon: "Users", label: "Active Users", value: "15,293" },
              { icon: "Clock", label: "Hours Saved", value: "48,392" },
              { icon: "TrendingUp", label: "Productivity Boost", value: "87%" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="text-center p-4 sm:p-6 rounded-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/30 dark:border-slate-700/30"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center">
                  <ApperIcon name={stat.icon} className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  )
}

export default Home
