import * as GLP from 'glpower';

export const canvas = document.createElement( "canvas" );
export const gl = canvas.getContext( 'webgl2' )!;
export const power = new GLP.Power( gl );
export const blidge = new GLP.BLidge();

export const globalUniforms: {[key: string]: GLP.Uniforms} = {
	time: {
		uTime: {
			value: 0,
			type: "1f"
		},
		uFractTime: {
			value: 0,
			type: "1f"
		},
		uTimeSeq: {
			value: 0,
			type: "1f"
		},
		uMove: {
			value: 0,
			type: "1f"
		}
	},
	resolution: {
		uResolution: {
			value: new GLP.Vector(),
			type: '2fv'
		},
		uAspectRatio: {
			value: 1.0,
			type: '1f'
		}
	},
	camera: {
		projectionMatrix: {
			value: new GLP.Matrix(),
			type: 'Matrix4fv'
		},
		viewMatrix: {
			value: new GLP.Matrix(),
			type: 'Matrix4fv'
		}
	},
};


/*-------------------------------
	DEBUG
-------------------------------*/

import { GPUState } from '../libs/GPUState';
export let gpuState: GPUState | undefined = undefined;

import 'webgl-memory';
gpuState = new GPUState();
