import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'

const Projects = () => {
  const [darkMode, setDarkMode] = useState(false)
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'Website Redesign',
      description: 'Complete overhaul of company website with modern design',
      status: 'In Progress',
      priority: 'High',
      dueDate: '2024-03-15',
      progress: 65,
      tasks: 12,
      completedTasks: 8,
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'Mobile App Development',
      description: 'Cross-platform mobile application for task management',
      status: 'Planning',
      priority: 'Medium',
      dueDate: '2024-04-30',
      progress: 25,
      tasks: 18,
      completedTasks: 5,
      createdAt: '2024-01-20'
    },
    {
      id: 3,
      name: 'Database Migration',
      description: 'Migrate legacy database to new cloud infrastructure',
      status: 'Completed',
      priority: 'High',
      dueDate: '2024-02-28',
      progress: 100,
      tasks: 8,
      completedTasks: 8,
      createdAt: '2024-01-10'
    }
  ])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterPriority, setFilterPriority] = useState('All')
  const [sortBy, setSortBy] = useState('name')
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    status: 'Planning',
    priority: 'Medium',
    dueDate: '',
    tasks: 0
  })

  useEffect(() => {
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

  const handleCreateProject = (e) => {
    e.preventDefault()
    if (!newProject.name || !newProject.description || !newProject.dueDate) {
      toast.error('Please fill in all required fields')
      return
    }

    const project = {
      id: Date.now(),
      ...newProject,
      progress: 0,
      completedTasks: 0,
      createdAt: new Date().toISOString().split('T')[0]
    }

    setProjects([...projects, project])
    setNewProject({
      name: '',
      description: '',
      status: 'Planning',
      priority: 'Medium',
      dueDate: '',
      tasks: 0
    })
    setShowCreateModal(false)
    toast.success('Project created successfully!')
  }

  const handleEditProject = (e) => {
    e.preventDefault()
    if (!selectedProject.name || !selectedProject.description || !selectedProject.dueDate) {
      toast.error('Please fill in all required fields')
      return
    }

    setProjects(projects.map(p => p.id === selectedProject.id ? selectedProject : p))
    setShowEditModal(false)
    setSelectedProject(null)
    toast.success('Project updated successfully!')
  }

  const handleDeleteProject = () => {
    setProjects(projects.filter(p => p.id !== selectedProject.id))
    setShowDeleteModal(false)
    setSelectedProject(null)
    toast.success('Project deleted successfully!')
  }

  const filteredProjects = projects
    .filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === 'All' || project.status === filterStatus
      const matchesPriority = filterPriority === 'All' || project.priority === filterPriority
      return matchesSearch && matchesStatus && matchesPriority
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'dueDate':
          return new Date(a.dueDate) - new Date(b.dueDate)
        case 'priority':
          const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case 'progress':
          return b.progress - a.progress
        default:
          return 0
      }
    })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'In Progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'Planning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'Medium': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
      case 'Low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

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
            <div className="flex items-center space-x-3">
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
              <Link 
                to="/" 
                className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary-light transition-colors"
              >
                Home
              </Link>
              <span className="text-primary font-medium">Projects</span>
            </nav>
            
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
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2 px-3 py-2 lg:px-4 lg:py-2 bg-gradient-to-r from-primary to-primary-light text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-shadow"
              >
                <ApperIcon name="Plus" className="w-4 h-4" />
                <span className="hidden sm:inline text-sm lg:text-base">New Project</span>
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
            className="mb-8"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-3">
              Projects{" "}
              <span className="bg-gradient-to-r from-primary via-primary-light to-secondary bg-clip-text text-transparent">
                Dashboard
              </span>
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
              Manage and track your projects efficiently
            </p>
          </motion.div>

          {/* Filters and Search */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-morphism dark:glass-morphism-dark rounded-xl p-4 sm:p-6 mb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-slate-100"
              >
                <option value="All">All Status</option>
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-slate-100"
              >
                <option value="All">All Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-slate-100"
              >
                <option value="name">Sort by Name</option>
                <option value="dueDate">Sort by Due Date</option>
                <option value="priority">Sort by Priority</option>
                <option value="progress">Sort by Progress</option>
              </select>
            </div>
          </motion.div>

          {/* Projects Grid */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-morphism dark:glass-morphism-dark rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
                        {project.name}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                        {project.description}
                      </p>
                    </div>
                    <div className="flex space-x-1 ml-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setSelectedProject(project)
                          setShowEditModal(true)
                        }}
                        className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                      >
                        <ApperIcon name="Edit2" className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setSelectedProject(project)
                          setShowDeleteModal(true)
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                      {project.priority}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300 mb-1">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary to-primary-light h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="Calendar" className="w-4 h-4" />
                      <span>{project.dueDate}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="CheckCircle" className="w-4 h-4" />
                      <span>{project.completedTasks}/{project.tasks}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredProjects.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <ApperIcon name="FolderOpen" className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-600 dark:text-slate-300 mb-2">
                No projects found
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                {searchTerm || filterStatus !== 'All' || filterPriority !== 'All' 
                  ? 'Try adjusting your filters or search term'
                  : 'Create your first project to get started'
                }
              </p>
            </motion.div>
          )}
        </div>
      </main>

      {/* Create Project Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-morphism dark:glass-morphism-dark rounded-xl p-6 w-full max-w-md"
            >
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
                Create New Project
              </h3>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={newProject.name}
                    onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                    className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-slate-100"
                    placeholder="Enter project name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-slate-100"
                    placeholder="Enter project description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Status
                    </label>
                    <select
                      value={newProject.status}
                      onChange={(e) => setNewProject({...newProject, status: e.target.value})}
                      className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-slate-100"
                    >
                      <option value="Planning">Planning</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Priority
                    </label>
                    <select
                      value={newProject.priority}
                      onChange={(e) => setNewProject({...newProject, priority: e.target.value})}
                      className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-slate-100"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Due Date *
                    </label>
                    <input
                      type="date"
                      value={newProject.dueDate}
                      onChange={(e) => setNewProject({...newProject, dueDate: e.target.value})}
                      className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Tasks Count
                    </label>
                    <input
                      type="number"
                      value={newProject.tasks}
                      onChange={(e) => setNewProject({...newProject, tasks: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-slate-100"
                      min="0"
                    />
                  </div>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-primary to-primary-light text-white rounded-lg hover:shadow-lg transition-shadow"
                  >
                    Create Project
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Project Modal */}
      <AnimatePresence>
        {showEditModal && selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-morphism dark:glass-morphism-dark rounded-xl p-6 w-full max-w-md"
            >
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
                Edit Project
              </h3>
              <form onSubmit={handleEditProject} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={selectedProject.name}
                    onChange={(e) => setSelectedProject({...selectedProject, name: e.target.value})}
                    className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={selectedProject.description}
                    onChange={(e) => setSelectedProject({...selectedProject, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Status
                    </label>
                    <select
                      value={selectedProject.status}
                      onChange={(e) => setSelectedProject({...selectedProject, status: e.target.value})}
                      className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-slate-100"
                    >
                      <option value="Planning">Planning</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Priority
                    </label>
                    <select
                      value={selectedProject.priority}
                      onChange={(e) => setSelectedProject({...selectedProject, priority: e.target.value})}
                      className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-slate-100"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Due Date *
                    </label>
                    <input
                      type="date"
                      value={selectedProject.dueDate}
                      onChange={(e) => setSelectedProject({...selectedProject, dueDate: e.target.value})}
                      className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Tasks
                    </label>
                    <input
                      type="number"
                      value={selectedProject.tasks}
                      onChange={(e) => setSelectedProject({...selectedProject, tasks: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-slate-100"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Progress
                    </label>
                    <input
                      type="number"
                      value={selectedProject.progress}
                      onChange={(e) => setSelectedProject({...selectedProject, progress: Math.min(100, Math.max(0, parseInt(e.target.value) || 0))})}
                      className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-slate-100"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-4 py-2 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-primary to-primary-light text-white rounded-lg hover:shadow-lg transition-shadow"
                  >
                    Update Project
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-morphism dark:glass-morphism-dark rounded-xl p-6 w-full max-w-sm"
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                  <ApperIcon name="AlertTriangle" className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
                  Delete Project
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                  Are you sure you want to delete "{selectedProject.name}"? This action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-4 py-2 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteProject}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Projects