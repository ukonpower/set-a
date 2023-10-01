#include <common>
#include <packing>
#include <frag_h>

uniform vec3 cameraPosition;
uniform sampler2D uNoiseTex;
uniform vec4 uParaState;

void main( void ) {

	#include <frag_in>

	float dnv = dot( normalize( vViewNormal ), normalize( -vMVPosition ) );
	vec4 n = texture( uNoiseTex, vUv * 1.0 );
	
	#ifdef KOME

		outRoughness = 0.4;
		outColor.xyz *= vec3( 1.0, 0.90, 0.7 );

	#endif

	#ifdef NEGI

		outColor = vec4( 0.1, 0.5, 0.0, 1.0 );

	#endif

	#ifdef NIKU

		outColor = mix( vec4( 0.94, 0.5, 0.4, 1.0 ), vec4( 1.0, 0.0,0.0, 1.0 ), abs(vUv.x - 0.5) * 0.5 );
		outRoughness = n.x;

	#endif

	#ifdef TAMAGO

		outColor = mix( vec4( 1.0, 0.9, 0.0, 1.00 ), vec4( 1.0, 0.0,0.0, 1.0 ), abs(vUv.x - 0.5) * 0.5 );
		outRoughness = n.x;

	#endif

	outColor.xyz = mix( vec3( 1.0 ), outColor.xyz, uParaState.y );
	
	outSS += ( 1.0 - dnv * 0.7 ) * vec3( 1.0, 0.6, 0.0 ) * 0.2 * uParaState.y;
	outRoughness *= 0.1;
	

	#include <frag_out>

} 