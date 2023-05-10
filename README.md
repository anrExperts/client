# Client web pour l’application XPR

Ceci est un client web réalisé avec [SvelteKit](https://kit.svelte.dev) pour l’ANR Expert. 

**Pratiques des savoirs entre jugement et innovation. Experts, expertises du bâtiment, Paris 1690-1790 – ANR EXPERTS**

Notre projet vise à examiner, à partir d’un secteur économique majeur — celui du bâtiment à l’époque moderne —, le mécanisme de l’expertise : comment la langue technique régulatrice des experts s’impose à la société, comment leur compétence se convertit en autorité, voire parfois en « abus d’autorité » ? L’existence d’un fonds d’archives exceptionnel (AN Z1J) qui conserve l’ensemble des procès-verbaux d’expertise du bâtiment parisien de 1643 à 1792 nous permet de lancer une enquête pluridisciplinaire d’envergure sur la question de l’expertise qui connaît, à partir de 1690, un tournant particulier. En effet, les experts, autrefois uniquement gens de métiers, se divisent en deux branches exerçant deux activités concurrentes, parfois complémentaires : l’architecture et l’entreprise de construction.

https://anr.fr/Projet-ANR-17-CE26-0006

## Installation

### Cloner le répertoire et installer les dépendances

```bash
# clone repository
git clone https://github.com/anrExperts/xpr-client.git

# install dependancies
npm install
```

### Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

### Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
