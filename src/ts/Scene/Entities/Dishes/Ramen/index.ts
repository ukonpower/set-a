import * as GLP from 'glpower';

import ramenVert from './shaders/ramen.vs';
import ramenFrag from './shaders/ramen.fs';
import tamagoFrag from './shaders/tamago.fs';

import { TurnTable } from '~/ts/Scene/Components/TurnTable';
import { Dish } from '../Dish';
import { globalUniforms } from '~/ts/Globals';

export class Ramen extends GLP.Entity {

	constructor( ) {

		super();

		this.addComponent( 'rotateview', new TurnTable( 1 ) );

		const uniforms = GLP.UniformsUtils.merge( globalUniforms.tex );

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
			defines: { 'SOUP': '' },
			uniforms,
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
			defines: { 'NEGI': '' },
			uniforms,
		} ) );
		negi.position.set( 0.0, 0.1, 0.0 );
		this.add( negi );

		/*-------------------------------
			MENMA
		-------------------------------*/

		const menma = new GLP.Entity();
		const menmaGeo = new GLP.CubeGeometry( 0.15, 0.5, 0.02, 1.0, 10.0, 1.0 );
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
			defines: { 'MENMA': '' },
			uniforms,
		} ) );
		menma.position.set( 0.45, 0.12, 0.0 );
		menma.quaternion.setFromEuler( new GLP.Euler( 0.0, Math.PI / 2, 0.0 ) );
		this.add( menma );

		/*-------------------------------
			Tamago
		-------------------------------*/

		const tamago = new GLP.Entity();
		tamago.addComponent( "geometry", new GLP.SphereGeometry( 0.25 ) );
		tamago.addComponent( "material", new GLP.Material( {
			vert: ramenVert,
			frag: tamagoFrag,
			defines: { 'TAMAGO': '' },
			uniforms,
		} ) );
		tamago.position.set( 0.1, 0.18, 0.45 );
		tamago.quaternion.setFromEuler( new GLP.Euler( - Math.PI / 2 * 0.1, Math.PI / 2 * 0.2, 0.0 ), "YZX" );

		this.add( tamago );

		/*-------------------------------
			Chashu
		-------------------------------*/

		const chashu = new GLP.Entity();
		const chashuGeo = new GLP.CylinderGeometry( 0.32, 0.32, 0.03, 18.0, 1.0 );
		chashuGeo.setAttribute( 'rnd', new Float32Array( ( ()=>{

			const num = 3;

			const r: number[] = [];
			for ( let j = 0; j < num; j ++ ) {

				r.push( j / ( num - 1.0 ), Math.random(), Math.random(), Math.random() );

			}

			return r;

		} )() ), 4, { instanceDivisor: 1 } );

		chashu.addComponent( "geometry", chashuGeo );
		chashu.addComponent( "material", new GLP.Material( {
			vert: ramenVert,
			frag: ramenFrag,
			defines: { 'CHASHU': '' },
			uniforms,
		} ) );

		chashu.position.set( - 0.1, 0.15, - 0.55 );
		chashu.quaternion.setFromEuler( new GLP.Euler( 0.0, 0.2, 0.0 ) );

		this.add( chashu );

		/*-------------------------------
			Nori
		-------------------------------*/

		const nori = new GLP.Entity();
		const noriGeo = new GLP.CubeGeometry( 0.5, 0.8, 0.005, 10.0, 10.0 );
		noriGeo.setAttribute( 'rnd', new Float32Array( ( ()=>{

			const num = 3;

			const r: number[] = [];
			for ( let j = 0; j < num; j ++ ) {

				r.push( j / ( num - 1.0 ), Math.random(), Math.random(), Math.random() );

			}

			return r;

		} )() ), 4, { instanceDivisor: 1 } );

		nori.addComponent( "geometry", noriGeo );
		nori.addComponent( "material", new GLP.Material( {
			vert: ramenVert,
			frag: ramenFrag,
			defines: { 'NORI': '' },
			uniforms,
		} ) );

		nori.position.set( - 0.65, 0.2, 0.2 );
		nori.quaternion.setFromEuler( new GLP.Euler( 0.0, 1.85, 0.0 ) );

		this.add( nori );

	}

	protected appendBlidgerImpl( blidger: GLP.BLidger ): void {

		this.children.forEach( c => {

			const mat = c.getComponent<GLP.Material>( "material" );

			if ( mat ) {

				mat.uniforms = GLP.UniformsUtils.merge( mat.uniforms, blidger.uniforms );

			}

		} );

	}

}
