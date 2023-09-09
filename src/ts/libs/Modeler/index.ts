import * as GLP from 'glpower';
import { setUniforms } from '~/ts/Scene/Renderer';
import { shaderParse } from '~/ts/Scene/Renderer/ShaderParser';

export class Modeler {

	private power: GLP.Power;
	private gl: WebGL2RenderingContext;
	private tf: GLP.GLPowerTransformFeedback;

	constructor( power: GLP.Power ) {

		this.power = power;
		this.gl = this.power.gl;
		this.tf = new GLP.GLPowerTransformFeedback( this.power.gl );

	}

	public bakeTf( baseGeometry: GLP.Geometry, vertexShader: string, uniforms?: any, defines?: any ) {

		const resultGeo = new GLP.Geometry();

		const program = this.power.createProgram();
		const tf = new GLP.GLPowerTransformFeedback( this.gl );

		let instanceCount = 1;

		baseGeometry.attributes.forEach( attr => {

			if ( attr.opt && attr.opt.instanceDivisor ) {

				instanceCount = attr.array.length / attr.size;

			}

		} );

		const outBufferPosition = this.power.createBuffer();
		outBufferPosition.setData( new Float32Array( ( baseGeometry.attributes.get( 'position' )?.array.length || 0 ) * instanceCount ), 'vbo', this.gl.DYNAMIC_COPY );

		const outBufferNormal = this.power.createBuffer();
		outBufferNormal.setData( new Float32Array( ( baseGeometry.attributes.get( 'normal' )?.array.length || 0 ) * instanceCount ), 'vbo', this.gl.DYNAMIC_COPY );

		tf.setBuffer( "position", outBufferPosition, 0 );
		tf.setBuffer( "normal", outBufferNormal, 1 );

		tf.bind( () => {

			program.setShader( shaderParse( vertexShader, { ...defines, "TF_MODELER": "" } ), "#version 300 es\n void main(){ discard; }", { transformFeedbackVaryings: [ 'o_position', 'o_normal' ] } );

		} );

		const vao = program.getVAO();

		if ( vao ) {

			baseGeometry.createBuffer( this.power );

			baseGeometry.attributes.forEach( ( attr, key ) => {

				if ( attr.buffer ) {

					vao.setAttribute( key, attr.buffer, attr.size, attr.opt );

				}

			} );

			if ( uniforms ) {

				setUniforms( program, uniforms );

			}

			program.use( () => {

				program.uploadUniforms();

				tf.use( () => {

					this.gl.beginTransformFeedback( this.gl.POINTS );
					this.gl.enable( this.gl.RASTERIZER_DISCARD );

					vao.use( () => {

						if ( vao.instanceCount > 0 ) {

							this.gl.drawArraysInstanced( this.gl.POINTS, 0, vao.vertCount, vao.instanceCount );

						} else {

							this.gl.drawArrays( this.gl.POINTS, 0, vao.vertCount );

						}

					} );

					this.gl.disable( this.gl.RASTERIZER_DISCARD );
					this.gl.endTransformFeedback();

				} );


				const outPos = new Float32Array( outBufferPosition.array!.length );
				const outNormal = new Float32Array( outBufferNormal.array!.length );

				this.gl.bindBuffer( this.gl.ARRAY_BUFFER, outBufferPosition.buffer );
				this.gl.getBufferSubData( this.gl.ARRAY_BUFFER, 0, outPos );

				this.gl.bindBuffer( this.gl.ARRAY_BUFFER, outBufferNormal.buffer );
				this.gl.getBufferSubData( this.gl.ARRAY_BUFFER, 0, outNormal );

				resultGeo.setAttribute( 'position', outPos, 3 );
				resultGeo.setAttribute( 'normal', outNormal, 3 );

			} );

		}

		const indexArray: number[] = [];

		const baseIndex = baseGeometry.getAttribute( 'index' );

		let TypedArray: Uint16ArrayConstructor | Uint32ArrayConstructor = Uint16Array;

		if ( baseIndex ) {

			for ( let i = 0; i < instanceCount; i ++ ) {

				for ( let j = 0; j < baseIndex.array.length; j ++ ) {

					const index = baseIndex.array[ j ] + i * ( baseGeometry.vertCount );
					indexArray.push( baseIndex.array[ j ] + i * ( baseGeometry.vertCount ) );

					if ( index > 65535 ) {

						TypedArray = Uint32Array;

					}

				}

			}

		}

		resultGeo.setAttribute( 'index', new ( TypedArray )( indexArray ), 1 );

		return resultGeo;

	}

	public bakeEntity( entity: GLP.Entity ) {

		const resultGeo = new GLP.Geometry();

		const posArray: number[] = [];
		const normalArray : number[] = [];
		const indexArray: number[] = [];

		const _ = ( e: GLP.Entity, matrix: GLP.Matrix ) => {

			let geo = e.getComponent<GLP.Geometry>( 'geometry' );

			if ( geo ) {

				const mat = e.getComponent<GLP.Material>( 'material' );

				if ( mat ) {

					geo = this.bakeTf( geo, mat.vert, mat.uniforms, { ...mat.defines } );

				}

				const currentIndex = posArray.length / 3;

				const pos = geo.getAttribute( 'position' );

				if ( pos ) {

					for ( let i = 0; i < pos.array.length; i += 3 ) {

						const p = new GLP.Vector( pos.array[ i + 0 ], pos.array[ i + 1 ], pos.array[ i + 2 ], 1 );
						p.applyMatrix4( matrix );
						posArray.push( p.x, p.y, p.z );

					}

				}

				const normal = geo.getAttribute( 'normal' );

				if ( normal ) {

					for ( let i = 0; i < normal.array.length; i += 3 ) {

						const p = new GLP.Vector( normal.array[ i + 0 ], normal.array[ i + 1 ], normal.array[ i + 2 ], 0 );
						p.applyMatrix4( matrix );
						normalArray.push( p.x, p.y, p.z );

					}

				}

				const index = geo.getAttribute( 'index' );

				if ( index ) {

					for ( let i = 0; i < index.array.length; i ++ ) {

						indexArray.push( index.array[ i ] + currentIndex );

					}

				}

			}


			e.children.forEach( c => {

				c.updateMatrix( );

				_( c, matrix.clone().multiply( c.matrix ) );

			} );

		};

		_( entity, new GLP.Matrix() );

		resultGeo.setAttribute( "position", new Float32Array( posArray ), 3 );
		resultGeo.setAttribute( "normal", new Float32Array( normalArray ), 3 );
		resultGeo.setAttribute( "index", new Uint32Array( indexArray ), 1 );

		return resultGeo;

	}

}
