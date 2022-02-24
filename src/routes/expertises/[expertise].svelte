<script context="module">
	/** @type {import('@sveltejs/kit').Load} */
	export async function load({ params, fetch, session, stuff }) {
		const url = `http://localhost:8984/xpr/expertises/${params.expertise}/json`;
		const response = await fetch(url);

		return {
			status: response.status,
			props: {
				affaire: response.ok && (await response.json())
			}
		};
	}
</script>
<script>
  export let affaire ;
</script>

<h1>expertise</h1>
<div>
	{#each affaire as i}
		<div>
			<h4>{i.type}</h4>
			<p>{i.date}</p>
		</div>
	{/each}
</div>
