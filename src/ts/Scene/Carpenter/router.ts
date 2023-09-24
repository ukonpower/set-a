import * as GLP from 'glpower';

import { DustParticles } from '../Entities/DustParticles';
import { Floor } from '../Entities/Floor';
import { Chopsticks } from '../Entities/Chopsticks';
import { Chahan } from '../Entities/Dishes/Chahan';
import { Ramen } from '../Entities/Dishes/Ramen';

export const router = ( node: GLP.BLidgeNode ) => {

	// class

	if ( node.class == "Dust" ) {

		return new DustParticles();

	} else if ( node.class == "Floor" ) {

		return new Floor();

	} else if ( node.class == 'Chop' ) {

		return new Chopsticks();

	} else if ( node.class == "Chahan" ) {

		return new Chahan();

	} else if ( node.class == "Ramen" ) {

		return new Ramen();

	}

	const baseEntity = new GLP.Entity();

	return baseEntity;

};
