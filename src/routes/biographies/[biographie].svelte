<script context="module">
    import {
        Link,
        UnorderedList,
        ListItem
    } from 'carbon-components-svelte' ;
    import { Launch16 } from 'carbon-icons-svelte' ;
	import { get_root_for_style } from 'svelte/internal';
    /** @type {import('@sveltejs/kit').Load} */


    export async function load({ params, fetch, session, stuff }) {
        const url = `http://localhost:8984/xpr/biographies/${params.biographie}/json`;
        //const url = `https://experts.huma-num.fr/xpr/biographies/${params.biographie}/json`;
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
    import expertises from "../expertises/index.svelte";

    export let data
    console.log(data);

    $: biographie = data.content

    function getDates(dates) {
        if(dates == null) {return ''} ;
        if(dates.constructor === Array) { return getDatesFromArray(dates) ; } ;
        if(dates.constructor === Object) { return getDatesFromObject(dates) ; } ;

    }

    function getDatesFromObject(dates) {
        if(dates.from === undefined && !dates.birth) { return getPrecision(formatDate(dates.date), dates.precision) ; }
        if(dates.birth) {
            var birth = getPrecision(formatDate(dates.birth.date), dates.birth.precision) ;
            var death = getPrecision(formatDate(dates.death.date), dates.death.precision) ;
            console.log(birth) ;
            return `${birth} – ${death}` ;
        }
        return getDateRange(dates) ;
    }

    function getDatesFromArray(dates) {
        if(dates.length === 0) {return 'aucune date renseignée'}
        if(dates.length > 1) { return `${formatDate(dates[0])} - ${formatDate(dates[dates.length-1])}` }
        /*if(dates.length > 1 && !dates.every(x => x.precision)) { return `${formatDate(dates[0])} - ${formatDate(dates[dates.length-1])}` }
        if(dates.every(x => x.precision)) {
            var listOfDates = [] ;
            for(let date of dates) {
                listOfDates.push(getPrecision(formatDate(date.date), date.precision)) ;
            }
            return listOfDates.join(' | ') ;
        }*/
        return formatDate(dates) ;
    }

    function getDateRange(dates) {
        var from = getPrecision(formatDate(dates.from.date), dates.from.precision) ;
        var to = getPrecision(formatDate(dates.to.date), dates.to.precision) ;
        return `${from} – ${to}` ;
    }

    function getPrecision(date, precision) {
        switch (precision) {
            case 'notAfter': return `${date}]` ; break ;
            case 'noteBefore': return `[${date}` ; break ;
            case 'standardDate': return date ; break ;
            default: return date ;
        }
    }

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

<div>
  <h1>Prosopographie</h1>
  <article>
    <h2>{`${biographie.id} | ${biographie.authorizedForm}`}</h2>
    <p>{getDates(biographie.existDates)}</p>
    <!--@todo alternative form-->
    <!--sexe-->
    {#if biographie.sex.length > 0}
      <p>{ `Sexe : ${(biographie.sex == 'male') ? 'homme':'femme'}` }</p>
    {/if}
    {#if biographie.places != null}
      <section>
        <h3>Adresses</h3>
        {#each biographie.places as place}
          <div>
            <h4>{ place.placeRole }</h4>
            {#if place.placeEntry.length > 0}
              <p>{ place.placeEntry }</p>
            {/if}
            {#if place.dates !== null}
              {#each place.dates as date}
                <p>{`${getDates(date)}`}</p>
                {#if date.sources !== null}
                  <ul>
                    <lh>{ (date.sources.length > 1) ? 'Sources :':'Source :' }</lh>
                    {#each date.sources as source}
                      <li><a href="{ '/sources/' + source.id }">{source.source}</a></li>
                    {/each}
                  </ul>
                {/if}
              {/each}
            {/if}
            <!--{#if Object.values(place.dates).every(x => x !== null || x !== '')}
              <p>{ `${getDates(place.dates)}` }</p>
            {/if}-->
            {#if place.note.length > 0}
              <p>{ `Note : ${place.note}` }</p>
            {/if}
          </div>
        {/each}
        </section>
    {/if}
    <!--forms of the name-->
    <section>
      <h3></h3>
    </section>
    <!--function-->
    {#if biographie.functions !== null}
      <section>
        <h3>Fonctions</h3>
        {#each biographie.functions as funct}
          <p>{`${funct.function} ${getDates(funct.dates)}`}</p>
        {/each}
      </section>
    {/if}
    <!--occupation-->
    {#if biographie.occupations !== null}
      <section>
        <h3>Profession</h3>
        {#each biographie.occupations as occupation}
          <p>{`${occupation.occupation} ${getDates(occupation.dates)}`}</p>
        {/each}
      </section>
    {/if}
    <!--event-->
    {#if biographie.events !== null}
      <section>
        <h3>Informations biographiques</h3>
        {#each biographie.events as event}
          <section>
            <h4>{ event.event }</h4>
            {#if event.place != null}
              <p>{ `Lieu : ${event.place}` }</p>
            {/if}
            {#if event.dates != null }
              {#each event.dates as date}
                <p>{ `Date : ${getDates(date)}` }</p>
              {/each}
            {/if}
            {#if event.sources !== null}
              <ul>
                <lh>{ (event.sources.length > 1) ? 'Sources : ':'Source : ' }</lh>
                {#each event.sources as source}
                  <li><a href="{ '/sources/' + source.id }">{ source.source }</a></li>
                {/each}
              </ul>
            {/if}
            </section>
        {/each}
      </section>
    {/if}
    {#if biographie.relations !== null}
      <section>
        <h3>Relations</h3>
        {#each biographie.relations as relation}
          <section>
            <h4>{relation.relation}</h4>
            {#if relation.roles !== null}
            <ul>
              <lh>{ (relation.roles.length > 1) ? 'Rôles :':'Rôle :' }</lh>
              {#each relation.roles as role}
                <li>
                  {role.role}
                  {#if role.sources !== null}
                    <ul>
                      {#each role.sources as source}
                        <li><a href="{ '/sources/' + source.id }">{source.source}</a></li>
                      {/each}
                    </ul>
                  {/if}
                </li>
              {/each}
            </ul>
            {/if}
          </section>
        {/each}
      </section>
    {/if}
    <!--Expertises-->
    {#if biographie.expertises !== null}
      <section>
        <h3>Expertises</h3>
        <UnorderedList>
          {#each biographie.expertises as expertise}
            <ListItem><Link href={'/expertises/' + expertise.id}>{expertise.id}</Link> {getDates(expertise.dates)}</ListItem>
          {/each}
        </UnorderedList>
      </section>
    {/if}
    </article>
</div>
