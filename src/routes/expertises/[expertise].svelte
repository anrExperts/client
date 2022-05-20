<script context="module">
	/** @type {import('@sveltejs/kit').Load} */

	import {
		Link,
		UnorderedList,
		ListItem
	} from 'carbon-components-svelte' ;

	export async function load({ params, fetch, session, stuff }) {
		const url = `http://localhost:8984/xpr/expertises/${params.expertise}/json`;
		//const url = `https://experts.huma-num.fr/xpr/expertises/${params.expertise}/json`;
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

	const meta = data.meta
	const affaire = data.content

	let expertiseLabel = getExpertiseLabel(meta.cote, meta.dossier, meta.supplement, affaire.dates) ;

	function getExpertiseLabel(cote, dossier, supplement, dates){
		let datesLabel = (dates !== null) ? '(' + getDatesLabel(dates) + ')' : '' ;
		if(supplement.length === 0) {
			return `${cote} dossier n°${dossier} ${datesLabel}`
		} else {
			return `${cote} dossier n°${dossier} ${supplement} ${datesLabel}`
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
		if(name.length !==0 && occupation.length !== 0) {return [name, occupation].join(', ')}
		else if(name.length !==0 && occupation.length == 0) {return name}
		return occupation
	}

	function getOpinion(opinion) {
		 if(opinion.experts !== null) {
			 console.log(`experts : ${opinion.experts}`)
			 var experts = opinion.experts
			 var entitiesLink = []
			 for (let expert of experts) {
				 entitiesLink.push(getEntitiesLink(expert))
			 }
			 return `Conclusion de ${entitiesLink.join(' ; ')}  : ${opinion.opinion}`
		} else {
			 return `Conclusion : ${opinion.opinion}`
		}
	}
	function getEntitiesLink(entity) {
		// @todo do not return html return `<Link href="/biographies/${entity.id}">${entity.name}</Link>`
		return entity.name
	}

	function getSentences(sentences){
		let institutions = [] ;
		for (let institution of sentences) {
			let dates = [] ;
			if(institution.dates !== null) {
				for (let date of institution.dates) {
					dates.push(getDate(date))
				}
			}
			institutions.push((institution.dates !== null) ? institution.orgName + ' : ' + dates.join(', ') : institution.orgName)
		} ;
		return institutions.join(' | ')
	}

</script>

<div>
	<h1>Expertise</h1>
	<div>
		<h2>{expertiseLabel}</h2>
		{#if affaire.addresses !== null}
			<p>{affaire.addresses.join(" | ")}</p>
		{/if}
		<!--Vacations-->
		<div>
			<h3>Liste des vacations</h3>
			{#if affaire.sessions !== null}
				<ul>
					{#each affaire.sessions as session}
						<li>{getSessions(session)}</li>
					{/each}
				</ul>
			{/if}
		</div>

		<!--Procedure-->
		<div>
			<h3>Procédure</h3>
			{#if affaire.designation.length > 0}
				<p>{ affaire.designation }</p>
			{/if}
			{#if affaire.categories !== null}
				<p>{ (affaire.categories.length > 1) ? 'Catégories d’expertise : ':'Catégorie d’expertise : ' + affaire.categories.join(' ; ') + '.' }</p>
			{/if}
			{#if affaire.framework.length > 0}
				<p>{ `Procédure : ${affaire.framework}` }</p>
			{/if}
			{#if affaire.origination.length > 0}
				<p>{ `Origine de l’expertise : ${affaire.origination}` }</p>
			{/if}
			{#if affaire.sentences !== null}
				<p>{ `Intervention d’une institution : ${getSentences(affaire.sentences)}` }</p>
			{/if}
			{#if affaire.case.length > 0}
				<p>{ `Cause de l’expertise : ${affaire.case}` }</p>
			{/if}
			{#if affaire.objects !== null}
				<p>{ (affaire.objects.length > 1) ? 'Objets de l’expertise : ':'Objet de l’expertise : '}{ `${affaire.objects.join(' ; ')}.` }</p>
			{/if}
		</div>
		<!--Participants-->
		<div>
			<h3>Participants</h3>
			{#if affaire.experts !== null}
				<div>
					<h4>{(affaire.experts.length > 1) ? 'Experts':'Expert'}</h4>
					<UnorderedList>
						{#each affaire.experts as expert}
							<ListItem><Link href="{'/biographies/' + expert.id}">{expert.name}</Link>{', ' + getExpertQuality(expert.title, expert.context, expert.appointment)}</ListItem>
						{/each}
					</UnorderedList>
				</div>
			{/if}
			{#if affaire.clerks !== null}
				<div>
					<h4>{(affaire.clerks.length > 1) ? 'Greffiers':'Greffier'}</h4>
					<UnorderedList>
						{#each affaire.clerks as clerk}
							<ListItem>{clerk}</ListItem>
						{/each}
					</UnorderedList>
				</div>
			{/if}
			{#if affaire.parties !== null}
				{#each affaire.parties as party}
					<div>
						<h4>{getPartyLabel(party.role, party.status)}</h4>
						{#if party.presence.length !== 0 || party.intervention.length !== 0}
							<p>{getPartyParticipation(party.presence, party.intervention)}</p>
						{/if}
						{#if party.person !== null}
							<UnorderedList>
								{#each party.persons as person}
									<ListItem>{getPerson(person)}</ListItem>
								{/each}
							</UnorderedList>
						{/if}
						{#if party.expert !== null}
							<p>Expert : <Link href="{'/biographies/' + party.expert.id}">{party.expert.name}</Link></p>
						{/if}
						{#if party.representatives !== null}
							<p>{(party.representatives.length > 1) ? 'Représentants':'Représentant'}</p>
							<UnorderedList>
								{#each party.representatives as representative}
									<ListItem>{getPerson(representative)}</ListItem>
								{/each}
							</UnorderedList>
						{/if}
						{#if party.prosecutors !== null}
							<p>{(party.prosecutors.length > 1) ? 'Procureurs':'Procureur'}</p>
							<UnorderedList>
								{#each party.prosecutors as prosecutor}
									<ListItem>{prosecutor}</ListItem>
								{/each}
							</UnorderedList>
						{/if}
					</div>
				{/each}
			{/if}
			{#if affaire.craftmen !== null}
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
		<!--Conclusions-->
		<div>
			<h3>Conclusions</h3>
			{#if affaire.agreement.length > 0}
				<p>{ `Dispositif de l’expertise : ${affaire.agreement}` }</p>
			{/if}
			{#if affaire.opinions !== null}
				{#each affaire.opinions as opinion}
					<p>{ getOpinion(opinion) }</p>
				{/each}
			{/if}
			{#if affaire.arrangement.length > 0}
				<p>{ `Accomodement : ${affaire.arrangement.toLowerCase()}` }</p>
			{/if}
			{#if affaire.estimate.length > 0}
				<p>{ `Montant global (pour les estimations) : ${affaire.estimate}` }</p>
			{/if}
			{#if affaire.estimates !== null}
				<ul>
					{#each affaire.estimates as place}
						<lh>{ `Estimation pour ${place.placeName}` }</lh>
						{#each place.appraisals as appraisal}
							<li>{ `${appraisal.description} : ${appraisal.value}` }</li>
						{/each}
					{/each}
				</ul>
			{/if}
			{#if affaire.fees !== null}
				{#each affaire.fees as fee}
					<p>{ fee }</p>
				{/each}
			{/if}
			{#if affaire.totalFees.length > 0}
				<p>{ `Coût total de l’expertise : ${affaire.totalFees}`}</p>
			{/if}
			{#if affaire.expertsExpense.length > 0}
				<p>{ `Bourse commune des experts : ${affaire.expertsExpense}` }</p>
			{/if}
			{#if affaire.clerksExpense.length > 0}
				<p>{ `Bourse commune des greffiers : ${affaire.clerksExpense}` }</p>
			{/if}
		</div>
		{#if affaire.analysis.length > 0}
			<!--Analysis-->
			<div>
				<h3>Commentaires et première analyse</h3>
				<p>{ affaire.analysis }</p>
			</div>
		{/if}
		{#if affaire.noteworthy.length > 0}
			<!--Analysis-->
			<div>
				<h3>Éléments remarquables</h3>
				<p>{ affaire.noteworthy }</p>
			</div>
		{/if}
	</div>
</div>
