<script context="module">
	/** @type {import('@sveltejs/kit').Load} */ 
  export async function load({
		fetch
	}) {
		const url = `http://localhost:8984/xpr/expertises/json`;
		const response = await fetch(url);

		return {
			status: response.status,
			props: {
				affaires: response.ok && (await response.json())
			}
		};
	}
</script>

<script>
  export let affaires;
</script>

<h1>Expertises</h1>
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
</div>
