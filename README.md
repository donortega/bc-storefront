# Storefront Single-Page App
by Don Ortega

### Install dependencies
    ## Must run these commands from inside the project root directory
    npm install
    bower install
    bundle install --path=ruby-bundles

### Run application
    grunt dev
Application will be available at http://localhost:9000.

### Unit testing
    grunt test
This will run Jasmine tests using Google Chrome.

### Frameworks used

- **ui-bootstrap:** Bootstrap functionality made usable by Angular directives.
- **ui-router:** Easy to define application states and set up routes within application.

### Compromises

- Using Web Storage to cache products JSON and store Shopping Cart data. In Safari, Web Storage is not available when in Private Browsing mode.
