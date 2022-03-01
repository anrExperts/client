<script>

	import { onMount } from 'svelte'
	import { DataTable } from 'carbon-components-svelte'

   	let affaires = [];

	onMount(() => {
		fetchExpertises()
	})

	const fetchExpertises = async () => {
		const url = `https://experts.huma-num.fr/xpr/expertises/json`;
			const response = await fetch(url);

			if (response.ok) {
				affaires = await response.json()
				affaires.forEach(o => {
					if (!o.date || !o.expert || !o.id) {
						console.log('probleme avec', o)
					}
				})

				for (let i=0; i<affaires.length; i++) {
					affaires[i].id = i
				}
			}
			else 
				console.log("fetchExpertises n’a pas pu récupérer les données")
	}

	$: console.log(affaires)

</script>

<!--<h1>Expertises</h1>
<div>
	{#each affaires as affaire}
		<div>
      <a href="expertises/{affaire.id}">
			<h4>{affaire.id}</h4>
      <p>{affaire.date}</p>
      <p>{affaire.expertId}</p>
      </a>
		</div>
	{/each}
</div>-->
<DataTable
  	headers={[
		{ key: "id", value: "ID" },
		{ key: "expert", value: "Expert" },
		{ key: "date", value: "Date" }
	]}
  	rows={affaires}
/>
