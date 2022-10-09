# COBIENE WEB (cobiene-mil-pe)

Pagina web del ejercito para el publico, donde puedes visualizar las entidades, convenios y aliados, etc

## Starting 🚀

---
These instructions will allow you to get a copy of the project running on your local machine for development and testing
purposes.

### Pre-requirements 📋

- Node js `14`
- Git
- GCloud sdk
- Webstorm > 2020

## Install 📦

Before initializing the project we need to install the dependencies

Install yarn, if you have it installed skip this step

```bash
npm install --global yarn
```

Install all dependencies

```bash
yarn install
```

We do the same for functions

```bash
cd functions/
yarn install
```

## Start project 🚀

---

```bash
yarn start
```

The default port is `3000`, but it will depend on whether it is available:

**Local:** `http://localhost:3000`

## Quality Scripts ⚙️

---

We use different technologies for the quality of the code, we execute it with the following commands.

#### Cypress

```bash
yarn cypress:open
```

#### Eslint

```bash
yarn eslint:check
```

#### Prettier

```bash
yarn prettier:check
```

#### Typescript

```bash
yarn type:check
```

## Deployment 📦

---

Before deploying the project, it is necessary that the quality scripts executed be successful.

### Environment suffixes

**Development:** `dev`

**Production:** `default`

For the following scripts always add the suffix of the selected environment:

#### Deploy global

```bash
yarn deploy -P <suffix>
```

#### Deploy only hosting

```bash
yarn deploy:hosting -P <suffix>
```

#### Deploy only indexes

```bash
yarn deploy:indexes -P <suffix>
```

#### Deploy only api

```bash
yarn deploy:api -P <suffix>
```

#### Deploy only functions

```bash
yarn deploy:functions -P <suffix>
```

### Hosting:

**Production:** [Click here!](https://cobiene-mil-pe.web.app/)

## Other scripts ⚙️

### Open firebase functions emulator

```bash
yarn serve -P dev
```

### Open all firebase emulators

```bash
yarn firebase:emulators
```

### Run cypress check

```bash
yarn cypress:check
```

## 🔖 Documentation

#### Workflow

[![](https://firebasestorage.googleapis.com/v0/b/sendingemails-348505.appspot.com/o/resources%2FWORK%20FLOW.jpg?alt=media&token=856bb7da-00ed-492a-b8d1-65e6179339b7)]()

### Technologies used

- React
- Google cloud
- Firebase

### Credentials

**PROD**

```
Rol: super admin
User: admin@agenciaservitec.com
Pass: no------o
```

### Extensions

- Resize images

### Database

- Firestore

### Functions

**- Triggers**

```
 Ninguno por el momento
```

**- Cloud HTTPS**

```
 - API
```

**- Scheduled Cloud Pub/Sub**

```
  Ninguno por el momento
```

Developed with ❤️ by [AgenciaServitec](https://agenciaservitec.com) 😊
