#include <common>
#include <packing>
#include <frag_h>

#include <re>

uniform vec3 cameraPosition;
uniform vec2 uResolution;
uniform float uAspectRatio;


void main( void ) {

	#include <frag_in>

	outColor = vec4( 0.0, 0.0, 0.0, 1.0 );

	#ifdef IS_FORWARD

		vec2 uv = gl_FragCoord.xy / uResolution;

		for( int i = 0; i < 2; i++ ) {

			vec2 v = ( vNormal.xy ) * ( 0.05 + ( float(i) / 4.0 ) * 0.05 );
			v.x *= uAspectRatio;
			outColor.x += texture( uDeferredTexture, uv + v * 1.0 ).x;
			outColor.y += texture( uDeferredTexture, uv + v * 1.5 ).y;
			outColor.z += texture( uDeferredTexture, uv + v * 2.0 ).z;

		}

		outColor.xyz /= 2.0;
		outColor.xyz += fresnel( dot( outNormal, normalize(-vMVPosition) ) ) * 0.4;

	#endif
	
	#include <frag_out>

} 