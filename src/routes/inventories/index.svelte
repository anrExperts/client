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

    let inventories = [] ;
    let filtered = [] ;

    $: meta = {
        totalInventories: 0,
        start: 1,
        count: 20
    } ;

    let query = [] ;

    const fetchInventories = async (meta) => {
        const url = `http://localhost:8984/xpr/inventories/json` ;
        //const url = `https://experts.huma-num.fr/xpr/inventories/json`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'text/plain'},
            body: JSON.stringify(meta)
        });
        if (response.ok) {
            const data = await response.json() ;
            inventories = data.content ;
            meta = data.meta ;
        }
        else
            console.log("fetchInventories n’a pas pu récupérer les données")
    } ;

    $: filteredInventories = inventories
        .filter((row) => {
            if(query.length === 0) {
                return row;
            } else {
                return (row.name.toString().toLowerCase().includes(query.toLowerCase()));
            }
        });

    $: fetchInventories(meta)

    $: console.log(meta)

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
        return '..'
    }

</script>


<Grid>
  <Row>
    <Column>

    </Column>
    <Column>
      <DataTable
          headers={[
					{ key: "id", value: "ID" },
					{ key: "mark", value: "Cote" },
					{ key: "expert", value: "Expert" },
					{ key: "date", value: "Date" },
				]}
          rows={ filteredInventories }
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
            totalItems={meta.totalInventories}
        />

        <svelte:fragment slot="cell" let:cell>
          {#if cell.key === 'id'}
            <Link href={'inventories/' + cell.value} icon={Launch16}>{cell.value}</Link>
          {:else if cell.key === 'date'}
            {formatDate(cell.value)}
          {:else}
            {cell.value}
          {/if}
        </svelte:fragment>
      </DataTable>
    </Column>
  </Row>
</Grid>




