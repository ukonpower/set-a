import { Component } from "..";
export type MaterialRenderType = "shadowMap" | "deferred" | "forward" | "envMap" | 'postprocess'

type MaterialDefines = {[key: string]: any};
type MaterialVisibility = {[K in MaterialRenderType]?: boolean}
type MaterialProgramCache = {[K in MaterialRenderType]?: GLPowerProgram}

import basicVert from './shaders/basic.vs';
import basicFrag from './shaders/basic.fs';
import { gl } from '~/ts/Globals';
import { GLPowerProgram, Uniforms } from "../../../GLPowerProgram";

export type MaterialParam = {
	name?: string,
	type?: MaterialRenderType[];
	frag?: string;
	vert?: string;
	defines?: MaterialDefines;
	uniforms?: Uniforms;
	depthTest?: boolean;
	cullFace? :boolean;
	blending?: boolean,
	drawType?: number;
}

export class Material extends Component {

	public name: string;
	public type: MaterialRenderType[];

	public vert: string;
	public frag: string;
	public defines: MaterialDefines;
	public uniforms: Uniforms;

	public useLight: boolean;
	public depthTest: boolean;
	public cullFace: boolean;
	public drawType: number;

	public visibilityFlag: MaterialVisibility;
	public programCache: MaterialProgramCache;

	constructor( opt: MaterialParam ) {

		super();

		this.name = opt.name || '';
		this.type = opt.type || [];

		this.visibilityFlag = {
			shadowMap: this.type.indexOf( 'shadowMap' ) > - 1,
			deferred: this.type.indexOf( 'deferred' ) > - 1,
			forward: this.type.indexOf( 'forward' ) > - 1,
			envMap: this.type.indexOf( 'envMap' ) > - 1,
			postprocess: this.type.indexOf( 'postprocess' ) > - 1,
		};

		this.vert = opt.vert || basicVert;
		this.frag = opt.frag || basicFrag;
		this.defines = opt.defines || {};
		this.uniforms = opt.uniforms || {};
		this.useLight = true;
		this.depthTest = opt.depthTest !== undefined ? opt.depthTest : true;
		this.cullFace = opt.cullFace !== undefined ? opt.cullFace : true;
		this.drawType = opt.drawType !== undefined ? opt.drawType : gl.TRIANGLES;
		this.programCache = {};

	}

	public requestUpdate() {

		this.programCache = {};

	}

}
