import * as GLP from 'glpower';

import { DustParticles } from '../Entities/DustParticles';
import { Floor } from '../Entities/Floor';

export const router = ( node: GLP.BLidgeNode ) => {

	// class

	if ( node.class == "Dust" ) {

		return new DustParticles();

	} else if ( node.class == "Floor" ) {

		return new Floor();

	}

	const baseEntity = new GLP.Entity();

	return baseEntity;

};
