#include <common>

#include <packing>
#include <frag_h>

uniform sampler2D uTex;
uniform vec4 uState;


void main( void ) {


	vec4 c = texture( uTex, vUv );

	if( c.w < 0.5 ) {

		discard;
		
	}

	outColor0 = vec4( vec3( 0.5), 1.0 );
	
} 

