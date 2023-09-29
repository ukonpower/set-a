#include <common>
#include <packing>
#include <frag_h>
#include <sdf>
#include <rotate>

#define MARCH 64

uniform vec3 cameraPosition;
uniform mat4 modelMatrixInverse;

vec2 D( vec3 p ) {

	vec3 pp = p;

	pp.z -= smoothstep( -0.3, 1.1, pp.y ) * 0.3;
	
	vec2 d = vec2( 99999.0, 0.0 );

	vec3 pBox =  pp + vec3( 0.0, -0.2, 0.0 );
	float dBox = sdBox( pBox, vec3( 0.15, 1.0, 0.1 ) );

	vec3 pSph = pp;
	pSph.y += 0.6;
	pSph.y *= 0.76;

	float dSph = sdSphere( pSph, 0.4 );
	float shape = opSmoothUnion( dBox, dSph, 0.2 );

	shape = max( shape, pp.z );

	d = add( d, vec2( shape, 1.0 ) );

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
	
	for( int i = 0; i < MARCH; i++ ) { 

		dist = D( rayPos );		
		rayPos += dist.x * rayDir;

		if( dist.x < 0.001 ) {

			normal = N( rayPos, 0.0001 );
			hit = true;
			break;

		}
		
	}

	if( dist.y == 0.0 ) {
		
		outRoughness = 0.1;
		outMetalic = 0.0;
		outColor.xyz = vec3( 1.0, 1.0, 1.0 );
		
	} 

	float dnv = dot( -rayDir, normal );
	// outEmission += (1.0 - dnv) * vec3( 1.0, 0.6, 0.0 ) * 0.5;
		
	outNormal = normalize(modelMatrix * vec4( normal, 0.0 )).xyz;

	// if( !hit ) discard;

	// outPos = ( modelMatrix * vec4( rayPos, 1.0 ) ).xyz;

	#include <frag_out>

}