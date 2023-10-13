#include <common>
#include <packing>
#include <frag_h>

uniform vec3 cameraPosition;
uniform sampler2D uNoiseTex;

uniform vec4 uState;

void main( void ) {

	#include <frag_in>

	float dnv = dot( normalize( vViewNormal ), normalize( -vMVPosition ) );
	vec4 n = texture( uNoiseTex, vUv * 1.0 );
	

	outColor.xyz =  vec3( 1.0, 0.8, 0.4 );
	
	outEmission += ( 1.0 - dnv * 0.7 ) * vec3( 1.0, 0.6, 0.0 ) * 1.9;
	outRoughness *= 0.1;

	if( vUv.y > 1.0 - uState.y ) {
		discard;
	}
	
	#include <frag_out>

} 