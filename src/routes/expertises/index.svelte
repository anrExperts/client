<script>
	import { onMount } from 'svelte'
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
		Link
	} from 'carbon-components-svelte'

	import { Launch16 } from 'carbon-icons-svelte';

  let affaires = []
	let filtered = []
	let currentPage = 0
	let pageSize = 20
	let meta = {
		totalExpertises: 0,
		start: 1,
		count: 20
	}

	let selectedYears = []
	
	let multiItems = []
	multiItems = Object.keys(meta.datesCount).map(y => ({ "id": y, "text": `${y} (${meta.datesCount[y]})`}))

	onMount(() => {
		fetchExpertises()
	})

	
	const fetchExpertises = async () => {
		const url = `https://experts.huma-num.fr/xpr/expertises/json`;
			const response = await fetch(url, {
				method: 'GET',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({ 
					start: meta.start, 
					count: meta.count, 
					filterDate: selectedYears 
				})
			});

			if (response.ok) {
				const data = await response.json()
				affaires = data.content
				meta = data.meta
			}
			else 
				console.log("fetchExpertises n’a pas pu récupérer les données")
	}

	const getYearsFromData = (affaires) => {
		let years = affaires.reduce((acc, current) => acc.concat(current.dates.map(date => date.split('-')[0])), [])
		return [...new Set(years)]
	}


	$: {
		if (selectedYears.length === 0) 
			filtered = affaires
		else 
			filtered = affaires.filter(a => a.dates.some(d => selectedYears.includes(d.split('-')[0])))
	}
	
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

				<MultiSelect 
					bind:selectedIds={selectedYears}
					titleText="Années des affaires"
					label="Selectionnez des années"
					items={ multiItems }
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
				rows={ filtered.slice(0, pageSize) }
			>

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
					<Link href="" icon={Launch16}>{cell.value}</Link>
				{/if}
			</svelte:fragment>

			<Pagination
				backwardText="Page précédente"
				forwardText="Page suivante"
				itemsPerPageText="Fiches par page :"
				bind:page={meta.start}
				bind:pageSize={meta.count}
				pageSizes={[20, 50, 100, 250, 500]}
				totalItems={meta.totalExpertises}
			/>
		
			</DataTable>
		</Column>
	</Row>
</Grid>



	  
