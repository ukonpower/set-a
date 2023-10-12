#include <common>
#include <packing>
#include <frag_h>
#include <sdf>
#include <rotate>

#define MARCH 64

uniform vec3 cameraPosition;
uniform mat4 modelMatrixInverse;
uniform vec4 uState;


vec2 D( vec3 p ) {

	float s = smoothstep( 0.5, 1.0, uState.x );

	vec3 pp = p;
	vec2 d = vec2( 99999.0, 0.0 );

	pp.xy *= 1.3;

	d = add( d, vec2( sdSphere( pp, 0.25 * s ), 0.0 ) );

	vec3 ppp = p + vec3( 0.0, 0.0, 0.03 );
	
	d = sub( d, vec2( sdSphere( ppp, 0.14 * s ), 1.0 ) );
	d = add( d, vec2( sdSphere( ppp, 0.14 * s ), 1.0 ) );

	d = max( d, pp.y );

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
		
	} else if( dist.y == 1.0 ) {

		outColor.xyz = vec3( 1.0, 0.5, 0.0 );

	}

	float dnv = dot( -rayDir, normal );
	outEmission += (1.0 - dnv) * vec3( 1.0, 0.6, 0.0 ) * 0.5;
		
	outNormal = normalize(modelMatrix * vec4( normal, 0.0 )).xyz;

	if( !hit ) discard;

	outPos = ( modelMatrix * vec4( rayPos, 1.0 ) ).xyz;

	#include <frag_out>

}