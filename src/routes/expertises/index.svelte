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

  	let affaires = [] ;
	let filtered = [] ;
	let meta = {
		totalExpertises: 0,
		start: 1,
		count: 20,
		datesCount: {},
		experts:{},
		filterDate: []
	} ;

  let query = [] ;
	let selectedYears = [] ;
	let selectedExperts = [] ;


	$: datesCount = Object.keys(meta.datesCount).map(y => ({ "id": y, "text": `${y} (${meta.datesCount[y]})`})) ;
	$: experts = Object.keys(meta.experts).map(y => ({ "id": y, "text": meta.experts[y]})) ;

	const fetchExpertises = async (meta) => {
		const url = 'http://localhost:8984/xpr/expertises/json' ;
		//const url = `https://experts.huma-num.fr/xpr/expertises/json`;
		const response = await fetch(url, {
			method: 'POST',
			headers: {'Content-Type': 'text/plain'},
			body: JSON.stringify(meta)
		});
		if (response.ok) {
			const data = await response.json() ;
			affaires = data.content ;
			meta = data.meta ;
			console.log(data.meta);
		}
		else 
			console.log("fetchExpertises n’a pas pu récupérer les données")
	} ;

	$: fetchExpertises(meta)

	$: filteredAffaires = affaires
    .filter((row) => {
		  if(query.length === 0) {
        return row;
      } else {
        return (row.experts.toString().includes(query) || row.dates.toString().includes(query));
      }
    });

</script>


<Grid>
	<Row>
		<Column>
			<SideNav
				isOpen={true}
			>
				<SideNavItems>
					<h5>Filtres et facettes</h5>
					<SideNavDivider/>
					<!--@titleText="Années des affaires" = titre-->
					<MultiSelect
						bind:selectedIds={selectedYears}
						label="Années"
						items={ datesCount }
					/>
					<MultiSelect
						bind:selectedIds={selectedExperts}
						label="Experts"
						items={ experts }
					/>
				</SideNavItems>

			</SideNav>
		</Column>
		<Column>
			<DataTable
				headers={[
					{ key: "id", value: "ID" },
					{ key: "experts", value: "Experts" },
					{ key: "dates", value: "Dates" }
				]}
				rows={ filteredAffaires }
			>
				<Toolbar>
					<ToolbarContent>
						<ToolbarSearch bind:value={query}/>
					</ToolbarContent>
				</Toolbar>

				<svelte:fragment slot="cell" let:cell>
					{#if cell.key === 'dates'}
						{#if cell.value.length > 1}
							{`${cell.value[0]} - ${cell.value[cell.value.length-1]}`}
						{:else}
							{cell.value}
						{/if}
					{:else if cell.key === 'experts'}
						{cell.value.join(' ; ')}
					{:else}
						<Link href={'expertises/' + cell.value} icon={Launch16}>{cell.value}</Link>
					{/if}
				</svelte:fragment>

				<Pagination
						backwardText="Page précédente"
						forwardText="Page suivante"
						itemsPerPageText="Fiches par page :"
						bind:page={meta.start}
						bind:pageSize={meta.count}
						pageSizes={[20, 50, 100, 250, 500]}
						bind:totalItems={meta.totalExpertises}
				/>
			</DataTable>
		</Column>
	</Row>
</Grid>



	  
