<script context="module">
    import {
        Link,
        UnorderedList,
        ListItem
    } from 'carbon-components-svelte' ;
    import { Launch16 } from 'carbon-icons-svelte' ;
    /** @type {import('@sveltejs/kit').Load} */


    export async function load({ params, fetch, session, stuff }) {
        const url = `http://localhost:8984/xpr/biographies/${params.biographie}/json`;
        const response = await fetch(url);
        if(response.ok) {
            return {
                status: response.status,
                props: {
                    data: await response.json()
                }
            };
        } else {
            console.log('Les données n’ont pas pu être chargées')
        }
    };
</script>

<script>
    import expertises from "../expertises/index.svelte";

    export let data
    console.log(data);

    const biographie = data.content

    function getDate(date) {
        if(date.length === 0) {return 'aucune date renseignée'}
        if(date.length > 1) { return `${formatDate(date[0])} - ${formatDate(date[date.length-1])}` }
        return formatDate(date)
    }

    function formatDate(date) {
      if(/^\d{4}-\d{2}-\d{2}/.test(date)) {
        let d = new Date(date)
        var dateOptions = {year: 'numeric', month: 'long', day: 'numeric'};
        return `${d.toLocaleDateString("fr-FR", dateOptions)}` ;
      }
      if(/^\d{4}-\d{2}/.test(date)) {
        let d = new Date(date)
        var dateOptions = {year: 'numeric', month: 'long'};
        return `${d.toLocaleDateString("fr-FR", dateOptions)}` ;
      }
      if(/^\d{4}/.test(date)) {
        let d = new Date(date)
        var dateOptions = {year: 'numeric'};
        return `${d.toLocaleDateString("fr-FR", dateOptions)}` ;
      }
      return 'aucune date renseignée'
    }
</script>

<div>
  <h1>Prosopographie</h1>
  <div>
    <h2>{`${biographie.id} | ${biographie.name}`}</h2>
    <div>
      <h3>Expertises</h3>
      <UnorderedList>
        {#each biographie.expertises as expertise}
          <ListItem><Link href={'/expertises/' + expertise.id}>{expertise.id}</Link> {getDate(expertise.dates)}</ListItem>
        {/each}
      </UnorderedList>
    </div>
  </div>
</div>
