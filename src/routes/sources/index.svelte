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

    let sources = [] ;
    let filtered = [] ;

    $: meta = {
        totalSources: 0,
        start: 1,
        count: 20
    } ;

    let query = [] ;

    const fetchSources = async (meta) => {
        const url = `http://localhost:8984/xpr/sources/json` ;
        //const url = `https://experts.huma-num.fr/xpr/biographies/json`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'text/plain'},
            body: JSON.stringify(meta)
        });
        if (response.ok) {
            const data = await response.json() ;
            sources = data.content ;
            meta = data.meta ;
        }
        else
            console.log("fetchSources n’a pas pu récupérer les données")
    } ;

    $: filteredSources = sources
        .filter((row) => {
            if(query.length === 0) {
                return row;
            } else {
                return (row.name.toString().toLowerCase().includes(query.toLowerCase()));
            }
        });

    $: fetchSources(meta)

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
					{ key: "source", value: "Cote" }
				]}
          rows={ filteredSources }
      >
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
            totalItems={meta.totalSources}
        />

        <svelte:fragment slot="cell" let:cell>
          {#if cell.key === 'id'}
            <Link href={'sources/' + cell.value} icon={Launch16}>{cell.value}</Link>
          {:else}
            {cell.value}
          {/if}
        </svelte:fragment>
      </DataTable>
    </Column>
  </Row>
</Grid>




