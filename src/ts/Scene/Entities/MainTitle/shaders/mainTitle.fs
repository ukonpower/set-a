#include <common>

#include <packing>
#include <frag_h>

uniform sampler2D uTex;
uniform sampler2D uNoiseTex;

void main( void ) {

	#include <frag_in>

	vec4 c = texture( uTex, vUv );
	vec4 n = texture( uNoiseTex, vUv * 2.0 );

	if( c.w < 0.5 ) {

		discard;
		
	}

	if( length( vPos.xy - vec2( -1.0, 5.0) ) < 4.5 ) {

	}
	outRoughness = smoothstep( 0.2, 0.7, n.x ) + 0.02;

	// outNormal += (n.xyz - 0.5) * 0.2;
	// outNormal = normalize( outNormal );

	// outSS += 0.3;

	
	#include <frag_out>

} 