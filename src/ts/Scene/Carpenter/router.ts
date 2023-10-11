import * as GLP from 'glpower';

import { DustParticles } from '../Entities/DustParticles';
import { Floor } from '../Entities/Floor';
import { Chopsticks } from '../Entities/Chopsticks';
import { Chahan } from '../Entities/Dishes/Chahan';
import { Ramen } from '../Entities/Dishes/Ramen';
import { Renge } from '../Entities/Renge';
import { Shoyu } from '../Entities/Shoyu';
import { ChahanPara } from '../Entities/Dishes/ChahanPara';
import { Skybox } from '../Entities/Skybox';
import { Gyoza } from '../Entities/Dishes/Gyoza';
import { Menu } from '../Entities/Menu';
import { Chochin } from '../Entities/Chochin';
import { Noren } from '../Entities/Noren';

export const router = ( node: GLP.BLidgeNode ) => {

	// class

	if ( node.class == "Skybox" ) {

		return new Skybox();

	} else if ( node.class == "Dust" ) {

		return new DustParticles();

	} else if ( node.class == "Floor" ) {

		return new Floor();

	} else if ( node.class == 'Chop' ) {

		return new Chopsticks();

	} else if ( node.class == "Chahan" ) {

		return new Chahan();

	} else if ( node.class == "Ramen" ) {

		return new Ramen();

	} else if ( node.class == "Renge" ) {

		return new Renge();

	} else if ( node.class == "Shoyu" ) {

		return new Shoyu();

	} else if ( node.class == "ChahanPara" ) {

		return new ChahanPara();

	} else if ( node.class == "Gyoza" ) {

		return new Gyoza();

	} else if ( node.class == "Menu" ) {

		return new Menu();

	} else if ( node.class == "Chochin" ) {

		return new Chochin();

	} else if ( node.class == "Noren" ) {

		return new Noren();

	}

	const baseEntity = new GLP.Entity();

	return baseEntity;

};
