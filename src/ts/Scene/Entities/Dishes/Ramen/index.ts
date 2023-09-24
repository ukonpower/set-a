import * as GLP from 'glpower';

import ramenVert from './shaders/ramen.vs';
import ramenFrag from './shaders/ramen.fs';

import { TurnTable } from '~/ts/Scene/Components/TurnTable';
import { Dish } from '../Dish';

export class Ramen extends GLP.Entity {

	constructor( ) {

		super();

		this.addComponent( 'rotateview', new TurnTable( 1 ) );

		/*-------------------------------
			Sara
		-------------------------------*/

		const sara = new Dish();
		sara.position.set( 0.0, - 0.08, 0.0 );
		this.add( sara );

	}

}
