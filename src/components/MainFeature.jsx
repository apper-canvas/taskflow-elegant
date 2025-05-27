import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, isToday, isTomorrow, isThisWeek, parseISO } from 'date-fns'
import ApperIcon from './ApperIcon'

const MainFeature = () => {
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([
    { id: 'work', name: 'Work', color: 'bg-blue-500' },
    { id: 'personal', name: 'Personal', color: 'bg-green-500' },
    { id: 'shopping', name: 'Shopping', color: 'bg-purple-500' },
    { id: 'health', name: 'Health', color: 'bg-red-500' }
  ])
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('dueDate')
  
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    categoryId: 'work'
  })

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('taskflow-tasks')
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    } else {
      // Sample tasks for demo
      const sampleTasks = [
        {
          id: '1',
          title: 'Complete project proposal',
          description: 'Finalize the Q4 project proposal document',
          priority: 'high',
          status: 'pending',
          dueDate: format(new Date(Date.now() + 86400000), 'yyyy-MM-dd'),
          categoryId: 'work',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Buy groceries',
          description: 'Milk, bread, eggs, and fruits',
          priority: 'medium',
          status: 'pending',
          dueDate: format(new Date(), 'yyyy-MM-dd'),
          categoryId: 'shopping',
          createdAt: new Date().toISOString()
        }
      ]
      setTasks(sampleTasks)
      localStorage.setItem('taskflow-tasks', JSON.stringify(sampleTasks))
    }
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('taskflow-tasks', JSON.stringify(tasks))
  }, [tasks])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!taskForm.title.trim()) {
      toast.error('Please enter a task title')
      return
    }

    if (editingTask) {
      setTasks(prev => prev.map(task => 
        task.id === editingTask.id 
          ? { ...task, ...taskForm, updatedAt: new Date().toISOString() }
          : task
      ))
      toast.success('Task updated successfully!')
      setEditingTask(null)
    } else {
      const newTask = {
        id: Date.now().toString(),
        ...taskForm,
        status: 'pending',
        createdAt: new Date().toISOString()
      }
      setTasks(prev => [...prev, newTask])
      toast.success('Task created successfully!')
    }

    setTaskForm({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      categoryId: 'work'
    })
    setShowTaskForm(false)
  }

  const toggleTaskStatus = (taskId) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const newStatus = task.status === 'completed' ? 'pending' : 'completed'
        toast.success(newStatus === 'completed' ? 'Task completed!' : 'Task reopened!')
        return { ...task, status: newStatus, updatedAt: new Date().toISOString() }
      }
      return task
    }))
  }

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
    toast.success('Task deleted successfully!')
  }

  const editTask = (task) => {
    setTaskForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      categoryId: task.categoryId
    })
    setEditingTask(task)
    setShowTaskForm(true)
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/30'
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30'
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/30'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30'
    }
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return 'AlertTriangle'
      case 'medium': return 'Clock'
      case 'low': return 'CheckCircle2'
      default: return 'Circle'
    }
  }

  const getDateLabel = (dateString) => {
    if (!dateString) return ''
    const date = parseISO(dateString)
    if (isToday(date)) return 'Today'
    if (isTomorrow(date)) return 'Tomorrow'
    if (isThisWeek(date)) return format(date, 'EEEE')
    return format(date, 'MMM dd')
  }

  const filteredAndSortedTasks = tasks
    .filter(task => {
      if (filter === 'completed') return task.status === 'completed'
      if (filter === 'pending') return task.status === 'pending'
      if (filter !== 'all') return task.categoryId === filter
      return true
    })
    .filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate) - new Date(b.dueDate)
      }
      if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
      return new Date(b.createdAt) - new Date(a.createdAt)
    })

  const completedTasks = tasks.filter(task => task.status === 'completed').length
  const totalTasks = tasks.length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="max-w-6xl mx-auto">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {[
          { label: 'Total Tasks', value: totalTasks, icon: 'List', color: 'from-blue-500 to-blue-600' },
          { label: 'Completed', value: completedTasks, icon: 'CheckSquare', color: 'from-green-500 to-green-600' },
          { label: 'Pending', value: totalTasks - completedTasks, icon: 'Clock', color: 'from-yellow-500 to-yellow-600' },
          { label: 'Completion Rate', value: `${completionRate}%`, icon: 'TrendingUp', color: 'from-purple-500 to-purple-600' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 dark:border-slate-700/50 shadow-soft"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-1">{stat.label}</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 dark:text-slate-100">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                <ApperIcon name={stat.icon} className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Task Management Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Task Form */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 dark:border-slate-700/50 shadow-soft">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-100">
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowTaskForm(!showTaskForm)}
                className="p-2 rounded-lg bg-primary text-white shadow-md hover:shadow-lg transition-shadow"
              >
                <ApperIcon name={showTaskForm ? "X" : "Plus"} className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>
            </div>

            <AnimatePresence>
              {showTaskForm && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Task Title
                    </label>
                    <input
                      type="text"
                      value={taskForm.title}
                      onChange={(e) => setTaskForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-sm sm:text-base"
                      placeholder="Enter task title..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={taskForm.description}
                      onChange={(e) => setTaskForm(prev => ({ ...prev, description: e.target.value }))}
                      rows="3"
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-sm sm:text-base resize-none"
                      placeholder="Task description..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Priority
                      </label>
                      <select
                        value={taskForm.priority}
                        onChange={(e) => setTaskForm(prev => ({ ...prev, priority: e.target.value }))}
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-sm sm:text-base"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={taskForm.dueDate}
                        onChange={(e) => setTaskForm(prev => ({ ...prev, dueDate: e.target.value }))}
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-sm sm:text-base"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Category
                    </label>
                    <select
                      value={taskForm.categoryId}
                      onChange={(e) => setTaskForm(prev => ({ ...prev, categoryId: e.target.value }))}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-sm sm:text-base"
                    >
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="flex-1 py-2 sm:py-3 px-4 bg-gradient-to-r from-primary to-primary-light text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-shadow text-sm sm:text-base"
                    >
                      {editingTask ? 'Update Task' : 'Add Task'}
                    </motion.button>
                    
                    {editingTask && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => {
                          setEditingTask(null)
                          setTaskForm({
                            title: '',
                            description: '',
                            priority: 'medium',
                            dueDate: '',
                            categoryId: 'work'
                          })
                        }}
                        className="px-4 py-2 sm:py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-sm sm:text-base"
                      >
                        Cancel
                      </motion.button>
                    )}
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Task List */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 dark:border-slate-700/50 shadow-soft">
            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex flex-wrap items-center gap-2">
                {['all', 'pending', 'completed', ...categories.map(c => c.id)].map(filterOption => (
                  <motion.button
                    key={filterOption}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFilter(filterOption)}
                    className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors ${
                      filter === filterOption 
                        ? 'bg-primary text-white shadow-md' 
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {filterOption === 'all' ? 'All' : 
                     filterOption === 'pending' ? 'Pending' :
                     filterOption === 'completed' ? 'Completed' :
                     categories.find(c => c.id === filterOption)?.name}
                  </motion.button>
                ))}
              </div>

              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="relative">
                  <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search tasks..."
                    className="pl-9 pr-3 py-2 w-full sm:w-48 bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-sm"
                  />
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-sm"
                >
                  <option value="dueDate">Due Date</option>
                  <option value="priority">Priority</option>
                  <option value="createdAt">Created</option>
                </select>
              </div>
            </div>

            {/* Task List */}
            <div className="space-y-3 sm:space-y-4 max-h-96 overflow-y-auto scrollbar-hide">
              <AnimatePresence>
                {filteredAndSortedTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`group p-3 sm:p-4 rounded-lg border transition-all ${
                      task.status === 'completed' 
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                        : 'bg-white/60 dark:bg-slate-700/60 border-slate-200 dark:border-slate-600 hover:bg-white/80 dark:hover:bg-slate-700/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start space-x-3 flex-1 min-w-0">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleTaskStatus(task.id)}
                          className={`mt-0.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                            task.status === 'completed'
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'border-slate-300 dark:border-slate-600 hover:border-primary'
                          }`}
                        >
                          {task.status === 'completed' && (
                            <ApperIcon name="Check" className="w-3 h-3 sm:w-4 sm:h-4" />
                          )}
                        </motion.button>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h4 className={`font-medium text-sm sm:text-base truncate ${
                              task.status === 'completed' 
                                ? 'text-slate-500 dark:text-slate-400 line-through' 
                                : 'text-slate-800 dark:text-slate-100'
                            }`}>
                              {task.title}
                            </h4>
                            
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                <ApperIcon name={getPriorityIcon(task.priority)} className="w-3 h-3 mr-1" />
                                {task.priority}
                              </span>
                              
                              {categories.find(c => c.id === task.categoryId) && (
                                <span className={`w-3 h-3 rounded-full ${categories.find(c => c.id === task.categoryId).color}`} />
                              )}
                            </div>
                          </div>

                          {task.description && (
                            <p className={`text-xs sm:text-sm mb-2 ${
                              task.status === 'completed' 
                                ? 'text-slate-400 dark:text-slate-500' 
                                : 'text-slate-600 dark:text-slate-400'
                            }`}>
                              {task.description}
                            </p>
                          )}

                          {task.dueDate && (
                            <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400">
                              <ApperIcon name="Calendar" className="w-3 h-3" />
                              <span>{getDateLabel(task.dueDate)}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => editTask(task)}
                          className="p-1.5 sm:p-2 text-slate-400 hover:text-primary rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                        >
                          <ApperIcon name="Edit2" className="w-3 h-3 sm:w-4 sm:h-4" />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => deleteTask(task.id)}
                          className="p-1.5 sm:p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                        >
                          <ApperIcon name="Trash2" className="w-3 h-3 sm:w-4 sm:h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredAndSortedTasks.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 sm:py-12"
                >
                  <ApperIcon name="ListTodo" className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-medium text-slate-500 dark:text-slate-400 mb-2">
                    No tasks found
                  </h3>
                  <p className="text-sm sm:text-base text-slate-400 dark:text-slate-500">
                    {searchTerm ? 'Try adjusting your search criteria' : 'Create your first task to get started'}
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default MainFeature