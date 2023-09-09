import * as GLP from 'glpower';

import { Skybox } from '../Entities/Skybox';
import { Trees } from '../Entities/Trees';
import { Terrain } from '../Entities/Terrain';
import { Poles } from '../Entities/Poles';

export const router = ( node: GLP.BLidgeNode ) => {

	// class

	if ( node.class == "Skybox" ) {

		return new Skybox();

	} else if ( node.class == "Trees" ) {

		return new Trees();

	} else if ( node.class == "Terrain" ) {

		return new Terrain();

	} else if ( node.class == "UtilityPoles" ) {

		return new Poles();

	}

	const baseEntity = new GLP.Entity();

	return baseEntity;

};
