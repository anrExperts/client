<script context="module">
    /** @type {import('@sveltejs/kit').Load} */

    import {
        Link,
        UnorderedList,
        ListItem
    } from 'carbon-components-svelte' ;

    export async function load({ params, fetch, session, stuff }) {
        const url = `http://localhost:8984/xpr/sources/${params.source}/json`;
        //const url = `https://experts.huma-num.fr/xpr/sources/${params.source}/json`;
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

    $: meta = data.meta
    $: source = data.content

</script>

<div>
  <h1>Source</h1>
  <div>
    <h2>{ source.source }</h2>
    <p>{ source.id }</p>
  </div>
</div>
