const routes = require('next-routes')()

routes.add('/', 'IndexPage')

routes.add('/sign-up', 'CoachSignUpPage')

routes.add('/setup', 'SetupPage')

export { routes }
