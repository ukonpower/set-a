import * as GLP from 'glpower';

import ramenVert from './shaders/ramen.vs';
import ramenFrag from './shaders/ramen.fs';

import tamagoFrag from './shaders/tamago.fs';

import { TurnTable } from '~/ts/Scene/Components/TurnTable';
import { Dish } from '../Dish';

export class Ramen extends GLP.Entity {

	constructor( ) {

		super();

		this.addComponent( 'rotateview', new TurnTable( 1 ) );

		/*-------------------------------
			Sara
		-------------------------------*/

		const sara = new Dish( "RAMEN" );
		sara.position.set( 0.0, - 0.08, 0.0 );
		this.add( sara );

		/*-------------------------------
			soup
		-------------------------------*/

		const soup = new GLP.Entity();
		soup.addComponent( "geometry", new GLP.CylinderGeometry( 0.8, 0.5, 0.2, 32 ) );
		soup.addComponent( "material", new GLP.Material( {
			vert: ramenVert,
			frag: ramenFrag,
			type: [ "forward" ],
			defines: { 'SOUP': '' }
		} ) );
		soup.position.set( 0.0, 0.0, 0.0 );
		this.add( soup );

		/*-------------------------------
			negi
		-------------------------------*/

		const negi = new GLP.Entity();
		const negiGeo = new GLP.CylinderGeometry( 0.05, 0.05, 0.015, 10, 1, false );
		negiGeo.setAttribute( 'rnd', new Float32Array( ( ()=>{

			const num = 40;

			const r: number[] = [];
			for ( let j = 0; j < num; j ++ ) {

				r.push( Math.random(), Math.random(), Math.random(), Math.random() );

			}

			return r;

		} )() ), 4, { instanceDivisor: 1 } );
		negi.addComponent( "geometry", negiGeo );
		negi.addComponent( "material", new GLP.Material( {
			vert: ramenVert,
			frag: ramenFrag,
			cullFace: false,
			defines: { 'NEGI': '' }
		} ) );
		negi.position.set( 0.0, 0.1, 0.0 );
		this.add( negi );

		/*-------------------------------
			MENMA
		-------------------------------*/

		const menma = new GLP.Entity();
		const menmaGeo = new GLP.CubeGeometry( 0.1, 0.4, 0.02, 1.0, 10.0, 1.0 );
		menmaGeo.setAttribute( 'rnd', new Float32Array( ( ()=>{

			const num = 5;

			const r: number[] = [];
			for ( let j = 0; j < num; j ++ ) {

				r.push( j / ( num - 1.0 ), Math.random(), Math.random(), Math.random() );

			}

			return r;

		} )() ), 4, { instanceDivisor: 1 } );
		menma.addComponent( "geometry", menmaGeo );
		menma.addComponent( "material", new GLP.Material( {
			vert: ramenVert,
			frag: ramenFrag,
			defines: { 'MENMA': '' }
		} ) );
		menma.position.set( 0.4, 0.12, 0.0 );
		menma.quaternion.setFromEuler( new GLP.Euler( 0.0, Math.PI / 2, 0.0 ) );
		this.add( menma );

		/*-------------------------------
			Tamago
		-------------------------------*/

		const tamago = new GLP.Entity();
		tamago.addComponent( "geometry", new GLP.SphereGeometry( 0.2 ) );
		tamago.addComponent( "material", new GLP.Material( {
			vert: ramenVert,
			frag: tamagoFrag,
		} ) );
		tamago.position.set( - .33, 0.18, 0.3 );
		tamago.quaternion.setFromEuler( new GLP.Euler( - Math.PI / 2 * 0.2, - Math.PI / 2 * 0.3, 0.0 ), "YZX" );

		this.add( tamago );


	}

}
