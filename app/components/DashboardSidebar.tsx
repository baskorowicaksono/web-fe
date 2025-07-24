import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAuth } from '../../lib/hooks/useAuth'
import { useSidebar } from '../../lib/hooks/useSidebar'
import { ChevronRight, Sparkles, FileText, Bot, File, LayoutDashboardIcon, FileBarChartIcon, CogIcon } from 'lucide-react'

interface NavigationItem {
  name: string
  href?: string
  icon: React.ReactNode
  children?: NavigationItem[]
}

const navigation: NavigationItem[] = [
  { 
    name: 'Home', 
    href: '/dashboard', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
      </svg>
    )
  },

  // Parent with child section
  {
    name: 'AI',
    icon: <Bot className="w-5 h-5" />,
    children: [
      {
        name: 'Reports',
        href: '/dashboard/reports',
        icon: <FileText className="w-4 h-4" />
      },
      {
        name: 'AI Assistant',
        href: '/dashboard/ai-chatbot',
        icon: <Sparkles className="w-4 h-4" />
      }
    ]
  },
  {
    name: "Policies and Indicators",
    icon: <LayoutDashboardIcon className= "w-4 h-4" />,
    children: [
      {
        name: "Dashboards and Reporting",
        href: "/dashboard/power-bi",
        icon: <FileBarChartIcon className= "w-5 h-5" />
      },
      {
        name: "KLM - Sector Mapping",
        href: "/dashboard/sector-mapping",
        icon: <CogIcon className='w-5 h-5' />
      }
    ]
  }
]

const adminNavigation: NavigationItem[] = [
  { 
    name: 'User Management', 
    href: '/dashboard/users', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    )
  },
  { 
    name: 'System Settings', 
    href: '/dashboard/settings', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.065 2.572c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-1.756.426-2.924.426-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
]

export default function DashboardSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()
  const { isCollapsed, isMobileOpen, toggleCollapse, setMobileOpen } = useSidebar()
  const [expandedSections, setExpandedSections] = useState<string[]>(['AI']) // Default expand AI section

  const isActive = (href: string) => pathname === href
  
  const hasActiveChild = (children: NavigationItem[] | undefined) => {
    if (!children) return false
    return children.some(child => child.href && isActive(child.href))
  }

  const toggleSection = (sectionName: string) => {
    if (isCollapsed) return // Don't toggle when collapsed
    
    setExpandedSections(prev => 
      prev.includes(sectionName)
        ? prev.filter(name => name !== sectionName)
        : [...prev, sectionName]
    )
  }

  // Auto-expand sections with active children
  useEffect(() => {
    navigation.forEach(item => {
      if (item.children && hasActiveChild(item.children)) {
        setExpandedSections(prev => 
          prev.includes(item.name) ? prev : [...prev, item.name]
        )
      }
    })
  }, [pathname])

  // Close mobile sidebar when route changes
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname, setMobileOpen])

  // Handle click outside to close mobile sidebar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar')
      const mobileToggle = document.getElementById('mobile-toggle')

      if (
        window.innerWidth < 1024 && 
        isMobileOpen && 
        sidebar && 
        !sidebar.contains(event.target as Node) &&
        mobileToggle &&
        !mobileToggle.contains(event.target as Node)
      ) {
        setMobileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMobileOpen, setMobileOpen])

  const renderNavItem = (item: NavigationItem, isChild = false) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedSections.includes(item.name)
    const isParentActive = hasChildren && item.children ? hasActiveChild(item.children) : false

    if (hasChildren) {
      // Parent item with children
      return (
        <div key={item.name}>
          <button
            onClick={() => toggleSection(item.name)}
            className={`nav-item group relative w-full ${
              isParentActive ? 'active' : ''
            } ${isCollapsed ? 'justify-center px-2' : ''}`}
            title={isCollapsed ? item.name : undefined}
          >
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              {item.icon}
              <span className={`transition-all duration-300 ${
                isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
              }`}>
                {item.name}
              </span>
            </div>
            
            {!isCollapsed && (
              <div className={`transition-transform duration-200 ${
                isExpanded ? 'rotate-90' : ''
              }`}>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </div>
            )}

            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-neutral-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                {item.name}
              </div>
            )}
          </button>

          {/* Children */}
          {!isCollapsed && (
            <div className={`overflow-hidden transition-all duration-300 ${
              isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className="ml-6 mt-1 space-y-1">
                {item.children?.map(child => renderNavItem(child, true))}
              </div>
            </div>
          )}
        </div>
      )
    }

    // Regular item or child item
    if (!item.href) {
      // No href - render as div (for parent items without links)
      return (
        <div
          key={item.name}
          className={`nav-item group relative ${
            isCollapsed ? 'justify-center px-2' : ''
          } ${isChild ? 'text-sm py-2' : ''}`}
          title={isCollapsed ? item.name : undefined}
        >
          <div className="flex items-center space-x-3 min-w-0">
            {item.icon}
            <span className={`transition-all duration-300 ${
              isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
            }`}>
              {item.name}
            </span>
          </div>
          
          {/* Tooltip for collapsed state */}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-neutral-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              {item.name}
            </div>
          )}
        </div>
      )
    }

    // Has href - render as Link
    return (
      <Link
        key={item.name}
        href={item.href}
        className={`nav-item group relative ${
          isActive(item.href) ? 'active' : ''
        } ${isCollapsed ? 'justify-center px-2' : ''} ${
          isChild ? 'text-sm py-2' : ''
        }`}
        title={isCollapsed ? item.name : undefined}
      >
        <div className="flex items-center space-x-3 min-w-0">
          {item.icon}
          <span className={`transition-all duration-300 ${
            isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
          }`}>
            {item.name}
          </span>
        </div>
        
        {/* Tooltip for collapsed state */}
        {isCollapsed && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-neutral-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            {item.name}
          </div>
        )}
      </Link>
    )
  }

  return (
    <>
      {/* Mobile backdrop */}
      <div 
        className={`fixed inset-0 bg-black/20 z-40 lg:hidden transition-opacity duration-300 ${
          isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ backdropFilter: 'blur(4px)' }}
        onClick={() => setMobileOpen(false)}
      />

      {/* Sidebar */}
      <div
        id="sidebar"
        className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-neutral-100 transition-all duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          ${isCollapsed ? 'lg:w-20' : 'lg:w-72'}
        `}
        style={{ width: isCollapsed ? '5rem' : '18rem' }}
      >
        <div className="flex flex-col h-full px-6 py-8 custom-scrollbar overflow-y-auto">
          {/* Logo and Collapse Button */}
          <div className={`flex items-center mb-8 transition-all duration-300 ${
            isCollapsed ? 'justify-center' : 'justify-between'
          }`}>
            <div className={`flex items-center justify-center w-full transition-all duration-300 ${
              isCollapsed ? 'transform scale-90' : ''
            }`}>
              <div className={`transition-all duration-300 ${isCollapsed ? 'w-12 h-12' : 'w-32 h-32'}`}>
                <Image
                  src="/LogoFinal.png"
                  alt="SUPERMAN Logo"
                  width={isCollapsed ? 48 : 128}
                  height={isCollapsed ? 48 : 128}
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Desktop Collapse Toggle */}
            <button
              onClick={toggleCollapse}
              className={`hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-neutral-100 transition-colors duration-200 ${
                isCollapsed ? 'ml-2' : ''
              }`}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <svg 
                className={`w-4 h-4 text-neutral-600 transition-transform duration-300 ${
                  isCollapsed ? 'rotate-180' : ''
                }`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navigation.map(item => renderNavItem(item))}
            
            {/* Admin Section */}
            {user?.role === 'ADMIN' && (
              <div className="pt-6">
                <div className={`px-4 mb-4 transition-all duration-300 ${
                  isCollapsed ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'
                }`}>
                  <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Administration
                  </h3>
                </div>
                <div className="space-y-2">
                  {adminNavigation.map(item => renderNavItem(item))}
                </div>
              </div>
            )}
          </nav>
          
          {/* User Profile */}
          <div className={`pt-6 border-t border-neutral-100 transition-all duration-300 ${
            isCollapsed ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'
          }`}>
            <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-medium">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-neutral-500 truncate">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}