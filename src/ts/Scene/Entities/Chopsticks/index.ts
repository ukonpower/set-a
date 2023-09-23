import * as GLP from 'glpower';

import { globalUniforms } from '~/ts/Globals';

import chopsticksVert from './shaders/chopsticks.vs';
import chopsticksFrag from './shaders/chopsticks.fs';

export class Chopsticks extends GLP.Entity {

	constructor() {

		super();

		this.addComponent( "material", new GLP.Material( {
			name: "chopstics",
			uniforms: GLP.UniformsUtils.merge( globalUniforms.time, { uNoiseTex: globalUniforms.tex.uNoiseTex } ),
			vert: chopsticksVert,
			frag: chopsticksFrag,
		} ) );

		this.addComponent( 'geometry', new GLP.CylinderGeometry( 0.2, 0.05, 10, 6 ) );

	}

}
