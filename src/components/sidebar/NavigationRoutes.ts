export interface INavigationRoute {
  name: string
  displayName: string
  meta: {
    icon: string
  }
  children?: INavigationRoute[]
}

// Admin-only routes
const adminRoutes: INavigationRoute[] = [
  {
    name: 'dashboard',
    displayName: 'menu.dashboard',
    meta: {
      icon: 'vuestic-iconset-dashboard',
    },
  },
  {
    name: 'students',
    displayName: 'Students',
    meta: {
      icon: 'group',
    },
  },
  {
    name: 'company',
    displayName: 'Company',
    meta: {
      icon: 'group',
    },
  },
  {
    name: 'notice',
    displayName: 'Notice',
    meta: {
      icon: 'group',
    },
  },
  {
    name: 'jobs',
    displayName: 'Jobs',
    meta: {
      icon: 'group',
    },
  },
]

// Student-only routes
const studentRoutes: INavigationRoute[] = [
  {
    name: 'dashboard',
    displayName: 'menu.dashboard',
    meta: {
      icon: 'vuestic-iconset-dashboard',
    },
  },
  {
    name: 'studentNotice',
    displayName: 'Notice',
    meta: {
      icon: 'group',
    },
  },
  {
    name: 'studentJobs',
    displayName: 'Jobs',
    meta: {
      icon: 'group',
    },
  },
]

export { adminRoutes, studentRoutes }
