# Client web pour l’application XPR

Ceci est un client web réalisé avec [SvelteKit](https://kit.svelte.dev) pour l’ANR Expert. 

**Pratiques des savoirs entre jugement et innovation. Experts, expertises du bâtiment, Paris 1690-1790 – ANR EXPERTS**

Depuis le Moyen Âge et probablement plus tôt, les autorités publiques confient à des personnes qu’elles estiment et qualifient compétentes l’action d’émettre un avis sur le savoir technique et scientifique, que ce soit dans le domaine gracieux comme contentieux. Cette recherche conduite dans le cadre d’un projet d’ANR vise à examiner, à partir d’un secteur économique majeur – celui du bâtiment à l’époque moderne –, le mécanisme de l’expertise : comment la langue technique régulatrice et maîtrisée des experts s’impose à la société, comment leur compétence technique se convertit en autorité, voire parfois en « abus d’autorité » ? L’existence d’un fonds d’archives exceptionnel (A.N. Z1J) qui conserve l’ensemble des procès-verbaux d’expertise du bâtiment parisien de 1643 à 1792 nous a permis de lancer une enquête pluridisciplinaire (juridique, économique et architecturale) de grande envergure sur la question de l’expertise qui connaît, à partir de 1690, un tournant particulier. En effet, les experts se divisent alors en deux branches différentes exerçant deux activités concurrentes, parfois complémentaires : les architectes et les entrepreneurs.

Notre recherche s’intéresse donc à la communauté des experts parisiens du bâtiment de 1690 à 1790. Les experts se répartissent, depuis cette époque, en deux cohortes d’architectes experts bourgeois et d’experts entrepreneurs. Nous étudions la structuration de cette communauté et l’activité des experts. Deux grands chantiers sont menés de front, d’une part l’établissement d’une prosopographie des 266 experts parisiens mais aussi un dépouillement systématique d’un échantillon de dix années de procès-verbaux d’expertise sur toute la période (en particulier, sous-séries V1 Lettres de provisions d’offices, Z1J Chambre et Greffiers des bâtiments, aux Archives nationales de France, Almanachs royaux, œuvres et travaux publiés, BnF).

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
