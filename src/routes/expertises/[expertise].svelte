<script context="module">
	/** @type {import('@sveltejs/kit').Load} */

	import {
		Link,
		UnorderedList,
		ListItem
	} from 'carbon-components-svelte' ;

	export async function load({ params, fetch, session, stuff }) {
		const url = `http://localhost:8984/xpr/expertises/${params.expertise}/json`;
		//const url = 'https://experts.huma-num.fr/xpr/expertises/${params.expertise}/json';
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

	const affaire = data.content

	let expertiseLabel = getExpertiseLabel(affaire.cote, affaire.dossier, affaire.supplement, affaire.dates) ;

	function getExpertiseLabel(cote, dossier, supplement, dates){
		let datesLabel = getDatesLabel(dates) ;
		if(supplement.length === 0) {
			return `${cote} dossier n°${dossier} (${datesLabel})`
		} else {
			return `${cote} dossier n°${dossier} ${supplement} (${datesLabel})`
		}
	}

	// format date for expertise label
	function getDatesLabel(dates) {
		var dateOptions = {year: 'numeric', month: 'long', day: 'numeric' };
		if(dates.length > 1) {
			let fromDate = new Date(dates[0]);
			let toDate = new Date(dates[dates.length-1]);
			return `${fromDate.toLocaleDateString("fr-FR", dateOptions)} – ${toDate.toLocaleDateString("fr-FR", dateOptions)}` ;
		} else {
			let date = new Date(dates) ;
			return `${date.toLocaleDateString("fr-FR", dateOptions)}` ;
		}
	}

	function getSessions(session) {
		for(const [place, date] of Object.entries(session)) {
			let formatedPlace = getPlace(place) ;
			let formatedDate = getDate(date) ;
			return `${formatedPlace} : ${formatedDate}` ;
		}
	}

	function getPlace(place) {
		switch (place) {
			case 'paris': return 'Paris' ; break ;
			case 'suburbs': return 'Banlieue' ; break ;
			case 'province': return 'Province' ; break ;
			default: return 'Aucun lieu renseigné' ;
		}
	}

	function getDate(date) {
		if(date.length === 0) {
			return 'aucune date renseignée'
		} else if(/^\d{4}-\d{2}-\d{2}/.test(date)) {
			let d = new Date(date)
			var dateOptions = {year: 'numeric', month: 'long', day: 'numeric'};
			return `${d.toLocaleDateString("fr-FR", dateOptions)}` ;
		} else if(/^\d{4}-\d{2}/.test(date)) {
			let d = new Date(date)
			var dateOptions = {year: 'numeric', month: 'long'};
			return `${d.toLocaleDateString("fr-FR", dateOptions)}` ;
		} else if(/^\d{4}/.test(date)) {
			let d = new Date(date)
			var dateOptions = {year: 'numeric'};
			return `${d.toLocaleDateString("fr-FR", dateOptions)}` ;
		} else {
			return 'aucune date renseignée'
		}
	}

	function getExpertQuality (title, context, appointment) {
		let expertTitle = title ;
		let expertContext = getExpertContext(context) ;
		let expertAppointment =
				(context == 'primary' && appointment == 'unknown') ?
						('nommé ' + getExpertAppointment(appointment, context))
						:getExpertAppointment(appointment, context) ;

		let quality = [expertTitle, expertContext, expertAppointment].filter(Boolean).join(", ") + '.' ;

		return quality ;
	}

	function getExpertContext(context) {
		switch (context) {
			case 'primary': return 'nommé en premier lieu' ; break ;
			case 'third-party': return 'tiers expert' ; break ;
			case 'unknown': return 'nomination indéterminée' ; break ;
		}
	}

	function getExpertAppointment(appointment) {
		switch (appointment) {
			case 'court-appointed': return 'd’office (par le lieutenant civil)' ; break ;
			case 'appointed': return 'par les parties' ; break ;
			case 'experts': return 'par les experts' ; break ;
			case 'unkwnown': return 'origine de la nomination indéterminée' ; break ;
		}
	}

	function getPartyLabel(role, status) {
		var partyRole = getPartyRole(role) ;
		var partyStatus = getPartyStatus(status) ;
		return `${partyRole} (${partyStatus})`
	}
	function getPartyRole(role) {
		switch (role) {
			case 'petitioner': return 'Partie requérante' ; break ;
			case 'opponent': return 'Partie opposante' ; break ;
			default: return 'Partie' ;
		}
	}

	function getPartyStatus(status) {
		switch (status) {
			case 'builder': return 'entrepreneur' ; break ;
			case 'owner': return 'propriétaire' ; break ;
			case 'joint-owner': return 'copropriétaire' ; break ;
			case 'limited-partner': return 'commanditaire' ; break ;
			case 'heir': return 'héritier' ; break ;
			case 'neighbour': return 'voisin' ; break ;
			case 'tenant': return 'locataire' ; break ;
			case 'main-tenant': return 'principal locataire' ; break ;
			case 'creditor': return 'créancier' ; break ;
			case 'mortgagor': return 'débiteur' ; break ;
			case 'contractor': return 'fermier judiciaire' ; break ;
			default: return 'qualification indéterminée' ;
		}
	}

	function getPartyParticipation(presence, intervention) {
		var partyPresence = getPartyPresence(presence) ;
		var partyIntervention = getPartyIntervention(intervention) ;
		if(partyPresence && partyIntervention) return [partyPresence, partyIntervention].join(', ')
		return partyPresence + partyIntervention
	}

	function getPartyPresence(presence) {
		switch (presence) {
			case 'true': return 'présente' ; break ;
			case 'false': return 'non présente' ; break ;
		}
	}

	function getPartyIntervention(intervention) {
		switch (intervention) {
			case 'true': return 'intervenante' ; break ;
			case 'false': return 'non intervenante' ; break ;
		}
	}

	function getPerson(person) {
		var name = person.name ;
		var occupation = person.occupation ;
		if(occupation.length !== 0) {return [name, occupation].join(', ')}
		return name
	}


</script>

<div>
	<h1>Expertise</h1>
	<div>
		<h2>{expertiseLabel}</h2>
		<p>{affaire.addresses.join(" | ")}</p>
		<div>
			<h3>Liste des vacations</h3>
			<ul>
				{#each affaire.sessions as session}
					<li>{getSessions(session)}</li>
				{/each}
			</ul>
		</div>
		<div>
			<h3>Participants</h3>
			<div>
				<h4>{(affaire.experts.length > 1) ? 'Experts':'Expert'}</h4>
				<UnorderedList>
					{#each affaire.experts as expert}
						<ListItem><Link href="{'/biographies/' + expert.id}">{expert.name}</Link>{', ' + getExpertQuality(expert.title, expert.context, expert.appointment)}</ListItem>
					{/each}
				</UnorderedList>
			</div>
			<div>
				<h4>{(affaire.clerks.length > 1) ? 'Greffiers':'Greffier'}</h4>
				<UnorderedList>
					{#each affaire.clerks as clerk}
						<ListItem>{clerk}</ListItem>
					{/each}
				</UnorderedList>
			</div>
			{#each affaire.parties as party}
				<div>
					<h4>{getPartyLabel(party.role, party.status)}</h4>
					{#if party.presence.length !== 0 || party.intervention.length !== 0}
						<p>{getPartyParticipation(party.presence, party.intervention)}</p>
					{/if}
					<UnorderedList>
						{#each party.persons as person}
							<ListItem>{getPerson(person)}</ListItem>
						{/each}
					</UnorderedList>
					<p>Expert : <Link href="{'/biographies/' + party.expert.id}">{party.expert.name}</Link></p>
					{#if party.representatives.length !== 0}
						<p>{(party.representatives.length > 1) ? 'Représentants':'Représentant'}</p>
						<UnorderedList>
							{#each party.representatives as representative}
								<ListItem>{getPerson(representative)}</ListItem>
							{/each}
						</UnorderedList>
					{/if}
					{#if party.prosecutors.length !== 0}
						<p>{(party.prosecutors.length > 1) ? 'Procureurs':'Procureur'}</p>
						<UnorderedList>
							{#each party.prosecutors as prosecutor}
								<ListItem>{prosecutor}</ListItem>
							{/each}
						</UnorderedList>
					{/if}
				</div>
			{/each}
			{#if affaire.craftmen.length !== 0}
				<div>
					<h4>Entrepreneurs, architectes ou maîtres d’œuvre</h4>
					<UnorderedList>
						{#each affaire.craftmen as craftman}
							<ListItem>{getPerson(craftman)}</ListItem>
						{/each}
					</UnorderedList>
				</div>
			{/if}

		</div>
	</div>
</div>
