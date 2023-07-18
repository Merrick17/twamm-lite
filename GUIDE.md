## **Start working on application**

```
yarn install
yarn dev
```

## **Build application**

Check eslint and prettier error before building**

```
yarn lint
yarn prettier
```

Then, Build application

```
yarn build
```

## **Publishing/Tagging new version**

After build successful First build webpack bundler using, 

```
yarn build-widget
```
After successfull build webpack, All bundler file will create in public folder with version.

Then, Let's create main.v1.js file for cnd using main.(version).js file. This command will work only in mac and linux system.

```
- BUNDLE_NAME=main-$(node -e "console.log(require('./package.json').version);") && cp ./public/$BUNDLE_NAME.js ./public/main-v1.js
```

## **Scoping Tailwind Preflight CSS**

 After build bundler Create preflight.stylus and Please check preflight.css new file create in root and scope { } entire file with #twamm-terminal.

```
cp node_modules/tailwindcss/lib/css/preflight.css ./preflight.stylus
```

Then wrap #twamm-terminal  with scope { } in preflight.stylus file. and build scoped-preflight.css file. and remove preflight.stylus file.

```
npx stylus ./preflight.stylus -o ./public/scoped-preflight.css
rm ./preflight.stylus
```


