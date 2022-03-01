<script>

	import { onMount } from 'svelte'
	import { 
		DataTable,
		SideNav,
		SideNavDivider,
		SideNavItems,
		SideNavMenu,
		SideNavMenuItem,
		MultiSelect,
		Grid,
		Column, 
		Row
	} from 'carbon-components-svelte'

   	let affaires = [];
	let filtered = []

	onMount(() => {
		fetchExpertises()
	})

	const fetchExpertises = async () => {
		const url = `https://experts.huma-num.fr/xpr/expertises/json`;
			const response = await fetch(url);

			if (response.ok) {
				affaires = await response.json()
			}
			else 
				console.log("fetchExpertises n’a pas pu récupérer les données")
	}

	const getYearsFromData = (affaires) => {
		let years = affaires.reduce((acc, current) => acc.concat(current.dates.map(date => date.split('-')[0])), [])
		console.log(years)
		return [...new Set(years)]
	}

	$: console.log('getYearsFromData', getYearsFromData(affaires))

	let multiItems = []
	let selectedYears = []
	
	$: multiItems = getYearsFromData(affaires).map(y => {
		let counts = {}

		getYearsFromData(affaires).forEach(y => {
			let filtered = affaires.filter(a => y === a.dates.split('-')[0])
			counts[y] = filtered.length
		})

		return { "id": y, "text": `${y} (${counts[y]})` }
	})


	//
	//

	$: {
		if (selectedYears.length === 0) 
			filtered = affaires
		else 
			filtered = affaires.filter(a => selectedYears.includes(a.date.split('-')[0]))
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
				rows={ filtered }
			/>
		</Column>
	</Row>
</Grid>



	  
