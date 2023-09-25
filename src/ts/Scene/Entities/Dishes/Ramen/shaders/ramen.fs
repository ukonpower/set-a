#include <common>
#include <packing>
#include <light_h>
#include <re>
#include <frag_h>

uniform vec3 cameraPosition;
uniform sampler2D uNoiseTex;

void main( void ) {

	#include <frag_in>

	float dnv = dot( vViewNormal, normalize( -vMVPosition ) );
	vec4 n = texture( uNoiseTex, vUv * 1.0 );
	
	#ifdef SOUP

		//[
		vec3 albedo = vec3( 0.4, 0.08, 0.0 );
		Geometry geo = Geometry(
			vPos,
			normalize( vNormal ),
			0.0,
			normalize( cameraPosition - vPos ),
			vec3( 0.0 )
		);
		Material mat = Material(
			albedo.xyz,
			0.15,
			outMetalic,
			outEmission,
			mix( albedo.xyz, vec3( 0.0, 0.0, 0.0 ), outMetalic ),
			mix( vec3( 1.0, 1.0, 1.0 ), albedo.xyz, outMetalic )
		);
		outColor = vec4( 0.0, 0.0, 0.0, 0.95 );
		//]
		
		#include <light>
		
	#endif

	#ifdef NEGI

		outColor = vec4( 0.1, 0.5, 0.0, 1.0 );

	#endif
	
	#ifdef MENMA

		outColor = mix( vec4( 0.94, 0.5, 0.4, 1.0 ), vec4( 1.0, 0.0,0.0, 1.0 ), abs(vUv.x - 0.5) * 0.5 );
		outRoughness = n.x;

	#endif
	
	outEmission += (1.0 - dnv) * vec3( 1.0, 0.6, 0.0 ) * 0.5;
	outRoughness *= 0.1;
	

	#include <frag_out>

} 