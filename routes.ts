const routes = require('next-routes')()

routes
  .add('/', 'IndexPage')
  .add('/admin/login', 'admin/AdminLoginPage')
  .add('/admin', 'admin/AdminDashboardPage')

routes.add('/sign-up', 'CoachSignUpPage')

routes.add('/setup', 'SetupPage')

export default routes
export const Link = routes.Link
export const Router = routes.Router
