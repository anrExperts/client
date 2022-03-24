<script>
  import "carbon-components-svelte/css/all.css";
  import {
    Theme,
    RadioButtonGroup,
    RadioButton,
  } from "carbon-components-svelte";
  let theme = "g90";

  import {
    Header,
    HeaderUtilities,
    HeaderAction,
    HeaderGlobalAction,
    HeaderPanelLinks,
    HeaderPanelDivider,
    HeaderPanelLink,
    SideNav,
    SideNavItems,
    SideNavMenu,
    SideNavMenuItem,
    SideNavLink,
    SkipToContent,
    Content,
    Grid,
    Row,
    Column,
  } from "carbon-components-svelte";
  import SettingsAdjust20 from "carbon-icons-svelte/lib/SettingsAdjust20"; 
  import UserAvatarFilledAlt20 from "carbon-icons-svelte/lib/UserAvatarFilledAlt20";

  let isSideNavOpen = false; 
	let isOpen1 = false;
	let isOpen2 = false;
  import { Link } from "carbon-components-svelte";
  import Nav from '$components/Nav.svelte';
</script>

<Header 
  persistentHamburgerMenu={true} 
  company="anr" 
  platformName="xpr" 
  bind:isSideNavOpen>
	<svelte:fragment slot="skip-to-content">
		<SkipToContent />
	</svelte:fragment>
	<HeaderUtilities>
		<HeaderGlobalAction aria-label="Settings" icon={SettingsAdjust20} />
		<HeaderAction
			bind:isOpen={isOpen1}
			icon={UserAvatarFilledAlt20}
			closeIcon={UserAvatarFilledAlt20}
		>
			<Theme bind:theme />
			<RadioButtonGroup legendText="Carbon theme" orientation="vertical" bind:selected={theme}>
				{#each ['white', 'g10', 'g80', 'g90', 'g100'] as value}
					<RadioButton labelText={value} {value}/>
				{/each}
			</RadioButtonGroup>
		</HeaderAction>
		<HeaderAction bind:isOpen={isOpen2}>
			<HeaderPanelLinks>
				<HeaderPanelDivider>Projet</HeaderPanelDivider>
				<HeaderPanelLink><Link href="/" target="_blank">Accueil</Link></HeaderPanelLink>
        <HeaderPanelLink><Link href="/a-propos" target="_blank">À propos</Link></HeaderPanelLink>

				<HeaderPanelDivider>Données</HeaderPanelDivider>
				<HeaderPanelLink><Link href="/expertises" target="_blank">expertises</Link></HeaderPanelLink>
        <HeaderPanelLink><Link href="/biographies" target="_blank">prosopographie</Link></HeaderPanelLink>
			</HeaderPanelLinks>
		</HeaderAction>
	</HeaderUtilities>
</Header>

<SideNav bind:isOpen={isSideNavOpen}>
	<SideNavItems>
		<SideNavLink text="Link 1" />
		<SideNavLink text="Link 2" />
		<SideNavLink text="Link 3" />
		<SideNavMenu text="Menu">
			<SideNavMenuItem href="/" text="Link 1" />
			<SideNavMenuItem href="/" text="Link 2" />
			<SideNavMenuItem href="/" text="Link 3" />
		</SideNavMenu>
	</SideNavItems>
</SideNav>

<Content>
	<Grid>
		<Row>
				<slot />
		</Row>
	</Grid>
</Content>
