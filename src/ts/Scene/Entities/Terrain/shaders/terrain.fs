#include <common>
#include <packing>
#include <frag_h>
#include <sdf>
#include <rotate>
#include <noise>

uniform vec3 cameraPosition;
uniform mat4 modelMatrixInverse;

uniform float uTime;

vec2 D( vec3 p ) {

	vec3 pp = p;

	float h = 0.5;
	h -= fbm( p * 0.5 ) * 1.0;

	vec2 d = vec2( sdPlane( pp, vec3( 0.0, 1.0, 0.0), h ), 1.0 );
	
	return d;

}

vec3 N( vec3 pos, float delta ){

    return normalize( vec3(
		D( pos ).x - D( vec3( pos.x - delta, pos.y, pos.z ) ).x,
		D( pos ).x - D( vec3( pos.x, pos.y - delta, pos.z ) ).x,
		D( pos ).x - D( vec3( pos.x, pos.y, pos.z - delta ) ).x
	) );
	
}

void main( void ) {

	#include <frag_in>

	vec3 rayPos = ( modelMatrixInverse * vec4( vPos, 1.0 ) ).xyz;
	vec3 rayDir = normalize( ( modelMatrixInverse * vec4( normalize( vPos - cameraPosition ), 0.0 ) ).xyz );
	vec2 dist = vec2( 0.0 );
	bool hit = false;

	vec3 normal;
	
	for( int i = 0; i < 32; i++ ) { 

		dist = D( rayPos );		
		rayPos += dist.x * rayDir;

		if( dist.x < 0.01 ) {

			normal = N( rayPos, 0.0001 );

			hit = true;
			break;

		}
		
	}

	if( !hit ) discard;

	outNormal = normalize(modelMatrix * vec4( normal, 0.0 )).xyz;
	outPos = ( modelMatrix * vec4( rayPos, 1.0 ) ).xyz;
	outColor = vec4( 0.1, 0.1, 0.1, 1.0 );
	
	#include <frag_out>

} 