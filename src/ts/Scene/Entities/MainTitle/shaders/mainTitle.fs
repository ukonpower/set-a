#include <common>

#include <packing>
#include <frag_h>

uniform sampler2D uTex;
uniform sampler2D uTexJa;
uniform sampler2D uNoiseTex;
uniform vec4 uState;

void main( void ) {

	#include <frag_in>

	vec4 c = texture( uTex, vUv );
	vec4 cj = texture( uTexJa, vUv );
	vec4 n = texture( uNoiseTex, vUv * 2.0 );

	float alpha = 0.0;

	if( uState.x < 0.5 ) {

		alpha += c.w;
		
	} else {
		
		alpha += cj.w;


	// outColor.xyz *= vec3( 1.0, 0.0, 0.0 ) * uState.x;
	// outEmission += vec3( 1.0, 0.0, 0.0 ) * uState.x;

	}

	if( alpha < 0.5 ) {

		discard;
		
	}


	outRoughness = smoothstep( 0.2, 0.7, n.x ) + 0.02;

	#include <frag_out>

} 