<script context="module">
    /** @type {import('@sveltejs/kit').Load} */

    import {
        Link,
        UnorderedList,
        ListItem
    } from 'carbon-components-svelte' ;

    export async function load({ params, fetch, session, stuff }) {
        const url = `http://localhost:8984/xpr/inventories/${params.inventory}/json`;
        //const url = `https://experts.huma-num.fr/xpr/inventories/${params.inventory}/json`;
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
    export let data
    console.log(data);

    const meta = data.meta
    const inventory = data.content

</script>

<div>
  <h1>{ `Inventaire après-décès de ${inventory.expert}` }</h1>
  <p>{ inventory.date }</p>
</div>
