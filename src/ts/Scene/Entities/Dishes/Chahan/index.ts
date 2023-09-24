import * as GLP from 'glpower';

import chahanVert from './shaders/chahan.vs';
import chahanFrag from './shaders/chahan.fs';

import { TurnTable } from '~/ts/Scene/Components/TurnTable';
import { globalUniforms } from '~/ts/Globals';
import { Dish } from '../Dish';

export class Chahan extends GLP.Entity {

	constructor() {

		super();

		this.addComponent( 'rotateview', new TurnTable( 1 ) );

		/*-------------------------------
			Sara
		-------------------------------*/

		const sara = new Dish();
		sara.position.set( 0.0, - 0.08, 0.0 );
		this.add( sara );

		/*-------------------------------
			PARAPARA
		-------------------------------*/

		const geos = [
			new GLP.SphereGeometry( 0.05, 10, 5 ),
			new GLP.CylinderGeometry( 0.03, 0.03, 0.02, 10, 10, false ),
			new GLP.CubeGeometry( 0.035, 0.1, 0.035, 1.0, 10.0, 1.0 ),
			new GLP.CubeGeometry( 0.05, 0.07, 0.02 )
		];

		for ( let i = 0; i < 4; i ++ ) {

			const para = new GLP.Entity();
			const parageo = geos[ i ];
			parageo.setAttribute( 'rnd', new Float32Array( ( ()=>{

				const num = [ 1000, 50, 20, 50, 0 ][ i ] * 1.0;

				const r: number[] = [];
				for ( let j = 0; j < num; j ++ ) {

					r.push( Math.random(), Math.random(), Math.random(), Math.random() );

				}

				return r;

			} )() ), 4, { instanceDivisor: 1 } );

			const defines: any = {
				'PARA': '',
			};

			defines[ [ "KOME", "NEGI", "NIKU", "TAMAGO" ][ i ] ] = '';

			para.addComponent( "geometry", parageo );
			para.addComponent( "material", new GLP.Material( {
				name: "para" + i,
				vert: chahanVert,
				frag: chahanFrag,
				uniforms: GLP.UniformsUtils.merge( { uNoiseTex: globalUniforms.tex.uNoiseTex } ),
				defines,
				cullFace: false,
			} ) );
			para.position.set( 0.0, 0.0, 0.0 );
			this.add( para );

		}

		/*-------------------------------
			Dummy
		-------------------------------*/

		const dummy = new GLP.Entity();
		dummy.addComponent( "geometry", new GLP.SphereGeometry( 0.605, 100, 100 ) );
		dummy.addComponent( "material", new GLP.Material( {
			vert: chahanVert,
			frag: chahanFrag,
			defines: { 'DUMMY': '' }
		} ) );
		this.add( dummy );

		/*-------------------------------
			Shoga
		-------------------------------*/

		const shoga = new GLP.Entity();
		const shogaGeo = new GLP.CubeGeometry( 0.02, 0.02, 0.3, 1.0, 1.0, 10 );
		shogaGeo.setAttribute( 'rnd', new Float32Array( ( ()=>{

			const num = 20;

			const r: number[] = [];
			for ( let j = 0; j < num; j ++ ) {

				r.push( Math.random(), Math.random(), Math.random(), Math.random() );

			}

			return r;

		} )() ), 4, { instanceDivisor: 1 } );
		shoga.addComponent( "geometry", shogaGeo );
		shoga.addComponent( "material", new GLP.Material( {
			vert: chahanVert,
			frag: chahanFrag,
			defines: { 'SHOGA': '' }
		} ) );
		shoga.position.set( 0.67, 0.02, 0.0 );
		this.add( shoga );


	}

}
