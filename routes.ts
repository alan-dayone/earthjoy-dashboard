/* tslint:disable:no-default-export */
const routes = require('next-routes')();

routes
  .add('/', 'IndexPage')
  .add('/admin/login', 'admin/AdminLoginPage')
  .add('/admin', 'admin/AdminDashboardPage')
  .add('/admin/setup', 'admin/AdminSetupPage');

routes.add('/sign-up', 'CoachSignUpPage');

export default routes;
export const Link = routes.Link;
export const Router = routes.Router;
