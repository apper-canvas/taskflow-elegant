import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md mx-auto"
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center"
        >
          <ApperIcon name="Search" className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </motion.div>
        
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
          Page Not Found
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link 
            to="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-shadow"
          >
            <ApperIcon name="Home" className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default NotFound