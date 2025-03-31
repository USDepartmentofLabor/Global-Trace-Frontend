# Global Trace Documentation

Background Global Trace enables brands, producers, and manufacturers to track and trace products while detecting supplier risk through their entire supply chain. Global Trace is an interoperable and commodity-agnostic tool, created to respond to increasing demands for responsibly produced products. Global Trace can facilitate mapping between supply chain tiers, tracing of product inputs, and management of risk assessment data from source to the point of purchase. It is widely understood that tracing goods is critical for identifying, addressing, and preventing labor violations in global supply chains.

## Background

Global Trace enables brands, producers, and manufacturers to track and trace products while detecting supplier risk through their entire supply chain. Global Trace is an interoperable and commodity-agnostic tool, created to respond to increasing demands for responsibly produced products. Global Trace can facilitate mapping between supply chain tiers, tracing of product inputs, and management of risk assessment data from source to the point of purchase. It is widely understood that tracing goods is critical for identifying, addressing, and preventing labor violations in global supply chains.

## Technical Solution

Global Trace was engineered to be customizable and flexible to accommodate any type of supply chain. Six configuration steps are required to set up an "instance" of Global Trace specific to the needs of the organization managing the deployment of the system. These steps are further detailed below in the Technical Documentation.

1. [Define the products in the supply chain](https://github.com/USDepartmentofLabor/Global-Trace-Backend/blob/main/docs/confluence/define_product/index.html) and assign Key Data Elements (KDEs) to each product.
2. [Define the user roles and user permissions](https://github.com/USDepartmentofLabor/Global-Trace-Backend/blob/main/docs/confluence/define_role/index.html) in the Global Trace instance.
3. Create a tier [map of the supply chain](https://github.com/USDepartmentofLabor/Global-Trace-Backend/blob/main/docs/confluence/map_chain/index.html), showing how products will flow and where Critical Tracking Events (CTEs) occur. Assign input and output products (defined in Step 1) for each transformation per Role (defined in Step 2).
4. [Define a risk management taxonomy (list of indicators)](https://github.com/USDepartmentofLabor/Global-Trace-Backend/blob/main/docs/confluence/indicator_list/index.html) to be used as the framework upon which users will combine Risk Assessment reports and other data inputs.
5. [Upload the assessments or self-assessment questionnaires (SAQs)](https://github.com/USDepartmentofLabor/Global-Trace-Backend/blob/main/docs/confluence/assessment_config/index.html) to be used for each Producer Role (defined in Step 2). Questions in each assessment will align with the List of Indicators (defined in Step 4) and responses will contribute to the overall risk associated with a producer.
6. [Specify the method by which various assessment inputs will be combined](https://github.com/USDepartmentofLabor/Global-Trace-Backend/blob/main/docs/confluence/risk_assessment/index.html) to determine the overall risk associated with a Producer. These inputs can include: external risk indices, assessment or SAQ responses (defined in Step 5), DNA test results, and compliance reports filed by assessors (defined in Step 2).

## User Support Resources

Please find user support resources here including links to training videos and user manuals. Please also review the Appendix of this page below for more information, including the best practice guidance provided in the Appendix F.

## Technical Documentation

The technical documentation page is designed for developers, providing an in-depth description of the code behind the Global Trace platform. For more practical information on Global Trace, due diligence and risk management, please visit [Global Trace Protocol (GTP) Project website](https://www.eiq.ai/global-trace-protocol/). to navigate to the technical documentation page.

[Follow this link](https://github.com/USDepartmentofLabor/Global-Trace-Backend/blob/main/docs/be-documentation/index.html) to navigate to the technical documentation page.

# Diginex USDOL

## Table of contents

### Project Structure

    .
    ├── assets
    │   ├── fonts               # Font icons
    │   ├── data                # Data sources
    │   ├── images              # Image files ( SVG, PNG, JPG )
    ├── i18n                    # Translate languages
    │   ├── en.json
    │   ├── vi.json
    ├── dist                    # Build folder for dev-server watch source code
    ├── public                  # Build folder for deploy production
    ├── server                  # Server side rendering
    │   ├── app.js              # Create app for server side render
    │   ├── App.vue             # App Vue template
    │   ├── index.js            # Run app server
    ├── deploy                  # Deploy slack bot
    ├── environments            # Deploy environments
    ├── src
    │   ├── api                 # API Request
    │   ├── components          # Vue Components
    │   ├── modals              # Modal view
    │   ├── config              # Config router, constant
    │   ├── containers          # Container subview for page ( include by component view, modal view, etc... )
    │   ├── pages               # Page view for each routes
    │   ├── store               # Root store for app
    │   ├── styles
    │   ├── types               # Define types for each module
    │   ├── utils
    │   ├── main.ts
    ├── webpack
    │   ├── base.js             # Base webpack config
    │   ├── dev.js              # Webpack config for dev-server watch source code
    │   ├── production.js       # Webpack config for build production
    │   ├── server.js           # Webpack config for server side render
    │   ├── index.js            # Webpack config load ENV
    ├── .env                    # ENV config for webpack builder ( API, APP_URL, NODE_ENV, PORT, etc... )
    ├── .env.development        # ENV config info ( helpful clone to .env file )
    ├── .eslintignore           # Ignore validate EsLint some files
    ├── .eslintrc               # EsLint config
    ├── .nvmrc                  # Project nodejs version
    ├── .prettierignore         # Ignore validate Prettier some files
    ├── .prettierrc             # Prettier config
    ├── .stylelintrc            # Stylelint config
    ├── babel.config.js         # Babel plugins config
    ├── index.html
    ├── package.json
    ├── server.js               # Server side render app run
    ├── tsconfig.json           # Typescript config
    ├── webpack.config.js       # Load from folder Webpack
    ├── yarn.lock
    └── ...

### Install project dependencies

- Install [Yarn](https://yarnpkg.com/) latest version
- Install Nodejs 16 ( Should be use [NVM](https://github.com/nvm-sh/nvm) for install NodeJS )

### Install package dependencies for Editor tool

- Eslint
- CSSlint
- Typescript
- Linter
- Linter EsLint
- Prettier

### Builder Info

- Vue 2
- Webpack 5
- Webpack plugins ( uglifyjs, compression, manifest, preload resources, optimize module loader, etc... )
- Typescript
- ESLint / TSLint / Stylint

### Run project

- Use nodejs version 16
- `Clone .env.development to .env file`

```
APP_URL=
API_URL=
NODE_ENV=development
PORT=3000
DEBUG=false
SSR=false
SSR_PORT=5000
```

- Install node_modules `yarn install`
- Run server-dev local `yarn dev`
  - `NODE_ENV=development`
- Build production `yarn start`
  - `NODE_ENV=production`
- Run server side render
  - `SSR=true`
  - After build production, will run app server: `node server.js` - Recommend use [PM2](https://github.com/Unitech/pm2) or [Forever](https://github.com/foreversd/forever)
  - App server will run at `SSR_PORT` and use nginx config forward to app server via `SSR_PORT`
- Nginx config example

```
server {
    listen 80;
    server_name test.local.com;
    root /var/www/esglibrary-frontend/public; # public for build production
    index index.html index.htm;

    if ($http_x_forwarded_proto = http) {
      return 301 https://$server_name$request_uri;
    }

    location / {
        try_files $uri$args $uri$args/ $uri $uri/ /index.html =404;
    }

    location ~* \.(3gp|gif|jpg|jpeg|png|ico|wmv|avi|asf|asx|mpg|mpeg|mp4|pls|mp3|mid|wav|swf|flv|exe|zip|tar|rar|gz|tgz|bz2|uha|7z|doc|docx|xls|xlsx|pdf|iso|eot|svg|ttf|woff)$ {
        gzip_static off;
        add_header Pragma public;
        add_header Cache-Control "public, must-revalidate, proxy-revalidate";
        access_log off;
        expires 30d;
        break;
    }

    location ~* \.(txt|js|css)$ {
        add_header Pragma public;
        add_header Content-Encoding  gzip; # This config for gzip files ( css, js )
        add_header Cache-Control "public, must-revalidate, proxy-revalidate";
        access_log off;
        expires 30d;
        break;
    }
}
```

### Before do task

- Please create new brand with your issue.
- Please pull new code from **develop** brand before checkout your brand
- Branch naming
  - feat/USDOL-xxx
  - fix/USDOL-xxx
  - refactor/USDOL-xxx
  - docs/USDOL-xxx
  - style/USDOL-xxx
  - perf/USDOL-xxx
  - vendor/USDOL-xxx
  - chore/USDOL-xxx

### Before commit

- Please don't include anything that not been developed by you.
- Please don't commit anything that can be regenerated from other things that were committed such as node_modules.
- Your code, you must be cleanup and please check format code before commit ( tabs, spaces, blank )
- In your message commit, please reference your issue for review task. Ex: `git commit -m"[feat][USDOL-1] Message`
- Commit message `MUST` clean ( commit code detail, message fix bug, etc... ) [How to write good message](https://chris.beams.io/posts/git-commit/)
- Please using **develop** brand for development and don't use **master** brand.

### Optional commit

- Merge code from **develop** brand and if conflict please fix conflict.

### Before push

- Make sure eslint / tslint has verified ( please don't use git commit option `--no-verify` )
- Don't use `git rebase` `git reset` `git force`

### Gitlab target

- Create new pull request with your brand and merge to **develop** brand.
- Add reviewers for review your pull request.
- When you create new pull request if you see conflict, please decline pull request and fix.

### Rule for create new Pull request

- Pull request `MUST` to have video record / image evidence for task result your commit.
- Pull request title `MUST` clean and have ticket ID. Ex: [feat][usdol-1] Implement SignIn page
