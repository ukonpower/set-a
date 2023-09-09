import { Component } from "..";
import { TArrayBuffer, GLPowerBuffer } from "../../../GLPowerBuffer";
import { AttributeOptions, GLPowerVAO } from "../../../GLPowerVAO";
import { Power } from "../../../Power";

export type GeometryParam = {
}

type Attribute = {
	array: TArrayBuffer;
	size: number;
	buffer?: GLPowerBuffer
	opt?: AttributeOptions,
}

type DefaultAttributeName = 'position' | 'uv' | 'normal' | 'index';

export class Geometry extends Component {

	public vertCount: number;
	public attributes: Map<string, Attribute >;
	public needsUpdate: Map<GLPowerVAO, boolean>;

	constructor() {

		super();

		this.vertCount = 0;
		this.attributes = new Map();
		this.needsUpdate = new Map();

	}

	public setAttribute( name: DefaultAttributeName | ( string & {} ), array: TArrayBuffer, size: number, opt?: AttributeOptions ) {

		this.attributes.set( name, {
			array,
			size,
			opt,
		} );

		this.updateVertCount();

		return this;

	}

	public getAttribute( name: DefaultAttributeName | ( string & {} ) ) {

		return this.attributes.get( name );

	}

	private updateVertCount() {

		this.vertCount = this.attributes.size > 0 ? Infinity : 0;

		this.attributes.forEach( ( attribute, name ) => {

			if ( name == 'index' || attribute.opt && attribute.opt.instanceDivisor ) return;

			this.vertCount = Math.min( attribute.array.length / attribute.size, this.vertCount );

		} );

	}

	public createBuffer( power: Power ) {

		this.attributes.forEach( ( attr, key ) => {

			attr.buffer = power.createBuffer().setData( attr.array, key == 'index' ? "ibo" : 'vbo' );

		} );

	}

}
