<script>
    import { onMount } from 'svelte' ;
    import {
        DataTable,
        Pagination,
        SideNav,
        SideNavDivider,
        SideNavItems,
        SideNavMenu,
        SideNavMenuItem,
        MultiSelect,
        Grid,
        Column,
        Row,
        Link,
        ToolbarSearch,
        ToolbarContent,
        Toolbar
    } from 'carbon-components-svelte' ;

    import { Launch16 } from 'carbon-icons-svelte' ;

    let biographies = [] ;
    let filtered = [] ;

    $: meta = {
        totalBiographies: 0,
        start: 1,
        count: 20,
        qualities: {}
    } ;

    let query = [] ;

    $: qualities = Object.keys(meta.qualities).map(y => ({ "id": y, "text": y})) ;
    let selectedQualities = [];
    $: console.log(selectedQualities)

    onMount(() => {
        fetchBiographies(meta)
    }) ;

    const fetchBiographies = async () => {
        const url = 'http://localhost:8984/xpr/biographies/json' ;
        //const url = 'https://experts.huma-num.fr/xpr/biographies/json';
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'text/plain'},
            body: JSON.stringify(meta)
        });
        if (response.ok) {
            const data = await response.json() ;
            biographies = data.content ;
            meta = data.meta ;
        }
        else
            console.log("fetchExpertises n’a pas pu récupérer les données")
    } ;

    $: filteredBiographies = biographies
        .filter((row) => {
            if(query.length === 0) {
                return row;
            } else {
                return (row.name.toString().toLowerCase().includes(query.toLowerCase()));
            }
        });

    $: console.log(meta)

</script>


<Grid>
  <Row>
    <Column>

    </Column>
    <Column>
      <DataTable
          headers={[
					{ key: "id", value: "ID" },
					{ key: "name", value: "Entités" },
					{ key: "quality", value: "Qualité" }
				]}
          rows={ filteredBiographies }
      >
        <MultiSelect
            bind:selectedIds={selectedQualities}
            label="Types d'entité"
            items={ qualities }
            />

        <Toolbar>
          <ToolbarContent>
            <ToolbarSearch bind:value={query}/>
          </ToolbarContent>
        </Toolbar>

        <Pagination
            backwardText="Page précédente"
            forwardText="Page suivante"
            itemsPerPageText="Fiches par page :"
            bind:page={meta.start}
            bind:pageSize={meta.count}
            pageSizes={[20, 50, 100, 250, 500]}
            totalItems={meta.totalBiographies}
        />

        <svelte:fragment slot="cell" let:cell>
          {#if cell.key === 'id'}
            <Link href={'biographies/' + cell.value} icon={Launch16}>{cell.value}</Link>
          {:else}
            {cell.value}
          {/if}
        </svelte:fragment>
      </DataTable>
    </Column>
  </Row>
</Grid>




